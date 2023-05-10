import type { MeerkatContext } from "../ctx";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { createShadowUpdate } from "./createShadowUpdate";
import { addSeconds, differenceInMilliseconds } from "date-fns";
import { setTimeout as safeSetTimeout } from "safe-timers";
import request_a_shadow_update from "./requestAShadowUpdate";

export
function scheduleShadowUpdates (
    ctx: MeerkatContext,
    agreement: ShadowingAgreementInfo,
    ob_db_id: number,
    ob_id: number,
    ob_time: Date,
    iAmSupplier: boolean,
): void {
    const updateMode = (agreement.updateMode ?? ShadowingAgreementInfo._default_value_for_updateMode);
    const schedule = (("supplierInitiated" in updateMode) && ("scheduled" in updateMode.supplierInitiated))
        ? updateMode.supplierInitiated.scheduled
        : (("consumerInitiated" in updateMode)
            ? updateMode.consumerInitiated
            : undefined);
    if (!schedule?.periodic) {
        return;
    }
    const periods = schedule.periodic;
    const now = new Date();
    const scheduleShadowUpdates = () => {
        ctx.pendingShadowingUpdateCycles.delete(ob_id);
        if (iAmSupplier) {
            const timer = setInterval(() => {
                createShadowUpdate(ctx, ob_db_id)
                    .then(() => {
                        ctx.log.info(ctx.i18n.t("log:updated_shadow_consumer", {
                            obid: ob_id.toString(),
                        }));
                    })
                    .catch((e) => {
                        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_failure", {
                            e,
                            obid: ob_id.toString(),
                        }));
                    });
            }, Number(periods.updateInterval) * 1000);
            ctx.shadowUpdateCycles.set(ob_id, timer);
        } else {
            const timer = setInterval(() => {
                request_a_shadow_update(ctx, ob_db_id)
                    .then()
                    .catch((e) => {
                        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_request_failure", {
                            e,
                            obid: ob_id.toString(),
                        }));
                    });
            }, Number(periods.updateInterval) * 1000);
            ctx.shadowUpdateCycles.set(ob_id, timer);
        }
    };
    let nextUpdateTime: Date = periods.beginTime ?? ob_time;
    while (nextUpdateTime < now) {
        // TODO: Use a better algorithm to identify the next update time.
        nextUpdateTime = addSeconds(nextUpdateTime, Number(periods.updateInterval));
    }
    const time_until_first_update = Math.abs(differenceInMilliseconds(now, nextUpdateTime))
        + 1000; // Plus one second just to avoid updating before the window due to imprecision.
    const timeout = safeSetTimeout(scheduleShadowUpdates, time_until_first_update);
    ctx.pendingShadowingUpdateCycles.set(ob_id, timeout);
}

export default scheduleShadowUpdates;
