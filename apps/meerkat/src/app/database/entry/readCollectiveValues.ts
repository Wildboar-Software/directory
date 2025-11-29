import type {
    Context,
    Vertex,
    Value,
} from "../../types/index.js";
import readCollectiveAttributes from "./readCollectiveAttributes.js";
import valuesFromAttribute from "../../x500/valuesFromAttribute.js";

/**
 * @summary Read the collective values of an entry
 * @description
 *
 * Reads the collective values of an entry.
 *
 * @param ctx The context object
 * @param vertex The DSE whose attributes are to be read
 * @param relevantSubentries The subentries whose subtree specification selects
 *  for the DSE indicated by the argument `vertex`, in order of descending
 *  administrative point
 * @returns An array of collective values
 *
 * @function
 */
export
async function readCollectiveValues (
    ctx: Context,
    vertex: Vertex,
    relevantSubentries: Vertex[],
): Promise<Value[]> {
    return (await readCollectiveAttributes(ctx, vertex, relevantSubentries))
        .flatMap(valuesFromAttribute);
}

export default readCollectiveValues;

