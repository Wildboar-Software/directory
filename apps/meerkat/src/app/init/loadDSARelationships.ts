import type { Context } from "@wildboar/meerkat-types";
import rdnFromJson from "../x500/rdnFromJson";
import { stringifyDN } from "../x500/stringifyDN";
import { normalizeDN } from "../x500/normalizeDN";

/**
 * @summary Initialize Meerkat DSA's internal index of relationships with other DSAs
 * @description
 *
 * Initialize Meerkat DSA's internal index of relationships with other DSAs
 *
 * @param ctx The context object
 *
 * @async
 * @function
 */
export
async function loadDSARelationships (ctx: Context): Promise<void> {
    const aps = await ctx.db.accessPoint.findMany({
        where: {
            active: true,
            OR: [
                {
                    trust_ibra: true,
                },
                {
                    disclose_cross_refs: true,
                },
            ],
        },
        select: {
            ae_title: true,
            trust_ibra: true,
            disclose_cross_refs: true,
        },
    });
    for (const ap of aps) {
        if (!Array.isArray(ap.ae_title)) {
            continue;
        }
        const aeTitleDN = ap.ae_title
            .map((rdn: Record<string, string>) => rdnFromJson(rdn));
        const normalizedDN = normalizeDN(aeTitleDN);
        const dnString = stringifyDN(ctx, normalizedDN);
        ctx.otherDSAs.byStringDN.set(dnString, {
            discloseCrossReferences: ap.disclose_cross_refs,
            trustForIBRA: ap.trust_ibra,
        });
    }
}
