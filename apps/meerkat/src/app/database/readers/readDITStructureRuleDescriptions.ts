import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";

/**
 * @summary Load an entry's DITStructureRuleDescriptions from the database
 * @description
 *
 * Loads an entry's DITStructureRuleDescriptions from the database
 *
 * @param ctx The context object
 * @param entryId The database ID of the entry whose
 *  `DITStructureRuleDescription` are to be read from the database.
 * @returns An array of the `DITStructureRuleDescription`s associated with the
 *  entry.
 *
 * @function
 * @async
 */
export
async function readDITStructureRuleDescriptions (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<DITStructureRuleDescription[]> {
    const results = await ctx.db.dITStructureRule.findMany({
        where: {
            entry_id: entryId,
        },
    });
    return results
        .map((result) => new DITStructureRuleDescription(
            result.ruleIdentifier,
            ObjectIdentifier.fromString(result.nameForm),
            result.superiorStructureRules
                ? result.superiorStructureRules
                    .split(" ")
                    .map((ssr) => Number.parseInt(ssr))
                : undefined,
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

export default readDITStructureRuleDescriptions;
