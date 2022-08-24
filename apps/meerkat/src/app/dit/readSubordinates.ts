import type { Context, Vertex } from "@wildboar/meerkat-types";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";
import type { Prisma } from "@prisma/client";
import { MAX_RESULTS } from "../constants";
import { getEntryExistsFilter } from "../database/entryExistsFilter";

/**
 * @summary Read a DSE's subordinates into memory from the database
 * @description
 *
 * Reads the subordinates of a DSE into memory from the database as vertices.
 *
 * @param ctx The context object
 * @param entry The entry whose subordinates are to be read
 * @param take The maximum number of subordinates to return
 * @param skip The number of subordinates to skip over
 * @param cursorId The database ID of the last subordinate that was read
 * @param where Optional filtering on the subordinates to return
 * @returns An array of vertices, where each is a subordinate
 *
 * @function
 * @async
 */
export
async function readSubordinates (
    ctx: Context,
    entry: Vertex,
    take?: number,
    skip?: number,
    cursorId?: number,
    where?: Partial<Prisma.EntryWhereInput>,
): Promise<Vertex[]> {
    if (entry.dse.subentry || entry.dse.alias) {
        return []; // These types should never have children. This return is to prevent errors.
    }
    if (!entry.subordinates) {
        return Promise.all(
            (await ctx.db.entry.findMany({
                take: take ?? MAX_RESULTS, // You MUST specify a "take" number when using a cursor.
                skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
                cursor: (cursorId !== undefined)
                    ? {
                        id: cursorId,
                    }
                    : undefined,
                where: {
                    ...(where ?? {}),
                    immediate_superior_id: entry.dse.id,
                    ...getEntryExistsFilter(),
                },
                include: {
                    RDN: {
                        select: {
                            type: true,
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
                    UniqueIdentifier: {
                        select: {
                            uniqueIdentifier: true,
                        },
                    },
                    ACIItem: {
                        where: {
                            active: true,
                        },
                        select: {
                            scope: true,
                            ber: true,
                        },
                    },
                    Clearance: {
                        where: {
                            active: true,
                        },
                        select: {
                            ber: true,
                        },
                    },
                    EntryAdministrativeRole: {
                        select: {
                            administrativeRole: true,
                        },
                    },
                    SubtreeSpecification: {
                        select: {
                            ber: true,
                        },
                    },
                    EntryCollectiveExclusion: {
                        select: {
                            collectiveExclusion: true,
                        },
                    },
                },
                orderBy: {
                    id: "desc", // Theory: newer IDs are more likely to be queried.
                },
            })).map((child) => vertexFromDatabaseEntry(ctx, entry, child)),
        );
    }
    if (cursorId !== undefined) {
        let caughtUp: boolean = false;
        return entry
            .subordinates
            .filter((sub) => {
                if (sub.dse.id === cursorId) {
                    caughtUp = true;
                    return false; // We skip the current subordinate.
                } else {
                    return caughtUp;
                }
            });
    }
    return entry
        .subordinates
        ;
}

export default readSubordinates;
