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
import type {
    Refinement,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Refinement.ta";

function refinementToJSON (ref: Refinement): Record<string, any> {
    if ("and" in ref) {
        return {
            and: ref.and.map((sub) => refinementToJSON(sub)),
        };
    } else if ("or" in ref) {
        return {
            or: ref.or.map((sub) => refinementToJSON(sub)),
        };
    } else if ("not" in ref) {
        return {
            not: refinementToJSON(ref.not),
        };
    } else if ("item" in ref) {
        return {
            item: ref.item.toString(),
        };
    } else {
        return {
            unrecognizedAlternative: ref.toString(),
        };
    }
}

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
            minimum: (subtree.minimum !== undefined)
                ? Number(subtree.minimum)
                : undefined,
            maximum: (subtree.maximum !== undefined)
                ? Number(subtree.maximum)
                : undefined,
            ber: Buffer.from(value.value.toBytes().buffer),
            specification_filter: subtree.specificationFilter
                ? refinementToJSON(subtree.specificationFilter)
                : undefined,
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
            minimum: (subtree.minimum !== undefined)
                ? Number(subtree.minimum)
                : undefined,
            maximum: (subtree.maximum !== undefined)
                ? Number(subtree.maximum)
                : undefined,
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
            ber: Buffer.from(value.value.toBytes().buffer),
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
