import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import { distance } from "fastest-levenshtein";

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
        const deviations = distance(
            normalizeUserPart(auser),
            normalizeUserPart(vuser),
        );
        return (deviations <= tolerateDeviations);
    };
}

export default getIntEmailMatch;
