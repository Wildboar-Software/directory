import type { Context } from "@wildboar/meerkat-types";

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
