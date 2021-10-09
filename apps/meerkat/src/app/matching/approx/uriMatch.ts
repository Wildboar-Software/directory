import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import { URL } from "url";

export
const uriMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: URL = new URL(assertion.utf8String.toLowerCase());
    const v: URL = new URL(value.utf8String.toLowerCase());

    const portMatches: boolean = a.port !== ""
        ? a.port === v.port
        : true;

    return (
        (a.protocol.replace(/s/g, "") === v.protocol.replace(/s/g, ""))
        && (a.hostname === v.hostname)
        && portMatches
        && (v.pathname.startsWith(a.pathname))
    );
}

export default uriMatch;
