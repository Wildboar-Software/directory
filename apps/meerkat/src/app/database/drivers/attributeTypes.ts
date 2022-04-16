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
    AttributeInfo,
} from "@wildboar/meerkat-types";
import { FALSE, ObjectIdentifier } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
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
import { Prisma, AttributeUsage as PrismaAttributeUsage } from "@prisma/client";
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
    const fromThisSubentry = (await ctx.db.attributeTypeDescription.findMany({
        where: {
            entry_id: null,
        },
    }))
        .map((at) => new AttributeTypeDescription(
            ObjectIdentifier.fromString(at.identifier),
            at.name?.split("|").map((name) => ({ uTF8String: name })),
            at.description
                ? {
                    uTF8String: at.description,
                }
                : undefined,
            at.obsolete,
            new AttributeTypeInformation(
                at.derivation
                    ? ObjectIdentifier.fromString(at.derivation)
                    : undefined,
                at.equalityMatch
                    ? ObjectIdentifier.fromString(at.equalityMatch)
                    : undefined,
                at.orderingMatch
                    ? ObjectIdentifier.fromString(at.orderingMatch)
                    : undefined,
                at.substringsMatch
                    ? ObjectIdentifier.fromString(at.substringsMatch)
                    : undefined,
                at.attributeSyntax
                    ? {
                        uTF8String: at.attributeSyntax
                    }
                    : undefined,
                at.multiValued,
                at.collective,
                at.userModifiable,
                {
                    [PrismaAttributeUsage.DSA_OPERATION]: AttributeUsage_dSAOperation,
                    [PrismaAttributeUsage.DIRECTORY_OPERATION]: AttributeUsage_directoryOperation,
                    [PrismaAttributeUsage.DISTRIBUTED_OPERATION]: AttributeUsage_distributedOperation,
                    [PrismaAttributeUsage.USER_APPLICATIONS]: AttributeUsage_userApplications,
                }[at.application] ?? AttributeUsage_userApplications,
            ),
        ));
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (!dseOwnedByThisDSA) {
        return fromThisSubentry
            .map((value) => ({
                type: attributeTypes["&id"],
                value: attributeTypes.encoderFor["&Type"]!(value, DER),
            }));
    }
    const indexedByOID: Map<string, AttributeTypeDescription> = new Map(
        Array.from(ctx.attributeTypes.entries())
            .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
            .map(([ oid, attr ]) => [
                oid,
                new AttributeTypeDescription(
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
                ),
            ]),
    );
    for (const at of fromThisSubentry) {
        indexedByOID.set(at.identifier.toString(), at);
    }
    return Array.from(indexedByOID.values())
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
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const names: string[] | undefined = decoded.name?.map(directoryStringToString);
    const name: string | undefined = names
        ?.map((str) => str.replace(/\|/g, ""))
        .join("|");
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    const syntax = decoded.information.attributeSyntax
        ? directoryStringToString(decoded.information.attributeSyntax)
        : undefined;
    const create: Prisma.AttributeTypeDescriptionCreateInput = {
        identifier: OID,
        name,
        description,
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
    };
    pendingUpdates.otherWrites.push(ctx.db.attributeTypeDescription.upsert({
        where: {
            entry_id_identifier: {
                entry_id: vertex.dse.id,
                identifier: OID,
            },
        },
        create: {
            ...create,
            entry: {
                connect: {
                    id: vertex.dse.id,
                },
            },
        },
        update: {
            ...create,
        },
    }));

    /**
     * If the attribute type is being added to a DSE that is owned by this DSA, it
     * becomes a universally-defined schema object within this DSA, as long as
     * it has not already been defined (e.g. on a first-come-first-served basis.)
     */
    if (dseOwnedByThisDSA) {
        /**
         * NOTE: For some reason, we can't use an upsert() because Prisma does
         * not allow you to upsert via a composite key where one member of the
         * key is NULL. So we have to check if there is already exists such
         * a schema object in a separate query.
         */
        const universallyDefinedAlready: boolean = ctx.attributeTypes.has(OID)
            || !!(await ctx.db.attributeTypeDescription.findFirst({
                where: {
                    entry_id: null,
                    identifier: OID,
                },
                select: {
                    id: true,
                },
            }));
        if (!universallyDefinedAlready) {
            ctx.db.attributeTypeDescription.create({ // INTENTIONAL_NO_AWAIT
                data: {
                    ...create,
                },
            })
                .then()
                .catch(); // TODO: Log something.

            /**
             * You cannot specify an LDAP syntax or a validator, so we have to infer
             * them, if possible.
             */
            const [ ldapSyntax, validator ] = asn1SyntaxInfo[syntax ?? ""] ?? [ undefined, undefined ];
            const info: AttributeInfo = {
                id: decoded.identifier,
                name: names,
                parent: decoded.information.derivation,
                equalityMatchingRule: decoded.information.equalityMatch,
                orderingMatchingRule: decoded.information.orderingMatch,
                substringsMatchingRule: decoded.information.substringsMatch,
                singleValued: !(decoded.information.multi_valued ?? true),
                collective: decoded.information.collective ?? false,
                ldapNames: names,
                ldapDescription: description,
                ldapSyntax,
                validator,
                usage: decoded.information.application ?? AttributeUsage_userApplications,
                description,
                /**
                 * You can't add a dummy attribute, because the `attributeTypes` syntax
                 * is MISSING a `dummy` field! I will report this to the ITU.
                 */
                dummy: FALSE,
                noUserModification: (decoded.information.userModifiable === FALSE),
                obsolete: decoded.obsolete,
                syntax,
                compatibleMatchingRules: new Set(),
            };
            ctx.attributeTypes.set(OID, info);
            let longestName: number = 0;
            for (const name of (names ?? [])) {
                ctx.attributeTypes.set(name, info);
                ctx.attributeTypes.set(name.trim().toLowerCase(), info);
                ctx.nameToObjectIdentifier.set(name, info.id);
                ctx.nameToObjectIdentifier.set(name.trim().toLowerCase(), info.id);
                if (name.trim().length > longestName) {
                    ctx.objectIdentifierToName.set(info.id.toString(), name);
                    longestName = name.length;
                }
            }
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
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.attributeTypeDescription.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            identifier: decoded.identifier.toString(),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.attributeTypeDescription.deleteMany({
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return 0;
    }
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (!dseOwnedByThisDSA) {
        return ctx.db.attributeTypeDescription.count({
            where: {
                entry_id: vertex.dse.id,
            },
        });
    }
    const oids: Set<string> = new Set([
        ...Array.from(ctx.attributeTypes.keys())
            .filter((key) => (key.indexOf(".") > -1)),
        ...(await ctx.db.attributeTypeDescription.findMany({
            where: {
                entry_id: vertex.dse.id,
            },
            select: {
                identifier: true,
            },
        })).map(({ identifier }) => identifier),
    ]);
    return oids.size;
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
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    const OID: string = decoded.identifier.toString();
    const dseOwnedByThisDSA: boolean = (!vertex.dse.rhob && !vertex.dse.shadow);
    if (dseOwnedByThisDSA && ctx.attributeTypes.has(OID)) {
        return true;
    }
    return !!(await ctx.db.attributeTypeDescription.findFirst({
        where: {
            entry_id: vertex.dse.id,
            identifier: OID,
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
