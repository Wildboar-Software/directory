import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import { Prisma } from "@prisma/client";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import addValues from "./entry/addValues";
import { strict as assert } from "assert";
import { randomUUID } from "crypto";
import getStructuralObjectClass from "../x500/getStructuralObjectClass";
import getVertexById from "./getVertexById";
import {
    id_oc_dynamicObject,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/dynamicObject.oa";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa";

/**
 * @summary Create a DSE
 * @description
 *
 * Creates a DSE in the database and returns the vertex from that DSE.
 *
 * @param ctx The context object
 * @param superior The superior to the created entry
 * @param rdn The relative distinguished name of the new entry
 * @param entryInit Properties of the new entry
 * @param values Initial values of the entry
 * @param modifier The distinguished name of the user that created the entry
 * @returns The newly created vertex
 *
 * @function
 * @async
 */
export
async function createEntry (
    ctx: Context,
    superior: Vertex,
    rdn: RDN,
    entryInit: Partial<Prisma.EntryCreateInput>,
    values: Value[] = [],
    modifier: DistinguishedName = [],
    signErrors: boolean = false,
): Promise<Vertex> {
    const objectClasses = values
        .filter((value) => value.type.isEqualTo(objectClass["&id"]))
        .map((value) => value.value.objectIdentifier);
    const isSubentry = objectClasses.some((oc) => oc.isEqualTo(subentry["&id"]));
    const isAlias = objectClasses.some((oc) => oc.isEqualTo(alias["&id"]));
    const couldBeAnEntry = ( // I don't know for sure that this is exhaustive.
        !entryInit.subr
        && !entryInit.xr
        && !entryInit.immSupr
        && !entryInit.glue
        && !entryInit.sa
        && !isAlias
        && !isSubentry
    );
    // const isFamilyMember = objectClasses.some((oc) => (oc.isEqualTo(parent["&id"]) || oc.isEqualTo(child["&id"])));
    const isDynamic = objectClasses.some((oc) => oc.isEqualTo(id_oc_dynamicObject));
    if (isDynamic && !values.some((v) => v.type.isEqualTo(entryTtl["&id"]))) {
        values.push({
            type: entryTtl["&id"],
            value: entryTtl.encoderFor["&Type"]!(ctx.config.defaultEntryTTL, DER),
        });
    }
    const now = new Date();
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            materialized_path: superior.dse.root
                ? ""
                : (superior.dse.materializedPath.length
                    ? `${superior.dse.materializedPath}${superior.dse.id.toString() + "."}`
                    : superior.dse.id.toString() + "."),
            entryUUID: randomUUID(),
            creatorsName: [],
            modifiersName: [],
            createTimestamp: entryInit.createTimestamp ?? now,
            modifyTimestamp: entryInit.modifyTimestamp ?? now,
            // This entry is intentionally created as deleted first, in case the transaction fails.
            deleteTimestamp: now,
            glue: entryInit.glue,
            cp: entryInit.cp,
            entry: entryInit.entry ?? couldBeAnEntry,
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
            RDN: {
                createMany: {
                    data: rdn.map((atav, i) => ({
                        type: atav.type_.toString(),
                        value: Buffer.from(atav.value.toBytes().buffer),
                        str: atav.value.toString(),
                        order_index: i,
                    })),
                },
            },
        },
        include: {
            RDN: true,
        },
    });
    const vertex = await vertexFromDatabaseEntry(ctx, superior, {
        ...createdEntry,
        EntryObjectClass: [],
    });
    await ctx.db.$transaction([
        ...await addValues(
            ctx,
            vertex,
            values,
            modifier,
            false, // Don't check for existing values.
            signErrors,
        ),
        ctx.db.entry.update({
            where: {
                id: createdEntry.id,
                dseUUID: entryInit.dseUUID,
                entryUUID: entryInit.entryUUID ?? undefined,
            },
            data: {
                deleteTimestamp: null,
            },
        }),
    ]);
    const ret = await getVertexById(ctx, superior, createdEntry.id);
    assert(ret);
    return ret;
}

export default createEntry;

