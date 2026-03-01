import type { Context } from "../types/index.js";
import * as crypto from "node:crypto";

/**
 * The invoke ID is capped at 1 billion so that the first digit can be
 * distributed among 1-9 instead of 1-2, while still being nearly as collision
 * resistant as a maximum signed 32-bit integer.
 */
const MAX_INVOKE_ID: number = 1_000_000_000;

/**
 * @summary Produce an unused InvokeId
 * @description
 *
 * Produces an InvokeId that this DSA has not used in any other outbound
 * operation.
 *
 * @param ctx The context object
 * @returns An unused InvokeId
 *
 * @function
 */
export
function generateUnusedInvokeID (ctx: Context): number {
    let invokeID: number = crypto.randomInt(MAX_INVOKE_ID);
    while (ctx.usedInvokeIDs?.has(invokeID)) {
        invokeID = crypto.randomInt(MAX_INVOKE_ID);
    }
    if (ctx.usedInvokeIDs.size > ctx.config.maxUsedInvokeIDs) {
        ctx.usedInvokeIDs.clear();
    }
    ctx.usedInvokeIDs.add(invokeID);
    return invokeID;
}

export default generateUnusedInvokeID;
