import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    _decode_UnboundedDirectoryString as _decode_UDS,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import fl from "fast-levenshtein";

export
function getCaseIgnoreMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: string = directoryStringToString(_decode_UDS(assertion));
        const v: string = directoryStringToString(_decode_UDS(value));
        const deviations = fl.get(a.trim().toLowerCase(), v.trim().toLowerCase());
        return (deviations <= tolerateDeviations);
    };
}

export default getCaseIgnoreMatch;
