import type { Context } from "@wildboar/meerkat-types";
import rdnFromJson from "../x500/rdnFromJson.js";
import { stringifyDN } from "../x500/stringifyDN.js";
import { DER } from "@wildboar/asn1/functional";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { distinguishedNameMatch as normalizeDN } from "../matching/normalizers.js";
import { Prisma, OperationalBindingInitiator } from "@prisma/client";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";

const HOB: string = id_op_binding_hierarchical.toString();
const NHOB: string = id_op_binding_non_specific_hierarchical.toString();

function getWhere (): Prisma.OperationalBindingWhereInput {
    const now = new Date();
    // This where clause was pretty much ripped from `getRelevantOperationalBindings()`.
    return {
        /**
         * This is a hack for getting the latest version: we are selecting
         * operational bindings that have no next version.
         */
        next_version: {
            none: {},
        },
        binding_type: {
            in: [
                HOB,
                NHOB,
            ],
        },
        accepted: true,
        terminated_time: null,
        validity_start: {
            lte: now,
        },
        AND: [
            {
                OR: [
                    { // Remote DSA initiated role A (meaning remote DSA is superior.)
                        initiator: OperationalBindingInitiator.ROLE_A,
                        outbound: true,
                    },
                    { // Local DSA initiated role B (meaning remote DSA is superior again.)
                        initiator: OperationalBindingInitiator.ROLE_B,
                        outbound: false,
                    },
                ],
            },
            {
                OR: [
                    {
                        validity_end: null,
                    },
                    {
                        validity_end: {
                            gte: now,
                        },
                    },
                ],
            },
        ],
    };
}

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
            operational_bindings: (ctx.config.authn.automaticallyTrustForIBRA === "SUPR")
                ? {
                    where: getWhere(),
                }
                : undefined,
        },
    });
    for (const ap of aps) {
        if (!Array.isArray(ap.ae_title)) {
            continue;
        }
        const aeTitleDN = ap.ae_title
            .map((rdn: Record<string, string>) => rdnFromJson(rdn));
        const normalizedDN = normalizeDN(ctx, _encode_DistinguishedName(aeTitleDN, DER))
            ?? stringifyDN(ctx, aeTitleDN);
        ctx.otherDSAs.byStringDN.set(normalizedDN, {
            discloseCrossReferences: ap.disclose_cross_refs,
            trustForIBRA: (ctx.config.authn.automaticallyTrustForIBRA === "SUPR")
                ? (ap.operational_bindings.length > 1)
                : ap.trust_ibra,
        });
    }
}
