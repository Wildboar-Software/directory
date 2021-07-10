import type { Context, Entry } from "../types";
import entryFromDatabaseEntry from "../database/entryFromDatabaseEntry";

export
async function readChildren (
    ctx: Context,
    entry: Entry,
): Promise<Entry[]> {
    if (entry.dseType.subentry || entry.dseType.alias) {
        return []; // These types should never have children. This return is to prevent errors.
    }
    if (!entry.children) {
        return await Promise.all(
            (await ctx.db.entry.findMany({
                where: {
                    dit_id: ctx.dit.id,
                    immediate_superior_id: entry.id,
                    deleteTimestamp: null,
                },
            })).map((child) => entryFromDatabaseEntry(ctx, entry, child, true)),
        );
    }
    return entry.children;
}

export default readChildren;
