import type { Context } from "@wildboar/meerkat-types";
import type { Prisma } from "@prisma/client";
import { MAX_RESULTS } from "../constants";

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
            deleteTimestamp: null,
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
