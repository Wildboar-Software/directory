import type { Context, DIT } from "../types";
import entryFromDatabaseEntry from "./entryFromDatabaseEntry";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";

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
                rdn: ROOT_DSE_NAME,
                glue: false,
                cp: false,
                entry: false,
                // alias: false,
                subr: false,
                nssr: false,
                // supr: false,
                xr: false,
                // admPoint: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                dsSubentry: false,
                // familyMember: false,
                // ditBridge: false,
                // writeableCopy: false,
                createdTimestamp: now,
                modifyTimestamp: now,
                // deleteTimestamp
                creatorsName: ROOT_DSE_NAME,
                modifiersName: ROOT_DSE_NAME,
                // hierarchyLevel
                // hierarchyBelow
                // hierarchyParent
                // hierarchyTop
                structuralObjectClass: top["&id"].toString(),
                // accessControlScheme
                // entryUUID
                objectClass: top["&id"].toString(),
                // administrativeRole
            },
        });
        ctx.log.warn(`Created Root DSE ${rootDSE.entryUUID}.`);
    }
    ctx.dit.root = await entryFromDatabaseEntry(ctx, undefined, rootDSE);
    ctx.log.info("DIT loaded into memory.");
    return ctx.dit.root;
}

export default loadDIT;
