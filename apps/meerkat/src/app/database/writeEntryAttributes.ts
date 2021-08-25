import type { Context, Vertex, IndexableOID, StoredAttributeValueWithContexts } from "../types";
import { ASN1Construction, BERElement } from "asn1-ts";
import { id_aca_entryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-entryACI.va";
import { id_aca_prescriptiveACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-prescriptiveACI.va";
import { id_aca_subentryACI } from "@wildboar/x500/src/lib/modules/BasicAccessControl/id-aca-subentryACI.va";
import {
    ACIItem,
    _decode_ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    _encode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    id_oa_subtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-subtreeSpecification.va";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import { ACIScope, PrismaPromise } from "@prisma/client";

const SUBTREE_SPEC_OID: string = id_oa_subtreeSpecification.toString();

type SpecialAttributeHandler = (
    ctx: Readonly<Context>,
    entry: Vertex,
    attribute: StoredAttributeValueWithContexts,
) => PrismaPromise<void>;

const writeSomeACI: (scope: ACIScope) => SpecialAttributeHandler = (scope: ACIScope) => {
    return (
        ctx: Readonly<Context>,
        entry: Vertex,
        attribute: StoredAttributeValueWithContexts,
    ): PrismaPromise<any> => {
        // We ignore contexts for this.
        const aci: ACIItem = _decode_ACIItem(attribute.value);
        return ctx.db.aCIItem.create({
            data: {
                entry_id: entry.dse.id,
                tag: directoryStringToString(aci.identificationTag),
                precedence: aci.precedence,
                auth_level_basic_level: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.level
                    : undefined,
                auth_level_basic_local_qualifier: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.localQualifier
                    : undefined,
                auth_level_basic_signed: ("basicLevels" in aci.authenticationLevel)
                    ? aci.authenticationLevel.basicLevels.signed
                    : undefined,
                ber: Buffer.from(attribute.value.toBytes()),
                scope,
            },
        });
    };
}

const writeEntryACI = writeSomeACI(ACIScope.ENTRY);
const writePrescriptiveACI = writeSomeACI(ACIScope.PRESCRIPTIVE);
const writeSubentryACI = writeSomeACI(ACIScope.SUBENTRY);

const speciallyHandledAttributes: Map<IndexableOID, SpecialAttributeHandler> = new Map([
    [ id_aca_entryACI.toString(), writeEntryACI ],
    [ id_aca_prescriptiveACI.toString(), writePrescriptiveACI ],
    [ id_aca_subentryACI.toString(), writeSubentryACI ],
]);

/**
 * Prisma does not allow you to recurse three levels deep in a call to
 * `create()`, meaning that we would not be able to create the context values
 * for all contexts for all attributes of the entry in addition to the entry
 * itself in a single pass. For a lack of a better option, this function creates
 * the entry alone, then all of the attributes and context values in two
 * separate transactions.
 *
 * @param ctx
 * @param entry
 * @param attributes
 */
export
async function writeEntryAttributes (
    ctx: Context,
    entry: Vertex,
    attributes: StoredAttributeValueWithContexts[],
): Promise<any> {
    return ctx.db.$transaction([
        ...attributes
            .filter((attr) => speciallyHandledAttributes.has(attr.id.toString()))
            .map((attr) => {
                const handler = speciallyHandledAttributes.get(attr.id.toString());
                if (!handler) { // Should never happen.
                    throw new Error();
                }
                return handler(ctx, entry, attr);
            }),
        ...attributes
            .filter((attr) => !speciallyHandledAttributes.has(attr.id.toString()))
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
        ...(entry.dse.subentry?.subtreeSpecification ?? [])
            .map((subtree) => {
                const value = _encode_SubtreeSpecification(subtree, () => new BERElement());
                return ctx.db.attributeValue.create({
                    data: {
                        entry_id: entry.dse.id,
                        type: SUBTREE_SPEC_OID,
                        tag_class: value.tagClass,
                        constructed: (value.construction === ASN1Construction.constructed),
                        tag_number: value.tagNumber,
                        ber: Buffer.from(value.toBytes()),
                        hint: undefined,
                        jer: undefined,
                        visible_to_ldap: true,
                    },
                });
            }),
    ]);
}

export default writeEntryAttributes;

