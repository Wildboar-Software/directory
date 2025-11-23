import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import { _decode_SigningTime } from "@wildboar/pkcs/PKCS-9";
import { getDateFromTime } from "@wildboar/x500";

export
const signingTimeMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = getDateFromTime(_decode_SigningTime(assertion)).toISOString().slice(0, 19);
    const v = getDateFromTime(_decode_SigningTime(value)).toISOString().slice(0, 19);
    return (a === v);
}

export default signingTimeMatch;
