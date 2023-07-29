import type { Context, Vertex } from "@wildboar/meerkat-types";
import dnToVertex from "./dnToVertex";
import {
    CrossReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/CrossReference.ta";
import { createDse } from "../database/createEntry";
import saveAccessPoint from "../database/saveAccessPoint";
import { Knowledge } from "@prisma/client";

export
async function upsertCrossReferences (
    ctx: Context,
    xr: CrossReference,
): Promise<void> {
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
                    knowledge_type: Knowledge.CROSS_REFERENCE,
                },
            },
        },
    });
    await saveAccessPoint(ctx, xr.accessPoint, Knowledge.CROSS_REFERENCE, current.dse.id);
}
