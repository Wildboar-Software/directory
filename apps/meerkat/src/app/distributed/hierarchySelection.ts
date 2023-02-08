import type { Vertex, ClientAssociation, Context } from "@wildboar/meerkat-types";
import { OperationDispatcher } from "./OperationDispatcher";
import { ASN1Construction, BERElement, FALSE, FALSE_BIT, TRUE, TRUE_BIT } from "asn1-ts";
import {
    SecurityParameters,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    HierarchySelections,
    HierarchySelections_all,
    HierarchySelections_children,
    HierarchySelections_hierarchy,
    HierarchySelections_parent,
    HierarchySelections_siblingChildren,
    HierarchySelections_siblingSubtree,
    HierarchySelections_siblings,
    HierarchySelections_self,
    HierarchySelections_subtree,
    HierarchySelections_top,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/HierarchySelections.ta";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    ChainingArguments, OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { SearchArgumentData_subset_baseObject } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import { SearchState } from "./search_i";
import { EntryInformation } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation.ta";
import { strict as assert } from "node:assert";
import {
    RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { MeerkatContext } from "../ctx";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";
import type { DistinguishedValue } from "@prisma/client";
import { OperationProgress_nameResolutionPhase_notStarted } from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import { TraceItem } from "@wildboar/x500/src/lib/modules/DistributedOperations/TraceItem.ta";
import {
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_localScope,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControls,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import {
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_searchAliases,
    SearchControlOptions_separateFamilyMembers,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchControlOptions.ta";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID";
import { addSeconds } from "date-fns";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/LimitProblem.ta";

function atavFromDB (atav: DistinguishedValue): AttributeTypeAndValue {
    const type_el = new BERElement();
    const value_el = new BERElement();
    type_el.value = atav.type_oid;
    value_el.tagClass = atav.tag_class;
    value_el.construction = atav.constructed
        ? ASN1Construction.constructed
        : ASN1Construction.primitive;
    value_el.tagNumber = atav.tag_number;
    value_el.value = atav.content_octets;
    return new AttributeTypeAndValue(
        type_el.objectIdentifier,
        value_el,
    );
}

async function id_to_dn (
    ctx: Context,
    id: number,
    rdnsById: Map<number, [number | null, RelativeDistinguishedName]>,
): Promise<DistinguishedName | null> {
    let current_id: number | null = id;
    const dn: DistinguishedName = [];
    while (current_id) {
        const cached = rdnsById.get(current_id);
        if (cached) {
            const [ superior_id, rdn ] = cached;
            dn.push(rdn);
            assert(current_id !== superior_id);
            current_id = superior_id;
            continue;
        }
        const entry = await ctx.db.entry.findUnique({
            where: {
                id: current_id,
            },
            select: {
                immediate_superior_id: true,
                RDN: true,

            },
        });
        if (!entry) {
            return null;
        }
        if (!entry.immediate_superior_id) {
            return dn.reverse();
        }
        const rdn = entry.RDN.map(atavFromDB);
        dn.push(rdn);
        rdnsById.set(current_id, [entry.immediate_superior_id, rdn])
        assert(current_id !== entry.immediate_superior_id);
        current_id = entry.immediate_superior_id;
    }
    return dn.reverse();
}

/**
 * @summary The Hierarchy Selection Procedure as defined in ITU Recommendation X.518.
 * @description
 *
 * The Hierarchy Selection Procedure (I) as defined in ITU Recommendation X.518
 * (2016), Section 19.3.2.2.10.
 *
 * @param ctx The context object
 * @param hierarchySelections The hierarchy selections
 * @param serviceControls_serviceType The service type
 *
 * @function
 */
export
async function hierarchySelectionProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    selfVertex: Vertex,
    selfEntryInfos: [id: number, info: EntryInformation][],
    searchArgument: SearchArgumentData,
    searchState: SearchState,
    hierarchySelections: HierarchySelections,
    deadline: Date | undefined,
): Promise<void> {
    // TODO: This used to be an assert(). If it failed, NodeJS would hang indefinitely. Investigate.
    if (!selfVertex.dse.hierarchy) {
        return;
    }
    const self: boolean = (hierarchySelections[HierarchySelections_self] === TRUE_BIT);
    const all: boolean = (hierarchySelections[HierarchySelections_all] === TRUE_BIT);
    const hierarchy: boolean = !all && (hierarchySelections[HierarchySelections_hierarchy] === TRUE_BIT);
    const subtree: boolean = !all && (hierarchySelections[HierarchySelections_subtree] === TRUE_BIT);
    const children: boolean = !all && !subtree && (hierarchySelections[HierarchySelections_children] === TRUE_BIT);
    const parent: boolean = !all && !hierarchy && (hierarchySelections[HierarchySelections_parent] === TRUE_BIT);
    const siblingSubtree: boolean = !all && (hierarchySelections[HierarchySelections_siblingSubtree] === TRUE_BIT);
    const siblingChildren: boolean = !all && !siblingSubtree && (hierarchySelections[HierarchySelections_siblingChildren] === TRUE_BIT);
    const siblings: boolean = !all && (hierarchySelections[HierarchySelections_siblings] === TRUE_BIT);
    const top: boolean = !all && !hierarchy && (hierarchySelections[HierarchySelections_top] === TRUE_BIT);

    const hinfo = selfVertex.dse.hierarchy;
    const search_targets: [number, DistinguishedName][] = [];
    const rdnsById: Map<number, [number | null, RelativeDistinguishedName]> = new Map();

    // Per the spec, Set is guaraneteed to be iterable in insertion order.
    const ids_to_resolve: Set<number> = new Set();

    const level = selfVertex.dse.hierarchy?.level ?? (selfVertex.dse.hierarchy.path
        ? Math.max(selfVertex.dse.hierarchy.path.split(".").length - 1, 0)
        : 0);

    if (all) {
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyTop_id: selfVertex.dse.hierarchy.top_id,
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }
    if (top && hinfo.top && (hinfo.top_id !== undefined)) {
        search_targets.push([hinfo.top_id, hinfo.top]);
    }
    if (hierarchy && selfVertex.dse.hierarchy.path) {
        selfVertex.dse.hierarchy.path
            .split(".")
            .slice(0, -2)
            .map((str) => Number.parseInt(str, 10))
            .forEach((id) => ids_to_resolve.add(id));
    }
    if (parent && hinfo.parent && (hinfo.parent_id !== undefined)) {
        search_targets.push([hinfo.parent_id, hinfo.parent])
    }
    if (self && !searchState.alreadyReturnedById.has(selfVertex.dse.id)) {
        for (const [id, info] of selfEntryInfos) {
            if (
                searchState.alreadyReturnedById.has(id)
                || searchState.paging?.[1].alreadyReturnedById.has(id)
            ) {
                continue;
            }
            searchState.results.push(info);
        }
    }
    if (subtree && selfVertex.dse.hierarchy.path) {
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyPath: {
                    startsWith: selfVertex.dse.hierarchy.path,
                },
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }
    if (children) {
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyParent_id: selfVertex.dse.id,
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }
    if (siblings && selfVertex.dse.hierarchy.parent_id) {
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyParent_id: selfVertex.dse.hierarchy.parent_id,
                hierarchyLevel: level,
                id: {
                    not: selfVertex.dse.id,
                },
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }
    if (siblingSubtree && selfVertex.dse.hierarchy.path) {
        // TODO: Note that self's children are incorporated into these results.
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyTop_id: selfVertex.dse.hierarchy.top_id,
                hierarchyLevel: {
                    gt: level, // Not a mistake: siblingSubtree is not supposed to include the siblings themselves.
                },
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }
    if (siblingChildren && selfVertex.dse.hierarchy.path) {
        const subordinates = await ctx.db.entry.findMany({
            where: {
                hierarchyTop_id: selfVertex.dse.hierarchy.top_id,
                hierarchyParent_id: {
                    not: selfVertex.dse.id,
                },
                hierarchyLevel: level + 1,
            },
            select: {
                id: true,
                immediate_superior_id: true,
                RDN: true,
            },
        });
        for (const sub of subordinates) {
            ids_to_resolve.add(sub.id);
            const rdn = sub.RDN.map(atavFromDB);
            rdnsById.set(sub.id, [sub.immediate_superior_id, rdn]);
        }
    }

    for (const id of ids_to_resolve.values()) {
        if (
            searchState.alreadyReturnedById.has(id)
            || searchState.paging?.[1].alreadyReturnedById.has(id)
        ) {
            continue;
        }
        const dn = await id_to_dn(ctx, id, rdnsById);
        if (dn) {
            search_targets.push([id, dn]);
        }
    }

    const requestor: DistinguishedName | undefined = searchArgument
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? searchArgument.requestor
        ?? assn.boundNameAndUID?.dn;
    const op = new OperationProgress(
        OperationProgress_nameResolutionPhase_notStarted,
        undefined,
    );
    const search_co = new Uint8ClampedArray(12);
    const searchAliases: boolean = (
        searchArgument.searchAliases
        || (searchArgument.searchControlOptions?.[SearchControlOptions_searchAliases] === TRUE_BIT)
    );
    const matchedValuesOnly: boolean = (
        searchArgument.matchedValuesOnly
        || (searchArgument.searchControlOptions?.[SearchControlOptions_matchedValuesOnly] === TRUE_BIT)
    );
    const separateFamilyMembers: boolean = (
        searchArgument.searchControlOptions?.[SearchControlOptions_separateFamilyMembers] === TRUE_BIT);
    search_co[SearchControlOptions_searchAliases] = searchAliases ? TRUE_BIT : FALSE_BIT;
    search_co[SearchControlOptions_matchedValuesOnly] = matchedValuesOnly ? TRUE_BIT : FALSE_BIT;
    search_co[SearchControlOptions_separateFamilyMembers] = separateFamilyMembers ? TRUE_BIT : FALSE_BIT;
    const service_co = new Uint8ClampedArray(15);
    service_co[ServiceControlOptions_chainingProhibited] = TRUE_BIT;
    service_co[ServiceControlOptions_localScope] = searchArgument.serviceControls?.options?.[ServiceControlOptions_localScope] ?? FALSE_BIT;
    service_co[ServiceControlOptions_dontUseCopy] = searchArgument.serviceControls?.options?.[ServiceControlOptions_dontUseCopy] ?? FALSE_BIT;
    service_co[ServiceControlOptions_dontDereferenceAliases] = searchArgument.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] ?? FALSE_BIT;
    service_co[ServiceControlOptions_manageDSAIT] = searchArgument.serviceControls?.options?.[ServiceControlOptions_manageDSAIT] ?? FALSE_BIT;
    service_co[ServiceControlOptions_noSubtypeSelection] = searchArgument.serviceControls?.options?.[ServiceControlOptions_noSubtypeSelection] ?? FALSE_BIT;
    service_co[ServiceControlOptions_countFamily] = searchArgument.serviceControls?.options?.[ServiceControlOptions_countFamily] ?? FALSE_BIT;
    service_co[ServiceControlOptions_dontSelectFriends] = searchArgument.serviceControls?.options?.[ServiceControlOptions_dontSelectFriends] ?? FALSE_BIT;
    for (const [ id, dn ] of search_targets) {
        if (deadline && (new Date()) > deadline) {
            if (!searchState.poq) {
                searchState.poq = new PartialOutcomeQualifier(
                    LimitProblem_timeLimitExceeded,
                );
            }
            return;
        }
        const search_arg: SearchArgument = {
            unsigned: new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_baseObject,
                undefined, // I believe the hierarchically-selected entries are not filtered.
                searchAliases,
                searchArgument.selection,
                undefined, // No paged results
                matchedValuesOnly,
                undefined, // No extended filter
                FALSE, // Do not check overspecified
                undefined, // No relaxation
                undefined, // Extended area is irrelevant.
                undefined, // Hierarchy selections are removed.
                search_co, // We need to override some SCOs
                undefined, // No joins for hierarchy group results.
                undefined, // No joins for hierarchy group results.
                undefined, // No non-standard extensions.
                new ServiceControls(
                    service_co,
                    searchArgument.serviceControls?.priority,
                    searchArgument.serviceControls?.timeLimit,
                    separateFamilyMembers ? undefined : 1, // size limit = 1, unless we separate family members.
                    searchArgument.serviceControls?.scopeOfReferral,
                    searchArgument.serviceControls?.attributeSizeLimit,
                    undefined,
                    searchArgument.serviceControls?.serviceType,
                    searchArgument.serviceControls?.userClass,
                ),
                new SecurityParameters(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    searchArgument.securityParameters?.target,
                    undefined,
                    searchArgument.securityParameters?.errorProtection,
                ),
                requestor,
                op,
                undefined,
                searchArgument.criticalExtensions,
                searchArgument.referenceType,
                undefined, // Undefined entryOnly
                searchArgument.exclusions,
                searchArgument.nameResolveOnMaster,
                searchArgument.operationContexts,
                searchArgument.familyGrouping,
            ),
        };

        const response = await OperationDispatcher.dispatchLocalSearchDSPRequest(
            ctx,
            assn,
            {
                present: generateUnusedInvokeID(ctx),
            },
            search_arg,
            new ChainingArguments(
                requestor,
                dn,
                op,
                [
                    new TraceItem(
                        {
                            rdnSequence: ctx.dsa.accessPoint.ae_title.rdnSequence,
                        },
                        {
                            rdnSequence: dn,
                        },
                        op,
                    ),
                ],
                FALSE,
                undefined,
                undefined,
                searchArgument.referenceType,
                undefined,
                deadline
                ? {
                    generalizedTime: deadline,
                }
                : {
                    generalizedTime: addSeconds(new Date(), 3), // Default time limit for each sub-search.
                },
                undefined, // No security parameters because neither the arg nor result will be signed
                undefined, // Undefined entryOnly
                assn.boundNameAndUID?.uid,
                assn.authLevel,
                searchArgument.exclusions,
                TRUE,
                searchArgument.nameResolveOnMaster,
                generateUnusedInvokeID(ctx),
                undefined, // search rule ID?
                undefined, // No relaxation
                undefined, // No relatedEntry
                TRUE, // DSP paging
                TRUE, // exclude writeable copies
            ),
        );
        if ("result" in response && response.result) {
            if (("unsigned" in response.result) && ("searchInfo" in response.result.unsigned)) {
                // This implementation does not actually check for duplicates.
                searchState.results.push(...response.result.unsigned.searchInfo.entries);
            } else {
                searchState.resultSets.push(response.result);
            }
            searchState.alreadyReturnedById.add(id);
            searchState.paging?.[1].alreadyReturnedById.add(id);
        } else {
            continue;
        }
    }
}

export default hierarchySelectionProcedure;
