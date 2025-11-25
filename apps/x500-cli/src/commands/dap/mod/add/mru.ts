import type { Connection, Context } from "../../../../types.js";
import { DER } from "@wildboar/asn1/functional";
import {
    modifyEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgument,
    _encode_ModifyEntryArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ModifyEntryArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    EntryModification,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import printCode from "../../../../printers/Code.js";
import destringifyDN from "../../../../utils/destringifyDN.js";
import type {
    ModAddMatchingRuleUseArgs,
} from "../../../../yargs/dap_mod_add_mru.js";
import {
    matchingRuleUse,
} from "@wildboar/x500/SchemaAdministration";
import {
    MatchingRuleUseDescription,
} from "@wildboar/x500/SchemaAdministration";
import { ObjectIdentifier } from "@wildboar/asn1";

export
async function do_modify_add_mru (
    ctx: Context,
    conn: Connection,
    argv: ModAddMatchingRuleUseArgs,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const mru = new MatchingRuleUseDescription(
        ObjectIdentifier.fromString(argv.identifier!),
        argv.name?.map((n) => ({
            uTF8String: n,
        })),
        argv.description
            ? {
                uTF8String: argv.description,
            }
            : undefined,
        argv.obsolete,
        argv.attribute.map(ObjectIdentifier.fromString),
    );

    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                matchingRuleUse["&id"],
                [
                    matchingRuleUse.encoderFor["&Type"]!(mru, DER),
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

export default do_modify_add_mru;
