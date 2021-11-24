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
    let newCursorId: number | undefined;
    const results = await Promise.all(
        (await ctx.db.attributeValue.findMany({
            take: take ?? 1000000, // You MUST specify a "take" when cursors are used.
            skip: ((cursorId !== undefined) ? 1 : 0) + (skip ?? 0),
            where: {
                entry_id: entry.dse.id,
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
    return newCursorId;
}

export default readChildrenSorted;
