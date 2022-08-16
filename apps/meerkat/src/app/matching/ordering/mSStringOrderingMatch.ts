import type { ASN1Element } from "asn1-ts";
import { OrderingMatcher } from "@wildboar/x500";
import {
    _decode_MSString,
} from "@wildboar/x400/src/lib/modules/MSMatchingRules/MSString.ta";
import { msStringToString } from "../equality/orAddressUtilities";

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
