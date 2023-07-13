import { BERElement } from "asn1-ts";
import type { MeerkatContext } from "../ctx";
import {
    ShadowingAgreementInfo,
    _decode_AccessPoint,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import dnToVertex from "../dit/dnToVertex";
import { ShadowUpdateStrategy } from "@prisma/client";
import { bindForDISP } from "../net/bindToOtherDSA";
import {
    id_ac_shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAsynchronousAC.va";
import { OperationalBindingID } from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/OperationalBindingID.ta";
import {
    CoordinateShadowUpdateArgumentData_updateStrategy_standard_incremental,
    CoordinateShadowUpdateArgumentData_updateStrategy_standard_total,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/CoordinateShadowUpdateArgumentData-updateStrategy-standard.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import {
    id_opcode_coordinateShadowUpdate,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-coordinateShadowUpdate.va";
import {
    RefreshInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/RefreshInformation.ta";
import { createTotalRefresh } from "./createTotalRefresh";
import {
    _decode_IncrementalStepRefresh,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SubordinateChanges.ta";
import { compareCode, getOptionallyProtectedValue } from "@wildboar/x500";
import {
    id_errcode_shadowError,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-errcode-shadowError.va";
import { shadowError } from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/shadowError.oa";
import stringifyDN from "../x500/stringifyDN";
import printCode from "../utils/printCode";
import { DISPClient } from "@wildboar/x500-client-ts";
import isDebugging from "is-debugging";
import { differenceInMilliseconds } from "date-fns";

async function _updateShadowConsumer (
    ctx: MeerkatContext,
    ob_db_id: number,
    // totalRefreshOverride?: ShadowingAgreementInfo,
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
    // const performTotalRefresh: boolean = true; // FIXME: Just set for testing.
    const performTotalRefresh: boolean = (
        forceTotalRefresh
        || !ob.local_last_update // If this DSA never replicated to this consumer at all,
        // ...or, the reported last update time is behind the local last update time.
        || (ob.remote_last_update && (ob.remote_last_update < ob.local_last_update))
        || (ob.requested_strategy === ShadowUpdateStrategy.TOTAL)
    );

    if (
        !performTotalRefresh
        && "supplierInitiated" in updateMode
        && ("onChange" in updateMode.supplierInitiated)
    ) {
        // If there are no updates, and the update mode is "onChange," just do nothing.
        const since: Date = ob.remote_last_update ?? ob.local_last_update!;
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
        ctx.log.debug(ctx.i18n.t("log:coordinating_shadow_update", {
            context: performTotalRefresh ? "total" : "incremental",
            obid: ob.binding_identifier,
        }));

        let step_ids: number[] = [];
        const bindingID = new OperationalBindingID(
            ob.binding_identifier,
            ob.binding_version,
        );
        const needsCoordinate: boolean = (!("consumerInitiated" in updateMode));
        if (needsCoordinate) {
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
                ),
                cert_path: ctx.config.signing.certPath,
                key: ctx.config.signing.key,
                _unrecognizedExtensionsList: [],
            });
            if ("result" in coordinateOutcome) {
                ctx.log.debug(ctx.i18n.t("log:coordinated_shadow_update", {
                    context: performTotalRefresh ? "total" : "incremental",
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
                await disp_client.unbind();
                return;
            }
            else if ("reject" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_rejected", {
                    obid: ob.binding_identifier,
                    code: coordinateOutcome.reject.problem.toString(),
                }));
                await disp_client.unbind();
                return;
            }
            else if ("abort" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_aborted", {
                    obid: ob.binding_identifier,
                    code: coordinateOutcome.abort.toString(),
                }));
                await disp_client.unbind();
                return;
            }
            else if ("timeout" in coordinateOutcome) {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_timeout", {
                    obid: ob.binding_identifier,
                }));
                await disp_client.unbind();
                return;
            }
            else {
                ctx.log.warn(ctx.i18n.t("log:coordinating_shadow_other_problem", {
                    obid: ob.binding_identifier,
                    data: coordinateOutcome.other,
                }));
                await disp_client.unbind();
                return;
            }
        } else {
            // FIXME: Check if requestShadowUpdate request has been sent.
        }
        let updatedInfo: RefreshInformation;
        const now = new Date();
        if (performTotalRefresh) {
            const total = await createTotalRefresh(ctx, ob_db_id);
            if (!total) {
                await disp_client.unbind();
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
            ),
            cert_path: ctx.config.signing.certPath,
            key: ctx.config.signing.key,
            _unrecognizedExtensionsList: [],
            timeout: time_given_to_apply_update,
        });
        if ("result" in updateOutcome) {
            ctx.log.debug(ctx.i18n.t("log:updated_shadow_update", {
                context: performTotalRefresh ? "total" : "incremental",
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
        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_failure", {
            e,
            obid: ob.binding_identifier.toString(),
        }));
        if (isDebugging) {
            console.error(e);
        }
    } finally {
        try {
            await disp_client?.unbind(); // INTENTIONAL_NO_AWAIT
        } catch (e) {
            ctx.log.error(ctx.i18n.t("err:disp_unbind_error", {
                e,
                obid: ob.binding_identifier.toString(),
            }));
            if (isDebugging) {
                console.error(e);
            }
        }
    }
}

export
async function updateShadowConsumer (
    ctx: MeerkatContext,
    ob_db_id: number,
    // totalRefreshOverride?: ShadowingAgreementInfo,
    forceTotalRefresh: boolean = false,
): Promise<void> {
    if (ctx.updatingShadow.has(ob_db_id)) {
        return;
    }
    ctx.updatingShadow.add(ob_db_id);
    try {
        await _updateShadowConsumer(ctx, ob_db_id, forceTotalRefresh);
    } catch (e) {
        ctx.log.error(e);
        if (isDebugging) {
            console.error(e);
        }
    } finally {
        ctx.updatingShadow.delete(ob_db_id);
    }
}
