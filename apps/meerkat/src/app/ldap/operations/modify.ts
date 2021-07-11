import type { Context, Entry, StoredAttributeValueWithContexts, IndexableOID } from "../../types";
import type LDAPConnection from "../LDAPConnection";
import type {
    ModifyRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest.ta";
import type {
    ModifyResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_insufficientAccessRights,
    LDAPResult_resultCode_undefinedAttributeType,
    LDAPResult_resultCode_other,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import type {
    ModifyRequest_changes_change,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change.ta";
import {
    ModifyRequest_changes_change_operation_add,
    ModifyRequest_changes_change_operation_delete_,
    ModifyRequest_changes_change_operation_replace,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyRequest-changes-change-operation.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import readEntryAttributes from "../../database/readEntryAttributes";
import findEntry from "../../x500/findEntry";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { ASN1Element, ASN1Construction, OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
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
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import type ACDFTupleExtended from "@wildboar/x500/src/lib/types/ACDFTupleExtended";
import bacACDF, {
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_ADD,
    PERMISSION_CATEGORY_MODIFY,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import type ProtectedItem from "@wildboar/x500/src/lib/types/ProtectedItem";
import getAdministrativePoint from "../../dit/getAdministrativePoint";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import checkDiscoverabilityOfEntry from "../../bac/checkDiscoverabilityOfEntry";
import type { LDAPDN } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPDN.ta";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import getIsGroupMember from "../../bac/getIsGroupMember";

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
    dn: LDAPDN,
    attributes: StoredAttributeValueWithContexts[],
    change: ModifyRequest_changes_change,
    checkPermissionsOnEntry: (request: ProtectedItem, permissions: number[]) => boolean,
): StoredAttributeValueWithContexts[] | LDAPResult {
    const attrType = normalizeAttributeDescription(change.modification.type_);
    const attrSpec = ctx.attributes.get(attrType);
    if (!attrSpec?.ldapSyntax) {
        return new LDAPResult(
            LDAPResult_resultCode_undefinedAttributeType,
            dn,
            Buffer.from(`Attribute type ${attrType} is not recognized by this server.`, "utf-8"),
            undefined,
        );
    }
    const ldapSyntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax.toString());
    if (!ldapSyntax?.decoder) {
        return new LDAPResult(
            LDAPResult_resultCode_undefinedAttributeType,
            dn,
            Buffer.from(`Attribute type ${attrType} is not recognized by this server.`, "utf-8"),
            undefined,
        );
    }
    switch (change.operation) {
        case (ModifyRequest_changes_change_operation_add): {
            const values = change.modification.vals
                .map((val: Uint8Array) => ldapSyntax.decoder!(val));
            for (const value of values) {
                const canAdd: boolean = checkPermissionsOnEntry(
                    {
                        value: new AttributeTypeAndValue(
                            attrSpec.id,
                            value,
                        ),
                    },
                    [PERMISSION_CATEGORY_ADD],
                );
                if (!canAdd) {
                    return new LDAPResult(
                        LDAPResult_resultCode_insufficientAccessRights,
                        dn,
                        Buffer.from(`Access denied: Add not permitted for attribute type ${attrType}.`, "utf-8"),
                        undefined,
                    );
                }
            }
            return [
                ...attributes,
                ...values
                    .map((val: ASN1Element): StoredAttributeValueWithContexts => ({
                        id: attrSpec.id,
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
            for (const value of blacklistedValues) {
                const canRemove: boolean = checkPermissionsOnEntry(
                    {
                        value: new AttributeTypeAndValue(
                            attrSpec.id,
                            value,
                        ),
                    },
                    [PERMISSION_CATEGORY_REMOVE],
                );
                if (!canRemove) {
                    return new LDAPResult(
                        LDAPResult_resultCode_insufficientAccessRights,
                        dn,
                        Buffer.from(`Access denied: Add not permitted for attribute type ${attrType}.`, "utf-8"),
                        undefined,
                    );
                }
            }
            return attributes
                .filter((attr) => {
                    if (attr.id.toString() !== attrSpec.id.toString()) {
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
            for (const value of newValues) {
                const canReplace: boolean = checkPermissionsOnEntry(
                    {
                        value: new AttributeTypeAndValue(
                            attrSpec.id,
                            value,
                        ),
                    },
                    [
                        PERMISSION_CATEGORY_ADD,
                        PERMISSION_CATEGORY_REMOVE,
                    ],
                );
                if (!canReplace) {
                    return new LDAPResult(
                        LDAPResult_resultCode_insufficientAccessRights,
                        dn,
                        Buffer.from(`Access denied: Add not permitted for attribute type ${attrType}.`, "utf-8"),
                        undefined,
                    );
                }
            }
            const relevantAttributes = attributes.filter((attr) => attr.id.isEqualTo(attrSpec.id));
            // creating the attribute if it did not already exist.
            if (relevantAttributes.length === 0) {
                return [
                    ...attributes,
                    ...newValues.map((nv): StoredAttributeValueWithContexts => ({
                        id: attrSpec.id,
                        value: nv,
                        contexts: new Map(),
                    })),
                ];
            } else {
                return [
                    ...attributes.filter((attr) => attr.id.toString() !== attrType),
                    ...newValues.map((nv): StoredAttributeValueWithContexts => ({
                        id: attrSpec.id,
                        value: nv,
                        contexts: new Map(),
                    })),
                ];
            }
        }
        default: {
            return new LDAPResult(
                LDAPResult_resultCode_other,
                dn,
                Buffer.from(`Modification type ${change.operation} not recognized by this server.`, "utf-8"),
                undefined,
            );
        }
    }
}

export
async function modify (
    ctx: Context,
    conn: LDAPConnection,
    req: ModifyRequest,
    controls: Control[] = [],
): Promise<ModifyResponse> {

    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
    const isMemberOfGroup = getIsGroupMember(ctx, EQUALITY_MATCHER);
    const authLevel: AuthenticationLevel = {
        basicLevels: new AuthenticationLevel_basicLevels(
            conn.authLevel,
            undefined,
            undefined,
        ),
    };
    const userDN = conn.boundEntry
        ? getDistinguishedName(conn.boundEntry)
        : undefined;
    const userName = userDN
        ? new NameAndOptionalUID(userDN, undefined)
        : undefined;

    const dn = decodeLDAPDN(ctx, req.object);
    const entry = await findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }

    const admPoint = getAdministrativePoint(entry);
    const admPointDN = admPoint
        ? getDistinguishedName(admPoint)
        : undefined;
    const entryACIs = await getACIItems(ctx, entry);
    const entryACDFTuples: ACDFTuple[] = (entryACIs ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const relevantTuples: ACDFTupleExtended[] = (admPointDN && userName)
        ? (await Promise.all(
            entryACDFTuples.map(async (tuple): Promise<ACDFTupleExtended> => [
                ...tuple,
                await userWithinACIUserClass(admPointDN, tuple[0], userName, dn, EQUALITY_MATCHER, isMemberOfGroup),
            ]),
        )).filter((tuple) => (tuple[5] > 0))
        : [];
    if (entryACDFTuples && !userName) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.object,
            Buffer.from("Anonymous users not permitted. Please authenticate first.", "utf-8"),
            undefined,
        );
    }
    if (entryACDFTuples) {
        const permittedToDiscoverEntry = await checkDiscoverabilityOfEntry(ctx, userName!, authLevel, entry);
        if (!permittedToDiscoverEntry) {
            return objectNotFound;
        }
    }

    function checkPermissionsOnEntry (request: ProtectedItem, permissions: number[]): boolean {
        if (!entryACDFTuples) {
            return true;
        }
        const { authorized } = bacACDF(
            relevantTuples,
            authLevel,
            request,
            permissions,
            EQUALITY_MATCHER,
        );
        return authorized;
    }

    const canModifyEntry: boolean = checkPermissionsOnEntry({
        entry: Array.from(entry.objectClass)
            .map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
    }, [PERMISSION_CATEGORY_MODIFY]);
    if (!canModifyEntry) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.object,
            Buffer.from("Access denied: you are not permitted to modify this entry.", "utf-8"),
            undefined,
        );
    }

    const {
        userAttributes,
        operationalAttributes,
    } = await readEntryAttributes(ctx, entry);
    const entryAttributes = [ ...userAttributes, ...operationalAttributes ];
    let newAttributes = entryAttributes;
    for (const mod of req.changes) {
        const result = executeEntryModification(ctx, entry, req.object, newAttributes, mod, checkPermissionsOnEntry);
        if (result instanceof LDAPResult) {
            return result;
        }
        newAttributes = result;
    }

    const userPassword = newAttributes.find((attr) => (
        attr.id.isEqualTo(id_at_userPassword)
        || attr.id.isEqualTo(id_at_userPwd)
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
