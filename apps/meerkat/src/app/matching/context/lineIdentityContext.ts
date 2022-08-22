import { EqualityMatcher } from "@wildboar/x500";
import { ASN1Element } from "asn1-ts";

export
const lineIdentityContext: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return !Buffer.compare(assertion.octetString, value.octetString);
};