import { Context, Vertex } from "../types";
import {
    _decode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import {
    _encode_RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import {
    UpdateError,
} from "../errors";
import { UpdateErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_notAllowedOnNonLeaf,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import readChildren from "../dit/readChildren";
import deleteEntry from "../database/deleteEntry";
import {
    Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 as ChainedArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1 as ChainedResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";
import { DERElement } from "asn1-ts";

const HAS_CHILDREN_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_notAllowedOnNonLeaf,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);

// TODO: subentries

export
async function removeEntry (
    ctx: Context,
    vertex: Vertex,
    admPoints: Vertex[],
    request: ChainedArgument,
): Promise<ChainedResult> {
    // TODO: Check Access Control
    const argument = _decode_RemoveEntryArgument(request.argument);
    const data = ("signed" in argument)
        ? argument.signed.toBeSigned
        : argument.unsigned;
    const subordinates = await readChildren(ctx, vertex);
    if (subordinates.length > 0) {
        throw new UpdateError(
            "Cannot delete an entry with children.",
            HAS_CHILDREN_ERROR_DATA,
        );
    }
    if (vertex.dse.subentry) { // Go to step 5.
        // 1. Remove the subentry.
        // 2. Modify the operational bindings of all relevant subordinate DSAs.
        // 3. Continue at step 7.
    } else if (vertex.dse.cp) { // Go to step 6.
        // 1. Remove the naming context.
        // 2. Terminate the HOB, if applicable.
    } else if (vertex.dse.entry || vertex.dse.alias) { // Go to step 4.
        // 1. Remove the entry or alias entry.
        // 2. Continue at step 7.
    } else { // See Section 6.

    }
    // TODO: Step 7: Update shadows.
    await deleteEntry(ctx, vertex);
    return new ChainedResult(
        new ChainingResults(
            undefined,
            undefined,
            undefined,
            undefined,
        ),
        _encode_RemoveEntryResult({
            null_: null,
        }, () => new DERElement()),
    );
}

export default removeEntry;
