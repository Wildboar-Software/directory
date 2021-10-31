import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    MatchingRuleUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";

export
async function readMatchingRuleUseDescriptions (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<MatchingRuleUseDescription[]> {
    const results = await ctx.db.matchingRuleUse.findMany({
        where: {
            entry_id: entryId,
        },
    });
    return results
        .map((result) => new MatchingRuleUseDescription(
            ObjectIdentifier.fromString(result.identifier),
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
            result.information
                .split(" ")
                .map(ObjectIdentifier.fromString),
        ));
}

export default readMatchingRuleUseDescriptions;
