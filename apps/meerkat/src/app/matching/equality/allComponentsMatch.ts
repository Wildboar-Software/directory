import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

// Defined here: https://datatracker.ietf.org/doc/html/draft-legg-ldapext-component-matching-11#section-7.2
export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return false; // FIXME: Not implemented.
};

export default matcher;
