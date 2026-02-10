import { Buffer } from "node:buffer";
import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_ContentCorrelator,
} from "@wildboar/x400/MTSAbstractService";

// ContentCorrelator ::= CHOICE {ia5text  IA5String,
//     octets   OCTET STRING
// }

export
const contentCorrelatorMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_ContentCorrelator(assertion);
    const v = _decode_ContentCorrelator(value);
    if (("octets" in a) && ("octets" in v)) {
        return !Buffer.compare(a.octets, v.octets);
    } else if (("ia5text" in a) && ("ia5text" in v)) {
        return (a.ia5text.trim().replace(/\s+/g, " ") === v.ia5text.trim().replace(/\s+/g, " ")); // case-sensitive.
    } else {
        return false;
    }
}

export default contentCorrelatorMatch;
