import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element, INTEGER } from "@wildboar/asn1";

export
function getIntegerFirstComponentMatch (percentToleration: number): EqualityMatcher {
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a: INTEGER = assertion.integer;
        const v: INTEGER = value.sequence[0].integer;
        const percentIncorrect = Math.abs(Number((BigInt(v) - BigInt(a)) / BigInt(v))) * 100;
        return (percentIncorrect <= percentToleration);
    };
}

export default getIntegerFirstComponentMatch;
