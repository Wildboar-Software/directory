import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "@wildboar/asn1";
import {
    FriendsDescription,
} from "@wildboar/x500/SchemaAdministration";

/**
 * @summary Load an entry's FriendsDescription from the database
 * @description
 *
 * Loads an entry's FriendsDescription from the database
 *
 * @param ctx The context object
 * @param entryId The database ID of the entry whose
 *  `FriendsDescription` are to be read from the database.
 * @returns An array of the `FriendsDescription`s associated with the
 *  entry.
 *
 * @function
 * @async
 */
export
async function readFriendsDescriptions (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<FriendsDescription[]> {
    const results = await ctx.db.friendship.findMany({
        where: {
            entry_id: entryId,
        },
    });
    return results
        .map((result) => new FriendsDescription(
            ObjectIdentifier.fromString(result.anchor),
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
            result.friends
                .split(" ")
                .map(ObjectIdentifier.fromString),
        ))
}

export default readFriendsDescriptions;
