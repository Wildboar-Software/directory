import type { Context } from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
import {
    DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { stringifyDN } from "../x500/stringifyDN";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers";

export
function isTrustedForIBRA (ctx: Context, aeTitle: DistinguishedName): boolean {
    const normalizedDN = normalizeDN(ctx, _encode_DistinguishedName(aeTitle, DER))
        ?? stringifyDN(ctx, aeTitle);
    return ctx.otherDSAs.byStringDN.get(normalizedDN)?.trustForIBRA ?? false;
}
