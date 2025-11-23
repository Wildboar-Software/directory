import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_UnboundedDirectoryString as _decode_UDS,
} from "@wildboar/x500/SelectedAttributeTypes";
import { directoryStringToString } from "@wildboar/x500";
import { prepString } from "@wildboar/x500";

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
