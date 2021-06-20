import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Entry } from "../types";

export
async function entryFromDatabaseEntry (
    ctx: Context,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<Entry> {
    // hierarchy?: HierarchyInfo;
    return {
        ...dbe,
        uuid: dbe.entryUUID,
        rdn: [], // FIXME: dependent on X.500's jsonToDN
        children: oneLevel
            ? []
            : await Promise.all(
                (await ctx.db.entry.findMany({
                    where: {
                        immediate_superior_id: dbe.id,
                    },
                })).map((child) => entryFromDatabaseEntry(ctx, child)),
            ),
        dseType: {
            root: dbe.root ?? false,
            glue: dbe.glue ?? false,
            cp: dbe.cp ?? false,
            entry: dbe.entry ?? false,
            alias: dbe.alias ?? false,
            subr: dbe.subr ?? false,
            nssr: dbe.nssr ?? false,
            supr: dbe.supr ?? false,
            xr: dbe.xr ?? false,
            admPoint: dbe.admPoint ?? false,
            subentry: dbe.subentry ?? false,
            shadow: dbe.shadow ?? false,
            immSupr: dbe.immSupr ?? false,
            rhob: dbe.rhob ?? false,
            sa: dbe.sa ?? false,
            dsSubentry: dbe.dsSubentry ?? false,
            familyMember: dbe.familyMember ?? false,
            ditBridge: dbe.ditBridge ?? false,
        },
        objectClass: new Set(dbe.objectClass),
        creatorsName: {
            rdnSequence: [], // FIXME:
        },
        modifiersName: {
            rdnSequence: [], // FIXME:
        },
        createdTimestamp: dbe.createdTimestamp,
        modifyTimestamp: dbe.modifyTimestamp,
        // hierarchy: ( // FIXME: Depends on jsonToDN()
        //     dbe.hierarchyTop !== undefined
        //     && dbe.hierarchyLevel !== undefined
        // )
        //     ? {
        //         top: dbe.hierarchyTop,
        //     }
        //     : undefined,
    };
}

export default entryFromDatabaseEntry;
