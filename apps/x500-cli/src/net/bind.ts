import type { Context, Connection } from "../types";
import * as fs from "fs";
import * as readline from "readline";
import MutableWriteable from "../utils/MutableWriteable";
import connect from "./connect";

const mutedOut = new MutableWriteable();

export
async function createConnection (
    ctx: Context,
    argv: Record<string, any>,
): Promise<Connection> {
    let password: Buffer | undefined;
    if (argv.password) {
        password = Buffer.from(argv.password as string);
    } else if (argv.passwordFile) {
        password = fs.readFileSync(argv.passwordFile as string);
    } else if (argv.promptPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        rl.question("Password: ", (answer: string): void => {
            password = Buffer.from(answer, "utf-8");
            rl.close();
        });
        mutedOut.muted = true;
    }
    if (!argv.accessPoint) {
        ctx.log.warn("hostURL not set. Defaulting to idm://localhost:102.");
    }
    const hostURL = argv.accessPoint ?? "idm://localhost:102";
    const bindDN = argv.bindDN ?? "";
    const connection = await connect(ctx, hostURL as string, bindDN as string, password);
    if (!connection) {
        ctx.log.error("Could not create connection.");
        process.exit(1);
    }
    ctx.log.info("Connected.");
    return connection;
}

export default createConnection;
