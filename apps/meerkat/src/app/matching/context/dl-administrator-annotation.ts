import type { EqualityMatcher } from "@wildboar/x500";
import { ASN1Element, ASN1TagClass, ASN1UniversalType } from "asn1-ts";

export
const evaluateDLAdministratorAnnotationContext: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    if (assertion.tagClass !== ASN1TagClass.universal) {
        return false;
    }
    if (value.tagClass !== ASN1TagClass.universal) {
        return false;
    }
    const a = assertion.tagNumber === ASN1UniversalType.bmpString
        ? assertion.bmpString
        : assertion.universalString;
    const v = value.tagNumber === ASN1UniversalType.bmpString
        ? value.bmpString
        : value.universalString;
    return (v.indexOf(a) > -1);
}

export default evaluateDLAdministratorAnnotationContext;
