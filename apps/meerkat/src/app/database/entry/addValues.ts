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

// Attribute Adders
import * as adders from "../specialAttributeAdders";
import rdnToJson from "../../x500/rdnToJson";

const specialAttributeDatabaseWriters: Map<IndexableOID, SpecialAttributeDatabaseEditor> = new Map([
    [ objectClass["&id"]!.toString(), adders.addObjectClass ],
    [ administrativeRole["&id"]!.toString(), adders.addAdministrativeRole ],
    [ subtreeSpecification["&id"]!.toString(), adders.addSubtreeSpecification ],
    [ accessControlScheme["&id"]!.toString(), adders.addAccessControlScheme ],
    // [ id_aca_entryACI.toString(), writeEntryACI ],
    // [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    // [ id_aca_subentryACI.toString(), writeSubentryACI ],
]);

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
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: entry.dse.id,
                    type: attr.id.toString(),
                    tag_class: attr.value.tagClass,
                    constructed: (attr.value.construction === ASN1Construction.constructed),
                    tag_number: attr.value.tagNumber,
                    ber: Buffer.from(attr.value.toBytes()),
                    hint: undefined,
                    jer: undefined,
                    visible_to_ldap: true,
                    ContextValue: {
                        createMany: {
                            data: Array.from(attr.contexts.values())
                                .flatMap((context) => context.values.map((cv) => ({
                                    entry_id: entry.dse.id,
                                    type: context.id.toString(),
                                    tag_class: cv.tagClass,
                                    constructed: (cv.construction === ASN1Construction.constructed),
                                    tag_number: cv.tagNumber,
                                    ber: Buffer.from(cv.toBytes()),
                                    fallback: context.fallback,
                                    // hint
                                    // jer
                                }))),
                        },
                    },
                },
            })),
    ];
}

export default addValues;

