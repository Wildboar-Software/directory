package x500_go

import (
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION Accessors */
// ### ASN.1 Definition:
//
// ```asn1
// Accessors  ::=  SET OF Name
// ```
type Accessors = [](Name) // SetOfType
/* END_OF_SYMBOL_DEFINITION Accessors */ /* START_OF_SYMBOL_DEFINITION AdministrativeRole */
// ### ASN.1 Definition:
//
// ```asn1
// AdministrativeRole  ::=  OBJECT-CLASS.&id
// ```
type AdministrativeRole = asn1.ObjectIdentifier // ObjectClassFieldType
/* END_OF_SYMBOL_DEFINITION AdministrativeRole */ /* START_OF_SYMBOL_DEFINITION ApplicationContext */
// ### ASN.1 Definition:
//
// ```asn1
// ApplicationContext  ::=  OBJECT IDENTIFIER
// ```
// type ApplicationContext = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION ApplicationContext */ /* START_OF_SYMBOL_DEFINITION AssociationEstablishment */
// ### ASN.1 Definition:
//
// ```asn1
// AssociationEstablishment  ::=  BIT STRING {inward(0), outward(1)}
// ```
type AssociationEstablishment = asn1.BitString

/* END_OF_SYMBOL_DEFINITION AssociationEstablishment */

/* START_OF_SYMBOL_DEFINITION AssociationEstablishment_Inward */
const AssociationEstablishment_Inward int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AssociationEstablishment_Inward */

/* START_OF_SYMBOL_DEFINITION AssociationEstablishment_Outward */
const AssociationEstablishment_Outward int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION AssociationEstablishment_Outward */ /* START_OF_SYMBOL_DEFINITION AssociationId */
// ### ASN.1 Definition:
//
// ```asn1
// AssociationId  ::=  INTEGER
// ```
type AssociationId = int64

/* END_OF_SYMBOL_DEFINITION AssociationId */ /* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AuthenReasonSyntax  ::=  INTEGER {
//   unknownUser(0), incorrectPassword(1), inaccessiblePassword(2),
//   passwordVerificationLoop(3), unrecognizedUser(4)}
// ```
type AuthenReasonSyntax = int64

/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax */

/* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax_UnknownUser */
const AuthenReasonSyntax_UnknownUser AuthenReasonSyntax = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax_UnknownUser */

/* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax_IncorrectPassword */
const AuthenReasonSyntax_IncorrectPassword AuthenReasonSyntax = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax_IncorrectPassword */

/* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax_InaccessiblePassword */
const AuthenReasonSyntax_InaccessiblePassword AuthenReasonSyntax = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax_InaccessiblePassword */

/* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax_PasswordVerificationLoop */
const AuthenReasonSyntax_PasswordVerificationLoop AuthenReasonSyntax = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax_PasswordVerificationLoop */

/* START_OF_SYMBOL_DEFINITION AuthenReasonSyntax_UnrecognizedUser */
const AuthenReasonSyntax_UnrecognizedUser AuthenReasonSyntax = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION AuthenReasonSyntax_UnrecognizedUser */ /* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryInformationServiceElement ::= SEQUENCE {
//   operationType
//     BIT STRING {read(0), compare(1), abandon(2), list(3), search(4),
//                 addEntry(5), removeEntry(6), modifyEntry(7), modifyDN(8)}
//       OPTIONAL,
//   attributeType   AttributeType OPTIONAL,
//   attributeValue  [0]  AttributeValue OPTIONAL
// }
// ```
//
//
type DirectoryInformationServiceElement struct {
	OperationType  DirectoryInformationServiceElement_operationType `asn1:"optional"`
	AttributeType  AttributeType                                    `asn1:"optional"`
	AttributeValue AttributeValue                                   `asn1:"optional,explicit,tag:0"`
}

/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement */ /* START_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue */
// ### ASN.1 Definition:
//
// ```asn1
// DSAScopeOfChainingValue  ::=  INTEGER {dmd(0), country(1), global(2)}
// ```
type DSAScopeOfChainingValue = int64

/* END_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Dmd */
const DSAScopeOfChainingValue_Dmd DSAScopeOfChainingValue = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Dmd */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Country */
const DSAScopeOfChainingValue_Country DSAScopeOfChainingValue = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Country */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Global */
const DSAScopeOfChainingValue_Global DSAScopeOfChainingValue = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfChainingValue_Global */ /* START_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue */
// ### ASN.1 Definition:
//
// ```asn1
// DSAScopeOfReferralValue  ::=  INTEGER {dmd(0), country(1), global(2)}
// ```
type DSAScopeOfReferralValue = int64

/* END_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Dmd */
const DSAScopeOfReferralValue_Dmd DSAScopeOfReferralValue = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Dmd */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Country */
const DSAScopeOfReferralValue_Country DSAScopeOfReferralValue = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Country */

/* START_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Global */
const DSAScopeOfReferralValue_Global DSAScopeOfReferralValue = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION DSAScopeOfReferralValue_Global */ /* START_OF_SYMBOL_DEFINITION HOBRole */
// ### ASN.1 Definition:
//
// ```asn1
// HOBRole  ::=  INTEGER {superior(0), subordinate(1)}
// ```
type HOBRole = int64

/* END_OF_SYMBOL_DEFINITION HOBRole */

/* START_OF_SYMBOL_DEFINITION HOBRole_Superior */
const HOBRole_Superior HOBRole = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION HOBRole_Superior */

/* START_OF_SYMBOL_DEFINITION HOBRole_Subordinate */
const HOBRole_Subordinate HOBRole = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION HOBRole_Subordinate */ /* START_OF_SYMBOL_DEFINITION MgtBitString */
// ### ASN.1 Definition:
//
// ```asn1
// MgtBitString  ::=  BIT STRING
// ```
type MgtBitString = asn1.BitString

/* END_OF_SYMBOL_DEFINITION MgtBitString */ /* START_OF_SYMBOL_DEFINITION MgtBoolean */
// ### ASN.1 Definition:
//
// ```asn1
// MgtBoolean  ::=  BOOLEAN
// ```
type MgtBoolean = bool // BooleanType
/* END_OF_SYMBOL_DEFINITION MgtBoolean */ /* START_OF_SYMBOL_DEFINITION MgtCommonName */
// ### ASN.1 Definition:
//
// ```asn1
// MgtCommonName  ::=  UnboundedDirectoryString
// ```
type MgtCommonName = UnboundedDirectoryString // DefinedType
/* END_OF_SYMBOL_DEFINITION MgtCommonName */ /* START_OF_SYMBOL_DEFINITION MgtGeneralizedTime */
// ### ASN.1 Definition:
//
// ```asn1
// MgtGeneralizedTime  ::=  GeneralizedTime
// ```
type MgtGeneralizedTime = time.Time // GeneralizedTime
/* END_OF_SYMBOL_DEFINITION MgtGeneralizedTime */ /* START_OF_SYMBOL_DEFINITION MgtInteger */
// ### ASN.1 Definition:
//
// ```asn1
// MgtInteger  ::=  INTEGER
// ```
type MgtInteger = int64

/* END_OF_SYMBOL_DEFINITION MgtInteger */ /* START_OF_SYMBOL_DEFINITION MgtName */
// ### ASN.1 Definition:
//
// ```asn1
// MgtName  ::=  Name
// ```
type MgtName = Name // DefinedType
/* END_OF_SYMBOL_DEFINITION MgtName */ /* START_OF_SYMBOL_DEFINITION MgtOctetString */
// ### ASN.1 Definition:
//
// ```asn1
// MgtOctetString  ::=  OCTET STRING
// ```
type MgtOctetString = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION MgtOctetString */ /* START_OF_SYMBOL_DEFINITION MgtOID */
// ### ASN.1 Definition:
//
// ```asn1
// MgtOID  ::=  OBJECT IDENTIFIER
// ```
type MgtOID = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION MgtOID */ /* START_OF_SYMBOL_DEFINITION MgtPrintableString */
// ### ASN.1 Definition:
//
// ```asn1
// MgtPrintableString  ::=  PrintableString
// ```
type MgtPrintableString = string // PrintableString
/* END_OF_SYMBOL_DEFINITION MgtPrintableString */ /* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// PeerEntityAuthenticationPolicy  ::=  BIT STRING {
//   none(0), nameOnly(1), simpleUnprotected(2), simpleProtected(3), strong(4),
//   external(5)}
// ```
type PeerEntityAuthenticationPolicy = asn1.BitString

/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_None */
const PeerEntityAuthenticationPolicy_None int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_None */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_NameOnly */
const PeerEntityAuthenticationPolicy_NameOnly int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_NameOnly */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_SimpleUnprotected */
const PeerEntityAuthenticationPolicy_SimpleUnprotected int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_SimpleUnprotected */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_SimpleProtected */
const PeerEntityAuthenticationPolicy_SimpleProtected int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_SimpleProtected */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_Strong */
const PeerEntityAuthenticationPolicy_Strong int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_Strong */

/* START_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_External */
const PeerEntityAuthenticationPolicy_External int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION PeerEntityAuthenticationPolicy_External */ /* START_OF_SYMBOL_DEFINITION RemoteDSAList */
// ### ASN.1 Definition:
//
// ```asn1
// RemoteDSAList  ::=  SET OF AccessPoint
// ```
type RemoteDSAList = [](AccessPoint) // SetOfType
/* END_OF_SYMBOL_DEFINITION RemoteDSAList */ /* START_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// RequestAuthenticationPolicy  ::=  BIT STRING {none(0), simpleName(1), strong(2)}
// ```
type RequestAuthenticationPolicy = asn1.BitString

/* END_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy */

/* START_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_None */
const RequestAuthenticationPolicy_None int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_None */

/* START_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_SimpleName */
const RequestAuthenticationPolicy_SimpleName int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_SimpleName */

/* START_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_Strong */
const RequestAuthenticationPolicy_Strong int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION RequestAuthenticationPolicy_Strong */ /* START_OF_SYMBOL_DEFINITION ResourceSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// ResourceSyntax  ::=  INTEGER {
//   insufficientMemory(0), insufficientAssociations(1), insufficientDiskSpace(2),
//   miscellaneousResourceExhausted(4)}
// ```
type ResourceSyntax = int64

/* END_OF_SYMBOL_DEFINITION ResourceSyntax */

/* START_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientMemory */
const ResourceSyntax_InsufficientMemory ResourceSyntax = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientMemory */

/* START_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientAssociations */
const ResourceSyntax_InsufficientAssociations ResourceSyntax = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientAssociations */

/* START_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientDiskSpace */
const ResourceSyntax_InsufficientDiskSpace ResourceSyntax = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ResourceSyntax_InsufficientDiskSpace */

/* START_OF_SYMBOL_DEFINITION ResourceSyntax_MiscellaneousResourceExhausted */
const ResourceSyntax_MiscellaneousResourceExhausted ResourceSyntax = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ResourceSyntax_MiscellaneousResourceExhausted */ /* START_OF_SYMBOL_DEFINITION ResultAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// ResultAuthenticationPolicy  ::=  RequestAuthenticationPolicy
// ```
type ResultAuthenticationPolicy = RequestAuthenticationPolicy // DefinedType
/* END_OF_SYMBOL_DEFINITION ResultAuthenticationPolicy */ /* START_OF_SYMBOL_DEFINITION SecondaryShadows */
// ### ASN.1 Definition:
//
// ```asn1
// SecondaryShadows  ::=  SET OF SupplierAndConsumers
// ```
type SecondaryShadows = [](SupplierAndConsumers) // SetOfType
/* END_OF_SYMBOL_DEFINITION SecondaryShadows */ /* START_OF_SYMBOL_DEFINITION ShadowingRole */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowingRole  ::=  INTEGER {supplier(0), consumer(1)}
// ```
type ShadowingRole = int64

/* END_OF_SYMBOL_DEFINITION ShadowingRole */

/* START_OF_SYMBOL_DEFINITION ShadowingRole_Supplier */
const ShadowingRole_Supplier ShadowingRole = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowingRole_Supplier */

/* START_OF_SYMBOL_DEFINITION ShadowingRole_Consumer */
const ShadowingRole_Consumer ShadowingRole = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION ShadowingRole_Consumer */ /* START_OF_SYMBOL_DEFINITION SubSchemaSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// SubSchemaSyntax  ::=
//   SEQUENCE OF
//     SEQUENCE {name       [1]  Name, --  Name of the subschema subentry for the subschema
//               subSchema
//                 [2]  SEQUENCE {structureRules
//                                  [1]  SEQUENCE OF DITStructureRuleDescription
//                                    OPTIONAL,
//                                contentRules
//                                  [2]  SEQUENCE OF DITContentRuleDescription
//                                    OPTIONAL,
//                                matchingRules
//                                  [3]  SEQUENCE OF MatchingRuleDescription
//                                    OPTIONAL,
//                                attributeTypes
//                                  [4]  SEQUENCE OF AttributeTypeDescription
//                                    OPTIONAL,
//                                objectClasses
//                                  [5]  SEQUENCE OF ObjectClassDescription
//                                    OPTIONAL,
//                                nameForms
//                                  [6]  SEQUENCE OF NameFormDescription OPTIONAL,
//                                matchRuleUses
//                                  [7]  SEQUENCE OF MatchingRuleUseDescription
//                                    OPTIONAL}}
// ```
type SubSchemaSyntax = [](SubSchemaSyntax_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SubSchemaSyntax */ /* START_OF_SYMBOL_DEFINITION SupportedApplicationContexts */
// ### ASN.1 Definition:
//
// ```asn1
// SupportedApplicationContexts  ::=  SET OF OBJECT IDENTIFIER
// ```
type SupportedApplicationContexts = [](asn1.ObjectIdentifier) // SetOfType
/* END_OF_SYMBOL_DEFINITION SupportedApplicationContexts */ /* START_OF_SYMBOL_DEFINITION Zero */
// ### ASN.1 Definition:
//
// ```asn1
// zero INTEGER ::= 0
// ```
//
//
const Zero int = 0

/* END_OF_SYMBOL_DEFINITION Zero */ /* START_OF_SYMBOL_DEFINITION Id_mac */
// ### ASN.1 Definition:
//
// ```asn1
// id-mac OBJECT IDENTIFIER ::= {id-mgt 0}
// ```
//
//
var Id_mac asn1.ObjectIdentifier = []int{2, 5, 30, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mac */ /* START_OF_SYMBOL_DEFINITION Id_mat */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat OBJECT IDENTIFIER ::= {id-mgt 1}
// ```
//
//
var Id_mat asn1.ObjectIdentifier = []int{2, 5, 30, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat */ /* START_OF_SYMBOL_DEFINITION Id_moc */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc OBJECT IDENTIFIER ::= {id-mgt 2}
// ```
//
//
var Id_moc asn1.ObjectIdentifier = []int{2, 5, 30, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc */ /* START_OF_SYMBOL_DEFINITION Id_mnb */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb OBJECT IDENTIFIER ::= {id-mgt 3}
// ```
//
//
var Id_mnb asn1.ObjectIdentifier = []int{2, 5, 30, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb */ /* START_OF_SYMBOL_DEFINITION Id_mp */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp OBJECT IDENTIFIER ::= {id-mgt 4}
// ```
//
//
var Id_mp asn1.ObjectIdentifier = []int{2, 5, 30, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp */ /* START_OF_SYMBOL_DEFINITION Id_mpa */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa OBJECT IDENTIFIER ::= {id-mgt 5}
// ```
//
//
var Id_mpa asn1.ObjectIdentifier = []int{2, 5, 30, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa */ /* START_OF_SYMBOL_DEFINITION Id_mac_useRemoteDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mac-useRemoteDSA OBJECT IDENTIFIER ::= {id-mac 0}
// ```
//
//
var Id_mac_useRemoteDSA asn1.ObjectIdentifier = []int{2, 5, 30, 0, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mac_useRemoteDSA */ /* START_OF_SYMBOL_DEFINITION Id_mac_useHomeDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mac-useHomeDSA OBJECT IDENTIFIER ::= {id-mac 1}
// ```
//
//
var Id_mac_useHomeDSA asn1.ObjectIdentifier = []int{2, 5, 30, 0, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mac_useHomeDSA */ /* START_OF_SYMBOL_DEFINITION Id_mac_update */
// ### ASN.1 Definition:
//
// ```asn1
// id-mac-update OBJECT IDENTIFIER ::= {id-mac 2}
// ```
//
//
var Id_mac_update asn1.ObjectIdentifier = []int{2, 5, 30, 0, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mac_update */ /* START_OF_SYMBOL_DEFINITION Id_mat_accessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accessPoint OBJECT IDENTIFIER ::= {id-mat 0}
// ```
//
//
var Id_mat_accessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accessPoint */ /* START_OF_SYMBOL_DEFINITION Id_mat_masterEntries */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-masterEntries OBJECT IDENTIFIER ::= {id-mat 1}
// ```
//
//
var Id_mat_masterEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_masterEntries */ /* START_OF_SYMBOL_DEFINITION Id_mat_copyEntries */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-copyEntries OBJECT IDENTIFIER ::= {id-mat 2}
// ```
//
//
var Id_mat_copyEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_copyEntries */ /* START_OF_SYMBOL_DEFINITION Id_mat_loopsDetected */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-loopsDetected OBJECT IDENTIFIER ::= {id-mat 3}
// ```
//
//
var Id_mat_loopsDetected asn1.ObjectIdentifier = []int{2, 5, 30, 1, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_loopsDetected */ /* START_OF_SYMBOL_DEFINITION Id_mat_securityErrors */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-securityErrors OBJECT IDENTIFIER ::= {id-mat 4}
// ```
//
//
var Id_mat_securityErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_securityErrors */ /* START_OF_SYMBOL_DEFINITION Id_mat_nameErrors */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-nameErrors OBJECT IDENTIFIER ::= {id-mat 5}
// ```
//
//
var Id_mat_nameErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_nameErrors */ /* START_OF_SYMBOL_DEFINITION Id_mat_foundLocalEntries */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-foundLocalEntries OBJECT IDENTIFIER ::= {id-mat 6}
// ```
//
//
var Id_mat_foundLocalEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_foundLocalEntries */ /* START_OF_SYMBOL_DEFINITION Id_mat_referrals */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-referrals OBJECT IDENTIFIER ::= {id-mat 7}
// ```
//
//
var Id_mat_referrals asn1.ObjectIdentifier = []int{2, 5, 30, 1, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_referrals */ /* START_OF_SYMBOL_DEFINITION Id_mat_serviceErrors */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-serviceErrors OBJECT IDENTIFIER ::= {id-mat 8}
// ```
//
//
var Id_mat_serviceErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_serviceErrors */ /* START_OF_SYMBOL_DEFINITION Id_mat_aliasDereferences */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-aliasDereferences OBJECT IDENTIFIER ::= {id-mat 9}
// ```
//
//
var Id_mat_aliasDereferences asn1.ObjectIdentifier = []int{2, 5, 30, 1, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_aliasDereferences */ /* START_OF_SYMBOL_DEFINITION Id_mat_chainings */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chainings OBJECT IDENTIFIER ::= {id-mat 10}
// ```
//
//
var Id_mat_chainings asn1.ObjectIdentifier = []int{2, 5, 30, 1, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chainings */ /* START_OF_SYMBOL_DEFINITION Id_mat_invalidReferences */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-invalidReferences OBJECT IDENTIFIER ::= {id-mat 11}
// ```
//
//
var Id_mat_invalidReferences asn1.ObjectIdentifier = []int{2, 5, 30, 1, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_invalidReferences */ /* START_OF_SYMBOL_DEFINITION Id_mat_unableToProceed */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-unableToProceed OBJECT IDENTIFIER ::= {id-mat 12}
// ```
//
//
var Id_mat_unableToProceed asn1.ObjectIdentifier = []int{2, 5, 30, 1, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_unableToProceed */ /* START_OF_SYMBOL_DEFINITION Id_mat_outOfScope */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-outOfScope OBJECT IDENTIFIER ::= {id-mat 13}
// ```
//
//
var Id_mat_outOfScope asn1.ObjectIdentifier = []int{2, 5, 30, 1, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_outOfScope */ /* START_OF_SYMBOL_DEFINITION Id_mat_noSuchObject */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-noSuchObject OBJECT IDENTIFIER ::= {id-mat 14}
// ```
//
//
var Id_mat_noSuchObject asn1.ObjectIdentifier = []int{2, 5, 30, 1, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_noSuchObject */ /* START_OF_SYMBOL_DEFINITION Id_mat_aliasProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-aliasProblem OBJECT IDENTIFIER ::= {id-mat 15}
// ```
//
//
var Id_mat_aliasProblem asn1.ObjectIdentifier = []int{2, 5, 30, 1, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_aliasProblem */ /* START_OF_SYMBOL_DEFINITION Id_mat_aliasDereferencingProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-aliasDereferencingProblem OBJECT IDENTIFIER ::= {id-mat 16}
// ```
//
//
var Id_mat_aliasDereferencingProblem asn1.ObjectIdentifier = []int{2, 5, 30, 1, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_aliasDereferencingProblem */ /* START_OF_SYMBOL_DEFINITION Id_mat_affectsMultipleDSAs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-affectsMultipleDSAs OBJECT IDENTIFIER ::= {id-mat 17}
// ```
//
//
var Id_mat_affectsMultipleDSAs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_affectsMultipleDSAs */ /* START_OF_SYMBOL_DEFINITION Id_mat_unavailableCriticalExtension */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-unavailableCriticalExtension OBJECT IDENTIFIER ::= {id-mat 18}
// ```
//
//
var Id_mat_unavailableCriticalExtension asn1.ObjectIdentifier = []int{2, 5, 30, 1, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_unavailableCriticalExtension */ /* START_OF_SYMBOL_DEFINITION Id_mat_timeLimitExceeded */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-timeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 19}
// ```
//
//
var Id_mat_timeLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_timeLimitExceeded */ /* START_OF_SYMBOL_DEFINITION Id_mat_sizeLimitExceeded */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-sizeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 20}
// ```
//
//
var Id_mat_sizeLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_sizeLimitExceeded */ /* START_OF_SYMBOL_DEFINITION Id_mat_adminLimitExceeded */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-adminLimitExceeded OBJECT IDENTIFIER ::= {id-mat 21}
// ```
//
//
var Id_mat_adminLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_adminLimitExceeded */ /* START_OF_SYMBOL_DEFINITION Id_mat_prohibitChaining */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-prohibitChaining OBJECT IDENTIFIER ::= {id-mat 24}
// ```
//
//
var Id_mat_prohibitChaining asn1.ObjectIdentifier = []int{2, 5, 30, 1, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_prohibitChaining */ /* START_OF_SYMBOL_DEFINITION Id_mat_readOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-readOpsProc OBJECT IDENTIFIER ::= {id-mat 25}
// ```
//
//
var Id_mat_readOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_readOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_compareOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-compareOpsProc OBJECT IDENTIFIER ::= {id-mat 26}
// ```
//
//
var Id_mat_compareOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_compareOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_abandonOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-abandonOpsProc OBJECT IDENTIFIER ::= {id-mat 27}
// ```
//
//
var Id_mat_abandonOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_abandonOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_listOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-listOpsProc OBJECT IDENTIFIER ::= {id-mat 28}
// ```
//
//
var Id_mat_listOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_listOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_searchBaseOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-searchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 29}
// ```
//
//
var Id_mat_searchBaseOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_searchBaseOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_search1LevelOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-search1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 30}
// ```
//
//
var Id_mat_search1LevelOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_search1LevelOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_searchSubtreeOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-searchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 31}
// ```
//
//
var Id_mat_searchSubtreeOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_searchSubtreeOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_addEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-addEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 32}
// ```
//
//
var Id_mat_addEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_addEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_removeEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-removeEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 33}
// ```
//
//
var Id_mat_removeEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_removeEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_modifyEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-modifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 34}
// ```
//
//
var Id_mat_modifyEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_modifyEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_modifyDNOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-modifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 35}
// ```
//
//
var Id_mat_modifyDNOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_modifyDNOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chReadOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chReadOpsProc OBJECT IDENTIFIER ::= {id-mat 36}
// ```
//
//
var Id_mat_chReadOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chReadOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chCompareOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chCompareOpsProc OBJECT IDENTIFIER ::= {id-mat 37}
// ```
//
//
var Id_mat_chCompareOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chCompareOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chAbandonOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chAbandonOpsProc OBJECT IDENTIFIER ::= {id-mat 38}
// ```
//
//
var Id_mat_chAbandonOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chAbandonOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chListOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chListOpsProc OBJECT IDENTIFIER ::= {id-mat 39}
// ```
//
//
var Id_mat_chListOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chListOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chSearchBaseOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chSearchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 40}
// ```
//
//
var Id_mat_chSearchBaseOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chSearchBaseOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chSearch1LevelOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chSearch1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 41}
// ```
//
//
var Id_mat_chSearch1LevelOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chSearch1LevelOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chSearchSubtreeOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chSearchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 42}
// ```
//
//
var Id_mat_chSearchSubtreeOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chSearchSubtreeOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chAddEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chAddEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 43}
// ```
//
//
var Id_mat_chAddEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 43} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chAddEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chRemoveEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chRemoveEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 44}
// ```
//
//
var Id_mat_chRemoveEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 44} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chRemoveEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chModifyEntryOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chModifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 45}
// ```
//
//
var Id_mat_chModifyEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chModifyEntryOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_chModifyDNOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-chModifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 46}
// ```
//
//
var Id_mat_chModifyDNOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 46} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_chModifyDNOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_dSAScopeOfReferral */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dSAScopeOfReferral OBJECT IDENTIFIER ::= {id-mat 47}
// ```
//
//
var Id_mat_dSAScopeOfReferral asn1.ObjectIdentifier = []int{2, 5, 30, 1, 47} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dSAScopeOfReferral */ /* START_OF_SYMBOL_DEFINITION Id_mat_dSAScopeOfChaining */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dSAScopeOfChaining OBJECT IDENTIFIER ::= {id-mat 48}
// ```
//
//
var Id_mat_dSAScopeOfChaining asn1.ObjectIdentifier = []int{2, 5, 30, 1, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dSAScopeOfChaining */ /* START_OF_SYMBOL_DEFINITION Id_mat_peerEntityAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-peerEntityAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 49}
// ```
//
//
var Id_mat_peerEntityAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 49} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_peerEntityAuthenticationPolicy */ /* START_OF_SYMBOL_DEFINITION Id_mat_requestAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-requestAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 50}
// ```
//
//
var Id_mat_requestAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 50} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_requestAuthenticationPolicy */ /* START_OF_SYMBOL_DEFINITION Id_mat_resultAuthenticationPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-resultAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 51}
// ```
//
//
var Id_mat_resultAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 51} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_resultAuthenticationPolicy */ /* START_OF_SYMBOL_DEFINITION Id_mat_dSPAssociationEstablishment */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dSPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 52}
// ```
//
//
var Id_mat_dSPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 52} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dSPAssociationEstablishment */ /* START_OF_SYMBOL_DEFINITION Id_mat_dOPAssociationEstablishment */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dOPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 53}
// ```
//
//
var Id_mat_dOPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 53} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dOPAssociationEstablishment */ /* START_OF_SYMBOL_DEFINITION Id_mat_dISPAssociationEstablishment */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dISPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 54}
// ```
//
//
var Id_mat_dISPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 54} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dISPAssociationEstablishment */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxDAPAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxDAPAssociations OBJECT IDENTIFIER ::= {id-mat 55}
// ```
//
//
var Id_mat_maxDAPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 55} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxDAPAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxDSPAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxDSPAssociations OBJECT IDENTIFIER ::= {id-mat 56}
// ```
//
//
var Id_mat_maxDSPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 56} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxDSPAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxDOPAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxDOPAssociations OBJECT IDENTIFIER ::= {id-mat 57}
// ```
//
//
var Id_mat_maxDOPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 57} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxDOPAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxDISPAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxDISPAssociations OBJECT IDENTIFIER ::= {id-mat 58}
// ```
//
//
var Id_mat_maxDISPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 58} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxDISPAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_dAPAssociationTimeout */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dAPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 59}
// ```
//
//
var Id_mat_dAPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 59} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dAPAssociationTimeout */ /* START_OF_SYMBOL_DEFINITION Id_mat_dSPAssociationTimeout */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dSPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 60}
// ```
//
//
var Id_mat_dSPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 60} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dSPAssociationTimeout */ /* START_OF_SYMBOL_DEFINITION Id_mat_dOPAssociationTimeout */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dOPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 61}
// ```
//
//
var Id_mat_dOPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 61} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dOPAssociationTimeout */ /* START_OF_SYMBOL_DEFINITION Id_mat_dISPAssociationTimeout */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dISPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 62}
// ```
//
//
var Id_mat_dISPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 62} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dISPAssociationTimeout */ /* START_OF_SYMBOL_DEFINITION Id_mat_dSAActiveAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dSAActiveAssociations OBJECT IDENTIFIER ::= {id-mat 63}
// ```
//
//
var Id_mat_dSAActiveAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 63} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dSAActiveAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_pagedResultsMaxIDs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-pagedResultsMaxIDs OBJECT IDENTIFIER ::= {id-mat 64}
// ```
//
//
var Id_mat_pagedResultsMaxIDs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 64} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_pagedResultsMaxIDs */ /* START_OF_SYMBOL_DEFINITION Id_mat_pagedResultsTimer */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-pagedResultsTimer OBJECT IDENTIFIER ::= {id-mat 65}
// ```
//
//
var Id_mat_pagedResultsTimer asn1.ObjectIdentifier = []int{2, 5, 30, 1, 65} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_pagedResultsTimer */ /* START_OF_SYMBOL_DEFINITION Id_mat_homeDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-homeDSA OBJECT IDENTIFIER ::= {id-mat 66}
// ```
//
//
var Id_mat_homeDSA asn1.ObjectIdentifier = []int{2, 5, 30, 1, 66} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_homeDSA */ /* START_OF_SYMBOL_DEFINITION Id_mat_dUATimeout */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dUATimeout OBJECT IDENTIFIER ::= {id-mat 68}
// ```
//
//
var Id_mat_dUATimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 68} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dUATimeout */ /* START_OF_SYMBOL_DEFINITION Id_mat_supportedApplicationContexts */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-supportedApplicationContexts OBJECT IDENTIFIER ::= {id-mat 69}
// ```
//
//
var Id_mat_supportedApplicationContexts asn1.ObjectIdentifier = []int{2, 5, 30, 1, 69} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_supportedApplicationContexts */ /* START_OF_SYMBOL_DEFINITION Id_mat_reverseCredentials */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-reverseCredentials OBJECT IDENTIFIER ::= {id-mat 70}
// ```
//
//
var Id_mat_reverseCredentials asn1.ObjectIdentifier = []int{2, 5, 30, 1, 70} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_reverseCredentials */ /* START_OF_SYMBOL_DEFINITION Id_mat_remoteAccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-remoteAccessPoint OBJECT IDENTIFIER ::= {id-mat 71}
// ```
//
//
var Id_mat_remoteAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 71} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_remoteAccessPoint */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxInboundAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxInboundAssociations OBJECT IDENTIFIER ::= {id-mat 72}
// ```
//
//
var Id_mat_maxInboundAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 72} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxInboundAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxOutboundAssociations */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxOutboundAssociations OBJECT IDENTIFIER ::= {id-mat 73}
// ```
//
//
var Id_mat_maxOutboundAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 73} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxOutboundAssociations */ /* START_OF_SYMBOL_DEFINITION Id_mat_currentActiveAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-currentActiveAssocs OBJECT IDENTIFIER ::= {id-mat 74}
// ```
//
//
var Id_mat_currentActiveAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 74} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_currentActiveAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_currentActiveInboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-currentActiveInboundAssocs OBJECT IDENTIFIER ::= {id-mat 75}
// ```
//
//
var Id_mat_currentActiveInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 75} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_currentActiveInboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_currentActiveOutboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-currentActiveOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 76}
// ```
//
//
var Id_mat_currentActiveOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 76} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_currentActiveOutboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_accumAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accumAssocs OBJECT IDENTIFIER ::= {id-mat 77}
// ```
//
//
var Id_mat_accumAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 77} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accumAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_accumInboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accumInboundAssocs OBJECT IDENTIFIER ::= {id-mat 78}
// ```
//
//
var Id_mat_accumInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 78} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accumInboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_accumOutboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accumOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 79}
// ```
//
//
var Id_mat_accumOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 79} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accumOutboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_accumFailedInboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accumFailedInboundAssocs OBJECT IDENTIFIER ::= {id-mat 80}
// ```
//
//
var Id_mat_accumFailedInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 80} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accumFailedInboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_accumFailedOutboundAssocs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accumFailedOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 81}
// ```
//
//
var Id_mat_accumFailedOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 81} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accumFailedOutboundAssocs */ /* START_OF_SYMBOL_DEFINITION Id_mat_timeOfLastAttempt */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-timeOfLastAttempt OBJECT IDENTIFIER ::= {id-mat 82}
// ```
//
//
var Id_mat_timeOfLastAttempt asn1.ObjectIdentifier = []int{2, 5, 30, 1, 82} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_timeOfLastAttempt */ /* START_OF_SYMBOL_DEFINITION Id_mat_timeOfLastSuccess */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-timeOfLastSuccess OBJECT IDENTIFIER ::= {id-mat 83}
// ```
//
//
var Id_mat_timeOfLastSuccess asn1.ObjectIdentifier = []int{2, 5, 30, 1, 83} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_timeOfLastSuccess */ /* START_OF_SYMBOL_DEFINITION Id_mat_requestCounter */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-requestCounter OBJECT IDENTIFIER ::= {id-mat 84}
// ```
//
//
var Id_mat_requestCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 84} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_requestCounter */ /* START_OF_SYMBOL_DEFINITION Id_mat_replyCounter */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-replyCounter OBJECT IDENTIFIER ::= {id-mat 85}
// ```
//
//
var Id_mat_replyCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 85} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_replyCounter */ /* START_OF_SYMBOL_DEFINITION Id_mat_requestsFailedCounter */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-requestsFailedCounter OBJECT IDENTIFIER ::= {id-mat 86}
// ```
//
//
var Id_mat_requestsFailedCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 86} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_requestsFailedCounter */ /* START_OF_SYMBOL_DEFINITION Id_mat_timeOfLastAccess */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-timeOfLastAccess OBJECT IDENTIFIER ::= {id-mat 87}
// ```
//
//
var Id_mat_timeOfLastAccess asn1.ObjectIdentifier = []int{2, 5, 30, 1, 87} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_timeOfLastAccess */ /* START_OF_SYMBOL_DEFINITION Id_mat_agreementID */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-agreementID OBJECT IDENTIFIER ::= {id-mat 88}
// ```
//
//
var Id_mat_agreementID asn1.ObjectIdentifier = []int{2, 5, 30, 1, 88} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_agreementID */ /* START_OF_SYMBOL_DEFINITION Id_mat_agreementVersion */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-agreementVersion OBJECT IDENTIFIER ::= {id-mat 89}
// ```
//
//
var Id_mat_agreementVersion asn1.ObjectIdentifier = []int{2, 5, 30, 1, 89} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_agreementVersion */ /* START_OF_SYMBOL_DEFINITION Id_mat_hOBRole */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-hOBRole OBJECT IDENTIFIER ::= {id-mat 90}
// ```
//
//
var Id_mat_hOBRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 90} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_hOBRole */ /* START_OF_SYMBOL_DEFINITION Id_mat_shadowingSubject */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-shadowingSubject OBJECT IDENTIFIER ::= {id-mat 91}
// ```
//
//
var Id_mat_shadowingSubject asn1.ObjectIdentifier = []int{2, 5, 30, 1, 91} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_shadowingSubject */ /* START_OF_SYMBOL_DEFINITION Id_mat_updateMode */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-updateMode OBJECT IDENTIFIER ::= {id-mat 92}
// ```
//
//
var Id_mat_updateMode asn1.ObjectIdentifier = []int{2, 5, 30, 1, 92} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_updateMode */ /* START_OF_SYMBOL_DEFINITION Id_mat_masterAccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-masterAccessPoint OBJECT IDENTIFIER ::= {id-mat 93}
// ```
//
//
var Id_mat_masterAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 93} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_masterAccessPoint */ /* START_OF_SYMBOL_DEFINITION Id_mat_secondaryShadows */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-secondaryShadows OBJECT IDENTIFIER ::= {id-mat 94}
// ```
//
//
var Id_mat_secondaryShadows asn1.ObjectIdentifier = []int{2, 5, 30, 1, 94} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_secondaryShadows */ /* START_OF_SYMBOL_DEFINITION Id_mat_shadowingRole */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-shadowingRole OBJECT IDENTIFIER ::= {id-mat 95}
// ```
//
//
var Id_mat_shadowingRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 95} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_shadowingRole */ /* START_OF_SYMBOL_DEFINITION Id_mat_lastUpdateTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-lastUpdateTime OBJECT IDENTIFIER ::= {id-mat 96}
// ```
//
//
var Id_mat_lastUpdateTime asn1.ObjectIdentifier = []int{2, 5, 30, 1, 96} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_lastUpdateTime */ /* START_OF_SYMBOL_DEFINITION Id_mat_shadowingSchedule */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-shadowingSchedule OBJECT IDENTIFIER ::= {id-mat 97}
// ```
//
//
var Id_mat_shadowingSchedule asn1.ObjectIdentifier = []int{2, 5, 30, 1, 97} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_shadowingSchedule */ /* START_OF_SYMBOL_DEFINITION Id_mat_nextUpdateTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-nextUpdateTime OBJECT IDENTIFIER ::= {id-mat 98}
// ```
//
//
var Id_mat_nextUpdateTime asn1.ObjectIdentifier = []int{2, 5, 30, 1, 98} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_nextUpdateTime */ /* START_OF_SYMBOL_DEFINITION Id_mat_useDOP */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-useDOP OBJECT IDENTIFIER ::= {id-mat 99}
// ```
//
//
var Id_mat_useDOP asn1.ObjectIdentifier = []int{2, 5, 30, 1, 99} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_useDOP */ /* START_OF_SYMBOL_DEFINITION Id_mat_accessor */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accessor OBJECT IDENTIFIER ::= {id-mat 100}
// ```
//
//
var Id_mat_accessor asn1.ObjectIdentifier = []int{2, 5, 30, 1, 100} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accessor */ /* START_OF_SYMBOL_DEFINITION Id_mat_allowedInfoService */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-allowedInfoService OBJECT IDENTIFIER ::= {id-mat 101}
// ```
//
//
var Id_mat_allowedInfoService asn1.ObjectIdentifier = []int{2, 5, 30, 1, 101} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_allowedInfoService */ /* START_OF_SYMBOL_DEFINITION Id_mat_applicationContextInUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-applicationContextInUse OBJECT IDENTIFIER ::= {id-mat 102}
// ```
//
//
var Id_mat_applicationContextInUse asn1.ObjectIdentifier = []int{2, 5, 30, 1, 102} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_applicationContextInUse */ /* START_OF_SYMBOL_DEFINITION Id_mat_associationId */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-associationId OBJECT IDENTIFIER ::= {id-mat 103}
// ```
//
//
var Id_mat_associationId asn1.ObjectIdentifier = []int{2, 5, 30, 1, 103} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_associationId */ /* START_OF_SYMBOL_DEFINITION Id_mat_callingAETitle */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-callingAETitle OBJECT IDENTIFIER ::= {id-mat 104}
// ```
//
//
var Id_mat_callingAETitle asn1.ObjectIdentifier = []int{2, 5, 30, 1, 104} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_callingAETitle */ /* START_OF_SYMBOL_DEFINITION Id_mat_disAllowedInfoService */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-disAllowedInfoService OBJECT IDENTIFIER ::= {id-mat 105}
// ```
//
//
var Id_mat_disAllowedInfoService asn1.ObjectIdentifier = []int{2, 5, 30, 1, 105} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_disAllowedInfoService */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxEntriesReturned */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxEntriesReturned OBJECT IDENTIFIER ::= {id-mat 106}
// ```
//
//
var Id_mat_maxEntriesReturned asn1.ObjectIdentifier = []int{2, 5, 30, 1, 106} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxEntriesReturned */ /* START_OF_SYMBOL_DEFINITION Id_mat_maxTimeForResult */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-maxTimeForResult OBJECT IDENTIFIER ::= {id-mat 107}
// ```
//
//
var Id_mat_maxTimeForResult asn1.ObjectIdentifier = []int{2, 5, 30, 1, 107} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_maxTimeForResult */ /* START_OF_SYMBOL_DEFINITION Id_mat_modifyDNRenameOnlyOpsProc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-modifyDNRenameOnlyOpsProc OBJECT IDENTIFIER ::= {id-mat 108}
// ```
//
//
var Id_mat_modifyDNRenameOnlyOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 108} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_modifyDNRenameOnlyOpsProc */ /* START_OF_SYMBOL_DEFINITION Id_mat_serviceDesc */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-serviceDesc OBJECT IDENTIFIER ::= {id-mat 109}
// ```
//
//
var Id_mat_serviceDesc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 109} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_serviceDesc */ /* START_OF_SYMBOL_DEFINITION Id_mat_serviceId */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-serviceId OBJECT IDENTIFIER ::= {id-mat 110}
// ```
//
//
var Id_mat_serviceId asn1.ObjectIdentifier = []int{2, 5, 30, 1, 110} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_serviceId */ /* START_OF_SYMBOL_DEFINITION Id_mat_subSchema */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-subSchema OBJECT IDENTIFIER ::= {id-mat 111}
// ```
//
//
var Id_mat_subSchema asn1.ObjectIdentifier = []int{2, 5, 30, 1, 111} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_subSchema */ /* START_OF_SYMBOL_DEFINITION Id_mat_sizeLimit */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-sizeLimit OBJECT IDENTIFIER ::= {id-mat 112}
// ```
//
//
var Id_mat_sizeLimit asn1.ObjectIdentifier = []int{2, 5, 30, 1, 112} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_sizeLimit */ /* START_OF_SYMBOL_DEFINITION Id_mat_timeLimit */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-timeLimit OBJECT IDENTIFIER ::= {id-mat 113}
// ```
//
//
var Id_mat_timeLimit asn1.ObjectIdentifier = []int{2, 5, 30, 1, 113} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_timeLimit */ /* START_OF_SYMBOL_DEFINITION Id_mat_dirCustName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dirCustName OBJECT IDENTIFIER ::= {id-mat 114}
// ```
//
//
var Id_mat_dirCustName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 114} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dirCustName */ /* START_OF_SYMBOL_DEFINITION Id_mat_dirUserName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dirUserName OBJECT IDENTIFIER ::= {id-mat 115}
// ```
//
//
var Id_mat_dirUserName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 115} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dirUserName */ /* START_OF_SYMBOL_DEFINITION Id_mat_dirCustAddr */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dirCustAddr OBJECT IDENTIFIER ::= {id-mat 116}
// ```
//
//
var Id_mat_dirCustAddr asn1.ObjectIdentifier = []int{2, 5, 30, 1, 116} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dirCustAddr */ /* START_OF_SYMBOL_DEFINITION Id_mat_dMDName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dMDName OBJECT IDENTIFIER ::= {id-mat 117}
// ```
//
//
var Id_mat_dMDName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 117} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dMDName */ /* START_OF_SYMBOL_DEFINITION Id_mat_accessControlScheme */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-accessControlScheme OBJECT IDENTIFIER ::= {id-mat 119}
// ```
//
//
var Id_mat_accessControlScheme asn1.ObjectIdentifier = []int{2, 5, 30, 1, 119} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_accessControlScheme */ /* START_OF_SYMBOL_DEFINITION Id_mat_administrativeRole */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-administrativeRole OBJECT IDENTIFIER ::= {id-mat 120}
// ```
//
//
var Id_mat_administrativeRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 120} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_administrativeRole */ /* START_OF_SYMBOL_DEFINITION Id_mat_aliasedEntryName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-aliasedEntryName OBJECT IDENTIFIER ::= {id-mat 121}
// ```
//
//
var Id_mat_aliasedEntryName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 121} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_aliasedEntryName */ /* START_OF_SYMBOL_DEFINITION Id_mat_attributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-attributeTypes OBJECT IDENTIFIER ::= {id-mat 122}
// ```
//
//
var Id_mat_attributeTypes asn1.ObjectIdentifier = []int{2, 5, 30, 1, 122} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_attributeTypes */ /* START_OF_SYMBOL_DEFINITION Id_mat_collectiveExclusions */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-collectiveExclusions OBJECT IDENTIFIER ::= {id-mat 123}
// ```
//
//
var Id_mat_collectiveExclusions asn1.ObjectIdentifier = []int{2, 5, 30, 1, 123} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_collectiveExclusions */ /* START_OF_SYMBOL_DEFINITION Id_mat_consumerKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-consumerKnowledge OBJECT IDENTIFIER ::= {id-mat 124}
// ```
//
//
var Id_mat_consumerKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 124} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_consumerKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_mat_createTimestamp */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-createTimestamp OBJECT IDENTIFIER ::= {id-mat 125}
// ```
//
//
var Id_mat_createTimestamp asn1.ObjectIdentifier = []int{2, 5, 30, 1, 125} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_createTimestamp */ /* START_OF_SYMBOL_DEFINITION Id_mat_creatorsName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-creatorsName OBJECT IDENTIFIER ::= {id-mat 126}
// ```
//
//
var Id_mat_creatorsName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 126} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_creatorsName */ /* START_OF_SYMBOL_DEFINITION Id_mat_credentials */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-credentials OBJECT IDENTIFIER ::= {id-mat 127}
// ```
//
//
var Id_mat_credentials asn1.ObjectIdentifier = []int{2, 5, 30, 1, 127} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_credentials */ /* START_OF_SYMBOL_DEFINITION Id_mat_distName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-distName OBJECT IDENTIFIER ::= {id-mat 128}
// ```
//
//
var Id_mat_distName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 128} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_distName */ /* START_OF_SYMBOL_DEFINITION Id_mat_dITContentRules */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dITContentRules OBJECT IDENTIFIER ::= {id-mat 129}
// ```
//
//
var Id_mat_dITContentRules asn1.ObjectIdentifier = []int{2, 5, 30, 1, 129} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dITContentRules */ /* START_OF_SYMBOL_DEFINITION Id_mat_dITStructureRule */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dITStructureRule OBJECT IDENTIFIER ::= {id-mat 130}
// ```
//
//
var Id_mat_dITStructureRule asn1.ObjectIdentifier = []int{2, 5, 30, 1, 130} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dITStructureRule */ /* START_OF_SYMBOL_DEFINITION Id_mat_dseType */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dseType OBJECT IDENTIFIER ::= {id-mat 131}
// ```
//
//
var Id_mat_dseType asn1.ObjectIdentifier = []int{2, 5, 30, 1, 131} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dseType */ /* START_OF_SYMBOL_DEFINITION Id_mat_entryACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-entryACI OBJECT IDENTIFIER ::= {id-mat 132}
// ```
//
//
var Id_mat_entryACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 132} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_entryACI */ /* START_OF_SYMBOL_DEFINITION Id_mat_governingSR */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-governingSR OBJECT IDENTIFIER ::= {id-mat 133}
// ```
//
//
var Id_mat_governingSR asn1.ObjectIdentifier = []int{2, 5, 30, 1, 133} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_governingSR */ /* START_OF_SYMBOL_DEFINITION Id_mat_matchingRules */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-matchingRules OBJECT IDENTIFIER ::= {id-mat 134}
// ```
//
//
var Id_mat_matchingRules asn1.ObjectIdentifier = []int{2, 5, 30, 1, 134} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_matchingRules */ /* START_OF_SYMBOL_DEFINITION Id_mat_matchingRuleUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-matchingRuleUse OBJECT IDENTIFIER ::= {id-mat 135}
// ```
//
//
var Id_mat_matchingRuleUse asn1.ObjectIdentifier = []int{2, 5, 30, 1, 135} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_matchingRuleUse */ /* START_OF_SYMBOL_DEFINITION Id_mat_modifiersName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-modifiersName OBJECT IDENTIFIER ::= {id-mat 136}
// ```
//
//
var Id_mat_modifiersName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 136} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_modifiersName */ /* START_OF_SYMBOL_DEFINITION Id_mat_modifyTimestamp */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-modifyTimestamp OBJECT IDENTIFIER ::= {id-mat 137}
// ```
//
//
var Id_mat_modifyTimestamp asn1.ObjectIdentifier = []int{2, 5, 30, 1, 137} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_modifyTimestamp */ /* START_OF_SYMBOL_DEFINITION Id_mat_myAccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-myAccessPoint OBJECT IDENTIFIER ::= {id-mat 138}
// ```
//
//
var Id_mat_myAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 138} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_myAccessPoint */ /* START_OF_SYMBOL_DEFINITION Id_mat_nonSpecificKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-nonSpecificKnowledge OBJECT IDENTIFIER ::= {id-mat 139}
// ```
//
//
var Id_mat_nonSpecificKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 139} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_nonSpecificKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_mat_objectClass */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-objectClass OBJECT IDENTIFIER ::= {id-mat 140}
// ```
//
//
var Id_mat_objectClass asn1.ObjectIdentifier = []int{2, 5, 30, 1, 140} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_objectClass */ /* START_OF_SYMBOL_DEFINITION Id_mat_objectClasses */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-objectClasses OBJECT IDENTIFIER ::= {id-mat 141}
// ```
//
//
var Id_mat_objectClasses asn1.ObjectIdentifier = []int{2, 5, 30, 1, 141} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_objectClasses */ /* START_OF_SYMBOL_DEFINITION Id_mat_prescriptiveACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-prescriptiveACI OBJECT IDENTIFIER ::= {id-mat 142}
// ```
//
//
var Id_mat_prescriptiveACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 142} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_prescriptiveACI */ /* START_OF_SYMBOL_DEFINITION Id_mat_nameForms */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-nameForms OBJECT IDENTIFIER ::= {id-mat 143}
// ```
//
//
var Id_mat_nameForms asn1.ObjectIdentifier = []int{2, 5, 30, 1, 143} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_nameForms */ /* START_OF_SYMBOL_DEFINITION Id_mat_specificKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-specificKnowledge OBJECT IDENTIFIER ::= {id-mat 144}
// ```
//
//
var Id_mat_specificKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 144} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_specificKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_mat_structuralObjectClass */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-structuralObjectClass OBJECT IDENTIFIER ::= {id-mat 145}
// ```
//
//
var Id_mat_structuralObjectClass asn1.ObjectIdentifier = []int{2, 5, 30, 1, 145} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_structuralObjectClass */ /* START_OF_SYMBOL_DEFINITION Id_mat_subentryACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-subentryACI OBJECT IDENTIFIER ::= {id-mat 146}
// ```
//
//
var Id_mat_subentryACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 146} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_subentryACI */ /* START_OF_SYMBOL_DEFINITION Id_mat_subtreeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-subtreeSpecification OBJECT IDENTIFIER ::= {id-mat 147}
// ```
//
//
var Id_mat_subtreeSpecification asn1.ObjectIdentifier = []int{2, 5, 30, 1, 147} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_subtreeSpecification */ /* START_OF_SYMBOL_DEFINITION Id_mat_superiorKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-superiorKnowledge OBJECT IDENTIFIER ::= {id-mat 148}
// ```
//
//
var Id_mat_superiorKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 148} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_superiorKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_mat_supplierKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-supplierKnowledge OBJECT IDENTIFIER ::= {id-mat 149}
// ```
//
//
var Id_mat_supplierKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 149} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_supplierKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_mat_dirCommonName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mat-dirCommonName OBJECT IDENTIFIER ::= {id-mat 150}
// ```
//
//
var Id_mat_dirCommonName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 150} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mat_dirCommonName */ /* START_OF_SYMBOL_DEFINITION Id_moc_dsa */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dsa OBJECT IDENTIFIER ::= {id-moc 0}
// ```
//
//
var Id_moc_dsa asn1.ObjectIdentifier = []int{2, 5, 30, 2, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dsa */ /* START_OF_SYMBOL_DEFINITION Id_moc_dse */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dse OBJECT IDENTIFIER ::= {id-moc 1}
// ```
//
//
var Id_moc_dse asn1.ObjectIdentifier = []int{2, 5, 30, 2, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dse */ /* START_OF_SYMBOL_DEFINITION Id_moc_knownDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-knownDSA OBJECT IDENTIFIER ::= {id-moc 2}
// ```
//
//
var Id_moc_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_knownDSA */ /* START_OF_SYMBOL_DEFINITION Id_moc_knownDUA */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-knownDUA OBJECT IDENTIFIER ::= {id-moc 3}
// ```
//
//
var Id_moc_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_knownDUA */ /* START_OF_SYMBOL_DEFINITION Id_moc_dUA */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dUA OBJECT IDENTIFIER ::= {id-moc 4}
// ```
//
//
var Id_moc_dUA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dUA */ /* START_OF_SYMBOL_DEFINITION Id_moc_nHOBMO */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-nHOBMO OBJECT IDENTIFIER ::= {id-moc 5}
// ```
//
//
var Id_moc_nHOBMO asn1.ObjectIdentifier = []int{2, 5, 30, 2, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_nHOBMO */ /* START_OF_SYMBOL_DEFINITION Id_moc_hOBMO */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-hOBMO OBJECT IDENTIFIER ::= {id-moc 6}
// ```
//
//
var Id_moc_hOBMO asn1.ObjectIdentifier = []int{2, 5, 30, 2, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_hOBMO */ /* START_OF_SYMBOL_DEFINITION Id_moc_shadowingAgreement */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-shadowingAgreement OBJECT IDENTIFIER ::= {id-moc 7}
// ```
//
//
var Id_moc_shadowingAgreement asn1.ObjectIdentifier = []int{2, 5, 30, 2, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_shadowingAgreement */ /* START_OF_SYMBOL_DEFINITION Id_moc_ULconnEnd */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-ULconnEnd OBJECT IDENTIFIER ::= {id-moc 8}
// ```
//
//
var Id_moc_ULconnEnd asn1.ObjectIdentifier = []int{2, 5, 30, 2, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_ULconnEnd */ /* START_OF_SYMBOL_DEFINITION Id_moc_disManagedObject */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-disManagedObject OBJECT IDENTIFIER ::= {id-moc 9}
// ```
//
//
var Id_moc_disManagedObject asn1.ObjectIdentifier = []int{2, 5, 30, 2, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_disManagedObject */ /* START_OF_SYMBOL_DEFINITION Id_moc_dirCust */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dirCust OBJECT IDENTIFIER ::= {id-moc 10}
// ```
//
//
var Id_moc_dirCust asn1.ObjectIdentifier = []int{2, 5, 30, 2, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dirCust */ /* START_OF_SYMBOL_DEFINITION Id_moc_dirUser */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dirUser OBJECT IDENTIFIER ::= {id-moc 11}
// ```
//
//
var Id_moc_dirUser asn1.ObjectIdentifier = []int{2, 5, 30, 2, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dirUser */ /* START_OF_SYMBOL_DEFINITION Id_moc_dMD */
// ### ASN.1 Definition:
//
// ```asn1
// id-moc-dMD OBJECT IDENTIFIER ::= {id-moc 12}
// ```
//
//
var Id_moc_dMD asn1.ObjectIdentifier = []int{2, 5, 30, 2, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_moc_dMD */ /* START_OF_SYMBOL_DEFINITION Id_mnb_dsa_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-dsa-name-binding OBJECT IDENTIFIER ::= {id-mnb 0}
// ```
//
//
var Id_mnb_dsa_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_dsa_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_dse_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-dse-name-binding OBJECT IDENTIFIER ::= {id-mnb 1}
// ```
//
//
var Id_mnb_dse_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_dse_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_knownDSA_dSA_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-knownDSA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 2}
// ```
//
//
var Id_mnb_knownDSA_dSA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_knownDSA_dSA_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_knownDUA_dSA_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-knownDUA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 3}
// ```
//
//
var Id_mnb_knownDUA_dSA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_knownDUA_dSA_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_acseInvoc_knownDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-acseInvoc-knownDSA OBJECT IDENTIFIER ::= {id-mnb 4}
// ```
//
//
var Id_mnb_acseInvoc_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_acseInvoc_knownDSA */ /* START_OF_SYMBOL_DEFINITION Id_mnb_acseInvoc_knownDUA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-acseInvoc-knownDUA OBJECT IDENTIFIER ::= {id-mnb 5}
// ```
//
//
var Id_mnb_acseInvoc_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_acseInvoc_knownDUA */ /* START_OF_SYMBOL_DEFINITION Id_mnb_nHOB_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-nHOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 6}
// ```
//
//
var Id_mnb_nHOB_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_nHOB_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_hOB_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-hOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 7}
// ```
//
//
var Id_mnb_hOB_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_hOB_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_shadowingAgreement_nb */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-shadowingAgreement-nb OBJECT IDENTIFIER ::= {id-mnb 8}
// ```
//
//
var Id_mnb_shadowingAgreement_nb asn1.ObjectIdentifier = []int{2, 5, 30, 3, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_shadowingAgreement_nb */ /* START_OF_SYMBOL_DEFINITION Id_mnb_ULconnEnd_knownDSA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-ULconnEnd-knownDSA OBJECT IDENTIFIER ::= {id-mnb 9}
// ```
//
//
var Id_mnb_ULconnEnd_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_ULconnEnd_knownDSA */ /* START_OF_SYMBOL_DEFINITION Id_mnb_ULconnEnd_knownDUA */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-ULconnEnd-knownDUA OBJECT IDENTIFIER ::= {id-mnb 10}
// ```
//
//
var Id_mnb_ULconnEnd_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_ULconnEnd_knownDUA */ /* START_OF_SYMBOL_DEFINITION Id_mnb_dis_Customer_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-dis-Customer-name-binding OBJECT IDENTIFIER ::= {id-mnb 11}
// ```
//
//
var Id_mnb_dis_Customer_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_dis_Customer_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_knownDSA_dUA_name_binding */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-knownDSA-dUA-name-binding OBJECT IDENTIFIER ::= {id-mnb 12}
// ```
//
//
var Id_mnb_knownDSA_dUA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_knownDSA_dUA_name_binding */ /* START_OF_SYMBOL_DEFINITION Id_mnb_DirCust_DMD */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-DirCust-DMD OBJECT IDENTIFIER ::= {id-mnb 13}
// ```
//
//
var Id_mnb_DirCust_DMD asn1.ObjectIdentifier = []int{2, 5, 30, 3, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_DirCust_DMD */ /* START_OF_SYMBOL_DEFINITION Id_mnb_DirUser_DirCust */
// ### ASN.1 Definition:
//
// ```asn1
// id-mnb-DirUser-DirCust OBJECT IDENTIFIER ::= {id-mnb 14}
// ```
//
//
var Id_mnb_DirUser_DirCust asn1.ObjectIdentifier = []int{2, 5, 30, 3, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mnb_DirUser_DirCust */ /* START_OF_SYMBOL_DEFINITION Id_mp_dsaPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dsaPackage OBJECT IDENTIFIER ::= {id-mp 0}
// ```
//
//
var Id_mp_dsaPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dsaPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_readPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-readPackage OBJECT IDENTIFIER ::= {id-mp 1}
// ```
//
//
var Id_mp_readPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_readPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_comparePackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-comparePackage OBJECT IDENTIFIER ::= {id-mp 2}
// ```
//
//
var Id_mp_comparePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_comparePackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_abandonPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-abandonPackage OBJECT IDENTIFIER ::= {id-mp 3}
// ```
//
//
var Id_mp_abandonPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_abandonPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_listPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-listPackage OBJECT IDENTIFIER ::= {id-mp 4}
// ```
//
//
var Id_mp_listPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_listPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_searchPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-searchPackage OBJECT IDENTIFIER ::= {id-mp 5}
// ```
//
//
var Id_mp_searchPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_searchPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_addPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-addPackage OBJECT IDENTIFIER ::= {id-mp 6}
// ```
//
//
var Id_mp_addPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_addPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_removePackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-removePackage OBJECT IDENTIFIER ::= {id-mp 7}
// ```
//
//
var Id_mp_removePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_removePackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_modifyPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-modifyPackage OBJECT IDENTIFIER ::= {id-mp 8}
// ```
//
//
var Id_mp_modifyPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_modifyPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_modifyDNPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-modifyDNPackage OBJECT IDENTIFIER ::= {id-mp 9}
// ```
//
//
var Id_mp_modifyDNPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_modifyDNPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedReadPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedReadPackage OBJECT IDENTIFIER ::= {id-mp 10}
// ```
//
//
var Id_mp_chainedReadPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedReadPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedComparePackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedComparePackage OBJECT IDENTIFIER ::= {id-mp 11}
// ```
//
//
var Id_mp_chainedComparePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedComparePackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedAbandonPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedAbandonPackage OBJECT IDENTIFIER ::= {id-mp 12}
// ```
//
//
var Id_mp_chainedAbandonPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedAbandonPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedListPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedListPackage OBJECT IDENTIFIER ::= {id-mp 13}
// ```
//
//
var Id_mp_chainedListPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedListPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedSearchPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedSearchPackage OBJECT IDENTIFIER ::= {id-mp 14}
// ```
//
//
var Id_mp_chainedSearchPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedSearchPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedAddPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedAddPackage OBJECT IDENTIFIER ::= {id-mp 15}
// ```
//
//
var Id_mp_chainedAddPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedAddPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedRemovePackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedRemovePackage OBJECT IDENTIFIER ::= {id-mp 16}
// ```
//
//
var Id_mp_chainedRemovePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedRemovePackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedModifyPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedModifyPackage OBJECT IDENTIFIER ::= {id-mp 17}
// ```
//
//
var Id_mp_chainedModifyPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedModifyPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_chainedModifyDNPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-chainedModifyDNPackage OBJECT IDENTIFIER ::= {id-mp 18}
// ```
//
//
var Id_mp_chainedModifyDNPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_chainedModifyDNPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_dsePackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dsePackage OBJECT IDENTIFIER ::= {id-mp 19}
// ```
//
//
var Id_mp_dsePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dsePackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_knownDSAPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-knownDSAPackage OBJECT IDENTIFIER ::= {id-mp 20}
// ```
//
//
var Id_mp_knownDSAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_knownDSAPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_knownDUAPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-knownDUAPackage OBJECT IDENTIFIER ::= {id-mp 21}
// ```
//
//
var Id_mp_knownDUAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_knownDUAPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_dUAPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dUAPackage OBJECT IDENTIFIER ::= {id-mp 22}
// ```
//
//
var Id_mp_dUAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dUAPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_nHOBPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-nHOBPackage OBJECT IDENTIFIER ::= {id-mp 23}
// ```
//
//
var Id_mp_nHOBPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_nHOBPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_hOBPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-hOBPackage OBJECT IDENTIFIER ::= {id-mp 24}
// ```
//
//
var Id_mp_hOBPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_hOBPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_shadowingAgreementPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-shadowingAgreementPackage OBJECT IDENTIFIER ::= {id-mp 25}
// ```
//
//
var Id_mp_shadowingAgreementPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_shadowingAgreementPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_ULconnEndPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-ULconnEndPackage OBJECT IDENTIFIER ::= {id-mp 26}
// ```
//
//
var Id_mp_ULconnEndPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_ULconnEndPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_disPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-disPackage OBJECT IDENTIFIER ::= {id-mp 27}
// ```
//
//
var Id_mp_disPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_disPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_dcsPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dcsPackage OBJECT IDENTIFIER ::= {id-mp 28}
// ```
//
//
var Id_mp_dcsPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dcsPackage */ /* START_OF_SYMBOL_DEFINITION Id_mp_dirCust */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dirCust OBJECT IDENTIFIER ::= {id-mp 29}
// ```
//
//
var Id_mp_dirCust asn1.ObjectIdentifier = []int{2, 5, 30, 4, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dirCust */ /* START_OF_SYMBOL_DEFINITION Id_mp_dirUser */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dirUser OBJECT IDENTIFIER ::= {id-mp 30}
// ```
//
//
var Id_mp_dirUser asn1.ObjectIdentifier = []int{2, 5, 30, 4, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dirUser */ /* START_OF_SYMBOL_DEFINITION Id_mp_dMD */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dMD OBJECT IDENTIFIER ::= {id-mp 31}
// ```
//
//
var Id_mp_dMD asn1.ObjectIdentifier = []int{2, 5, 30, 4, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dMD */ /* START_OF_SYMBOL_DEFINITION Id_mp_dsPackage */
// ### ASN.1 Definition:
//
// ```asn1
// id-mp-dsPackage OBJECT IDENTIFIER ::= {id-mp 32}
// ```
//
//
var Id_mp_dsPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mp_dsPackage */ /* START_OF_SYMBOL_DEFINITION Id_mpa_nameProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-nameProblem OBJECT IDENTIFIER ::= {id-mpa 1}
// ```
//
//
var Id_mpa_nameProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_nameProblem */ /* START_OF_SYMBOL_DEFINITION Id_mpa_traceInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-traceInformation OBJECT IDENTIFIER ::= {id-mpa 2}
// ```
//
//
var Id_mpa_traceInformation asn1.ObjectIdentifier = []int{2, 5, 30, 5, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_traceInformation */ /* START_OF_SYMBOL_DEFINITION Id_mpa_serviceProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-serviceProblem OBJECT IDENTIFIER ::= {id-mpa 3}
// ```
//
//
var Id_mpa_serviceProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_serviceProblem */ /* START_OF_SYMBOL_DEFINITION Id_mpa_entryName */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-entryName OBJECT IDENTIFIER ::= {id-mpa 4}
// ```
//
//
var Id_mpa_entryName asn1.ObjectIdentifier = []int{2, 5, 30, 5, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_entryName */ /* START_OF_SYMBOL_DEFINITION Id_mpa_operation */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-operation OBJECT IDENTIFIER ::= {id-mpa 5}
// ```
//
//
var Id_mpa_operation asn1.ObjectIdentifier = []int{2, 5, 30, 5, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_operation */ /* START_OF_SYMBOL_DEFINITION Id_mpa_attributeProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-attributeProblem OBJECT IDENTIFIER ::= {id-mpa 6}
// ```
//
//
var Id_mpa_attributeProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_attributeProblem */ /* START_OF_SYMBOL_DEFINITION Id_mpa_attributeType */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-attributeType OBJECT IDENTIFIER ::= {id-mpa 7}
// ```
//
//
var Id_mpa_attributeType asn1.ObjectIdentifier = []int{2, 5, 30, 5, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_attributeType */ /* START_OF_SYMBOL_DEFINITION Id_mpa_shadowProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-shadowProblem OBJECT IDENTIFIER ::= {id-mpa 8}
// ```
//
//
var Id_mpa_shadowProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_shadowProblem */ /* START_OF_SYMBOL_DEFINITION Id_mpa_attributeValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-attributeValue OBJECT IDENTIFIER ::= {id-mpa 9}
// ```
//
//
var Id_mpa_attributeValue asn1.ObjectIdentifier = []int{2, 5, 30, 5, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_attributeValue */ /* START_OF_SYMBOL_DEFINITION Id_mpa_resource */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-resource OBJECT IDENTIFIER ::= {id-mpa 10}
// ```
//
//
var Id_mpa_resource asn1.ObjectIdentifier = []int{2, 5, 30, 5, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_resource */ /* START_OF_SYMBOL_DEFINITION Id_mpa_authenReason */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-authenReason OBJECT IDENTIFIER ::= {id-mpa 11}
// ```
//
//
var Id_mpa_authenReason asn1.ObjectIdentifier = []int{2, 5, 30, 5, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_authenReason */ /* START_OF_SYMBOL_DEFINITION Id_mpa_updateProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-updateProblem OBJECT IDENTIFIER ::= {id-mpa 12}
// ```
//
//
var Id_mpa_updateProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_updateProblem */ /* START_OF_SYMBOL_DEFINITION Id_mpa_extensions */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-extensions OBJECT IDENTIFIER ::= {id-mpa 15}
// ```
//
//
var Id_mpa_extensions asn1.ObjectIdentifier = []int{2, 5, 30, 5, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_extensions */ /* START_OF_SYMBOL_DEFINITION Id_mpa_aliasedRDNs */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-aliasedRDNs OBJECT IDENTIFIER ::= {id-mpa 16}
// ```
//
//
var Id_mpa_aliasedRDNs asn1.ObjectIdentifier = []int{2, 5, 30, 5, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_aliasedRDNs */ /* START_OF_SYMBOL_DEFINITION Id_mpa_aliasDereferenced */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-aliasDereferenced OBJECT IDENTIFIER ::= {id-mpa 17}
// ```
//
//
var Id_mpa_aliasDereferenced asn1.ObjectIdentifier = []int{2, 5, 30, 5, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_aliasDereferenced */ /* START_OF_SYMBOL_DEFINITION Id_mpa_referenceType */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-referenceType OBJECT IDENTIFIER ::= {id-mpa 18}
// ```
//
//
var Id_mpa_referenceType asn1.ObjectIdentifier = []int{2, 5, 30, 5, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_referenceType */ /* START_OF_SYMBOL_DEFINITION Id_mpa_operationProgress */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-operationProgress OBJECT IDENTIFIER ::= {id-mpa 19}
// ```
//
//
var Id_mpa_operationProgress asn1.ObjectIdentifier = []int{2, 5, 30, 5, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_operationProgress */ /* START_OF_SYMBOL_DEFINITION Id_mpa_pDU */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-pDU OBJECT IDENTIFIER ::= {id-mpa 20}
// ```
//
//
var Id_mpa_pDU asn1.ObjectIdentifier = []int{2, 5, 30, 5, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_pDU */ /* START_OF_SYMBOL_DEFINITION Id_mpa_opId */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-opId OBJECT IDENTIFIER ::= {id-mpa 21}
// ```
//
//
var Id_mpa_opId asn1.ObjectIdentifier = []int{2, 5, 30, 5, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_opId */ /* START_OF_SYMBOL_DEFINITION Id_mpa_nhob_bind_id */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-nhob-bind-id OBJECT IDENTIFIER ::= {id-mpa 22}
// ```
//
//
var Id_mpa_nhob_bind_id asn1.ObjectIdentifier = []int{2, 5, 30, 5, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_nhob_bind_id */ /* START_OF_SYMBOL_DEFINITION Id_mpa_mhob_dop_prob */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-mhob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 23}
// ```
//
//
var Id_mpa_mhob_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_mhob_dop_prob */ /* START_OF_SYMBOL_DEFINITION Id_mpa_hob_bind_id */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-hob-bind-id OBJECT IDENTIFIER ::= {id-mpa 24}
// ```
//
//
var Id_mpa_hob_bind_id asn1.ObjectIdentifier = []int{2, 5, 30, 5, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_hob_bind_id */ /* START_OF_SYMBOL_DEFINITION Id_mpa_hob_dop_prob */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-hob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 25}
// ```
//
//
var Id_mpa_hob_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_hob_dop_prob */ /* START_OF_SYMBOL_DEFINITION Id_mpa_shadowing_dop_prob */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-shadowing-dop-prob OBJECT IDENTIFIER ::= {id-mpa 26}
// ```
//
//
var Id_mpa_shadowing_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_shadowing_dop_prob */ /* START_OF_SYMBOL_DEFINITION Id_mpa_opIdDN */
// ### ASN.1 Definition:
//
// ```asn1
// id-mpa-opIdDN OBJECT IDENTIFIER ::= {id-mpa 27}
// ```
//
//
var Id_mpa_opIdDN asn1.ObjectIdentifier = []int{2, 5, 30, 5, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mpa_opIdDN */ /* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryInformationServiceElement-operationType ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type DirectoryInformationServiceElement_operationType = asn1.BitString

/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Read */
const DirectoryInformationServiceElement_operationType_Read int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Read */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Compare */
const DirectoryInformationServiceElement_operationType_Compare int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Compare */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Abandon */
const DirectoryInformationServiceElement_operationType_Abandon int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Abandon */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_List */
const DirectoryInformationServiceElement_operationType_List int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_List */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Search */
const DirectoryInformationServiceElement_operationType_Search int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_Search */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_AddEntry */
const DirectoryInformationServiceElement_operationType_AddEntry int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_AddEntry */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_RemoveEntry */
const DirectoryInformationServiceElement_operationType_RemoveEntry int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_RemoveEntry */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_ModifyEntry */
const DirectoryInformationServiceElement_operationType_ModifyEntry int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_ModifyEntry */

/* START_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_ModifyDN */
const DirectoryInformationServiceElement_operationType_ModifyDN int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DirectoryInformationServiceElement_operationType_ModifyDN */ /* START_OF_SYMBOL_DEFINITION SubSchemaSyntax_Item_subSchema */
// ### ASN.1 Definition:
//
// ```asn1
// SubSchemaSyntax-Item-subSchema ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type SubSchemaSyntax_Item_subSchema struct {
	StructureRules [](DITStructureRuleDescription) `asn1:"optional,explicit,tag:1"`
	ContentRules   [](DITContentRuleDescription)   `asn1:"optional,explicit,tag:2"`
	MatchingRules  [](MatchingRuleDescription)     `asn1:"optional,explicit,tag:3"`
	AttributeTypes [](AttributeTypeDescription)    `asn1:"optional,explicit,tag:4"`
	ObjectClasses  [](ObjectClassDescription)      `asn1:"optional,explicit,tag:5"`
	NameForms      [](NameFormDescription)         `asn1:"optional,explicit,tag:6"`
	MatchRuleUses  [](MatchingRuleUseDescription)  `asn1:"optional,explicit,tag:7"`
}

/* END_OF_SYMBOL_DEFINITION SubSchemaSyntax_Item_subSchema */ /* START_OF_SYMBOL_DEFINITION SubSchemaSyntax_Item */
// ### ASN.1 Definition:
//
// ```asn1
// SubSchemaSyntax-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type SubSchemaSyntax_Item struct {
	Name      Name                           `asn1:"explicit,tag:1"`
	SubSchema SubSchemaSyntax_Item_subSchema `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION SubSchemaSyntax_Item */
