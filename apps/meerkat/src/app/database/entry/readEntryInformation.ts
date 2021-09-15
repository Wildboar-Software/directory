import type { Context, Vertex } from "../../types";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import readAttributes from "./readAttributes";

export
async function readEntryInformation (
    ctx: Context,
    vertex: Vertex,
    eis?: EntryInformationSelection,
    relevantSubentries?: Vertex[],
): Promise<EntryInformation_information_Item[]> {
    const {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    } = await readAttributes(ctx, vertex, eis, relevantSubentries);
    const attributes = [
        ...userAttributes,
        ...operationalAttributes,
        ...collectiveAttributes,
    ];
    return attributes
        .map((attribute): EntryInformation_information_Item => (
            attribute.values.length
            + (attribute.valuesWithContext?.length ?? 0)
        )
            ? {
                attribute,
            }
            : {
                attributeType: attribute.type_,
            });
}

export default readEntryInformation;
