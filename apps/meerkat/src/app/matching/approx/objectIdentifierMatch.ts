import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

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
