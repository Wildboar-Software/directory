import { type EqualityMatcher } from "@wildboar/x500";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type { ASN1Element } from "@wildboar/asn1";
import {
    NameAndOptionalUID,
    _decode_NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import { compareDistinguishedName } from "@wildboar/x500";

export
const uniqueMemberMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
    getEqualityMatcher?: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean => {
    const a: NameAndOptionalUID = _decode_NameAndOptionalUID(assertion);
    const v: NameAndOptionalUID = _decode_NameAndOptionalUID(value);
    return compareDistinguishedName(a.dn, v.dn, getEqualityMatcher ?? (() => undefined));
}

export default uniqueMemberMatch;
