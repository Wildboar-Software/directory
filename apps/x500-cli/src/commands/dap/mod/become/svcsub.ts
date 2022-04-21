import type { Connection, Context } from "../../../../types";
import { ObjectIdentifier } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
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
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import printCode from "../../../../printers/Code";
import destringifyDN from "../../../../utils/destringifyDN";
import {
    serviceAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import type {
    BecomeServiceSubentryArgs,
} from "../../../../yargs/dap_mod_become_svcsub";
import {
    SearchRuleDescription,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SearchRuleDescription.ta";
import {
    RequestAttribute,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/RequestAttribute.ta";
import {
    ResultAttribute,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/ResultAttribute.ta";
import { lexRefinement } from "../../../../parsers/parseRefinement";
import {
    FamilyGrouping,
    FamilyGrouping_entryOnly,
    FamilyGrouping_strands,
    FamilyGrouping_multiStrand,
    FamilyGrouping_compoundEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";
import {
    searchRules,
} from "@wildboar/x500/src/lib/modules/InformationFramework/searchRules.oa";

function familyGroupingFromString (str: string): FamilyGrouping {
    switch (str.trim().toLowerCase()) {
        case ("entryOnly"): return FamilyGrouping_entryOnly;
        case ("compoundEntry"): return FamilyGrouping_compoundEntry;
        case ("strands"): return FamilyGrouping_strands;
        case ("multiStrand"): return FamilyGrouping_multiStrand;
        default: return FamilyGrouping_entryOnly;
    }
}

export
async function do_modify_become_svcsub (
    ctx: Context,
    conn: Connection,
    argv: BecomeServiceSubentryArgs & Record<string, any>,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object!);
    const attributeCombination = argv.attributeCombination
        ? lexRefinement(argv.attributeCombination).refinement
        : undefined;
    const sr = new SearchRuleDescription(
        argv.id!,
        ObjectIdentifier.fromString(argv.dmdId!),
        argv.serviceType
            ? ObjectIdentifier.fromString(argv.serviceType)
            : undefined,
        argv.userClass,
        argv.requestAttribute?.map((attr) => new RequestAttribute(
            ObjectIdentifier.fromString(attr),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
        )),
        undefined, // attributeCombination, // FIXME:
        argv.resultAttribute?.map((attr) => new ResultAttribute(
            ObjectIdentifier.fromString(attr),
            undefined,
            undefined,
        )),
        undefined,
        undefined,
        undefined,
        argv.familyGrouping
            ? familyGroupingFromString(argv.familyGrouping)
            : undefined,
        undefined, // TODO: familyReturn
        undefined,
        argv.additionalControl?.map(ObjectIdentifier.fromString),
        undefined,
        undefined,
        undefined,
        argv.name
            ? [
                {
                    uTF8String: argv.name
                }
            ]
            : undefined,
        argv.description
            ? {
                uTF8String: argv.description,
            }
            : undefined,
    );
    const modifications: EntryModification[] = [
        {
            addValues: new Attribute(
                objectClass["&id"],
                [
                    _encodeObjectIdentifier(serviceAdminSubentry["&id"], DER)
                ],
                undefined,
            ),
        },
        {
            addAttribute: new Attribute(
                searchRules["&id"],
                [
                    searchRules.encoderFor["&Type"]!(sr, DER),
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

export default do_modify_become_svcsub;
