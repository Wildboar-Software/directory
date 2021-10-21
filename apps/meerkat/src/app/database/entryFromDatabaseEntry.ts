import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Vertex } from "@wildboar/meerkat-types";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry";

// TODO: Handle decoding errors.

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
    ret.subordinates = oneLevel
        ? null
        : await Promise.all(
            (await ctx.db.entry.findMany({
                take: 10_000_000,
                where: {
                    immediate_superior_id: dbe.id,
                },
            })).map((child) => vertexFromDatabaseEntry(ctx, ret, child)),
        );
    return ret;
}

export default vertexFromDatabaseEntry;
