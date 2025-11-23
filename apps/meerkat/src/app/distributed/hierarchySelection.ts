import type { Vertex, ClientAssociation, Context, IndexableDN } from "@wildboar/meerkat-types";
import { OperationDispatcher } from "./OperationDispatcher.js";
import { ASN1Construction, BERElement, FALSE, FALSE_BIT, TRUE, TRUE_BIT } from "@wildboar/asn1";
import {
    SearchResultData,
    SecurityParameters,
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
    SearchArgument,
    SearchArgumentData,
    ServiceControlOptions_chainingProhibited,
    ServiceControlOptions_countFamily,
    ServiceControlOptions_dontDereferenceAliases,
    ServiceControlOptions_dontSelectFriends,
    ServiceControlOptions_dontUseCopy,
    ServiceControlOptions_localScope,
    ServiceControlOptions_manageDSAIT,
    ServiceControlOptions_noSubtypeSelection,
    ServiceControls,
    SearchControlOptions_matchedValuesOnly,
    SearchControlOptions_searchAliases,
    SearchControlOptions_separateFamilyMembers,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChainingArguments, OperationProgress,
} from "@wildboar/x500/DistributedOperations";
import {
    Attribute,
    DistinguishedName,
    _encode_DistinguishedName,
    RelativeDistinguishedName,
    AttributeTypeAndValue,
} from "@wildboar/pki-stub";
import { SearchArgumentData_subset_baseObject } from "@wildboar/x500/DirectoryAbstractService";
import { SearchState } from "./search_i.js";
import { EntryInformation } from "@wildboar/x500/DirectoryAbstractService";
import { strict as assert } from "node:assert";
import { MeerkatContext } from "../ctx.js";
import type { DistinguishedValue } from "@prisma/client";
import { OperationProgress_nameResolutionPhase_notStarted } from "@wildboar/x500/DistributedOperations";
import { TraceItem } from "@wildboar/x500/DistributedOperations";
import generateUnusedInvokeID from "../net/generateUnusedInvokeID.js";
import { addSeconds } from "date-fns";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    LimitProblem_timeLimitExceeded,
} from "@wildboar/x500/DirectoryAbstractService";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_autonomousArea } from "@wildboar/x500/InformationFramework";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import isPrefix from "../x500/isPrefix.js";
import {
    EntryInformationSelection,
    FamilyReturn,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    FamilyReturn_memberSelect_compoundEntry,
} from "@wildboar/x500/DirectoryAbstractService";
import { stringifyDN } from "../x500/stringifyDN.js";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers.js";
import { DER } from "@wildboar/asn1/functional";
import { family_information } from "@wildboar/x500/DirectoryAbstractService";
import { FamilyEntries, FamilyEntry } from "@wildboar/x500/DirectoryAbstractService";
import iterateOverSearchResults from "../x500/iterateOverSearchResults.js";
import { compareDistinguishedName, getOptionallyProtectedValue } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";

export
function getNamesFromFamilyEntry (fe: FamilyEntry, base_dn: DistinguishedName): DistinguishedName[] {
    const root: DistinguishedName = [ ...base_dn, fe.rdn ];
    return [
        root,
        ...fe.family_info
            ?.flatMap((f) => f
                .familyEntries.flatMap((f2) => getNamesFromFamilyEntry(f2, root))) ?? [],
    ];
}

export
function filterFamilyEntries (
    ctx: Context,
    fe: FamilyEntries,
    base_dn: DistinguishedName,
    permitted: Set<IndexableDN>,
): FamilyEntries {
    const entries: FamilyEntry[] = [];
    for (const f of fe.familyEntries) {
        const dn: DistinguishedName = [ ...base_dn, f.rdn ];
        const dn_str = normalizeDN(ctx, _encode_DistinguishedName(dn, DER)) ?? stringifyDN(ctx, dn);
        if (permitted.has(dn_str)) {
            const new_f = new FamilyEntry(
                f.rdn,
                f.information,
                f.family_info
                    ?.map((fi) => filterFamilyEntries(ctx, fi, dn, permitted))
                    .filter((fi) => fi.familyEntries.length),
            );
            entries.push(new_f);
        }
    }
    return new FamilyEntries(
        fe.family_class,
        entries,
    );
}

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

const ID_AR_SVC: string = id_ar_serviceSpecificArea.toString();
const ID_AR_AUTONOMOUS: string = id_ar_autonomousArea.toString();

function getServiceAdminPrefix (target: Vertex): DistinguishedName | undefined {
    let i = 0;
    let curr: Vertex | undefined = target;
    while (curr && i < 100_000) {
        i++;
        if (
            curr.dse.admPoint
            && (
                curr.dse.admPoint.administrativeRole.has(ID_AR_SVC)
                || curr.dse.admPoint.administrativeRole.has(ID_AR_AUTONOMOUS)
            )
        ) {
            return getDistinguishedName(curr);
        }
        curr = curr.immediateSuperior;
    }
}

/**
 * @summary The Hierarchy Selection Procedure as defined in ITU Recommendation X.518.
 * @description
 *
 * The Hierarchy Selection Procedure (I) as defined in ITU Recommendation X.518
 * (2016), Section 19.3.2.2.10.
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
    separateFamilyMembers: boolean,
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
    if (self && !searchState.excludedById.has(selfVertex.dse.id)) {
        for (const [id, info] of selfEntryInfos) {
            if (
                searchState.excludedById.has(id)
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
            searchState.excludedById.has(id)
            || searchState.paging?.[1].alreadyReturnedById.has(id)
        ) {
            continue;
        }
        const dn = await id_to_dn(ctx, id, rdnsById);
        if (dn) {
            search_targets.push([id, dn]);
        }
    }

    const serviceAdminPrefix: DistinguishedName | undefined = getServiceAdminPrefix(selfVertex);
    const ancestorDN: DistinguishedName = getDistinguishedName(selfVertex);
    const selectedChildEntries: Set<IndexableDN> = new Set();
    if (separateFamilyMembers) {
        for (const [, entry] of selfEntryInfos) {
            // Remove the ancestor prefix.
            const childDN = entry.name.rdnSequence.slice(ancestorDN.length);
            const dn_str = normalizeDN(ctx, _encode_DistinguishedName(childDN, DER)) ?? stringifyDN(ctx, childDN);
            selectedChildEntries.add(dn_str);
        }
    } else {
        const entry = selfEntryInfos[0][1];
        const family_info_info = entry.information
            ?.find((info) => ("attribute" in info) && info.attribute.type_.isEqualTo(family_information["&id"]));
        if (family_info_info) {
            assert("attribute" in family_info_info);
            const family_info_attr = family_info_info.attribute;
            const memberDNs: DistinguishedName[] = family_info_attr.values
                .map((v) => family_information.decoderFor["&Type"]!(v))
                .flatMap((f1) => f1.familyEntries.flatMap((f) => getNamesFromFamilyEntry(f, entry.name.rdnSequence)));
            for (const memberDN of memberDNs) {
                // Remove the ancestor prefix.
                const childDN = memberDN.slice(ancestorDN.length);
                const dn_str = normalizeDN(ctx, _encode_DistinguishedName(childDN, DER)) ?? stringifyDN(ctx, childDN);
                selectedChildEntries.add(dn_str);
            }
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
        /**
         * Hierarchical groups are required by the X.500 specifications to be
         * within a single service administrative area, or within no service
         * administrative area at all. There is currently no efficient way to
         * check this with certainty in Meerkat DSA, but we can check that the
         * distinguished name is prefixed by the distinguished name of the
         * applicable service admin area, if one is defined. This will not tell
         * us if the hierarchical sub-search crosses the lower bound of the
         * service admin area.
         */
        if (serviceAdminPrefix && !isPrefix(ctx, serviceAdminPrefix, dn)) {
            continue;
        }
        const search_arg: SearchArgument = {
            unsigned: new SearchArgumentData(
                {
                    rdnSequence: dn,
                },
                SearchArgumentData_subset_baseObject,
                undefined, // I believe the hierarchically-selected entries are not filtered.
                searchAliases,
                /**
                 * We select the whole compound entry, because, in hierarchy
                 * selections, if the hierarchically-non-self entry is a
                 * compound entry, the child entries are selected based on the
                 * names of the child entries that were selected in the self
                 * entry. See ITU Recommendation X.511 (2019), Section 7.13:
                 *
                 * ITU Recommendation X.511 (2019), Section 7.13 states that:
                 *
                 * > If a referenced entry is a compound entry, the marking of
                 * > its members shall be done as follows. Each member of the
                 * > referenced compound entry that have the same local member
                 * > name as a member of the matched compound entry
                 * > is marked the same way. All other members of the referenced
                 * > compound entry are left unmarked.
                 */
                new EntryInformationSelection(
                    searchArgument.selection?.attributes,
                    searchArgument.selection?.infoTypes,
                    searchArgument.selection?.extraAttributes,
                    searchArgument.selection?.contextSelection,
                    searchArgument.selection?.returnContexts,
                    new FamilyReturn(
                        FamilyReturn_memberSelect_compoundEntry,
                        undefined,
                    ),
                ),
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
            const results = Array.from(iterateOverSearchResults(response.result));
            const data = getOptionallyProtectedValue<SearchResultData>(response.result);
            const baseDN = ("searchInfo" in data)
                ? (data.searchInfo.name?.rdnSequence ?? dn)
                : dn;
            const namingMatcher = getNamingMatcherGetter(ctx);
            for (const result of results) {
                /**
                 * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
                 * Section 7.13 details the procedures for hierarchically-related
                 * entries that are compound entries. Basically, the DSA should
                 * return all family members having the same local names as
                 * family members returned from the `self` entry.
                 */
                if (separateFamilyMembers) {
                    // Always include the ancestor
                    if (compareDistinguishedName(ancestorDN, result.name.rdnSequence, namingMatcher)) {
                        searchState.results.push(result);
                    }
                    // Remove the ancestor prefix.
                    const childDN = result.name.rdnSequence.slice(ancestorDN.length);
                    const dn_str = normalizeDN(ctx, _encode_DistinguishedName(childDN, DER))
                        ?? stringifyDN(ctx, childDN);
                    if (selectedChildEntries.has(dn_str)) {
                        searchState.results.push(result);
                    }
                } else if (results[0]?.information && (results.length === 1)) {
                    const entry = results[0];
                    const family_info_info = entry.information
                        ?.find((info) => (
                            ("attribute" in info)
                            && info.attribute.type_.isEqualTo(family_information["&id"])
                        ));
                    if (family_info_info) {
                        assert("attribute" in family_info_info);
                        const family_info_attr = family_info_info.attribute;
                        const new_attr = new Attribute(
                            family_information["&id"],
                            family_info_attr.values
                                .map((v) => family_information.decoderFor["&Type"]!(v))
                                .map((f1) => filterFamilyEntries(ctx, f1, baseDN, selectedChildEntries))
                                .filter((f) => f.familyEntries.length)
                                .map((f) => family_information.encoderFor["&Type"]!(f, DER)),
                            undefined,
                        );
                        const new_info = (entry.information ?? [])
                            .filter((info) => (
                                !("attribute" in info)
                                || info.attribute.type_.isEqualTo(family_information["&id"])
                            ));
                        new_info.push({
                            attribute: new_attr,
                        });
                        const new_entry = new EntryInformation(
                            entry.name,
                            entry.fromEntry,
                            new_info,
                            entry.incompleteEntry,
                            entry.partialName,
                            entry.derivedEntry,
                        );
                        searchState.results.push(new_entry);
                    } else {
                        // If no family-information, just return the result.
                        searchState.results.push(result);
                    }
                } // Otherwise, we don't know what to do!
            }
            searchState.excludedById.add(id);
            searchState.paging?.[1].alreadyReturnedById.add(id);
        } else {
            continue;
        }
    }
}

export default hierarchySelectionProcedure;
