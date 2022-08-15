import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";

export
const contentCorrelatorMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return (
        assertion.printableString.trim().replace(/\s+/g, " ")
        === value.printableString.trim().replace(/\s+/g, " ")
    ); // case-sensitive.
}

export default contentCorrelatorMatch;
