import type {
    Context,
    Vertex,
    IndexableOID,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "../../types";
import { ASN1Construction } from "asn1-ts";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

// Special Attributes
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";

// Attribute Removers
import * as removers from "../specialAttributeValueRemovers";
import rdnToJson from "../../x500/rdnToJson";

const specialAttributeDatabaseWriters: Map<IndexableOID, SpecialAttributeDatabaseEditor> = new Map([
    [ objectClass["&id"]!.toString(), removers.removeObjectClass ],
    [ administrativeRole["&id"]!.toString(), removers.removeAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), removers.removeSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), removers.removeAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],
]);

export
async function removeValues (
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
            .map((attr) => specialAttributeDatabaseWriters
                .get(attr.id.toString())?.(ctx, entry, attr, pendingUpdates)),
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
            .filter((attr) => !specialAttributeDatabaseWriters.has(attr.id.toString()))
            .map((attr) => ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.dse.id,
                    type: attr.id.toString(),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes()),
                },
            })),
    ];
}

export default removeValues;

