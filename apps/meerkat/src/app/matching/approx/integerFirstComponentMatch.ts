import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element, INTEGER } from "asn1-ts";

export
function getIntegerFirstComponentMatch (percentToleration: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: INTEGER = assertion.integer;
        const v: INTEGER = value.sequence[0].integer;
        const percentIncorrect = Math.abs((v - a) / v) * 100;
        return (percentIncorrect <= percentToleration);
    };
}

export default getIntegerFirstComponentMatch;
