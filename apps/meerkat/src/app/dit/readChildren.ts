import type { Context, Vertex } from "../types";
import entryFromDatabaseEntry from "../database/entryFromDatabaseEntry";

export
async function readChildren (
    ctx: Context,
    entry: Vertex,
): Promise<Vertex[]> {
    if (entry.dse.subentry || entry.dse.alias) {
        return []; // These types should never have children. This return is to prevent errors.
    }
    if (!entry.subordinates) {
        return await Promise.all(
            (await ctx.db.entry.findMany({
                where: {
                    immediate_superior_id: entry.dse.id,
                    deleteTimestamp: null,
                },
            })).map((child) => entryFromDatabaseEntry(ctx, entry, child, true)),
        );
    }
    return entry.subordinates;
}

export default readChildren;
