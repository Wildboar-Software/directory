import type { Context } from "@wildboar/meerkat-types";
import {
    HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import dnToVertex from "../../dit/dnToVertex";
import deleteEntry from "../../database/deleteEntry";

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
