import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/DirectoryAbstractService";
import readAttributes, { ReadAttributesOptions } from "./readAttributes";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/DirectoryAbstractService";

/**
 * @summary Read the entry information of an entry
 * @description
 *
 * ITU Recommendation X.511 defines the `EntryInformation` type, whose
 * `information` component is a `SET` of `CHOICE`, where the alternatives of
 * each choice are either an attribute, or merely an attribute type.
 *
 * ```asn1
 * EntryInformation ::= SEQUENCE {
 *   name                  Name,
 *   fromEntry             BOOLEAN DEFAULT TRUE,
 *   information           SET SIZE (1..MAX) OF CHOICE {
 *     attributeType         AttributeType,
 *     attribute             Attribute{{SupportedAttributes}},
 *     ...} OPTIONAL,
 *   incompleteEntry  [3]  BOOLEAN DEFAULT FALSE,
 *   partialName      [4]  BOOLEAN DEFAULT FALSE,
 *   derivedEntry     [5]  BOOLEAN DEFAULT FALSE,
 *   ... }
 * ```
 *
 * This function works like `readAttributes()` or `readValues()`, except that
 * it returns this information as an array of the `CHOICE` type described above,
 * such that the output of this function may be readily used within
 * `EntryInformation`.
 *
 * @param ctx The context object
 * @param vertex The DSE whose entry information is to be read
 * @param options Options
 * @returns An array of entry information items
 *
 * @function
 * @async
 */
export
async function readEntryInformation (
    ctx: Context,
    vertex: Vertex,
    options?: ReadAttributesOptions,
): Promise<EntryInformation_information_Item[]> {
    const {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    } = await readAttributes(ctx, vertex, options);
    const attributes = [
        ...userAttributes,
        ...operationalAttributes,
        ...collectiveAttributes,
    ];
    return attributes
        .map((attribute): EntryInformation_information_Item => ((
            attribute.values.length
            + (attribute.valuesWithContext?.length ?? 0)
        ) && (options?.selection?.infoTypes !== typesOnly))
            ? {
                attribute,
            }
            : {
                attributeType: attribute.type_,
            });
}

export default readEntryInformation;
