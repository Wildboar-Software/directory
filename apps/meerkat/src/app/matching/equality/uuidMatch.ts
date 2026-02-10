import { Buffer } from "node:buffer";
import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

export
const uuidMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return !Buffer.compare(assertion.octetString, value.octetString);
}

export default uuidMatch;
