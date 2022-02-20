import type { Context } from "@wildboar/meerkat-types";
import * as crypto from "crypto";

const MAX_INVOKE_ID: number = 2147483647;

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
    if (ctx.usedInvokeIDs.size > 10000) { // TODO: Make this customizable.
        ctx.usedInvokeIDs.clear();
    }
    ctx.usedInvokeIDs.add(invokeID);
    return invokeID;
}

export default generateUnusedInvokeID;
