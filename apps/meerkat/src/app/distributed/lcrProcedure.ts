import type {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";

/**
 * @summary List Continuation Reference Procedure, as defined in ITU Recommendation X.518.
 * @description
 *
 * The List Continuation Reference Procedure, as defined in ITU Recommendation
 * X.518 (2016), Section 20.4.2.
 *
 * Currently unimplemented. Meerkat DSA does not chain subrequests.
 *
 * @param SRcontinuationList The subrequest continuation list
 *
 * @function
 * @async
 */
export
async function lcrProcedure (
    SRcontinuationList: ContinuationReference[],
): Promise<void> {
    return;
}

export default lcrProcedure;
