import { Context } from "../../types";
import {
    chainedChangePassword as operation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedChangePassword.oa";
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
import * as errors from "../../dap/errors";

export
async function chainedChangePassword (
    ctx: Context,
    arg: typeof operation["&ArgumentType"],
): Promise<typeof operation["&ResultType"]> {
    const now = new Date();
    const data: Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    ctx.log.info(`Received chained changePassword operation ${data.chainedArgument.operationIdentifier}.`);
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

export default chainedChangePassword;
