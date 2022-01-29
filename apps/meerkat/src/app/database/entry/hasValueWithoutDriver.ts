import {
    Context,
    Value,
} from "@wildboar/meerkat-types";
import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import { BERElement } from "asn1-ts";

/**
 * Multiple database trips will take a toll on performance. However, it is not
 * safe to load all values for a given attribute type all at once. There could
 * be thousands, if not millions, and each could be millions of bytes in size.
 * The balance between these two contending desires is that we read multiple
 * values in at a time, and if their total size falls below a target number, we
 * increase the page size; if their total size goes above this target number,
 * we decrease the page size.
 */
const TARGET_MEMORY_USAGE: number = 1_000_000;

export
async function hasValueWithoutDriver (
    ctx: Context,
    entry_id: number,
    value: Value,
    matcher: EqualityMatcher,
): Promise<boolean> {
    const TYPE_OID: string = value.type.toString();
    let cursorId: number | undefined;
    let i = 0;
    let take: number = 1;
    while (i < 100_000) {
        const results = await ctx.db.attributeValue.findMany({
            take,
            skip: ((cursorId !== undefined) ? 1 : 0),
            cursor: (cursorId !== undefined)
                ? {
                    id: cursorId,
                }
                : undefined,
            where: {
                entry_id,
                type: TYPE_OID,
            },
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                ber: true,
            },
        });
        if (results.length === 0) {
            break;
        }
        let totalSize: number = 0;
        for (const result of results) {
            const el = new BERElement();
            el.fromBytes(result.ber);
            if (matcher(el, value.value)) {
                return true;
            }
            totalSize += result.ber.length;
        }
        cursorId = results[results.length - 1].id;
        if (totalSize < TARGET_MEMORY_USAGE) {
            take *= 2; // Double our read size every time we have spare capacity.
        } else {
            take--;
        }
        i++;
    }
    return false;
}

export default hasValueWithoutDriver;
