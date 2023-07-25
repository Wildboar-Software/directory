import type {
    Context,
    Vertex,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import type { Prisma } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { validateValues } from "./addValues";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import valuesFromAttribute from "../../x500/valuesFromAttribute";
import rdnToJson from "../../x500/rdnToJson";
import getEqualityNormalizer from "../../x500/getEqualityNormalizer";
import {
    AttributeUsage_userApplications as userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ASN1Construction } from "asn1-ts";

/**
 * @summary Add attributes to an entry.
 * @description
 *
 * Resolves an array of `PrismaPromise`s, which can be `await`ed or `.then()`'d
 * independently or within a Prisma transaction. These promises together will
 * execute the database queries to add the attibutes to the entry.
 *
 * @param ctx The context object
 * @param entry The vertex to which attributes are to be added
 * @param attributes The attributes to be added to the entry
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
async function addAttributes (
    ctx: Context,
    entry: Vertex,
    attributes: Attribute[],
    modifier?: DistinguishedName,
    checkForExisting: boolean = true,
    signErrors: boolean = false,
): Promise<Prisma.PrismaPromise<any>[]> {
    if (!ctx.config.bulkInsertMode) {
        // TODO: Change the function signature to use attributes directly.
        await validateValues(
            ctx,
            entry,
            attributes.flatMap(valuesFromAttribute),
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
    const unspecialAttributes: Attribute[] = [];
    // Process all attribute types that require special handling.
    await Promise.all(
        attributes
            .flatMap((attr) => {
                const driver = ctx.attributeTypes.get(attr.type_.toString())?.driver;
                if (!driver) {
                    unspecialAttributes.push(attr);
                    return [];
                }
                if (driver.addAttribute) {
                    return [driver.addAttribute(ctx, entry, attr, pendingUpdates)];
                } else {
                    return valuesFromAttribute(attr)
                        .map((v) => driver.addValue(ctx, entry, v, pendingUpdates));
                }
            }),
    );
    const noContextValueCreates: Prisma.AttributeValueCreateManyInput[] = [];
    const contextPromises: Prisma.PrismaPromise<any>[] = [];
    for (const attr of unspecialAttributes) {
        const type_oid = attr.type_.toBytes();
        const operational = ((ctx.attributeTypes.get(attr.type_.toString())?.usage ?? userApplications) !== userApplications);
        const normalizer = normalizerGetter(attr.type_);
        for (const value of attr.values) {
            noContextValueCreates.push({
                entry_id: entry.dse.id,
                type_oid,
                operational,
                tag_class: value.tagClass,
                constructed: (value.construction === ASN1Construction.constructed),
                tag_number: value.tagNumber,
                content_octets: Buffer.from(
                    value.value.buffer,
                    value.value.byteOffset,
                    value.value.byteLength,
                ),
                // TODO: Should you just get rid of this column? Or at least not fill it in?
                jer: value.toJSON() as Prisma.InputJsonValue,
                normalized_str: normalizer?.(ctx, value),
            });
        }
        for (const vwc of attr.valuesWithContext ?? []) {
            contextPromises.push(ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type_oid,
                    operational,
                    tag_class: vwc.value.tagClass,
                    constructed: (vwc.value.construction === ASN1Construction.constructed),
                    tag_number: vwc.value.tagNumber,
                    content_octets: Buffer.from(
                        vwc.value.value.buffer,
                        vwc.value.value.byteOffset,
                        vwc.value.value.byteLength,
                    ),
                    jer: vwc.value.toJSON() as Prisma.InputJsonValue,
                    normalized_str: normalizer?.(ctx, vwc.value),
                    ContextValue: {
                        createMany: {
                            data: vwc.contextList
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
            }));
        }
    }
    return [
        ctx.db.entry.update({
            where: {
                id: entry.dse.id,
            },
            data: pendingUpdates.entryUpdate,
            select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
        }),
        ...pendingUpdates.otherWrites,
        ctx.db.attributeValue.createMany({ data: noContextValueCreates }),
        ...contextPromises,
    ];
}

export default addAttributes;
