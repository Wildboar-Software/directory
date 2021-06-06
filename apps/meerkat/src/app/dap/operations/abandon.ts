import { Context } from "../../types";
import type {
    AbandonArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgument.ta";
import type {
    AbandonResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonResult.ta";

export
async function abandon (
    ctx: Context,
    arg: AbandonArgument,
): Promise<AbandonResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    if ("absent" in data.invokeID) {
        console.log("Abandoning no operation.");
    } else if ("present" in data.invokeID) {
        console.log(`Abandoning operation ${data.invokeID.present}.`);
    } else {
        console.error("Unable to abandon operation indicated by unrecognized alternative of InvokeId.");
    }
    return {
        null_: null,
    };
}

export default abandon;
