import type { ASN1Element } from "asn1-ts";
import { EqualityMatcher } from "@wildboar/x500";
import {
    _decode_AddressCapabilities,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/AddressCapabilities.ta";
import {
    Capability,
} from "@wildboar/x400/src/lib/modules/MHSDirectoryObjectsAndAttributes/Capability.ta";
import { orAddressesMatch } from "./orAddressUtilities";

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
const addressCapabilitiesMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a = _decode_AddressCapabilities(assertion);
    const v = _decode_AddressCapabilities(value);
    if (a.description && (a.description !== v.description?.trim())) {
        return false;
    }
    if (!orAddressesMatch(a.address, v.address)) {
        return false;
    }
    const valueCapsByContentType: Map<string, Capability> = new Map();
    for (const cap of v.capabilities) {
        for (const eit of cap.content_types ?? []) {
            const key = eit.join(".");
            valueCapsByContentType.set(key, cap);
        }
    }
    /**
     * The specification is not clear at all on what it means for two
     * capabilities to be equivalent. For a lack of better knowledge, this
     * implementation just checks that all asserted extended content types
     * are supported and that the supported content length does not exceed the
     * asserted content length. That should be good enough for most use cases.
     */
    for (const cap of a.capabilities) {
        for (const eit of cap.content_types ?? []) {
            const key = eit.join(".");
            const existingCap = valueCapsByContentType.get(key);
            if (!existingCap) {
                return false;
            }
            if (
                existingCap.maximum_content_length
                && cap.maximum_content_length
                && (Number(existingCap.maximum_content_length) < Number(cap.maximum_content_length))
            ) {
                return false;
            }
        }
    }
    return true;
}

export default addressCapabilitiesMatch;
