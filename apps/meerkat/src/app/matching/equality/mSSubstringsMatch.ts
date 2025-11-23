import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_SubstringAssertion,
} from "@wildboar/x400/MSMatchingRules";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString } from "./orAddressUtilities";
import type { ASN1Element } from "@wildboar/asn1";

export
const mSSubstringsMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_SubstringAssertion(assertion);
    const v: string = msStringToString(_decode_MSString(value))
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
    let lastAnyMatch: number = -1;
    for (const sa of a) {
        if ("initial" in sa) {
            const initial = msStringToString(sa.initial).toUpperCase();
            if (!v.startsWith(initial)) {
                return false;
            }
        } else if ("final" in sa) {
            const final = msStringToString(sa.final).toUpperCase();
            if (!v.endsWith(final)) {
                return false;
            }
        } else if ("any_" in sa) {
            const any_ = msStringToString(sa.any_).toUpperCase();
            const nextMatch = v.indexOf(any_, lastAnyMatch + 1);
            if (nextMatch < 0) {
                return false;
            }
            lastAnyMatch = nextMatch;
        } else {
            return false;
        }
    }
    return true;
}

export default mSSubstringsMatch;
