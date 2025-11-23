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
import { DER } from "@wildboar/asn1/functional";
import { matchingRules } from "@wildboar/x500/SchemaAdministration";
import { subschema } from "@wildboar/x500/SchemaAdministration";
import {
    MatchingRuleDescription,
} from "@wildboar/x500/SchemaAdministration";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return [
        ...Array.from(ctx.equalityMatchingRules.entries()),
        ...Array.from(ctx.orderingMatchingRules.entries()),
        ...Array.from(ctx.substringsMatchingRules.entries()),
    ]
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((mr) => new MatchingRuleDescription(
            mr.id,
            mr.name?.map((name) => ({
                uTF8String: name,
            })),
            mr.description
                ? {
                    uTF8String: mr.description,
                }
                : undefined,
            mr.obsolete,
            mr.syntax
                ? {
                    uTF8String: mr.syntax,
                }
                : undefined,
        ))
        .map((value) => ({
            type: matchingRules["&id"],
            value: matchingRules.encoderFor["&Type"]!(value, DER),
        }));
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return 0;
    }
    const uniqueRules = Array.from(
        new Set([
            ...ctx.equalityMatchingRules.values(),
            ...ctx.orderingMatchingRules.values(),
            ...ctx.substringsMatchingRules.values(),
        ]),
    );
    return uniqueRules.length;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.subentry && vertex.dse.objectClass.has(SUBSCHEMA));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return false;
    }
    const OID: string = value.value.objectIdentifier.toString();
    return (
        ctx.equalityMatchingRules.has(OID)
        || ctx.orderingMatchingRules.has(OID)
        || ctx.substringsMatchingRules.has(OID)
    );
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
