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
import {
    nonSpecificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/nonSpecificKnowledge.oa";
import { BERElement } from "asn1-ts";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return (await ctx.db.nonSpecificKnowledge.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            ber: true,
        },
    }))
        .map(({ ber }) => {
            const value = new BERElement();
            value.fromBytes(ber);
            return {
                type: nonSpecificKnowledge["&id"],
                value,
            };
        });
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
    return ctx.db.nonSpecificKnowledge.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.nonSpecificKnowledge.count({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.nonSpecificKnowledge.count({
        where: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
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
