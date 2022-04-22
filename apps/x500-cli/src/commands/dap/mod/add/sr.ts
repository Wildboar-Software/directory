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
    ModAddStructureRuleArgs,
} from "../../../../yargs/dap_mod_add_sr";
import {
    dITStructureRules,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import {
    DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import { ObjectIdentifier } from "asn1-ts";

export
async function do_modify_add_sr (
    ctx: Context,
    conn: Connection,
    argv: ModAddStructureRuleArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const sr = new DITStructureRuleDescription(
        argv.ruleid!,
        ObjectIdentifier.fromString(argv.nameform!),
        argv.superiorStructureRule,
        argv.name?.map((n) => ({
            uTF8String: n,
        })),
        argv.description
            ? {
                uTF8String: argv.description,
            }
            : undefined,
        argv.obsolete,
    );

    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                dITStructureRules["&id"],
                [
                    dITStructureRules.encoderFor["&Type"]!(sr, DER),
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

export default do_modify_add_sr;
