import { Context, Entry } from "../../types";
import type {
    RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import type {
    RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import {
    NameError,
    UpdateError,
    objectDoesNotExistErrorData,
} from "../errors";
import { UpdateErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import {
    UpdateProblem_notAllowedOnNonLeaf,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateProblem.ta";
import findEntry from "../../x500/findEntry";

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
    const entry: Entry | undefined = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence);
    if (!entry) {
        throw new NameError(
            "No such object.",
            objectDoesNotExistErrorData(ctx, data.object),
        );
    }
    if (entry.children) {
        throw new UpdateError(
            "Cannot delete an entry with children.",
            HAS_CHILDREN_ERROR_DATA,
        );
    }

    ctx.database.data.values = ctx.database.data.values
        .filter((v): boolean => (v.entry !== entry!.id));
    if (entry.parent?.children.length) {
        const entryIndex = entry.parent.children.findIndex((child) => (child.id === entry.id));
        entry.parent.children.splice(entryIndex, 1);
    }

    return {
        null_: null,
    };
}

export default removeEntry;
