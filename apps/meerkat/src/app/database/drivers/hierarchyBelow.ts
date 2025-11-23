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
import {
    hierarchyBelow,
} from "@wildboar/x500/InformationFramework";
import NOOP from "./NOOP.js";
import { DER } from "@wildboar/asn1/functional";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.hierarchy === undefined) {
        return [];
    }
    const below: boolean = !!(await ctx.db.entry.findFirst({
        where: {
            hierarchyParent_id: vertex.dse.id,
        },
        select: {
            id: true,
        },
    }));
    return [
        {
            type: hierarchyBelow["&id"],
            value: hierarchyBelow.encoderFor["&Type"]!(below, DER),
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
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return (vertex.dse.hierarchy !== undefined) ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return (vertex.dse.hierarchy !== undefined);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const below: boolean = !!(await ctx.db.entry.findFirst({
        where: {
            hierarchyParent_id: vertex.dse.id,
        },
        select: {
            id: true,
        },
    }));
    return (below === value.value.boolean);
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
