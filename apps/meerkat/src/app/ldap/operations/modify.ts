import type { Context, Entry, StoredAttributeValueWithContexts, IndexableOID } from "../../types";
import type {
    ModifyRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest.ta";
import type {
    ModifyResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import type {
    ModifyRequest_changes_change,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change.ta";
import {
    ModifyRequest_changes_change_operation_add,
    ModifyRequest_changes_change_operation_delete_,
    ModifyRequest_changes_change_operation_replace,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change-operation.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import readEntry from "../../database/readEntry";
import findEntry from "../../x500/findEntry";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { ASN1Element, ObjectIdentifier, ASN1Construction } from "asn1-ts";
import { objectNotFound } from "../results";
import {
    id_at_userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/id-at-userPwd.va";
import {
    id_at_userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/id-at-userPassword.va";
import {
    UserPwd, _decode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import setEntryPassword from "../../database/setEntryPassword";
import { ContextValue } from "@prisma/client";

const USER_PASSWORD_OID: string = id_at_userPassword.toString();
const USER_PWD_OID: string = id_at_userPwd.toString();

// ModifyRequest ::= [APPLICATION 6] SEQUENCE {
//     object          LDAPDN,
//     changes         SEQUENCE OF change SEQUENCE {
//         operation       ENUMERATED {
//             add     (0),
//             delete  (1),
//             replace (2),
//             ...  },
//         modification    PartialAttribute } }

const doNotStore: Set<IndexableOID> = new Set([
    id_at_userPwd,
    id_at_userPassword,
].map((oid) => oid.toString()));

function executeEntryModification (
    ctx: Context,
    entry: Entry,
    attributes: StoredAttributeValueWithContexts[],
    change: ModifyRequest_changes_change,
): StoredAttributeValueWithContexts[] {
    const attrType = normalizeAttributeDescription(change.modification.type_);
    const attrSpec = ctx.attributes.get(attrType);
    if (!attrSpec?.ldapSyntax) {
        throw new Error();
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax);
    if (!ldapSyntax?.decoder) {
        throw new Error();
    }
    switch (change.operation) {
        case (ModifyRequest_changes_change_operation_add): {
            return [
                ...attributes,
                ...change.modification.vals
                    .map((val: Uint8Array) => ldapSyntax.decoder!(val))
                    .map((val: ASN1Element): StoredAttributeValueWithContexts => ({
                        entry: entry.uuid,
                        id: new ObjectIdentifier(attrSpec.id.split(".").map((node) => Number.parseInt(node))),
                        value: val,
                        contexts: new Map(),
                    })),
            ];
        }
        case (ModifyRequest_changes_change_operation_delete_): {
            const matcher = attrSpec.equalityMatcher;
            if (!matcher) {
                throw new Error(); // We don't know how to compare values of this type.
            }
            const blacklistedValues = change.modification.vals
                .map((val) => ldapSyntax.decoder!(val));
            return attributes
                .filter((attr) => {
                    if (attr.id.toString() !== attrSpec.id) {
                        return true;
                    }
                    /**
                     * From IETF RFC 4511, Section 4.6:
                     *
                     * > If no values are listed, or if all current values of
                     * > the attribute are listed, the entire attribute is
                     * > removed.
                     */
                    if (change.modification.vals.length === 0) {
                        return false;
                    }
                    // It is safe from deletion if no values (not-some) match.
                    return !blacklistedValues.some((bv) => matcher(bv, attr.value));
                });
        }
        case (ModifyRequest_changes_change_operation_replace): {
            // If there are no values, the attribute shall be deleted.
            if (change.modification.vals.length === 0) {
                return attributes.filter((attr) => attr.id.toString() !== attrType);
            }
            const newValues = change.modification.vals
                .map((val) => ldapSyntax.decoder!(val));
            const relevantAttributes = attributes.filter((attr) => attr.id.toString() === attrType);
            // creating the attribute if it did not already exist.
            if (relevantAttributes.length === 0) {
                return [
                    ...attributes,
                    ...newValues.map((nv): StoredAttributeValueWithContexts => ({
                        entry: entry.uuid,
                        id: new ObjectIdentifier(attrSpec.id.split(".").map((node) => Number.parseInt(node))),
                        value: nv,
                        contexts: new Map(),
                    })),
                ];
            } else {
                return [
                    ...attributes.filter((attr) => attr.id.toString() !== attrType),
                    ...newValues.map((nv): StoredAttributeValueWithContexts => ({
                        entry: entry.uuid,
                        id: new ObjectIdentifier(attrSpec.id.split(".").map((node) => Number.parseInt(node))),
                        value: nv,
                        contexts: new Map(),
                    })),
                ];
            }
        }
        default: throw new Error();
    }
}

export
async function modify (
    ctx: Context,
    req: ModifyRequest,
): Promise<ModifyResponse> {
    const dn = decodeLDAPDN(ctx, req.object);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }

    const entryAttributes = await readEntry(ctx, entry);
    let newAttributes = entryAttributes;
    for (const mod of req.changes) {
        // replaceValues could be checked here.
        newAttributes = executeEntryModification(ctx, entry, newAttributes, mod);
    }

    const userPassword = newAttributes.find((attr) => (
        (attr.id.toString() === USER_PASSWORD_OID)
        || (attr.id.toString() === USER_PWD_OID)
    ));
    if (userPassword) {
        const passwordAttributeType: string = userPassword.id.toString();
        if (passwordAttributeType === USER_PASSWORD_OID) {
            const pwd: UserPwd = {
                clear: Buffer.from(userPassword.value.octetString).toString("utf-8"),
            };
            await setEntryPassword(ctx, entry, pwd);
        } else if (passwordAttributeType === USER_PWD_OID) {
            const pwd: UserPwd = _decode_UserPwd(userPassword.value);
            await setEntryPassword(ctx, entry, pwd);
        }
    }

    // See: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records
    // Modify all of the attributes in memory, then replace them all.
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: entry.id,
            },
        }),
        ...newAttributes
            .filter((attr) => !doNotStore.has(attr.id.toString()))
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

    return new LDAPResult(
        0, // Success
        req.object,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default modify;
