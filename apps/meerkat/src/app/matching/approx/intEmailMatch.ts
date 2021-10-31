import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import fl from "fast-levenshtein";

function normalizeUserPart (str: string): string {
    return str
        .replace(/\./g, "")
        .replace(/-/g, "")
        .replace(/_/g, "")
        ;
}

export
function getIntEmailMatch (tolerateDeviations: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = assertion.utf8String.toLowerCase();
        const v = value.utf8String.toLowerCase();
        const [ auser ] = a.split("@");
        const [ vuser ] = v.split("@");
        const deviations = fl.get(
            normalizeUserPart(auser),
            normalizeUserPart(vuser),
        );
        return (deviations <= tolerateDeviations);
    };
}

export default getIntEmailMatch;
