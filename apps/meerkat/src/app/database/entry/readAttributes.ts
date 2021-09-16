import type { Context, Vertex } from "../../types";
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
): Promise<ReadEntryAttributesReturn> {
    const values = await readValues(ctx, vertex, eis, relevantSubentries, operationContexts);
    const userAttributes = attributesFromValues(values.userAttributes);
    const operationalAttributes = attributesFromValues(values.operationalAttributes);
    const collectiveAttributes = attributesFromValues(values.collectiveValues);
    return {
        userAttributes,
        operationalAttributes,
        collectiveAttributes,
    };
}

export default readAttributes;
