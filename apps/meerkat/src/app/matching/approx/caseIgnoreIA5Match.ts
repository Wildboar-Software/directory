import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import fl from "fast-levenshtein";

export
function getCaseIgnoreIA5Match (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const deviations = fl.get(
            assertion.ia5String.trim().toLowerCase(),
            value.ia5String.trim().toLowerCase(),
        );
        return (deviations <= tolerateDeviations);
    };
}

export default getCaseIgnoreIA5Match;
