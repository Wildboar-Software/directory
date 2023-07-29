import { Context } from "@wildboar/meerkat-types";
import getEntryExistsFilter from "../database/entryExistsFilter";
import getDNFromEntryId from "../database/getDNFromEntryId";

/**
 * @summary Cache the naming contexts in the context object
 * @description
 *
 * This function updates the context object's cache of naming contexts held by
 * this DSA.
 *
 * @param ctx The context object
 *
 * @async
 * @function
 */
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
