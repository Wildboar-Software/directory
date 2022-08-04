package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION ExtensionAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionAttribute ::= SEQUENCE {
//   type            ATTRIBUTE.&id,
//   value           SET SIZE (0..1) OF SEQUENCE {
//     mandatory  [0]  BOOLEAN DEFAULT FALSE,
//     critical   [1]  BOOLEAN DEFAULT FALSE,
//     ext        [2]  EXTENSION.&ExtnType,
//     ... },
//   ... }
// ```
//
//
type ExtensionAttribute struct {
	Type  asn1.ObjectIdentifier
	Value [](ExtensionAttribute_value_Item) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ExtensionAttribute */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_subjectDirectoryAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9 1}
// ```
//
//
var Id_ce_a_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_subjectDirectoryAttributes */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_subjectKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14 1}
// ```
//
//
var Id_ce_a_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_subjectKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_keyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15 1}
// ```
//
//
var Id_ce_a_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_keyUsage */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_privateKeyUsagePeriod */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16 1}
// ```
//
//
var Id_ce_a_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_privateKeyUsagePeriod */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_subjectAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17 1}
// ```
//
//
var Id_ce_a_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_subjectAltName */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_issuerAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18 1}
// ```
//
//
var Id_ce_a_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_issuerAltName */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_basicConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19 1}
// ```
//
//
var Id_ce_a_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_basicConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_cRLNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20 1}
// ```
//
//
var Id_ce_a_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_cRLNumber */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_reasonCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21 1}
// ```
//
//
var Id_ce_a_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_reasonCode */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_holdInstructionCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23 1}
// ```
//
//
var Id_ce_a_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_holdInstructionCode */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_invalidityDate */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24 1}
// ```
//
//
var Id_ce_a_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_invalidityDate */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_deltaCRLIndicator */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27 1}
// ```
//
//
var Id_ce_a_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_deltaCRLIndicator */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_issuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28 1}
// ```
//
//
var Id_ce_a_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_issuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_certificateIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29 1}
// ```
//
//
var Id_ce_a_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_certificateIssuer */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_nameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30 1}
// ```
//
//
var Id_ce_a_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_nameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_cRLDistributionPoints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31 1}
// ```
//
//
var Id_ce_a_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_cRLDistributionPoints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_certificatePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32 1}
// ```
//
//
var Id_ce_a_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_certificatePolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_policyMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33 1}
// ```
//
//
var Id_ce_a_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_policyMappings */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_authorityKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35 1}
// ```
//
//
var Id_ce_a_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_authorityKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_policyConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36 1}
// ```
//
//
var Id_ce_a_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_policyConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_extKeyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37 1}
// ```
//
//
var Id_ce_a_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_extKeyUsage */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_authorityAttributeIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38 1}
// ```
//
//
var Id_ce_a_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_authorityAttributeIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_roleSpecCertIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39 1}
// ```
//
//
var Id_ce_a_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_roleSpecCertIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_cRLStreamIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40 1}
// ```
//
//
var Id_ce_a_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_cRLStreamIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_basicAttConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41 1}
// ```
//
//
var Id_ce_a_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_basicAttConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_delegatedNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42 1}
// ```
//
//
var Id_ce_a_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_delegatedNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_timeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43 1}
// ```
//
//
var Id_ce_a_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_timeSpecification */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_cRLScope */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44 1}
// ```
//
//
var Id_ce_a_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_cRLScope */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_statusReferrals */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45 1}
// ```
//
//
var Id_ce_a_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_statusReferrals */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_freshestCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46 1}
// ```
//
//
var Id_ce_a_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_freshestCRL */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_orderedList */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47 1}
// ```
//
//
var Id_ce_a_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_orderedList */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_attributeDescriptor */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48 1}
// ```
//
//
var Id_ce_a_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_attributeDescriptor */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_userNotice */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49 1}
// ```
//
//
var Id_ce_a_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_userNotice */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_sOAIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50 1}
// ```
//
//
var Id_ce_a_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_sOAIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_baseUpdateTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51 1}
// ```
//
//
var Id_ce_a_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_baseUpdateTime */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_acceptableCertPolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52 1}
// ```
//
//
var Id_ce_a_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_acceptableCertPolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_deltaInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53 1}
// ```
//
//
var Id_ce_a_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_deltaInfo */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_inhibitAnyPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54 1}
// ```
//
//
var Id_ce_a_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_inhibitAnyPolicy */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_targetingInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55 1}
// ```
//
//
var Id_ce_a_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_targetingInformation */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_noRevAvail */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56 1}
// ```
//
//
var Id_ce_a_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_noRevAvail */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_acceptablePrivilegePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57 1}
// ```
//
//
var Id_ce_a_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_acceptablePrivilegePolicies */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_toBeRevoked */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58 1}
// ```
//
//
var Id_ce_a_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_toBeRevoked */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_revokedGroups */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59 1}
// ```
//
//
var Id_ce_a_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_revokedGroups */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_expiredCertsOnCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60 1}
// ```
//
//
var Id_ce_a_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_expiredCertsOnCRL */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_indirectIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61 1}
// ```
//
//
var Id_ce_a_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_indirectIssuer */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_noAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62 1}
// ```
//
//
var Id_ce_a_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_noAssertion */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_aAissuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63 1}
// ```
//
//
var Id_ce_a_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_aAissuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_issuedOnBehalfOf */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64 1}
// ```
//
//
var Id_ce_a_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_issuedOnBehalfOf */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_singleUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65 1}
// ```
//
//
var Id_ce_a_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_singleUse */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_groupAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66 1}
// ```
//
//
var Id_ce_a_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_groupAC */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_allowedAttributeAssignments */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67 1}
// ```
//
//
var Id_ce_a_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_allowedAttributeAssignments */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_attributeMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68 1}
// ```
//
//
var Id_ce_a_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_attributeMappings */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_holderNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69 1}
// ```
//
//
var Id_ce_a_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_holderNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_authorizationValidation */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70 1}
// ```
//
//
var Id_ce_a_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_authorizationValidation */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_protRestrict */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71 1}
// ```
//
//
var Id_ce_a_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_protRestrict */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_subjectAltPublicKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72 1}
// ```
//
//
var Id_ce_a_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_subjectAltPublicKeyInfo */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_altSignatureAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73 1}
// ```
//
//
var Id_ce_a_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_altSignatureAlgorithm */ /* START_OF_SYMBOL_DEFINITION Id_ce_a_altSignatureValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce-a-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74 1}
// ```
//
//
var Id_ce_a_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ce_a_altSignatureValue */ /* START_OF_SYMBOL_DEFINITION Id_asx_subjectDirectoryAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-subjectDirectoryAttributes          OBJECT IDENTIFIER ::= {id-ce 9 2}
// ```
//
//
var Id_asx_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_subjectDirectoryAttributes */ /* START_OF_SYMBOL_DEFINITION Id_asx_subjectKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-subjectKeyIdentifier                OBJECT IDENTIFIER ::= {id-ce 14 2}
// ```
//
//
var Id_asx_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_subjectKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_keyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-keyUsage                            OBJECT IDENTIFIER ::= {id-ce 15 2}
// ```
//
//
var Id_asx_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_keyUsage */ /* START_OF_SYMBOL_DEFINITION Id_asx_privateKeyUsagePeriod */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-privateKeyUsagePeriod               OBJECT IDENTIFIER ::= {id-ce 16 2}
// ```
//
//
var Id_asx_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_privateKeyUsagePeriod */ /* START_OF_SYMBOL_DEFINITION Id_asx_subjectAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-subjectAltName                      OBJECT IDENTIFIER ::= {id-ce 17 2}
// ```
//
//
var Id_asx_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_subjectAltName */ /* START_OF_SYMBOL_DEFINITION Id_asx_issuerAltName */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-issuerAltName                       OBJECT IDENTIFIER ::= {id-ce 18 2}
// ```
//
//
var Id_asx_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_issuerAltName */ /* START_OF_SYMBOL_DEFINITION Id_asx_basicConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-basicConstraints                    OBJECT IDENTIFIER ::= {id-ce 19 2}
// ```
//
//
var Id_asx_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_basicConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_cRLNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-cRLNumber                           OBJECT IDENTIFIER ::= {id-ce 20 2}
// ```
//
//
var Id_asx_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_cRLNumber */ /* START_OF_SYMBOL_DEFINITION Id_asx_reasonCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-reasonCode                          OBJECT IDENTIFIER ::= {id-ce 21 2}
// ```
//
//
var Id_asx_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_reasonCode */ /* START_OF_SYMBOL_DEFINITION Id_asx_holdInstructionCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-holdInstructionCode                 OBJECT IDENTIFIER ::= {id-ce 23 2}
// ```
//
//
var Id_asx_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_holdInstructionCode */ /* START_OF_SYMBOL_DEFINITION Id_asx_invalidityDate */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-invalidityDate                      OBJECT IDENTIFIER ::= {id-ce 24 2}
// ```
//
//
var Id_asx_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_invalidityDate */ /* START_OF_SYMBOL_DEFINITION Id_asx_deltaCRLIndicator */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-deltaCRLIndicator                   OBJECT IDENTIFIER ::= {id-ce 27 2}
// ```
//
//
var Id_asx_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_deltaCRLIndicator */ /* START_OF_SYMBOL_DEFINITION Id_asx_issuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-issuingDistributionPoint            OBJECT IDENTIFIER ::= {id-ce 28 2}
// ```
//
//
var Id_asx_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_issuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_asx_certificateIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-certificateIssuer                   OBJECT IDENTIFIER ::= {id-ce 29 2}
// ```
//
//
var Id_asx_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_certificateIssuer */ /* START_OF_SYMBOL_DEFINITION Id_asx_nameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-nameConstraints                     OBJECT IDENTIFIER ::= {id-ce 30 2}
// ```
//
//
var Id_asx_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_nameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_cRLDistributionPoints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-cRLDistributionPoints               OBJECT IDENTIFIER ::= {id-ce 31 2}
// ```
//
//
var Id_asx_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_cRLDistributionPoints */ /* START_OF_SYMBOL_DEFINITION Id_asx_certificatePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-certificatePolicies                 OBJECT IDENTIFIER ::= {id-ce 32 2}
// ```
//
//
var Id_asx_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_certificatePolicies */ /* START_OF_SYMBOL_DEFINITION Id_asx_policyMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-policyMappings                      OBJECT IDENTIFIER ::= {id-ce 33 2}
// ```
//
//
var Id_asx_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_policyMappings */ /* START_OF_SYMBOL_DEFINITION Id_asx_authorityKeyIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-authorityKeyIdentifier              OBJECT IDENTIFIER ::= {id-ce 35 2}
// ```
//
//
var Id_asx_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_authorityKeyIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_policyConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-policyConstraints                   OBJECT IDENTIFIER ::= {id-ce 36 2}
// ```
//
//
var Id_asx_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_policyConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_extKeyUsage */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-extKeyUsage                         OBJECT IDENTIFIER ::= {id-ce 37 2}
// ```
//
//
var Id_asx_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_extKeyUsage */ /* START_OF_SYMBOL_DEFINITION Id_asx_authorityAttributeIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-authorityAttributeIdentifier        OBJECT IDENTIFIER ::= {id-ce 38 2}
// ```
//
//
var Id_asx_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_authorityAttributeIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_roleSpecCertIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-roleSpecCertIdentifier              OBJECT IDENTIFIER ::= {id-ce 39 2}
// ```
//
//
var Id_asx_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_roleSpecCertIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_cRLStreamIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-cRLStreamIdentifier                 OBJECT IDENTIFIER ::= {id-ce 40 2}
// ```
//
//
var Id_asx_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_cRLStreamIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_basicAttConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-basicAttConstraints                 OBJECT IDENTIFIER ::= {id-ce 41 2}
// ```
//
//
var Id_asx_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_basicAttConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_delegatedNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-delegatedNameConstraints            OBJECT IDENTIFIER ::= {id-ce 42 2}
// ```
//
//
var Id_asx_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_delegatedNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_timeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-timeSpecification                   OBJECT IDENTIFIER ::= {id-ce 43 2}
// ```
//
//
var Id_asx_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_timeSpecification */ /* START_OF_SYMBOL_DEFINITION Id_asx_cRLScope */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-cRLScope                            OBJECT IDENTIFIER ::= {id-ce 44 2}
// ```
//
//
var Id_asx_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_cRLScope */ /* START_OF_SYMBOL_DEFINITION Id_asx_statusReferrals */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-statusReferrals                     OBJECT IDENTIFIER ::= {id-ce 45 2}
// ```
//
//
var Id_asx_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_statusReferrals */ /* START_OF_SYMBOL_DEFINITION Id_asx_freshestCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-freshestCRL                         OBJECT IDENTIFIER ::= {id-ce 46 2}
// ```
//
//
var Id_asx_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_freshestCRL */ /* START_OF_SYMBOL_DEFINITION Id_asx_orderedList */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-orderedList                         OBJECT IDENTIFIER ::= {id-ce 47 2}
// ```
//
//
var Id_asx_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_orderedList */ /* START_OF_SYMBOL_DEFINITION Id_asx_attributeDescriptor */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-attributeDescriptor                 OBJECT IDENTIFIER ::= {id-ce 48 2}
// ```
//
//
var Id_asx_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_attributeDescriptor */ /* START_OF_SYMBOL_DEFINITION Id_asx_userNotice */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-userNotice                          OBJECT IDENTIFIER ::= {id-ce 49 2}
// ```
//
//
var Id_asx_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_userNotice */ /* START_OF_SYMBOL_DEFINITION Id_asx_sOAIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-sOAIdentifier                       OBJECT IDENTIFIER ::= {id-ce 50 2}
// ```
//
//
var Id_asx_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_sOAIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_baseUpdateTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-baseUpdateTime                      OBJECT IDENTIFIER ::= {id-ce 51 2}
// ```
//
//
var Id_asx_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_baseUpdateTime */ /* START_OF_SYMBOL_DEFINITION Id_asx_acceptableCertPolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-acceptableCertPolicies              OBJECT IDENTIFIER ::= {id-ce 52 2}
// ```
//
//
var Id_asx_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_acceptableCertPolicies */ /* START_OF_SYMBOL_DEFINITION Id_asx_deltaInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-deltaInfo                           OBJECT IDENTIFIER ::= {id-ce 53 2}
// ```
//
//
var Id_asx_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_deltaInfo */ /* START_OF_SYMBOL_DEFINITION Id_asx_inhibitAnyPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-inhibitAnyPolicy                    OBJECT IDENTIFIER ::= {id-ce 54 2}
// ```
//
//
var Id_asx_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_inhibitAnyPolicy */ /* START_OF_SYMBOL_DEFINITION Id_asx_targetingInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-targetingInformation                OBJECT IDENTIFIER ::= {id-ce 55 2}
// ```
//
//
var Id_asx_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_targetingInformation */ /* START_OF_SYMBOL_DEFINITION Id_asx_noRevAvail */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-noRevAvail                          OBJECT IDENTIFIER ::= {id-ce 56 2}
// ```
//
//
var Id_asx_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_noRevAvail */ /* START_OF_SYMBOL_DEFINITION Id_asx_acceptablePrivilegePolicies */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-acceptablePrivilegePolicies         OBJECT IDENTIFIER ::= {id-ce 57 2}
// ```
//
//
var Id_asx_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_acceptablePrivilegePolicies */ /* START_OF_SYMBOL_DEFINITION Id_asx_toBeRevoked */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-toBeRevoked                         OBJECT IDENTIFIER ::= {id-ce 58 2}
// ```
//
//
var Id_asx_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_toBeRevoked */ /* START_OF_SYMBOL_DEFINITION Id_asx_revokedGroups */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-revokedGroups                       OBJECT IDENTIFIER ::= {id-ce 59 2}
// ```
//
//
var Id_asx_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_revokedGroups */ /* START_OF_SYMBOL_DEFINITION Id_asx_expiredCertsOnCRL */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-expiredCertsOnCRL                   OBJECT IDENTIFIER ::= {id-ce 60 2}
// ```
//
//
var Id_asx_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_expiredCertsOnCRL */ /* START_OF_SYMBOL_DEFINITION Id_asx_indirectIssuer */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-indirectIssuer                      OBJECT IDENTIFIER ::= {id-ce 61 2}
// ```
//
//
var Id_asx_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_indirectIssuer */ /* START_OF_SYMBOL_DEFINITION Id_asx_noAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-noAssertion                         OBJECT IDENTIFIER ::= {id-ce 62 2}
// ```
//
//
var Id_asx_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_noAssertion */ /* START_OF_SYMBOL_DEFINITION Id_asx_aAissuingDistributionPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-aAissuingDistributionPoint          OBJECT IDENTIFIER ::= {id-ce 63 2}
// ```
//
//
var Id_asx_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_aAissuingDistributionPoint */ /* START_OF_SYMBOL_DEFINITION Id_asx_issuedOnBehalfOf */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-issuedOnBehalfOf                    OBJECT IDENTIFIER ::= {id-ce 64 2}
// ```
//
//
var Id_asx_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_issuedOnBehalfOf */ /* START_OF_SYMBOL_DEFINITION Id_asx_singleUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-singleUse                           OBJECT IDENTIFIER ::= {id-ce 65 2}
// ```
//
//
var Id_asx_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_singleUse */ /* START_OF_SYMBOL_DEFINITION Id_asx_groupAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-groupAC                             OBJECT IDENTIFIER ::= {id-ce 66 2}
// ```
//
//
var Id_asx_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_groupAC */ /* START_OF_SYMBOL_DEFINITION Id_asx_allowedAttributeAssignments */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-allowedAttributeAssignments         OBJECT IDENTIFIER ::= {id-ce 67 2}
// ```
//
//
var Id_asx_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_allowedAttributeAssignments */ /* START_OF_SYMBOL_DEFINITION Id_asx_attributeMappings */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-attributeMappings                   OBJECT IDENTIFIER ::= {id-ce 68 2}
// ```
//
//
var Id_asx_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_attributeMappings */ /* START_OF_SYMBOL_DEFINITION Id_asx_holderNameConstraints */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-holderNameConstraints               OBJECT IDENTIFIER ::= {id-ce 69 2}
// ```
//
//
var Id_asx_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_holderNameConstraints */ /* START_OF_SYMBOL_DEFINITION Id_asx_authorizationValidation */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-authorizationValidation             OBJECT IDENTIFIER ::= {id-ce 70 2}
// ```
//
//
var Id_asx_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_authorizationValidation */ /* START_OF_SYMBOL_DEFINITION Id_asx_protRestrict */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-protRestrict                        OBJECT IDENTIFIER ::= {id-ce 71 2}
// ```
//
//
var Id_asx_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_protRestrict */ /* START_OF_SYMBOL_DEFINITION Id_asx_subjectAltPublicKeyInfo */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-subjectAltPublicKeyInfo             OBJECT IDENTIFIER ::= {id-ce 72 2}
// ```
//
//
var Id_asx_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_subjectAltPublicKeyInfo */ /* START_OF_SYMBOL_DEFINITION Id_asx_altSignatureAlgorithm */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-altSignatureAlgorithm               OBJECT IDENTIFIER ::= {id-ce 73 2}
// ```
//
//
var Id_asx_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_altSignatureAlgorithm */ /* START_OF_SYMBOL_DEFINITION Id_asx_altSignatureValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-altSignatureValue                   OBJECT IDENTIFIER ::= {id-ce 74 2}
// ```
//
//
var Id_asx_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_altSignatureValue */ /* START_OF_SYMBOL_DEFINITION ExtensionAttribute_value_Item */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionAttribute-value-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ExtensionAttribute_value_Item struct {
	Mandatory bool          `asn1:"optional,explicit,tag:0"`
	Critical  bool          `asn1:"optional,explicit,tag:1"`
	Ext       asn1.RawValue `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION ExtensionAttribute_value_Item */ /* START_OF_SYMBOL_DEFINITION ExtensionSyntax_Type */
// ### ASN.1 Definition:
//
// ```asn1
// extensionSyntax-Type ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ExtensionSyntax_Type struct {
	Mandatory bool          `asn1:"optional,explicit,tag:0"`
	Critical  bool          `asn1:"optional,explicit,tag:1"`
	Ext       asn1.RawValue `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION ExtensionSyntax_Type */
