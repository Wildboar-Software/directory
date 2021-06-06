import { Context, Entry } from "../../types";
import type {
    RemoveEntryArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgumentData.ta";
import type {
    RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import nameToString from "@wildboar/x500/src/lib/stringifiers/nameToString";
import {
    NameError,
    UpdateError,
} from "../errors";
import {
    NameErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import {
    NameProblem_noSuchObject,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameProblem.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
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

function objectDoesNotExistErroData (ctx: Context, soughtName: Name): NameErrorData {
    let match: Name = {
        rdnSequence: [],
    };
    const matches: Map<string, Name> = new Map();
    let name: Name = {
        rdnSequence: [ ...soughtName.rdnSequence.slice(1) ],
    };
    const definiteParentDN = nameToString(name);
    while (name.rdnSequence.length > 0) {
        matches.set(nameToString(name), name);
        name = {
            rdnSequence: [ ...name.rdnSequence.slice(1) ],
        };
    }
    for (const e of ctx.database.data.entries.values()) {
        if (e.dn === definiteParentDN) {
            match = matches.get(e.dn)!;
            break;
        }
        const potential = matches.get(e.dn);
        if (potential && (potential.rdnSequence.length > match.rdnSequence.length)) {
            match = potential;
        }
    }
    return new NameErrorData(
        NameProblem_noSuchObject,
        match,
        [],
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export
async function removeEntry (
    ctx: Context,
    data: RemoveEntryArgumentData,
): Promise<RemoveEntryResult> {
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
            objectDoesNotExistErroData(ctx, data.object),
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
