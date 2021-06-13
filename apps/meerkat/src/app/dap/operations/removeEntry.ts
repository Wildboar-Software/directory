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
import {
    ServiceControlOptions_dontDereferenceAliases,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControlOptions.ta";
import {
    EXT_BIT_USE_ALIAS_ON_UPDATE,
} from "../../x500/extensions";
import findEntry from "../../x500/findEntry";
import { TRUE_BIT } from "asn1-ts";

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
    arg: RemoveEntryArgument,
): Promise<RemoveEntryResult> {
    const data = ("signed" in arg)
        ? arg.signed.toBeSigned
        : arg.unsigned;

    const useAliasOnUpdateExtension: boolean = (
        data.criticalExtensions?.[EXT_BIT_USE_ALIAS_ON_UPDATE] === TRUE_BIT);
    const dontDereferenceAliases: boolean = (
        data.serviceControls?.options?.[ServiceControlOptions_dontDereferenceAliases] === TRUE_BIT);

    /**
     * From ITU Recommendation X.511, Section 12.3.2:
     *
     * > ...aliases are dereferenced by this operation only if
     * > dontDereferenceAlias is not set and useAliasOnUpdate is set
     */
    const derefAliases: boolean = (
        !dontDereferenceAliases
        && useAliasOnUpdateExtension
    );

    const entry: Entry | undefined = findEntry(ctx, ctx.database.data.dit, data.object.rdnSequence, derefAliases);
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
