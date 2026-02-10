import { Buffer } from "node:buffer";
import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import { orAddressesMatch } from "./orAddressUtilities.js";

export
const oRAddressMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    // If the two values are byte-for-byte equal, return.
    if (!Buffer.compare(assertion.value, value.value)) {
        return true;
    }
    const a = _decode_ORAddress(assertion);
    const v = _decode_ORAddress(value);
    return orAddressesMatch(a, v);
}

export default oRAddressMatch;
