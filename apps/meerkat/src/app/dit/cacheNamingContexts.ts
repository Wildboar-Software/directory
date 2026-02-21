import { Context } from "../types/index.js";
import getEntryExistsFilter from "../database/entryExistsFilter.js";
import getDNFromEntryId from "../database/getDNFromEntryId.js";
import util from "node:util";

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
        if (process.env.MEERKAT_LOG_JSON !== "1") {
            ctx.log.error(util.inspect(e));
        }
        // TODO: Log an error.
    }
}
