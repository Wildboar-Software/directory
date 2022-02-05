import type { Context } from "@wildboar/meerkat-types";

export
async function isFirstLevelDSA (ctx: Context): Promise<boolean> {
    return !!(await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: ctx.dit.root.dse.id,
            entry: true,
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
