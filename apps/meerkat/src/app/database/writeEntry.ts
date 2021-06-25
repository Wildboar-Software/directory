import type { Context, Entry, StoredAttributeValueWithContexts } from "../types";
import { ASN1Construction } from "asn1-ts";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import type { Entry as DatabaseEntry } from "@prisma/client";
import rdnToJson from "../x500/rdnToJson";

const PARENT_OID: string = id_oc_parent.toString();
const CHILD_OID: string = id_oc_child.toString();

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
async function writeEntry (
    ctx: Context,
    superior: Entry,
    entry: Entry,
    attributes: StoredAttributeValueWithContexts[],
): Promise<DatabaseEntry> {
    const writtenEntry = await ctx.db.entry.create({
        data: {
            immediate_superior_id: superior.id,
            dit_id: ctx.dit.id,
            rdn: rdnToJson(entry.rdn),
            aliased_entry_dn: entry.aliasedEntry
                ? rdnToJson(entry.aliasedEntry.rdn)
                : undefined,
            root: entry.dseType.root,
            glue: entry.dseType.glue,
            cp: entry.dseType.cp,
            entry: entry.dseType.entry,
            alias: entry.dseType.alias,
            subr: entry.dseType.subr,
            nssr: entry.dseType.nssr,
            supr: entry.dseType.supr,
            xr: entry.dseType.xr,
            admPoint: entry.dseType.admPoint,
            subentry: entry.dseType.subentry,
            shadow: entry.dseType.shadow,
            immSupr: entry.dseType.immSupr,
            rhob: entry.dseType.rhob,
            sa: entry.dseType.sa,
            dsSubentry: entry.dseType.dsSubentry,
            familyMember: entry.dseType.familyMember,
            ditBridge: entry.dseType.ditBridge,
            writeableCopy: false, // entry.dseType.writeableCopy,
            creatorsName: [{}],
            modifiersName: [{}],
            createdTimestamp: entry.createdTimestamp,
            modifyTimestamp: entry.modifyTimestamp,
            // deleteTimestamp: entry.deleteTimestamp, // Omitted
            is_family_parent: entry.objectClass.has(PARENT_OID),
            is_family_child: entry.objectClass.has(CHILD_OID),
            // hierarchyLevel?: number | null
            // hierarchyBelow?: boolean | null
            // hierarchyParent?: number | null
            // hierarchyTop?: number | null
            // structuralObjectClass: string
            structuralObjectClass: "", // FIXME:
        },
    });
    await ctx.db.$transaction(
        attributes
            .map((attr) => ctx.db.attributeValue.create({
                data: {
                    entry_id: writtenEntry.id,
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
                                    entry_id: writtenEntry.id,
                                    type: context.id.nodes,
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
    );
    return writtenEntry;
}

export default writeEntry;
