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
                    ber: Buffer.from(attr.value.toBytes()),
                },
            })),
    ];
}

export default removeValues;

