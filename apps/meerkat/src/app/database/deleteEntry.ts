import type { Context, Entry } from "../types";

export
async function deleteEntry (
    ctx: Context,
    entry: Entry,
): Promise<void> {
    await ctx.db.$transaction([
        ctx.db.contextValue.deleteMany({
            where: {
                entry_id: entry.id,
            },
        }),
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: entry.id,
            },
        }),
        ctx.db.entry.delete({
            where: {
                id: entry.id,
            },
        }),
    ]);
}

export default deleteEntry;

