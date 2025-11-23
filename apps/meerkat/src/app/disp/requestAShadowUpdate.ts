import type { MeerkatContext } from "../ctx.js";
import { BERElement } from "@wildboar/asn1";
import {
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import { bindForDISP } from "../net/bindToOtherDSA";
import {
    id_ac_shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/DirectoryOSIProtocols";
import { OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import createSecurityParameters from "../x500/createSecurityParameters";
import { compareCode, getOptionallyProtectedValue } from "@wildboar/x500";
import {
    id_errcode_shadowError,
} from "@wildboar/x500/CommonProtocolSpecification";
import { shadowError } from "@wildboar/x500/DirectoryShadowAbstractService";
import stringifyDN from "../x500/stringifyDN";
import printCode from "../utils/printCode";
import { id_opcode_requestShadowUpdate } from "@wildboar/x500/CommonProtocolSpecification";
import {
    RequestShadowUpdateArgumentData_requestedStrategy_standard_incremental,
    RequestShadowUpdateArgumentData_requestedStrategy_standard_total,
} from "@wildboar/x500/DirectoryShadowAbstractService";

/**
 * @summary Request a shadow update from a shadow supplier
 * @description
 *
 * This function causes this DSA to bind to the shadow supplier involved in a
 * shadowing operational binding and request a shadow update. This function also
 * handles unbinding.
 *
 * @param ctx The context object
 * @param obid the database ID of the shadow operational binding for which a
 *  an update is to be requested
 *
 * @async
 * @function
 */
export
async function request_a_shadow_update (
    ctx: MeerkatContext,
    obid: number,
): Promise<void> {
    const ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id: obid,
        },
        select: {
            binding_identifier: true,
            binding_version: true,
            last_update: true,
            local_last_update: true,
            remote_last_update: true,
            requested_strategy: true,
            access_point: {
                select: {
                    ber: true,
                },
            },
        },
    });
    if (!ob?.access_point) {
        ctx.log.error(ctx.i18n.t("log:no_access_point_for_shadow_ob", {
            obid: ob?.binding_identifier.toString(),
        }));
        return;
    }

    const apElement = new BERElement();
    apElement.fromBytes(ob.access_point.ber);
    const accessPoint = _decode_AccessPoint(apElement);

    const disp_client = await bindForDISP(
        ctx,
        undefined,
        undefined,
        accessPoint,
        id_ac_shadowSupplierInitiatedAsynchronousAC,
        undefined,
        true,
    );
    if (!disp_client) {
        ctx.log.warn(ctx.i18n.t("log:disp_association_failed", { obid: ob.binding_identifier }));
        return;
    }
    try {
        const outcome = await disp_client.requestShadowUpdate({
            agreementID: new OperationalBindingID(ob.binding_identifier, ob.binding_version),
            lastUpdate: ob.last_update ?? undefined,
            requestedStrategy: {
                standard: ob.last_update
                    ? RequestShadowUpdateArgumentData_requestedStrategy_standard_incremental
                    : RequestShadowUpdateArgumentData_requestedStrategy_standard_total,
            },
            securityParameters: createSecurityParameters(
                ctx,
                true,
                accessPoint.ae_title.rdnSequence,
                id_opcode_requestShadowUpdate,
            ),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            _unrecognizedExtensionsList: [],
        });
        if ("result" in outcome) {
            ctx.log.debug(ctx.i18n.t("log:requested_shadow_update", {
                context: ob.last_update ? "incremental" : "total",
                obid: ob.binding_identifier,
            }));
        }
        else if ("error" in outcome) {
            if (compareCode(outcome.error.code, id_errcode_shadowError)) {
                const error = shadowError.decoderFor["&ParameterType"]!(outcome.error.parameter);
                const errData = getOptionallyProtectedValue(error);
                const logInfo = {
                    performer: errData.performer && stringifyDN(ctx, errData.performer),
                    aliasDereferenced: errData.aliasDereferenced,
                    lastUpdate: errData.lastUpdate?.toISOString(),
                    signed: ("signed" in error),
                    problem: errData.problem,
                    start_time: errData.updateWindow?.start?.toISOString(),
                    stop_time: errData.updateWindow?.stop?.toISOString(),
                };
                const problem: string | undefined = errData.problem > 12
                    ? undefined
                    : errData.problem.toString();
                ctx.log.warn(ctx.i18n.t("log:shadow_error_requesting_shadow", {
                    context: problem,
                    obid: ob.binding_identifier,
                }), logInfo);
            } else {
                ctx.log.warn(ctx.i18n.t("log:error_requesting_shadow", {
                    obid: ob.binding_identifier,
                    code: printCode(outcome.error.code),
                }));
            }
            return;
        }
        else if ("reject" in outcome) {
            ctx.log.warn(ctx.i18n.t("log:requesting_shadow_rejected", {
                obid: ob.binding_identifier,
                code: outcome.reject.problem.toString(),
            }));
            return;
        }
        else if ("abort" in outcome) {
            ctx.log.warn(ctx.i18n.t("log:requesting_shadow_aborted", {
                obid: ob.binding_identifier,
                code: outcome.abort.toString(),
            }));
            return;
        }
        else if ("timeout" in outcome) {
            ctx.log.warn(ctx.i18n.t("log:requesting_shadow_timeout", {
                obid: ob.binding_identifier,
            }));
            return;
        }
        else {
            ctx.log.warn(ctx.i18n.t("log:requesting_shadow_other_problem", {
                obid: ob.binding_identifier,
                data: outcome.other,
            }));
            return;
        }
    } finally {
        disp_client.unbind();
    }
}

export default request_a_shadow_update;
