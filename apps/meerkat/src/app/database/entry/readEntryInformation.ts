import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import type {
    EntryInformation_information_Item,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformation-information-Item.ta";
import readAttributes from "./readAttributes";
import type {
    ContextSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";

export
async function readEntryInformation (
    ctx: Context,
    vertex: Vertex,
    eis?: EntryInformationSelection,
    relevantSubentries?: Vertex[],
    operationContexts?: ContextSelection,
    attributeSizeLimit?: number,
): Promise<EntryInformation_information_Item[]> {
    const {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    } = await readAttributes(ctx, vertex, eis, relevantSubentries, operationContexts, attributeSizeLimit);
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
