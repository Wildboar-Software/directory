import type { Context } from "../../types";
import type {
    CompareRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareRequest.ta";
import type {
    CompareResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/CompareResponse.ta";
import {
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    LDAPResult_resultCode_compareFalse,
    LDAPResult_resultCode_compareTrue,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import decodeLDAPDN from "../decodeLDAPDN";
import findEntry from "../../x500/findEntry";
import readEntry from "../../database/readEntry";
import { objectNotFound } from "../results";
import normalizeAttributeDescription from "@wildboar/ldap/src/lib/normalizeAttributeDescription";

export
async function compare (
    ctx: Context,
    req: CompareRequest,
): Promise<CompareResponse> {
    const dn = decodeLDAPDN(ctx, req.entry);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return objectNotFound;
    }
    const desc = normalizeAttributeDescription(req.ava.attributeDesc);
    const attrSpec = ctx.attributes.get(desc);
    if (!attrSpec?.ldapSyntax || !attrSpec.equalityMatcher) {
        throw new Error();
    }
    const syntax = ctx.ldapSyntaxes.get(attrSpec.ldapSyntax);
    if (!syntax?.decoder) {
        throw new Error();
    }
    const assertedValue = syntax.decoder(req.ava.assertionValue);
    const matcher = attrSpec.equalityMatcher;
    const attrs = await readEntry(ctx, entry);
    const ATTR_TYPE_OID: string = attrSpec.id.toString();
    const match = attrs
        .filter((attr) => attr.id.toString() === ATTR_TYPE_OID)
        .some((attr) => matcher(assertedValue, attr.value));
    return new LDAPResult(
        match
            ? LDAPResult_resultCode_compareTrue
            : LDAPResult_resultCode_compareFalse,
        req.entry,
        match
            ? Buffer.from("Match", "utf-8")
            : Buffer.from("Non-Match", "utf-8"),
        undefined,
    );
}

export default compare;
