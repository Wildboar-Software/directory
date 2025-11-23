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
import NOOP from "./NOOP";
import { DER } from "@wildboar/asn1/functional";
import {
    numSubordinates,
} from "@wildboar/parity-schema/src/lib/modules/DS389CoreSchema/numSubordinates.oa.js";
import { getEntryExistsFilter } from "../entryExistsFilter";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.entry) {
        return [];
    }
    const subordinates = await ctx.db.entry.count({
        where: {
            immediate_superior_id: vertex.dse.id,
            ...getEntryExistsFilter(),
        },
    });
    return [
        {
            type: numSubordinates["&id"],
            value: numSubordinates.encoderFor["&Type"]!(subordinates, DER),
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
const countValues: SpecialAttributeCounter = async (_, vertex: Vertex): Promise<number> => vertex.dse.entry ? 1 : 0;

export
const isPresent: SpecialAttributeDetector = async (_, vertex: Vertex): Promise<boolean> => !!vertex.dse.entry;

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.entry) {
        return false;
    }
    const asserted = Number(value.value.integer);
    const subordinates = await ctx.db.entry.count({
        where: {
            immediate_superior_id: vertex.dse.id,
        },
    });
    return (subordinates === asserted);
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
