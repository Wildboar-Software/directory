import type { MeerkatContext } from "../ctx";
import {
    ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import { updateShadowConsumer } from "./createShadowUpdate";
import { addSeconds, differenceInMilliseconds } from "date-fns";
import { setTimeout as safeSetTimeout } from "safe-timers";
import request_a_shadow_update from "./requestAShadowUpdate";
import isDebugging from "is-debugging";

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
        if (!iAmSupplier) {
            ctx.log.debug(ctx.i18n.t("log:sob_no_schedule", { obid: ob_id }));
            return;
        }
        /* TODO: Document the rationale for this: by running every five seconds
        instead of immediately, you can batch a large number of incremental
        changes together. */
        setInterval(async () => updateShadowConsumer(ctx, ob_db_id, false), 5000);
        return;
    }
    const supplierInitiated: boolean = ("supplierInitiated" in updateMode);
    if (
        !(iAmSupplier && supplierInitiated) // If I am not the supplier of a supplier-initiated shadow...
        && !(!iAmSupplier && !supplierInitiated) // ...nor a consumer of a consumer-initiated shadow
    ) { // ...there is nothing for me to schedule.
        ctx.log.debug(ctx.i18n.t("log:sob_no_scheduling_needed", { obid: ob_id }));
        return;
    }
    const periods = schedule.periodic;
    const now = new Date();
    const scheduleShadowUpdates_ = () => {
        ctx.pendingShadowingUpdateCycles.delete(ob_id);
        if (iAmSupplier && supplierInitiated) {
            const update = () => {
                updateShadowConsumer(ctx, ob_db_id)
                    .then(() => {
                        ctx.log.info(ctx.i18n.t("log:updated_shadow_consumer", {
                            context: "scheduled",
                            obid: ob_id.toString(),
                        }));
                    })
                    .catch((e) => {

                        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_failure", {
                            e,
                            obid: ob_id.toString(),
                        }));
                        if (isDebugging) {
                            console.error(e);
                        }
                    });
            };
            update();
            const timer = setInterval(update, Number(periods.updateInterval) * 1000);
            ctx.shadowUpdateCycles.set(ob_id, timer);
        } else {
            const update = () => {
                request_a_shadow_update(ctx, ob_db_id)
                    .then()
                    .catch((e) => {
                        ctx.log.error(ctx.i18n.t("err:scheduled_shadow_update_request_failure", {
                            e,
                            obid: ob_id.toString(),
                        }));
                        if (isDebugging) {
                            console.error(e);
                        }
                    });
            };
            update();
            const timer = setInterval(update, Number(periods.updateInterval) * 1000);
            ctx.shadowUpdateCycles.set(ob_id, timer);
        }
    };

    let period_start = schedule.periodic.beginTime ?? ob_time;
    let next_period_start = period_start;
    let i = 0;
    while (i++ < 1_000_000) {
        // TODO: Use a better algorithm to identify the next update time.
        next_period_start = addSeconds(period_start, Number(schedule.periodic.updateInterval));
        if (next_period_start.valueOf() > now.valueOf()) {
            break;
        }
        period_start = next_period_start;
    }
    const end_of_period = addSeconds(period_start, Number(schedule.periodic.windowSize));
    if (now.valueOf() < end_of_period.valueOf()) {
        // If we are within the window, we can just schedule the shadowing cycle now.
        scheduleShadowUpdates_();
    } else { // Otherwise, we have to wait until the first update
        const time_until_first_update = Math.abs(differenceInMilliseconds(now, next_period_start));
        const timeout = safeSetTimeout(scheduleShadowUpdates_, time_until_first_update);
        ctx.pendingShadowingUpdateCycles.set(ob_id, timeout);
    }
}

export default scheduleShadowUpdates;
