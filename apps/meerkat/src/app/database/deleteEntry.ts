import type { Context, Vertex } from "../types";

export
async function deleteEntry (
    ctx: Context,
    entry: Vertex,
): Promise<void> {
    if (entry.dse.root && !entry.immediateSuperior) {
        return; // Protects us from accidentally deleting the Root DSE.
    }
    await ctx.db.$transaction([
        ctx.db.contextValue.deleteMany({
            where: {
                entry_id: entry.dse.id,
            },
        }),
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: entry.dse.id,
            },
        }),
        ctx.db.entry.updateMany({
            where: {
                id: entry.dse.id,
            },
            data: {
                deleteTimestamp: new Date(),
            },
        }),
    ]);
    if (entry.immediateSuperior?.subordinates?.length) {
        const entryIndex = entry.immediateSuperior.subordinates
            .findIndex((child) => (child.dse.uuid === entry.dse.uuid));
        entry.immediateSuperior.subordinates.splice(entryIndex, 1);
    }
}

export default deleteEntry;

