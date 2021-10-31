import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import {
    DistinguishedName,
    _decode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";

export
const distinguishedNameMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
    getEqualityMatcher?: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean => {
    const a: DistinguishedName = _decode_DistinguishedName(assertion).slice(0, -1);
    const v: DistinguishedName = _decode_DistinguishedName(value).slice(0, -1);
    return compareDistinguishedName(a, v, getEqualityMatcher ?? (() => undefined));
}

export default distinguishedNameMatch;
