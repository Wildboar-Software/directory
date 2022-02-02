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
// import {
//     DERElement,
//     ASN1TagClass,
//     ASN1UniversalType,
//     ObjectIdentifier,
// } from "asn1-ts";
// import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
// import {
//     objectClass,
// } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import NOOP from "./NOOP";
import { DER } from "asn1-ts/dist/node/functional";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.nameForms.values())
        .map((nf) => new NameFormDescription(
            nf.namedObjectClass,
            nf.name?.map((name) => ({
                uTF8String: name,
            })),
            nf.description
                ? {
                    uTF8String: nf.description,
                }
                : undefined,
            nf.obsolete,
            new NameFormInformation(
                nf.namedObjectClass,
                nf.mandatoryAttributes,
                nf.optionalAttributes,
            ),
        ))
        .map((value) => ({
            type: nameForms["&id"],
            value: nameForms.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    const name = decoded.name
        ? decoded.name
            .map(directoryStringToString)
            .map((str) => str.replace(/\|/g, ""))
            .join("|")
        : undefined;
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    pendingUpdates.otherWrites.push(ctx.db.nameForm.upsert({
        where: {
            identifier: decoded.identifier.toString(),
        },
        create: {
            identifier: decoded.identifier.toString(),
            name,
            description,
            obsolete: decoded.obsolete,
            namedObjectClass: decoded.information.subordinate.toString(),
            mandatoryAttributes: decoded.information.namingMandatories
                .map((oid) => oid.toString())
                .join(" "),
            optionalAttributes: decoded.information.namingOptionals
                ?.map((oid) => oid.toString())
                .join(" "),
        },
        update: {
            identifier: decoded.identifier.toString(),
            name,
            description,
            obsolete: decoded.obsolete,
            namedObjectClass: decoded.information.subordinate.toString(),
            mandatoryAttributes: decoded.information.namingMandatories
                .map((oid) => oid.toString())
                .join(" "),
            optionalAttributes: decoded.information.namingOptionals
                ?.map((oid) => oid.toString())
                .join(" "),
        },
    }));
    ctx.nameForms.set(decoded.identifier.toString(), {
        id: decoded.identifier,
        name: decoded.name?.map(directoryStringToString),
        description,
        obsolete: decoded.obsolete,
        namedObjectClass: decoded.information.subordinate,
        mandatoryAttributes: decoded.information.namingMandatories,
        optionalAttributes: decoded.information.namingOptionals ?? [],
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
    return (vertex.dse.subentry && vertex.dse.objectClass.has(SUBSCHEMA))
        ? Array.from(new Set(ctx.nameForms.values())).length
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return (vertex.dse.subentry && vertex.dse.objectClass.has(SUBSCHEMA))
        ? (ctx.nameForms.size > 0)
        : false;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    return (vertex.dse.subentry && vertex.dse.objectClass.has(SUBSCHEMA))
        ? !!ctx.nameForms.get(decoded.identifier.toString())
        : false;
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
