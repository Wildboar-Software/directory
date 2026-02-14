import process from "node:process";
import { BERElement } from "@wildboar/asn1";
import type { MeerkatContext } from "../ctx.js";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _decode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import dnToVertex from "../dit/dnToVertex.js";
import { ShadowUpdateStrategy } from "../generated/client.js";
import { bindForDISP } from "../net/bindToOtherDSA.js";
import {
    id_ac_shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/DirectoryOSIProtocols";
import { OperationalBindingID } from "@wildboar/x500/OperationalBindingManagement";
import {
    CoordinateShadowUpdateArgumentData_updateStrategy_standard_incremental,
    CoordinateShadowUpdateArgumentData_updateStrategy_standard_total,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    id_opcode_coordinateShadowUpdate,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    RefreshInformation,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { createTotalRefresh } from "./createTotalRefresh.js";
import {
    _decode_IncrementalStepRefresh,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { compareCode, getOptionallyProtectedValue } from "@wildboar/x500";
import {
    id_errcode_shadowError,
} from "@wildboar/x500/CommonProtocolSpecification";
import { shadowError } from "@wildboar/x500/DirectoryShadowAbstractService";
import stringifyDN from "../x500/stringifyDN.js";
import printCode from "../utils/printCode.js";
import { differenceInMilliseconds } from "date-fns";
import _ from "lodash";
import * as util from "node:util";

/**
 * @summary Update a shadow consumer
 * @description
 *
 * This function updates a shadow consumer, including binding to the consumer
 * DSA, submitting the updates, and closing down the connection.
 *
 * This is an "inner" function that is wrapped by another similarly-named
 * "updateShadowConsumer" below. This wrapping is just to regulate nesting as
 * the whole thing is placed within a try-finally block.
 *
 * @param ctx The context object
 * @param ob_db_id The database ID of the shadow operational binding to update
 * @param forceTotalRefresh Whether to force a total update
 *
 * @async
 * @function
 */
async function _updateShadowConsumer (
    ctx: MeerkatContext,
    ob_db_id: number,
    forceTotalRefresh: boolean = false,
): Promise<void> {
    const ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id: ob_db_id,
        },
        select: {
            binding_identifier: true,
            binding_version: true,
            agreement_ber: true,
            last_update: true,
            local_last_update: true,
            remote_last_update: true,
            requested_strategy: true,
            initiator: true,
            outbound: true,
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
    const agreementElement = new BERElement();
    agreementElement.fromBytes(ob.agreement_ber);
    const agreement = _decode_ShadowingAgreementInfo(agreementElement);
    const updateMode = agreement.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode;
    // const performTotalRefresh: boolean = true;
    const performTotalRefresh: boolean = (
        forceTotalRefresh
        || !ob.local_last_update // If this DSA never replicated to this consumer at all,
        // ...or, the reported last update time is behind the local last update time.
        || (ob.remote_last_update && (ob.remote_last_update < ob.local_last_update))
        || (ob.requested_strategy === ShadowUpdateStrategy.TOTAL)
    );

    const since: Date = ob.remote_last_update ?? ob.local_last_update ?? new Date();
    const first_step = !!(await ctx.db.pendingShadowIncrementalStepRefresh.findFirst({
        where: {
            binding_identifier: ob_db_id,
            time: {
                gt: since,
            },
        },
        select: {
            id: true,
        },
    }));

    if (
        !performTotalRefresh
        && "supplierInitiated" in updateMode
        && ("onChange" in updateMode.supplierInitiated)
    ) {
        // If there are no updates, and the update mode is "onChange," just do nothing.
        if (!first_step) {
            return;
        }
    }

    const apElement = new BERElement();
    apElement.fromBytes(ob.access_point.ber);
    const accessPoint = _decode_AccessPoint(apElement);

    const cp_dn = agreement.shadowSubject.area.contextPrefix;
    const base_dn = agreement.shadowSubject.area.replicationArea.base
        ? [ ...cp_dn, ...agreement.shadowSubject.area.replicationArea.base ]
        : cp_dn;
    const baseDSE = await dnToVertex(ctx, ctx.dit.root, base_dn);
    if (!baseDSE) {
        ctx.log.error(ctx.i18n.t("log:base_dn_of_supplied_area_not_found", {
            obid: ob.binding_identifier.toString(),
            dn: stringifyDN(ctx, base_dn),
        }));
        return;
    }

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
        let step_ids: number[] = [];
        const bindingID = new OperationalBindingID(
            ob.binding_identifier,
            ob.binding_version,
        );
        const needsCoordinate: boolean = (!("consumerInitiated" in updateMode));
        if (needsCoordinate) {
            ctx.log.debug(ctx.i18n.t("log:coordinating_shadow_update", {
                context: performTotalRefresh
                    ? "total"
                    : (first_step ? "incremental" : "nochange"),
                obid: ob.binding_identifier,
            }));
            const coordinateOutcome = await disp_client.coordinateShadowUpdate({
                agreementID: bindingID,
                lastUpdate: ob.local_last_update ?? undefined,
                updateStrategy: {
                    standard: performTotalRefresh
                        ? CoordinateShadowUpdateArgumentData_updateStrategy_standard_total
                        : CoordinateShadowUpdateArgumentData_updateStrategy_standard_incremental,
                },
                securityParameters: createSecurityParameters(
                    ctx,
                    !!(ctx.config.signing.certPath && ctx.config.signing.key),
                    accessPoint.ae_title.rdnSequence,
                    id_opcode_coordinateShadowUpdate,
                    undefined,
                    true,
                ),
                cert_path: ctx.config.signing.certPath,
                key: ctx.config.signing.key,
                _unrecognizedExtensionsList: [],
            });
            if ("result" in coordinateOutcome) {
                ctx.log.debug(ctx.i18n.t("log:coordinated_shadow_update", {
                    context: performTotalRefresh
                        ? "total"
                        : (first_step ? "incremental" : "nochange"),
                    obid: ob.binding_identifier,
                }));
            }
            else if ("error" in coordinateOutcome) {
                if (compareCode(coordinateOutcome.error.code, id_errcode_shadowError)) {
                    const error = shadowError.decoderFor["&ParameterType"]!(coordinateOutcome.error.parameter);
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
                    ctx.log.warn(ctx.i18n.t("log:shadow_error_coordinating_shadow", {
                        context: problem,
                        obid: ob.binding_identifier,
                    }), logInfo);
                } else {
                    ctx.log.warn(ctx.i18n.t("log:error_coordinating_shadow", {
                        obid: ob.binding_identifier,
                        code: printCode(coordinateOutcome.error.code),
                    }));
                }
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
            else if ("reject" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_rejected", {
                    obid: ob.binding_identifier,
                    code: coordinateOutcome.reject.problem.toString(),
                }));
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
            else if ("abort" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_aborted", {
                    obid: ob.binding_identifier,
                    code: coordinateOutcome.abort.toString(),
                }));
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
            else if ("timeout" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_timeout", {
                    obid: ob.binding_identifier,
                }));
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
            else {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_other_problem", {
                    obid: ob.binding_identifier,
                    data: coordinateOutcome.other,
                }));
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
        } else {
            // FIXME: Check if requestShadowUpdate request has been sent.
        }
        /* This is done because shadow updates can take a long time to prepare,
        transmit and apply, since they can contain a lot of data. This is not
        infinite so that the socket eventually gets cleaned up, but 1 million
        seconds should be way more than enough time for the shadow updates to
        apply. fe7e2d89-aa02-4a62-b0f7-8c2fdf924a5f */
        disp_client.rose.socket?.setTimeout(1_000_000_000);
        let updatedInfo: RefreshInformation;
        const now = new Date();
        if (performTotalRefresh) {
            const total = await createTotalRefresh(ctx, ob_db_id);
            if (!total) {
                await disp_client.unbind({ disconnectSocket: true });
                return;
            }
            updatedInfo = { total };
            await ctx.db.pendingShadowIncrementalStepRefresh.deleteMany({
                where: {
                    binding_identifier: ob.binding_identifier,
                },
            });
        } else {
            const since: Date = ob.remote_last_update ?? ob.local_last_update!;
            const steps = await ctx.db.pendingShadowIncrementalStepRefresh.findMany({
                where: {
                    binding_identifier: ob_db_id,
                    time: {
                        gt: since,
                    },
                },
                select: {
                    id: true,
                    ber: true,
                },
                orderBy: {
                    time: "asc",
                },
            });
            if (steps.length > 0) {
                updatedInfo = {
                    incremental: steps.map(({ ber }) => {
                        const el = new BERElement();
                        el.fromBytes(ber);
                        return _decode_IncrementalStepRefresh(el);
                    }),
                };
                step_ids = steps.map((s) => s.id);
                await ctx.db.pendingShadowIncrementalStepRefresh.updateMany({
                    where: {
                        id: {
                            in: step_ids,
                        },
                    },
                    data: {
                        submitted: true,
                    },
                });
            } else {
                updatedInfo = {
                    noRefresh: null,
                };
            }
        }
        const schedule = (("supplierInitiated" in updateMode) && ("scheduled" in updateMode.supplierInitiated))
            ? updateMode.supplierInitiated.scheduled
            : (("consumerInitiated" in updateMode)
                ? updateMode.consumerInitiated
                : undefined);
        const time_after_preparing_update = new Date();
        const time_to_produce_update = Math.abs(differenceInMilliseconds(now, time_after_preparing_update));
        /**
         * We give the consumer 10 times as much time to apply the shadow update
         * as it took to produce the update, but we cap that at the update
         * interval, if it is defined, because we do not want shadow operations
         * to "pile up."
         *
         * In addition to this, we floor this number at 30 seconds, since a
         * "no changes" update could be produced extremely quickly, which would
         * result in an absurdly low timeout otherwise.
         *
         * In other words, this equation should always hold true:
         *
         * 30 seconds <= time given to respond <= update interval
         */
        const time_given_to_apply_update = Math.max(
            Math.min(
                time_to_produce_update * 10,
                Number(schedule?.periodic?.updateInterval ?? 100_000_000) * 1000,
            ),
            30_000,
        );
        ctx.log.debug(ctx.i18n.t("log:time_to_produce_shadow_update", {
            obid: ob.binding_identifier,
            ms: time_to_produce_update,
        }));
        const updateOutcome = await disp_client.updateShadow({
            agreementID: bindingID,
            updatedInfo,
            updateTime: now,
            updateWindow: undefined,
            securityParameters: createSecurityParameters(
                ctx,
                !!(ctx.config.signing.certPath && ctx.config.signing.key),
                accessPoint.ae_title.rdnSequence,
                id_opcode_coordinateShadowUpdate,
                undefined,
                true,
            ),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            _unrecognizedExtensionsList: [],
            timeout: time_given_to_apply_update,
        });
        // We reset the socket's timeout, reversing this: fe7e2d89-aa02-4a62-b0f7-8c2fdf924a5f
        disp_client.rose.socket?.setTimeout(30_000);
        if ("result" in updateOutcome) {
            ctx.log.info(ctx.i18n.t("log:updated_shadow_update", {
                context: performTotalRefresh
                    ? "total"
                    : (first_step ? "incremental" : "nochange"),
                obid: ob.binding_identifier,
            }));
            await ctx.db.pendingShadowIncrementalStepRefresh.deleteMany({
                where: {
                    id: {
                        in: step_ids,
                    },
                },
            });
            await ctx.db.operationalBinding.update({
                where: {
                    id: ob_db_id,
                },
                data: {
                    last_update: now,
                    local_last_update: now,
                },
            });
        }
        else if ("error" in updateOutcome) {
            if (compareCode(updateOutcome.error.code, id_errcode_shadowError)) {
                const error = shadowError.decoderFor["&ParameterType"]!(updateOutcome.error.parameter);
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
                ctx.log.warn(ctx.i18n.t("log:shadow_error_updating_shadow", {
                    context: problem,
                    obid: ob.binding_identifier,
                }), logInfo);
                await ctx.db.operationalBinding.update({
                    where: {
                        id: ob_db_id,
                    },
                    data: {
                        last_shadow_problem: Number(errData.problem),
                    },
                })
            } else {
                ctx.log.warn(ctx.i18n.t("log:error_updating_shadow", {
                    obid: ob.binding_identifier,
                    code: printCode(updateOutcome.error.code),
                }));
            }
        }
        else if ("reject" in updateOutcome) {
            ctx.log.warn(ctx.i18n.t("log:updating_shadow_rejected", {
                obid: ob.binding_identifier,
                code: updateOutcome.reject.problem.toString(),
            }));
        }
        else if ("abort" in updateOutcome) {
            ctx.log.warn(ctx.i18n.t("log:updating_shadow_aborted", {
                obid: ob.binding_identifier,
                code: updateOutcome.abort.toString(),
            }));
        }
        else if ("timeout" in updateOutcome) {
            ctx.log.warn(ctx.i18n.t("log:updating_shadow_timeout", {
                obid: ob.binding_identifier,
            }));
        }
        else {
            ctx.log.warn(ctx.i18n.t("log:updating_shadow_other_problem", {
                obid: ob.binding_identifier,
                data: updateOutcome.other,
            }));
        }
    } catch (e) {
        // TODO: Do this in a lot of other places. It would really help to have the stacktrace.
        if (process.env.MEERKAT_LOG_JSON !== "1") {
            ctx.log.error(util.inspect(e));
        }
        const extraLogData =  (typeof e === "object" && e !== null)
            ? {
                problem: e.data?.problem,
                ...(_.omit(e, "data")),
                obid: ob.binding_identifier.toString(),
            }
            : {
                obid: ob.binding_identifier.toString(),
            };
        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_failure", {
            e,
            ...extraLogData,
        }), extraLogData);
    } finally {
        try {
            await disp_client?.unbind({ disconnectSocket: true }); // INTENTIONAL_NO_AWAIT
        } catch (e) {
            const extraLogData =  (typeof e === "object" && e !== null)
                ? {
                    problem: e.data?.problem,
                    ...(_.omit(e, "data")),
                    obid: ob.binding_identifier.toString(),
                }
                : {
                    ...e,
                    obid: ob.binding_identifier.toString(),
                };
            ctx.log.error(ctx.i18n.t("err:disp_unbind_error", extraLogData), extraLogData);
        }
    }
}

/**
 * @summary Update a shadow consumer
 * @description
 *
 * This function updates a shadow consumer, including binding to the consumer
 * DSA, submitting the updates, and closing down the connection.
 *
 * @param ctx The context object
 * @param ob_db_id The database ID of the shadow operational binding to update
 * @param forceTotalRefresh Whether to force a total update
 *
 * @async
 * @function
 */
export
async function updateShadowConsumer (
    ctx: MeerkatContext,
    ob_db_id: number,
    forceTotalRefresh: boolean = false,
): Promise<void> {
    if (ctx.updatingShadow.has(ob_db_id)) {
        return;
    }
    ctx.updatingShadow.add(ob_db_id);
    try {
        await _updateShadowConsumer(ctx, ob_db_id, forceTotalRefresh);
    } catch (e) {
        const extraLogData =  (typeof e === "object" && e !== null)
            ? {
                problem: e.data?.problem,
                ...(_.omit(e, "data")),
            }
            : {
                ...e,
            };
        ctx.log.error(e, extraLogData);
    } finally {
        ctx.updatingShadow.delete(ob_db_id);
    }
}
