import { Context, Entry, IndexableOID } from "../../types";
import type LDAPConnection from "../LDAPConnection";
import type {
    ModifyDNRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNRequest.ta";
import type {
    ModifyDNResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ModifyDNResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import {
    LDAPResult_resultCode_insufficientAccessRights,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import findEntry from "../../x500/findEntry";
import readEntryAttributes from "../../database/readEntryAttributes";
import decodeLDAPDN from "../decodeLDAPDN";
import rdnToJson from "../../x500/rdnToJson";
import { objectNotFound } from "../results";
import { ASN1Construction, OBJECT_IDENTIFIER } from "asn1-ts";
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import bacACDF, {
    PERMISSION_CATEGORY_REMOVE,
    PERMISSION_CATEGORY_RENAME,
    PERMISSION_CATEGORY_EXPORT,
    PERMISSION_CATEGORY_IMPORT,
    PERMISSION_CATEGORY_ADD,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getAdministrativePoint from "../../dit/getAdministrativePoint";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import checkPermissionsOnEntry from "../../bac/checkPermissionsOnEntry";
import checkDiscoverabilityOfEntry from "../../bac/checkDiscoverabilityOfEntry";

// ModifyDNRequest ::= [APPLICATION 12] SEQUENCE {
//     entry           LDAPDN,
//     newrdn          RelativeLDAPDN,
//     deleteoldrdn    BOOLEAN,
//     newSuperior     [0] LDAPDN OPTIONAL }

// FIXME: Needs an isMemberOfGroup implementation.
const IS_MEMBER = () => false;

export
async function modDN (
    ctx: Context,
    conn: LDAPConnection,
    req: ModifyDNRequest,
    controls: Control[] = [],
): Promise<ModifyDNResponse> {

    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;
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

    const dn = decodeLDAPDN(ctx, req.entry);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }
    const oldSuperior: Entry | undefined = entry.parent;
    let newSuperior: Entry | undefined = oldSuperior;
    const oldrdn = entry.rdn;
    const newrdn = decodeLDAPDN(ctx, req.newrdn)[0];
    const oldEntryACIs = await getACIItems(ctx, entry);
    const oldEntryACDFTuples: ACDFTuple[] = (oldEntryACIs ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    if (oldEntryACDFTuples && !userName) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.entry,
            Buffer.from("Anonymous users not permitted. Please authenticate first."),
            undefined,
        );
    }
    if (oldEntryACDFTuples) {
        const permittedToDiscoverOldEntry: boolean = await checkDiscoverabilityOfEntry(
            ctx,
            userName!,
            authLevel,
            entry,
        );
        if (!permittedToDiscoverOldEntry) {
            return objectNotFound;
        }
        const perms: number[] = (req.newSuperior)
            ? [PERMISSION_CATEGORY_RENAME, PERMISSION_CATEGORY_EXPORT]
            : [PERMISSION_CATEGORY_RENAME];
        const permittedToOldEntry: boolean = await checkPermissionsOnEntry(ctx, userName!, authLevel, entry, perms);
        if (!permittedToOldEntry) {
            return new LDAPResult(
                LDAPResult_resultCode_insufficientAccessRights,
                req.entry,
                Buffer.from("Not permitted to rename or export entry."),
                undefined,
            );
        }
    }

    if (req.newSuperior) {
        const newSuperiorDN = decodeLDAPDN(ctx, req.newSuperior);
        newSuperior = findEntry(ctx, ctx.database.data.dit, newSuperiorDN, true);
        if (!newSuperior) {
            return objectNotFound;
        }
        entry.parent = newSuperior;
    }

    const admPoint = getAdministrativePoint(entry);
    const admPointDN = admPoint
        ? getDistinguishedName(admPoint)
        : undefined;
    const newEntryACIs = await getACIItems(ctx, entry);
    const newEntryACDFTuples: ACDFTuple[] = (newEntryACIs ?? [])
        .flatMap((aci) => getACDFTuplesFromACIItem(aci));
    if (newEntryACDFTuples) {
        const permittedToDiscoverNewEntry: boolean = await checkDiscoverabilityOfEntry(
            ctx,
            userName!,
            authLevel,
            entry,
        );
        if (!permittedToDiscoverNewEntry) {
            entry.parent = oldSuperior;
            return objectNotFound;
        }
        const permittedToNewEntry: boolean = await checkPermissionsOnEntry(ctx, userName!, authLevel, entry, [
            PERMISSION_CATEGORY_IMPORT,
        ]);
        if (!permittedToNewEntry) {
            return new LDAPResult(
                LDAPResult_resultCode_insufficientAccessRights,
                req.entry,
                Buffer.from("Not permitted to import entry to destination."),
                undefined,
            );
        }
        for (const atav of newrdn) {
            const { authorized } = bacACDF(
                admPointDN!,
                newEntryACDFTuples,
                authLevel,
                userName!,
                dn,
                { value: atav },
                [ PERMISSION_CATEGORY_ADD ],
                EQUALITY_MATCHER,
                IS_MEMBER,
                false,
            );
            if (!authorized) {
                return new LDAPResult(
                    LDAPResult_resultCode_insufficientAccessRights,
                    req.entry,
                    Buffer.from(`Access denied: cannot add RDN attribute of type ${atav.type_.toString()} here.`),
                    undefined,
                );
            }
        }
        if (req.deleteoldrdn) {
            for (const atav of oldrdn) {
                const { authorized } = bacACDF(
                    admPointDN!,
                    newEntryACDFTuples,
                    authLevel,
                    userName!,
                    dn,
                    { value: atav },
                    [ PERMISSION_CATEGORY_REMOVE ],
                    EQUALITY_MATCHER,
                    IS_MEMBER,
                    false,
                );
                if (!authorized) {
                    return new LDAPResult(
                        LDAPResult_resultCode_insufficientAccessRights,
                        req.entry,
                        Buffer.from(`Access denied: cannot remove RDN attribute of type ${atav.type_.toString()} here.`),
                        undefined,
                    );
                }
            }
        }
    }

    const updateEntryArguments = {
        where: {
            id: entry.id,
        },
        data: {
            rdn: rdnToJson(newrdn),
            immediate_superior_id: newSuperior?.id,
        },
    };
    if (req.deleteoldrdn) {
        const attributeTypesInOldRDN = new Set<IndexableOID>(
            oldrdn.map((atav) => atav.type_.toString()),
        );
        const {
            userAttributes,
            operationalAttributes,
        } = await readEntryAttributes(ctx, entry);
        const attrs = [ ...userAttributes, ...operationalAttributes ];
        const attrsToBeKept = attrs
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
                const relevantRDNValue = oldrdn.find((atav) => atav.type_.isEqualTo(attr.id));
                if (!relevantRDNValue) {
                    return true;
                }
                return !matcher(relevantRDNValue.value, attr.value);
            });
        // See: https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-multiple-records-and-multiple-related-records
        // Modify all of the attributes in memory, then replace them all.
        await ctx.db.$transaction([
            ctx.db.entry.update(updateEntryArguments),
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: entry.id,
                },
            }),
            ...attrsToBeKept.map((attr) => ctx.db.attributeValue.create({
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
    } else {
        await ctx.db.entry.update(updateEntryArguments);
    }

    if (entry.parent?.children.length && (entry.parent !== newSuperior)) {
        const entryIndex = entry.parent.children.findIndex((child) => (child.uuid === entry.uuid));
        entry.parent.children.splice(entryIndex, 1); // Remove from the current parent.
        newSuperior?.children.push(entry); // Move to the new parent.
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
