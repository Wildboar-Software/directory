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

/**
 * @summary The abandon operation, as specified in ITU Recommendation X.511.
 * @description
 *
 * The `abandon` operation, as specified in ITU Recommendation X.511 (2016),
 * Section 10.3. per the recommended implementation in ITU Recommendation X.518
 * (2016), Section 20.5.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The chained abandon
 * @returns A chained result
 *
 * @function
 * @async
 */
export
async function abandon (
    ctx: Context,
    assn: ClientAssociation,
    request: ChainedArgument,
): Promise<ChainedResult> {
    const argument = _decode_AbandonArgument(request.argument);
    // #region Signature validation
    /**
     * Integrity of the signature SHOULD be evaluated at operation evaluation,
     * not before. Because the operation could get chained to a DSA that has a
     * different configuration of trust anchors. To be clear, this is not a
     * requirement of the X.500 specifications--just my personal assessment.
     */
     if ("signed" in argument) {
        /*
         No signature verification takes place for the abandon operation,
         because it does not have a `SecurityParameters` field, and therefore
         does not relay a certification-path.
         */
    }
    // #endregion Signature validation
    const data = getOptionallyProtectedValue(argument);
    const signErrors: boolean = false;
    if (!("present" in data.invokeID)) {
        throw new errors.AbandonFailedError(
            ctx.i18n.t("err:no_invoke_id_specified"),
            new AbandonFailedData(
                AbandonProblem_cannotAbandon,
                data.invokeID,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_abandonFailed,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }
    const invokeID = data.invokeID.present;
    const op = assn.invocations.get(Number(invokeID));
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
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_abandonFailed,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
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
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_abandonFailed,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
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
        new Promise<undefined>((resolve) => setTimeout(resolve, 3000)), // Wait three seconds before timing out.
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
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_errcode_abandonFailed,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    /**
     * Abandon results will never be signed by Meerkat DSA, because there is no
     * security parameters in the request, so a user cannot specify that they
     * want the results to be signed. Since abandon results are generally not
     * sensitive, Meerkat DSA chooses to avoid signing these results.
     */
    const signResult: boolean = false;
    const result: AbandonResult = {
        null_: null,
    };
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            createSecurityParameters(
                ctx,
                signResult,
                assn.boundNameAndUID?.dn,
                id_opcode_abandon,
            ),
            undefined,
        ),
        _encode_AbandonResult(result, DER),
    );
}

export default abandon;
