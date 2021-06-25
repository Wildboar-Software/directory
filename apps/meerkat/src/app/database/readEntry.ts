import type { Context, Entry, StoredAttributeValueWithContexts } from "../types";
import attributeFromDatabaseAttribute from "./attributeFromDatabaseAttribute";


export
async function readEntry (
    ctx: Context,
    entry: Entry,
): Promise<StoredAttributeValueWithContexts[]> {
    return Promise.all(
        (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: entry.id,
            },
            include: {
                ContextValue: true,
            },
        }))
            .map((a) => attributeFromDatabaseAttribute(ctx, a)),
    );
}

export default readEntry;
