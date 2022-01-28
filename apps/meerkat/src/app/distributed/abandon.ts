import { Context, ClientAssociation } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
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
import { DER } from "asn1-ts/dist/node/functional";

export
async function abandon (
    ctx: Context,
    conn: ClientAssociation,
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_AbandonArgument(request.argument);
    const data = getOptionallyProtectedValue(argument);
    if (!("present" in data.invokeID)) {
        throw new errors.AbandonFailedError(
            ctx.i18n.t("err:no_invoke_id_specified"),
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    const invokeID = data.invokeID.present;
    const op = conn.invocations.get(Number(invokeID));
    if (!op) {
        throw new errors.AbandonFailedError(
            ctx.i18n.t("err:invocation_not_found", {
                id: invokeID,
            }),
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }
    if (op.pointOfNoReturnTime || op.abandonTime) {
        throw new errors.AbandonFailedError(
            ctx.i18n.t("err:too_late_to_abandon", {
                id: invokeID,
            }),
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
    }

    /**
     * Yes, there is a race condition here: it is possible that the
     * `pointOfNoReturnTime` field could get set immediately after it is checked
     * in this function, but before we listen for the abandonment
     * acknowledgement. However, this is not really a problem, because it then
     * waits for the timeout.
     */
    op.abandonTime = new Date();
    const acknowledgement = await Promise.race<number | undefined>([
        new Promise<number>((resolve) => op.events.once("abandon", () => resolve(Number(invokeID)))),
        new Promise<undefined>((_, reject) => setTimeout(reject, 3000)), // Wait three seconds before timing out.
    ]);
    if (acknowledgement !== invokeID) {
        throw new errors.AbandonFailedError(
            ctx.i18n.t("err:too_late_to_abandon", {
                id: invokeID,
            }),
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
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
        );
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
        _encode_AbandonResult(result, DER),
    );
}

export default abandon;
