import type { Connection, Context } from "../../types.js";
import { DER } from "@wildboar/asn1/functional";
import {
    modifyDN,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNArgument,
    _encode_ModifyDNArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyDNArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_ModifyDNResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN.js";
import printError from "../../printers/Error_.js";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import stringifyDN from "../../utils/stringifyDN.js";

export
async function do_modifyDN (
    ctx: Context,
    conn: Connection,
    argv: any,
    move: boolean, // If false, its just a rename.
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.src);
    const newObjectName: DistinguishedName = destringifyDN(ctx, argv.dest);
    if (!move && (newObjectName.length !== 1)) {
        ctx.log.error("Malformed new RDN.");
        process.exit(400);
    }
    const newRDN = newObjectName.pop();
    if (!newRDN) {
        ctx.log.error("Root DSE (zero-length distinguished name) may not be a destination.");
        process.exit(403);
    }
    const reqData: ModifyDNArgumentData = new ModifyDNArgumentData(
        objectName,
        newRDN,
        argv.deleteOldRDN,
        move
            ? newObjectName
            : undefined,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    );
    const arg: ModifyDNArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: modifyDN["&operationCode"]!,
        argument: _encode_ModifyDNArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_ModifyDNResult(outcome.result);
    if (!("information" in result)) {
        ctx.log.info("Entry moved.");
        return;
    }
    const info = result.information;
    const data = getOptionallyProtectedValue(info);
    ctx.log.info(`New RDN: ${stringifyDN(ctx, [ data.newRDN ])}`);
    ctx.log.info("Entry moved.");
}

export default do_modifyDN;
