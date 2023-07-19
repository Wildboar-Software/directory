import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    IncrementalStepRefresh,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/IncrementalStepRefresh.ta";
import {
    SubordinateChanges, _encode_IncrementalStepRefresh,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/SubordinateChanges.ta";
import { BER } from "asn1-ts/dist/node/functional";
import { ShadowIncrementType } from "@prisma/client";

/**
 * @summary Enqueue an incremental refresh for replication to a shadow consumer
 * @description
 *
 * This function saves an incremental refresh for later replication to a shadow
 * consumer resulting from a creation, modification, or deletion of a single
 * DSE.
 *
 * @param ctx The context object
 * @param binding_id The shadow operational binding identifier
 * @param immediate_superior The immediate superior of the affected entry
 * @param actual_change The change itself; a `SubordinateChanges` for the affected entry
 *
 * @async
 * @function
 */
export
async function saveIncrementalRefresh (
    ctx: Context,
    binding_id: number,
    immediate_superior: Vertex,
    actual_change: SubordinateChanges,
): Promise<void> {
    let ret: SubordinateChanges = actual_change;
    let current: Vertex | undefined = immediate_superior;
    while (current) {
        ret = new SubordinateChanges(
            current.dse.rdn,
            new IncrementalStepRefresh(
                undefined,
                [ret],
            ),
        );
        current = current.immediateSuperior;
    }
    const toSave = ret.changes;
    let change_type: ShadowIncrementType = ShadowIncrementType.OTHER;
    if (actual_change.changes.sDSEChanges) {
        if ("add" in actual_change.changes.sDSEChanges) {
            change_type = ShadowIncrementType.ADD;
        }
        else if ("remove" in actual_change.changes.sDSEChanges) {
            change_type = ShadowIncrementType.REMOVE;
        }
        else if ("modify" in actual_change.changes.sDSEChanges) {
            change_type = ShadowIncrementType.MODIFY;
        }
    }
    const bytes = _encode_IncrementalStepRefresh(toSave, BER).toBytes();
    await ctx.db.pendingShadowIncrementalStepRefresh.create({
        data: {
            ber: Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength),
            binding_identifier: binding_id,
            rename: !!(
                actual_change.changes.sDSEChanges
                && ("modify" in actual_change.changes.sDSEChanges)
                && actual_change.changes.sDSEChanges.modify.rename
            ),
            type: change_type,
        },
    });
}
