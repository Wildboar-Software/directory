import type { Context } from "@wildboar/meerkat-types";
import type DOPAssociation from "../DOPConnection";
import * as errors from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import type {
    TerminateOperationalBindingArgumentData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgumentData.ta";
import type {
    TerminateOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";
import {
    TerminateOperationalBindingResultData,
    _encode_TerminateOperationalBindingResultData,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResultData.ta";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import {
    OpBindingErrorParam,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam.ta";
import {
    OpBindingErrorParam_problem_unsupportedBindingType,
    OpBindingErrorParam_problem_invalidID,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import { FALSE, unpackBits } from "asn1-ts";
import { differenceInMilliseconds } from "date-fns";
import terminate from "../terminateByID";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    id_err_operationalBindingError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-err-operationalBindingError.va";
import { setTimeout as safeSetTimeout } from "safe-timers";
import { getDateFromOBTime } from "../getDateFromOBTime";
import { printInvokeId } from "../../utils/printInvokeId";
import {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import {
    ProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ProtectionRequest.ta";
import {
    ErrorProtectionRequest_signed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ErrorProtectionRequest.ta";
import { generateSignature } from "../../pki/generateSignature";
import { SIGNED } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import {
    id_op_terminateOperationalBinding,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-op-terminateOperationalBinding.va";
import { rdnFromJson } from "../../x500/rdnFromJson";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    compareDistinguishedName,
} from "@wildboar/x500";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";

/**
 * @summary Terminates an operational binding, as described in ITU Recommendation X.501.
 * @description
 *
 * This function implements the `terminateOperationalBinding` operation
 * described in ITU Recommendation X.501 (2016), Section 28.4.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param arg The `TerminateOperationalBindingArgument` argument
 * @returns The `TerminateOperationalBindingResult` result
 *
 * @function
 * @async
 */
export
async function terminateOperationalBinding (
    ctx: Context,
    assn: DOPAssociation,
    invokeId: InvokeId,
    arg: TerminateOperationalBindingArgument,
): Promise<TerminateOperationalBindingResult> {
    const data: TerminateOperationalBindingArgumentData = getOptionallyProtectedValue(arg);
    // DOP associations are ALWAYS authorized to receive signed responses.
    const signResult: boolean = (data.securityParameters?.target === ProtectionRequest_signed);
    const signErrors: boolean = (data.securityParameters?.errorProtection === ErrorProtectionRequest_signed);
    if (!assn.boundNameAndUID?.dn) {
        throw new errors.SecurityError(
            ctx.i18n.t("err:anon_dop"),
            new SecurityErrorData(
                SecurityProblem_insufficientAccessRights,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn?.boundNameAndUID?.dn,
                    undefined,
                    securityError["&errorCode"],
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                FALSE,
                undefined,
            ),
            signErrors,
        );
    }
    ctx.log.info(ctx.i18n.t("log:terminateOperationalBinding", {
        context: "started",
        type: data.bindingType.toString(),
        bid: data.bindingID?.identifier.toString(),
        aid: assn.id,
    }), {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId(invokeId),
    });
    const NOT_SUPPORTED_ERROR = new errors.OperationalBindingError(
        ctx.i18n.t("err:ob_type_unrecognized", {
            obtype: data.bindingType.toString(),
        }),
        new OpBindingErrorParam(
            OpBindingErrorParam_problem_unsupportedBindingType,
            data.bindingType,
            undefined,
            undefined,
            [],
            createSecurityParameters(
                ctx,
                signErrors,
                assn.boundNameAndUID?.dn,
                undefined,
                id_err_operationalBindingError,
            ),
            ctx.dsa.accessPoint.ae_title.rdnSequence,
            undefined,
            undefined,
        ),
        signErrors,
    );

    const now = new Date();
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const obs = (await ctx.db.operationalBinding.findMany({
        where: {
            accepted: true,
            binding_type: data.bindingType.toString(),
            binding_identifier: Number(data.bindingID.identifier),
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            access_point: {
                select: {
                    ae_title: true,
                },
            },
        },
    }))
        .filter((ob) => {
            if (!ob.access_point) {
                return false;
            }
            const authorized_ae_title: DistinguishedName | undefined = Array.isArray(ob.access_point.ae_title)
                ? ob.access_point.ae_title.map((rdn: Record<string, string>) => rdnFromJson(rdn))
                : undefined;
            if (!authorized_ae_title) {
                return false;
            }
            const modifier_is_originator: boolean = compareDistinguishedName(
                authorized_ae_title,
                assn.boundNameAndUID!.dn,
                NAMING_MATCHER,
            );
            return modifier_is_originator;
        });

    if (obs.length === 0) {
        throw new errors.OperationalBindingError(
            ctx.i18n.t("err:no_ob_with_id", {
                id: data.bindingID.identifier,
            }),
            new OpBindingErrorParam(
                OpBindingErrorParam_problem_invalidID,
                data.bindingType,
                undefined,
                undefined,
                [],
                createSecurityParameters(
                    ctx,
                    signErrors,
                    assn.boundNameAndUID?.dn,
                    undefined,
                    id_err_operationalBindingError,
                ),
                ctx.dsa.accessPoint.ae_title.rdnSequence,
                undefined,
                undefined,
            ),
            signErrors,
        );
    }

    const terminationTime: Date = data.terminateAt
        ? getDateFromOBTime(data.terminateAt)
        : now;

    const resultData = new TerminateOperationalBindingResultData(
        data.bindingID,
        data.bindingType,
        terminationTime,
        [],
        createSecurityParameters(
            ctx,
            signResult,
            assn.boundNameAndUID?.dn,
            id_op_terminateOperationalBinding,
        ),
        ctx.dsa.accessPoint.ae_title.rdnSequence,
        undefined,
        undefined,
    );

    switch (data.bindingType.toString()) {
        case (id_op_binding_hierarchical.toString()): {
            for (const ob of obs) {
                safeSetTimeout(
                    () => terminate(ctx, ob.id),
                    Math.max(differenceInMilliseconds(terminationTime, now), 1000),
                );
            }
            await ctx.db.operationalBinding.updateMany({
                where: {
                    id: {
                        in: obs.map((ob) => ob.id),
                    },
                },
                data: {
                    terminated_time: terminationTime,
                },
            });
            ctx.log.info(ctx.i18n.t("log:terminateOperationalBinding", {
                context: "succeeded",
                type: data.bindingType.toString(),
                bid: data.bindingID?.identifier.toString(),
                aid: assn.id,
            }), {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
                invokeID: printInvokeId(invokeId),
            });
            const unsignedResult: TerminateOperationalBindingResult = {
                protected_: {
                    unsigned: resultData,
                },
            };
            if (!signResult) {
                return unsignedResult;
            }
            const resultDataBytes = _encode_TerminateOperationalBindingResultData(resultData, DER).toBytes();
            const key = ctx.config.signing?.key;
            if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
                return unsignedResult;
            }
            const signingResult = generateSignature(key, resultDataBytes);
            if (!signingResult) {
                return unsignedResult;
            }
            const [ sigAlg, sigValue ] = signingResult;
            return {
                protected_: {
                    signed: new SIGNED(
                        resultData,
                        sigAlg,
                        unpackBits(sigValue),
                        undefined,
                        undefined,
                    ),
                },
            };
        }
        default: {
            throw NOT_SUPPORTED_ERROR;
        }
    }
}

export default terminateOperationalBinding;
