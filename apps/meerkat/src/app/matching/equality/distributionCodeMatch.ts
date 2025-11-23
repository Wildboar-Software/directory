import { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import { _decode_DistributionCode } from "@wildboar/x400/IPMSHeadingExtensions";
import { univOrBmpToString } from "./orAddressUtilities.js";

// DistributionCode ::= SEQUENCE {
//     oid-code           OBJECT IDENTIFIER OPTIONAL,
//     alphanumeric-code  AlphaCode OPTIONAL,
//     or-descriptor      [0]  ORDescriptor OPTIONAL
//   }

// AlphaCode ::= UniversalOrBMPString{ub-alpha-code-length}

// NOTE: The or-descriptor is not used for this matching rule.
export
const distributionCodeMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const v = _decode_DistributionCode(value);
    const a = _decode_DistributionCode(assertion);
    if (a.oid_code && v.oid_code) {
        const oidCodesMatch = a.oid_code.isEqualTo(v.oid_code);
        if (!oidCodesMatch) {
            return false;
        }
        if (a.alphanumeric_code && v.alphanumeric_code) {
            const acode = univOrBmpToString(a.alphanumeric_code).trim().replace(/\s+/g, " ").toUpperCase();
            const vcode = univOrBmpToString(v.alphanumeric_code).trim().replace(/\s+/g, " ").toUpperCase();
            return (acode === vcode);
        } else if (!a.alphanumeric_code && !v.alphanumeric_code) {
            return true;
        } else {
            return false;
        }
    } else if (a.alphanumeric_code && v.alphanumeric_code) {
        const acode = univOrBmpToString(a.alphanumeric_code).trim().replace(/\s+/g, " ").toUpperCase();
        const vcode = univOrBmpToString(v.alphanumeric_code).trim().replace(/\s+/g, " ").toUpperCase();
        return (acode === vcode);
    } else {
        return false;
    }
};

export default distributionCodeMatch;
