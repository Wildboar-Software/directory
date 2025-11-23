import type { ASN1Element } from "@wildboar/asn1";
import { OrderingMatcher } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString } from "../equality/orAddressUtilities.js";

export
const mSStringOrderingMatch: OrderingMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): number => {
    const a = msStringToString(_decode_MSString(assertion)).trim().replace(/\s+/g, " ").toUpperCase();
    const v = msStringToString(_decode_MSString(value)).trim().replace(/\s+/g, " ").toUpperCase();
    return a.localeCompare(v);
}

export default mSStringOrderingMatch;
