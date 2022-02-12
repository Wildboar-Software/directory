import type { Context, DIT } from "@wildboar/meerkat-types";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import { randomUUID } from "crypto";

const ROOT_DSE_NAME = [];

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
