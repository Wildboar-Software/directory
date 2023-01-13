import type {
    Context,
    Vertex,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
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
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier?.map(rdnToJson),
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
                select: null,
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
                select: null,
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
