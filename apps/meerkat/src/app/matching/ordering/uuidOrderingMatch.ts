import { Buffer } from "node:buffer";
import { type OrderingMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

export
const uuidOrderingMatch: OrderingMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): number => {
    return Buffer.compare(assertion.octetString, value.octetString);
}

export default uuidOrderingMatch;
