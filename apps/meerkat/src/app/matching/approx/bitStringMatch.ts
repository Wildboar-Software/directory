import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

export
function getBitStringMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = assertion.bitString;
        const b = value.bitString;
        const len = Math.min(a.length, b.length);
        let tolerationBudget: number = tolerateDeviations;
        for (let i = 0; i < len; i++) {
            if (a[i] !== b[i]) {
                tolerationBudget--;
            }
            if (tolerationBudget <= 0) {
                return false;
            }
        }
        return true;
    };
}

export default getBitStringMatch;
