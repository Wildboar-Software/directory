import {
    Context,
    Value,
} from "../../types/index.js";
import { type EqualityMatcher } from "@wildboar/x500";
import { attributeValueFromDB } from "../attributeValueFromDB.js";

/**
 * @summary A default hasValue() function for attribute types without a driver
 * @description
 *
 * ## Implementation
 *
 * Multiple database trips will take a toll on performance. However, it is not
 * safe to load all values for a given attribute type all at once. There could
 * be thousands, if not millions, and each could be millions of bytes in size.
 * The balance between these two contending desires is that we read multiple
 * values in at a time, and if their total size falls below a target number, we
 * increase the page size; if their total size goes above this target number,
 * we decrease the page size.
 *
 * @param ctx The context object
 * @param entry_id The database ID of the entry that is to be checked
 * @param value The value whose existence is to be checked
 * @param matcher The equality matcher
 * @returns A boolean indicating whether the entry has the inquired value
 *
 * @function
 * @async
 */
export
async function hasValueWithoutDriver (
    ctx: Context,
    entry_id: number,
    value: Value,
    matcher: EqualityMatcher,
): Promise<boolean> {
    const TYPE_OID = value.type.toBytes();
    let cursorId: number | undefined;
    let i = 0;
    let take: number = 100;
    while (i < 100) {
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
                type_oid: TYPE_OID,
            },
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                tag_class: true,
                constructed: true,
                tag_number: true,
                content_octets: true,
            },
        });
        if (results.length === 0) {
            break;
        }
        for (const result of results) {
            const el = attributeValueFromDB(result);
            if (matcher(el, value.value)) {
                return true;
            }
        }
        cursorId = results[results.length - 1].id;
        i++;
    }
    return false;
}

export default hasValueWithoutDriver;
