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
    return {
        immediateSuperior: superior,
        materializedPath: dbe.materialized_path,
        subordinates: null,
        dse: await dseFromDatabaseEntry(ctx, dbe),
    };
}

export default vertexFromDatabaseEntry;
