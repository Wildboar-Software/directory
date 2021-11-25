import type { Context, Vertex, ClientConnection } from "@wildboar/meerkat-types";
import { BOOLEAN, TRUE } from "asn1-ts";
import isPrefix from "../x500/isPrefix";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import OperationDispatcher from "./OperationDispatcher";
import type {
    SearchState,
} from "./search_i";
import type { InvokeId } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import { strict as assert } from "assert";
import { referral } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import { serviceError } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceProblem_unavailable,
    ServiceProblem_busy,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import {
    ReferenceType_self,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_notStarted,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";

export
async function searchAliases (
    ctx: Context,
    conn: ClientConnection,
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

    // TODO: Step 4; pending service-specific administrative area implementation.
    const invokeId: InvokeId = {
        present: 0,
    };
    const entryOnly: BOOLEAN = (subset === SearchArgumentData_subset_oneLevel);
    const newChaining: ChainingArguments = new ChainingArguments(
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        target.dse.alias.aliasedEntryName,
        undefined,
        [],
        true,
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
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    );
    const outcome = await OperationDispatcher.dispatchLocalSearchDSPRequest(
        ctx,
        conn,
        invokeId,
        argument,
        newChaining,
    );
    if ("result" in outcome) {
        const data = getOptionallyProtectedValue(outcome.result);
        if ("searchInfo" in data) {
            // REVIEW: I think this section might be problematic, because you
            // are overwriting the main search's chaining arguments, POQ, etc.
            ret.results.push(...data.searchInfo.entries);
            ret.poq = data.searchInfo.partialOutcomeQualifier;
            ret.chaining = outcome.chaining;
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
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
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
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    );
                }
            }
        }
    }
}

export default searchAliases;
