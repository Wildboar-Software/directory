import type { Context, Vertex, Value } from "../types";
import { Prisma } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";
import entryFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
// import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
// import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
// import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import addValues from "./entry/addValues";
import { strict as assert } from "assert";

export
async function createEntry (
    ctx: Context,
    superior: Vertex,
    rdn: RDN,
    entryInit: Partial<Prisma.EntryCreateInput>,
    values: Value[],
    modifier: DistinguishedName,
): Promise<Vertex> {
    const objectClasses = values
        .filter((value) => value.id.isEqualTo(objectClass["&id"]))
        .map((value) => value.value.objectIdentifier);
    // This entry is intentionally created as deleted first, in case the transaction fails.
    const isSubentry = objectClasses.some((oc) => oc.isEqualTo(subentry["&id"]));
    // const isFamilyMember = objectClasses.some((oc) => (oc.isEqualTo(parent["&id"]) || oc.isEqualTo(child["&id"])));
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            objectClass: "",
            rdn: rdnToJson(rdn),
            creatorsName: [],
            modifiersName: [],
            createdTimestamp: new Date(),
            modifyTimestamp: new Date(),
            deleteTimestamp: new Date(),
            structuralObjectClass: "",
            aliased_entry_dn: entryInit.aliased_entry_dn,
            glue: entryInit.glue,
            cp: entryInit.cp,
            entry: entryInit.entry ?? (!entryInit.aliased_entry_dn && !isSubentry),
            subr: entryInit.subr,
            nssr: entryInit.nssr,
            xr: entryInit.xr,
            subentry: entryInit.subentry ?? isSubentry,
            shadow: entryInit.shadow,
            immSupr: entryInit.immSupr,
            rhob: entryInit.rhob,
            sa: entryInit.sa,
            dsSubentry: entryInit.dsSubentry,
        },
    });
    const vertex = await entryFromDatabaseEntry(ctx, superior, createdEntry, true);
    await ctx.db.$transaction([
        ...addValues(ctx, vertex, values, modifier),
        ctx.db.entry.update({
            where: {
                id: createdEntry.id,
            },
            data: {
                deleteTimestamp: null,
            },
        }),
    ]);
    const newEntry = await ctx.db.entry.findUnique({
        where: {
            id: createdEntry.id,
        },
    });
    assert(newEntry);
    return entryFromDatabaseEntry(ctx, superior, newEntry, true);
}

export default createEntry;

