import type { Context, Vertex } from "@wildboar/meerkat-types";
import vertexFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";
import type { Prisma } from "@prisma/client";

/**
 * @description
 * `hasValue` - Whether the subordinate had a value of the attribute type that
 *  is being used as the sort key.
 */
export
type SortedChild = [ cursorId: number, dse: Vertex, hasValue: boolean ];

export
async function readSubordinatesSorted (
    ctx: Context,
    entry: Vertex,
    sortType: AttributeType,
    processingEntriesWithSortKey: boolean,
    reverse: boolean = false,
    take?: number,
    skip?: number,
    cursorId?: number,
    where?: Partial<Prisma.EntryWhereInput>,
): Promise<SortedChild[]> {
    if (entry.dse.subentry || entry.dse.alias) {
        return [];
    }
    const takeRemaining: number = take ?? 1000000; // You MUST specify a "take" when cursors are used.
    const results: SortedChild[] = [];

    if (processingEntriesWithSortKey) {
        // Note that the X.500 specifications say that the "lowest" value must be
        // used for the purposes of ordering.
        const resultsWithSortKey = await Promise.all(
            (await ctx.db.attributeValue.findMany({
                take: takeRemaining,
                skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
                cursor: (cursorId !== undefined)
                    ? {
                        id: cursorId,
                    }
                    : undefined,
                where: {
                    entry: {
                        ...where,
                        immediate_superior_id: entry.dse.id,
                        deleteTimestamp: null,
                    },
                    type: sortType.toString(),
                },
                orderBy: {
                    sort_key: reverse ? "desc" : "asc",
                },
                select: {
                    entry: true,
                    id: true,
                },
                distinct: ["entry_id"],
            })).map(async (value): Promise<SortedChild> => [
                value.id,
                await vertexFromDatabaseEntry(ctx, entry, value.entry, true),
                true,
            ]),
        );
        results.push(...resultsWithSortKey);
    }

    if (results.length >= takeRemaining) {
        return results;
    }

    /**
     * The query above will only return entries that have values of that type.
     * This query will fetch entries that DO NOT have that type.
     *
     * Note that, according to ITU Recommendation X.511, entries without values
     * of the attribute type indicated by the `SortKey` are to be returned last,
     * regardless of whether the results are reversed.
     */
    const resultsWithoutSortKey = await Promise.all(
        (await ctx.db.entry.findMany({
            take: (takeRemaining - results.length),
            skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
            cursor: (cursorId !== undefined)
                ? {
                    id: cursorId,
                }
                : undefined,
            where: {
                immediate_superior_id: entry.dse.id,
                deleteTimestamp: null,
                AttributeValue: {
                    none: {
                        type: sortType.toString(),
                    },
                },
            },
            orderBy: {
                id: "asc",
            },
        })).map(async (child): Promise<SortedChild>  => [
            child.id,
            await vertexFromDatabaseEntry(ctx, entry, child, true),
            false,
        ]),
    );
    results.push(...resultsWithoutSortKey);
    return results;
}

export default readSubordinatesSorted;
