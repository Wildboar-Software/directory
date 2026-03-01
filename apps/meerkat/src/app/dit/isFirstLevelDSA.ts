import type { Context } from "../types/index.js";

/**
 * @summary Indicates whether this DSA is a first-level DSA
 * @description
 *
 * First-level DSAs have extra responsibility for the directory that subordinate
 * DSAs do not have. Therefore, we need a way to determine if this DSA is a
 * first-level DSA.
 *
 * Meerkat DSA uses, as a heuristic, the presence of a first-level entry that is
 * not a shadow or some other knowledge-type DSE to determine if it is a
 * first-level DSA.
 *
 * @param ctx The context object
 * @returns A `boolean` indicating whether this DSA is a first-level DSA.
 *
 * @function
 * @async
 */
export
async function isFirstLevelDSA (ctx: Context): Promise<boolean> {
    return !!(await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: ctx.dit.root.dse.id,
            entry: true,
            cp: false,
            shadow: false,
            subr: false,
            subentry: false,
            dsSubentry: false,
            alias: false,
        },
        select: {
            id: true,
        },
    }));
}

export default isFirstLevelDSA;
