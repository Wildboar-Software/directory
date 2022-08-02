import type { Connection, Context } from "../../types";
import { BIT_STRING, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    search,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import {
    SearchArgument,
    _encode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    SearchResult,
    _decode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import destringifyDN from "../../utils/destringifyDN";
import printError from "../../printers/Error_";
import printEntryInformation from "../../printers/EntryInformation";
import {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
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
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import {
    PagedResultsRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest.ta";
import {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import * as hs from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import * as sco from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    ServiceControls_priority_low,
    ServiceControls_priority_medium,
    ServiceControls_priority_high,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-priority.ta";
import {
    ServiceControls_scopeOfReferral_country,
    ServiceControls_scopeOfReferral_dmd,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls-scopeOfReferral.ta";
import {
    FamilyGrouping,
    FamilyGrouping_entryOnly,
    FamilyGrouping_strands,
    FamilyGrouping_multiStrand,
    FamilyGrouping_compoundEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityParameters.ta";

function subsetFromString (str: string): SearchArgumentData_subset {
    const str_ = str.toLowerCase();
    if (str_.indexOf("base") > -1) {
        return SearchArgumentData_subset_baseObject;
    } else if (str_.indexOf("one") > -1) {
        return SearchArgumentData_subset_oneLevel;
    } else if (str_.indexOf("tree") > -1) {
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
    const bindDN = destringifyDN(ctx, argv.bindDN ?? "");
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
                argv.sortKey
                    ? argv.sortKey.map(ObjectIdentifier.fromString)
                    : undefined,
                argv.reverse,
                argv.unmerged,
                argv.pageNumber,
            ),
        }
        : undefined;
    const hierarchySelections: hs.HierarchySelections | undefined = argv.hierarchySelections
        ? (() => {
            const ret = new Uint8ClampedArray(10);
            for (const h of argv.hierarchySelections as string[]) {
                const bit: number = ({
                    "self": hs.HierarchySelections_self,
                    "children": hs.HierarchySelections_children,
                    "parent": hs.HierarchySelections_parent,
                    "hierarchy": hs.HierarchySelections_hierarchy,
                    "top": hs.HierarchySelections_top,
                    "subtree": hs.HierarchySelections_subtree,
                    "siblings": hs.HierarchySelections_siblings,
                    "siblingChildren": hs.HierarchySelections_siblingChildren,
                    "siblingSubtree": hs.HierarchySelections_siblingSubtree,
                    "all": hs.HierarchySelections_all,
                }[h]) ?? hs.HierarchySelections_self;
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
    const serviceControlOptions: sco.ServiceControlOptions = new Uint8ClampedArray(15);
    if (argv.preferChaining) {
        serviceControlOptions[sco.ServiceControlOptions_preferChaining] = TRUE_BIT;
    }
    if (argv.chainingProhibited) {
        serviceControlOptions[sco.ServiceControlOptions_chainingProhibited] = TRUE_BIT;
    }
    if (argv.localScope) {
        serviceControlOptions[sco.ServiceControlOptions_localScope] = TRUE_BIT;
    }
    if (argv.dontUseCopy) {
        serviceControlOptions[sco.ServiceControlOptions_dontUseCopy] = TRUE_BIT;
    }
    if (argv.dontDereferenceAliases) {
        serviceControlOptions[sco.ServiceControlOptions_dontDereferenceAliases] = TRUE_BIT;
    }
    if (argv.subentries) {
        serviceControlOptions[sco.ServiceControlOptions_subentries] = TRUE_BIT;
    }
    if (argv.copyShallDo) {
        serviceControlOptions[sco.ServiceControlOptions_copyShallDo] = TRUE_BIT;
    }
    if (argv.partialNameResolution) {
        serviceControlOptions[sco.ServiceControlOptions_partialNameResolution] = TRUE_BIT;
    }
    if (argv.manageDSAIT) {
        serviceControlOptions[sco.ServiceControlOptions_manageDSAIT] = TRUE_BIT;
    }
    if (argv.noSubtypeMatch) {
        serviceControlOptions[sco.ServiceControlOptions_noSubtypeMatch] = TRUE_BIT;
    }
    if (argv.noSubtypeSelection) {
        serviceControlOptions[sco.ServiceControlOptions_noSubtypeSelection] = TRUE_BIT;
    }
    if (argv.countFamily) {
        serviceControlOptions[sco.ServiceControlOptions_countFamily] = TRUE_BIT;
    }
    if (argv.dontSelectFriends) {
        serviceControlOptions[sco.ServiceControlOptions_dontSelectFriends] = TRUE_BIT;
    }
    if (argv.dontMatchFriends) {
        serviceControlOptions[sco.ServiceControlOptions_dontMatchFriends] = TRUE_BIT;
    }
    if (argv.allowWriteableCopy) {
        serviceControlOptions[sco.ServiceControlOptions_allowWriteableCopy] = TRUE_BIT;
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
        undefined, // FIXME:
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
            ProtectionRequest_signed,
            undefined,
            undefined,
            undefined,
        ), // FIXME: security parameters
        bindDN,
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
    const resData = getOptionallyProtectedValue(result);
    if ("signed" in result) {
        ctx.log.info("This response was signed.");
    }
    if ("searchInfo" in resData) {
        resData.searchInfo.entries.forEach((e) => {
            printEntryInformation(ctx, e);
            console.log();
        });
        ctx.log.info("End of search.");
    } else if ("uncorrelatedSearchInfo" in resData) {
        ctx.log.warn("Uncorrelated info."); // FIXME:
    } else {
        ctx.log.warn("Unrecognized result set format.");
    }
}

export default search_new;
