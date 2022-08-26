import type { Context, Connection } from "./types";
import connect from "./connect";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
async function createConnection (
    ctx: Context,
    accessPointURL: string,
    bindDN: DistinguishedName,
    password?: string,
): Promise<Connection> {
    try {
        const connection = await connect(
            accessPointURL,
            bindDN,
            password
                ? Buffer.from(password, "utf-8")
                : undefined,
        );
        if (!connection) {
            ctx.log.warn(`Could not create connection to this access point: ${accessPointURL}.`);
            process.exit(7);
        }
        ctx.log.debug("Connected.");
        return connection;
    } catch (e) {
        if (e instanceof IdmBindError) {
            ctx.log.error("Authentication error.");
            process.exit(3);
        } else {
            console.log(e);
            ctx.log.warn(`Could not create connection to this access point: ${accessPointURL}. ${e}`);
            process.exit(13);
        }
    }
}

export default createConnection;
