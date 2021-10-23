import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import { ASN1Construction } from "asn1-ts";
import type { PrismaPromise, Prisma } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import calculateSortKey from "../calculateSortKey";
import rdnToJson from "../../x500/rdnToJson";

export
async function addValues (
    ctx: Context,
    entry: Vertex,
    attributes: Value[],
    modifier: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier.map(rdnToJson),
        },
        otherWrites: [],
    };
    await Promise.all(
        attributes
            .map((attr) => ctx.attributeTypes.get(attr.type.toString())
                ?.driver
                ?.addValue(ctx, entry, attr, pendingUpdates)),
    );
    return [
        ctx.db.entry.update({
            where: {
                id: entry.dse.id,
            },
            data: pendingUpdates.entryUpdate,
        }),
        ...pendingUpdates.otherWrites,
        ...attributes
            .filter((attr) => !ctx.attributeTypes.get(attr.type.toString())?.driver)
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type: attr.type.toString(),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes()),
                    sort_key: calculateSortKey(attr.value),
                    jer: attr.value.toJSON() as Prisma.InputJsonValue,
                    ContextValue: {
                        createMany: {
                            data: Array.from(attr.contexts?.values() ?? [])
                                .flatMap((context) => context.values.map((cv) => ({
                                    entry_id: entry.dse.id,
                                    type: context.id.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: Buffer.from(cv.toBytes()),
                                    fallback: context.fallback,
                                }))),
                        },
                    },
                },
            })),
    ];
}

export default addValues;

