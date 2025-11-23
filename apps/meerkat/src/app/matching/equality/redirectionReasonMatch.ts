import type { ASN1Element } from "@wildboar/asn1";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_RedirectionReason,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_RedirectionHistory,
} from "@wildboar/x400/MTSAbstractService";

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
