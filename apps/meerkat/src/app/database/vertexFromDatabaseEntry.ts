import type { Entry as DatabaseEntry } from "@prisma/client";
import type { Context, Vertex } from "@wildboar/meerkat-types";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry";

/**
 * @summary Create an in-memory vertex from a database entry
 * @description
 *
 * This function takes the `Entry` model used in the Prisma client, which can
 * only have fields of types that are native to a relational database (strings,
 * numbers, null, etc.) and converts them to the stronger ASN.1 types, and
 * generally "hydrates" the raw data queried from the database to assemble a
 * DSE populated with important operational attributes in memory.
 *
 * @param ctx The context object
 * @param superior The immediate superior of the vertex
 * @param dbe The Prisma model of the DSE
 * @returns A vertex
 *
 * @function
 * @async
 */
export
async function vertexFromDatabaseEntry (
    ctx: Context,
    superior: Vertex | undefined,
    dbe: Parameters<typeof dseFromDatabaseEntry>[1],
): Promise<Vertex> {
    return {
        immediateSuperior: superior,
        subordinates: null,
        dse: await dseFromDatabaseEntry(ctx, dbe),
    };
}

export default vertexFromDatabaseEntry;
