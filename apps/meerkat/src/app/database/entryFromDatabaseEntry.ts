import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Vertex } from "@wildboar/meerkat-types";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry";

export
async function vertexFromDatabaseEntry (
    ctx: Context,
    superior: Vertex | undefined,
    dbe: DatabaseEntry,
    oneLevel: boolean = false,
): Promise<Vertex> {
    const ret: Vertex = {
        immediateSuperior: superior,
        subordinates: [],
        dse: await dseFromDatabaseEntry(ctx, dbe),
    };
    if (dbe.keep_children_in_database) {
        return ret;
    }
    try {
        ret.subordinates = oneLevel
            ? null
            : await Promise.all(
                (await ctx.db.entry.findMany({
                    take: 10_000_000,
                    where: {
                        deleteTimestamp: null,
                        immediate_superior_id: dbe.id,
                    },
                })).map((child) => vertexFromDatabaseEntry(ctx, ret, child)),
            );
    } catch (e) {
        ctx.log.error("err:failed_to_decode_subordinates", {
            uuid: ret.dse.uuid,
            e: e,
        });
    }
    return ret;
}

export default vertexFromDatabaseEntry;
