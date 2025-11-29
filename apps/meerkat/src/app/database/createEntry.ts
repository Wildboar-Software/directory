import type { Context, Vertex, IndexableOID } from "../types/index.js";
import { DER } from "@wildboar/asn1/functional";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry.js";
import {
    DistinguishedName, _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import type {
    RelativeDistinguishedName as RDN,
} from "@wildboar/x500/InformationFramework";
import { top } from "@wildboar/x500/InformationFramework";
import addAttributes from "./entry/addAttributes.js";
import { strict as assert } from "assert";
import { randomUUID } from "crypto";
import getStructuralObjectClass from "../x500/getStructuralObjectClass.js";
import {
    entryTtl,
} from "@wildboar/parity-schema/src/lib/modules/RFC2589DynamicDirectory/entryTtl.oa.js";
import { ASN1Construction, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { groupByOID } from "@wildboar/x500";
import {
    ID_OC,
    ID_AEN,
    ID_SUBENTRY,
    ID_PARENT,
    ID_CHILD,
    ID_ADMIN_ROLE,
    ID_ALIAS,
    ID_DYNOBJ,
    ID_TTL,
    ID_ACS,
} from "../../oidstr.js";
import getEqualityNormalizer from "../x500/getEqualityNormalizer.js";
import type { EntryCreateInput } from "../generated/models/Entry.js";
import type { DistinguishedValueCreateWithoutEntryInput } from "../generated/models/DistinguishedValue.js";

/**
 * @summary Create a DSE more efficiently than with `createVertex`, but with a catch
 * @description
 *
 * Creates a DSE in the database and returns the vertex from that DSE.
 *
 * This is an alternative to `createVertex` that is more efficient by avoiding
 * another database query, but it cannot be used in scenarios where the created
 * vertex needs to be used immediately to add more vertices beneath it.
 *
 * @param ctx The context object
 * @param superior The superior to the created entry, or the minimal information
 * @param rdn The relative distinguished name of the new entry
 * @param entryInit Properties of the new entry
 * @param attributes Initial attributes of the entry
 * @param modifier The distinguished name of the user that created the entry
 * @returns The newly created vertex
 *
 * @function
 * @async
 */
export
async function createDse (
    ctx: Context,
    superior: Vertex,
    rdn: RDN,
    entryInit: Partial<EntryCreateInput>,
    attributes: Attribute[],
    modifier: DistinguishedName = [],
    signErrors: boolean = false,
): Promise<Vertex> {
    const groupedAttrs: Map<IndexableOID, Attribute[]> = groupByOID(attributes, attr => attr.type_);
    const objectClasses: OBJECT_IDENTIFIER[] = [];
    const objectClassIndex: Set<IndexableOID> = new Set();
    for (const oc_attr of groupedAttrs.get(ID_OC) ?? []) {
        for (const value of oc_attr.values) {
            const oc_oid = value.objectIdentifier;
            objectClasses.push(oc_oid);
            objectClassIndex.add(oc_oid.toString());
        }
    }
    const isSubentry = objectClassIndex.has(ID_SUBENTRY);
    const isAlias = objectClassIndex.has(ID_ALIAS);
    const couldBeAnEntry = ( // I don't know for sure that this is exhaustive.
        !entryInit.subr
        && !entryInit.xr
        && !entryInit.immSupr
        && !entryInit.glue
        && !entryInit.sa
        && !entryInit.subentry
        && !isAlias
        && !isSubentry
    );
    const isFamilyMember = objectClassIndex.has(ID_PARENT) || objectClassIndex.has(ID_CHILD);
    const isDynamic = objectClassIndex.has(ID_DYNOBJ);
    if (isDynamic && !groupedAttrs.get(ID_TTL)?.length) {
        // WARNING: This _does_ modify the attributes by reference, but it is an edge case.
        attributes.push(new Attribute(
            entryTtl["&id"],
            [
                entryTtl.encoderFor["&Type"]!(ctx.config.defaultEntryTTL, DER),
            ],
            undefined,
        ));
    }
    const adminRoles = groupedAttrs.get(ID_ADMIN_ROLE)
        ?.flatMap((a) => a.values)
        .map((v) => v.objectIdentifier) ?? [];
    const isAdmPoint = adminRoles.length > 0;
    const now = new Date();
    const materialized_path = superior.dse.root
        ? ""
        : (superior.dse.materializedPath.length
            ? `${superior.dse.materializedPath}${superior.dse.id.toString() + "."}`
            : superior.dse.id.toString() + ".");
    const NORMALIZER_GETTER = getEqualityNormalizer(ctx);
    const soc = getStructuralObjectClass(ctx, objectClasses);
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            materialized_path,
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
            admPoint: entryInit.admPoint ?? isAdmPoint,
            dsSubentry: entryInit.dsSubentry,
            structuralObjectClass: entryInit.structuralObjectClass ?? soc.toString(),
            governingStructureRule: entryInit.governingStructureRule,
            RDN: {
                createMany: {
                    data: rdn.map((atav, i): DistinguishedValueCreateWithoutEntryInput => ({
                        type_oid: atav.type_.toBytes(),
                        tag_class: atav.value.tagClass,
                        constructed: (atav.value.construction === ASN1Construction.constructed),
                        tag_number: atav.value.tagNumber,
                        content_octets: atav.value.value,
                        order_index: i,
                        normalized_str: NORMALIZER_GETTER(atav.type_)?.(ctx, atav.value),
                    })),
                },
            },
            EntryAttributeValuesIncomplete: entryInit.EntryAttributeValuesIncomplete,
            subordinate_completeness: entryInit.subordinate_completeness,
            attribute_completeness: entryInit.attribute_completeness,
            lastShadowUpdate: entryInit.lastShadowUpdate,
            alias: entryInit.alias,
        },
        include: {
            RDN: {
                select: {
                    type_oid: true,
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            },
        },
    });
    const aliasedEntryValue = groupedAttrs.get(ID_AEN)?.[0].values[0];

    // Rather than calling vertexFromDatabaseEntry(), we create a "good enough"
    // vertex based on what we already know. This could save many database
    // queries.
    const vertex: Vertex = {
        immediateSuperior: ("dse" in superior) ? superior : undefined,
        subordinates: null,
        dse: {
            id: createdEntry.id,
            createTimestamp: new Date(),
            modifyTimestamp: new Date(),
            creatorsName: {
                rdnSequence: modifier,
            },
            modifiersName: {
                rdnSequence: modifier,
            },
            materializedPath: materialized_path,
            objectClass: objectClassIndex,
            rdn,
            uuid: createdEntry.dseUUID,
            entryUUID: createdEntry.entryUUID ?? undefined,
            structuralObjectClass: soc,
            governingStructureRule: entryInit.governingStructureRule ?? undefined,
            glue: entryInit.glue,
            entry: entryInit.entry ?? couldBeAnEntry,
            rhob: entryInit.rhob,
            sa: entryInit.sa,
            dsSubentry: entryInit.dsSubentry,
            admPoint: isAdmPoint
                ? {
                    administrativeRole: new Set(adminRoles.map((ar) => ar.toString())),
                    accessControlScheme: groupedAttrs[ID_ACS]?.[0]?.values[0]?.objectIdentifier,
                }
                : undefined,
            alias: isAlias && aliasedEntryValue
                ? {
                    aliasedEntryName:_decode_DistinguishedName(aliasedEntryValue),
                }
                : undefined,
            cp: entryInit.cp ? {} : undefined,
            familyMember: isFamilyMember,
            immSupr: entryInit.immSupr
                ? {
                    specificKnowledge: [],
                }
                : undefined,
            nssr: undefined, // Impossible, because this entry is just now being created.
            shadow: entryInit.shadow
                ? {
                    attributeCompleteness: entryInit.attribute_completeness ?? false,
                    attributeValuesIncomplete: new Set(
                        Array.isArray(entryInit.EntryAttributeValuesIncomplete?.createMany?.data)
                            ? (entryInit.EntryAttributeValuesIncomplete?.createMany?.data.map((x) => x.attribute_type) ?? [])
                            : [],
                    ),
                    subordinateCompleteness: entryInit.subordinate_completeness ?? false,
                }
                : undefined,
            subentry: (entryInit.subentry ?? isSubentry) ? {} : undefined,
            subr: entryInit.subr
                ? {
                    specificKnowledge: [],
                }
                : undefined,
            supr: undefined,
            xr: undefined,
        },
    };
    await ctx.db.$transaction([
        ...await addAttributes(
            ctx,
            vertex,
            attributes,
            modifier,
            false, // Don't check for existing values.
            signErrors,
        ),
        ctx.db.entry.update({
            where: {
                id: createdEntry.id,
            },
            data: {
                deleteTimestamp: null,
            },
            include: {
                RDN: {
                    select: {
                        type_oid: true,
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
                    },
                    orderBy: { // So the RDNs appear in the order in which they were entered.
                        // This prevents an undesirable scenario where some users might show
                        // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
                        order_index: "asc",
                    },
                },
                EntryObjectClass: {
                    select: {
                        object_class: true,
                    },
                },
            },
        }),
    ]);
    return vertex;
}

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
 * @param attributes Initial attributes of the entry
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
    entryInit: Partial<EntryCreateInput>,
    attributes: Attribute[],
    modifier: DistinguishedName = [],
    signErrors: boolean = false,
): Promise<Vertex> {
    const groupedAttrs = groupByOID(attributes, attr => attr.type_);
    const objectClasses: OBJECT_IDENTIFIER[] = [];
    const objectClassIndex: Set<IndexableOID> = new Set();
    for (const oc_attr of groupedAttrs.get(ID_OC) ?? []) {
        for (const value of oc_attr.values) {
            const oc_oid = value.objectIdentifier;
            objectClasses.push(oc_oid);
            objectClassIndex.add(oc_oid.toString());
        }
    }
    const isSubentry = objectClassIndex.has(ID_SUBENTRY);
    const isAlias = objectClassIndex.has(ID_ALIAS);
    const couldBeAnEntry = ( // I don't know for sure that this is exhaustive.
        !entryInit.subr
        && !entryInit.xr
        && !entryInit.immSupr
        && !entryInit.glue
        && !entryInit.sa
        && !entryInit.subentry
        && !isAlias
        && !isSubentry
    );
    const isFamilyMember = objectClassIndex.has(ID_PARENT) || objectClassIndex.has(ID_CHILD);
    const isDynamic = objectClassIndex.has(ID_DYNOBJ);
    if (isDynamic && !groupedAttrs.get(ID_TTL)?.length) {
        // WARNING: This _does_ modify the attributes by reference, but it is an edge case.
        attributes.push(new Attribute(
            entryTtl["&id"],
            [
                entryTtl.encoderFor["&Type"]!(ctx.config.defaultEntryTTL, DER),
            ],
            undefined,
        ));
    }
    const adminRoles = groupedAttrs.get(ID_ADMIN_ROLE)
        ?.flatMap((a) => a.values)
        .map((v) => v.objectIdentifier) ?? [];
    const isAdmPoint = adminRoles.length > 0;
    const now = new Date();
    const materialized_path = superior.dse.root
        ? ""
        : (superior.dse.materializedPath.length
            ? `${superior.dse.materializedPath}${superior.dse.id.toString() + "."}`
            : superior.dse.id.toString() + ".");
    const NORMALIZER_GETTER = getEqualityNormalizer(ctx);
    const createdEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.dse.id,
            materialized_path,
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
            admPoint: entryInit.admPoint ?? isAdmPoint,
            dsSubentry: entryInit.dsSubentry,
            structuralObjectClass: entryInit.structuralObjectClass
                ?? getStructuralObjectClass(ctx, objectClasses).toString(),
            governingStructureRule: entryInit.governingStructureRule,
            RDN: {
                createMany: {
                    data: rdn.map((atav, i): DistinguishedValueCreateWithoutEntryInput => ({
                        type_oid: atav.type_.toBytes(),
                        tag_class: atav.value.tagClass,
                        constructed: (atav.value.construction === ASN1Construction.constructed),
                        tag_number: atav.value.tagNumber,
                        content_octets: atav.value.value,
                        order_index: i,
                        normalized_str: NORMALIZER_GETTER(atav.type_)?.(ctx, atav.value),
                    })),
                },
            },
            EntryAttributeValuesIncomplete: entryInit.EntryAttributeValuesIncomplete,
            subordinate_completeness: entryInit.subordinate_completeness,
            attribute_completeness: entryInit.attribute_completeness,
            lastShadowUpdate: entryInit.lastShadowUpdate,
            alias: entryInit.alias,
        },
        include: {
            RDN: {
                select: {
                    type_oid: true,
                    tag_class: true,
                    constructed: true,
                    tag_number: true,
                    content_octets: true,
                },
            },
        },
    });
    const aliasedEntryValue = groupedAttrs.get(ID_AEN)?.[0].values[0];

    // Rather than calling vertexFromDatabaseEntry(), we create a "good enough"
    // vertex based on what we already know. This could save many database
    // queries.
    const vertex: Vertex = {
        immediateSuperior: superior,
        subordinates: null,
        dse: {
            id: createdEntry.id,
            createTimestamp: new Date(),
            modifyTimestamp: new Date(),
            creatorsName: {
                rdnSequence: modifier,
            },
            modifiersName: {
                rdnSequence: modifier,
            },
            materializedPath: materialized_path,
            objectClass: new Set(),
            rdn,
            uuid: createdEntry.dseUUID,
            entryUUID: createdEntry.entryUUID ?? undefined,
            structuralObjectClass: top["&id"],
            glue: entryInit.glue,
            entry: entryInit.entry ?? couldBeAnEntry,
            rhob: entryInit.rhob,
            sa: entryInit.sa,
            dsSubentry: entryInit.dsSubentry,
            admPoint: isAdmPoint
                ? {
                    administrativeRole: new Set(adminRoles.map((ar) => ar.toString())),
                    accessControlScheme: groupedAttrs.get(ID_ACS)?.[0]?.values[0]?.objectIdentifier,
                }
                : undefined,
            alias: isAlias && aliasedEntryValue
                ? {
                    aliasedEntryName: _decode_DistinguishedName(aliasedEntryValue),
                }
                : undefined,
            cp: entryInit.cp ? {} : undefined,
            familyMember: isFamilyMember,
            immSupr: entryInit.immSupr
                ? {
                    specificKnowledge: [],
                }
                : undefined,
            nssr: undefined, // Impossible, because this entry is just now being created.
            shadow: entryInit.shadow
                ? {
                    attributeCompleteness: entryInit.attribute_completeness ?? false,
                    attributeValuesIncomplete: new Set(
                        Array.isArray(entryInit.EntryAttributeValuesIncomplete?.createMany?.data)
                            ? (entryInit.EntryAttributeValuesIncomplete?.createMany?.data.map((x) => x.attribute_type) ?? [])
                            : [],
                    ),
                    subordinateCompleteness: entryInit.subordinate_completeness ?? false,
                }
                : undefined,
            subentry: isSubentry ? {} : undefined,
            subr: entryInit.subr
                ? {
                    specificKnowledge: [],
                }
                : undefined,
            supr: undefined,
            xr: undefined,
        },
    };
    const txn = await ctx.db.$transaction([
        ...await addAttributes(
            ctx,
            vertex,
            attributes,
            modifier,
            false, // Don't check for existing values.
            signErrors,
        ),
        ctx.db.entry.update({
            where: {
                id: createdEntry.id,
            },
            data: {
                deleteTimestamp: null,
            },
            include: {
                RDN: {
                    select: {
                        type_oid: true,
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
                    },
                    orderBy: { // So the RDNs appear in the order in which they were entered.
                        // This prevents an undesirable scenario where some users might show
                        // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
                        order_index: "asc",
                    },
                },
                EntryObjectClass: {
                    select: {
                        object_class: true,
                    },
                },
            },
        }),
    ]);
    const update_response = txn[txn.length - 1];
    const ret = await vertexFromDatabaseEntry(ctx, superior, update_response);
    assert(ret);
    return ret;
}

export default createEntry;

