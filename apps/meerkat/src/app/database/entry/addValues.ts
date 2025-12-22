import {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeError,
    AttributeTypeDatabaseDriver,
} from "../../types/index.js";
import { ASN1Construction } from "@wildboar/asn1";
import type { Prisma } from "../../generated/client.js";
import type { AttributeValueCreateManyInput } from "../../generated/models/AttributeValue.js";
import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import rdnToJson from "../../x500/rdnToJson.js";
import {
    AttributeProblem_attributeOrValueAlreadyExists,
    AttributeProblem_contextViolation,
    AttributeProblem_invalidAttributeSyntax,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AttributeErrorData_problems_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    attributeError,
} from "@wildboar/x500/DirectoryAbstractService";
import getDistinguishedName from "../../x500/getDistinguishedName.js";
import createSecurityParameters from "../../x500/createSecurityParameters.js";
import {
    AttributeUsage_userApplications as userApplications,
} from "@wildboar/x500/InformationFramework";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import hasValueWithoutDriver from "./hasValueWithoutDriver.js";
import getEqualityNormalizer from "../../x500/getEqualityNormalizer.js";

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
export
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
                        content_octets: value.value.value as Uint8Array<ArrayBuffer>, // Lol. Sorry.
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
 * This is deprecated because it is a slow means to add values to an entry.
 * `addAttributes()` should be used instead, chiefly because it can take
 * advantage of the fact that the attributes are already grouped by type, their
 * contexts are grouped by type, and their values are grouped by whether they
 * have contexts or not.
 *
 * @param ctx The context object
 * @param entry The vertex to which attributes are to be added
 * @param values The values to be added to the entry
 * @param modifier The modifier of the entry
 * @param checkForExisting Whether to check whether the values already exist and
 *  throw an error if so
 * @param signErrors Whether to sign errors
 * @param otherPromises Additional promises to include in the database
 *  transaction to update this entry.
 * @returns An array of `PrismaPromise`s that will effectively add those
 *  attributes to the entry
 *
 * @function
 * @async
 * @deprecated Use `addAttributes()` instead.
 */
export
async function addValues(
    ctx: Context,
    entry: Vertex,
    values: Value[],
    modifier?: DistinguishedName,
    checkForExisting: boolean = true,
    signErrors: boolean = false,
    otherPromises?: PendingUpdates,
): Promise<Prisma.PrismaPromise<any>[]> {
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
    const pendingUpdates: PendingUpdates = otherPromises ?? {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier?.map(rdnToJson),
        },
        otherWrites: [],
    };
    await Promise.all(
        otherPromises // We use this to determine if this function was called from `addAttributes`.
            ? (values // If so, we assume the `addAttribute` driver function was called for all special attributes.
                .map((attr): [ Value, AttributeTypeDatabaseDriver | undefined ] => [
                    attr,
                    ctx.attributeTypes.get(attr.type.toString())?.driver,
                ])
                .filter(([, driver]) => driver && !driver.addAttribute)
                .map(([attr, driver]) => driver!.addValue(ctx, entry, attr, pendingUpdates)))
            : (values // Otherwise, we just use the attributes `addValue` driver function.
                .map((attr) => ctx.attributeTypes.get(attr.type.toString())
                ?.driver
                ?.addValue(ctx, entry, attr, pendingUpdates))),
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
            data: unspecialValuesWithNoContexts.map((attr): AttributeValueCreateManyInput => ({
                entry_id: entry.dse.id,
                type_oid: attr.type.toBytes(),
                operational: ((ctx.attributeTypes.get(attr.type.toString())?.usage ?? userApplications) !== userApplications),
                tag_class: attr.value.tagClass,
                constructed: (attr.value.construction === ASN1Construction.constructed),
                tag_number: attr.value.tagNumber,
                content_octets: attr.value.value as Uint8Array<ArrayBuffer>,
                jer: (attr.value.construction === ASN1Construction.primitive)
                    ? attr.value.toJSON() as Prisma.InputJsonValue
                    : undefined,
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
                    content_octets: attr.value.value as Uint8Array<ArrayBuffer>,
                    jer: (attr.value.construction === ASN1Construction.primitive)
                        ? attr.value.toJSON() as Prisma.InputJsonValue
                        : undefined,
                    normalized_str: normalizerGetter(attr.type)?.(ctx, attr.value),
                    ContextValue: {
                        createMany: {
                            data: (attr.contexts ?? [])
                                .flatMap((context) => context.contextValues.map((cv) => ({
                                    type: context.contextType.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: cv.toBytes(),
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

