import type { Context } from "../types";
import { AccessPointInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import connect from "../net/connect";
import { AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import {
    referral,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceProblem_busy,
    ServiceProblem_unavailable,
    ServiceProblem_unwillingToPerform,
    ServiceProblem_invalidReference,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import type { ChainedRequest } from "@wildboar/x500/src/lib/types/ChainedRequest";
import type { ChainedResultOrError } from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import type { Chained } from "@wildboar/x500/src/lib/types/Chained";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 } from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { DER } from "asn1-ts/dist/node/functional";

function cloneChainingArgs (chaining: ChainingArguments): ChainingArguments {
    return new ChainingArguments(
        chaining.originator,
        chaining.targetObject,
        chaining.operationProgress,
        chaining.traceInformation,
        chaining.aliasDereferenced,
        chaining.aliasedRDNs,
        chaining.returnCrossRefs,
        chaining.referenceType,
        chaining.info,
        chaining.timeLimit,
        chaining.securityParameters,
        chaining.entryOnly,
        chaining.uniqueIdentifier,
        chaining.authenticationLevel,
        chaining.exclusions,
        chaining.excludeShadows,
        chaining.nameResolveOnMaster,
        chaining.operationIdentifier,
        chaining.searchRuleId,
        chaining.chainedRelaxation,
        chaining.relatedEntry,
        chaining.dspPaging,
        chaining.excludeWriteableCopies,
    );
}

export
async function apinfoProcedure (
    ctx: Context,
    apis: AccessPointInformation[],
    req: ChainedRequest,
): Promise<ChainedResultOrError | null> {
    // TODO: Loop AVOIDANCE, not loop DETECTION.
    // if (loopDetected(chaining.traceInformation)) {
    //     throw new errors.ServiceError(
    //         "Loop detected.",
    //         new ServiceErrorData(
    //             ServiceProblem_loopDetected,
    //             [],
    //             undefined,
    //             undefined,
    //             undefined,
    //             undefined,
    //         ),
    //     );
    // }
    const chainingArgs: ChainingArguments = cloneChainingArgs(req.chaining);
    // TODO: Set chainingArgs.excludeShadows
    // TODO: Set chainingArgs.nameResolveOnMaster
    for (const api of apis) {
        const ap = new AccessPoint(
            api.ae_title,
            api.address,
            api.protocolInformation,
        );
        const connection = await connect(ctx, ap, dsp_ip["&id"]!);
        if (!connection) {
            continue;
        }
        const argument: Chained = {
            unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                chainingArgs,
                req.argument!,
            ),
        }
        try {
            const result = await connection.writeOperation({
                opCode: req.opCode,
                argument: chainedRead.encoderFor["&ArgumentType"]!(argument, DER),
            });
            if ("error" in result) {
                const errcode: Code = result.errcode ?? { local: -1 };
                if (compareCode(errcode, referral["&errorCode"]!)) {
                    /**
                     * Effectively, this means that the local policy is to
                     * always return the referral. I prefer to take this
                     * approach, because using the referral means that the
                     * next step is to empty the NRContinuationList. This is
                     * problematic, because the NRContinuationList is used
                     * by the function that calls this APInfo procedure in
                     * a loop! This sounds like a great way to introduce
                     * impossible-to-diagnose bugs.
                     *
                     * This also means we do not need to pass in the CR, which
                     * has the returnToDUA setting.
                     */
                    return result;
                } else if (compareCode(errcode, serviceError["&errorCode"]!)) {
                    const param = serviceError.decoderFor["&ParameterType"]!(result.error!);
                    const errorData = getOptionallyProtectedValue(param);
                    if (
                        (errorData.problem === ServiceProblem_busy)
                        || (errorData.problem === ServiceProblem_unavailable)
                        || (errorData.problem === ServiceProblem_unwillingToPerform)
                        || (errorData.problem === ServiceProblem_invalidReference)
                    ) {
                        continue; // Always try another.
                    } else {
                        return result;
                    }
                } else {
                    return result;
                }
            } else {
                const decodedArg = chainedRead.decoderFor["&ResultType"]!(result.result!);
                const decodedArgData = getOptionallyProtectedValue(decodedArg);
                if (!result.opCode) {
                    ctx.log.warn(`This DSA returned a result with no opCode, which might have been malicious: `, api.ae_title);
                    continue;
                }
                return {
                    invokeId: result.invokeId,
                    opCode: result.opCode,
                    chaining: decodedArgData.chainedResult,
                    result: result.result,
                };
            }
        } catch (e) {
            ctx.log.warn(`Unable to access DSA `, api.ae_title);
            continue;
        }
    }
    return null;
}
