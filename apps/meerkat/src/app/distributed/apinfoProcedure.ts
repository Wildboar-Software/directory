import type { Context } from "../types";
import { BOOLEAN, ASN1TagClass, TRUE_BIT } from "asn1-ts";
import { AccessPointInformation } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPointInformation.ta";
import { ChainingArguments } from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingArguments.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import connect from "../net/connect";
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
import {
    MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    MasterOrShadowAccessPoint_category_shadow,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint-category.ta";
import {
    ServiceControlOptions_chainingProhibited as chainingProhibitedBit,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import isModificationOperation from "../x500/isModificationOperation";
import {
    OperationProgress_nameResolutionPhase_proceeding as proceeding,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import {
    ReferenceType_nonSpecificSubordinate as nssr,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ReferenceType.ta";
import cloneChainingArguments from "../x500/cloneChainingArguments";

export
async function apinfoProcedure (
    ctx: Context,
    api: AccessPointInformation,
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
    const serviceControls = req.argument?.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 30)
        ))?.inner;
    const serviceControlOptions = serviceControls?.set
        .find((el) => (
            (el.tagClass === ASN1TagClass.context)
            && (el.tagNumber === 0)
        ))?.inner;
    const chainingProhibited = (serviceControlOptions?.bitString?.[chainingProhibitedBit] === TRUE_BIT);
    if (chainingProhibited) {
        return null;
    }
    const excludeShadows: BOOLEAN = req.chaining.excludeShadows ?? ChainingArguments._default_value_for_excludeShadows;
    const nameResolveOnMaster: BOOLEAN = req.chaining.nameResolveOnMaster
        ?? ChainingArguments._default_value_for_nameResolveOnMaster;
    const nameResolutionIsProceeding: boolean = (req.chaining.operationProgress?.nameResolutionPhase === proceeding);
    const chainingArgs: ChainingArguments = cloneChainingArguments(req.chaining, {
        nameResolveOnMaster: (
            (nameResolutionIsProceeding && nameResolveOnMaster)
            || (isModificationOperation(req.opCode) && (req.chaining.referenceType === nssr))
        ),
    });
    const accessPoints: MasterOrShadowAccessPoint[] = [
        new MasterOrShadowAccessPoint(
            api.ae_title,
            api.address,
            api.protocolInformation,
            undefined,
            undefined,
        ),
        ...api.additionalPoints ?? [],
    ];
    for (const ap of accessPoints) {
        // TODO: Check if localScope.
        if (
            (ap.category === MasterOrShadowAccessPoint_category_shadow)
            && (
                excludeShadows
                || (nameResolutionIsProceeding && nameResolveOnMaster)
            )
        ) {
            continue;
        }
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
