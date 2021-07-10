import type { Context, Entry, IndexableOID, StoredAttributeValueWithContexts } from "../../types";
import type LDAPConnection from "../LDAPConnection";
import type {
    AddRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddRequest.ta";
import type {
    AddResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import type {
    Name,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_undefinedAttributeType,
    LDAPResult_resultCode_other,
    LDAPResult_resultCode_objectClassViolation,
    LDAPResult_resultCode_constraintViolation,
    LDAPResult_resultCode_insufficientAccessRights,
    LDAPResult_resultCode_entryAlreadyExists,
    LDAPResult_resultCode_namingViolation,
    LDAPResult_resultCode_unwillingToPerform,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";
import {
    id_oc_parent,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-parent.va";
import {
    id_oc_child,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-child.va";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { v4 as uuid } from "uuid";
import writeEntry from "../../database/writeEntry";
import findEntry from "../../x500/findEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import { objectNotFound } from "../results";
import getDistinguishedName from "../../x500/getDistinguishedName";
import getACIItems from "../../dit/getACIItems";
import getACDFTuplesFromACIItem from "@wildboar/x500/src/lib/bac/getACDFTuplesFromACIItem";
import type ACDFTuple from "@wildboar/x500/src/lib/types/ACDFTuple";
import bacACDF, {
    PERMISSION_CATEGORY_BROWSE,
    PERMISSION_CATEGORY_RETURN_DN,
    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
    PERMISSION_CATEGORY_ADD,
} from "@wildboar/x500/src/lib/bac/bacACDF";
import getAdministrativePoint from "../../dit/getAdministrativePoint";
import { strict as assert } from "assert";
import { ASN1Element, ObjectIdentifier, OBJECT_IDENTIFIER } from "asn1-ts";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type {
    AuthenticationLevel,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import userWithinACIUserClass from "@wildboar/x500/src/lib/bac/userWithinACIUserClass";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import { AttributeTypeAndValue } from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import dsaManagedAttributes from "../../dsaManagedAttributes";
import {
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import type { Control } from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/Control.ta";


const PARENT_OID: string = id_oc_parent.toString();
const CHILD_OID: string = id_oc_child.toString();
const ALIAS_OID: string = id_oc_alias.toString();
const MANAGE_DSAIT: OBJECT_IDENTIFIER = new ObjectIdentifier([ 2, 16, 840, 1, 113730, 3, 4, 2 ]);

// FIXME: Needs an isMemberOfGroup implementation.
const IS_MEMBER = () => false;

// TODO: Limit number of ATAVs in RDN.
// TODO: Creation of subentries
// TODO: Creation of subordinate references (RFC 3296)

export
async function add (
    ctx: Context,
    conn: LDAPConnection,
    req: AddRequest,
    controls: Control[] = [],
): Promise<AddResponse> {

    const EQUALITY_MATCHER = (
        attributeType: OBJECT_IDENTIFIER,
    ): EqualityMatcher | undefined => ctx.attributes.get(attributeType.toString())?.equalityMatcher;

    const dn = decodeLDAPDN(ctx, req.entry);
    ctx.log.info(`Creating entry ${Buffer.from(req.entry).toString("utf-8")}...`);
    const superior = findEntry(ctx, ctx.database.data.dit, dn.slice(1), true);
    if (!superior) {
        return objectNotFound;
    }
    const superiorDN = getDistinguishedName(superior);
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
    const admPoint = getAdministrativePoint(superior);
    const superiorACIs = await getACIItems(ctx, superior);
    const superiorACDFTuples: ACDFTuple[] = (superiorACIs ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const accessControlled: boolean = Boolean(superiorACIs);
    if (accessControlled && !userName) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.entry,
            Buffer.from("Anonymous users not permitted. Please authenticate first."),
            undefined,
        );
    }
    if (accessControlled) {
        assert(admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        const relevantTuples = superiorACDFTuples.filter((tuple) => userWithinACIUserClass(
            admPointDN,
            tuple[0],
            userName!,
            superiorDN,
            EQUALITY_MATCHER,
            IS_MEMBER,
        ) > -1);
        const {
            authorized: authorizedToKnowAboutSuperiorEntry,
        } = bacACDF(
            admPointDN,
            relevantTuples,
            authLevel,
            userName!,
            dn,
            {
                entry: Array.from(superior.objectClass)
                    .map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
            },
            [
                PERMISSION_CATEGORY_BROWSE,
                PERMISSION_CATEGORY_RETURN_DN,
            ],
            EQUALITY_MATCHER,
            IS_MEMBER,
            true,
        );
        if (!authorizedToKnowAboutSuperiorEntry) {
            /**
             * NOTE: For security purposes, this MUST be the same exact error
             * that is disclosed if the superior entry is not found, otherwise
             * a nefarious user could attempt to add entries to reveal which
             * entries already exist by observing which attempts do _not_ return
             * the object-not-found error.
             *
             * Also note that this behavior is not imposed by the X.500
             * standards, which specifically states that:
             *
             * > No specific permission is required to the immediate superior
             * > of the entry identified by the object argument.
             *
             * Knowingly deviating from the standard, this implementation
             * requires Browse and ReturnDN permissions, which are the same
             * permissions that are required for an entry to appear in a list
             * operation.
             */
            return objectNotFound;
        }
    }
    if (superior.dseType.alias || superior.aliasedEntry) {
        return new LDAPResult(
            LDAPResult_resultCode_constraintViolation,
            req.entry,
            Buffer.from(`Parent of ${Buffer.from(req.entry).toString("utf-8")} is an alias.`),
            undefined,
        );
    }
    const creatorsName: Name | undefined = conn.boundEntry
        ? {
            rdnSequence: getDistinguishedName(conn.boundEntry),
        }
        : undefined;
    const entryUUID = uuid();
    const now = new Date();

    // It seems like you can only create entry and alias DSEs via LDAP...
    const objectClassSpec = ctx.attributes.get(objectClass["&id"].toString());
    if (!objectClassSpec?.ldapSyntax) {
        throw new Error();
    }
    const objectClassSyntax = ctx.ldapSyntaxes.get(objectClassSpec.ldapSyntax.toString());
    if (!objectClassSyntax?.decoder) {
        throw new Error();
    }

    const aliasedEntryNameSpec = ctx.attributes.get(aliasedEntryName["&id"].toString());
    if (!aliasedEntryNameSpec?.ldapSyntax) {
        throw new Error();
    }
    const aliasedEntryNameSyntax = ctx.ldapSyntaxes.get(aliasedEntryNameSpec.ldapSyntax.toString());
    if (!aliasedEntryNameSyntax?.decoder) {
        throw new Error();
    }

    const objectClasses = req.attributes
        .filter((attr) => {
            const normed = normalizeAttributeDescription(attr.type_);
            const spec = ctx.attributes.get(normed);
            return spec?.id.isEqualTo(objectClass["&id"]);
        })
        .flatMap((attr) => attr.vals.map((val) => objectClassSyntax.decoder!(val)))
        .map((val) => val.objectIdentifier);

    const aliasedEntries = req.attributes
        .filter((attr) => {
            const normed = normalizeAttributeDescription(attr.type_);
            const spec = ctx.attributes.get(normed);
            return spec?.id.isEqualTo(aliasedEntryName["&id"]);
        })
        .flatMap((attr) => attr.vals.map((val) => aliasedEntryNameSyntax.decoder!(val)))
        .map((val) => _decode_DistinguishedName(val));
    if (aliasedEntries.length > 1) {
        return new LDAPResult(
            LDAPResult_resultCode_constraintViolation,
            req.entry,
            Buffer.from(`Attribute type aliasedEntryName is single-valued, but you supplied multiple values.`),
            undefined,
        );
    }

    const newEntry: Entry = {
        id: -1,
        uuid: entryUUID,
        rdn: dn[0],
        parent: superior,
        dseType: {
            entry: true, // TODO: Should this be false if alias is true?
            alias: (aliasedEntries.length > 0),
        },
        children: [],
        objectClass: new Set(objectClasses.map((oc) => oc.toString())),
        creatorsName,
        modifiersName: creatorsName,
        createdTimestamp: now,
        modifyTimestamp: now,
    };

    const newEntryACIs = await getACIItems(ctx, newEntry);
    const newEntryACDFTuples: ACDFTuple[] = (newEntryACIs ?? []).flatMap((aci) => getACDFTuplesFromACIItem(aci));
    const admPointDN = admPoint
        ? getDistinguishedName(admPoint)
        : undefined;
    const relevantNewEntryACDFTuples = admPointDN
        ? newEntryACDFTuples.filter((tuple) => userWithinACIUserClass(
            admPointDN,
            tuple[0],
            userName!,
            dn,
            EQUALITY_MATCHER,
            IS_MEMBER,
        ) > -1)
        : [];

    function checkEntryPermissionsOnNewEntry (grants: number[]): boolean {
        if (!accessControlled || !admPointDN) {
            return true;
        }
        const {
            authorized,
        } = bacACDF(
            // It is not possible to create an administrative point through LDAP
            // currently, but if it were, this admPointDN would need to be set
            // to the new entry's DN.
            admPointDN,
            relevantNewEntryACDFTuples,
            authLevel,
            userName!,
            dn,
            {
                entry: objectClasses,
            },
            grants,
            EQUALITY_MATCHER,
            IS_MEMBER,
            true,
        );
        return authorized;
    }

    function userCanAddValueOnNewEntry (attributeType: OBJECT_IDENTIFIER, value: ASN1Element): boolean {
        if (!accessControlled || !admPointDN) {
            return true;
        }
        const {
            authorized,
        } = bacACDF(
            // It is not possible to create an administrative point through LDAP
            // currently, but if it were, this admPointDN would need to be set
            // to the new entry's DN.
            admPointDN,
            relevantNewEntryACDFTuples,
            authLevel,
            userName!,
            dn,
            {
                value: new AttributeTypeAndValue(
                    attributeType,
                    value,
                ),
            },
            [PERMISSION_CATEGORY_ADD],
            EQUALITY_MATCHER,
            IS_MEMBER,
            true,
        );
        return authorized;
    }

    const authorizedToAddEntry: boolean = checkEntryPermissionsOnNewEntry([PERMISSION_CATEGORY_ADD]);
    if (!authorizedToAddEntry) {
        return new LDAPResult(
            LDAPResult_resultCode_insufficientAccessRights,
            req.entry,
            Buffer.from("You may not add this entry."),
            undefined,
        );
    }

    async function checkPermissionsOnAlreadyExistingEntry (
        entry: Entry,
        grants: number[],
    ): Promise<boolean> {
        if (!accessControlled) {
            return true;
        }
        const existingDN = [ entry.rdn, ...superiorDN ];
        const existingACIs = await getACIItems(ctx, entry);
        const existingACDFTuples: ACDFTuple[] = (existingACIs ?? [])
            .flatMap((aci) => getACDFTuplesFromACIItem(aci));
        assert(admPoint);
        const admPointDN = getDistinguishedName(admPoint);
        const name = new NameAndOptionalUID(existingDN, undefined);
        const {
            authorized,
        } = bacACDF(
            admPointDN,
            existingACDFTuples,
            authLevel,
            name,
            existingDN,
            {
                entry: Array.from(entry.objectClass)
                    .map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
            },
            grants,
            EQUALITY_MATCHER,
            IS_MEMBER,
            false,
        );
        return authorized;
    }

    // Check if the entry already exists.
    for (const child of superior.children) {
        const childDN = [ child.rdn, ...superiorDN ]; // FIXME: Reverse.
        if (!compareRDNSequence(childDN, dn, EQUALITY_MATCHER)) {
            continue;
        }
        /**
         * NOTE: ITU Recommendation X.511 says that the entry-already-exists
         * error may be returned only if the user has Add or Disclose-on-error
         * permissions to that entry. However, I consider this insecure, because
         * a user could still attempt to mass-create entries in an attempt to
         * discover ones that would otherwise be hidden from him.
         *
         * Knowingly in defiance of the standard, this implementation also
         * checks that the user has Browse and ReturnDN permissions for the
         * existing entry, because these are the permissions that would be
         * required for this entry to appear in a list operation.
         */
        if (
            !accessControlled
            || (
                await checkPermissionsOnAlreadyExistingEntry(child, [
                    PERMISSION_CATEGORY_ADD,
                    PERMISSION_CATEGORY_BROWSE,
                    PERMISSION_CATEGORY_RETURN_DN,
                ])
                || await checkPermissionsOnAlreadyExistingEntry(child, [
                    PERMISSION_CATEGORY_DISCLOSE_ON_ERROR,
                    PERMISSION_CATEGORY_BROWSE,
                    PERMISSION_CATEGORY_RETURN_DN,
                ])
            )
        ) {
            return new LDAPResult(
                LDAPResult_resultCode_entryAlreadyExists,
                req.entry,
                Buffer.from("Entry already exists."),
                undefined,
            );
        } else {
            return new LDAPResult(
                LDAPResult_resultCode_insufficientAccessRights,
                req.entry,
                Buffer.from("Access denied."),
                undefined,
            );
        }
    }

    if (
        objectClasses.some((oc) => oc.isEqualTo(id_oc_child))
        && !superior.objectClass.has(PARENT_OID)
    ) {
        return new LDAPResult(
            LDAPResult_resultCode_other,
            req.entry,
            Buffer.from("Cannot create an object of child class when the superior is not parent class."),
            undefined,
        );
    }

    const manageDSAIT: boolean = controls.some((control) => control.controlType.toString() === MANAGE_DSAIT.toString());
    const attrs: StoredAttributeValueWithContexts[] = [];
    for (const attr of req.attributes) {
        const type_ = normalizeAttributeDescription(attr.type_);
        const attrType = ctx.attributes.get(type_.trim().toLowerCase());
        const syntax = ctx.ldapSyntaxes.get(attrType?.ldapSyntax?.toString() ?? "");
        if (!syntax || !syntax.decoder || !attrType) {
            return new LDAPResult(
                LDAPResult_resultCode_undefinedAttributeType,
                req.entry,
                Buffer.from(`Attribute type ${Buffer.from(attr.type_).toString("utf-8")} is not recognized by this server.`),
                undefined,
            );
        }
        for (let i = 0; i < attr.vals.length; i++) {
            const val = attr.vals[i];
            const decodedValue = syntax.decoder!(val);
            const userIsAuthorizedToAddThisValue = userCanAddValueOnNewEntry(attrType.id, decodedValue);
            if (!userIsAuthorizedToAddThisValue) {
                return new LDAPResult(
                    LDAPResult_resultCode_insufficientAccessRights,
                    req.entry,
                    Buffer.from(`Not authorized to write value #${i} of type ${attrType.id.toString()}.`),
                    undefined,
                );
            }
            attrs.push(({
                id: attrType.id,
                value: decodedValue,
                contexts: new Map(),
            }));
        }
    }
    for (const atav of dn[0]) {
        const TYPE_OID: string = atav.type_.toString();
        const userIsAuthorizedToAddThisValue = userCanAddValueOnNewEntry(atav.type_, atav.value);
        if (!userIsAuthorizedToAddThisValue) {
            return new LDAPResult(
                LDAPResult_resultCode_insufficientAccessRights,
                req.entry,
                Buffer.from(`Not authorized to write RDN value of type ${TYPE_OID}.`),
                undefined,
            );
        }
        const attrType = ctx.attributes.get(atav.type_.toString());
        if (!attrType) {
            return new LDAPResult(
                LDAPResult_resultCode_undefinedAttributeType,
                req.entry,
                Buffer.from(`Attribute type ${TYPE_OID} is not recognized by this server.`),
                undefined,
            );
        }
        if (!attrType.namingMatcher) {
            return new LDAPResult(
                LDAPResult_resultCode_namingViolation,
                req.entry,
                Buffer.from(`Attribute type ${TYPE_OID} may not be used for naming.`),
                undefined,
            );
        }
        const matcher = attrType.namingMatcher;
        const alreadyPresentInList: boolean = attrs
            .some((attr) => {
                if (attr.id.isEqualTo(atav.type_)) {
                    return false;
                }
                return matcher(attr.value, atav.value);
            });
        // LDAP users are allowed to have values in the RDN that are not present
        // in the attributes list. If not in the list, they must be added.
        if (!alreadyPresentInList) {
            attrs.push(({
                id: atav.type_,
                value: atav.value,
                contexts: new Map(),
            }));
        }
    }

    const requiredAttribute: Set<IndexableOID> = new Set();
    const permittedAttributes: Set<IndexableOID> = new Set();
    for (const objectClassId of objectClasses) {
        const objectClass = ctx.objectClasses.get(objectClassId.toString());
        if (!objectClass) {
            return new LDAPResult(
                LDAPResult_resultCode_other,
                req.entry,
                Buffer.from(`Object class ${objectClassId} not recognized.`, "utf-8"),
                undefined,
            );
        }
        // There is no need to traverse the hierarchy into parent classes, because
        // ITU Rec. X.501, Section 13.3 says that the attribute listings must
        // include those of its parent classes.
        for (const attr of objectClass.mandatoryAttributes) {
            requiredAttribute.add(attr.toString());
            permittedAttributes.add(attr.toString());
        }
        for (const attr of objectClass.optionalAttributes) {
            permittedAttributes.add(attr.toString());
        }
    }

    for (const attr of attrs) {
        const TYPE_OID: string = attr.id.toString();
        const spec = ctx.attributes.get(TYPE_OID);
        assert(spec); // We already checked that the attribute type is recognized.
        if (
            !manageDSAIT
            && (spec.usage !== AttributeUsage_userApplications)
        ) {
            return new LDAPResult(
                LDAPResult_resultCode_unwillingToPerform,
                req.entry,
                Buffer.from(`Attribute type ${TYPE_OID} may only be managed if the ManageDSAIT control is used.`),
                undefined,
            );
        }

        if (dsaManagedAttributes.has(TYPE_OID)) {
            return new LDAPResult(
                LDAPResult_resultCode_unwillingToPerform,
                req.entry,
                Buffer.from(
                    `Attribute type ${TYPE_OID} is managed by this server and `
                    + "may never be modified by users, including administrators.",
                ),
                undefined,
            );
        }

        if (!permittedAttributes.has(TYPE_OID)) {
            return new LDAPResult(
                LDAPResult_resultCode_objectClassViolation,
                req.entry,
                Buffer.from(
                    `Attribute type ${TYPE_OID} not permitted within these `
                    + `object classes: ${objectClasses.map((oc) => oc.toString())}.`, "utf-8"),
                undefined,
            );
        }
        requiredAttribute.delete(TYPE_OID);
    }
    if (requiredAttribute.size > 0) {
        return new LDAPResult(
            LDAPResult_resultCode_objectClassViolation,
            req.entry,
            Buffer.from(`These required attributes not supplied: ${Array.from(requiredAttribute).join(", ")}`, "utf-8"),
            undefined,
        );
    }

    const result = await writeEntry(ctx, superior, newEntry, [ ...attrs ]);
    newEntry.id = result.id;
    superior.children.push(newEntry);
    ctx.log.info(`Created entry ${Buffer.from(req.entry).toString("utf-8")}.`);
    return new LDAPResult(
        LDAPResult_resultCode_success,
        req.entry,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default add;
