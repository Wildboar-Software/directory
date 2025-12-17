import { DbNull } from "../generated/internal/prismaNamespace.js";
import { Context, Vertex } from "../types/index.js";

export
async function stripEntry (ctx: Context, vertex: Vertex): Promise<void> {
    const where = {
        entry_id: vertex.dse.id,
    };
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({ where }),
        ctx.db.password.deleteMany({ where }),
        ctx.db.passwordHistory.deleteMany({ where }),
        ctx.db.entryObjectClass.deleteMany({ where }),
        ctx.db.attributeTypeDescription.deleteMany({ where }),
        ctx.db.objectClassDescription.deleteMany({ where }),
        ctx.db.nameForm.deleteMany({ where }),
        ctx.db.contextDescription.deleteMany({ where }),
        ctx.db.dITStructureRule.deleteMany({ where }),
        ctx.db.contentRule.deleteMany({ where }),
        ctx.db.contextUseRule.deleteMany({ where }),
        ctx.db.friendship.deleteMany({ where }),
        ctx.db.entryAttributeValuesIncomplete.deleteMany({ where }),
        ctx.db.entry.update({
            where: {
                id: vertex.dse.id,
            },
            data: {
                glue: false,
                cp: false,
                entry: false,
                alias: false,
                subr: false,
                nssr: false,
                xr: false,
                admPoint: false,
                subentry: false,
                shadow: false,
                immSupr: false,
                rhob: false,
                sa: false,
                dsSubentry: false,
                entryUUID: null,
                hierarchyParent_id: null,
                hierarchyParentDN: DbNull,
                hierarchyParentStr: null,
                hierarchyTop_id: null,
                hierarchyTopDN: DbNull,
                hierarchyTopStr: null,
                hierarchyPath: null,
                hierarchyLevel: null,
            },
        }),
    ]);
}
