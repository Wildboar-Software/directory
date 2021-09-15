import type {
    Context,
    Vertex,
    Value,
} from "../../types";
import readCollectiveAttributes from "./readCollectiveAttributes";
import attributeToStoredValues from "../../x500/attributeToStoredValues";

export
function readCollectiveValues (
    ctx: Context,
    entry: Vertex,
    relevantSubentries: Vertex[],
): Value[] {
    return readCollectiveAttributes(ctx, entry, relevantSubentries).flatMap(attributeToStoredValues);
}

export default readCollectiveValues;

