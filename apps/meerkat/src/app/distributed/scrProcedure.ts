import type {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";

/**
 * @summary Search Continuation Reference Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The Search Continuation Reference Procedure, as defined in ITU Recommendation
 * X.518 (2016), Section 20.4.3.
 *
 * Currently unimplemented. Meerkat DSA does not chain subrequests.
 *
 * @param SRcontinuationList The subrequest continuation list
 *
 * @function
 * @async
 */
export
async function scrProcedure (
    SRcontinuationList: ContinuationReference[],
): Promise<void> {
    // Local policy is always no chaining (for now). Easy to implement!
    return;
}

export default scrProcedure;
