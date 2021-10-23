import type {
    Context,
    Vertex,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import rdnToJson from "../../x500/rdnToJson";

export
async function removeAttribute (
    ctx: Context,
    entry: Vertex,
    type_: AttributeType,
    modifier: DistinguishedName,
): Promise<PrismaPromise<any>[]> {
    const pendingUpdates: PendingUpdates = {
        entryUpdate: {
            modifyTimestamp: new Date(),
            modifiersName: modifier.map(rdnToJson),
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
            }),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: type_.toString(),
                },
            }),
        ]
    }
}

export default removeAttribute;
