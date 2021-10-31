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
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import readDITStructureRuleDescriptions from "../readers/readDITStructureRuleDescriptions";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITStructureRuleDescriptions(ctx, vertex.dse.id))
        .map((value) => ({
            type: dITStructureRules["&id"],
            value: dITStructureRules.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.create({
        data: {
            entry_id: vertex.dse.id,
            ruleIdentifier: decoded.ruleIdentifier,
            nameForm: decoded.nameForm.toString(),
            superiorStructureRules: decoded.superiorStructureRules
                ?.map((ssr) => ssr.toString())
                .join(" ") ?? null,
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
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditStructureRules) {
            vertex.dse.subentry.ditStructureRules.push(decoded);
        } else {
            vertex.dse.subentry.ditStructureRules = [ decoded ];
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
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            ruleIdentifier: decoded.ruleIdentifier,
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.deleteMany({
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
    return ctx.db.dITStructureRule.count({
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
    return !!(await ctx.db.dITStructureRule.findFirst({
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
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.dITStructureRule.findFirst({
        where: {
            entry_id: vertex.dse.id,
            ruleIdentifier: decoded.ruleIdentifier,
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
