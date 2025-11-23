import type { ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx.js";
import {
    SearchArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SearchArgumentData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ChainingArguments,
} from "@wildboar/x500/DistributedOperations";
import {
    ContinuationReference,
} from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import OperationDispatcher from "./OperationDispatcher.js";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ReferenceType_self,
} from "@wildboar/x500/DistributedOperations";
import {
    AccessPointInformation,
} from "@wildboar/x500/DistributedOperations";
import {
    ServiceProblem_timeLimitExceeded,
} from "@wildboar/x500/DirectoryAbstractService";
import { getDateFromTime } from "@wildboar/x500";
import {
    serviceError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    ServiceErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import type { OperationDispatcherState } from "./OperationDispatcher.js";
import {
    AbandonedData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    abandoned,
} from "@wildboar/x500/DirectoryAbstractService";
import type { SearchState } from "./search_i.js";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/DirectoryAbstractService";
import type { INTEGER } from "@wildboar/asn1";
import { randomInt } from "crypto";
import type {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";

/**
 * @summary The Related Entry Procedure, defined in ITU Recommendation X.518.
 * @description
 *
 * The Related Entry Procedure, defined in ITU Recommendation X.518 (2016),
 * Section 19.3.2.2.1.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param state The operation dispatcher state
 * @param search The search state
 * @param argument The search argument
 * @param chaining The chaining arguments, if present
 *
 * @function
 * @async
 */
export
async function relatedEntryProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    state: OperationDispatcherState,
    search: SearchState,
    argument: SearchArgument,
    chaining?: ChainingArguments,
    signErrors: boolean = false,
): Promise<void> {
    const op = ("present" in state.invokeId)
        ? assn.invocations.get(Number(state.invokeId.present))
        : undefined;
    const timeLimitEndTime: Date | undefined = chaining?.timeLimit
        ? getDateFromTime(chaining.timeLimit)
        : undefined;
    const checkTimeLimit = () => {
        if (timeLimitEndTime && (new Date() > timeLimitEndTime)) {
            throw new errors.ServiceError(
                ctx.i18n.t("err:time_limit"),
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    chaining?.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
    };
    const data = getOptionallyProtectedValue(argument);
    const requestor: DistinguishedName | undefined = data
        .securityParameters
        ?.certification_path
        ?.userCertificate
        .toBeSigned
        .subject
        .rdnSequence
        ?? state.chainingArguments.originator
        ?? data.requestor
        ?? assn.boundNameAndUID?.dn;
    if (!data.joinArguments || chaining?.relatedEntry) { // Yes, relatedEntry is supposed to be ABSENT.
        return;
    }
    for (let i = 0; i < data.joinArguments.length; i++) {
        if (op?.abandonTime) {
            op.events.emit("abandon");
            throw new errors.AbandonError(
                ctx.i18n.t("err:abandoned"),
                new AbandonedData(
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        signErrors,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
                signErrors,
            );
        }
        checkTimeLimit();
        const jarg = data.joinArguments[i];
        const operationIdentifier: INTEGER = randomInt(2147483648);
        const newChaining = new ChainingArguments(
            requestor,
            undefined,
            undefined,
            [],
            state.chainingArguments.aliasDereferenced,
            undefined,
            undefined,
            undefined, // unspecified
            undefined,
            timeLimitEndTime
                ? {
                    generalizedTime: timeLimitEndTime,
                }
                : undefined,
            undefined,
            undefined,
            assn.boundNameAndUID?.uid,
            assn.authLevel,
            undefined,
            undefined,
            undefined,
            operationIdentifier,
            undefined,
            undefined,
            i,
            undefined,
            undefined,
        );
        const newArgument: SearchArgument = ("signed" in argument)
            ? argument
            : {
                unsigned: new SearchArgumentData(
                    jarg.joinBaseObject,
                    jarg.joinSubset,
                    jarg.joinFilter,
                    undefined,
                    jarg.joinSelection,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    data.joinType,
                ),
            };
        try {
            const response = await OperationDispatcher.dispatchLocalSearchDSPRequest(
                ctx,
                assn,
                state.invokeId,
                newArgument,
                newChaining,
            );
            if ("result" in response && response.result) {
                // i) If the result is signed, add it to uncorrelatedSearchInfo in SearchResult.
                // ii) If the result is not signed, perform the join process as specified in Rec. ITU-T X.511 | ISO/IEC 9594-3.
                if (("unsigned" in response.result) && ("searchInfo" in response.result.unsigned)) {
                    // This implementation does not actually check for duplicates.
                    search.results.push(...response.result.unsigned.searchInfo.entries);
                } else {
                    search.resultSets.push(response.result);
                }
            } else {
                continue;
            }
        } catch (e) {
            if (
                (e instanceof errors.ReferralError)
                || (
                    (e instanceof errors.ServiceError)
                    && (
                        (e.data.problem === ServiceProblem_busy)
                        || (e.data.problem === ServiceProblem_unavailable)
                    )
                )
            ) {
                const cr: ContinuationReference = (e instanceof errors.ReferralError)
                    ? e.data.candidate
                    : new ContinuationReference(
                        chaining?.targetObject
                            ? {
                                rdnSequence: chaining.targetObject,
                            }
                            : data.baseObject,
                        chaining?.aliasedRDNs,
                        chaining?.operationProgress ?? ChainingArguments._default_value_for_operationProgress,
                        undefined,
                        ReferenceType_self,
                        [ // REVIEW: I _assume_ we want the CR to point to this current DSA. Is that right?
                            new AccessPointInformation(
                                ctx.dsa.accessPoint.ae_title,
                                ctx.dsa.accessPoint.address,
                                ctx.dsa.accessPoint.protocolInformation,
                                undefined,
                                undefined,
                                undefined,
                            ),
                        ],
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                    );
                if (!search.poq) {
                    search.poq = new PartialOutcomeQualifier(
                        undefined,
                        [ cr ],
                    );
                } else if (!search.poq.unexplored) {
                    search.poq = new PartialOutcomeQualifier(
                        search.poq.limitProblem,
                        [ cr ],
                        search.poq.unavailableCriticalExtensions,
                        search.poq.unknownErrors,
                        search.poq.queryReference,
                        search.poq.overspecFilter,
                        search.poq.notification,
                        search.poq.entryCount,
                    );
                } else {
                    search.poq.unexplored.push(cr);
                }
            } else {
                continue;
            }
        }
    }
}

export default relatedEntryProcedure;
