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
import NOOP from "./NOOP";
import { attributeTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/attributeTypes.oa";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import {
    AttributeTypeDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeDescription.ta";
import {
    AttributeTypeInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeInformation.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import {
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { AttributeUsage as PrismaAttributeUsage } from "@prisma/client";
import asn1SyntaxInfo from "../../x500/asn1SyntaxToInfo";

const SUBSCHEMA: string = subschema["&id"].toString();

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.attributeTypes.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((attr) => new AttributeTypeDescription(
            attr.id,
            attr.name?.map((name) => ({
                uTF8String: name,
            })),
            attr.description
                ? {
                    uTF8String: attr.description,
                }
                : undefined,
            attr.obsolete,
            new AttributeTypeInformation(
                attr.parent,
                attr.equalityMatchingRule,
                attr.orderingMatchingRule,
                attr.substringsMatchingRule,
                attr.syntax
                    ? {
                        uTF8String: attr.syntax,
                    }
                    : undefined,
                !attr.singleValued,
                attr.collective,
                !attr.noUserModification,
                attr.usage,
            ),
        ))
        .map((value) => ({
            type: attributeTypes["&id"],
            value: attributeTypes.encoderFor["&Type"]!(value, DER),
        }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    const TYPE_OID: string = decoded.identifier.toString();
    const names = decoded.name?.map(directoryStringToString);
    const syntax = decoded.information.attributeSyntax
        ? directoryStringToString(decoded.information.attributeSyntax)
        : undefined;
    pendingUpdates.otherWrites.push(ctx.db.attributeTypeDescription.upsert({
        where: {
            identifier: TYPE_OID,
        },
        create: {
            identifier: TYPE_OID,
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
            derivation: decoded.information.derivation?.toString(),
            equalityMatch: decoded.information.equalityMatch?.toString(),
            orderingMatch: decoded.information.orderingMatch?.toString(),
            substringsMatch: decoded.information.substringsMatch?.toString(),
            attributeSyntax: syntax,
            multiValued: decoded.information.multi_valued,
            collective: decoded.information.collective,
            userModifiable: decoded.information.userModifiable,
            application: (() => {
                switch (decoded.information.application) {
                case (AttributeUsage_dSAOperation):
                    return PrismaAttributeUsage.DSA_OPERATION;
                case (AttributeUsage_directoryOperation):
                    return PrismaAttributeUsage.DIRECTORY_OPERATION;
                case (AttributeUsage_distributedOperation):
                    return PrismaAttributeUsage.DISTRIBUTED_OPERATION;
                case (AttributeUsage_userApplications):
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                default:
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                }
            })(),
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
            derivation: decoded.information.derivation?.toString(),
            equalityMatch: decoded.information.equalityMatch?.toString(),
            orderingMatch: decoded.information.orderingMatch?.toString(),
            substringsMatch: decoded.information.substringsMatch?.toString(),
            attributeSyntax: syntax,
            multiValued: decoded.information.multi_valued,
            collective: decoded.information.collective,
            userModifiable: decoded.information.userModifiable,
            application: (() => {
                switch (decoded.information.application) {
                case (AttributeUsage_dSAOperation):
                    return PrismaAttributeUsage.DSA_OPERATION;
                case (AttributeUsage_directoryOperation):
                    return PrismaAttributeUsage.DIRECTORY_OPERATION;
                case (AttributeUsage_distributedOperation):
                    return PrismaAttributeUsage.DISTRIBUTED_OPERATION;
                case (AttributeUsage_userApplications):
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                default:
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                }
            })(),
        },
    }));
    /**
     * You cannot specify an LDAP syntax or a validator, so we have to infer
     * them, if possible.
     */
    const [ ldapSyntax, validator ] = asn1SyntaxInfo[syntax ?? ""] ?? [ undefined, undefined ];
    ctx.attributeTypes.set(TYPE_OID, {
        id: decoded.identifier,
        name: names,
        parent: decoded.information.derivation,
        equalityMatchingRule: decoded.information.equalityMatch,
        orderingMatchingRule: decoded.information.orderingMatch,
        substringsMatchingRule: decoded.information.substringsMatch,
        singleValued: !(decoded.information.multi_valued ?? true),
        collective: decoded.information.collective ?? false,
        /**
         * You can't add a dummy attribute, because the `attributeTypes` syntax
         * is MISSING a `dummy` field! I will report this to the ITU.
         */
        dummy: false,
        noUserModification: !(decoded.information.userModifiable ?? true),
        obsolete: decoded.obsolete ?? false,
        usage: decoded.information.application ?? AttributeUsage_userApplications,
        ldapSyntax,
        ldapNames: names,
        description: decoded.description
            ? directoryStringToString(decoded.description)
            : undefined,
        compatibleMatchingRules: new Set(),
        validator,
    });
};

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
): Promise<number> => {
    const uniqueAttributeTypes = Array.from(new Set(ctx.attributeTypes.values()));
    return uniqueAttributeTypes.length;
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
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    return !!(await ctx.db.attributeTypeDescription.findFirst({
        where: {
            identifier: decoded.identifier.toString(),
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
