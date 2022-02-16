import type { Context } from "@wildboar/meerkat-types";

/**
 * @summary Determines whether any passwords are defined at all.
 * @description
 *
 * This function returns a `boolean` indicating whether any passwords exist in
 * the database for entries that have not been soft-deleted. The rationale for
 * this function's existence is that certain access controls in Meerkat DSA do
 * not take effect until the first password is created.
 *
 * @param ctx The context object
 * @returns A boolean indicating whether any passwords exist at all.
 */
export
async function anyPasswordsExist (ctx: Context): Promise<boolean> {
    return !!(await ctx.db.password.findFirst({
        where: {
            entry: {
                deleteTimestamp: null,
            },
        },
        select: {
            id: true,
        },
    }));
}

export default anyPasswordsExist;
