import type { Context, Vertex } from "../types/index.js";
import dnToVertex from "./dnToVertex.js";
import {
    CrossReference,
} from "@wildboar/x500/DistributedOperations";
import { createDse } from "../database/createEntry.js";
import saveAccessPoint from "../database/saveAccessPoint.js";
import { Knowledge } from "../generated/client.js";
import stringifyDN from "../x500/stringifyDN.js";

/**
 * @summary Upsert cross references into the local DSAIT
 * @description
 *
 * This function upserts a cross reference into the local DSAIT, thereby making
 * it available for use when resolving a name or continuing a distributed
 * operation. This function will not modify a non-glue or non-cross-reference
 * DSE.
 *
 * @param ctx The context object
 * @param xr The cross reference to be upserted
 *
 * @async
 * @function
 */
export
async function upsertCrossReferences (
    ctx: Context,
    xr: CrossReference,
): Promise<void> {
    /* We use caching to avoid creating all the glue DSEs and the xr DSE if we
    just did that from a previous request. This involves a lot of database
    queries to do. */
    const xr_cache_key = stringifyDN(ctx, xr.contextPrefix).trim().toUpperCase();
    const existing_xr = ctx.recentlyAddedCrossReferences.get(xr_cache_key);
    if (
        existing_xr
        // We attempt an update to the cross references only if there are more
        // network addresses, otherwise we assume it hasn't changed.
        && (
            existing_xr.accessPoint.address.nAddresses.length
            <= xr.accessPoint.address.nAddresses.length
        )
    ) {
        return;
    }
    ctx.recentlyAddedCrossReferences.set(xr_cache_key, xr);

    let current: Vertex = ctx.dit.root;
    for (const rdn of xr.contextPrefix) {
        const v = await dnToVertex(ctx, current!, [ rdn ]);
        current = v ?? await createDse(ctx, current, rdn, {
            glue: true,
        }, []);
    }
    if (!current.dse.glue && !current.dse.xr) {
        // We refuse to modify an entry that already exists, unless it is
        // already a cross reference.
        return;
    }
    await ctx.db.entry.update({
        where: {
            id: current.dse.id,
        },
        data: {
            xr: true,
            glue: false,
            AccessPoint: {
                deleteMany: {
                    knowledge_type: Knowledge.SPECIFIC,
                },
            },
        },
    });
    await saveAccessPoint(ctx, xr.accessPoint, Knowledge.SPECIFIC, current.dse.id);
}
