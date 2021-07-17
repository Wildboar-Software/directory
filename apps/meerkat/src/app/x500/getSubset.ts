import type { Context, Vertex } from "../types";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";
import readChildren from "../dit/readChildren";
import findEntry from "./findEntry";

export
async function getSubset (
    ctx: Context,
    entry: Vertex,
    subset: SearchArgumentData_subset,
    derefAliases: boolean = true,
): Promise<Vertex[]> {
    const base = (derefAliases && entry.dse.alias?.aliasedEntryName)
        ? await findEntry(ctx, ctx.dit.root, entry.dse.alias.aliasedEntryName, derefAliases)
        : entry;
    if (!base) {
        return []; // TODO: What to do here?
    }
    if (subset === SearchArgumentData_subset_baseObject) {
        return [ base ];
    }
    const children = await readChildren(ctx, entry);
    const derefedChildren = (await Promise.all(
        children
            .map((child) => (
                (derefAliases && child.dse.alias?.aliasedEntryName)
                    ? findEntry(ctx, ctx.dit.root, child.dse.alias.aliasedEntryName)
                    : child
            )),
    ))
        .filter((child): child is Vertex => !!child);
    if (subset === SearchArgumentData_subset_baseObject) {
        return derefedChildren;
    } else if (subset === SearchArgumentData_subset_wholeSubtree) {
        const descendantPromises = await Promise.all(
            derefedChildren
                .flatMap((child) => getSubset(
                    ctx,
                    child,
                    SearchArgumentData_subset_wholeSubtree)
                ),
        );
        return descendantPromises.flat();
    } else {
        return [];
    }
}

export default getSubset;
