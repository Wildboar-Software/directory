import type { Context, Vertex } from "@wildboar/meerkat-types";
import vertexFromDatabaseEntry from "../database/entryFromDatabaseEntry";
import type {
    AttributeType,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeType.ta";

export
async function readChildrenSorted (
    ctx: Context,
    entry: Vertex,
    sortType: AttributeType,
    output: Vertex[],
    reverse: boolean = false,
    take?: number,
    skip?: number,
    cursorId?: number,
): Promise<number | undefined> {
    if (entry.dse.subentry || entry.dse.alias) {
        return undefined;
    }
    const take_: number = take ?? 1000000; // You MUST specify a "take" when cursors are used.
    let newCursorId: number | undefined;
    // Note that the X.500 specifications say that the "lowest" value must be
    // used for the purposes of ordering.
    const results = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            take: take_,
            skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
            where: {
                entry: {
                    immediate_superior_id: entry.dse.id,
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
        })).map((value) => {
            newCursorId = value.id;
            return vertexFromDatabaseEntry(ctx, entry, value.entry, true);
        }),
    );
    output.push(...results);
    if (results.length === take_) {
        return newCursorId;
    }
    /**
     * The query above will only return entries that have values of that type.
     * This query will fetch entries that DO NOT have that type.
     */
    const resultsWithoutSortKey = await Promise.all(
        (await ctx.db.entry.findMany({
            take: (take_ - results.length),
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
        })).map((child) => vertexFromDatabaseEntry(ctx, entry, child, true)),
    );
    results.push(...resultsWithoutSortKey);
    return results[results.length - 1].dse.id ?? newCursorId;
}

export default readChildrenSorted;
