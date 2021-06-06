import { Context, Entry } from "../../types";
import type {
    RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import type {
    RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import nameToString from "@wildboar/x500/src/lib/stringifiers/nameToString";
import {
    NameError,
    UpdateError,
    objectDoesNotExistErrorData,
} from "../errors";
import { UpdateErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_notAllowedOnNonLeaf,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";

const HAS_CHILDREN_ERROR_DATA = new UpdateErrorData(
    UpdateProblem_notAllowedOnNonLeaf,
    undefined,
    [],
    undefined,
    undefined,
    undefined,
    undefined,
);

export
async function removeEntry (
    ctx: Context,
    arg: RemoveEntryArgument,
): Promise<RemoveEntryResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;
    const soughtDN = nameToString(data.object);
    let entry: Entry | undefined;
    for (const e of ctx.database.data.entries.values()) {
        if (!entry && (e.dn === soughtDN)) {
            entry = e;
        } else if (entry && (e.parent === entry.id)) {
            throw new UpdateError(
                "Cannot delete an entry with children.",
                HAS_CHILDREN_ERROR_DATA,
            );
        }
    }
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }

    ctx.database.data.values = ctx.database.data.values
        .filter((v): boolean => (v.entry !== entry!.id));
    ctx.database.data.entries.delete(entry.id);
    return {
        null_: null,
    };
}

export default removeEntry;
