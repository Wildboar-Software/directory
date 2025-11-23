import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    PKCS9String,
    _decode_PKCS9String,
} from "@wildboar/pkcs/PKCS-9";
import { directoryStringToString } from "@wildboar/x500";

function pkcs9StringToString (str: PKCS9String): string {
    if ("ia5String" in str) {
        return str.ia5String;
    } else {
        return directoryStringToString(str.directoryString);
    }
}

export
const pkcs9CaseIgnoreMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_PKCS9String(assertion);
    const v = _decode_PKCS9String(value);
    // The specification does not mandate the X.520 string preparation algorithm.
    const astr = pkcs9StringToString(a).toUpperCase();
    const vstr = pkcs9StringToString(v).toUpperCase();
    return (astr === vstr);
}

export default pkcs9CaseIgnoreMatch;
