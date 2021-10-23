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
import { Knowledge } from "@prisma/client";
import { BERElement } from "asn1-ts";
import NOOP from "./NOOP";
import {
    specificKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/specificKnowledge.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subr || !vertex.dse.immSupr || !vertex.dse.xr) {
        return [];
    }
    return (await ctx.db.accessPoint.findMany({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
        select: {
            ber: true,
        },
    }))
        .map(({ ber }) => {
            const value = new BERElement();
            value.fromBytes(ber);
            return {
                type: specificKnowledge["&id"],
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
    if (!vertex.dse.subr || !vertex.dse.immSupr || !vertex.dse.xr) {
        return 0;
    }
    return ctx.db.accessPoint.count({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (!vertex.dse.subr || !vertex.dse.immSupr || !vertex.dse.xr) {
        return false;
    }
    return !!(await ctx.db.accessPoint.count({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.subr || !vertex.dse.immSupr || !vertex.dse.xr) {
        return false;
    }
    return !!(await ctx.db.accessPoint.count({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SPECIFIC,
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
