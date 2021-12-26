import type { Context, Connection } from "../types";
import * as fs from "fs";
import * as readline from "readline";
import MutableWriteable from "../utils/MutableWriteable";
import connect from "./connect";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";
import type {
    ConfigDSA,
    ConfigContext,
    ConfigAccessPoint,
} from "@wildboar/x500-cli-config";

const mutedOut = new MutableWriteable();

export
async function createConnection (
    ctx: Context,
    argv: Record<string, any>,
): Promise<Connection> {
    const currentContext: ConfigContext | undefined = ctx.config?.contexts
        .find((c) => c.name === ctx.config?.["current-context"]);
    const dsa: ConfigDSA | undefined = ctx.config?.dsas.find((d) => d.name === currentContext?.context?.dsa);
    // const credentials = ctx.config?.credentials.find((c) => c.name === currentContext?.context?.credential);

    let password: Buffer | undefined;
    if (argv.password !== undefined) {
        password = Buffer.from(argv.password as string);
    } else if (argv.passwordFile?.length) {
        password = fs.readFileSync(argv.passwordFile as string);
    } else if (argv.promptPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        await new Promise<void>((resolve) => {
            rl.question("New Password: ", (answer: string): void => {
                password = Buffer.from(answer, "utf-8");
                rl.close();
                resolve();
            });
        });
        mutedOut.muted = true;
    }

    const accessPoints: ConfigAccessPoint[] = (typeof argv.accessPoint === "string")
    ? [
        {
            url: argv.accessPoint,
        },
    ]
    : dsa?.accessPoints ?? [];

    if (accessPoints.length === 0) {
        ctx.log.error("No access points defined. Please either use the --accessPoint argument or add access points in your directory configuration file.");
    }

    for (const accessPoint of accessPoints) {
        const bindDN = argv.bindDN ?? "";
        try {
            const connection = await connect(ctx, accessPoint.url, bindDN, password);
            if (!connection) {
                ctx.log.warn(`Could not create connection to this access point: ${accessPoint.url}.`);
                continue;
            }
            ctx.log.debug("Connected.");
            return connection;
        } catch (e) {
            if (e instanceof IdmBindError) {
                ctx.log.error("Authentication error.");
                process.exit(3);
            } else {
                ctx.log.warn(`Could not create connection to this access point: ${accessPoint.url}.`);
                continue;
            }
        }
    }

    if (dsa?.name) {
        ctx.log.error(`No connection could be established to DSA ${dsa.name}.`);
    } else {
        ctx.log.error("No connection could be established to the DSA.");
    }
    process.exit(4);
}

export default createConnection;
