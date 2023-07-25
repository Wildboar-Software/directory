import {
    Context,
    Vertex,
    ClientAssociation,
    ServiceError,
    IndexableOID,
} from "@wildboar/meerkat-types";
import type { ASN1Element, BIT_STRING } from "asn1-ts";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { id_opcode_compare } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-compare.va";
import { id_opcode_list } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import { id_opcode_read } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import { id_opcode_search } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import getMatchingRulesFromFilter from "@wildboar/x500/src/lib/utils/getMatchingRulesFromFilter";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import {
    SearchArgument,
    _decode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    _decode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    CompareArgumentData,
    _decode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import isModificationOperation from "@wildboar/x500/src/lib/utils/isModificationOperation";
import unmetCriticalExtension from "../x500/unmetCriticalExtension";
import {
    ServiceProblem_unavailableCriticalExtension,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import filterCanBeUsedInShadowedArea from "../x500/filterCanBeUsedInShadowedArea";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly,
    EntryInformationSelection_infoTypes_attributeTypesAndValues as typesAndValues,
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";
import { EntryInformationSelection } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { BERElement, ObjectIdentifier, TRUE_BIT } from "asn1-ts";
import getDistinguishedName from "../x500/getDistinguishedName";
import { dnWithinSubtreeSpecification } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import {
    UnitOfReplication,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UnitOfReplication.ta";
import {
    ClassAttributeSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ClassAttributeSelection.ta";
import {
    ContextSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";
import {
    TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import getRelevantSubentries from "../dit/getRelevantSubentries";
import { OperationDispatcherState } from "./OperationDispatcher";
import getContextAssertionDefaults from "../dit/getContextAssertionDefaults";
import { contextAssertionDefaults } from "@wildboar/x500/src/lib/collections/attributes";
import { isMatchAllFilter } from "../x500/isMatchAllFilter";
import {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import isPrefix from "../x500/isPrefix";
import { ALL_USER_ATTRIBUTES_KEY } from "../constants";
import {
    FamilyReturn_memberSelect_contributingEntriesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyReturn.ta";
import { FamilyGrouping_entryOnly } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/FamilyGrouping.ta";
import {
    ServiceControlOptions_dontMatchFriends,
    ServiceControlOptions_noSubtypeMatch,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { addFriends } from "../database/entry/readValues";
import { subschema } from "@wildboar/x500/src/lib/collections/objectClasses";

const DEFAULT_CAD: ContextSelection = {
    allContexts: null,
};

export
async function getRelevantShadowingAgreement (
    ctx: Context,
    vertex: Vertex,
): Promise<ShadowingAgreementInfo[]> {
    const dse_ids: number[] = [];
    let current: Vertex | undefined = vertex;
    while (current) {
        dse_ids.push(current.dse.id);
        current = current.immediateSuperior;
    }

    const now = new Date();
    const sobs = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            entry_id: {
                in: dse_ids,
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
        },
    });
    const ret: ShadowingAgreementInfo[] = [];
    for (const sob of sobs) {
        const el = new BERElement();
        el.fromBytes(sob.agreement_ber);
        const agreement = _decode_ShadowingAgreementInfo(el);
        const cp_dn = agreement.shadowSubject.area.contextPrefix;
        const dn = getDistinguishedName(vertex);
        const objectClasses = Array.from(vertex.dse.objectClass).map(ObjectIdentifier.fromString);
        const subtree = agreement.shadowSubject.area.replicationArea;
        const NAMING_MATCHER = getNamingMatcherGetter(ctx);
        const subordinates = agreement.shadowSubject.subordinates ?? UnitOfReplication._default_value_for_subordinates;
        if (
            !dnWithinSubtreeSpecification(dn, objectClasses, subtree, cp_dn, NAMING_MATCHER)
            && !(subordinates && (vertex.dse.subr || vertex.dse.nssr))
        ) {
            continue;
        }
        ret.push(agreement);
    }
    return ret;
}

function subtreeWithinSpecification (
    ctx: Context,
    dn: DistinguishedName,
    prefix: DistinguishedName,
    subtree: SubtreeSpecification,
): boolean {
    if (subtree.specificationFilter) {
        return false;
    }
    if (subtree.maximum) {
        return false;
    }
    if (!isPrefix(ctx, prefix, dn)) {
        return false;
    }
    const local_name = dn.slice(prefix.length);
    const relative_local_name = local_name.slice(subtree.base?.length ?? 0);
    if (subtree.minimum && relative_local_name.length < subtree.minimum) {
        return false;
    }
    if (subtree.base?.length && !isPrefix(ctx, subtree.base, local_name)) {
        return false;
    }
    for (const spex of subtree.specificExclusions ?? []) {
        if ("chopBefore" in spex) {
            const chop = spex.chopBefore;
            if (isPrefix(ctx, chop, relative_local_name)) {
                return false;
            }
        } else if ("chopAfter" in spex) {
            const chop = spex.chopAfter;
            if ( // Only applies if this entry is beyond the chop point.
                (chop.length < relative_local_name.length)
                && isPrefix(ctx, chop, relative_local_name)
            ) {
                return false;
            }
        }
    }
    return true;
}

async function is_selection_satisfied (
    ctx: Context,
    vertex: Vertex,
    selection: EntryInformationSelection,
): Promise<boolean> {
    if (!vertex.dse.shadow || vertex.dse.shadow.attributeCompleteness) {
        return true;
    }
    // TODO: Document that it is unclear whether the subordinates-incompleteness
    // flag applies to child entries.
    const infoTypes = selection.infoTypes
        ?? EntryInformationSelection._default_value_for_infoTypes;
    const tav = (Number(infoTypes) === typesAndValues);
    const types_only = (Number(infoTypes) === typesOnly);
    const returnContexts = selection.returnContexts
        ?? EntryInformationSelection._default_value_for_returnContexts;
    // const familyReturn = selection.familyReturn
    //     ?? EntryInformationSelection._default_value_for_familyReturn;
    const attributes = selection.attributes
        ?? EntryInformationSelection._default_value_for_attributes;

    const care_about_contexts: boolean = !!(
        returnContexts
        || (selection.contextSelection && !("allContexts" in selection.contextSelection))
    );
    // No matter the selection, if all attribute values are present and we do
    // not care about contexts, the entry is suitable.
    if (
        (
            types_only
            || (tav && (vertex.dse.shadow.attributeValuesIncomplete.size === 0))
        )
        && !care_about_contexts
    ) {
        return true;
    }

    const shadow_agreements = await getRelevantShadowingAgreement(ctx, vertex);
    if (tav && returnContexts) {
        for (const sag of shadow_agreements) {
            // By default, no context values are replicated.
            if (!sag.shadowSubject.supplyContexts) {
                return false;
            }
            if ("allContexts" in sag.shadowSubject.supplyContexts) {
                continue;
            }
            else if (returnContexts) {
                // There is a chance that the master has contexts
                // that were not supplied. We cannot say for certain
                // that the shadow has complete context information.
                return false;
            }
        }
    }

    /**
     * If you are selecting specific contexts, the shadow consumer need not have
     * _all_ contexts from the master entry, but it does need the selected ones.
     *
     * NOTE: We are not worrying about whether the attribute values are
     * complete here. That is checked later. We just need to see if the
     * selected contexts have been replicated.
     */
    if (
        selection.contextSelection
        && ("selectedContexts" in (selection.contextSelection))
    ) {
        const selected_contexts: Set<IndexableOID> = new Set(selection
            .contextSelection
            .selectedContexts
            .flatMap((taca) => {
                if ("all" in taca.contextAssertions) {
                    return taca.contextAssertions.all;
                }
                else if ("preference" in taca.contextAssertions) {
                    return taca.contextAssertions.preference;
                }
                else {
                    return [];
                }
            })
            .map((ca) => ca.contextType.toString()),
        );
        for (const sag of shadow_agreements) {
            if (!sag.shadowSubject.supplyContexts) {
                // If supplyContexts is missing, the shadow consumer will
                // receive none of the contexts.
                return false;
            }
            if (!("selectedContexts" in sag.shadowSubject.supplyContexts)) {
                continue;
            }
            const replicated: Set<IndexableOID> = new Set(
                sag
                    .shadowSubject
                    .supplyContexts
                    .selectedContexts
                    .map((oid) => oid.toString()),
            );
            for (const selc of selected_contexts.values()) {
                if (!replicated.has(selc)) {
                    /* Since the replicated contexts do not include one that
                    we selected for, this entry is unsuitable for this
                    operation. */
                    return false;
                }
            }
        }
    }

    // NOTE: operational attributes need not be considered. X.525 states that it
    // is always assumed that operational attributes are incomplete in shadows.
    if ("allUserAttributes" in attributes) {
        return (
            vertex.dse.shadow.attributeCompleteness
            && (
                types_only
                || (tav && (vertex.dse.shadow.attributeValuesIncomplete.size === 0))
            )
        );
    }
    else if ("select" in attributes) {
        const sel = attributes.select;
        if (tav) {
            for (const s of sel) {
                if (vertex.dse.shadow.attributeValuesIncomplete.has(s.toString())) {
                    return false;
                }
            }
        }
        if (!vertex.dse.shadow.attributeCompleteness) {
            const replicated_attrs: Set<IndexableOID> = new Set();
            for (const sag of shadow_agreements) {
                for (const attrs of sag.shadowSubject.attributes) {
                    if (
                        attrs.class_
                        && !vertex.dse.objectClass.has(attrs.class_.toString())
                    ) {
                        continue;
                    }
                    const attr_sel = attrs.classAttributes
                        ?? ClassAttributeSelection._default_value_for_classAttributes;
                    if ("allAttributes" in attr_sel) {
                        // If all attributes are replicated, we can return.
                        // The entry is suitable.
                        return true;
                    }
                    else if ("include" in attr_sel) {
                        for (const i of attr_sel.include) {
                            replicated_attrs.add(i.toString());
                        }
                    }
                    else if ("exclude" in attr_sel) {
                        for (const x of attr_sel.exclude) {
                            replicated_attrs.delete(x.toString());
                        }
                    }
                }
            }
            for (const sel_attr of sel) {
                if (!replicated_attrs.has(sel_attr.toString())) {
                    return false;
                }
            }
        }
    }
    return true;
}

/**
 * @summary Determine whether all subordinates of a DSE are complete
 * @description
 *
 * This function determines if all of the shadow DSEs below a DSE were fully
 * replicated in their entirety. (E.g. no missing attributes or values.)
 *
 * @param ctx The context object
 * @param vertex The vertex whose subordinate completeness is in question.
 * @returns A `boolean` indicating whether all subordinates of a DSE are complete.
 *
 * @function
 * @async
 */
async function areAllSubordinatesComplete (ctx: Context, vertex: Vertex): Promise<boolean> {
    return !(await ctx.db.entry.findFirst({
        where: {
            shadow: true,
            ...getEntryExistsFilter(),
            immediate_superior_id: vertex.dse.id,
            OR: [
                {
                    attribute_completeness: false,
                },
                {
                    EntryAttributeValuesIncomplete: {
                        some: {},
                    },
                },
            ],
        },
    }));
}

/**
 * @summary The check suitability procedure
 * @description
 *
 * The distributed procedure to check if a request is valid and can be
 * satisfied, as described in ITU Recommendation X.518 (2016), Section 17.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param vertex The vertex whose suitability is to be determined
 * @param operationType The type of the operation
 * @param aliasDereferenced A boolean indicating whether an alias was dereferenced
 * @param criticalExtensions Critical extensions from chaining arguments
 * @param dontUseCopy Whether the `dontUseCopy` service control was set
 * @param copyShallDo Whether the `copyShallDo` service control was set
 * @param excludeShadows Whether the `excludeShadows` service control was set
 * @param encodedArgument The encoded argument as an ASN.1 element
 * @param searchArgument The search argument, if it is a search operation
 * @returns
 *
 * @function
 * @async
 */
export
async function checkSuitabilityProcedure (
    ctx: Context,
    state: OperationDispatcherState,
    assn: ClientAssociation | undefined,
    vertex: Vertex,
    operationType: Code,
    aliasDereferenced: boolean,
    criticalExtensions: BIT_STRING,
    dontUseCopy: boolean,
    copyShallDo: boolean,
    excludeShadows: boolean,
    encodedArgument?: ASN1Element,
    searchArgument?: SearchArgument,
    signErrors: boolean = false,
): Promise<boolean> {
    // DEVIATION: This is not required by the specification.
    if (vertex.dse.root && isModificationOperation(operationType)) {
        return false; // You cannot modify the Root DSE.
    }
    if (!vertex.dse.shadow) {
        const unmet = unmetCriticalExtension(criticalExtensions);
        if (unmet !== undefined) {
            throw new ServiceError(
                ctx.i18n.t("err:unavailable_critical_extension", {
                    index: unmet,
                }),
                new ServiceErrorData(
                    ServiceProblem_unavailableCriticalExtension,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        return true;
    }
    if (isModificationOperation(operationType)) {
        return false; // You cannot modify a shadow copy.
    }
    if (dontUseCopy) {
        return false; // The user specifically demanded a non-shadow copy.
    }
    if (copyShallDo) {
        const unmet = unmetCriticalExtension(criticalExtensions);
        if (unmet !== undefined) {
            throw new ServiceError(
                ctx.i18n.t("err:unavailable_critical_extension", {
                    index: unmet,
                }),
                new ServiceErrorData(
                    ServiceProblem_unavailableCriticalExtension,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn?.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        return true;
    }
    if (compareCode(operationType, id_opcode_list)) {
        return vertex.dse.shadow.subordinateCompleteness;
    } else if (compareCode(operationType, id_opcode_read)) {
        const readArg = _decode_ReadArgument(encodedArgument!);
        const readData = getOptionallyProtectedValue(readArg);
        const memberSelect = readData.selection?.familyReturn?.memberSelect
            ?? EntryInformationSelection._default_value_for_familyReturn.memberSelect;
        const infoTypes = readData.selection?.infoTypes ?? EntryInformationSelection._default_value_for_infoTypes;
        const typesOnly: boolean = (infoTypes === EntryInformationSelection_infoTypes_attributeTypesOnly);
        const returnContexts: boolean = readData.selection?.returnContexts
            ?? EntryInformationSelection._default_value_for_returnContexts;
        if ( // If we select members of the compound entry, and this DSE's subordinates are incomplete...
            (memberSelect !== FamilyReturn_memberSelect_contributingEntriesOnly)
            && vertex.dse.familyMember
            && !vertex.dse.shadow.subordinateCompleteness
        ) { // The entry is unsuitable.
            return false;
        }
        // If all attributes types, values, and contexts are complete, the entry is suitable, no matter what.
        if (vertex.dse.shadow.attributeCompleteness) {
            return true;
        }
        if (typesOnly) {
            /* In theory, the information could be incomplete with respect to
            the query, but there does not seem to be any way to determine
            whether all attribute types for an sDSE have been replicated. */
            // TODO: Report this as a defect.
            return true;
        }
        if (
            (vertex.dse.shadow.attributeValuesIncomplete.size > 0)
            && readData.selection?.attributes
        ) {
            if ("allUserAttributes" in readData.selection.attributes) {
                /* The attribute-values-incomplete OIDs basically just refer to
                user attribute types, since operational attribute types are not
                supposed to have contexts. */
                return false;
            } else if ("select" in readData.selection.attributes) {
                for (const sel_attr of readData.selection.attributes.select) {
                    if (vertex.dse.shadow.attributeValuesIncomplete.has(sel_attr.toString())) {
                        return false;
                    }
                }
            }
        }

        const targetDN = getDistinguishedName(vertex);
        const relevantSubentries: Vertex[] = (await Promise.all(
            state.admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap, {
                EntryObjectClass: {
                    some: {
                        object_class: contextAssertionDefaults["&id"].toString(),
                    },
                },
            })),
        )).flat();
        const cads: TypeAndContextAssertion[] = await getContextAssertionDefaults(ctx, vertex, relevantSubentries);
        /**
         * EIS contexts > operationContexts > CAD subentries > locally-defined default > no context assertion.
         * Per ITU X.501 (2016), Section 8.9.2.2.
         */
        const contextSelection: ContextSelection = readData.selection?.contextSelection
            ?? readData.operationContexts
            ?? (cads.length
                ? { selectedContexts: cads }
                : undefined)
            ?? DEFAULT_CAD;

        // This is lazy, but if there is any returning contexts or selecting
        // specific contexts, we just count the entry as unsuitable if not every
        // context was replicated.
        let shadowingAgreements: ShadowingAgreementInfo[] = [];
        if (returnContexts || !("allContexts" in contextSelection)) {
            shadowingAgreements = await getRelevantShadowingAgreement(ctx, vertex);
            for (const sag of shadowingAgreements) {
                if (
                    (
                        sag.shadowSubject.contextSelection
                        && !("allContexts" in sag.shadowSubject.contextSelection)
                    )
                    || !sag.shadowSubject.supplyContexts
                    || !("allContexts" in sag.shadowSubject.supplyContexts)
                ) {
                    return false;
                }
            }
        }
        return true;
    } else if (compareCode(operationType, id_opcode_search)) {
        if (!(searchArgument || encodedArgument)) {
            // Meerkat DSA just hangs and exhausts CPU if you assert(false).
            throw new Error("da5ea081-0930-4541-80a7-0a96f39c9c02");
        } // This should NEVER be called without passing this in if it is a search.
        const argument = searchArgument ?? _decode_SearchArgument(encodedArgument!);
        const searchArgData = getOptionallyProtectedValue(argument);
        // Step 8
        if (searchArgData.searchAliases && vertex.dse.alias) {
            return !excludeShadows;
        }
        const mrs = searchArgData.filter
            ? getMatchingRulesFromFilter(searchArgData.filter)
            : [];
        if (mrs.map((mr) => mr.toString()).some((mr) => !(
            ctx.equalityMatchingRules.get(mr)
            ?? ctx.orderingMatchingRules.get(mr)
            ?? ctx.substringsMatchingRules.get(mr)
        ))) { // Matching rule not understood
            return false;
        }
        if (
            (searchArgData.subset === SearchArgumentData_subset_oneLevel)
            || (searchArgData.subset === SearchArgumentData_subset_wholeSubtree)
        ) { // Step 10.
            if (excludeShadows) {
                return false;
            }
            let shadowingAgreements: ShadowingAgreementInfo[] = [];

            // Everything in this block are just short-circuits for performance.
            if (searchArgData.subset === SearchArgumentData_subset_oneLevel) {
                if (
                    isMatchAllFilter(searchArgData.filter)
                    && !searchArgData.selection
                    && vertex.dse.shadow?.subordinateCompleteness
                ) {
                    // Contexts do not need to be complete, because an absent
                    // selection defaults to not returning them.
                    return true;
                }
                // If every subordinate has full attributes, this is automatically suitable.
                if (await areAllSubordinatesComplete(ctx, vertex)) {
                    shadowingAgreements = await getRelevantShadowingAgreement(ctx, vertex);
                    if (shadowingAgreements.length === 0) {
                        return false; // The shadowing agreement might have expired and this is a stale shadow.
                    }

                    const returnContexts = searchArgData.selection?.returnContexts
                        ?? EntryInformationSelection._default_value_for_returnContexts;
                    // const familyReturn = selection.familyReturn
                    //     ?? EntryInformationSelection._default_value_for_familyReturn;
                    const care_about_contexts: boolean = !!(
                        returnContexts
                        || (
                            searchArgData.selection?.contextSelection
                            && !("allContexts" in searchArgData.selection.contextSelection)
                        )
                    );
                    if (care_about_contexts) {
                        // In addition to all subordinates being present and complete,
                        // all contexts must be replicated too.
                        for (const sag of shadowingAgreements) {
                            if (!sag.shadowSubject.supplyContexts) {
                                return false;
                            }
                            if (!("allContexts" in sag.shadowSubject.supplyContexts)) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            }

            /* If the target DSE and all of its entire subtree does not fall
            entirely within the subtrees of all applicable shadowing agreements,
            we can't guarantee that the shadow would return the exact same
            results that the master would, so return entry unsuitable.

            This is not required by the specification. It is just a Meerkat DSA
            implementation choice. */
            if (searchArgData.subset === SearchArgumentData_subset_wholeSubtree) {
                const dn = getDistinguishedName(vertex);
                const fully_within_all_subtrees = shadowingAgreements
                    .every((sag) => subtreeWithinSpecification(
                        ctx,
                        dn,
                        sag.shadowSubject.area.contextPrefix,
                        sag.shadowSubject.area.replicationArea,
                    ));
                if (!fully_within_all_subtrees) {
                    return false;
                }
            }

            if (shadowingAgreements.length === 0) { // If we didn't fetch already.
                shadowingAgreements = await getRelevantShadowingAgreement(ctx, vertex);
            }
            if (shadowingAgreements.length === 0) {
                return false; // The shadowing agreement might have expired and this is a stale shadow.
            }
            // NOTE: I copied this if-block down below.
            if (searchArgData.filter && !isMatchAllFilter(searchArgData.filter)) {
                const includedUserAttributes: Set<IndexableOID> = new Set();
                const excludedUserAttributes: Set<IndexableOID> = new Set();
                for (const shadowingAgreement of shadowingAgreements) {
                    if (!filterCanBeUsedInShadowedArea(
                        ctx,
                        searchArgData.filter,
                        shadowingAgreement,
                        includedUserAttributes,
                        excludedUserAttributes,
                    )) {
                        return false;
                    }
                }
                if (
                    searchArgData.selection?.attributes
                    && ("select" in searchArgData.selection.attributes)
                ) {
                    for (const sel_attr of searchArgData.selection.attributes.select) {
                        const key = sel_attr.toString();
                        if (excludedUserAttributes.has(key)) {
                            return false;
                        }
                        if (
                            !includedUserAttributes.has(key)
                            && !includedUserAttributes.has(ALL_USER_ATTRIBUTES_KEY)
                        ) {
                            return false;
                        }
                    }
                }
            } else if (searchArgData.selection?.attributes) {
                let allInAll: boolean = false;
                const includedUserAttributes: Set<IndexableOID> = new Set();
                for (const sag of shadowingAgreements) {
                    for (const attr of sag.shadowSubject.attributes) {
                        const class_attrs = attr.classAttributes
                            ?? ClassAttributeSelection._default_value_for_classAttributes;
                        if ("exclude" in class_attrs) {
                            allInAll = false;
                            break;
                        }
                        if (attr.class_) {
                            continue;
                        }
                        if ("allAttributes" in class_attrs) {
                            allInAll = true;
                        }
                        else if ("include" in class_attrs) {
                            for (const inc of class_attrs.include) {
                                includedUserAttributes.add(inc.toString());
                            }
                        }
                    }
                }
                if (("allUserAttributes" in searchArgData.selection.attributes) && !allInAll) {
                    return false;
                }
                else if (("select" in searchArgData.selection.attributes) && !allInAll) {
                    for (const sel_attr of searchArgData.selection.attributes.select) {
                        if (!includedUserAttributes.has(sel_attr.toString())) {
                            return false;
                        }
                    }
                }
            }
            // If the user requested contexts, we cannot guarantee that they are
            // present unless all of them are replicated.
            for (const sag of shadowingAgreements) {
                const returnContexts = searchArgData.selection?.returnContexts
                    ?? EntryInformationSelection._default_value_for_returnContexts;
                /* If the user requests to return or filter by contexts, we
                cannot honor that unless we have replicated all contexts. */
                if (
                    returnContexts
                    && (
                        !sag.shadowSubject.supplyContexts
                        || !("allContexts" in sag.shadowSubject.supplyContexts)
                        || (
                            sag.shadowSubject.contextSelection
                            && !("allContexts" in sag.shadowSubject.contextSelection)
                        )
                    )
                ) {
                    return false;
                }
                /* TODO: If the user is just trying to filter by contexts,
                do not return entry unsuitable if all the same assertions are
                present in the shadowing context selection and if those contexts
                are also present in the supplyContexts. */
            }
            // TODO: If any selected attribute is excluded by all object classes, return false?
            // TODO: If all attributes are replicated, return true.
            return true;
        } else if (searchArgData.subset === SearchArgumentData_subset_baseObject) {

            // Step 7.
            const targetDN = getDistinguishedName(vertex);
            const relevantSubentries: Vertex[] = (await Promise.all(
                state.admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap, {
                    EntryObjectClass: {
                        some: {
                            object_class: contextAssertionDefaults["&id"].toString(),
                        },
                    },
                })),
            )).flat();
            const cads: TypeAndContextAssertion[] = await getContextAssertionDefaults(ctx, vertex, relevantSubentries);

            /**
             * EIS contexts > operationContexts > CAD subentries > locally-defined default > no context assertion.
             * Per ITU X.501 (2016), Section 8.9.2.2.
             */
            const contextSelection: ContextSelection = searchArgData.operationContexts
                ?? (cads.length
                    ? { selectedContexts: cads }
                    : undefined)
                ?? DEFAULT_CAD;
            const sel = new EntryInformationSelection(
                searchArgData.selection?.attributes,
                searchArgData.selection?.infoTypes,
                searchArgData.selection?.extraAttributes,
                contextSelection,
                searchArgData.selection?.returnContexts,
                searchArgData.selection?.familyReturn,
            );
            if (!is_selection_satisfied(ctx, vertex, sel)) {
                return false;
            }
            const shadowingAgreements = await getRelevantShadowingAgreement(ctx, vertex);
            if (shadowingAgreements.length === 0) {
                return false; // The shadowing agreement might have expired and this is a stale shadow.
            }
            // NOTE: I copied this if-block from above.
            if (searchArgData.filter && !isMatchAllFilter(searchArgData.filter)) {
                const includedUserAttributes: Set<IndexableOID> = new Set();
                const excludedUserAttributes: Set<IndexableOID> = new Set();
                for (const shadowingAgreement of shadowingAgreements) {
                    if (!filterCanBeUsedInShadowedArea(
                        ctx,
                        searchArgData.filter,
                        shadowingAgreement,
                        includedUserAttributes,
                        excludedUserAttributes,
                    )) {
                        return false;
                    }
                }
                if (
                    searchArgData.selection?.attributes
                    && ("select" in searchArgData.selection.attributes)
                ) {
                    for (const sel_attr of searchArgData.selection.attributes.select) {
                        const key = sel_attr.toString();
                        if (excludedUserAttributes.has(key)) {
                            return false;
                        }
                        if (
                            !includedUserAttributes.has(key)
                            && !includedUserAttributes.has(ALL_USER_ATTRIBUTES_KEY)
                        ) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } else {
            return !excludeShadows; // Unknown subset.
        }
    } else if (compareCode(operationType, id_opcode_compare)) {
        // Step 7.
        // If all attributes types, values, and contexts are complete, the entry is suitable, no matter what.
        if (vertex.dse.shadow.attributeCompleteness) {
            return true;
        }
        // TODO: This could be more efficient: just extract only the purported field.
        const compareArg = _decode_CompareArgument(encodedArgument!);
        const compareData = getOptionallyProtectedValue(compareArg);
        const noSubtypeMatch = compareData.serviceControls?.options?.[ServiceControlOptions_noSubtypeMatch] === TRUE_BIT;
        /* If subtypes are a possibility, and the attribute values are incomplete,
        it is possible that there is an attribute subtype that this DSA does not
        know of that remains unreplicated, which might match the compare
        assertion. Is is therefore possible for a compare against the local
        shadow DSE to not match when it _would_ match against the real entry. */
        if (!noSubtypeMatch) {
            return false;
        }
        const family_grouping = compareData.familyGrouping
            ?? CompareArgumentData._default_value_for_familyGrouping;

        /* If the entry is a compound entry, and we are not treating the shadow
        DSE as an individual non-family entry, we cannot guarantee that the whole
        compound entry was replicated completely (but through much more
        complicated code). */
        if ((family_grouping !== FamilyGrouping_entryOnly) && vertex.dse.familyMember) {
            return false;
        }

        const shadow_agreements = await getRelevantShadowingAgreement(ctx, vertex);
        const replicated_attrs: Set<IndexableOID> = new Set();
        for (const sag of shadow_agreements) {
            for (const attrs of sag.shadowSubject.attributes) {
                if (
                    attrs.class_
                    && !vertex.dse.objectClass.has(attrs.class_.toString())
                ) {
                    continue;
                }
                const attr_sel = attrs.classAttributes
                    ?? ClassAttributeSelection._default_value_for_classAttributes;
                if ("allAttributes" in attr_sel) {
                    // If all attributes are replicated, we can return.
                    // The entry is suitable.
                    return true;
                }
                else if ("include" in attr_sel) {
                    for (const i of attr_sel.include) {
                        replicated_attrs.add(i.toString());
                    }
                }
                else if ("exclude" in attr_sel) {
                    for (const x of attr_sel.exclude) {
                        replicated_attrs.delete(x.toString());
                    }
                }
            }
        }
        const dontMatchFriends = compareData.serviceControls?.options?.[ServiceControlOptions_dontMatchFriends] === TRUE_BIT;
        if (!dontMatchFriends) {
            const targetDN = getDistinguishedName(vertex);
            const relevantSubentries: Vertex[] = (await Promise.all(
                state.admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap, {
                    EntryObjectClass: {
                        some: {
                            object_class: subschema["&id"].toString(),
                        },
                    },
                })),
            )).flat();
            const needsReplication = new Set(compareData.purported.type_.toString());
            addFriends(relevantSubentries, needsReplication, compareData.purported.type_);
            for (const attr of needsReplication.values()) {
                if (
                    !replicated_attrs.has(attr)
                    || vertex.dse.shadow.attributeValuesIncomplete.has(attr)
                ) {
                    return false;
                }
            }
        } else if (
            !replicated_attrs.has(compareData.purported.type_.toString())
            || vertex.dse.shadow.attributeValuesIncomplete.has(compareData.purported.type_.toString())
        ) {
            return false;
        }
        return true;
    } else {
        return true;
    }
}

export default checkSuitabilityProcedure;
