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
import {
    ObjectIdentifier,
} from "asn1-ts";
import NOOP from "./NOOP";
import { DER } from "asn1-ts/dist/node/functional";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    ObjectClassInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassInformation.ta";
import {
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import { ObjectClassKind as PrismaObjectClassKind } from "@prisma/client";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.objectClasses.entries())
        .filter(([ k ]) => (k.indexOf(".") === -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((oc) => new ObjectClassDescription(
            oc.id,
            oc.name?.map((name) => ({
                uTF8String: name,
            })),
            oc.description
                ? {
                    uTF8String: oc.description,
                }
                : undefined,
            oc.obsolete,
            new ObjectClassInformation(
                Array.from(oc.superclasses)
                    .map(ObjectIdentifier.fromString),
                oc.kind,
                Array.from(oc.mandatoryAttributes)
                    .map(ObjectIdentifier.fromString),
                Array.from(oc.optionalAttributes)
                    .map(ObjectIdentifier.fromString),
            ),
        ))
        .map((value) => ({
            type: objectClasses["&id"],
            value: objectClasses.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    const name = decoded.name
        ? decoded.name
            .map(directoryStringToString)
            .map((str) => str.replace(/\|/g, ""))
            .join("|")
        : undefined;
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    pendingUpdates.otherWrites.push(ctx.db.objectClassDescription.upsert({
        where: {
            identifier: decoded.identifier.toString(),
        },
        create: {
            identifier: decoded.identifier.toString(),
            name,
            description,
            obsolete: decoded.obsolete,
            subclassOf: decoded.information.subclassOf
                ?.map((oid) => oid.toString())
                .join(" "),
            mandatories: decoded.information.mandatories?.map((attr) => attr.toString()).join(" "),
            optionals: decoded.information.optionals?.map((attr) => attr.toString()).join(" "),
            kind: (() => {
                switch (decoded.information.kind) {
                case (ObjectClassKind_abstract):
                    return PrismaObjectClassKind.ABSTRACT;
                case (ObjectClassKind_auxiliary):
                    return PrismaObjectClassKind.AUXILIARY
                case (ObjectClassKind_structural):
                    return PrismaObjectClassKind.STRUCTURAL;
                default: return undefined;
                }
            })(),
            ldapDescription: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            ldapNames: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
        },
        update: {
            name,
            description,
            obsolete: decoded.obsolete,
            subclassOf: decoded.information.subclassOf
                ?.map((oid) => oid.toString())
                .join(" "),
            mandatories: decoded.information.mandatories?.map((attr) => attr.toString()).join(" "),
            optionals: decoded.information.optionals?.map((attr) => attr.toString()).join(" "),
            kind: (() => {
                switch (decoded.information.kind) {
                case (ObjectClassKind_abstract):
                    return PrismaObjectClassKind.ABSTRACT;
                case (ObjectClassKind_auxiliary):
                    return PrismaObjectClassKind.AUXILIARY
                case (ObjectClassKind_structural):
                    return PrismaObjectClassKind.STRUCTURAL;
                default: return undefined;
                }
            })(),
            ldapDescription: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            ldapNames: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
        },
    }));
    ctx.objectClasses.set(decoded.identifier.toString(), {
        id: decoded.identifier,
        name: decoded.name?.map(directoryStringToString),
        description,
        obsolete: decoded.obsolete,
        superclasses: decoded.information.subclassOf
            ? new Set(decoded.information.subclassOf.map((oid) => oid.toString()))
            : new Set(),
        kind: decoded.information.kind ?? ObjectClassKind_structural,
        mandatoryAttributes: new Set(decoded.information.mandatories?.map((oid) => oid.toString())),
        optionalAttributes: new Set(decoded.information.optionals?.map((oid) => oid.toString())),
        ldapNames: [],
        ldapDescription: description,
    });
};

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
    const uniqueObjectClasses = Array.from(new Set(ctx.objectClasses.values()));
    return uniqueObjectClasses.length;
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
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    return Boolean(
        vertex.dse.subentry
        && vertex.dse.objectClass.has(SUBSCHEMA)
        && ctx.objectClasses.has(decoded.identifier.toString())
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
