import type { Context, Vertex } from "../../types";
import type {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import type {
    EntryInformationSelection,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection.ta";
import readValues from "./readValues";
import attributesFromValues from "../../x500/attributesFromValues";

export
interface ReadEntryAttributesReturn {
    userAttributes: Attribute[];
    operationalAttributes: Attribute[];
};

export
async function readAttributes (
    ctx: Context,
    vertex: Vertex,
    eis?: EntryInformationSelection,
): Promise<ReadEntryAttributesReturn> {
    const values = await readValues(ctx, vertex, eis);
    const userAttributes = attributesFromValues(values.userAttributes);
    const operationalAttributes = attributesFromValues(values.operationalAttributes);
    return {
        userAttributes,
        operationalAttributes,
    };
}

export default readAttributes;
