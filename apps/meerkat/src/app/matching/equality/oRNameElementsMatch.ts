import { Buffer } from "node:buffer";
import type { ASN1Element } from "@wildboar/asn1";
import { _decode_ORName } from "@wildboar/x400/MTSAbstractService";
import { orAddressIsSubset } from "./oRAddressElementsMatch.js";

export
function orNameElementsMatcher (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean {
    // If the two values are byte-for-byte equal, return.
    if (!Buffer.compare(assertion.value, value.value)) {
        return true;
    }
    const a = _decode_ORName(assertion);
    const v = _decode_ORName(value);
    return orAddressIsSubset(a, v);
};

export default orNameElementsMatcher;
