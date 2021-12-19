import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import readAttributes, { ReadAttributesOptions } from "./readAttributes";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";

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
