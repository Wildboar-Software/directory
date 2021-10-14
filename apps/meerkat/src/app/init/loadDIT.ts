import type { Context, DIT } from "@wildboar/meerkat-types";
import vertexFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import { randomBytes } from "crypto";

const ROOT_DSE_NAME = [];

export
async function loadDIT (
    ctx: Context,
): Promise<DIT> {
    const now = new Date();
    ctx.log.info("Loading DIT into memory. This could take a while.");
    let rootDSE = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: null,
        },
    });
    if (!rootDSE) {
        ctx.log.warn("No root DSE found. Creating it.");
        rootDSE = await ctx.db.entry.create({
            data: {
                immediate_superior_id: null,
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
                createdTimestamp: now,
                modifyTimestamp: now,
                deleteTimestamp: null,
                creatorsName: ROOT_DSE_NAME,
                modifiersName: ROOT_DSE_NAME,
                uniqueIdentifier: Buffer.concat([
                    Buffer.from([ 0 ]),
                    randomBytes(8),
                ]),
            },
        });
        ctx.log.warn(`Created Root DSE ${rootDSE.entryUUID}.`);
    }
    ctx.dit.root = await vertexFromDatabaseEntry(ctx, undefined, rootDSE);
    ctx.log.info("DIT loaded into memory.");
    return ctx.dit.root;
}

export default loadDIT;
