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
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    id_oc_alias,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oc-alias.va";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import {
    aliasedEntryName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/aliasedEntryName.oa";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { v4 as uuid } from "uuid";
import writeEntry from "../../database/writeEntry";
import findEntry from "../../x500/findEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import { objectNotFound } from "../results";
import getDistinguishedName from "../../x500/getDistinguishedName";

const ALIAS_OID: string = id_oc_alias.toString();

export
async function add (
    ctx: Context,
    conn: LDAPConnection,
    req: AddRequest,
): Promise<AddResponse> {
    const dn = decodeLDAPDN(ctx, req.entry);
    ctx.log.info(`Creating entry ${Buffer.from(req.entry).toString("utf-8")}...`);
    const superior = findEntry(ctx, ctx.database.data.dit, dn.slice(1), true);
    if (!superior) {
        return objectNotFound; // FIXME: If not authorized...
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
            return (spec?.id.toString() === objectClass["&id"].toString());
        })
        .flatMap((attr) => attr.vals.map((val) => objectClassSyntax.decoder!(val)))
        .map((val) => val.objectIdentifier);

    const aliasedEntries = req.attributes
        .filter((attr) => {
            const normed = normalizeAttributeDescription(attr.type_);
            const spec = ctx.attributes.get(normed);
            return (spec?.id.toString() === aliasedEntryName["&id"].toString());
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

    // TODO: Validate parent and child classes.

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
    const attrs: StoredAttributeValueWithContexts[] = [];
    for (const attr of req.attributes) {
        const type_ = normalizeAttributeDescription(attr.type_);
        const attrType = ctx.attributes.get(type_.trim().toLowerCase());
        const syntax = ctx.ldapSyntaxes.get(Buffer.from(attr.type_).toString("utf-8").trim().toLowerCase());
        if (!syntax || !syntax.decoder || !attrType) {
            return new LDAPResult(
                LDAPResult_resultCode_undefinedAttributeType,
                req.entry,
                Buffer.from(`Attribute ${Buffer.from(attr.type_).toString("utf-8")} is not recognized by this server.`),
                undefined,
            );
        }
        attr.vals.forEach((val) => {
            attrs.push(({
                id: attrType.id,
                value: syntax.decoder!(val),
                contexts: new Map(),
            }));
        });
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

    const result = await writeEntry(ctx, superior, newEntry, [ /*...attrsFromDN,*/ ...attrs ]);
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
