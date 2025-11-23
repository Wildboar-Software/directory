import type { Context } from "@wildboar/meerkat-types";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { DERElement } from "@wildboar/asn1";
import {
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import { Knowledge, OperationalBindingInitiator } from "@prisma/client";
import removeSubordinate from "./terminate/removeSubordinate.js";
import {
    id_op_binding_non_specific_hierarchical,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import {
    _decode_NonSpecificHierarchicalAgreement,
} from "@wildboar/x500/HierarchicalOperationalBindings";
import dnToVertex from "../dit/dnToVertex.js";
import {
    id_op_binding_shadow,
} from "@wildboar/x500/DirectoryOperationalBindingTypes";
import { removeConsumer } from "./terminate/removeConsumer.js";
import { removeSupplier } from "./terminate/removeSupplier.js";

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
                    .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_remove_subordinate"), e))
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
        case (id_op_binding_shadow.toString()): {
            // We can delete these, supplier or not, since OBs are supposed to
            // be unique across (type, id).
            const t1 = ctx.pendingShadowingUpdateCycles.get(ob.binding_identifier);
            const t2 = ctx.shadowUpdateCycles.get(ob.binding_identifier);
            t1?.clear();
            if (t2) {
                clearTimeout(t2);
            }
            ctx.pendingShadowingUpdateCycles.delete(ob.binding_identifier);
            ctx.shadowUpdateCycles.delete(ob.binding_identifier);
            const iAmSupplier: boolean = (
                // The initiator was the supplier and this DSA was the initiator...
                ((ob.initiator === OperationalBindingInitiator.ROLE_A) && (ob.outbound))
                // ...or, the initiator was the consumer, and this DSA was NOT the initiator.
                || ((ob.initiator === OperationalBindingInitiator.ROLE_B) && (!ob.outbound))
            );
            if (iAmSupplier) {
                await removeConsumer(ctx, ob.binding_identifier);
            } else {
                await removeSupplier(ctx, ob.binding_identifier);
            }
            break;
        }
        default: {
            //
        }
    }

    // We terminate all revisions of this OB, just to be sure it is dead.
    await ctx.db.operationalBinding.updateMany({
        where: {
            binding_type: ob.binding_type,
            binding_identifier: ob.binding_identifier,
            terminated_time: null,
        },
        data: {
            terminated_time: new Date(),
        },
    });
}

export default terminate;
