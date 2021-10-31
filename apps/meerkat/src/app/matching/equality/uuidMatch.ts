import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";

export
const uuidMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return !Buffer.compare(assertion.octetString, value.octetString);
}

export default uuidMatch;
