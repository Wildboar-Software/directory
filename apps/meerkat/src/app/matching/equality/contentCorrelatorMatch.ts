import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";

// ContentCorrelator ::= CHOICE {ia5text  IA5String,
//     octets   OCTET STRING
// }

// Since the ia5text alternative is also compared case-sensitively, you can just
// do a buffer comparison.
export
const contentCorrelatorMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return !Buffer.compare(assertion.value, value.value);
}

export default contentCorrelatorMatch;
