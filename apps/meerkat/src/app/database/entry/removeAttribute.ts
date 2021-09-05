import type {
    Context,
    Vertex,
    IndexableOID,
    SpecialAttributeDatabaseRemover,
    PendingUpdates,
} from "../../types";
import type { PrismaPromise } from "@prisma/client";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { AttributeType } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

// Special Attributes
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";

// Attribute Removers
import * as removers from "../specialAttributeRemovers";
import rdnToJson from "../../x500/rdnToJson";

const specialAttributeDatabaseRemovers: Map<IndexableOID, SpecialAttributeDatabaseRemover> = new Map([
    [ objectClass["&id"]!.toString(), removers.removeObjectClass ],
    [ administrativeRole["&id"]!.toString(), removers.removeAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), removers.removeSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), removers.removeAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],
]);

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
    const remover = specialAttributeDatabaseRemovers.get(type_.toString());
    if (remover) {
        await remover(ctx, entry, pendingUpdates);
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
