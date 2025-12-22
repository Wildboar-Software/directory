import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
    SpecialAttributeBatchDatabaseEditor,
} from "../../types/index.js";
import { ObjectIdentifier, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import {
    objectClass,
} from "@wildboar/x500/InformationFramework";
import {
    child,
} from "@wildboar/x500/InformationFramework";
import {
    parent,
} from "@wildboar/x500/InformationFramework";
import {
    alias,
} from "@wildboar/x500/InformationFramework";
import {
    subentry,
} from "@wildboar/x500/InformationFramework";
import { getEntryExistsFilter } from "../../database/entryExistsFilter.js";
import type { Attribute } from "@wildboar/pki-stub";

const PARENT: string = parent["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(vertex.dse.objectClass)
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            type: objectClass["&id"]!,
            value,
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const oid = value.value.objectIdentifier;
    if (oid.isEqualTo(subentry["&id"])) {
        pendingUpdates.entryUpdate.subentry = true;
    }
    else if (oid.isEqualTo(alias["&id"])) {
        pendingUpdates.entryUpdate.alias = true;
    }
    // If we are adding child object class, making the immediate superior of object class "parent."
    else if (oid.isEqualTo(child["&id"]) && vertex.immediateSuperior) {
        if (vertex.immediateSuperior.dse.root) {
            throw new Error("aac22db0-766f-4b5b-b98c-0cccebfd04a6");
        }
        pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.upsert({
            where: {
                entry_id_object_class: {
                    entry_id: vertex.immediateSuperior.dse.id,
                    object_class: PARENT,
                },
            },
            create: {
                entry_id: vertex.immediateSuperior.dse.id,
                object_class: PARENT,
            },
            update: {},
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }));
        vertex.immediateSuperior.dse.objectClass.add(PARENT);
        vertex.immediateSuperior.dse.familyMember = true;
    }
    const oidstr = value.value.objectIdentifier.toString();
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.upsert({
        where: {
            entry_id_object_class: {
                entry_id: vertex.dse.id,
                object_class: oidstr,
            },
        },
        create: {
            entry_id: vertex.dse.id,
            object_class: oidstr,
        },
        update: {},
        select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
    }));
};

export
const addAttribute: SpecialAttributeBatchDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    attr: Attribute,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const encountered: Set<string> = new Set();
    const oids: OBJECT_IDENTIFIER[] = [
        ...attr.values.map((v) => v.objectIdentifier),
        ...attr.valuesWithContext?.map((vwc) => vwc.value.objectIdentifier) ?? [],
    ].filter((oid) => {
        const key = (oid.toBytes() as Buffer).toString("base64");
        if (encountered.has(key)) {
            return false;
        }
        encountered.add(key);
        return true;
    });
    for (const oid of oids) {
        if (oid.isEqualTo(subentry["&id"])) {
            pendingUpdates.entryUpdate.subentry = true;
        }
        else if (oid.isEqualTo(alias["&id"])) {
            pendingUpdates.entryUpdate.alias = true;
        }
        // If we are adding child object class, making the immediate superior of object class "parent."
        else if (oid.isEqualTo(child["&id"]) && vertex.immediateSuperior) {
            if (vertex.immediateSuperior.dse.root) {
                throw new Error("aac22db0-766f-4b5b-b98c-0cccebfd04a6");
            }
            pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.upsert({
                where: {
                    entry_id_object_class: {
                        entry_id: vertex.immediateSuperior.dse.id,
                        object_class: PARENT,
                    },
                },
                create: {
                    entry_id: vertex.immediateSuperior.dse.id,
                    object_class: PARENT,
                },
                update: {},
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }));
            vertex.immediateSuperior.dse.objectClass.add(PARENT);
            vertex.immediateSuperior.dse.familyMember = true;
        }
    }
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.createMany({
        data: oids.map((oid) => ({
            entry_id: vertex.dse.id,
            object_class: oid.toString(),
        })),
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const oid = value.value.objectIdentifier;
    const OC_OID: string = value.value.objectIdentifier.toString();
    // If the last child is removed, remove "parent" from the superior.
    if (oid.isEqualTo(child["&id"]) && vertex.immediateSuperior) {
        const childrenCount: number = await ctx.db.entry.count({
            where: {
                ...getEntryExistsFilter(),
                immediate_superior_id: vertex.immediateSuperior.dse.id,
                EntryObjectClass: {
                    some: {
                        object_class: OC_OID,
                    },
                },
            },
        });
        if ((childrenCount <= 1)) {
            pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.delete({
                where: {
                    entry_id_object_class: {
                        entry_id: vertex.immediateSuperior.dse.id,
                        object_class: PARENT,
                    },
                },
            }));
            if (
                vertex.immediateSuperior.dse.familyMember
                && !vertex.immediateSuperior.dse.objectClass.has(child["&id"].toString())
            ) {
                vertex.immediateSuperior.dse.familyMember = false;
            }
        }
    }
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            object_class: value.value.objectIdentifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return ctx.db.entryObjectClass.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async () => {
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
) => {
    return vertex.dse.objectClass.has(value.value.objectIdentifier.toString());
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
    addAttribute,
};

export default driver;
