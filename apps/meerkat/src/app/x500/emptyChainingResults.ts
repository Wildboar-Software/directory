import {
    ChainingResults,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ChainingResults.ta";

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
