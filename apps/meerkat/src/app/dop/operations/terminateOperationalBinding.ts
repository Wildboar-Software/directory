import type DOPAssociation from "../DOPConnection";
import * as errors from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import type {
    OperationalBindingID,
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
    OpBindingErrorParam_problem_currentlyNotDecidable,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OpBindingErrorParam-problem.ta";
import { ASN1Construction, ASN1TagClass, FALSE, OBJECT_IDENTIFIER, packBits, unpackBits } from "asn1-ts";
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
import { MeerkatContext } from "../../ctx";
import { AccessPoint, _decode_AccessPoint } from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import { terminateByTypeAndBindingID } from "../terminateByTypeAndBindingID";
import { timingSafeEqual } from "crypto";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import stringifyDN from "../../x500/stringifyDN";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { cacheNamingContexts } from "../../dit/cacheNamingContexts";


async function relayedTerminateOperationalBinding (
    ctx: MeerkatContext,
    assn: DOPAssociation,
    invokeId: InvokeId,
    bindingType: OBJECT_IDENTIFIER,
    bindingID: OperationalBindingID,
    relayTo: AccessPoint,
    signErrors: boolean,
): Promise<TerminateOperationalBindingResult> {
    const now = new Date();
    const outcome = await terminateByTypeAndBindingID(
        ctx,
        assn,
        relayTo,
        bindingType,
        bindingID,
        FALSE,
        signErrors,
    );
    // We update the cached naming contexts, which might have changed.
    cacheNamingContexts(ctx);
    const ob = await ctx.db.operationalBinding.findFirst({
        // We only want the most recent operational binding.
        // This should be taken care of by the `where.next_version` below, but
        // this is extra assurance that we get the right one.
        orderBy: {
            requested_time: "desc",
        },
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             *
             * See: https://github.com/prisma/prisma/discussions/2772#discussioncomment-1712222
             */
            next_version: {
                none: {},
            },
            accepted: true,
            binding_type: bindingType.toString(),
            binding_identifier: Number(bindingID.identifier),
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
        },
    });
    if (ob) {
        await terminate(ctx, ob.id);
    }
    let err_message: string = "";
    if ("result" in outcome) {
        return outcome.result.parameter;
    }
    else if ("error" in outcome) {
        throw new errors.ChainedError(
            ctx.i18n.t("err:chained_error"),
            outcome.error.parameter,
            outcome.error.code,
            signErrors,
        );
    }
    else if ("reject" in outcome) {
        throw new errors.ChainedReject(
            ("present" in invokeId)
                ? invokeId.present
                : -1,
            outcome.reject.problem,
        );
    }
    else if ("abort" in outcome) {
        throw new errors.ChainedAbort(outcome.abort);
    }
    else if ("timeout" in outcome) {
        err_message = ctx.i18n.t("err:relayed_dop_timeout");
    }
    else {
        err_message = ctx.i18n.t("err:relayed_dop_other_error");
    }
    throw new errors.OperationalBindingError(
        err_message,
        new OpBindingErrorParam(
            OpBindingErrorParam_problem_currentlyNotDecidable,
            bindingType,
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
    ctx: MeerkatContext,
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

    const relayToElement = data._unrecognizedExtensionsList.find((ext) => (
        (ext.tagClass === ASN1TagClass.private)
        && (ext.tagNumber === 0)
        && (ext.construction === ASN1Construction.constructed)
    ))?.inner;
    if (relayToElement) {
        const user_cert = data.securityParameters?.certification_path?.userCertificate;
        const dsa_cert = [ ...ctx.config.signing.certPath ?? [] ].pop();
        const user_sig = packBits(user_cert?.signature ?? new Uint8ClampedArray());
        const dsa_sig = packBits(dsa_cert?.signature ?? new Uint8ClampedArray());
        /* We check if the request was signed with the exact same certificate
        that the DSA is using for signatures. If they match, the user is
        authorized on behalf of the DSA itself to establish a new operational
        binding. We do not need to check the signatures or certification path
        here, because it was already done before this function was invoked. */
        if (
            !("signed" in arg)
            || !user_cert
            || !dsa_cert
            || (user_cert.toBeSigned.serialNumber.toString() !== dsa_cert.toBeSigned.serialNumber.toString())
            || (user_sig.length !== dsa_sig.length)
            || !timingSafeEqual(user_sig, dsa_sig)
        ) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:must_have_dsa_keys_for_relayed_dop"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
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
        const relayToAccessPoint = _decode_AccessPoint(relayToElement);
        return relayedTerminateOperationalBinding(
            ctx,
            assn,
            invokeId,
            data.bindingType,
            data.bindingID,
            relayToAccessPoint,
            signErrors,
        );
    }

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
            uuid: true,
            access_point: {
                select: {
                    id: true,
                    ae_title: true,
                },
            },
        },
    }))
        .filter((ob) => {
            if (!ob.access_point) {
                ctx.log.warn(ctx.i18n.t("log:ob_has_no_access_point", { uuid: ob.uuid }));
                return false;
            }
            const authorized_ae_title: DistinguishedName | undefined = Array.isArray(ob.access_point.ae_title)
                ? ob.access_point.ae_title.map((rdn: Record<string, string>) => rdnFromJson(rdn))
                : undefined;
            if (!authorized_ae_title) {
                ctx.log.warn(ctx.i18n.t("log:ap_missing_ae_title", { id: ob.access_point.id }));
                return false;
            }
            const modifier_is_originator: boolean = compareDistinguishedName(
                authorized_ae_title,
                assn.boundNameAndUID!.dn,
                NAMING_MATCHER,
            );
            if (!modifier_is_originator) {
                const logInfo = {
                    type: data.bindingType.toString(),
                    obid: data.bindingID?.identifier.toString(),
                    uuid: ob.uuid,
                    owner: stringifyDN(ctx, authorized_ae_title),
                    impostor: stringifyDN(ctx, assn.boundNameAndUID!.dn),
                };
                ctx.log.warn(ctx.i18n.t("log:ob_terminate_attempt_by_other_ae", logInfo), logInfo);
            }
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
        case (id_op_binding_hierarchical.toString()):
        case (id_op_binding_non_specific_hierarchical.toString()):
        case (id_op_binding_shadow.toString()):
        {
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
            throw new errors.OperationalBindingError(
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
        }
    }
}

export default terminateOperationalBinding;
