import type { ClientAssociation, Context } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import {
    SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import {
    SearchArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData.ta";
import {
    ChainingArguments,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import OperationDispatcher from "./OperationDispatcher";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import {
    ReferenceType_self,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import {
    AccessPointInformation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import {
    ServiceProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    AbandonedData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import type { SearchState } from "./search_i";
import {
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import { chainedSearch } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedSearch.oa";
import type { INTEGER } from "asn1-ts";
import { randomInt } from "crypto";

export
async function relatedEntryProcedure (
    ctx: Context,
    conn: ClientAssociation,
    state: OperationDispatcherState,
    search: SearchState,
    argument: SearchArgument,
    chaining?: ChainingArguments,
): Promise<void> {
    const op = ("present" in state.invokeId)
        ? conn.invocations.get(Number(state.invokeId.present))
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        serviceError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    chaining?.aliasDereferenced,
                    undefined,
                ),
            );
        }
    };
    const data = getOptionallyProtectedValue(argument);
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
                        conn.boundNameAndUID?.dn,
                        undefined,
                        abandoned["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    state.chainingArguments.aliasDereferenced,
                    undefined,
                ),
            );
        }
        checkTimeLimit();
        const jarg = data.joinArguments[i];
        const operationIdentifier: INTEGER = randomInt(2147483648);
        ctx.log.debug(ctx.i18n.t("log:continuing_name_resolution", {
            opid: operationIdentifier,
        }));
        const newChaining = new ChainingArguments(
            chaining?.originator,
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
            createSecurityParameters(
                ctx,
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                chainedSearch["&operationCode"],
            ),
            undefined,
            conn.boundNameAndUID?.uid,
            conn.authLevel,
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
                conn,
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
