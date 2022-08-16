import { ASN1Element, ASN1TagClass, ASN1UniversalType } from "asn1-ts";
import type { EqualityMatcher } from "@wildboar/x500";

// This matching rule has a defined assertion syntax, but it does not use it, it seems...
export
const circulationMemberCheckmarkMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return value.set.some((el) => (
        (el.tagClass === ASN1TagClass.universal)
        && (
            (el.tagNumber === ASN1UniversalType.nill) // simple
            || (el.tagNumber === ASN1UniversalType.generalizedTime) // timestamped
            || (el.tagNumber === ASN1UniversalType.sequence) // signed
        )
    ));
};

export default circulationMemberCheckmarkMatch;
