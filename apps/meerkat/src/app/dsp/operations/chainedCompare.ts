import { Context } from "../../types";
import {
    chainedCompare as operation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedCompare.oa";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import {
    loopDetected,
} from "@wildboar/x500/src/lib/distributed/loopDetected";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_loopDetected,
    ServiceProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import * as errors from "../../errors";
import {
    CompareArgument,
    _decode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    OperationProgress,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress.ta";
import {
    OperationProgress_nameResolutionPhase_notStarted,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/OperationProgress-nameResolutionPhase.ta";
import findEntry from "../../x500/findEntry";

const defaultOperationProgres: OperationProgress = new OperationProgress(
    OperationProgress_nameResolutionPhase_notStarted,
    undefined,
);

export
async function chainedCompare (
    ctx: Context,
    arg: typeof operation["&ArgumentType"],
): Promise<typeof operation["&ResultType"]> {
    const now = new Date();
    const data: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    ctx.log.info(`Received chained compare operation ${data.chainedArgument.operationIdentifier}.`);
    if (loopDetected(data.chainedArgument.traceInformation)) {
        throw new errors.ServiceError(
            "Loop detected.",
            new ServiceErrorData(
                ServiceProblem_loopDetected,
                [],
                undefined,
                undefined,
                undefined,
                undefined,
            ),
        );
    }
    if (data.chainedArgument.timeLimit) {
        const timeLimit: Date = ("generalizedTime" in data.chainedArgument.timeLimit)
            ? data.chainedArgument.timeLimit.generalizedTime
            : data.chainedArgument.timeLimit.utcTime;
        if (now > timeLimit) {
            throw new errors.ServiceError(
                "Time limit exceeded.",
                new ServiceErrorData(
                    ServiceProblem_timeLimitExceeded,
                    [],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    const operationProgress: OperationProgress = data.chainedArgument.operationProgress
        ?? defaultOperationProgres;



    const dapArg: CompareArgument = _decode_CompareArgument(data.argument);
    const dapData = ("signed" in dapArg)
        ? dapArg.signed.toBeSigned
        : dapArg.unsigned;

    data.chainedArgument.operationProgress
    // Check if the object falls beneath the local context prefix and chain the request elsewhere if so.

    return {
        unsigned: new Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(
            new ChainingResults(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
            ),
            data.argument, // FIXME:
        ),
    };
}

export default chainedCompare;
