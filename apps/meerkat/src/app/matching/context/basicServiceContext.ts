import { EqualityMatcher } from "@wildboar/x500";
import { ASN1Element } from "asn1-ts";

export
const basicServiceContext: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return assertion.integer === value.integer;
};