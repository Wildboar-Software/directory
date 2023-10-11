import type {
    Context,
    Vertex,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import type { Prisma } from "@prisma/client";
import { _encode_DistinguishedName, type DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import { DER } from "asn1-ts/dist/node/functional";

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
 * @param entry The entry whose attribute is to be deleted
 * @param type_ The attribute type to be deleted
 * @param modifier The distinguished name of the user doing the deletion
 * @returns An array of `PrismaPromise`s that will perform the deletion once
 *  they are `await`ed or `.then()`'d.
 *
 * @function
 * @async
 */
export
async function removeAttribute (
    ctx: Context,
    entry: Vertex,
    type_: AttributeType,
    modifier?: DistinguishedName,
): Promise<Prisma.PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier
                ? _encode_DistinguishedName(modifier, DER).toBytes()
                : undefined,
        },
        otherWrites: [],
    };
    const spec = ctx.attributeTypes.get(type_.toString());
    if (spec?.driver) {
        await spec.driver.removeAttribute(ctx, entry, pendingUpdates);
        return [
            ctx.db.entry.update({
                where: {
                    id: entry.dse.id,
                },
                data: pendingUpdates.entryUpdate,
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ...pendingUpdates.otherWrites,
        ];
    } else {
        return [
            ctx.db.entry.update({
                where: {
                    id: entry.dse.id,
                },
                data: pendingUpdates.entryUpdate,
                select: { id: true }, // UNNECESSARY See: https://github.com/prisma/prisma/issues/6252
            }),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type_oid: type_.toBytes(),
                },
            }),
        ]
    }
}

export default removeAttribute;
