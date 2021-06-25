import type { Context } from "../../types";
import type {
    DelRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelRequest.ta";
import type {
    DelResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/DelResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import findEntry from "../../x500/findEntry";
import deleteEntry from "../../database/deleteEntry";

export
async function del (
    ctx: Context,
    req: DelRequest,
): Promise<DelResponse> {
    const dn = decodeLDAPDN(ctx, req);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        throw new Error(); // FIXME:
    }
    await deleteEntry(ctx, entry);
    if (entry.parent?.children.length) {
        const entryIndex = entry.parent.children.findIndex((child) => (child.uuid === entry.uuid));
        entry.parent.children.splice(entryIndex, 1);
    }
    return new LDAPResult(
        0, // Success
        req,
        Buffer.from("Deleted", "utf-8"),
        undefined,
    );
}

export default del;
