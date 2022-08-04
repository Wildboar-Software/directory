import type { Connection, Context } from "./types";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    AddEntryArgument,
    _encode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import print from "./printCode";
import { DER } from "asn1-ts/dist/node/functional";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    UpdateProblem_entryAlreadyExists,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

export
async function idempotentAddEntry (
    ctx: Context,
    conn: Connection,
    dnStr: string,
    arg: AddEntryArgument,
): Promise<void> {
    const outcome = await conn.writeOperation({
        opCode: addEntry["&operationCode"],
        argument: _encode_AddEntryArgument(arg, DER),
    });
    if ("error" in outcome) {
        if (outcome.errcode) {
            if (compareCode(outcome.errcode, updateError["&errorCode"]!)) {
                const param = updateError.decoderFor["&ParameterType"]!(outcome.error);
                const data = getOptionallyProtectedValue(param);
                if (data.problem === UpdateProblem_entryAlreadyExists) {
                    ctx.log.warn(`Entry ${dnStr} already exists.`);
                    return;
                }
            }
            ctx.log.error(print(outcome.errcode));
            process.exit(12);
        } else {
            ctx.log.error("Uncoded error.");
            process.exit(23);
        }
    }
    ctx.log.info(`Added entry ${dnStr}.`);
}

/**
 * @summary Sleeps a specified number of milliseconds
 * @description
 *
 * This function sleeps a specified number of milliseconds. Specifically, it
 * returns a `Promise` that resolves once the sleep is over.
 *
 * @param ms The number of milliseconds to sleep.
 * @returns A promise that resolves once the sleep finishes.
 *
 * @function
 */
 export
 function sleep (ms: number): Promise<void> {
     return new Promise(resolve => setTimeout(resolve, ms));
 }

 export default sleep;
