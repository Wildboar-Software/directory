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
    supplierKnowledge,
} from "@wildboar/x500/src/lib/modules/DSAOperationalAttributeTypes/supplierKnowledge.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return (await ctx.db.accessPoint.findMany({
        where: {
            knowledge_type: Knowledge.SUPPLIER,
        },
        select: {
            ber: true,
        },
    }))
        .map(({ ber }) => {
            const value = new BERElement();
            value.fromBytes(ber);
            return {
                type: supplierKnowledge["&id"],
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
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return 0;
    }
    return ctx.db.accessPoint.count({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPPLIER,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    return !!(await ctx.db.accessPoint.findFirst({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPPLIER,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    return !!(await ctx.db.accessPoint.findFirst({
        where: {
            entry_id: vertex.dse.id,
            knowledge_type: Knowledge.SUPPLIER,
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
