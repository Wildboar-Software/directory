import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import readValues from "./readValues";
import attributesFromValues from "../../x500/attributesFromValues";
import type {
    ContextSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ContextSelection.ta";
import getAttributeSizeFilter from "../../x500/getAttributeSizeFilter";

export
interface ReadEntryAttributesReturn {
    userAttributes: Attribute[];
    operationalAttributes: Attribute[];
    collectiveAttributes: Attribute[];
};

export
async function readAttributes (
    ctx: Context,
    vertex: Vertex,
    eis?: EntryInformationSelection,
    relevantSubentries?: Vertex[],
    operationContexts?: ContextSelection,
    attributeSizeLimit?: number,
): Promise<ReadEntryAttributesReturn> {
    const values = await readValues(ctx, vertex, eis, relevantSubentries, operationContexts);
    const sizeFilter = getAttributeSizeFilter(attributeSizeLimit ?? Infinity);
    const userAttributes = attributeSizeLimit
        ? attributesFromValues(values.userAttributes).filter(sizeFilter)
        : attributesFromValues(values.userAttributes);
    const operationalAttributes = attributeSizeLimit
        ? attributesFromValues(values.operationalAttributes).filter(sizeFilter)
        : attributesFromValues(values.operationalAttributes);
    const collectiveAttributes = attributeSizeLimit
        ? attributesFromValues(values.collectiveValues).filter(sizeFilter)
        : attributesFromValues(values.collectiveValues);
    return {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    };
}

export default readAttributes;
