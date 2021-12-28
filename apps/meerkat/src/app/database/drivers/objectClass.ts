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
} from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
import {
    alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
import {
    subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";

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
            throw new Error();
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
            update: {
                entry_id: vertex.immediateSuperior.dse.id,
                object_class: PARENT,
            },
        }));
        vertex.immediateSuperior.dse.objectClass.add(PARENT);
        if (vertex.immediateSuperior.dse.familyMember) {
            vertex.immediateSuperior.dse.familyMember.parent = true;
        } else {
            vertex.immediateSuperior.dse.familyMember = {
                parent: true,
                child: false,
            };
        }
    }
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.create({
        data: {
            entry_id: vertex.dse.id,
            object_class: value.value.objectIdentifier.toString(),
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
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
};

export default driver;
