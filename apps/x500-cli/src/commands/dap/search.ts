import type { Connection, Context } from "../../types.js";
import { BIT_STRING, ObjectIdentifier, TRUE_BIT } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    search,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchResult,
    _decode_SearchResult,
} from "@wildboar/x500/DirectoryAbstractService";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import destringifyDN from "../../utils/destringifyDN.js";
import printError from "../../printers/Error_.js";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchControlOptions_searchAliases,
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_checkOverspecified,
    SearchControlOptions_performExactly,
    SearchControlOptions_includeAllAreas,
    SearchControlOptions_noSystemRelaxation,
    SearchControlOptions_dnAttribute,
    SearchControlOptions_matchOnResidualName,
    SearchControlOptions_entryCount,
    SearchControlOptions_useSubset,
    SearchControlOptions_separateFamilyMembers,
    SearchControlOptions_searchFamily,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    PagedResultsRequest,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    PagedResultsRequest_newRequest, SortKey,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    HierarchySelections,
    HierarchySelections_self,
    HierarchySelections_children,
    HierarchySelections_parent,
    HierarchySelections_hierarchy,
    HierarchySelections_top,
    HierarchySelections_subtree,
    HierarchySelections_siblings,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_all,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControlOptions,
    ServiceControlOptions_preferChaining,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_localScope,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_subentries,
    ServiceControlOptions_copyShallDo,
    ServiceControlOptions_partialNameResolution,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeMatch,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_allowWriteableCopy,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyGrouping,
    FamilyGrouping_entryOnly,
    FamilyGrouping_strands,
    FamilyGrouping_multiStrand,
    FamilyGrouping_compoundEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ErrorProtectionRequest_signed,
    SecurityParameters,
} from "@wildboar/x500/DirectoryAbstractService";
import { print as printSearchResult } from "../../printers/SearchResult.js";

function subsetFromString (str: string): SearchArgumentData_subset {
    const str_ = str.toLowerCase();
    if (str_.indexOf("base") > -1) {
        return SearchArgumentData_subset_baseObject;
    } else if ((str_.indexOf("one") > -1) || (str_.indexOf("level") > -1)) {
        return SearchArgumentData_subset_oneLevel;
    } else if ((str_.indexOf("tree") > -1) || (str_.indexOf("sub") > -1)) {
        return SearchArgumentData_subset_wholeSubtree;
    } else {
        return SearchArgumentData_subset_baseObject; // Default to the least expensive query.
    }
}

function priorityFromString (str: string): ServiceControls["priority"] {
    switch (str.trim().toLowerCase()) {
        case ("low"): return ServiceControls_priority_low;
        case ("medium"): return ServiceControls_priority_medium;
        case ("high"): return ServiceControls_priority_high;
        default: return ServiceControls_priority_medium;
    }
}

function scopeOfReferralFromString (str: string): ServiceControls["scopeOfReferral"] {
    switch (str.trim().toLowerCase()) {
        case ("dmd"): return ServiceControls_scopeOfReferral_dmd;
        case ("country"): return ServiceControls_scopeOfReferral_country;
        default: return undefined;
    }
}

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
async function search_new (
    ctx: Context,
    conn: Connection,
    argv: any,
): Promise<void> {
    const objectName: DistinguishedName = destringifyDN(ctx, argv.object);
    const eis = new EntryInformationSelection(
            argv.userAttribute
                ? {
                    select: argv.userAttribute.map(ObjectIdentifier.fromString),
                }
                : undefined,
            argv.typesOnly,
            argv.extraAttribute
                ? {
                    select: argv.extraAttribute.map(ObjectIdentifier.fromString),
                }
                : undefined,
            argv.allContexts
                ? {
                    allContexts: null,
                }
                : undefined,
            argv.returnContexts,
        );
    const prr: PagedResultsRequest | undefined = argv.pageSize
        ? {
            newRequest: new PagedResultsRequest_newRequest(
                argv.pageSize,
                argv.sortKey?.map((sk: string) => {
                    const [ attrType, matchingRule ] = sk.split(":");
                    const spec = ctx.attributes.get(attrType.toLowerCase());
                    // TODO: Support the matching rule name.
                    return new SortKey(
                        spec?.id ?? ObjectIdentifier.fromString(attrType),
                        matchingRule
                            ? ObjectIdentifier.fromString(matchingRule)
                            : undefined,
                    );
                }),
                argv.reverse,
                argv.unmerged,
                argv.pageNumber,
            ),
        }
        : undefined;
    const hierarchySelections: HierarchySelections | undefined = argv.hierarchySelections
        ? (() => {
            const ret = new Uint8ClampedArray(10);
            for (const h of argv.hierarchySelections as string[]) {
                const bit: number = ({
                    "self": HierarchySelections_self,
                    "children": HierarchySelections_children,
                    "parent": HierarchySelections_parent,
                    "hierarchy": HierarchySelections_hierarchy,
                    "top": HierarchySelections_top,
                    "subtree": HierarchySelections_subtree,
                    "siblings": HierarchySelections_siblings,
                    "siblingChildren": HierarchySelections_siblingChildren,
                    "siblingSubtree": HierarchySelections_siblingSubtree,
                    "all": HierarchySelections_all,
                }[h]) ?? HierarchySelections_self;
                ret[bit] = TRUE_BIT;
            }
            return ret;
        })()
        : undefined;
    const searchOptions: BIT_STRING = new Uint8ClampedArray(12);
    if (argv.searchAliases) {
        searchOptions[SearchControlOptions_searchAliases] = TRUE_BIT;
    }
    if (argv.matchedValuesOnly) {
        searchOptions[SearchControlOptions_matchedValuesOnly] = TRUE_BIT;
    }
    if (argv.checkOverspecified) {
        searchOptions[SearchControlOptions_checkOverspecified] = TRUE_BIT;
    }
    if (argv.performExactly) {
        searchOptions[SearchControlOptions_performExactly] = TRUE_BIT;
    }
    if (argv.includeAllAreas) {
        searchOptions[SearchControlOptions_includeAllAreas] = TRUE_BIT;
    }
    if (argv.noSystemRelaxation) {
        searchOptions[SearchControlOptions_noSystemRelaxation] = TRUE_BIT;
    }
    if (argv.dnAttribute) {
        searchOptions[SearchControlOptions_dnAttribute] = TRUE_BIT;
    }
    if (argv.matchOnResidualName) {
        searchOptions[SearchControlOptions_matchOnResidualName] = TRUE_BIT;
    }
    if (argv.entryCount) {
        searchOptions[SearchControlOptions_entryCount] = TRUE_BIT;
    }
    if (argv.useSubset) {
        searchOptions[SearchControlOptions_useSubset] = TRUE_BIT;
    }
    if (argv.separateFamilyMembers) {
        searchOptions[SearchControlOptions_separateFamilyMembers] = TRUE_BIT;
    }
    if (argv.searchFamily) {
        searchOptions[SearchControlOptions_searchFamily] = TRUE_BIT;
    }
    const serviceControlOptions: ServiceControlOptions = new Uint8ClampedArray(15);
    if (argv.preferChaining) {
        serviceControlOptions[ServiceControlOptions_preferChaining] = TRUE_BIT;
    }
    if (argv.chainingProhibited) {
        serviceControlOptions[ServiceControlOptions_chainingProhibited] = TRUE_BIT;
    }
    if (argv.localScope) {
        serviceControlOptions[ServiceControlOptions_localScope] = TRUE_BIT;
    }
    if (argv.dontUseCopy) {
        serviceControlOptions[ServiceControlOptions_dontUseCopy] = TRUE_BIT;
    }
    if (argv.dontDereferenceAliases) {
        serviceControlOptions[ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
    }
    if (argv.subentries) {
        serviceControlOptions[ServiceControlOptions_subentries] = TRUE_BIT;
    }
    if (argv.copyShallDo) {
        serviceControlOptions[ServiceControlOptions_copyShallDo] = TRUE_BIT;
    }
    if (argv.partialNameResolution) {
        serviceControlOptions[ServiceControlOptions_partialNameResolution] = TRUE_BIT;
    }
    if (argv.manageDSAIT) {
        serviceControlOptions[ServiceControlOptions_manageDSAIT] = TRUE_BIT;
    }
    if (argv.noSubtypeMatch) {
        serviceControlOptions[ServiceControlOptions_noSubtypeMatch] = TRUE_BIT;
    }
    if (argv.noSubtypeSelection) {
        serviceControlOptions[ServiceControlOptions_noSubtypeSelection] = TRUE_BIT;
    }
    if (argv.countFamily) {
        serviceControlOptions[ServiceControlOptions_countFamily] = TRUE_BIT;
    }
    if (argv.dontSelectFriends) {
        serviceControlOptions[ServiceControlOptions_dontSelectFriends] = TRUE_BIT;
    }
    if (argv.dontMatchFriends) {
        serviceControlOptions[ServiceControlOptions_dontMatchFriends] = TRUE_BIT;
    }
    if (argv.allowWriteableCopy) {
        serviceControlOptions[ServiceControlOptions_allowWriteableCopy] = TRUE_BIT;
    }
    const serviceControls = new ServiceControls(
        serviceControlOptions,
        argv.priority
            ? priorityFromString(argv.priority)
            : undefined,
        argv.timeLimit,
        argv.sizeLimit,
        argv.scopeOfReferral
            ? scopeOfReferralFromString(argv.scopeOfReferral)
            : undefined,
        argv.attributeSizeLimit,
        undefined, // TODO:
        argv.serviceType
            ? ObjectIdentifier.fromString(argv.serviceType)
            : undefined,
        argv.userClass,
    );
    const reqData: SearchArgumentData = new SearchArgumentData(
        {
            rdnSequence: objectName,
        },
        subsetFromString(argv.subset),
        undefined, // This will be implemented as an LDAP filter eventually.
        undefined,
        eis,
        prr,
        undefined,
        undefined,
        argv.checkOverspecified,
        undefined,
        argv.extendedArea,
        hierarchySelections,
        searchOptions,
        undefined, // Joins unsupported.
        undefined, // Joins unsupported.
        [],
        serviceControls,
        new SecurityParameters(
            undefined,
            undefined,
            undefined,
            undefined,
            argv.pageSize
                ? undefined
                : ProtectionRequest_signed,
            undefined,
            argv.pageSize
                ? undefined
                : ErrorProtectionRequest_signed,
            undefined,
        ), // FIXME: security parameters
        undefined,
        undefined,
        undefined, // FIXME: Fill in criticalExtensions
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        argv.familyGrouping
            ? familyGroupingFromString(argv.familyGrouping)
            : undefined,
    );
    const arg: SearchArgument = {
        unsigned: reqData,
    };
    const outcome = await conn.writeOperation({
        opCode: search["&operationCode"]!,
        argument: _encode_SearchArgument(arg, DER),
    });
    if ("error" in outcome) {
        printError(ctx, outcome);
        return;
    }
    if (!outcome.result) {
        ctx.log.error("Invalid server response: no result data.");
        return;
    }
    const result: SearchResult = _decode_SearchResult(outcome.result);
    console.log(printSearchResult(ctx, result));
    // const resData = getOptionallyProtectedValue(result);
    // if ("signed" in result) {
    //     ctx.log.info("This response was signed.");
    // }
    // if ("searchInfo" in resData) {
    //     resData.searchInfo.entries.forEach((e) => {
    //         console.log(printEntryInformation(ctx, e) + EOL);
    //     });
    //     ctx.log.info("End of search.");
    // } else if ("uncorrelatedSearchInfo" in resData) {
    //     ctx.log.warn("Uncorrelated info.");
    //     for (const entry of iterateOverSearchResults(result)) {
    //         console.log(printEntryInformation(ctx, entry) + EOL);
    //     }
    // } else {
    //     ctx.log.warn("Unrecognized result set format.");
    // }
}

export default search_new;
