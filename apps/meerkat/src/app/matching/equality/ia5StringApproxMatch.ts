import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import { metaphone } from "../metaphone.js";

export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = assertion.ia5String.trim();
    const v = value.ia5String.trim();
    return (metaphone(a) === metaphone(v));
};

export default matcher;
