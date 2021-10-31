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
import { BERElement } from "asn1-ts";
import {
    subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import rdnToJson from "../../x500/rdnToJson";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry) {
        return [];
    }
    const entities = await ctx.db.subtreeSpecification.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            ber: true,
        },
    });
    return entities
        .map((entity): Value => {
            const value = new BERElement();
            value.fromBytes(entity.ber);
            return {
                type: subtreeSpecification["&id"],
                value,
            };
        });
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const subtree = subtreeSpecification.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.create({
        data: {
            entry_id: vertex.dse.id,
            base: subtree.base
                ? subtree.base.map((rdn) => rdnToJson(rdn))
                : undefined,
            minimum: subtree.minimum,
            maximum: subtree.maximum,
            ber: Buffer.from(value.value.toBytes()),
            // specific_exclusions: // FIXME:
            // specification_filter: // FIXME:
            // specific_exclusions: subtree.specificExclusions?.map((sx) => {
            //     if ("")
            // })
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
    const subtree = subtreeSpecification.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            minimum: subtree.minimum,
            maximum: subtree.maximum,
            ber: Buffer.from(value.value.toBytes()),
            // specific_exclusions: // FIXME:
            // specification_filter: // FIXME:
            // specific_exclusions: subtree.specificExclusions?.map((sx) => {
            //     if ("")
            // })
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.deleteMany({
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
    if (!vertex.dse.subentry) {
        return 0;
    }
    return ctx.db.subtreeSpecification.count({
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
    if (!vertex.dse.subentry) {
        return false;
    }
    return !!(await ctx.db.subtreeSpecification.findFirst({
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
    if (!vertex.dse.subentry) {
        return false;
    }
    return !!(await ctx.db.subtreeSpecification.findFirst({
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
