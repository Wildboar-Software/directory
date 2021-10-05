import type {
    ContinuationReference,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/ContinuationReference.ta";

export
async function lcrProcedure (
    SRcontinuationList: ContinuationReference[],
): Promise<void> {
    // Local policy is always no chaining (for now). Easy to implement!
    while (SRcontinuationList.length) {
        /**
         * I could not find anywhere in the specification where the
         * SRcontinuationList is ever emptied, but it seems necessary,
         * otherwise, it will create an infinite loop and grow larger every
         * time! It seems to be implied that the contents of this list are
         * consumed by the LCR and SCR procedures, so here, we just empty the
         * list to simulate "using it."
         */
        SRcontinuationList.pop();
    }
    return;
}

export default lcrProcedure;
