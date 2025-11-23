import type {
    Context,
    Vertex,
    Value,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "@wildboar/meerkat-types";
import NOOP from "./NOOP.js";
import { DER, _encodeGeneralizedTime, _decodeGeneralizedTime } from "@wildboar/asn1/functional";
import {
    syncTimestamp,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/syncTimestamp.oa.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.shadow) {
        return [];
    }
    const dbe = await ctx.db.entry.findUnique({
        where: {
            dseUUID: vertex.dse.uuid,
        },
        select: {
            lastShadowUpdate: true,
        },
    });
    if (!dbe?.lastShadowUpdate) {
        return [];
    }
    return [
        {
            type: syncTimestamp["&id"],
            value: _encodeGeneralizedTime(dbe.lastShadowUpdate, DER),
        },
    ];
};

export
const addValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

export
const countValues: SpecialAttributeCounter = async (
    ctx: Context,
    vertex: Vertex,
): Promise<number> => {
    if (!vertex.dse.shadow) {
        return 0;
    }
    const dbe = await ctx.db.entry.findUnique({
        where: {
            dseUUID: vertex.dse.uuid,
        },
        select: {
            lastShadowUpdate: true,
        },
    });
    if (!dbe?.lastShadowUpdate) {
        return 0;
    }
    return 1;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> => {
    if (!vertex.dse.shadow) {
        return false;
    }
    const dbe = await ctx.db.entry.findUnique({
        where: {
            dseUUID: vertex.dse.uuid,
        },
        select: {
            lastShadowUpdate: true,
        },
    });
    if (!dbe?.lastShadowUpdate) {
        return false;
    }
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.shadow) {
        return false;
    }
    const asserted = _decodeGeneralizedTime(value.value);
    const dbe = await ctx.db.entry.findUnique({
        where: {
            dseUUID: vertex.dse.uuid,
        },
        select: {
            lastShadowUpdate: true,
        },
    });
    if (!dbe?.lastShadowUpdate) {
        return false;
    }
    const syncTime = dbe.lastShadowUpdate;
    return (syncTime.valueOf() === asserted.valueOf());
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
