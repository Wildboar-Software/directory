import type { Context, Entry } from "../types";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import readChildren from "../dit/readChildren";

export
async function getSubset (
    ctx: Context,
    entry: Entry,
    subset: SearchArgumentData_subset,
    derefAliases: boolean = true,
): Promise<Entry[]> {
    const base = derefAliases
        ? entry.aliasedEntry ?? entry
        : entry;
    const children = await readChildren(ctx, entry);
    switch (subset) {
        case (SearchArgumentData_subset_baseObject): {
            return [ base ];
        }
        case (SearchArgumentData_subset_oneLevel): {
            return children
                .map((child) => (derefAliases ? (child.aliasedEntry ?? child) : child));
        }
        case (SearchArgumentData_subset_wholeSubtree): {
            const descendantPromises = await Promise.all(
                children
                .flatMap((child) => getSubset(
                    ctx,
                    derefAliases ? (child.aliasedEntry ?? child) : child,
                    SearchArgumentData_subset_wholeSubtree)
                ),
            );
            return descendantPromises.flat();
        }
        default: {
            return [];
        }
    }
}

export default getSubset;
