import type { Context, Vertex } from "@wildboar/meerkat-types";
import dseFromDatabaseEntry from "./dseFromDatabaseEntry";

/**
 * @summary Create an in-memory vertex from a database ID of an entry
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
 * @param id The database ID of the vertex to load into memory.
 * @returns A vertex
 *
 * @function
 * @async
 */
export
async function getVertexById (
    ctx: Context,
    superior: Vertex | undefined,
    id: number,
): Promise<Vertex | null> {
    const dbEntry = await ctx.db.entry.findUnique({
        where: { id },
        include: {
            RDN: {
                select: {
                    type_oid: true,
                    value: true,
                },
                orderBy: { // So the RDNs appear in the order in which they were entered.
                    // This prevents an undesirable scenario where some users might show
                    // up as GN=Jonathan+SN=Wilbur or SN=Wilbur+GN=Jonathan.
                    order_index: "asc",
                },
            },
            EntryObjectClass: {
                select: {
                    object_class: true,
                },
            },
        },
    });
    if (!dbEntry) {
        return null;
    }
    return {
        immediateSuperior: superior,
        subordinates: null,
        dse: await dseFromDatabaseEntry(ctx, dbEntry),
    };
}

export default getVertexById;
