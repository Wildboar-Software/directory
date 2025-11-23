import type { ASN1Element } from "@wildboar/asn1";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString } from "./orAddressUtilities";

export
const mSSingleSubstringListElementsMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const aElements = assertion.sequenceOf;
    const vElements = value.sequenceOf;
    const len = Math.min(aElements.length, vElements.length);
    const a = aElements.map((el) => _decode_MSString(el));
    const v = vElements.map((el) => _decode_MSString(el));
    for (let i = 0; i < len; i++) {
        const ai = msStringToString(a[i]).trim().replace(/\s+/g, " ").toUpperCase();
        const vi = msStringToString(v[i]).trim().replace(/\s+/g, " ").toUpperCase();
        if (vi.indexOf(ai) < 0) {
            return false;
        }
    }
    return true;
}

export default mSSingleSubstringListElementsMatch;
