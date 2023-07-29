import { Context } from "@wildboar/meerkat-types";
import getEntryExistsFilter from "../database/entryExistsFilter";
import getDNFromEntryId from "../database/getDNFromEntryId";

export
async function cacheNamingContexts (ctx: Context): Promise<void> {
    try {
        const context_prefixes = await ctx.db.entry.findMany({
            where: {
                ...getEntryExistsFilter(),
                cp: true,
            },
            select: {
                id: true,
            },
        });
        ctx.dsa.namingContexts = await Promise.all(context_prefixes
            .map(async ({ id }) => getDNFromEntryId(ctx, id)));
    } catch (e) {
        // TODO: Log an error.
    }
}
