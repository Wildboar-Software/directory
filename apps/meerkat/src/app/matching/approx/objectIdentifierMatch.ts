import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";

export
const objectIdentifierMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: number[] = assertion.objectIdentifier.nodes;
    const v: number[] = value.objectIdentifier.nodes;
    const len = Math.min(a.length, v.length);
    for (let i = 0; i < len; i++) {
        if (a[i] !== v[i]) {
            return false;
        }
    }
    return true;
}

export default objectIdentifierMatch;
