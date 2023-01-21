import {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeError,
} from "@wildboar/meerkat-types";
import { ASN1Construction } from "asn1-ts";
import type { PrismaPromise, Prisma } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToJson from "../../x500/rdnToJson";
import {
    AttributeProblem_attributeOrValueAlreadyExists,
    AttributeProblem_contextViolation,
    AttributeProblem_invalidAttributeSyntax,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeProblem.ta";
import {
    AttributeErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData-problems-Item.ta";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import getDistinguishedName from "../../x500/getDistinguishedName";
import createSecurityParameters from "../../x500/createSecurityParameters";
import {
    AttributeUsage_userApplications as userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import hasValueWithoutDriver from "./hasValueWithoutDriver";
import getEqualityNormalizer from "../../x500/getEqualityNormalizer";

/**
 * @summary Validate the values to be added to the entry
 * @description
 *
 * Validate the values to be added to an entry, checking for invalid value
 * syntax, invalid context syntaxes, or, optionally, duplicate values.
 *
 * @param ctx The context object
 * @param entry The object to which the values are being added
 * @param values The values to be added
 * @param checkForExisting Whether to check whether the values already exist
 *
 * @function
 * @async
 */
async function validateValues(
    ctx: Context,
    entry: Vertex,
    values: Value[],
    checkForExisting: boolean = true,
    signErrors: boolean = false,
): Promise<void> {
    for (const value of values) {
        const TYPE_OID = value.type.toBytes();
        const attrSpec = ctx.attributeTypes.get(value.type.toString());
        if (attrSpec?.validator) {
            try {
                attrSpec.validator(value.value);
            } catch (e) {
                throw new AttributeError(
                    ctx.i18n.t("err:invalid_attribute_syntax", {
                        type: value.type.toString(),
                    }),
                    new AttributeErrorData(
                        {
                            rdnSequence: getDistinguishedName(entry),
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_invalidAttributeSyntax,
                                attrSpec.id,
                                undefined,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            undefined,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        if (checkForExisting) {
            if (attrSpec?.singleValued) {
                const attributeExists = attrSpec?.driver?.isPresent
                    ? await attrSpec.driver.isPresent(ctx, entry)
                    : !!(await ctx.db.attributeValue.findFirst({
                        where: {
                            entry_id: entry.dse.id,
                            type_oid: TYPE_OID,
                        },
                        select: {
                            id: true,
                        },
                    }));
                if (attributeExists) {
                    throw new AttributeError(
                        ctx.i18n.t("err:single_valued", {
                            context: "added",
                            oid: value.type.toString(),
                        }),
                        new AttributeErrorData(
                            {
                                rdnSequence: getDistinguishedName(entry),
                            },
                            [
                                new AttributeErrorData_problems_Item(
                                    AttributeProblem_invalidAttributeSyntax,
                                    value.type,
                                ),
                            ],
                            [],
                            createSecurityParameters(
                                ctx,
                                signErrors,
                                undefined,
                                undefined,
                                attributeError["&errorCode"],
                            ),
                            ctx.dsa.accessPoint.ae_title.rdnSequence,
                            undefined,
                            undefined,
                        ),
                        signErrors,
                    );
                }
            }
            /**
             * As I interpret it, the duplicate values checking does not have to
             * consider contexts. This is a fortuitous conclusion to come to, since
             * it avoids a conflict between DAP and LDAP operation. LDAP has no
             * concept of contexts, so preventing duplicate values regardless of
             * their contexts is valuable here.
             */
            let valueExists: boolean = attrSpec?.driver?.hasValue
                ? await attrSpec.driver.hasValue(ctx, entry, value)
                : !!(await ctx.db.attributeValue.findFirst({
                    where: {
                        entry_id: entry.dse.id,
                        type_oid: value.type.toBytes(),
                        tag_class: value.value.tagClass,
                        constructed: (value.value.construction === ASN1Construction.constructed),
                        tag_number: value.value.tagNumber,
                        content_octets: Buffer.from(
                            value.value.value.buffer,
                            value.value.value.byteOffset,
                            value.value.value.byteLength,
                        ), // Lol. Sorry.
                    },
                    select: {
                        id: true,
                    },
                }));
            // We use the naming matcher getter because it is symmetrical.
            // Equality matching rules are not required to be.
            const emr = attrSpec?.equalityMatchingRule
                ? getNamingMatcherGetter(ctx)(attrSpec.equalityMatchingRule)
                : undefined;
            // If a simple binary comparison of all `ber` values for that type
            // did not turn up any matches, we now have to read all the
            // possible matches and use the equality matcher to check for
            // duplicates
            if (
                !attrSpec?.driver?.hasValue // this value is not handled exceptionally, and...
                && !valueExists // a byte-for-byte database query did not identity any matches, and...
                && emr // there is an equality matching rule
                && (await hasValueWithoutDriver(ctx, entry.dse.id, value, emr))
            ) {
                valueExists = true;
            }
            if (valueExists) {
                throw new AttributeError(
                    ctx.i18n.t("err:value_already_exists", {
                        type: value.type.toString(),
                    }),
                    new AttributeErrorData(
                        {
                            rdnSequence: getDistinguishedName(entry),
                        },
                        [
                            new AttributeErrorData_problems_Item(
                                AttributeProblem_attributeOrValueAlreadyExists,
                                value.type,
                                value.value,
                            ),
                        ],
                        [],
                        createSecurityParameters(
                            ctx,
                            signErrors,
                            undefined,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                    signErrors,
                );
            }
        }
        for (const context of value.contexts ?? []) {
            const CONTEXT_TYPE: string = context.contextType.toString();
            const contextSpec = ctx.contextTypes.get(CONTEXT_TYPE);
            if (contextSpec?.validator) {
                for (const cvalue of context.contextValues) {
                    try {
                        contextSpec.validator(cvalue);
                    } catch (e) {
                        throw new AttributeError(
                            ctx.i18n.t("err:invalid_context_syntax", {
                                type: CONTEXT_TYPE,
                            }),
                            new AttributeErrorData(
                                {
                                    rdnSequence: getDistinguishedName(entry),
                                },
                                [
                                    new AttributeErrorData_problems_Item(
                                        AttributeProblem_contextViolation,
                                        value.type,
                                        value.value,
                                    ),
                                ],
                                [],
                                createSecurityParameters(
                                    ctx,
                                    signErrors,
                                    undefined,
                                    undefined,
                                    attributeError["&errorCode"],
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                undefined,
                                undefined,
                            ),
                            signErrors,
                        );
                    }
                }
            }
        }
    }
}

/**
 * @summary Add values to an entry.
 * @description
 *
 * Resolves an array of `PrismaPromise`s, which can be `await`ed or `.then()`'d
 * independently or within a Prisma transaction. These promises together will
 * execute the database queries to add the values to the entry.
 *
 * @param ctx The context object
 * @param entry The vertex to which attributes are to be added
 * @param values The values to be added to the entry
 * @param modifier The modifier of the entry
 * @param checkForExisting Whether to check whether the values already exist and
 *  throw an error if so
 * @returns An array of `PrismaPromise`s that will effectively add those
 *  attributes to the entry
 *
 * @function
 * @async
 */
export
async function addValues(
    ctx: Context,
    entry: Vertex,
    values: Value[],
    modifier?: DistinguishedName,
    checkForExisting: boolean = true,
    signErrors: boolean = false,
): Promise<PrismaPromise<any>[]> {
    if (!ctx.config.bulkInsertMode) {
        await validateValues(
            ctx,
            entry,
            values,
            checkForExisting,
            signErrors,
        );
    }
    const normalizerGetter = getEqualityNormalizer(ctx);
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier?.map(rdnToJson),
        },
        otherWrites: [],
    };
    await Promise.all(
        values
            .map((attr) => ctx.attributeTypes.get(attr.type.toString())
                ?.driver
                ?.addValue(ctx, entry, attr, pendingUpdates)),
    );
    const unspecialValues = values
        .filter((attr) => !ctx.attributeTypes.get(attr.type.toString())?.driver);
    const unspecialValuesWithContexts = unspecialValues.filter((v) => v.contexts?.length);
    const unspecialValuesWithNoContexts = unspecialValues.filter((v) => !(v.contexts?.length));
    return [
        ctx.db.entry.update({
            where: {
                id: entry.dse.id,
            },
            data: pendingUpdates.entryUpdate,
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }),
        ...pendingUpdates.otherWrites,
        ctx.db.attributeValue.createMany({
            data: unspecialValuesWithNoContexts.map((attr): Prisma.AttributeValueCreateManyInput => ({
                entry_id: entry.dse.id,
                type_oid: attr.type.toBytes(),
                operational: ((ctx.attributeTypes.get(attr.type.toString())?.usage ?? userApplications) !== userApplications),
                tag_class: attr.value.tagClass,
                constructed: (attr.value.construction === ASN1Construction.constructed),
                tag_number: attr.value.tagNumber,
                content_octets: Buffer.from(
                    attr.value.value.buffer,
                    attr.value.value.byteOffset,
                    attr.value.value.byteLength,
                ),
                jer: attr.value.toJSON() as Prisma.InputJsonValue,
                normalized_str: normalizerGetter(attr.type)?.(ctx, attr.value),
            })),
        }),
        ...unspecialValuesWithContexts // The ContextValue relation is only available in .create(), not .createMany().
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type_oid: attr.type.toBytes(),
                    operational: ((ctx.attributeTypes.get(attr.type.toString())?.usage ?? userApplications) !== userApplications),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    content_octets: Buffer.from(
                        attr.value.value.buffer,
                        attr.value.value.byteOffset,
                        attr.value.value.byteLength,
                    ),
                    jer: attr.value.toJSON() as Prisma.InputJsonValue,
                    normalized_str: normalizerGetter(attr.type)?.(ctx, attr.value),
                    ContextValue: {
                        createMany: {
                            data: (attr.contexts ?? [])
                                .flatMap((context) => context.contextValues.map((cv) => ({
                                    type: context.contextType.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: Buffer.from(cv.toBytes().buffer),
                                    fallback: context.fallback ?? false,
                                }))),
                        },
                    },
                },
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            })),
    ];
}

export default addValues;

