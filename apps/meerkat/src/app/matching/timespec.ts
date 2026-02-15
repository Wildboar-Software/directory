import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_TimeSpecification,
    TimeSpecification,
} from "@wildboar/x500/SelectedAttributeTypes";

/**
 * This is not to be confused with `timeSpecificationMatch` used for matching
 * attribute certificates. This just compares two `TimeSpecification`
 * assertions.
 */
export
const timeSpecificationMatch: EqualityMatcher = (
    a: ASN1Element,
    b: ASN1Element,
): boolean => {
    const tsa = _decode_TimeSpecification(a);
    const tsb = _decode_TimeSpecification(b);
    const ntta = tsa.notThisTime
        ?? TimeSpecification._default_value_for_notThisTime;
    const nttb = tsb.notThisTime
        ?? TimeSpecification._default_value_for_notThisTime;
    if (ntta != nttb || tsa.timeZone !== tsb.timeZone) {
        return false;
    }
    if ("absolute" in tsa.time && "absolute" in tsb.time) {
        const absa = tsa.time.absolute;
        const absb = tsb.time.absolute;
        return (
            (absa.startTime?.valueOf() === absb.startTime?.valueOf())
            || (absa.endTime?.valueOf() === absb.endTime?.valueOf())
        );
    } else if ("periodic" in tsa.time && "periodic" in tsb.time) {
        return false; // Way too complicated to compare. Not doing this.
    } else {
        return false; // Unrecognized syntax: assume no match.
    }
}

export default timeSpecificationMatch;
