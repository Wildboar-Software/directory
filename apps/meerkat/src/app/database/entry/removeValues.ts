import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import { ASN1Construction } from "asn1-ts";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToJson from "../../x500/rdnToJson";

/**
 * @summary Delete an attribute from an entry
 * @description
 *
 * This function produces an array of `PrismaPromise`s that will perform the
 * deletion. Note that `PrismaPromise` differs from `Promise` in that it will
 * not execute any database query until it is `await`ed or `.then()`'d. The
 * rationale for returning unexecuted `PrismaPromise`s is that they can all be
 * executed within a transaction by the callee, if desired.
 *
 * @param ctx The context object
 * @param entry The entry whose values are to be deleted
 * @param values The values to be deleted
 * @param modifier The distinguished name of the user doing the deletion
 * @returns An array of `PrismaPromise`s that will perform the deletion once
 *  they are `await`ed or `.then()`'d.
 *
 * @function
 * @async
 */
export
async function removeValues (
    ctx: Context,
    entry: Vertex,
    values: Value[],
    modifier?: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier?.map(rdnToJson),
        },
        otherWrites: [],
    };
    await Promise.all(
        values
            .map((attr) => ctx.attributeTypes.get(attr.type.toString())?.driver?.removeValue(ctx, entry, attr, pendingUpdates)),
    );
    return [
        ctx.db.entry.update({
            where: {
                id: entry.dse.id,
            },
            data: pendingUpdates.entryUpdate,
        }),
        ...pendingUpdates.otherWrites,
        ...values
            .filter((attr) => !ctx.attributeTypes.get(attr.type.toString())?.driver)
            .map((attr) => ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: attr.type.toString(),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes().buffer),
                },
            })),
    ];
}

export default removeValues;

