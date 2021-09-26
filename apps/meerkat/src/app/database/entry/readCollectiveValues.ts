import type {
    Context,
    Vertex,
    Value,
} from "../../types";
import readCollectiveAttributes from "./readCollectiveAttributes";
import valuesFromAttribute from "../../x500/valuesFromAttribute";

export
function readCollectiveValues (
    ctx: Context,
    entry: Vertex,
    relevantSubentries: Vertex[],
): Value[] {
    return readCollectiveAttributes(ctx, entry, relevantSubentries).flatMap(valuesFromAttribute);
}

export default readCollectiveValues;

