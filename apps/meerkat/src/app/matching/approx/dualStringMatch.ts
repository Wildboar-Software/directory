import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    DualStringSyntax,
    _decode_DualStringSyntax,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { directoryStringToString } from "@wildboar/x500";
import { distance } from "fastest-levenshtein";

export
function getDualStringMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: DualStringSyntax = _decode_DualStringSyntax(assertion);
        const v: DualStringSyntax = _decode_DualStringSyntax(value);
        const operationDeviations = distance(
            directoryStringToString(a.operation),
            directoryStringToString(v.operation),
        );
        const objectDeviations = distance(
            directoryStringToString(a.object),
            directoryStringToString(v.object),
        );
        return ((operationDeviations + objectDeviations) <= tolerateDeviations);
    };
}

export default getDualStringMatch;
