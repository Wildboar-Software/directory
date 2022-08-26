import type { Context } from "@wildboar/meerkat-types";
import type { Prisma } from "@prisma/client";
import { MAX_RESULTS } from "../constants";
import { getEntryExistsFilter } from "../database/entryExistsFilter";

/**
 * @summary Get the RDNs of immediately suborinate entries
 * @description
 *
 * This function returns the relative distinguished names of immediately
 * subordinate DSEs, as well as their database IDs.
 *
 * @param ctx The context object
 * @param entry_id The database ID of the entry whose subordinates are to be listed
 * @param take How many results to return
 * @param skip How many results to skip over
 * @param cursorId The ID of the last entry returned, or `undefined`.
 * @param where An optional filter to apply to the subordinates to be returned
 *
 * @function
 * @async
 */
export
async function listSubordinates (
    ctx: Context,
    entry_id: number,
    take?: number,
    skip?: number,
    cursorId?: number,
    where?: Partial<Prisma.EntryWhereInput>,
) {
    return ctx.db.entry.findMany({
        take: take ?? MAX_RESULTS, // You MUST specify a "take" number when using a cursor.
        skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
        cursor: (cursorId !== undefined)
            ? {
                id: cursorId,
            }
            : undefined,
        where: {
            ...(where ?? {}),
            immediate_superior_id: entry_id,
            ...getEntryExistsFilter(),
        },
        orderBy: {
            id: "desc", // Theory: newer IDs are more likely to be queried.
        },
        select: {
            id: true,
            RDN: {
                select: {
                    type: true,
                    value: true,
                },
            },
        },
    });
}

export default listSubordinates;
