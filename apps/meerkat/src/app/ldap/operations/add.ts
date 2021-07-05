import type { Context, Entry, StoredAttributeValueWithContexts } from "../../types";
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
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    objectClass,
} from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { v4 as uuid } from "uuid";
import writeEntry from "../../database/writeEntry";
import findEntry from "../../x500/findEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import { objectNotFound } from "../results";
import getDistinguishedName from "../../x500/getDistinguishedName";

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
        return objectNotFound;
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

    const objectClasses = req.attributes
        .filter((attr) => {
            const normed = normalizeAttributeDescription(attr.type_);
            const spec = ctx.attributes.get(normed);
            return (spec?.id.toString() === objectClass["&id"].toString());
        })
        .flatMap((attr) => attr.vals.map((val) => objectClassSyntax.decoder!(val)))
        .map((val) => val.objectIdentifier);

    const newEntry: Entry = {
        id: -1,
        uuid: entryUUID,
        rdn: dn[0],
        parent: superior,
        dseType: {
            entry: true,
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
    // TODO: Validate against object classes.
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
