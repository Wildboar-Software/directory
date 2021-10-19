import OrderingMatcher from "@wildboar/x500/src/lib/types/OrderingMatcher";
import type { ASN1Element } from "asn1-ts";

export
const uuidOrderingMatch: OrderingMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): number => {
    return Buffer.compare(assertion.octetString, value.octetString);
}

export default uuidOrderingMatch;
