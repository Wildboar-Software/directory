import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Entry as MemoryEntry } from "../types";
import rdnFromJson from "../x500/rdnFromJson";

export
async function entryFromDatabaseEntry (
    ctx: Context,
    superior: MemoryEntry | undefined,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<MemoryEntry> {
    // hierarchy?: HierarchyInfo;
    const ret: MemoryEntry = {
        ...dbe,
        parent: superior,
        uuid: dbe.entryUUID,
        rdn: (dbe.rdn && (typeof dbe.rdn === "object") && !(Array.isArray(dbe.rdn)))
            ? rdnFromJson(dbe.rdn as Record<string, string>)
            : [],
        children: [],
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

    ret.children = oneLevel
        ? []
        : await Promise.all(
            (await ctx.db.entry.findMany({
                where: {
                    immediate_superior_id: dbe.id,
                },
            })).map((child) => entryFromDatabaseEntry(ctx, ret, child)),
        );
    return ret;
}

export default entryFromDatabaseEntry;
