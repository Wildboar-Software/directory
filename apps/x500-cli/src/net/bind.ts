import type { Context, Connection } from "@wildboar/meerkat-types";
import * as fs from "fs";
import * as readline from "readline";
import MutableWriteable from "../utils/MutableWriteable";
import connect from "./connect";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";

const mutedOut = new MutableWriteable();

export
async function createConnection (
    ctx: Context,
    argv: Record<string, any>,
): Promise<Connection> {
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
    if (!argv.accessPoint) {
        ctx.log.warn("hostURL not set. Defaulting to idm://localhost:102.");
    }
    const hostURL = argv.accessPoint ?? "idm://localhost:102";
    const bindDN = argv.bindDN ?? "";
    try {
        const connection = await connect(ctx, hostURL as string, bindDN as string, password);
        if (!connection) {
            ctx.log.error("Could not create connection.");
            process.exit(1);
        }
        ctx.log.info("Connected.");
        return connection;
    } catch (e) {
        if (e instanceof IdmBindError) {
            ctx.log.error("Authentication error.");
            process.exit(1);
        } else {
            ctx.log.error("Could not create connection.");
            process.exit(1);
        }
    }
}

export default createConnection;
