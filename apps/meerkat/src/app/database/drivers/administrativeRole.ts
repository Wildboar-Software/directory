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
import {
    ObjectIdentifier,
} from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    administrativeRole,
} from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(vertex.dse.admPoint?.administrativeRole.values() ?? [])
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            type: administrativeRole["&id"]!,
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
    const OID: string = value.value.objectIdentifier.toString();
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.create({
        data: {
            entry_id: vertex.dse.id,
            administrativeRole: OID,
        },
    }));
    pendingUpdates.entryUpdate.admPoint = true;
    if (vertex.dse.admPoint) {
        vertex.dse.admPoint.administrativeRole.add(OID);
    } else {
        vertex.dse.admPoint = {
            administrativeRole: new Set([ OID ]),
        };
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (
        ((await ctx.db.entryAdministrativeRole.count()) === 1)
        && (await hasValue(ctx, vertex, value))
    ) {
        pendingUpdates.entryUpdate.admPoint = false;
    }
    const OID: string = value.value.objectIdentifier.toString();
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            administrativeRole: OID,
        },
    }));
    if (vertex.dse.admPoint) {
        vertex.dse.admPoint.administrativeRole.delete(OID);
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
    pendingUpdates.entryUpdate.admPoint = false;
    delete vertex.dse.admPoint;
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.admPoint?.administrativeRole.size ?? 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return (vertex.dse.admPoint?.administrativeRole.size ?? 0) > 0;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return vertex.dse.admPoint?.administrativeRole.has(value.value.objectIdentifier.toString()) ?? false;
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
