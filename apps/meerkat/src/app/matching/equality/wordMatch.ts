import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    _decode_UnboundedDirectoryString as _decode_UDS,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import { prepString } from "@wildboar/x500/src/lib/utils/prepString";

export
const wordMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: string | undefined = prepString(directoryStringToString(_decode_UDS(assertion)));
    const v: string | undefined = prepString(directoryStringToString(_decode_UDS(value)));
    if (a === undefined) {
        return false;
        // throw new Error("cdf4ca97-db0c-450c-87e7-74d826b9ed2a: Invalid characters in caseIgnoreMatch assertion.");
    }
    if (v === undefined) {
        return false;
    }
    const words = v.toLowerCase()
        .replaceAll(/\p{P}/ug, "") // Remove all Unicode punctuation.
        .split(/\s+/);
    const asserted_word = a.toLowerCase();
    for (const word of words) {
        if (word === asserted_word) {
            return true;
        }
    }
    return false;
}

export default wordMatch;
