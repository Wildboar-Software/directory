import type { Context } from "@wildboar/meerkat-types";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { DERElement } from "asn1-ts";
import {
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import { OperationalBindingInitiator } from "@prisma/client";
import removeSubordinate from "./terminate/removeSubordinate";

/**
 * @summary Terminates an operational binding by its database ID.
 * @description
 *
 * This function terminates an operational binding by its database ID.
 *
 * @param ctx The context object
 * @param id The database ID of the operational binding to terminate.
 *
 * @function
 * @async
 */
export
async function terminate (
    ctx: Context,
    id: number,
): Promise<void> {
    const ob = await ctx.db.operationalBinding.findUnique({
        where: {
            id,
        },
        select: {
            agreement_ber: true,
            initiator: true,
            outbound: true,
            binding_type: true,
        },
    });
    if (!ob) {
        return;
    }
    switch (ob.binding_type.toString()) {
        case (id_op_binding_hierarchical.toString()): {
            const el = new DERElement();
            el.fromBytes(ob.agreement_ber);
            const agreement = _decode_HierarchicalAgreement(el);
            const iAmSuperior: boolean = (
                // The initiator was the superior and this DSA was the initiator...
                ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
                // ...or, the initiator was the subordinate, and this DSA was NOT the initiator.
                || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
            );
            if (iAmSuperior) {
                removeSubordinate(ctx, agreement); // Async, but we do not need to await.
            }
            /*
             * When this DSA is subordinate, we do not delete the context
             * prefix. We keep it. This is so the context prefix can be
             * "repatriated" later on if desired. It is up to administrators to
             * delete the detached subtree after a HOB is terminated if they
             * desire.
             */
            break;
        }
        default: {
            //
        }
    }
}

export default terminate;
