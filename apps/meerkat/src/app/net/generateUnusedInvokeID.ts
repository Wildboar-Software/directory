import type { Context } from "@wildboar/meerkat-types";
import * as crypto from "crypto";

const MAX_INVOKE_ID: number = 2147483647;

export
function generateUnusedInvokeID (ctx: Context): number {
    let invokeID: number = crypto.randomInt(MAX_INVOKE_ID);
    while (ctx.usedInvokeIDs?.has(invokeID)) {
        invokeID = crypto.randomInt(MAX_INVOKE_ID);
    }
    if (ctx.usedInvokeIDs.size > 10000) {
        ctx.usedInvokeIDs.clear();
    }
    ctx.usedInvokeIDs.add(invokeID);
    return invokeID;
}

export default generateUnusedInvokeID;
