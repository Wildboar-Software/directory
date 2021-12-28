import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import { Prisma, Entry as DatabaseEntry } from "@prisma/client";
import vertexFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
// import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
// import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import addValues from "./entry/addValues";
import { strict as assert } from "assert";
import { randomUUID } from "crypto";
import getStructuralObjectClass from "../x500/getStructuralObjectClass";

export
async function createEntry (
    ctx: Context,
    superior: Vertex,
    rdn: RDN,
    entryInit: Partial<Prisma.EntryCreateInput>,
    values: Value[] = [],
    modifier: DistinguishedName = [],
): Promise<Vertex> {
    const objectClasses = values
        .filter((value) => value.type.isEqualTo(objectClass["&id"]))
        .map((value) => value.value.objectIdentifier);
    const isSubentry = objectClasses.some((oc) => oc.isEqualTo(subentry["&id"]));
    const isAlias = objectClasses.some((oc) => oc.isEqualTo(alias["&id"]));
    // const isFamilyMember = objectClasses.some((oc) => (oc.isEqualTo(parent["&id"]) || oc.isEqualTo(child["&id"])));
    const now = new Date();
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            materialized_path: superior.dse.root
                ? ""
                : (superior.materializedPath.length
                    ? `${superior.materializedPath}${superior.dse.id.toString() + "."}`
                    : superior.dse.id.toString() + "."),
            entryUUID: randomUUID(),
            creatorsName: [],
            modifiersName: [],
            createTimestamp: now,
            modifyTimestamp: now,
            // This entry is intentionally created as deleted first, in case the transaction fails.
            deleteTimestamp: now,
            glue: entryInit.glue,
            cp: entryInit.cp,
            entry: entryInit.entry ?? (!isAlias && !isSubentry),
            subr: entryInit.subr,
            nssr: entryInit.nssr,
            xr: entryInit.xr,
            subentry: entryInit.subentry ?? isSubentry,
            shadow: entryInit.shadow,
            immSupr: entryInit.immSupr,
            rhob: entryInit.rhob,
            sa: entryInit.sa,
            dsSubentry: entryInit.dsSubentry,
            structuralObjectClass: entryInit.structuralObjectClass
                ?? getStructuralObjectClass(ctx, objectClasses).toString(),
            governingStructureRule: entryInit.governingStructureRule,
        },
        select: {
            id: true,
        },
    });
    const vertex = await vertexFromDatabaseEntry(ctx, superior, createdEntry as DatabaseEntry, true);
    await ctx.db.$transaction([
        ctx.db.distinguishedValue.createMany({
            data: rdn.map((atav) => ({
                entry_id: createdEntry.id,
                type: atav.type_.toString(),
                value: Buffer.from(atav.value.toBytes()),
                str: atav.value.toString(),
            })),
        }),
        ...await addValues(ctx, vertex, values, modifier),
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
    const ret = await vertexFromDatabaseEntry(ctx, superior, newEntry, false);
    return ret;
}

export default createEntry;

