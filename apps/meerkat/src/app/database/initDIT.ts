import type { Context } from "../types";
import {
    top,
} from "@wildboar/x500/src/lib/modules/InformationFramework/top.oa";

const ROOT_DSE_NAME = [];

export
async function initDIT (
    ctx: Context,
    name: string,
): Promise<void> {
    const dit = await ctx.db.dIT.create({
        data: {
            uuid: ctx.dit.uuid,
            name,
        },
    });
    ctx.log.warn(`Created DIT '${name}'.`);
    const now = new Date();
    await ctx.db.entry.create({
        data: {
            rdn: [],
            root: true,
            glue: false,
            cp: false,
            entry: false,
            alias: false,
            subr: false,
            nssr: false,
            supr: false,
            xr: false,
            admPoint: false,
            subentry: false,
            shadow: false,
            immSupr: false,
            rhob: false,
            sa: false,
            dsSubentry: false,
            familyMember: false,
            ditBridge: false,
            writeableCopy: false,
            createdTimestamp: now,
            modifyTimestamp: now,
            // deleteTimestamp
            creatorsName: ROOT_DSE_NAME,
            modifiersName: ROOT_DSE_NAME,
            is_family_parent: false,
            is_family_child: false,
            // hierarchyLevel
            // hierarchyBelow
            // hierarchyParent
            // hierarchyTop
            structuralObjectClass: top["&id"]!.toString(),
            // accessControlScheme
            // entryUUID
            objectClass: top["&id"]!.toString(),
            // administrativeRole
            dit_id: dit.id,
            // immediate_superior
        },
    });
}

export default initDIT;
