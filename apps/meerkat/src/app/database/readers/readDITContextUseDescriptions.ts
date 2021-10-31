import type { Context } from "@wildboar/meerkat-types";
import { ObjectIdentifier } from "asn1-ts";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";

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
