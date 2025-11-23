import type { ASN1Element } from "@wildboar/asn1";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString } from "./orAddressUtilities.js";

export
const mSStringListMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const aElements = assertion.sequenceOf;
    const vElements = value.sequenceOf;
    if (aElements.length !== vElements.length) {
        return false;
    }
    const a = aElements.map((el) => _decode_MSString(el));
    const v = vElements.map((el) => _decode_MSString(el));
    for (let i = 0; i < v.length; i++) {
        const ai = msStringToString(a[i]).trim().replace(/\s+/g, " ").toUpperCase();
        const vi = msStringToString(v[i]).trim().replace(/\s+/g, " ").toUpperCase();
        if (ai !== vi) {
            return false;
        }
    }
    return true;
}

export default mSStringListMatch;
