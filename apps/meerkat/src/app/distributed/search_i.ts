import type { Context, Vertex } from "../types";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    HierarchySelections_self,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import { OBJECT_IDENTIFIER, TRUE_BIT, TRUE, ASN1Element } from "asn1-ts";
import readChildren from "../dit/readChildren";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ServiceControlOptions_subentries as subentriesBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type SubstringsMatcher from "@wildboar/x500/src/lib/types/SubstringsMatcher";
import type ApproxMatcher from "@wildboar/x500/src/lib/types/ApproxMatcher";
import type ContextMatcher from "@wildboar/x500/src/lib/types/ContextMatcher";
import getDistinguishedName from "../x500/getDistinguishedName";
import { evaluateFilter, EvaluateFilterSettings } from "@wildboar/x500/src/lib/utils/evaluateFilter";
import { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
    OperationProgress_nameResolutionPhase_proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate,
    ReferenceType_subordinate,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import splitIntoMastersAndShadows from "@wildboar/x500/src/lib/utils/splitIntoMastersAndShadows";
import isPrefix from "../x500/isPrefix";
import searchAliasesProcedure from "./searchAliases";
import hierarchySelectionProcedure from "./hierarchySelection";
import checkSuitabilityProcedure from "./checkSuitability";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_copyShallDo,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    MasterOrShadowAccessPoint_category_master,
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import getAttributeTypesFromFilter from "../x500/getAttributeTypesFromFilter";
import readAttributes from "../database/entry/readAttributes";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import {
    readEntryInformation,
} from "../database/entry/readEntryInformation";

// TODO: This will require serious changes when service specific areas are implemented.

export
interface SearchIReturn {
    chaining: ChainingResults;
    results: EntryInformation[];
}

export
async function search_i (
    ctx: Context,
    target: Vertex,
    admPoints: Vertex[],
    argument: SearchArgument,
    chaining: ChainingArguments,
    SRcontinuationList: ContinuationReference[],
    ret: SearchIReturn,
): Promise<void> {
    const data = getOptionallyProtectedValue(argument);
    const targetDN = getDistinguishedName(target);
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    const searchAliases = data.searchAliases ?? SearchArgumentData._default_value_for_searchAliases;
    const entryOnly = data.entryOnly ?? SearchArgumentData._default_value_for_entryOnly;
    const subentries: boolean = (data.serviceControls?.options?.[subentriesBit] === TRUE_BIT);
    const filter = data.filter ?? SearchArgumentData._default_value_for_filter;
    const serviceControlOptions = data.serviceControls?.options;
    // Service controls
    const dontUseCopy: boolean = (
        serviceControlOptions?.[ServiceControlOptions_dontUseCopy] === TRUE_BIT);
    const copyShallDo: boolean = (
        serviceControlOptions?.[ServiceControlOptions_copyShallDo] === TRUE_BIT);
    const filteredAttributes = filter
        ? getAttributeTypesFromFilter(filter)
        : undefined;
    const infoItems: EntryInformation_information_Item[] = [];
    const eis: EntryInformationSelection | undefined = filteredAttributes
        ? new EntryInformationSelection(
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributes.get(attr.toString());
                        if (!spec) {
                            return true; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage === AttributeUsage_userApplications);
                    }),
            },
            undefined,
            {
                select: filteredAttributes
                    .filter((attr) => {
                        const spec = ctx.attributes.get(attr.toString());
                        if (!spec) {
                            return false; // We assume all unrecognized attributes are user attributes.
                        }
                        return (spec.usage !== AttributeUsage_userApplications);
                    }),
            },
            undefined,
            undefined,
            undefined,
        )
        : undefined;
    const {
        userAttributes,
        operationalAttributes,
    } = await readAttributes(ctx, target, eis);
    const attributes = [
        ...userAttributes,
        ...operationalAttributes,
    ];
    infoItems.push(...attributes.map((attribute): EntryInformation_information_Item => ({
        attribute,
    })));
    const entryInfo = new EntryInformation(
        {
            rdnSequence: targetDN,
        },
        undefined,
        infoItems,
        undefined,
        undefined,
        undefined,
    );
    const filterOptions: EvaluateFilterSettings = {
        getEqualityMatcher: (attributeType: OBJECT_IDENTIFIER): EqualityMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.equalityMatcher;
        },
        getOrderingMatcher: (attributeType: OBJECT_IDENTIFIER): OrderingMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.orderingMatcher;
        },
        getSubstringsMatcher: (attributeType: OBJECT_IDENTIFIER): SubstringsMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.substringsMatcher;
        },
        getApproximateMatcher: (attributeType: OBJECT_IDENTIFIER): ApproxMatcher | undefined => {
            const spec = ctx.attributes.get(attributeType.toString());
            return spec?.approxMatcher;
        },
        getContextMatcher: (contextType: OBJECT_IDENTIFIER): ContextMatcher | undefined => {
            return ctx.contextMatchers.get(contextType.toString());
        },
        isMatchingRuleCompatibleWithAttributeType: (mr: OBJECT_IDENTIFIER, at: OBJECT_IDENTIFIER): boolean => {
            return true; // FIXME:
        },
        isAttributeSubtype: (attributeType: OBJECT_IDENTIFIER, parentType: OBJECT_IDENTIFIER): boolean => {
            return true; // FIXME:
        },
        permittedToMatch: (attributeType: OBJECT_IDENTIFIER, value?: ASN1Element): boolean => {
            return true; // FIXME:
        },
        performExactly: false, // FIXME:
    };

    if (target.dse.cp) {
        if (data.exclusions?.some((x) => isPrefix(ctx, x, targetDN))) {
            return;
        } else {
            const suitable: boolean = checkSuitabilityProcedure(
                ctx,
                target,
                search["&operationCode"]!,
                dontUseCopy,
                copyShallDo,
                chaining.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows,
            );
            if (suitable) {
                if (ret.chaining.alreadySearched) {
                    ret.chaining.alreadySearched.push(targetDN);
                } else {
                    ret.chaining = new ChainingResults(
                        ret.chaining.info,
                        ret.chaining.crossReferences,
                        ret.chaining.securityParameters,
                        [ targetDN ],
                    );
                }
            } else {
                const cr = new ContinuationReference(
                    {
                        rdnSequence: targetDN.slice(0, -1),
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_proceeding,
                        (targetDN.length - 1),
                    ),
                    undefined,
                    ReferenceType_subordinate,
                    (target.dse.cp.supplierKnowledge ?? [])
                        .map((sk) => new AccessPointInformation(
                                sk.ae_title,
                                sk.address,
                                sk.protocolInformation,
                                (typeof sk.supplier_is_master === "boolean")
                                    ? sk.supplier_is_master
                                        ? MasterOrShadowAccessPoint_category_master
                                        : MasterOrShadowAccessPoint_category_shadow
                                    : undefined,
                                undefined,
                                undefined,
                            )),
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                SRcontinuationList.push(cr);
            }
            return;
        }
    }

    if (target.dse.alias && searchAliases) {
        await searchAliasesProcedure(
            ctx,
            target,
            target.dse.alias,
            argument,
            chaining,
        );
        return;
    }
    if (subset === SearchArgumentData_subset_oneLevel) {
        // Nothing needs to be done here. Proceed to step 6.
    } else if ((subset === SearchArgumentData_subset_baseObject) || entryOnly) {
        if (
            (target.dse.subentry && subentries)
            || (!target.dse.subentry && !subentries)
        ) {
            // TODO: Check ACI
            const match = evaluateFilter(filter, entryInfo, filterOptions);
            if (match) {
                const einfo = await readEntryInformation(ctx, target, data.selection);
                ret.results.push(new EntryInformation(
                    {
                        rdnSequence: targetDN,
                    },
                    Boolean(target.dse.shadow),
                    einfo,
                    undefined, // TODO: Will be implemented with authorization
                    undefined, // TODO: Review, but I think this will always be false.
                    undefined, // TODO: Where is a join EVER specified in X.518's procedures?
                ));
            }
            if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                hierarchySelectionProcedure(
                    data.hierarchySelections,
                    data.serviceControls?.serviceType,
                );
            }
            return;
        }
    } else /* if ((subset === SearchArgumentData_subset_wholeSubtree) && !entryOnly) */ { // Condition is implied.
        if (
            (target.dse.subentry && subentries)
            || (!target.dse.subentry && !subentries)
        ) {
            // TODO: Check ACI
            const match = evaluateFilter(filter, entryInfo, filterOptions);
            if (match) {
                const einfo = await readEntryInformation(ctx, target, data.selection);
                ret.results.push(new EntryInformation(
                    {
                        rdnSequence: targetDN,
                    },
                    Boolean(target.dse.shadow),
                    einfo,
                    undefined, // TODO: Will be implemented with authorization
                    undefined, // TODO: Review, but I think this will always be false.
                    undefined, // TODO: Where is a join EVER specified in X.518's procedures?
                ));
            }
            if (data.hierarchySelections && !data.hierarchySelections[HierarchySelections_self]) {
                hierarchySelectionProcedure(
                    data.hierarchySelections,
                    data.serviceControls?.serviceType,
                );
            }
        }
    }

    // Step 6.
    if (target.dse.nssr) {
        // Almost copied entirely from list_i().
        const cr = new ContinuationReference(
            {
                rdnSequence: targetDN,
            },
            undefined,
            new OperationProgress(
                OperationProgress_nameResolutionPhase_completed,
                undefined,
            ),
            undefined,
            ReferenceType_nonSpecificSubordinate,
            target.dse.nssr.nonSpecificKnowledge
                .map((nsk): AccessPointInformation | undefined => {
                    const [ masters, shadows ] = splitIntoMastersAndShadows(nsk);
                    const preferred = shadows[0] ?? masters[0];
                    if (!preferred) {
                        return undefined;
                    }
                    return new AccessPointInformation(
                        preferred.ae_title,
                        preferred.address,
                        preferred.protocolInformation,
                        preferred.category,
                        preferred.chainingRequired,
                        shadows[0]
                            ? [ ...shadows.slice(1), ...masters ]
                            : [ ...shadows, ...masters.slice(1) ],
                    );
                })
                .filter((api): api is AccessPointInformation => !!api),
            undefined,
            undefined,
            undefined,
            undefined,
        );
        SRcontinuationList.push(cr);
    }

    const subordinates = await readChildren(ctx, target);
    for (const subordinate of subordinates) {
        if (subordinate.dse.subr && !subordinate.dse.cp) {
            const cr = new ContinuationReference(
                {
                    // REVIEW: The documentation says use the DN of e, but I am pretty sure they mean e'.
                    // rdnSequence: [ ...targetDN, subordinate.dse.rdn ],
                    rdnSequence: targetDN,
                },
                undefined,
                new OperationProgress(
                    OperationProgress_nameResolutionPhase_completed,
                    undefined,
                ),
                undefined,
                ReferenceType_subordinate,
                ((): AccessPointInformation[] => {
                    const [
                        masters,
                        shadows,
                    ] = splitIntoMastersAndShadows(subordinate.dse.subr.specificKnowledge);
                    const preferred = shadows[0] ?? masters[0];
                    if (!preferred) {
                        return [];
                    }
                    return [
                        new AccessPointInformation(
                            preferred.ae_title,
                            preferred.address,
                            preferred.protocolInformation,
                            preferred.category,
                            preferred.chainingRequired,
                            shadows[0]
                                ? [ ...shadows.slice(1), ...masters ]
                                : [ ...shadows, ...masters.slice(1) ],
                        ),
                    ];
                })(),
                undefined,
                undefined,
                undefined,
                undefined,
            );
            SRcontinuationList.push(cr);
        }

        const newArgument: SearchArgument = (subset !== SearchArgumentData_subset_oneLevel)
            ? argument
            : {
                unsigned: new SearchArgumentData(
                    data.baseObject,
                    data.subset,
                    data.filter,
                    data.searchAliases,
                    data.selection,
                    data.pagedResults,
                    data.matchedValuesOnly,
                    data.extendedFilter,
                    data.checkOverspecified,
                    data.relaxation,
                    data.extendedArea,
                    data.hierarchySelections,
                    data.searchControlOptions,
                    data.joinArguments,
                    data.joinType,
                    data._unrecognizedExtensionsList,
                    data.serviceControls,
                    data.securityParameters,
                    data.requestor,
                    data.operationProgress,
                    data.aliasedRDNs,
                    data.criticalExtensions,
                    data.referenceType,
                    TRUE, // data.entryOnly,
                    data.exclusions,
                    data.nameResolveOnMaster,
                    data.operationContexts,
                    data.familyGrouping,
                ),
            };
        await search_i(
            ctx,
            subordinate,
            admPoints, // TODO: Are you sure you can always pass in the same admPoints?
            newArgument,
            chaining,
            SRcontinuationList,
            ret,
        );
    }
}

export default search_i;
