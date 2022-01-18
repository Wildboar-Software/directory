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

async function validateValues (
    ctx: Context,
    entry: Vertex,
    values: Value[],
    checkForExisting: boolean = true,
): Promise<void> {
    for (const value of values) {
        const TYPE_OID: string = value.type.toString();
        const attrSpec = ctx.attributeTypes.get(TYPE_OID);
        if (attrSpec?.validator) {
            try {
                attrSpec.validator(value.value);
            } catch (e) {
                throw new AttributeError(
                    ctx.i18n.t("err:invalid_attribute_syntax", {
                        type: TYPE_OID,
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
                            undefined,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
                );
            }
        }
        if (checkForExisting) {
            /**
             * As I interpret it, the duplicate values checking does not have to
             * consider contexts. This is a fortuitous conclusion to come to, since
             * it avoids a conflict between DAP and LDAP operation. LDAP has no
             * concept of contexts, so preventing duplicate values regardless of
             * their contexts is valuable here.
             */
            const valueExists: boolean = attrSpec?.driver?.hasValue
                ? await attrSpec.driver.hasValue(ctx, entry, value)
                : !!(await ctx.db.attributeValue.findFirst({
                    where: {
                        entry_id: entry.dse.id,
                        type: TYPE_OID,
                        ber: Buffer.from(value.value.toBytes()),
                    },
                    select: {
                        id: true,
                    },
                }));
            if (valueExists) {
                throw new AttributeError(
                    ctx.i18n.t("err:value_already_exists", {
                        type: TYPE_OID,
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
                            undefined,
                            undefined,
                            attributeError["&errorCode"],
                        ),
                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                        undefined,
                        undefined,
                    ),
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
                                    undefined,
                                    undefined,
                                    attributeError["&errorCode"],
                                ),
                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                undefined,
                                undefined,
                            ),
                        );
                    }
                }
            }
        }
    }
}

export
async function addValues (
    ctx: Context,
    entry: Vertex,
    values: Value[],
    modifier?: DistinguishedName,
    checkForExisting: boolean = true,
): Promise<PrismaPromise<any>[]> {
    if (!ctx.config.bulkInsertMode) {
        await validateValues(ctx, entry, values, checkForExisting);
    }
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
        }),
        ...pendingUpdates.otherWrites,
        ctx.db.attributeValue.createMany({
            data: unspecialValuesWithNoContexts.map((attr) => ({
                entry_id: entry.dse.id,
                type: attr.type.toString(),
                operational: ((ctx.attributeTypes.get(attr.type.toString())?.usage ?? userApplications) !== userApplications),
                tag_class: attr.value.tagClass,
                constructed: (attr.value.construction === ASN1Construction.constructed),
                tag_number: attr.value.tagNumber,
                ber: Buffer.from(attr.value.toBytes()),
                jer: attr.value.toJSON() as Prisma.InputJsonValue,
            })),
        }),
        ...unspecialValuesWithContexts // The ContextValue relation is only available in .create(), not .createMany().
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type: attr.type.toString(),
                    operational: ((ctx.attributeTypes.get(attr.type.toString())?.usage ?? userApplications) !== userApplications),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes()),
                    jer: attr.value.toJSON() as Prisma.InputJsonValue,
                    ContextValue: {
                        createMany: {
                            data: (attr.contexts ?? [])
                                .flatMap((context) => context.contextValues.map((cv) => ({
                                    type: context.contextType.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: Buffer.from(cv.toBytes()),
                                    fallback: context.fallback ?? false,
                                }))),
                        },
                    },
                },
            })),
    ];
}

export default addValues;

