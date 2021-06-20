import type { Context, DIT } from "../types";
import entryFromDatabaseEntry from "./entryFromDatabaseEntry";

export
async function loadDIT (
    ctx: Context,
): Promise<DIT | null> {
    const dit = await ctx.db.dIT.findUnique({
        where: {
            uuid: ctx.dit.uuid,
        },
    });
    if (!dit) {
        ctx.log.warn(`DIT with UUID ${ctx.dit.uuid} not defined.`);
        return null;
    }
    const rootDSE = await ctx.db.entry.findFirst({
        where: {
            dit_id: dit.id,
        },
    });
    if (!rootDSE) {
        ctx.log.warn(`No root DSE found for DIT with UUID ${ctx.dit.uuid}.`);
        return null;
    }
    return entryFromDatabaseEntry(ctx, rootDSE);
}

export default loadDIT;
