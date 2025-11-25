import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_UnboundedDirectoryString as _decode_UDS,
} from "@wildboar/x500/SelectedAttributeTypes";
import { directoryStringToString } from "@wildboar/x500";
import { distance } from "fastest-levenshtein";

export
function getDirectoryStringFirstComponentMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: string = directoryStringToString(_decode_UDS(assertion));
        const v: string = directoryStringToString(_decode_UDS(value.sequence[0]));
        const deviations = distance(a.trim().toLowerCase(), v.trim().toLowerCase());
        return (deviations <= tolerateDeviations);
    };
}

export default getDirectoryStringFirstComponentMatch;
