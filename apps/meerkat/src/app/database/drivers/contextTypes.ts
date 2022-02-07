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
import NOOP from "./NOOP";
import { DER } from "asn1-ts/dist/node/functional";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    ContextDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextDescription.ta";
import {
    ContextInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextInformation.ta";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.contextTypes.values())
        .map((info) => new ContextDescription(
            info.id,
            info.name?.map((name) => ({
                uTF8String: name,
            })),
            info.description
                ? {
                    uTF8String: info.description,
                }
                : undefined,
            info.obsolete,
            new ContextInformation(
                {
                    uTF8String: info.syntax,
                },
                info.assertionSyntax
                    ? {
                        uTF8String: info.assertionSyntax,
                    }
                    : undefined,
            ),
        ))
        .map((value) => ({
            type: contextTypes["&id"],
            value: contextTypes.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextDescription.upsert({
        where: {
            identifier: decoded.identifier.toString(),
        },
        create: {
            identifier: decoded.identifier.toString(),
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
            syntax: directoryStringToString(decoded.information.syntax),
            assertionSyntax: decoded.information.assertionSyntax
                ? directoryStringToString(decoded.information.assertionSyntax)
                : undefined,
        },
        update: {
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
            syntax: directoryStringToString(decoded.information.syntax),
            assertionSyntax: decoded.information.assertionSyntax
                ? directoryStringToString(decoded.information.assertionSyntax)
                : undefined,
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
): Promise<number> => {
    return Array.from(new Set(ctx.contextTypes.values())).length;
};

export
const isPresent: SpecialAttributeDetector = async (): Promise<boolean> => {
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    return ctx.contextTypes.has(decoded.identifier.toString());
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
