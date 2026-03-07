import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import { doubleMetaphone } from "double-metaphone";

/* OpenLDAP uses a flexible choice of phonetic algorithms with
metaphone (I think version 1) being the default. Since
double-metaphone's first return value is the same as metaphone 1
(I think), it should be fine to use double-metaphone here. */
export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = assertion.ia5String.trim();
    const v = value.ia5String.trim();
    const [ a1, a2 ] = doubleMetaphone(a);
    const [ v1, v2 ] = doubleMetaphone(v);
    return (a1 === v1 || a1 === v2 || a2 === v1 || a2 === v2);
};

export default matcher;
