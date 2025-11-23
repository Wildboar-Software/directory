import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

export
function getGeneralizedTimeMatch (toleratedImprecision: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: number = assertion.generalizedTime.valueOf();
        const v: number = value.generalizedTime.valueOf();
        const imprecision = Math.abs(a - v);
        return (imprecision <= toleratedImprecision);
    };
}

export default getGeneralizedTimeMatch;
