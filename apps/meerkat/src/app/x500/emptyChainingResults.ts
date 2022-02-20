import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";

/**
 * @summary Gets an empty `ChainingResults` object
 * @description
 *
 * Gets an empty `ChainingResults` object. This is useful because, most of the
 * time, none of these fields are used.
 *
 * @returns An empty `ChainingResults` object
 *
 * @function
 */
export
function emptyChainingResults (): ChainingResults {
    return new ChainingResults(
        undefined,
        undefined,
        undefined,
        undefined,
    );
}

export default emptyChainingResults;
