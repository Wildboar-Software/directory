import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import { metaphone } from "../metaphone";

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
