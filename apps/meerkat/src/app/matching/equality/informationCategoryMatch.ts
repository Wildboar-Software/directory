import { ASN1Element } from "asn1-ts";
import type { EqualityMatcher } from "@wildboar/x500";
import { _decode_InformationCategory } from "@wildboar/x400/src/lib/modules/IPMSHeadingExtensions/InformationCategory.ta";
import { univOrBmpToString } from "./orAddressUtilities";

// InformationCategory ::= SEQUENCE {
//     reference    [0]  OBJECT IDENTIFIER OPTIONAL,
//     description  [1]  DescriptionString OPTIONAL
//   }

// DescriptionString ::= UniversalOrBMPString{ub-information-category-length}

export
const informationCategoryMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const v = _decode_InformationCategory(value);
    const a = _decode_InformationCategory(assertion);
    if (v.reference && a.reference) {
        const referenceMatch = v.reference.isEqualTo(a.reference);
        if (!referenceMatch) {
            return false;
        }
        if (v.description && a.description) {
            const vdesc = univOrBmpToString(v.description).trim().replace(/\s+/g, " ").toUpperCase();
            const adesc = univOrBmpToString(a.description).trim().replace(/\s+/g, " ").toUpperCase();
            return (vdesc === adesc);
        } else {
            return true;
        }
    } else if (!v.reference && !a.reference) {
        if (!v.description || !a.description) {
            return false;
        }
        const vdesc = univOrBmpToString(v.description).trim().replace(/\s+/g, " ").toUpperCase();
        const adesc = univOrBmpToString(a.description).trim().replace(/\s+/g, " ").toUpperCase();
        return (vdesc === adesc);
    } else {
        return false;
    }
};

export default informationCategoryMatch;
