import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { stringifyDN } from "../x500/stringifyDN";
import { normalizeDN } from "../x500/normalizeDN";

export
function isTrustedForIBRA (ctx: Context, aeTitle: DistinguishedName): boolean {
    const normalizedDN = normalizeDN(aeTitle);
    const stringDN = stringifyDN(ctx, normalizedDN);
    return ctx.otherDSAs.byStringDN.get(stringDN)?.trustForIBRA ?? false;
}
