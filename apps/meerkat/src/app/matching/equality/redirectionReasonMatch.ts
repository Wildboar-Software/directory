import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_RedirectionReason,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/RedirectionReason.ta";
import {
    _decode_RedirectionHistory,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/RedirectionHistory.ta";

export
const redirectionReasonMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_RedirectionReason(assertion);
    const v = _decode_RedirectionHistory(value);
    for (const rh of v) {
        if (rh.redirection_reason === a) {
            return true;
        }
    }
    return false;
}

export default redirectionReasonMatch;
