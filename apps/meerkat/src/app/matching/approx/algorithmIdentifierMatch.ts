import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";

export
const algorithmIdentifierMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: AlgorithmIdentifier = _decode_AlgorithmIdentifier(assertion);
    const probablyAnAlgorithmIdentifier: ASN1Element = value.sequence[1];
    const algId: AlgorithmIdentifier = _decode_AlgorithmIdentifier(probablyAnAlgorithmIdentifier);
    return (a.algorithm.isEqualTo(algId.algorithm));
}

export default algorithmIdentifierMatch;
