import type { Context, Vertex, StoredAttributeValueWithContexts } from "../types";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute";

/**
 * Use {@link readEntryAttributes}() instead.
 *
 * @param ctx
 * @param entry
 * @returns
 * @deprecated
 */
export
async function readEntry (
    ctx: Context,
    entry: Vertex,
): Promise<StoredAttributeValueWithContexts[]> {
    return Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.dse.id,
            },
            include: {
                ContextValue: true,
            },
        }))
            .map((a) => attributeFromDatabaseAttribute(ctx, a)),
    );
}

export default readEntry;
