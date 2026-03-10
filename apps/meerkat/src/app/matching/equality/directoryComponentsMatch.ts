import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";

// Defined here: https://datatracker.ietf.org/doc/html/draft-legg-ldapext-component-matching-11#section-7.3
// ASN.1 Type                               | Matching Rule
// =========================================+========================
// RDNSequence                              | distinguishedNameMatch
// RelativeDistinguishedName                | rdnMatch
// TelephoneNumber                          | telephoneNumberMatch
// FacsimileTelephoneNumber.telephoneNumber | telephoneNumberMatch
// NumericString                            | numericStringMatch
// GeneralizedTime                          | generalizedTimeMatch
// UTCTime                                  | uTCTimeMatch
// DirectoryString{}                        | caseIgnoreMatch
// BMPString                                | caseIgnoreMatch
// GeneralString                            | caseIgnoreMatch
// GraphicString                            | caseIgnoreMatch
// IA5String                                | caseIgnoreMatch
// PrintableString                          | caseIgnoreMatch
// TeletexString                            | caseIgnoreMatch
// UniversalString                          | caseIgnoreMatch
// UTF8String                               | caseIgnoreMatch
// VideotexString                           | caseIgnoreMatch
// VisibleString                            | caseIgnoreMatch
export
const matcher: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    return false; // FIXME: Not implemented.
};

export default matcher;
