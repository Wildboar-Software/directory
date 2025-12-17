import type { Context, DIT } from "../types/index.js";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry.js";
import { randomUUID } from "crypto";
import type { Prisma } from "../generated/client.js";

const ROOT_DSE_NAME: Prisma.InputJsonArray = [];

/**
 * @summary Load or initialize the DIT
 * @description
 *
 * This function loads the Root DSE from the database, creating it if it does
 * not exist.
 *
 * @param ctx The context object
 * @returns The vertex of the Root DSE
 *
 * @function
 * @async
 */
export
async function loadDIT (
    ctx: Context,
): Promise<DIT> {
    const now = new Date();
    let rootDSE = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: null,
        },
    });
    if (!rootDSE) {
        ctx.log.warn(ctx.i18n.t("log:no_root_dse"));
        rootDSE = await ctx.db.entry.create({
            data: {
                immediate_superior_id: null,
                materialized_path: "",
                entryUUID: randomUUID(),
                glue: false,
                cp: false,
                entry: false,
                subr: false,
                nssr: false,
                xr: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                dsSubentry: false,
                createTimestamp: now,
                modifyTimestamp: now,
                deleteTimestamp: null,
                creatorsName: ROOT_DSE_NAME,
                modifiersName: ROOT_DSE_NAME,
            },
        });
        ctx.log.debug(ctx.i18n.t("log:created_root_dse", {
            uuid: rootDSE.entryUUID,
        }));
    }
    ctx.dit.root = await vertexFromDatabaseEntry(ctx, undefined, rootDSE);
    return ctx.dit.root;
}

export default loadDIT;
