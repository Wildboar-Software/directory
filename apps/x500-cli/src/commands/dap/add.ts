import type { Connection, Context } from "@wildboar/meerkat-types";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    AddEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgumentData.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { DER } from "asn1-ts/dist/node/functional";
import printCode from "../../printers/Code";
import destringifyDN from "../../utils/destringifyDN";

export
async function do_addEntry (
    ctx: Context,
    conn: Connection,
    argv: any,
    attributes: Attribute[],
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const reqData = new AddEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        attributes,
        undefined,
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
    const arg: AddEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"]!,
        argument: _encode_AddEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            ctx.log.error(printCode(outcome.errcode));
        } else {
            ctx.log.error("Uncoded error.");
        }
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    ctx.log.info("Country created.");
}

export default do_addEntry;
