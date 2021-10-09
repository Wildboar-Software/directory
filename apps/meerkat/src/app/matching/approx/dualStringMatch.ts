import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    DualStringSyntax,
    _decode_DualStringSyntax,
} from "@wildboar/x500/src/lib/modules/AttributeCertificateDefinitions/DualStringSyntax.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import fl from "fast-levenshtein";

export
function getDualStringMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: DualStringSyntax = _decode_DualStringSyntax(assertion);
        const v: DualStringSyntax = _decode_DualStringSyntax(value);
        const operationDeviations = fl.get(
            directoryStringToString(a.operation),
            directoryStringToString(v.operation),
        );
        const objectDeviations = fl.get(
            directoryStringToString(a.object),
            directoryStringToString(v.object),
        );
        return ((operationDeviations + objectDeviations) <= tolerateDeviations);
    };
}

export default getDualStringMatch;
