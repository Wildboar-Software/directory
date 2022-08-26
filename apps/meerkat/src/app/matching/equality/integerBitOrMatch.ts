import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";

// I can't find any documentation on how this is supposed to work, but I copied
// this implementation from OpenLDAP.
// See:
// https://github.com/openldap/openldap/blob/98a0029daeb8aaa7bc58428ad3f94eface7f997b/servers/slapd/schema_init.c#L3174
export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = Number(assertion.integer);
    const v = Number(value.integer);
    return ((a & v) !== 0);
};

export default matcher;
