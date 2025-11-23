import type { Connection, Context } from "../../types";
import { DER } from "@wildboar/asn1/functional";
import {
    removeEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryArgument,
    _encode_RemoveEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    RemoveEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    _decode_RemoveEntryResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN";
import printError from "../../printers/Error_";
import { getOptionallyProtectedValue } from "@wildboar/x500";

export
async function do_removeEntry (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData: RemoveEntryArgumentData = new RemoveEntryArgumentData(
        {
            rdnSequence: objectName,
        },
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
    const arg: RemoveEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: removeEntry["&operationCode"]!,
        argument: _encode_RemoveEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result = _decode_RemoveEntryResult(outcome.result);
    if (!("information" in result)) {
        ctx.log.info("Entry removed.");
        return;
    }
    const info = result.information;
    const data = getOptionallyProtectedValue(info);
    if (data.aliasDereferenced) {
        ctx.log.info("Alias dereferenced.");
    }
    ctx.log.info("Entry removed.");
}

export default do_removeEntry;
