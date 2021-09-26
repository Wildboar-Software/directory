import type { Context, Vertex, Value } from "../types";
import { Prisma } from "@prisma/client";
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
import { randomBytes } from "crypto";

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
        .filter((value) => value.id.isEqualTo(objectClass["&id"]))
        .map((value) => value.value.objectIdentifier);
    // This entry is intentionally created as deleted first, in case the transaction fails.
    const isSubentry = objectClasses.some((oc) => oc.isEqualTo(subentry["&id"]));
    const isAlias = objectClasses.some((oc) => oc.isEqualTo(alias["&id"]));
    // const isFamilyMember = objectClasses.some((oc) => (oc.isEqualTo(parent["&id"]) || oc.isEqualTo(child["&id"])));
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            creatorsName: [],
            modifiersName: [],
            createdTimestamp: new Date(),
            modifyTimestamp: new Date(),
            deleteTimestamp: new Date(),
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
            uniqueIdentifier: Buffer.concat([
                Buffer.from([ 0 ]),
                randomBytes(8),
            ]),
        },
    });
    await ctx.db.$transaction(rdn.map((atav) => ctx.db.rDN.create({
        data: {
            entry_id: createdEntry.id,
            type: atav.type_.toString(),
            value: Buffer.from(atav.value.toBytes()),
            str: atav.value.toString(),
        },
    })));
    const vertex = await vertexFromDatabaseEntry(ctx, superior, createdEntry, true);
    await ctx.db.$transaction([
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
    return vertexFromDatabaseEntry(ctx, superior, newEntry, true);
}

export default createEntry;

