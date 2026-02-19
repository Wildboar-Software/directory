import type { Context, Vertex } from "../types/index.js";

/**
 * @summary Delete subordinates of a DSE, then the DSE itself
 * @param ctx The context object
 * @param id the ID of the immediate superior whose children are to be deleted
 *
 * @function
 * @async
 */
async function deleteDSE (ctx: Context, id: number): Promise<void> {
    const children = await ctx.db.entry.findMany({
        where: {
            immediate_superior_id: id,
        },
        select: {
            id: true,
        },
    });
    await Promise.all(children.map((child) => deleteDSE(ctx, child.id)));
    // This _should_ cascade into deleting basically everything else.
    await ctx.db.entry.delete({
        where: { id },
    });
}

/**
 * @summary Delete a DSE
 * @description
 *
 * Deletes a DSE from the database and from the subordinates of the superior, if
 * the superior has its subordinates in memory.
 *
 * @param ctx The context object
 * @param entry The vertex to be deleted
 * @param alsoDeleteFamily Whether to also delete childre
 *
 * @function
 * @async
 */
export
async function deleteEntry (
    ctx: Context,
    entry: Vertex,
): Promise<void> {
    if (entry.dse.root && !entry.immediateSuperior) {
        return; // Protects us from accidentally deleting the Root DSE.
    }
    await deleteDSE(ctx, entry.dse.id);
    if (entry.immediateSuperior?.subordinates?.length) {
        const entryIndex = entry.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === entry.dse.uuid));
        entry.immediateSuperior.subordinates.splice(entryIndex, 1);
    }
}

export default deleteEntry;
