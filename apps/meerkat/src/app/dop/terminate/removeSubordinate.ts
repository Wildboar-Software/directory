import type { Context } from "@wildboar/meerkat-types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import dnToVertex from "../../dit/dnToVertex";
import deleteEntry from "../../database/deleteEntry";

/**
 * @summary Terminates a hierarchical operational binding from the superior's perspective
 * @description
 *
 * This function terminates a hierarchical operational binding from the
 * superior DSA's perspective, which means that the subr DSE is removed from
 * the local DSA so that requests will no longer get routed to the subordinate
 * DSA.
 *
 * @param ctx The context object
 * @param agreement The hierarchical agreement
 *
 * @function
 * @async
 */
export
async function removeSubordinate (
    ctx: Context,
    agreement: HierarchicalAgreement,
): Promise<void> {
    const subordinateDN = [
        ...agreement.immediateSuperior,
        agreement.rdn,
    ];
    const entry = await dnToVertex(ctx, ctx.dit.root, subordinateDN);
    if (!entry) {
        return; // It is already deleted. Nothing to do.
    }
    await deleteEntry(ctx, entry);
}

export default removeSubordinate;
