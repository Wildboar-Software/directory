import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";

export
const contentIdentifierMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return (
        assertion.printableString.trim().replace(/\s+/g, " ")
        === value.printableString.trim().replace(/\s+/g, " ")
    ); // case-sensitive.
}

export default contentIdentifierMatch;
