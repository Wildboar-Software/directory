import type { Context } from "../../types";
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
import decodeLDAPDN from "../decodeLDAPDN";
import rdnToJson from "../../x500/rdnToJson";

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
        throw new Error(); // FIXME:
    }
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

    // TODO: If deleteoldrn, delete the matching attribute values.
    return new LDAPResult(
        0, // Success
        req.entry,
        Buffer.from("Success", "utf-8"),
        undefined,
    );
}

export default modDN;
