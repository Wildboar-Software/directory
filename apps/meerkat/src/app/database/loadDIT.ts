import type { Context, DIT } from "../types";
import entryFromDatabaseEntry from "./entryFromDatabaseEntry";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";

const ROOT_DSE_NAME = [];

export
async function loadDIT (
    ctx: Context,
): Promise<DIT | null> {
    const now = new Date();
    ctx.log.info(`Loading DIT with UUID ${ctx.dit.uuid} into memory. This could take a while.`);
    const ditsCount: number = await ctx.db.dIT.count();
    let dit = await ctx.db.dIT.findUnique({
        where: {
            uuid: ctx.dit.uuid,
        },
    });
    if (!dit) {
        // If there are DITs defined, and we can't find the sought after one, bail.
        if (ditsCount > 0) {
            ctx.log.error(`DIT with UUID ${ctx.dit.uuid} not defined.`);
            process.exit(1);
        }
        // If there are no existing DITs, it is fine to create one.
        ctx.log.warn(`DIT with UUID ${ctx.dit.uuid} not defined.`);
        const name = `DIT ${ctx.dit.uuid}`;
        dit = await ctx.db.dIT.create({
            data: {
                uuid: ctx.dit.uuid,
                name,
            },
        });
        ctx.log.warn(`Created DIT '${name}'.`);
        return null;
    }
    let rootDSE = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: null,
        },
    });
    if (!rootDSE) {
        ctx.log.warn(`No root DSE found for DIT with UUID ${ctx.dit.uuid}.`);
        rootDSE = await ctx.db.entry.create({
            data: {
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
        return null;
    }
    ctx.dit.id = dit.id;
    ctx.dit.root = await entryFromDatabaseEntry(ctx, undefined, rootDSE);
    ctx.log.info(`DIT with UUID ${ctx.dit.uuid} loaded into memory.`);
    return ctx.dit.root;
}

export default loadDIT;
