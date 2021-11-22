import { Context, Vertex, ClientConnection, ServiceError } from "@wildboar/meerkat-types";
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
import getShadowingAgreementInfo from "../dit/getShadowingAgreementInfo";
import filterCanBeUsedInShadowedArea from "../x500/filterCanBeUsedInShadowedArea";

async function isComplete (vertex: Vertex): Promise<boolean> {
    return (
        !vertex.dse.shadow
        || (
            vertex.dse.shadow.attributeCompleteness
            && vertex.dse.shadow.attributeValuesIncomplete
        )
    );
}

async function areAllSubordinatesComplete (ctx: Context, vertex: Vertex): Promise<boolean> {
    return !(await ctx.db.entry.findFirst({
        where: {
            shadow: true,
            deleteTimestamp: null,
            immediate_superior_id: vertex.dse.id,
            OR: [
                {
                    attribute_completeness: false,
                },
                {
                    attribute_values_incomplete: true,
                },
            ],
        },
    }));
}

export
async function checkSuitabilityProcedure (
    ctx: Context,
    conn: ClientConnection,
    vertex: Vertex,
    operationType: Code,
    aliasDereferenced: boolean,
    criticalExtensions: BIT_STRING,
    dontUseCopy: boolean,
    copyShallDo: boolean,
    excludeShadows: boolean,
    encodedArgument?: ASN1Element,
    searchArgument?: SearchArgument,
): Promise<boolean> {
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                )
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    aliasDereferenced,
                    undefined,
                )
            );
        }
        return true;
    }
    if (compareCode(operationType, id_opcode_list)) {
        return vertex.dse.shadow.subordinateCompleteness;
    } else if (compareCode(operationType, id_opcode_read)) {
        // DEVIATION: Information selection is not evaluated against the shadowed info.
        return true;
    } else if (compareCode(operationType, id_opcode_search)) {
        assert(searchArgument || encodedArgument); // This should NEVER be called without passing this in if it is a search.
        const argument = searchArgument ?? _decode_SearchArgument(encodedArgument!);
        const searchArgData = getOptionallyProtectedValue(argument);
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
        ) {
            if (excludeShadows) {
                return false;
            }
            const shadowingAgreement = await getShadowingAgreementInfo(ctx, vertex);
            if (!shadowingAgreement) {
                return false; // The shadowing agreement might have expired and this is a stale shadow.
            }
            if (searchArgData.subset === SearchArgumentData_subset_oneLevel) {
                // If every subordinate has full attributes, this is automatically suitable.
                if (await areAllSubordinatesComplete(ctx, vertex)) {
                    return true;
                }
            }
            if (searchArgData.filter) {
                // DEVIATION: This is almost GUARANTEED to be incorrect.
                if (!filterCanBeUsedInShadowedArea(searchArgData.filter, shadowingAgreement)) {
                    return false;
                }
            }
            // DEVIATION: Information selection is not evaluated against the shadowed info.
            return true;
        } else if (searchArgData.subset === SearchArgumentData_subset_baseObject) {
            return isComplete(vertex);
        } else {
            return !excludeShadows; // Unknown subset.
        }
    } else if (compareCode(operationType, id_opcode_compare)) {
        // ~~Bail out if matching rules are not supported by DSA.~~ Actually, let's let the compare function handle this.
        return isComplete(vertex);
    } else {
        return true;
    }
}

export default checkSuitabilityProcedure;
