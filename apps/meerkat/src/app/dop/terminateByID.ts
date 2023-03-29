import type { Context } from "@wildboar/meerkat-types";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { DERElement } from "asn1-ts";
import {
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import removeSubordinate from "./terminate/removeSubordinate";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-non-specific-hierarchical.va";
import {
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/NonSpecificHierarchicalAgreement.ta";
import dnToVertex from "../dit/dnToVertex";

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
            binding_identifier: true,
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
                removeSubordinate(ctx, agreement)
                    .then()
                    .catch()
                    ; // Async, but we do not need to await.
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
        case (id_op_binding_non_specific_hierarchical.toString()): {
            const el = new DERElement();
            el.fromBytes(ob.agreement_ber);
            const agreement = _decode_NonSpecificHierarchicalAgreement(el);
            const nssr_dn = [ ...agreement.immediateSuperior ];
            const iAmSuperior: boolean = (
                // The initiator was the superior and this DSA was the initiator...
                ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
                // ...or, the initiator was the subordinate, and this DSA was NOT the initiator.
                || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
            );
            if (iAmSuperior) {
                const nssr = await dnToVertex(ctx, ctx.dit.root, nssr_dn);
                if (nssr?.dse?.nssr) {
                    await ctx.db.accessPoint.deleteMany({
                        where: {
                            entry_id: nssr.dse.id,
                            knowledge_type: Knowledge.NON_SPECIFIC,
                            operational_bindings: {
                                some: {
                                    binding_type: ob.binding_type,
                                    binding_identifier: ob.binding_identifier,
                                },
                            },
                        },
                    });
                    const remaining_nssr_aps = await ctx.db.accessPoint.count({
                        where: {
                            entry_id: nssr.dse.id,
                            knowledge_type: Knowledge.NON_SPECIFIC,
                        },
                    });
                    if (remaining_nssr_aps === 0) {
                        await ctx.db.entry.update({
                            where: {
                                id: nssr.dse.id,
                            },
                            data: {
                                nssr: false,
                            },
                        });
                    }
                }
            } else {
                // DEVIATION: The specification says that the subordinate DSA
                // must delete all information on the operational binding, but
                // it is not clear what needs to happen to the superior entries.
            }
            break;
        }
        default: {
            //
        }
    }
}

export default terminate;
