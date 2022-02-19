import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";

/**
 * @summary Load an entry's DITContentRuleDescriptions from the database
 * @description
 *
 * Loads an entry's DITContentRuleDescriptions from the database
 *
 * @param ctx The context object
 * @param entryId The database ID of the entry whose
 *  `DITContentRuleDescription` are to be read from the database.
 * @returns An array of the `DITContentRuleDescription`s associated with the
 *  entry.
 *
 * @function
 * @async
 */
export
async function readDITContentRuleDescriptions (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<DITContentRuleDescription[]> {
    const results = await ctx.db.contentRule.findMany({
        where: {
            entry_id: entryId,
        },
    });
    return results
        .map((result) => new DITContentRuleDescription(
            ObjectIdentifier.fromString(result.structural_class),
            result.auxiliary_classes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.mandatory_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.optional_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.precluded_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
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
        ));
}

export default readDITContentRuleDescriptions;
