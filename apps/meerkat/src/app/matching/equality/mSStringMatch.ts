import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/MSString.ta";
import { msStringToString } from "./orAddressUtilities";

export
const mSStringMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    // If the two values are byte-for-byte equal, return.
    if (!Buffer.compare(assertion.value, value.value)) {
        return true;
    }
    const a = msStringToString(_decode_MSString(assertion));
    const v = msStringToString(_decode_MSString(value));
    return (
        a.trim().replace(/\s+/g, " ").toUpperCase()
        === v.trim().replace(/\s+/g, " ").toUpperCase()
    );
}

export default mSStringMatch;
