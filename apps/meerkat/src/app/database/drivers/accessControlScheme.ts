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
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    accessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { ASN1Construction } from "asn1-ts";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.admPoint?.accessControlScheme) {
        return [
            {
                type: accessControlScheme["&id"]!,
                value: _encodeObjectIdentifier(vertex.dse.admPoint.accessControlScheme, DER),
            },
        ];
    } else {
        return [];
    }
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.create({
        data: {
            entry_id: vertex.dse.id,
            type: accessControlScheme["&id"].toString(),
            operational: true,
            tag_class: value.value.tagClass,
            constructed: value.value.construction === ASN1Construction.constructed,
            tag_number: value.value.tagNumber,
            ber: Buffer.from(value.value.toBytes().buffer),
            jer: value.value.toJSON() as string,
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
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            type: accessControlScheme["&id"].toString(),
            ber: Buffer.from(value.value.toBytes().buffer),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.attributeValue.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            type: accessControlScheme["&id"].toString(),
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return vertex.dse.admPoint?.accessControlScheme ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!vertex.dse.admPoint?.accessControlScheme;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return vertex.dse.admPoint?.accessControlScheme?.isEqualTo(value.value.objectIdentifier) ?? false;
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
