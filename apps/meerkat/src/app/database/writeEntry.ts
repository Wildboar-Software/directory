import type { Context, Vertex, StoredAttributeValueWithContexts } from "../types";
import { Entry as DatabaseEntry } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";
import writeEntryAttributes from "./writeEntryAttributes";

/**
 * Prisma does not allow you to recurse three levels deep in a call to
 * `create()`, meaning that we would not be able to create the context values
 * for all contexts for all attributes of the entry in addition to the entry
 * itself in a single pass. For a lack of a better option, this function creates
 * the entry alone, then all of the attributes and context values in two
 * separate transactions.
 *
 * @param ctx
 * @param entry
 * @param attributes
 */
export
async function writeEntry (
    ctx: Context,
    superior: Vertex,
    entry: Vertex,
    attributes: StoredAttributeValueWithContexts[],
): Promise<DatabaseEntry> {
    const writtenEntry = await ctx.db.entry.create({
        data: {
            entryUUID: entry.dse.uuid,
            immediate_superior_id: superior.dse.id,
            objectClass: Array.from(entry.dse.objectClass).join(" "),
            rdn: rdnToJson(entry.dse.rdn),
            aliased_entry_dn: entry.dse.alias?.aliasedEntryName
                ? entry.dse.alias?.aliasedEntryName.map((rdn) => rdnToJson(rdn))
                : undefined,
            // root: Boolean(entry.dse.root),
            glue: Boolean(entry.dse.glue),
            cp: Boolean(entry.dse.cp),
            entry: Boolean(entry.dse.entry),
            // alias: Boolean(entry.dse.alias),
            subr: Boolean(entry.dse.subr),
            nssr: Boolean(entry.dse.nssr),
            // supr: Boolean(entry.dse.supr),
            xr: Boolean(entry.dse.xr),
            // admPoint: Boolean(entry.dse.admPoint),
            subentry: Boolean(entry.dse.subentry),
            shadow: Boolean(entry.dse.shadow),
            immSupr: Boolean(entry.dse.immSupr),
            rhob: Boolean(entry.dse.rhob),
            sa: Boolean(entry.dse.sa),
            dsSubentry: Boolean(entry.dse.dsSubentry),
            // familyMember: Boolean(entry.dse.familyMember),
            // ditBridge: Boolean(entry.dse.ditBridge),
            // writeableCopy: false, // entry.dseType.writeableCopy,
            creatorsName: [{}],
            modifiersName: [{}],
            createdTimestamp: entry.dse.createdTimestamp,
            modifyTimestamp: entry.dse.modifyTimestamp,
            // deleteTimestamp: entry.deleteTimestamp, // Omitted
            // hierarchyLevel?: number | null
            // hierarchyBelow?: boolean | null
            // hierarchyParent?: number | null
            // hierarchyTop?: number | null
            // structuralObjectClass: string
            structuralObjectClass: "", // FIXME:
            administrativeRole: entry.dse.admPoint?.administrativeRole
                ? Array.from(entry.dse.admPoint.administrativeRole).join(" ")
                : undefined,
            accessControlScheme: entry.dse.admPoint?.accessControlScheme?.toString(),
        },
    });
    entry.dse.id = writtenEntry.id;
    await writeEntryAttributes(ctx, entry, attributes);
    return writtenEntry;
}

export default writeEntry;

