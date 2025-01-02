package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	ExtensionAttribute ::= SEQUENCE {
//	  type            ATTRIBUTE.&id,
//	  value           SET SIZE (0..1) OF SEQUENCE {
//	    mandatory  [0]  BOOLEAN DEFAULT FALSE,
//	    critical   [1]  BOOLEAN DEFAULT FALSE,
//	    ext        [2]  EXTENSION.&ExtnType,
//	    ... },
//	  ... }
type ExtensionAttribute struct {
	Type  asn1.ObjectIdentifier
	Value [](ExtensionAttribute_value_Item) `asn1:"set"`
}

// # ASN.1 Definition:
//
// id-ce-a-subjectDirectoryAttributes         OBJECT IDENTIFIER ::= {id-ce 9 1}
var Id_ce_a_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-subjectKeyIdentifier               OBJECT IDENTIFIER ::= {id-ce 14 1}
var Id_ce_a_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-keyUsage                           OBJECT IDENTIFIER ::= {id-ce 15 1}
var Id_ce_a_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-privateKeyUsagePeriod              OBJECT IDENTIFIER ::= {id-ce 16 1}
var Id_ce_a_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-subjectAltName                     OBJECT IDENTIFIER ::= {id-ce 17 1}
var Id_ce_a_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-issuerAltName                      OBJECT IDENTIFIER ::= {id-ce 18 1}
var Id_ce_a_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-basicConstraints                   OBJECT IDENTIFIER ::= {id-ce 19 1}
var Id_ce_a_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-cRLNumber                          OBJECT IDENTIFIER ::= {id-ce 20 1}
var Id_ce_a_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-reasonCode                         OBJECT IDENTIFIER ::= {id-ce 21 1}
var Id_ce_a_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-holdInstructionCode                OBJECT IDENTIFIER ::= {id-ce 23 1}
var Id_ce_a_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-invalidityDate                     OBJECT IDENTIFIER ::= {id-ce 24 1}
var Id_ce_a_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-deltaCRLIndicator                  OBJECT IDENTIFIER ::= {id-ce 27 1}
var Id_ce_a_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-issuingDistributionPoint           OBJECT IDENTIFIER ::= {id-ce 28 1}
var Id_ce_a_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-certificateIssuer                  OBJECT IDENTIFIER ::= {id-ce 29 1}
var Id_ce_a_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-nameConstraints                    OBJECT IDENTIFIER ::= {id-ce 30 1}
var Id_ce_a_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-cRLDistributionPoints              OBJECT IDENTIFIER ::= {id-ce 31 1}
var Id_ce_a_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-certificatePolicies                OBJECT IDENTIFIER ::= {id-ce 32 1}
var Id_ce_a_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-policyMappings                     OBJECT IDENTIFIER ::= {id-ce 33 1}
var Id_ce_a_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-authorityKeyIdentifier             OBJECT IDENTIFIER ::= {id-ce 35 1}
var Id_ce_a_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-policyConstraints                  OBJECT IDENTIFIER ::= {id-ce 36 1}
var Id_ce_a_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-extKeyUsage                        OBJECT IDENTIFIER ::= {id-ce 37 1}
var Id_ce_a_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-authorityAttributeIdentifier       OBJECT IDENTIFIER ::= {id-ce 38 1}
var Id_ce_a_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-roleSpecCertIdentifier             OBJECT IDENTIFIER ::= {id-ce 39 1}
var Id_ce_a_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-cRLStreamIdentifier                OBJECT IDENTIFIER ::= {id-ce 40 1}
var Id_ce_a_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-basicAttConstraints                OBJECT IDENTIFIER ::= {id-ce 41 1}
var Id_ce_a_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-delegatedNameConstraints           OBJECT IDENTIFIER ::= {id-ce 42 1}
var Id_ce_a_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-timeSpecification                  OBJECT IDENTIFIER ::= {id-ce 43 1}
var Id_ce_a_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-cRLScope                           OBJECT IDENTIFIER ::= {id-ce 44 1}
var Id_ce_a_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-statusReferrals                    OBJECT IDENTIFIER ::= {id-ce 45 1}
var Id_ce_a_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-freshestCRL                        OBJECT IDENTIFIER ::= {id-ce 46 1}
var Id_ce_a_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-orderedList                        OBJECT IDENTIFIER ::= {id-ce 47 1}
var Id_ce_a_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-attributeDescriptor                OBJECT IDENTIFIER ::= {id-ce 48 1}
var Id_ce_a_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-userNotice                         OBJECT IDENTIFIER ::= {id-ce 49 1}
var Id_ce_a_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-sOAIdentifier                      OBJECT IDENTIFIER ::= {id-ce 50 1}
var Id_ce_a_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-baseUpdateTime                     OBJECT IDENTIFIER ::= {id-ce 51 1}
var Id_ce_a_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-acceptableCertPolicies             OBJECT IDENTIFIER ::= {id-ce 52 1}
var Id_ce_a_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-deltaInfo                          OBJECT IDENTIFIER ::= {id-ce 53 1}
var Id_ce_a_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-inhibitAnyPolicy                   OBJECT IDENTIFIER ::= {id-ce 54 1}
var Id_ce_a_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-targetingInformation               OBJECT IDENTIFIER ::= {id-ce 55 1}
var Id_ce_a_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-noRevAvail                         OBJECT IDENTIFIER ::= {id-ce 56 1}
var Id_ce_a_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-acceptablePrivilegePolicies        OBJECT IDENTIFIER ::= {id-ce 57 1}
var Id_ce_a_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-toBeRevoked                        OBJECT IDENTIFIER ::= {id-ce 58 1}
var Id_ce_a_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-revokedGroups                      OBJECT IDENTIFIER ::= {id-ce 59 1}
var Id_ce_a_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-expiredCertsOnCRL                  OBJECT IDENTIFIER ::= {id-ce 60 1}
var Id_ce_a_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-indirectIssuer                     OBJECT IDENTIFIER ::= {id-ce 61 1}
var Id_ce_a_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-noAssertion                        OBJECT IDENTIFIER ::= {id-ce 62 1}
var Id_ce_a_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-aAissuingDistributionPoint         OBJECT IDENTIFIER ::= {id-ce 63 1}
var Id_ce_a_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-issuedOnBehalfOf                   OBJECT IDENTIFIER ::= {id-ce 64 1}
var Id_ce_a_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-singleUse                          OBJECT IDENTIFIER ::= {id-ce 65 1}
var Id_ce_a_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-groupAC                            OBJECT IDENTIFIER ::= {id-ce 66 1}
var Id_ce_a_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-allowedAttributeAssignments        OBJECT IDENTIFIER ::= {id-ce 67 1}
var Id_ce_a_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-attributeMappings                  OBJECT IDENTIFIER ::= {id-ce 68 1}
var Id_ce_a_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-holderNameConstraints              OBJECT IDENTIFIER ::= {id-ce 69 1}
var Id_ce_a_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-authorizationValidation            OBJECT IDENTIFIER ::= {id-ce 70 1}
var Id_ce_a_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-protRestrict                       OBJECT IDENTIFIER ::= {id-ce 71 1}
var Id_ce_a_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-subjectAltPublicKeyInfo            OBJECT IDENTIFIER ::= {id-ce 72 1}
var Id_ce_a_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-altSignatureAlgorithm              OBJECT IDENTIFIER ::= {id-ce 73 1}
var Id_ce_a_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ce-a-altSignatureValue                  OBJECT IDENTIFIER ::= {id-ce 74 1}
var Id_ce_a_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-subjectDirectoryAttributes          OBJECT IDENTIFIER ::= {id-ce 9 2}
var Id_asx_subjectDirectoryAttributes asn1.ObjectIdentifier = []int{2, 5, 29, 9, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-subjectKeyIdentifier                OBJECT IDENTIFIER ::= {id-ce 14 2}
var Id_asx_subjectKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 14, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-keyUsage                            OBJECT IDENTIFIER ::= {id-ce 15 2}
var Id_asx_keyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 15, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-privateKeyUsagePeriod               OBJECT IDENTIFIER ::= {id-ce 16 2}
var Id_asx_privateKeyUsagePeriod asn1.ObjectIdentifier = []int{2, 5, 29, 16, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-subjectAltName                      OBJECT IDENTIFIER ::= {id-ce 17 2}
var Id_asx_subjectAltName asn1.ObjectIdentifier = []int{2, 5, 29, 17, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-issuerAltName                       OBJECT IDENTIFIER ::= {id-ce 18 2}
var Id_asx_issuerAltName asn1.ObjectIdentifier = []int{2, 5, 29, 18, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-basicConstraints                    OBJECT IDENTIFIER ::= {id-ce 19 2}
var Id_asx_basicConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 19, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-cRLNumber                           OBJECT IDENTIFIER ::= {id-ce 20 2}
var Id_asx_cRLNumber asn1.ObjectIdentifier = []int{2, 5, 29, 20, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-reasonCode                          OBJECT IDENTIFIER ::= {id-ce 21 2}
var Id_asx_reasonCode asn1.ObjectIdentifier = []int{2, 5, 29, 21, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-holdInstructionCode                 OBJECT IDENTIFIER ::= {id-ce 23 2}
var Id_asx_holdInstructionCode asn1.ObjectIdentifier = []int{2, 5, 29, 23, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-invalidityDate                      OBJECT IDENTIFIER ::= {id-ce 24 2}
var Id_asx_invalidityDate asn1.ObjectIdentifier = []int{2, 5, 29, 24, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-deltaCRLIndicator                   OBJECT IDENTIFIER ::= {id-ce 27 2}
var Id_asx_deltaCRLIndicator asn1.ObjectIdentifier = []int{2, 5, 29, 27, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-issuingDistributionPoint            OBJECT IDENTIFIER ::= {id-ce 28 2}
var Id_asx_issuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 28, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-certificateIssuer                   OBJECT IDENTIFIER ::= {id-ce 29 2}
var Id_asx_certificateIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 29, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-nameConstraints                     OBJECT IDENTIFIER ::= {id-ce 30 2}
var Id_asx_nameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 30, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-cRLDistributionPoints               OBJECT IDENTIFIER ::= {id-ce 31 2}
var Id_asx_cRLDistributionPoints asn1.ObjectIdentifier = []int{2, 5, 29, 31, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-certificatePolicies                 OBJECT IDENTIFIER ::= {id-ce 32 2}
var Id_asx_certificatePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 32, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-policyMappings                      OBJECT IDENTIFIER ::= {id-ce 33 2}
var Id_asx_policyMappings asn1.ObjectIdentifier = []int{2, 5, 29, 33, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-authorityKeyIdentifier              OBJECT IDENTIFIER ::= {id-ce 35 2}
var Id_asx_authorityKeyIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 35, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-policyConstraints                   OBJECT IDENTIFIER ::= {id-ce 36 2}
var Id_asx_policyConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 36, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-extKeyUsage                         OBJECT IDENTIFIER ::= {id-ce 37 2}
var Id_asx_extKeyUsage asn1.ObjectIdentifier = []int{2, 5, 29, 37, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-authorityAttributeIdentifier        OBJECT IDENTIFIER ::= {id-ce 38 2}
var Id_asx_authorityAttributeIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 38, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-roleSpecCertIdentifier              OBJECT IDENTIFIER ::= {id-ce 39 2}
var Id_asx_roleSpecCertIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 39, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-cRLStreamIdentifier                 OBJECT IDENTIFIER ::= {id-ce 40 2}
var Id_asx_cRLStreamIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 40, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-basicAttConstraints                 OBJECT IDENTIFIER ::= {id-ce 41 2}
var Id_asx_basicAttConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 41, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-delegatedNameConstraints            OBJECT IDENTIFIER ::= {id-ce 42 2}
var Id_asx_delegatedNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 42, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-timeSpecification                   OBJECT IDENTIFIER ::= {id-ce 43 2}
var Id_asx_timeSpecification asn1.ObjectIdentifier = []int{2, 5, 29, 43, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-cRLScope                            OBJECT IDENTIFIER ::= {id-ce 44 2}
var Id_asx_cRLScope asn1.ObjectIdentifier = []int{2, 5, 29, 44, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-statusReferrals                     OBJECT IDENTIFIER ::= {id-ce 45 2}
var Id_asx_statusReferrals asn1.ObjectIdentifier = []int{2, 5, 29, 45, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-freshestCRL                         OBJECT IDENTIFIER ::= {id-ce 46 2}
var Id_asx_freshestCRL asn1.ObjectIdentifier = []int{2, 5, 29, 46, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-orderedList                         OBJECT IDENTIFIER ::= {id-ce 47 2}
var Id_asx_orderedList asn1.ObjectIdentifier = []int{2, 5, 29, 47, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-attributeDescriptor                 OBJECT IDENTIFIER ::= {id-ce 48 2}
var Id_asx_attributeDescriptor asn1.ObjectIdentifier = []int{2, 5, 29, 48, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-userNotice                          OBJECT IDENTIFIER ::= {id-ce 49 2}
var Id_asx_userNotice asn1.ObjectIdentifier = []int{2, 5, 29, 49, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-sOAIdentifier                       OBJECT IDENTIFIER ::= {id-ce 50 2}
var Id_asx_sOAIdentifier asn1.ObjectIdentifier = []int{2, 5, 29, 50, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-baseUpdateTime                      OBJECT IDENTIFIER ::= {id-ce 51 2}
var Id_asx_baseUpdateTime asn1.ObjectIdentifier = []int{2, 5, 29, 51, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-acceptableCertPolicies              OBJECT IDENTIFIER ::= {id-ce 52 2}
var Id_asx_acceptableCertPolicies asn1.ObjectIdentifier = []int{2, 5, 29, 52, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-deltaInfo                           OBJECT IDENTIFIER ::= {id-ce 53 2}
var Id_asx_deltaInfo asn1.ObjectIdentifier = []int{2, 5, 29, 53, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-inhibitAnyPolicy                    OBJECT IDENTIFIER ::= {id-ce 54 2}
var Id_asx_inhibitAnyPolicy asn1.ObjectIdentifier = []int{2, 5, 29, 54, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-targetingInformation                OBJECT IDENTIFIER ::= {id-ce 55 2}
var Id_asx_targetingInformation asn1.ObjectIdentifier = []int{2, 5, 29, 55, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-noRevAvail                          OBJECT IDENTIFIER ::= {id-ce 56 2}
var Id_asx_noRevAvail asn1.ObjectIdentifier = []int{2, 5, 29, 56, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-acceptablePrivilegePolicies         OBJECT IDENTIFIER ::= {id-ce 57 2}
var Id_asx_acceptablePrivilegePolicies asn1.ObjectIdentifier = []int{2, 5, 29, 57, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-toBeRevoked                         OBJECT IDENTIFIER ::= {id-ce 58 2}
var Id_asx_toBeRevoked asn1.ObjectIdentifier = []int{2, 5, 29, 58, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-revokedGroups                       OBJECT IDENTIFIER ::= {id-ce 59 2}
var Id_asx_revokedGroups asn1.ObjectIdentifier = []int{2, 5, 29, 59, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-expiredCertsOnCRL                   OBJECT IDENTIFIER ::= {id-ce 60 2}
var Id_asx_expiredCertsOnCRL asn1.ObjectIdentifier = []int{2, 5, 29, 60, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-indirectIssuer                      OBJECT IDENTIFIER ::= {id-ce 61 2}
var Id_asx_indirectIssuer asn1.ObjectIdentifier = []int{2, 5, 29, 61, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-noAssertion                         OBJECT IDENTIFIER ::= {id-ce 62 2}
var Id_asx_noAssertion asn1.ObjectIdentifier = []int{2, 5, 29, 62, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-aAissuingDistributionPoint          OBJECT IDENTIFIER ::= {id-ce 63 2}
var Id_asx_aAissuingDistributionPoint asn1.ObjectIdentifier = []int{2, 5, 29, 63, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-issuedOnBehalfOf                    OBJECT IDENTIFIER ::= {id-ce 64 2}
var Id_asx_issuedOnBehalfOf asn1.ObjectIdentifier = []int{2, 5, 29, 64, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-singleUse                           OBJECT IDENTIFIER ::= {id-ce 65 2}
var Id_asx_singleUse asn1.ObjectIdentifier = []int{2, 5, 29, 65, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-groupAC                             OBJECT IDENTIFIER ::= {id-ce 66 2}
var Id_asx_groupAC asn1.ObjectIdentifier = []int{2, 5, 29, 66, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-allowedAttributeAssignments         OBJECT IDENTIFIER ::= {id-ce 67 2}
var Id_asx_allowedAttributeAssignments asn1.ObjectIdentifier = []int{2, 5, 29, 67, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-attributeMappings                   OBJECT IDENTIFIER ::= {id-ce 68 2}
var Id_asx_attributeMappings asn1.ObjectIdentifier = []int{2, 5, 29, 68, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-holderNameConstraints               OBJECT IDENTIFIER ::= {id-ce 69 2}
var Id_asx_holderNameConstraints asn1.ObjectIdentifier = []int{2, 5, 29, 69, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-authorizationValidation             OBJECT IDENTIFIER ::= {id-ce 70 2}
var Id_asx_authorizationValidation asn1.ObjectIdentifier = []int{2, 5, 29, 70, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-protRestrict                        OBJECT IDENTIFIER ::= {id-ce 71 2}
var Id_asx_protRestrict asn1.ObjectIdentifier = []int{2, 5, 29, 71, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-subjectAltPublicKeyInfo             OBJECT IDENTIFIER ::= {id-ce 72 2}
var Id_asx_subjectAltPublicKeyInfo asn1.ObjectIdentifier = []int{2, 5, 29, 72, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-altSignatureAlgorithm               OBJECT IDENTIFIER ::= {id-ce 73 2}
var Id_asx_altSignatureAlgorithm asn1.ObjectIdentifier = []int{2, 5, 29, 73, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-asx-altSignatureValue                   OBJECT IDENTIFIER ::= {id-ce 74 2}
var Id_asx_altSignatureValue asn1.ObjectIdentifier = []int{2, 5, 29, 74, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// ExtensionAttribute-value-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ExtensionAttribute_value_Item struct {
	Mandatory bool          `asn1:"optional,explicit,tag:0"`
	Critical  bool          `asn1:"optional,explicit,tag:1"`
	Ext       asn1.RawValue `asn1:"explicit,tag:2"`
}

// # ASN.1 Definition:
//
// extensionSyntax-Type ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ExtensionSyntax_Type struct {
	Mandatory bool          `asn1:"optional,explicit,tag:0"`
	Critical  bool          `asn1:"optional,explicit,tag:1"`
	Ext       asn1.RawValue `asn1:"explicit,tag:2"`
}
