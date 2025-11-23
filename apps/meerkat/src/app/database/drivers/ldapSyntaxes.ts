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
import { ldapSyntaxes } from "@wildboar/x500/LdapSystemSchema";
import { subschema } from "@wildboar/x500/SchemaAdministration";
import {
    LdapSyntaxDescription,
} from "@wildboar/x500/LdapSystemSchema";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.ldapSyntaxes.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((syntax) => new LdapSyntaxDescription(
            syntax.id,
            syntax.description
                ? {
                    uTF8String: syntax.description,
                }
                : undefined,
        ))
        .map((value) => ({
            type: ldapSyntaxes["&id"],
            value: ldapSyntaxes.encoderFor["&Type"]!(value, DER),
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
    const uniqueSyntaxes = Array.from(new Set(ctx.ldapSyntaxes.values()));
    return uniqueSyntaxes.length;
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
    const decoded = ldapSyntaxes.decoderFor["&Type"]!(value.value);
    return ctx.ldapSyntaxes.has(decoded.identifier.toString());
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
