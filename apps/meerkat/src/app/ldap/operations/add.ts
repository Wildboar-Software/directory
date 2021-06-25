import type { Context, Entry, StoredAttributeValueWithContexts } from "../../types";
import type {
    AddRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddRequest.ta";
import type {
    AddResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/AddResponse.ta";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";
import { v4 as uuid } from "uuid";
import writeEntry from "../../database/writeEntry";
import findEntry from "../../x500/findEntry";
import { ObjectIdentifier } from "asn1-ts";
import decodeLDAPDN from "../decodeLDAPDN";

export
async function add (
    ctx: Context,
    req: AddRequest,
): Promise<AddResponse> {
    const dn = decodeLDAPDN(ctx, req.entry);
    ctx.log.info(`Creating entry ${Buffer.from(req.entry).toString("utf-8")}...`);
    const superior = findEntry(ctx, ctx.database.data.dit, dn.slice(1), true);
    if (!superior) {
        throw new Error();
    }
    const entryUUID = uuid();
    const newEntry: Entry = {
        id: -1,
        uuid: entryUUID,
        rdn: dn[0],
        parent: superior,
        dseType: {
            entry: true,
        },
        children: [],
        objectClass: new Set(), // FIXME:
        creatorsName: {
            rdnSequence: [], // FIXME:
        },
        modifiersName: {
            rdnSequence: [], // FIXME:
        },
        createdTimestamp: new Date(),
        modifyTimestamp: new Date(),
    };
    const attrs: StoredAttributeValueWithContexts[] = req.attributes.flatMap((attr) => {
        const type_ = normalizeAttributeDescription(attr.type_);
        const attrType = ctx.attributes.get(type_.trim().toLowerCase());
        const syntax = ctx.ldapSyntaxes.get(Buffer.from(attr.type_).toString("utf-8").trim().toLowerCase());
        if (!syntax || !syntax.decoder || !attrType) {
            return []; // FIXME:
        }
        return attr.vals.map((val) => ({
            entry: entryUUID,
            id: new ObjectIdentifier(attrType.id.split(".").map((num) => Number.parseInt(num))), // TODO: Make this an OID.
            value: syntax.decoder!(val),
            contexts: new Map(),
        }));
    });
    const result = await writeEntry(ctx, superior, newEntry, [ /*...attrsFromDN,*/ ...attrs ]);
    newEntry.id = result.id;
    superior.children.push(newEntry);
    ctx.log.info(`Created entry ${Buffer.from(req.entry).toString("utf-8")}.`);
    return new LDAPResult(
        0, // Success
        req.entry,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default add;
