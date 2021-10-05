import type { Context } from "../../types";
import { ObjectIdentifier } from "asn1-ts";
import {
    FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";

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
