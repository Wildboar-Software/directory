import { Context } from "@wildboar/meerkat-types";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import { ASN1Element } from "@wildboar/asn1";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";

export
function getAssignmentContext (ctx: Context): EqualityMatcher {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_DistinguishedName(assertion);
        const v = _decode_DistinguishedName(value);
        return compareDistinguishedName(a, v, namingMatcher);
    };
}

// export
// const evaluateDLAdministratorAnnotationContext: EqualityMatcher = (
//     assertion: ASN1Element,
//     value: ASN1Element,
// ): boolean => {
//     if (assertion.tagClass !== ASN1TagClass.universal) {
//         return false;
//     }
//     if (value.tagClass !== ASN1TagClass.universal) {
//         return false;
//     }
//     const a = assertion.tagNumber === ASN1UniversalType.bmpString
//         ? assertion.bmpString
//         : assertion.universalString;
//     const v = value.tagNumber === ASN1UniversalType.bmpString
//         ? value.bmpString
//         : value.universalString;
//     return (v.indexOf(a) > -1);
// }

// export default evaluateDLAdministratorAnnotationContext;
