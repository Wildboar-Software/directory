import type { MeerkatContext } from "../ctx";
import type { ClientAssociation } from "@wildboar/meerkat-types";
import DSPAssociation from "../dsp/DSPConnection";
import { TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ListArgument,
    _encode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import { chainedList } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedList.oa";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
    ServiceControlOptions_manageDSAIT as manageDSAITBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import { compareAuthenticationLevel, ChainedRequest, getOptionallyProtectedValue, compareCode } from "@wildboar/x500";
import { apinfoProcedure } from "./apinfoProcedure";
import type { OperationDispatcherState } from "./OperationDispatcher";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { randomInt } from "node:crypto";
import { id_opcode_list } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import { OperationProgress } from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    OperationProgress_nameResolutionPhase_completed,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import cloneChainingArgs from "../x500/cloneChainingArguments";
import createSecurityParameters from "../x500/createSecurityParameters";
import type { ListState } from "./list_i";
import {
    ContinuationReference,
    PartialOutcomeQualifier,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PartialOutcomeQualifier.ta";
import {
    _decode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResultData.ta";

/**
 * @summary List Continuation Reference Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The List Continuation Reference Procedure, as defined in ITU Recommendation
 * X.518 (2016), Section 20.4.2.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The list argument
 * @param listState The list operation state
 * @param state The operation dispatcher state
 *
 * @function
 * @async
 */
export
async function lcrProcedure (
    ctx: MeerkatContext,
    assn: ClientAssociation,
    arg: ListArgument,
    listState: ListState,
    state: OperationDispatcherState,
): Promise<void> {
    // This function will not get called if a limit has been exceeded, so step #1 is done.
    const data = getOptionallyProtectedValue(arg);
    // Step #2
    const chainingProhibited = (
        (data.serviceControls?.options?.[chainingProhibitedBit] === TRUE_BIT)
        || (data.serviceControls?.options?.[manageDSAITBit] === TRUE_BIT)
    );
    const insufficientAuthForChaining = assn && (
        (
            ("basicLevels" in assn.authLevel)
            && (compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.chaining.minAuthRequired,
                assn.authLevel.basicLevels,
            ))
        )
        || !("basicLevels" in assn.authLevel)
    );
    if (chainingProhibited || insufficientAuthForChaining) {
        return;
    }
    const parallel: boolean = false; // TODO: Make this configurable.
    const signErrors: boolean = (
        (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn.authorizedForSignedErrors)
    );
    const requestor: DistinguishedName | undefined = state.chainingArguments.originator
        ?? assn?.boundNameAndUID?.dn;
    const signDSPResult: boolean = (
        (state.chainingArguments.securityParameters?.errorProtection === ErrorProtectionRequest_signed)
        && (assn instanceof DSPAssociation)
        && assn.authorizedForSignedResults
    );

    // Part of Step #3
    const processContinuationReference = async (cr: ContinuationReference): Promise<void> => {
        let crLeftUnexplored: boolean = false;
        const unexplore = () => {
            if (crLeftUnexplored) {
                return; // We already added this CR back to unexplored.
            }
            crLeftUnexplored = true;
            if (listState.poq) {
                if (listState.poq.unexplored) {
                    listState.poq.unexplored.push(cr);
                } else {
                    listState.poq = new PartialOutcomeQualifier(
                        listState.poq.limitProblem,
                        [ cr ],
                        listState.poq.unavailableCriticalExtensions,
                        listState.poq.unknownErrors,
                        listState.poq.queryReference,
                        listState.poq.overspecFilter,
                        listState.poq.notification,
                        listState.poq.entryCount,
                    );
                }
            }
        };
        for (const api of cr.accessPoints) {
            const invokeId: number = randomInt(2147483648);
            const req: ChainedRequest = {
                chaining: cloneChainingArgs(state.chainingArguments, {
                    originator: requestor,
                    targetObject: state.SRcontinuationList[0].targetObject.rdnSequence,
                    operationProgress: new OperationProgress(
                        OperationProgress_nameResolutionPhase_completed,
                        undefined,
                    ),
                    securityParameters: createSecurityParameters(
                        ctx,
                        signDSPResult,
                        api.ae_title.rdnSequence,
                        id_opcode_list,
                    ),
                }),
                invokeId: {
                    present: invokeId,
                },
                opCode: id_opcode_list,
                argument: _encode_ListArgument(arg, DER),
            };
            const response = await apinfoProcedure(ctx, api, req, assn, state, signErrors, chainingProhibited);
            if (!response) {
                unexplore();
                continue;
            }
            if ("error" in response) {
                // TODO: Log
                unexplore();
                continue;
            }
            if (!response.result) {
                // TODO: This is sketchy. Log it.
                unexplore();
                continue;
            }
            // TODO: Shouldn't things like this be checked in apinfoProcedure?
            if (!("present" in response.invokeId)) {
                // TODO: This is sketchy. Log it.
                unexplore();
                continue;
            }
            if (Number(response.invokeId.present) !== Number(invokeId)) {
                // TODO: This is a bug. Log it.
                unexplore();
                continue;
            }
            if (!response.opCode) {
                // TODO: This is sketchy. Log it.
                unexplore();
                continue;
            }
            if (!compareCode(response.opCode, id_opcode_list)) {
                // TODO: This is sketchy. Log it.
                unexplore();
                continue;
            }
            try {
                // NOTE: You do not need to check signatures. That was
                // already handled by apInfoProcedure().
                const chainedResult = chainedList.decoderFor["&ResultType"]!(response.result);
                const chainedResultData = getOptionallyProtectedValue(chainedResult);
                const listResult = _decode_ListResult(chainedResultData.result);
                // Whether signed or not, we still just add the list result.
                // This preserves the performer.
                listState.resultSets.push(listResult);
            } catch (e) {
                // TODO: Log e
                ctx.log.warn(e);
            }
        }
    };

    // Step #3
    // NOTE: all continuation references should have the same targetObject.
    if (parallel) {
        await Promise.all(state.SRcontinuationList.map(processContinuationReference));
    } else {
        for (const cr of state.SRcontinuationList) {
            await processContinuationReference(cr);
        }
    }

    // Step #4
    return;
}

export default lcrProcedure;
