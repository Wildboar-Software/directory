import type { Vertex, ClientAssociation } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import { BOOLEAN, TRUE } from "@wildboar/asn1";
import isPrefix from "../x500/isPrefix";
import {
    SearchArgument,
    SearchResultData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/DirectoryAbstractService";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    ChainingArguments,
} from "@wildboar/x500/DistributedOperations";
import OperationDispatcher from "./OperationDispatcher";
import type {
    SearchState,
} from "./search_i";
import type { InvokeId } from "@wildboar/x500/CommonProtocolSpecification";
import { strict as assert } from "assert";
import { referral } from "@wildboar/x500/DirectoryAbstractService";
import { serviceError } from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceProblem_unavailable,
    ServiceProblem_busy,
} from "@wildboar/x500/DirectoryAbstractService";
import { compareCode } from "@wildboar/x500";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ContinuationReference,
} from "@wildboar/x500/DistributedOperations";
import {
    ReferenceType_self,
} from "@wildboar/x500/DistributedOperations";
import {
    OperationProgress,
} from "@wildboar/x500/DistributedOperations";
import {
    OperationProgress_nameResolutionPhase_notStarted,
} from "@wildboar/x500/DistributedOperations";
import {
    AccessPointInformation,
} from "@wildboar/x500/DistributedOperations";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary The Search Aliases Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The Search Aliases Procedure, as defined in ITU Recommendation X.518 (2016),
 * Section 19.3.2.2.9.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param target The target object
 * @param argument The search argument
 * @param chaining The chaining arguments
 * @param ret The mutable search state.
 * @returns Nothing. This function mutates the search state by reference.
 *
 * @function
 * @async
 */
export
async function searchAliases (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    target: Vertex,
    argument: SearchArgument,
    chaining: ChainingArguments,
    ret: SearchState,
): Promise<void> {
    assert(target.dse.alias);
    const data = getOptionallyProtectedValue(argument);
    const subset = data.subset ?? SearchArgumentData._default_value_for_subset;
    if (subset === SearchArgumentData_subset_wholeSubtree) { // Same as !== baseObject or oneLevel
        if (isPrefix(ctx, target.dse.alias.aliasedEntryName, data.baseObject.rdnSequence)) {
            return;
        }
        if (chaining.targetObject && isPrefix(ctx, target.dse.alias.aliasedEntryName, chaining.targetObject)) {
            return;
        }
        const prefixFoundInTrace = chaining.traceInformation
            .some((ti) => (
                ti.targetObject
                && isPrefix(ctx, target.dse.alias!.aliasedEntryName, ti.targetObject.rdnSequence)
            ));
        if (prefixFoundInTrace) {
            return;
        }
    }
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? chaining.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;

    // TODO: Step 4; pending service-specific administrative area implementation.
    const invokeId: InvokeId = {
        present: 0, // REVIEW: Will this be a problem?
    };
    const entryOnly: BOOLEAN = (subset === SearchArgumentData_subset_oneLevel);
    const newChaining: ChainingArguments = new ChainingArguments(
        requestor,
        target.dse.alias.aliasedEntryName,
        undefined,
        [],
        TRUE,
        undefined,
        undefined,
        undefined,
        undefined,
        chaining.timeLimit,
        undefined,
        entryOnly,
        chaining.uniqueIdentifier,
        chaining.authenticationLevel,
        undefined,
        chaining.excludeShadows,
    );
    const outcome = await OperationDispatcher.dispatchLocalSearchDSPRequest(
        ctx,
        assn,
        invokeId,
        argument,
        newChaining,
    );
    if ("result" in outcome) {
        const data = getOptionallyProtectedValue<SearchResultData>(outcome.result);
        if ("searchInfo" in data) {
            ret.results.push(...data.searchInfo.entries);
        } else if ("uncorrelatedSearchInfo" in data) {
            ret.resultSets.push(...data.uncorrelatedSearchInfo);
        }
    } else if (outcome.errcode) {
        if (compareCode(outcome.errcode, referral["&errorCode"]!)) {
            const errorParam = referral.decoderFor["&ParameterType"]!(outcome.error);
            const errorData = getOptionallyProtectedValue(errorParam);
            if (ret.poq && ret.poq.unexplored) {
                ret.poq.unexplored.push(errorData.candidate);
            } else if (ret.poq && !ret.poq.unexplored) {
                ret.poq = new PartialOutcomeQualifier(
                    ret.poq.limitProblem,
                    [ errorData.candidate ],
                    ret.poq.unavailableCriticalExtensions,
                    ret.poq.unknownErrors,
                    ret.poq.queryReference,
                    ret.poq.overspecFilter,
                    ret.poq.notification,
                    ret.poq.entryCount,
                );
            } else if (!ret.poq) {
                ret.poq = new PartialOutcomeQualifier(
                    undefined,
                    [ errorData.candidate ],
                );
            }
        } else if (compareCode(outcome.errcode, serviceError["&errorCode"]!)) {
            const errorParam = serviceError.decoderFor["&ParameterType"]!(outcome.error);
            const errorData = getOptionallyProtectedValue(errorParam);
            if (
                (errorData.problem === ServiceProblem_unavailable)
                || (errorData.problem === ServiceProblem_busy)
            ) {
                const cr = new ContinuationReference(
                    {
                        rdnSequence: target.dse.alias.aliasedEntryName,
                    },
                    undefined,
                    new OperationProgress(
                        OperationProgress_nameResolutionPhase_notStarted,
                        undefined,
                    ),
                    undefined,
                    ReferenceType_self,
                    [
                        new AccessPointInformation(
                            ctx.dsa.accessPoint.ae_title,
                            ctx.dsa.accessPoint.address,
                            ctx.dsa.accessPoint.protocolInformation,
                            undefined,
                            undefined,
                            undefined,
                        ),
                    ],
                    entryOnly,
                    undefined,
                    TRUE, // returnToDUA
                    undefined,
                );
                if (ret.poq && ret.poq.unexplored) {
                    ret.poq.unexplored.push(cr);
                } else if (ret.poq && !ret.poq.unexplored) {
                    ret.poq = new PartialOutcomeQualifier(
                        ret.poq.limitProblem,
                        [ cr ],
                        ret.poq.unavailableCriticalExtensions,
                        ret.poq.unknownErrors,
                        ret.poq.queryReference,
                        ret.poq.overspecFilter,
                        ret.poq.notification,
                        ret.poq.entryCount,
                    );
                } else if (!ret.poq) {
                    ret.poq = new PartialOutcomeQualifier(
                        undefined,
                        [ cr ],
                    );
                }
            }
        }
    }
}

export default searchAliases;
