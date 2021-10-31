import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    AlgorithmIdentifier,
    _decode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";

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
