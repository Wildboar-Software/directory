import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_ORAddress,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORAddress.ta";
import { orAddressesMatch } from "./orAddressUtilities";

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
