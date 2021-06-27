import { Context, IndexableOID } from "../../types";
import type {
    ModifyDNRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNRequest.ta";
import type {
    ModifyDNResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import findEntry from "../../x500/findEntry";
import readEntry from "../../database/readEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import rdnToJson from "../../x500/rdnToJson";
import { objectNotFound } from "../results";
import { ASN1Construction } from "asn1-ts";

// ModifyDNRequest ::= [APPLICATION 12] SEQUENCE {
//     entry           LDAPDN,
//     newrdn          RelativeLDAPDN,
//     deleteoldrdn    BOOLEAN,
//     newSuperior     [0] LDAPDN OPTIONAL }

export
async function modDN (
    ctx: Context,
    req: ModifyDNRequest,
): Promise<ModifyDNResponse> {
    const dn = decodeLDAPDN(ctx, req.entry);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }
    const oldrdn = entry.rdn;
    const newrdn = decodeLDAPDN(ctx, req.newrdn)[0];
    if (req.newSuperior) {
        const newSuperiorDN = decodeLDAPDN(ctx, req.newSuperior);
        const newSuperior = findEntry(ctx, ctx.database.data.dit, newSuperiorDN, true);
        if (!newSuperior) {
            throw new Error();
        }
        await ctx.db.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                rdn: rdnToJson(newrdn),
                immediate_superior_id: newSuperior?.id,
            },
        });
        if (entry.parent?.children.length && (entry.parent !== newSuperior)) {
            const entryIndex = entry.parent.children.findIndex((child) => (child.uuid === entry.uuid));
            entry.parent.children.splice(entryIndex, 1); // Remove from the current parent.
            newSuperior?.children.push(entry); // Move to the new parent.
        }
        entry.parent = newSuperior;
    } else {
        await ctx.db.entry.update({
            where: {
                id: entry.id,
            },
            data: {
                rdn: rdnToJson(newrdn),
            },
        });
    }


    if (req.deleteoldrdn) {
        const attributeTypesInOldRDN = new Set<IndexableOID>(
            oldrdn.map((atav) => atav.type_.toString()),
        );
        const attrs = await readEntry(ctx, entry);
        // See: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records
        // Modify all of the attributes in memory, then replace them all.
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.id,
                },
            }),
            ...attrs
                .filter((attr) => {
                    const ATTR_TYPE: string = attr.id.toString();
                    if (!attributeTypesInOldRDN.has(ATTR_TYPE)) {
                        return true;
                    }
                    const attrSpec = ctx.attributes.get(ATTR_TYPE);
                    if (!attrSpec?.equalityMatcher) { // If we don't understand the attribute type, we just keep it.
                        return true;
                    }
                    const matcher = attrSpec.equalityMatcher;
                    const relevantRDNValue = oldrdn.find((atav) => atav.type_.toString() === ATTR_TYPE);
                    if (!relevantRDNValue) {
                        return true;
                    }
                    return !matcher(relevantRDNValue.value, attr.value);
                })
                .map((attr) => ctx.db.attributeValue.create({
                    data: {
                        entry_id: entry.id,
                        type: attr.id.toString(),
                        tag_class: attr.value.tagClass,
                        constructed: (attr.value.construction === ASN1Construction.constructed),
                        tag_number: attr.value.tagNumber,
                        ber: Buffer.from(attr.value.toBytes()),
                        ContextValue: {
                            createMany: {
                                data: Array.from(attr.contexts.values())
                                    .flatMap((context) => context.values
                                        .map((cv) => ({
                                            // id: null,
                                            // value_id: null,
                                            entry_id: entry.id,
                                            type: context.id.nodes,
                                            tag_class: cv.tagClass,
                                            constructed: (cv.construction === ASN1Construction.constructed),
                                            tag_number: cv.tagNumber,
                                            ber: Buffer.from(cv.toBytes()),
                                            // hint: null,
                                            // jer: null,
                                            fallback: context.fallback,
                                        }))),
                            }
                        }
                    },
                })),
        ]);
    }

    entry.rdn = newrdn;

    return new LDAPResult(
        0, // Success
        req.entry,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default modDN;
