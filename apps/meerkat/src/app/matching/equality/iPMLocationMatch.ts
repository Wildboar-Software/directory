import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import { _decode_SequenceNumber } from "@wildboar/x400/src/lib/modules/MSAbstractService/SequenceNumber.ta";
import { _decode_IPMLocation } from "@wildboar/x400/src/lib/modules/IPMSMessageStoreAttributes/IPMLocation.ta";

export
const iPMLocationMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const v = _decode_IPMLocation(value);
    if (!("stored" in v)) {
        return false;
    }
    const a = Number(_decode_SequenceNumber(assertion));
    for (const sn of v.stored) {
        if (a === Number(sn)) {
            return true;
        }
    }
    return false;
}

export default iPMLocationMatch;
