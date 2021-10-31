import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";

export
function getUTCTimeMatch (toleratedImprecision: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: number = assertion.utcTime.valueOf();
        const v: number = value.utcTime.valueOf();
        const imprecision = Math.abs(a - v);
        return (imprecision <= toleratedImprecision);
    };
}

export default getUTCTimeMatch;
