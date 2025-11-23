import type { Context } from "@wildboar/meerkat-types";
import { DER } from "@wildboar/asn1/functional";
import {
    DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { stringifyDN } from "../x500/stringifyDN";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers";

export
function isTrustedForIBRA (ctx: Context, aeTitle: DistinguishedName): boolean {
    if (ctx.config.authn.automaticallyTrustForIBRA === "*") {
        return true;
    }
    const normalizedDN = normalizeDN(ctx, _encode_DistinguishedName(aeTitle, DER))
        ?? stringifyDN(ctx, aeTitle);
    return ctx.otherDSAs.byStringDN.get(normalizedDN)?.trustForIBRA ?? false;
}
