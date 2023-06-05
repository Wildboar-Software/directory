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
import { strict as assert } from "assert";
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
// import getShadowingAgreementInfo from "../dit/getShadowingAgreementInfo";
import filterCanBeUsedInShadowedArea from "../x500/filterCanBeUsedInShadowedArea";
import { getEntryExistsFilter } from "../database/entryExistsFilter";
import {
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
import { BERElement, ObjectIdentifier } from "asn1-ts";
import getDistinguishedName from "../x500/getDistinguishedName";
import { dnWithinSubtreeSpecification } from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { UnitOfReplication } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/UnitOfReplication.ta";
import { ClassAttributeSelection } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ClassAttributeSelection.ta";

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


/**
 * @summary Determine if a shadow DSE is complete.
 * @description
 *
 * Determine if a shadow DSE is complete, meaning that all attributes and values
 * have been replicated.
 *
 * @param vertex The vertex whose completeness is to be determined.
 * @returns A `boolean` indicating whether the shadow DSE was replicated in its
 *  entirety.
 *
 * @function
 */
function isComplete (vertex: Vertex): boolean {
    return (
        !vertex.dse.shadow
        || (
            vertex.dse.shadow.attributeCompleteness
            && (vertex.dse.shadow.attributeValuesIncomplete.size === 0)
        )
    );
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
        // DEVIATION: Information selection is not evaluated against the shadowed info.
        // return true;
        const readArg = _decode_ReadArgument(encodedArgument!);
        const readData = getOptionallyProtectedValue(readArg);
        const tav = (Number(readData.selection?.infoTypes ?? typesAndValues) === typesAndValues);
        const types_only = (Number(readData.selection?.infoTypes ?? typesAndValues) === typesOnly);
        if (!readData.selection) {
            return (
                vertex.dse.shadow.attributeCompleteness
                && (vertex.dse.shadow.attributeValuesIncomplete.size === 0)
            );
        }
        const attributes = readData.selection.attributes ?? EntryInformationSelection._default_value_for_attributes;
        if ("allUserAttributes" in attributes) {
            if (types_only) {
                return vertex.dse.shadow.attributeCompleteness;
            } else {
                return (
                    vertex.dse.shadow.attributeCompleteness
                    && (vertex.dse.shadow.attributeValuesIncomplete.size === 0)
                );
            }
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
                const shadow_agreements = await getRelevantShadowingAgreement(ctx, vertex);
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
                return true;
            }
        }
        return true;
    } else if (compareCode(operationType, id_opcode_search)) {
        if (!(searchArgument || encodedArgument)) {
            throw new Error(); // Meerkat DSA just hangs and exhausts CPU if you assert(false).
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
            const shadowingAgreements = await getRelevantShadowingAgreement(ctx, vertex);
            if (shadowingAgreements.length === 0) {
                return false; // The shadowing agreement might have expired and this is a stale shadow.
            }
            if (searchArgData.subset === SearchArgumentData_subset_oneLevel) {
                // If every subordinate has full attributes, this is automatically suitable.
                if (await areAllSubordinatesComplete(ctx, vertex)) {
                    return true;
                }
            }
            if (searchArgData.filter) {
                for (const shadowingAgreement of shadowingAgreements) {
                    // DEVIATION: This is almost GUARANTEED to be incorrect.
                    if (!filterCanBeUsedInShadowedArea(searchArgData.filter, shadowingAgreement)) {
                        return false;
                    }
                }
            }
            const user_attrs = searchArgData.selection?.attributes
                ?? EntryInformationSelection._default_value_for_attributes;
            if ("select" in user_attrs) {
                const sel = user_attrs.select;
                const replicated_attrs: Set<IndexableOID> = new Set();
                for (const sag of shadowingAgreements) {
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
            // DEVIATION: Information selection is not evaluated against the shadowed info.
            return true;
        } else if (searchArgData.subset === SearchArgumentData_subset_baseObject) {
            // Step 7.
            return isComplete(vertex);
        } else {
            return !excludeShadows; // Unknown subset.
        }
    } else if (compareCode(operationType, id_opcode_compare)) {
        // ~~Bail out if matching rules are not supported by DSA.~~ Actually, let's let the compare function handle this.
        // Step 7.
        return isComplete(vertex);
    } else {
        return true;
    }
}

export default checkSuitabilityProcedure;
