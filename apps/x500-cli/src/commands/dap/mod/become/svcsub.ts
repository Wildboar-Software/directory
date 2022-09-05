import type { Connection, Context } from "../../../../types";
import { ObjectIdentifier, TRUE_BIT } from "asn1-ts";
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
import {
    EntryLimit,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/EntryLimit.ta";
import {
    ImposedSubset,
    ImposedSubset_baseObject,
    ImposedSubset_oneLevel,
    ImposedSubset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/ImposedSubset.ta";
import type {
    Refinement,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";
import type {
    AttributeCombination,
} from "@wildboar/x500/src/lib/modules/ServiceAdministration/AttributeCombination.ta";
import {
    FamilyReturn_memberSelect,
    FamilyReturn_memberSelect_contributingEntriesOnly,
    FamilyReturn_memberSelect_participatingEntriesOnly,
    FamilyReturn_memberSelect_compoundEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn-memberSelect.ta";
import {
    FamilyReturn,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";

function familyGroupingFromString (str: string): FamilyGrouping {
    switch (str.trim().toLowerCase()) {
        case ("entryOnly"): return FamilyGrouping_entryOnly;
        case ("compoundEntry"): return FamilyGrouping_compoundEntry;
        case ("strands"): return FamilyGrouping_strands;
        case ("multiStrand"): return FamilyGrouping_multiStrand;
        default: return FamilyGrouping_entryOnly;
    }
}

function familyReturnFromString (str: string): FamilyReturn_memberSelect {
    switch (str.trim().toLowerCase()) {
        case ("contributing"): return FamilyReturn_memberSelect_contributingEntriesOnly;
        case ("participating"): return FamilyReturn_memberSelect_participatingEntriesOnly;
        case ("compound"): return FamilyReturn_memberSelect_compoundEntry;
        default: return FamilyReturn_memberSelect_contributingEntriesOnly;
    }
}

function subsetFromString (str: string): ImposedSubset | undefined {
    switch (str.trim().toLowerCase()) {
        case ("base"): return ImposedSubset_baseObject;
        case ("one"): return ImposedSubset_oneLevel;
        case ("sub"): return ImposedSubset_wholeSubtree;
        default: return undefined;
    }
}

function attrComboFromRefinement (ref: Refinement): AttributeCombination {
    if ("item" in ref) {
        return {
            attribute: ref.item,
        };
    } else if ("and" in ref) {
        return {
            and: ref.and.map(attrComboFromRefinement),
        };
    } else if ("or" in ref) {
        return {
            or: ref.or.map(attrComboFromRefinement),
        };
    } else if ("not" in ref) {
        return {
            not: attrComboFromRefinement(ref.not),
        };
    } else { // Not understood alternative. Ignored.
        return {
            and: [],
        };
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
        ? attrComboFromRefinement(lexRefinement(argv.attributeCombination).refinement)
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
        attributeCombination,
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
        argv.familyReturn
            ? new FamilyReturn(
                familyReturnFromString(argv.familyReturn),
                argv.familySelect?.map(ObjectIdentifier.fromString),
            )
            : undefined,
        undefined,
        argv.additionalControl?.map(ObjectIdentifier.fromString),
        argv.allowedSubset
            ? (() => {
                const ret = new Uint8ClampedArray(3);
                argv.allowedSubset.forEach((subset) => {
                    const bit = subsetFromString(subset);
                    if (bit === undefined) {
                        return;
                    }
                    ret[bit] = TRUE_BIT;
                });
                return ret;
            })()
            : undefined, // allowedSubset
        argv.imposedSubset
            ? subsetFromString(argv.imposedSubset)
            : undefined,
        argv.entryLimitDefault
            ? new EntryLimit(
                argv.entryLimitDefault,
                argv.entryLimitMax ?? argv.entryLimitDefault,
            )
            : undefined,
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
    ctx.log.info("Done.");
}

export default do_modify_become_svcsub;
