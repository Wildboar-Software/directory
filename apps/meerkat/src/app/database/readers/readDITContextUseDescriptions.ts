import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";

/**
 * @summary Load an entry's DITContextUseDescriptions from the database
 * @description
 *
 * Loads an entry's DITContextUseDescriptions from the database
 *
 * @param ctx The context object
 * @param entryId The database ID of the entry whose
 *  `DITContextUseDescription` are to be read from the database.
 * @returns An array of the `DITContextUseDescription`s associated with the
 *  entry.
 *
 * @function
 * @async
 */
export
async function readDITContextUseDescriptions (
    ctx: Readonly<Context>,
    entryId: number,
): Promise<DITContextUseDescription[]> {
    const results = await ctx.db.contextUseRule.findMany({
        where: {
            entry_id: entryId,
        },
    });
    return results
        .map((result) => new DITContextUseDescription(
            ObjectIdentifier.fromString(result.attributeType),
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
            new DITContextUseInformation(
                result.mandatory
                    ?.split(" ")
                    .map(ObjectIdentifier.fromString),
                result.optional
                    ?.split(" ")
                    .map(ObjectIdentifier.fromString),
            ),
        ));
}

export default readDITContextUseDescriptions;
