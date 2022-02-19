import type { Context, Vertex } from "@wildboar/meerkat-types";
import { BERElement } from "asn1-ts";
import {
    ShadowingAgreementInfo,
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { OperationalBindingInitiator } from "@prisma/client";
import { MAX_TRAVERSAL } from "../constants";

const SHADOW: string = id_op_binding_shadow.toString();

/**
 * @summary Determines the applicable shadowing agreement from a shadowed entry
 * @description
 *
 * This function traverses up the DIT until it finds a context prefix, and
 * attempts to identify a shadowing agreement associated with that context
 * prefix. This function returns that shadowing agreement, if it exists, or
 * `null` otherwise.
 *
 * @param ctx The context object
 * @param entry The entry whose shadowing agreement is to be identified
 * @returns The shadowing agreement, if one can be identified.
 */
export
async function getShadowingAgreementInfo (
    ctx: Context,
    entry: Vertex,
): Promise<ShadowingAgreementInfo | null> {
    let current = entry;
    let i: number = 0;
    while (i < MAX_TRAVERSAL) {
        if (!current.immediateSuperior) {
            return null;
        }
        if (current.dse.cp) {
            const now = new Date();
            const shadowingAgreement = await ctx.db.operationalBinding.findFirst({
                where: {
                    entry_id: current.dse.id,
                    validity_start: {
                        gte: now,
                    },
                    validity_end: {
                        lte: now,
                    },
                    accepted: true,
                    binding_type: SHADOW,
                    OR: [
                        { // Local DSA initiated role B (meaning local DSA is consumer.)
                            initiator: OperationalBindingInitiator.ROLE_B,
                            outbound: true,
                        },
                        { // Remote DSA initiated role A (meaning local DSA is consumer.)
                            initiator: OperationalBindingInitiator.ROLE_A,
                            outbound: false,
                        },
                    ],
                },
                select: {
                    agreement_ber: true,
                },
            });
            if (!shadowingAgreement) {
                return null;
            }
            const el = new BERElement();
            el.fromBytes(shadowingAgreement.agreement_ber);
            return _decode_ShadowingAgreementInfo(el);
        }
        current = current.immediateSuperior;
        i++;
    }
    return null;
}

export default getShadowingAgreementInfo;
