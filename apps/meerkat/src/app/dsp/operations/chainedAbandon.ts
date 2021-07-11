import { Context } from "../../types";
import {
    chainedAbandon as operation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAbandon.oa";

export
async function chainedAbandon (
    ctx: Context,
    arg: typeof operation["&ArgumentType"],
): Promise<typeof operation["&ResultType"]> {
    return {
        null_: null,
    };
}

export default chainedAbandon;
