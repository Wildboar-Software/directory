import { Context } from "../../types";
import DAPConnection from "../DAPConnection";
import type {
    AbandonArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgumentData.ta";

export
async function abandon (
    ctx: Context,
    connection: DAPConnection,
    data: AbandonArgumentData,
): Promise<void> {
    if ("absent" in data.invokeID) {
        console.log("Abandoning no operation.");
    } else if ("present" in data.invokeID) {
        console.log(`Abandoning operation ${data.invokeID.present}.`);
    } else {
        console.error("Unable to abandon operation indicated by unrecognized alternative of InvokeId.");
    }
}

export default abandon;
