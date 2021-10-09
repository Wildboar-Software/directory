import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    _decode_UnboundedDirectoryString as _decode_UDS,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/UnboundedDirectoryString.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";

export
function getCaseIgnoreListMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: string[] = assertion.sequence
            .map((a) => directoryStringToString(_decode_UDS(a)).trim().toLowerCase());
        const v: string[] = value.sequence
            .map((v) => directoryStringToString(_decode_UDS(v)).trim().toLowerCase());
        let failBudget: number = tolerateDeviations;
        const len = Math.min(a.length, v.length);
        for (let i = 0; i < len; i++) {
            if (a[i] !== v[i]) {
                failBudget--;
            }
            if (failBudget <= 0) {
                return false;
            }
        }
        return true;
    };
}

export default getCaseIgnoreListMatch;
