import { Context, ClientConnection } from "../types";
import * as errors from "../errors";
import { DERElement } from "asn1-ts";
import {
    _decode_AbandonArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgument.ta";
import {
    AbandonResult,
    _encode_AbandonResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonResult.ta";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_abandon,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-abandon.va";
import { AbandonFailedData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonFailedData.ta";
import {
    AbandonProblem_tooLate,
    AbandonProblem_cannotAbandon,
    AbandonProblem_noSuchOperation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonProblem.ta";
import {
    id_errcode_abandonFailed,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-abandonFailed.va";
import { compareCode } from "@wildboar/x500/src/lib/utils/compareCode";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
// import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
// import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";

export
async function abandon (
    ctx: Context,
    conn: ClientConnection,
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_AbandonArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    if ("present" in data.invokeID) {
        const op = conn.invocations.get(data.invokeID.present);
        if (op) {
            if (
                !compareCode(op.operationCode!, list["&operationCode"]!)
                && !compareCode(op.operationCode!, search["&operationCode"]!)
            ) {
                throw new errors.AbandonFailedError(
                    "Only list and search operations may be abandoned.",
                    new AbandonFailedData(
                        AbandonProblem_cannotAbandon,
                        data.invokeID,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_abandonFailed,
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            if (op.resultTime) {
                throw new errors.AbandonFailedError(
                    `Invocation ${data.invokeID.present} already finished.`,
                    new AbandonFailedData(
                        AbandonProblem_tooLate,
                        data.invokeID,
                        [],
                        createSecurityParameters(
                            ctx,
                            conn.boundNameAndUID?.dn,
                            undefined,
                            id_errcode_abandonFailed,
                        ),
                        undefined,
                        undefined,
                        undefined,
                    ),
                );
            }
            op.abandonTime = new Date();
        } else {
            // nosuchoperation
            throw new errors.AbandonFailedError(
                `Invocation ${data.invokeID.present} cound not be found.`,
                new AbandonFailedData(
                    AbandonProblem_noSuchOperation,
                    data.invokeID,
                    [],
                    createSecurityParameters(
                        ctx,
                        conn.boundNameAndUID?.dn,
                        undefined,
                        id_errcode_abandonFailed,
                    ),
                    undefined,
                    undefined,
                    undefined,
                ),
            );
        }
    }
    const result: AbandonResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                conn.boundNameAndUID?.dn,
                id_opcode_abandon,
            ),
            undefined,
        ),
        _encode_AbandonResult(result, () => new DERElement()),
    );
}

export default abandon;
