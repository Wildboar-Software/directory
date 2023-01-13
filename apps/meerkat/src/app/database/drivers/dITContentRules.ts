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
import { DER } from "asn1-ts/dist/node/functional";
import { dITContentRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import readDITContentRuleDescriptions from "../readers/readDITContentRuleDescriptions";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITContentRuleDescriptions(ctx, vertex.dse.id))
        .map((value) => ({
            type: dITContentRules["&id"],
            value: dITContentRules.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITContentRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contentRule.upsert({
        where: {
            entry_id_structural_class: {
                entry_id: vertex.dse.id,
                structural_class: decoded.structuralObjectClass.toString(),
            },
        },
        create: {
            entry_id: vertex.dse.id,
            structural_class: decoded.structuralObjectClass.toString(),
            auxiliary_classes: decoded.auxiliaries?.map((aux) => aux.toString()).join(" "),
            mandatory_attributes: decoded.mandatory?.map((attr) => attr.toString()).join(" "),
            optional_attributes: decoded.optional?.map((attr) => attr.toString()).join(" "),
            precluded_attributes: decoded.precluded?.map((attr) => attr.toString()).join(" "),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
        update: {
            auxiliary_classes: decoded.auxiliaries?.map((aux) => aux.toString()).join(" "),
            mandatory_attributes: decoded.mandatory?.map((attr) => attr.toString()).join(" "),
            optional_attributes: decoded.optional?.map((attr) => attr.toString()).join(" "),
            precluded_attributes: decoded.precluded?.map((attr) => attr.toString()).join(" "),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
        select: null,
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditContentRules) {
            vertex.dse.subentry.ditContentRules.push(decoded);
        } else {
            vertex.dse.subentry.ditContentRules = [ decoded ];
        }
    }
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITContentRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contentRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            /**
             * From ITU X.501 (2016), Section 13.8.1:
             *
             * > For any valid subschema specification, there is at most one
             * > DIT content rule for each structural object class.
             */
            structural_class: decoded.structuralObjectClass.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.contentRule.deleteMany({
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
    return ctx.db.contentRule.count({
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
    return !!(await ctx.db.contentRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            id: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = dITContentRules.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.contentRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
            structural_class: decoded.structuralObjectClass.toString(),
        },
        select: {
            id: true,
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
