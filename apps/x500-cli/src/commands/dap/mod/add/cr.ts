import type { Connection, Context } from "../../../../types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    modifyEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgumentData.ta";
import type {
    EntryModification,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryModification.ta";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import type {
    ModAddContentRuleArgs,
} from "../../../../yargs/dap_mod_add_cr";
import {
    dITContentRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import {
    DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import { ObjectIdentifier } from "asn1-ts";

export
async function do_modify_add_cr (
    ctx: Context,
    conn: Connection,
    argv: ModAddContentRuleArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const cr = new DITContentRuleDescription(
        ObjectIdentifier.fromString(argv.structuralObjectClass!),
        argv.auxiliaries?.map(ObjectIdentifier.fromString),
        argv.mandatory?.map(ObjectIdentifier.fromString),
        argv.optional?.map(ObjectIdentifier.fromString),
        argv.precluded?.map(ObjectIdentifier.fromString),
    );

    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                dITContentRules["&id"],
                [
                    dITContentRules.encoderFor["&Type"]!(cr, DER),
                ],
                undefined,
            ),
        },
    ];
    const reqData: ModifyEntryArgumentData = new ModifyEntryArgumentData(
        {
            rdnSequence: objectName,
        },
        modifications,
        undefined,
        [],
    );
    const arg: ModifyEntryArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: modifyEntry["&operationCode"]!,
        argument: _encode_ModifyEntryArgument(arg, DER),
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
}

export default do_modify_add_cr;
