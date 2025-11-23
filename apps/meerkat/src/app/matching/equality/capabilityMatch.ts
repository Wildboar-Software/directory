import type { ASN1Element } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_Capability,
    _encode_Capability,
} from "@wildboar/x400/MHSDirectoryObjectsAndAttributes";

// addressCapabilitiesMatch MATCHING-RULE ::= {
//     SYNTAX  AddressCapabilities
//     ID      id-mr-address-capabilities-match
// }

// AddressCapabilities ::= SEQUENCE {
//     description   GeneralString OPTIONAL,
//     address       ORAddress,
//     capabilities  SET OF Capability
//   }

//   Capability ::= SET {
//     content-types
//       [0]  SET OF ExtendedContentType OPTIONAL,
//     maximum-content-length                 [1]  ContentLength OPTIONAL,
//     encoded-information-types-constraints
//       [2]  EncodedInformationTypesConstraints OPTIONAL,
//     security-labels                        [3]  SecurityContext OPTIONAL,
//     ...
// }

// ExtendedContentType ::= RELATIVE-OID
// ContentLength ::= INTEGER(0..ub-content-length)
// SecurityContext ::= SET SIZE (1..ub-security-labels) OF SecurityLabel

// SecurityLabel ::= SET {
//     security-policy-identifier  SecurityPolicyIdentifier OPTIONAL,
//     security-classification     SecurityClassification OPTIONAL,
//     privacy-mark                PrivacyMark OPTIONAL,
//     security-categories         SecurityCategories OPTIONAL
// }

// SecurityPolicyIdentifier ::= OBJECT IDENTIFIER

// SecurityClassification ::= INTEGER {
// unmarked(0), unclassified(1), restricted(2), confidential(3), secret(4),
// top-secret(5)}(0..ub-integer-options)

// PrivacyMark ::= PrintableString(SIZE (1..ub-privacy-mark-length))

// SecurityCategories ::= SET SIZE (1..ub-security-categories) OF SecurityCategory

// SecurityCategory ::= SEQUENCE {
// type   [0]  SECURITY-CATEGORY.&id({SecurityCategoriesTable}),
// value  [1]  SECURITY-CATEGORY.&Type({SecurityCategoriesTable}{@type})
// }

// SECURITY-CATEGORY ::= TYPE-IDENTIFIER

export
const capabilityMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    // We re-encode to DER and just do a byte-by-byte comparison.
    // This will have the effect of sorting SET OF, and deconstructing strings.
    const a = _encode_Capability(_decode_Capability(assertion), DER);
    const v = _encode_Capability(_decode_Capability(value), DER);
    return !Buffer.compare(a.value, v.value);
}

export default capabilityMatch;
