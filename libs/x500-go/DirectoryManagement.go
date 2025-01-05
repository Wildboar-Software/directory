package x500_go

import (
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	Accessors ::= SET OF Name
type Accessors = [](Name)

// # ASN.1 Definition:
//
//	AdministrativeRole ::= OBJECT-CLASS.&id
type AdministrativeRole = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	AssociationEstablishment ::= BIT STRING {inward(0), outward(1)}
type AssociationEstablishment = asn1.BitString

const AssociationEstablishment_Inward int32 = 0

const AssociationEstablishment_Outward int32 = 1

// # ASN.1 Definition:
//
//	AssociationId ::= INTEGER
type AssociationId = int64

// # ASN.1 Definition:
//
//	AuthenReasonSyntax ::= INTEGER {
//	  unknownUser(0), incorrectPassword(1), inaccessiblePassword(2),
//	  passwordVerificationLoop(3), unrecognizedUser(4)}
type AuthenReasonSyntax = int64

const AuthenReasonSyntax_UnknownUser AuthenReasonSyntax = 0

const AuthenReasonSyntax_IncorrectPassword AuthenReasonSyntax = 1

const AuthenReasonSyntax_InaccessiblePassword AuthenReasonSyntax = 2

const AuthenReasonSyntax_PasswordVerificationLoop AuthenReasonSyntax = 3

const AuthenReasonSyntax_UnrecognizedUser AuthenReasonSyntax = 4

// # ASN.1 Definition:
//
//	DirectoryInformationServiceElement ::= SEQUENCE {
//	  operationType
//	    BIT STRING {read(0), compare(1), abandon(2), list(3), search(4),
//	                addEntry(5), removeEntry(6), modifyEntry(7), modifyDN(8)}
//	      OPTIONAL,
//	  attributeType   AttributeType OPTIONAL,
//	  attributeValue  [0]  AttributeValue OPTIONAL
//	}
type DirectoryInformationServiceElement struct {
	OperationType  DirectoryInformationServiceElement_operationType `asn1:"optional"`
	AttributeType  AttributeType                                    `asn1:"optional"`
	AttributeValue AttributeValue                                   `asn1:"optional,explicit,tag:0"`
}

// # ASN.1 Definition:
//
//	DSAScopeOfChainingValue ::= INTEGER {dmd(0), country(1), global(2)}
type DSAScopeOfChainingValue = int64

const DSAScopeOfChainingValue_Dmd DSAScopeOfChainingValue = 0

const DSAScopeOfChainingValue_Country DSAScopeOfChainingValue = 1

const DSAScopeOfChainingValue_Global DSAScopeOfChainingValue = 2

// # ASN.1 Definition:
//
//	DSAScopeOfReferralValue ::= INTEGER {dmd(0), country(1), global(2)}
type DSAScopeOfReferralValue = int64

const DSAScopeOfReferralValue_Dmd DSAScopeOfReferralValue = 0

const DSAScopeOfReferralValue_Country DSAScopeOfReferralValue = 1

const DSAScopeOfReferralValue_Global DSAScopeOfReferralValue = 2

// # ASN.1 Definition:
//
//	HOBRole ::= INTEGER {superior(0), subordinate(1)}
type HOBRole = int64

const HOBRole_Superior HOBRole = 0

const HOBRole_Subordinate HOBRole = 1

// # ASN.1 Definition:
//
//	MgtBitString ::= BIT STRING
type MgtBitString = asn1.BitString

// # ASN.1 Definition:
//
//	MgtBoolean ::= BOOLEAN
type MgtBoolean = bool

// # ASN.1 Definition:
//
//	MgtCommonName ::= UnboundedDirectoryString
type MgtCommonName = UnboundedDirectoryString

// # ASN.1 Definition:
//
//	MgtGeneralizedTime ::= GeneralizedTime
type MgtGeneralizedTime = time.Time

// # ASN.1 Definition:
//
//	MgtInteger ::= INTEGER
type MgtInteger = int64

// # ASN.1 Definition:
//
//	MgtName ::= Name
type MgtName = Name

// # ASN.1 Definition:
//
//	MgtOctetString ::= OCTET STRING
type MgtOctetString = []byte

// # ASN.1 Definition:
//
//	MgtOID ::= OBJECT IDENTIFIER
type MgtOID = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	MgtPrintableString ::= PrintableString
type MgtPrintableString = string

// # ASN.1 Definition:
//
//	PeerEntityAuthenticationPolicy ::= BIT STRING {
//	  none(0), nameOnly(1), simpleUnprotected(2), simpleProtected(3), strong(4),
//	  external(5)}
type PeerEntityAuthenticationPolicy = asn1.BitString

const PeerEntityAuthenticationPolicy_None int32 = 0

const PeerEntityAuthenticationPolicy_NameOnly int32 = 1

const PeerEntityAuthenticationPolicy_SimpleUnprotected int32 = 2

const PeerEntityAuthenticationPolicy_SimpleProtected int32 = 3

const PeerEntityAuthenticationPolicy_Strong int32 = 4

const PeerEntityAuthenticationPolicy_External int32 = 5

// # ASN.1 Definition:
//
//	RemoteDSAList ::= SET OF AccessPoint
type RemoteDSAList = [](AccessPoint)

// # ASN.1 Definition:
//
//	RequestAuthenticationPolicy ::= BIT STRING {none(0), simpleName(1), strong(2)}
type RequestAuthenticationPolicy = asn1.BitString

const RequestAuthenticationPolicy_None int32 = 0

const RequestAuthenticationPolicy_SimpleName int32 = 1

const RequestAuthenticationPolicy_Strong int32 = 2

// # ASN.1 Definition:
//
//	ResourceSyntax ::= INTEGER {
//	  insufficientMemory(0), insufficientAssociations(1), insufficientDiskSpace(2),
//	  miscellaneousResourceExhausted(4)}
type ResourceSyntax = int64

const ResourceSyntax_InsufficientMemory ResourceSyntax = 0

const ResourceSyntax_InsufficientAssociations ResourceSyntax = 1

const ResourceSyntax_InsufficientDiskSpace ResourceSyntax = 2

const ResourceSyntax_MiscellaneousResourceExhausted ResourceSyntax = 4

// # ASN.1 Definition:
//
//	ResultAuthenticationPolicy ::= RequestAuthenticationPolicy
type ResultAuthenticationPolicy = RequestAuthenticationPolicy

// Changed to `[](asn1.RawValue)` becaues of https://github.com/golang/go/issues/27426
//
// # ASN.1 Definition:
//
//	SecondaryShadows ::= SET OF SupplierAndConsumers
type SecondaryShadows = [](asn1.RawValue)

// # ASN.1 Definition:
//
//	ShadowingRole ::= INTEGER {supplier(0), consumer(1)}
type ShadowingRole = int64

const ShadowingRole_Supplier ShadowingRole = 0

const ShadowingRole_Consumer ShadowingRole = 1

// # ASN.1 Definition:
//
// SubSchemaSyntax ::= SEQUENCE OF
//
//	SEQUENCE {name       [1]  Name, --  Name of the subschema subentry for the subschema
//	          subSchema
//	            [2]  SEQUENCE {structureRules
//	                             [1]  SEQUENCE OF DITStructureRuleDescription
//	                               OPTIONAL,
//	                           contentRules
//	                             [2]  SEQUENCE OF DITContentRuleDescription
//	                               OPTIONAL,
//	                           matchingRules
//	                             [3]  SEQUENCE OF MatchingRuleDescription
//	                               OPTIONAL,
//	                           attributeTypes
//	                             [4]  SEQUENCE OF AttributeTypeDescription
//	                               OPTIONAL,
//	                           objectClasses
//	                             [5]  SEQUENCE OF ObjectClassDescription
//	                               OPTIONAL,
//	                           nameForms
//	                             [6]  SEQUENCE OF NameFormDescription OPTIONAL,
//	                           matchRuleUses
//	                             [7]  SEQUENCE OF MatchingRuleUseDescription
//	                               OPTIONAL}}
type SubSchemaSyntax = [](SubSchemaSyntax_Item)

// # ASN.1 Definition:
//
//	SupportedApplicationContexts ::= SET OF OBJECT IDENTIFIER
type SupportedApplicationContexts = [](asn1.ObjectIdentifier)

// # ASN.1 Definition:
//
//	zero INTEGER ::= 0
const Zero int = 0

// # ASN.1 Definition:
//
//	id-mac OBJECT IDENTIFIER ::= {id-mgt 0}
var Id_mac asn1.ObjectIdentifier = []int{2, 5, 30, 0}

// # ASN.1 Definition:
//
//	id-mat OBJECT IDENTIFIER ::= {id-mgt 1}
var Id_mat asn1.ObjectIdentifier = []int{2, 5, 30, 1}

// # ASN.1 Definition:
//
//	id-moc OBJECT IDENTIFIER ::= {id-mgt 2}
var Id_moc asn1.ObjectIdentifier = []int{2, 5, 30, 2}

// # ASN.1 Definition:
//
//	id-mnb OBJECT IDENTIFIER ::= {id-mgt 3}
var Id_mnb asn1.ObjectIdentifier = []int{2, 5, 30, 3}

// # ASN.1 Definition:
//
//	id-mp OBJECT IDENTIFIER ::= {id-mgt 4}
var Id_mp asn1.ObjectIdentifier = []int{2, 5, 30, 4}

// # ASN.1 Definition:
//
//	id-mpa OBJECT IDENTIFIER ::= {id-mgt 5}
var Id_mpa asn1.ObjectIdentifier = []int{2, 5, 30, 5}

// # ASN.1 Definition:
//
//	id-mac-useRemoteDSA OBJECT IDENTIFIER ::= {id-mac 0}
var Id_mac_useRemoteDSA asn1.ObjectIdentifier = []int{2, 5, 30, 0, 0}

// # ASN.1 Definition:
//
//	id-mac-useHomeDSA OBJECT IDENTIFIER ::= {id-mac 1}
var Id_mac_useHomeDSA asn1.ObjectIdentifier = []int{2, 5, 30, 0, 1}

// # ASN.1 Definition:
//
//	id-mac-update OBJECT IDENTIFIER ::= {id-mac 2}
var Id_mac_update asn1.ObjectIdentifier = []int{2, 5, 30, 0, 2}

// # ASN.1 Definition:
//
//	id-mat-accessPoint OBJECT IDENTIFIER ::= {id-mat 0}
var Id_mat_accessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 0}

// # ASN.1 Definition:
//
//	id-mat-masterEntries OBJECT IDENTIFIER ::= {id-mat 1}
var Id_mat_masterEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 1}

// # ASN.1 Definition:
//
//	id-mat-copyEntries OBJECT IDENTIFIER ::= {id-mat 2}
var Id_mat_copyEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 2}

// # ASN.1 Definition:
//
//	id-mat-loopsDetected OBJECT IDENTIFIER ::= {id-mat 3}
var Id_mat_loopsDetected asn1.ObjectIdentifier = []int{2, 5, 30, 1, 3}

// # ASN.1 Definition:
//
//	id-mat-securityErrors OBJECT IDENTIFIER ::= {id-mat 4}
var Id_mat_securityErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 4}

// # ASN.1 Definition:
//
//	id-mat-nameErrors OBJECT IDENTIFIER ::= {id-mat 5}
var Id_mat_nameErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 5}

// # ASN.1 Definition:
//
//	id-mat-foundLocalEntries OBJECT IDENTIFIER ::= {id-mat 6}
var Id_mat_foundLocalEntries asn1.ObjectIdentifier = []int{2, 5, 30, 1, 6}

// # ASN.1 Definition:
//
//	id-mat-referrals OBJECT IDENTIFIER ::= {id-mat 7}
var Id_mat_referrals asn1.ObjectIdentifier = []int{2, 5, 30, 1, 7}

// # ASN.1 Definition:
//
//	id-mat-serviceErrors OBJECT IDENTIFIER ::= {id-mat 8}
var Id_mat_serviceErrors asn1.ObjectIdentifier = []int{2, 5, 30, 1, 8}

// # ASN.1 Definition:
//
//	id-mat-aliasDereferences OBJECT IDENTIFIER ::= {id-mat 9}
var Id_mat_aliasDereferences asn1.ObjectIdentifier = []int{2, 5, 30, 1, 9}

// # ASN.1 Definition:
//
//	id-mat-chainings OBJECT IDENTIFIER ::= {id-mat 10}
var Id_mat_chainings asn1.ObjectIdentifier = []int{2, 5, 30, 1, 10}

// # ASN.1 Definition:
//
//	id-mat-invalidReferences OBJECT IDENTIFIER ::= {id-mat 11}
var Id_mat_invalidReferences asn1.ObjectIdentifier = []int{2, 5, 30, 1, 11}

// # ASN.1 Definition:
//
//	id-mat-unableToProceed OBJECT IDENTIFIER ::= {id-mat 12}
var Id_mat_unableToProceed asn1.ObjectIdentifier = []int{2, 5, 30, 1, 12}

// # ASN.1 Definition:
//
//	id-mat-outOfScope OBJECT IDENTIFIER ::= {id-mat 13}
var Id_mat_outOfScope asn1.ObjectIdentifier = []int{2, 5, 30, 1, 13}

// # ASN.1 Definition:
//
//	id-mat-noSuchObject OBJECT IDENTIFIER ::= {id-mat 14}
var Id_mat_noSuchObject asn1.ObjectIdentifier = []int{2, 5, 30, 1, 14}

// # ASN.1 Definition:
//
//	id-mat-aliasProblem OBJECT IDENTIFIER ::= {id-mat 15}
var Id_mat_aliasProblem asn1.ObjectIdentifier = []int{2, 5, 30, 1, 15}

// # ASN.1 Definition:
//
//	id-mat-aliasDereferencingProblem OBJECT IDENTIFIER ::= {id-mat 16}
var Id_mat_aliasDereferencingProblem asn1.ObjectIdentifier = []int{2, 5, 30, 1, 16}

// # ASN.1 Definition:
//
//	id-mat-affectsMultipleDSAs OBJECT IDENTIFIER ::= {id-mat 17}
var Id_mat_affectsMultipleDSAs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 17}

// # ASN.1 Definition:
//
//	id-mat-unavailableCriticalExtension OBJECT IDENTIFIER ::= {id-mat 18}
var Id_mat_unavailableCriticalExtension asn1.ObjectIdentifier = []int{2, 5, 30, 1, 18}

// # ASN.1 Definition:
//
//	id-mat-timeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 19}
var Id_mat_timeLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 19}

// # ASN.1 Definition:
//
//	id-mat-sizeLimitExceeded OBJECT IDENTIFIER ::= {id-mat 20}
var Id_mat_sizeLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 20}

// # ASN.1 Definition:
//
//	id-mat-adminLimitExceeded OBJECT IDENTIFIER ::= {id-mat 21}
var Id_mat_adminLimitExceeded asn1.ObjectIdentifier = []int{2, 5, 30, 1, 21}

// # ASN.1 Definition:
//
//	id-mat-prohibitChaining OBJECT IDENTIFIER ::= {id-mat 24}
var Id_mat_prohibitChaining asn1.ObjectIdentifier = []int{2, 5, 30, 1, 24}

// # ASN.1 Definition:
//
//	id-mat-readOpsProc OBJECT IDENTIFIER ::= {id-mat 25}
var Id_mat_readOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 25}

// # ASN.1 Definition:
//
//	id-mat-compareOpsProc OBJECT IDENTIFIER ::= {id-mat 26}
var Id_mat_compareOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 26}

// # ASN.1 Definition:
//
//	id-mat-abandonOpsProc OBJECT IDENTIFIER ::= {id-mat 27}
var Id_mat_abandonOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 27}

// # ASN.1 Definition:
//
//	id-mat-listOpsProc OBJECT IDENTIFIER ::= {id-mat 28}
var Id_mat_listOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 28}

// # ASN.1 Definition:
//
//	id-mat-searchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 29}
var Id_mat_searchBaseOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 29}

// # ASN.1 Definition:
//
//	id-mat-search1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 30}
var Id_mat_search1LevelOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 30}

// # ASN.1 Definition:
//
//	id-mat-searchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 31}
var Id_mat_searchSubtreeOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 31}

// # ASN.1 Definition:
//
//	id-mat-addEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 32}
var Id_mat_addEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 32}

// # ASN.1 Definition:
//
//	id-mat-removeEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 33}
var Id_mat_removeEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 33}

// # ASN.1 Definition:
//
//	id-mat-modifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 34}
var Id_mat_modifyEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 34}

// # ASN.1 Definition:
//
//	id-mat-modifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 35}
var Id_mat_modifyDNOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 35}

// # ASN.1 Definition:
//
//	id-mat-chReadOpsProc OBJECT IDENTIFIER ::= {id-mat 36}
var Id_mat_chReadOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 36}

// # ASN.1 Definition:
//
//	id-mat-chCompareOpsProc OBJECT IDENTIFIER ::= {id-mat 37}
var Id_mat_chCompareOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 37}

// # ASN.1 Definition:
//
//	id-mat-chAbandonOpsProc OBJECT IDENTIFIER ::= {id-mat 38}
var Id_mat_chAbandonOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 38}

// # ASN.1 Definition:
//
//	id-mat-chListOpsProc OBJECT IDENTIFIER ::= {id-mat 39}
var Id_mat_chListOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 39}

// # ASN.1 Definition:
//
//	id-mat-chSearchBaseOpsProc OBJECT IDENTIFIER ::= {id-mat 40}
var Id_mat_chSearchBaseOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 40}

// # ASN.1 Definition:
//
//	id-mat-chSearch1LevelOpsProc OBJECT IDENTIFIER ::= {id-mat 41}
var Id_mat_chSearch1LevelOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 41}

// # ASN.1 Definition:
//
//	id-mat-chSearchSubtreeOpsProc OBJECT IDENTIFIER ::= {id-mat 42}
var Id_mat_chSearchSubtreeOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 42}

// # ASN.1 Definition:
//
//	id-mat-chAddEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 43}
var Id_mat_chAddEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 43}

// # ASN.1 Definition:
//
//	id-mat-chRemoveEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 44}
var Id_mat_chRemoveEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 44}

// # ASN.1 Definition:
//
//	id-mat-chModifyEntryOpsProc OBJECT IDENTIFIER ::= {id-mat 45}
var Id_mat_chModifyEntryOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 45}

// # ASN.1 Definition:
//
//	id-mat-chModifyDNOpsProc OBJECT IDENTIFIER ::= {id-mat 46}
var Id_mat_chModifyDNOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 46}

// # ASN.1 Definition:
//
//	id-mat-dSAScopeOfReferral OBJECT IDENTIFIER ::= {id-mat 47}
var Id_mat_dSAScopeOfReferral asn1.ObjectIdentifier = []int{2, 5, 30, 1, 47}

// # ASN.1 Definition:
//
//	id-mat-dSAScopeOfChaining OBJECT IDENTIFIER ::= {id-mat 48}
var Id_mat_dSAScopeOfChaining asn1.ObjectIdentifier = []int{2, 5, 30, 1, 48}

// # ASN.1 Definition:
//
//	id-mat-peerEntityAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 49}
var Id_mat_peerEntityAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 49}

// # ASN.1 Definition:
//
//	id-mat-requestAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 50}
var Id_mat_requestAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 50}

// # ASN.1 Definition:
//
//	id-mat-resultAuthenticationPolicy OBJECT IDENTIFIER ::= {id-mat 51}
var Id_mat_resultAuthenticationPolicy asn1.ObjectIdentifier = []int{2, 5, 30, 1, 51}

// # ASN.1 Definition:
//
//	id-mat-dSPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 52}
var Id_mat_dSPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 52}

// # ASN.1 Definition:
//
//	id-mat-dOPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 53}
var Id_mat_dOPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 53}

// # ASN.1 Definition:
//
//	id-mat-dISPAssociationEstablishment OBJECT IDENTIFIER ::= {id-mat 54}
var Id_mat_dISPAssociationEstablishment asn1.ObjectIdentifier = []int{2, 5, 30, 1, 54}

// # ASN.1 Definition:
//
//	id-mat-maxDAPAssociations OBJECT IDENTIFIER ::= {id-mat 55}
var Id_mat_maxDAPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 55}

// # ASN.1 Definition:
//
//	id-mat-maxDSPAssociations OBJECT IDENTIFIER ::= {id-mat 56}
var Id_mat_maxDSPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 56}

// # ASN.1 Definition:
//
//	id-mat-maxDOPAssociations OBJECT IDENTIFIER ::= {id-mat 57}
var Id_mat_maxDOPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 57}

// # ASN.1 Definition:
//
//	id-mat-maxDISPAssociations OBJECT IDENTIFIER ::= {id-mat 58}
var Id_mat_maxDISPAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 58}

// # ASN.1 Definition:
//
//	id-mat-dAPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 59}
var Id_mat_dAPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 59}

// # ASN.1 Definition:
//
//	id-mat-dSPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 60}
var Id_mat_dSPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 60}

// # ASN.1 Definition:
//
//	id-mat-dOPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 61}
var Id_mat_dOPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 61}

// # ASN.1 Definition:
//
//	id-mat-dISPAssociationTimeout OBJECT IDENTIFIER ::= {id-mat 62}
var Id_mat_dISPAssociationTimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 62}

// # ASN.1 Definition:
//
//	id-mat-dSAActiveAssociations OBJECT IDENTIFIER ::= {id-mat 63}
var Id_mat_dSAActiveAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 63}

// # ASN.1 Definition:
//
//	id-mat-pagedResultsMaxIDs OBJECT IDENTIFIER ::= {id-mat 64}
var Id_mat_pagedResultsMaxIDs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 64}

// # ASN.1 Definition:
//
//	id-mat-pagedResultsTimer OBJECT IDENTIFIER ::= {id-mat 65}
var Id_mat_pagedResultsTimer asn1.ObjectIdentifier = []int{2, 5, 30, 1, 65}

// # ASN.1 Definition:
//
//	id-mat-homeDSA OBJECT IDENTIFIER ::= {id-mat 66}
var Id_mat_homeDSA asn1.ObjectIdentifier = []int{2, 5, 30, 1, 66}

// # ASN.1 Definition:
//
//	id-mat-dUATimeout OBJECT IDENTIFIER ::= {id-mat 68}
var Id_mat_dUATimeout asn1.ObjectIdentifier = []int{2, 5, 30, 1, 68}

// # ASN.1 Definition:
//
//	id-mat-supportedApplicationContexts OBJECT IDENTIFIER ::= {id-mat 69}
var Id_mat_supportedApplicationContexts asn1.ObjectIdentifier = []int{2, 5, 30, 1, 69}

// # ASN.1 Definition:
//
//	id-mat-reverseCredentials OBJECT IDENTIFIER ::= {id-mat 70}
var Id_mat_reverseCredentials asn1.ObjectIdentifier = []int{2, 5, 30, 1, 70}

// # ASN.1 Definition:
//
//	id-mat-remoteAccessPoint OBJECT IDENTIFIER ::= {id-mat 71}
var Id_mat_remoteAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 71}

// # ASN.1 Definition:
//
//	id-mat-maxInboundAssociations OBJECT IDENTIFIER ::= {id-mat 72}
var Id_mat_maxInboundAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 72}

// # ASN.1 Definition:
//
//	id-mat-maxOutboundAssociations OBJECT IDENTIFIER ::= {id-mat 73}
var Id_mat_maxOutboundAssociations asn1.ObjectIdentifier = []int{2, 5, 30, 1, 73}

// # ASN.1 Definition:
//
//	id-mat-currentActiveAssocs OBJECT IDENTIFIER ::= {id-mat 74}
var Id_mat_currentActiveAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 74}

// # ASN.1 Definition:
//
//	id-mat-currentActiveInboundAssocs OBJECT IDENTIFIER ::= {id-mat 75}
var Id_mat_currentActiveInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 75}

// # ASN.1 Definition:
//
//	id-mat-currentActiveOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 76}
var Id_mat_currentActiveOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 76}

// # ASN.1 Definition:
//
//	id-mat-accumAssocs OBJECT IDENTIFIER ::= {id-mat 77}
var Id_mat_accumAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 77}

// # ASN.1 Definition:
//
//	id-mat-accumInboundAssocs OBJECT IDENTIFIER ::= {id-mat 78}
var Id_mat_accumInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 78}

// # ASN.1 Definition:
//
//	id-mat-accumOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 79}
var Id_mat_accumOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 79}

// # ASN.1 Definition:
//
//	id-mat-accumFailedInboundAssocs OBJECT IDENTIFIER ::= {id-mat 80}
var Id_mat_accumFailedInboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 80}

// # ASN.1 Definition:
//
//	id-mat-accumFailedOutboundAssocs OBJECT IDENTIFIER ::= {id-mat 81}
var Id_mat_accumFailedOutboundAssocs asn1.ObjectIdentifier = []int{2, 5, 30, 1, 81}

// # ASN.1 Definition:
//
//	id-mat-timeOfLastAttempt OBJECT IDENTIFIER ::= {id-mat 82}
var Id_mat_timeOfLastAttempt asn1.ObjectIdentifier = []int{2, 5, 30, 1, 82}

// # ASN.1 Definition:
//
//	id-mat-timeOfLastSuccess OBJECT IDENTIFIER ::= {id-mat 83}
var Id_mat_timeOfLastSuccess asn1.ObjectIdentifier = []int{2, 5, 30, 1, 83}

// # ASN.1 Definition:
//
//	id-mat-requestCounter OBJECT IDENTIFIER ::= {id-mat 84}
var Id_mat_requestCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 84}

// # ASN.1 Definition:
//
//	id-mat-replyCounter OBJECT IDENTIFIER ::= {id-mat 85}
var Id_mat_replyCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 85}

// # ASN.1 Definition:
//
//	id-mat-requestsFailedCounter OBJECT IDENTIFIER ::= {id-mat 86}
var Id_mat_requestsFailedCounter asn1.ObjectIdentifier = []int{2, 5, 30, 1, 86}

// # ASN.1 Definition:
//
//	id-mat-timeOfLastAccess OBJECT IDENTIFIER ::= {id-mat 87}
var Id_mat_timeOfLastAccess asn1.ObjectIdentifier = []int{2, 5, 30, 1, 87}

// # ASN.1 Definition:
//
//	id-mat-agreementID OBJECT IDENTIFIER ::= {id-mat 88}
var Id_mat_agreementID asn1.ObjectIdentifier = []int{2, 5, 30, 1, 88}

// # ASN.1 Definition:
//
//	id-mat-agreementVersion OBJECT IDENTIFIER ::= {id-mat 89}
var Id_mat_agreementVersion asn1.ObjectIdentifier = []int{2, 5, 30, 1, 89}

// # ASN.1 Definition:
//
//	id-mat-hOBRole OBJECT IDENTIFIER ::= {id-mat 90}
var Id_mat_hOBRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 90}

// # ASN.1 Definition:
//
//	id-mat-shadowingSubject OBJECT IDENTIFIER ::= {id-mat 91}
var Id_mat_shadowingSubject asn1.ObjectIdentifier = []int{2, 5, 30, 1, 91}

// # ASN.1 Definition:
//
//	id-mat-updateMode OBJECT IDENTIFIER ::= {id-mat 92}
var Id_mat_updateMode asn1.ObjectIdentifier = []int{2, 5, 30, 1, 92}

// # ASN.1 Definition:
//
//	id-mat-masterAccessPoint OBJECT IDENTIFIER ::= {id-mat 93}
var Id_mat_masterAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 93}

// # ASN.1 Definition:
//
//	id-mat-secondaryShadows OBJECT IDENTIFIER ::= {id-mat 94}
var Id_mat_secondaryShadows asn1.ObjectIdentifier = []int{2, 5, 30, 1, 94}

// # ASN.1 Definition:
//
//	id-mat-shadowingRole OBJECT IDENTIFIER ::= {id-mat 95}
var Id_mat_shadowingRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 95}

// # ASN.1 Definition:
//
//	id-mat-lastUpdateTime OBJECT IDENTIFIER ::= {id-mat 96}
var Id_mat_lastUpdateTime asn1.ObjectIdentifier = []int{2, 5, 30, 1, 96}

// # ASN.1 Definition:
//
//	id-mat-shadowingSchedule OBJECT IDENTIFIER ::= {id-mat 97}
var Id_mat_shadowingSchedule asn1.ObjectIdentifier = []int{2, 5, 30, 1, 97}

// # ASN.1 Definition:
//
//	id-mat-nextUpdateTime OBJECT IDENTIFIER ::= {id-mat 98}
var Id_mat_nextUpdateTime asn1.ObjectIdentifier = []int{2, 5, 30, 1, 98}

// # ASN.1 Definition:
//
//	id-mat-useDOP OBJECT IDENTIFIER ::= {id-mat 99}
var Id_mat_useDOP asn1.ObjectIdentifier = []int{2, 5, 30, 1, 99}

// # ASN.1 Definition:
//
//	id-mat-accessor OBJECT IDENTIFIER ::= {id-mat 100}
var Id_mat_accessor asn1.ObjectIdentifier = []int{2, 5, 30, 1, 100}

// # ASN.1 Definition:
//
//	id-mat-allowedInfoService OBJECT IDENTIFIER ::= {id-mat 101}
var Id_mat_allowedInfoService asn1.ObjectIdentifier = []int{2, 5, 30, 1, 101}

// # ASN.1 Definition:
//
//	id-mat-applicationContextInUse OBJECT IDENTIFIER ::= {id-mat 102}
var Id_mat_applicationContextInUse asn1.ObjectIdentifier = []int{2, 5, 30, 1, 102}

// # ASN.1 Definition:
//
//	id-mat-associationId OBJECT IDENTIFIER ::= {id-mat 103}
var Id_mat_associationId asn1.ObjectIdentifier = []int{2, 5, 30, 1, 103}

// # ASN.1 Definition:
//
//	id-mat-callingAETitle OBJECT IDENTIFIER ::= {id-mat 104}
var Id_mat_callingAETitle asn1.ObjectIdentifier = []int{2, 5, 30, 1, 104}

// # ASN.1 Definition:
//
//	id-mat-disAllowedInfoService OBJECT IDENTIFIER ::= {id-mat 105}
var Id_mat_disAllowedInfoService asn1.ObjectIdentifier = []int{2, 5, 30, 1, 105}

// # ASN.1 Definition:
//
//	id-mat-maxEntriesReturned OBJECT IDENTIFIER ::= {id-mat 106}
var Id_mat_maxEntriesReturned asn1.ObjectIdentifier = []int{2, 5, 30, 1, 106}

// # ASN.1 Definition:
//
//	id-mat-maxTimeForResult OBJECT IDENTIFIER ::= {id-mat 107}
var Id_mat_maxTimeForResult asn1.ObjectIdentifier = []int{2, 5, 30, 1, 107}

// # ASN.1 Definition:
//
//	id-mat-modifyDNRenameOnlyOpsProc OBJECT IDENTIFIER ::= {id-mat 108}
var Id_mat_modifyDNRenameOnlyOpsProc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 108}

// # ASN.1 Definition:
//
//	id-mat-serviceDesc OBJECT IDENTIFIER ::= {id-mat 109}
var Id_mat_serviceDesc asn1.ObjectIdentifier = []int{2, 5, 30, 1, 109}

// # ASN.1 Definition:
//
//	id-mat-serviceId OBJECT IDENTIFIER ::= {id-mat 110}
var Id_mat_serviceId asn1.ObjectIdentifier = []int{2, 5, 30, 1, 110}

// # ASN.1 Definition:
//
//	id-mat-subSchema OBJECT IDENTIFIER ::= {id-mat 111}
var Id_mat_subSchema asn1.ObjectIdentifier = []int{2, 5, 30, 1, 111}

// # ASN.1 Definition:
//
//	id-mat-sizeLimit OBJECT IDENTIFIER ::= {id-mat 112}
var Id_mat_sizeLimit asn1.ObjectIdentifier = []int{2, 5, 30, 1, 112}

// # ASN.1 Definition:
//
//	id-mat-timeLimit OBJECT IDENTIFIER ::= {id-mat 113}
var Id_mat_timeLimit asn1.ObjectIdentifier = []int{2, 5, 30, 1, 113}

// # ASN.1 Definition:
//
//	id-mat-dirCustName OBJECT IDENTIFIER ::= {id-mat 114}
var Id_mat_dirCustName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 114}

// # ASN.1 Definition:
//
//	id-mat-dirUserName OBJECT IDENTIFIER ::= {id-mat 115}
var Id_mat_dirUserName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 115}

// # ASN.1 Definition:
//
//	id-mat-dirCustAddr OBJECT IDENTIFIER ::= {id-mat 116}
var Id_mat_dirCustAddr asn1.ObjectIdentifier = []int{2, 5, 30, 1, 116}

// # ASN.1 Definition:
//
//	id-mat-dMDName OBJECT IDENTIFIER ::= {id-mat 117}
var Id_mat_dMDName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 117}

// # ASN.1 Definition:
//
//	id-mat-accessControlScheme OBJECT IDENTIFIER ::= {id-mat 119}
var Id_mat_accessControlScheme asn1.ObjectIdentifier = []int{2, 5, 30, 1, 119}

// # ASN.1 Definition:
//
//	id-mat-administrativeRole OBJECT IDENTIFIER ::= {id-mat 120}
var Id_mat_administrativeRole asn1.ObjectIdentifier = []int{2, 5, 30, 1, 120}

// # ASN.1 Definition:
//
//	id-mat-aliasedEntryName OBJECT IDENTIFIER ::= {id-mat 121}
var Id_mat_aliasedEntryName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 121}

// # ASN.1 Definition:
//
//	id-mat-attributeTypes OBJECT IDENTIFIER ::= {id-mat 122}
var Id_mat_attributeTypes asn1.ObjectIdentifier = []int{2, 5, 30, 1, 122}

// # ASN.1 Definition:
//
//	id-mat-collectiveExclusions OBJECT IDENTIFIER ::= {id-mat 123}
var Id_mat_collectiveExclusions asn1.ObjectIdentifier = []int{2, 5, 30, 1, 123}

// # ASN.1 Definition:
//
//	id-mat-consumerKnowledge OBJECT IDENTIFIER ::= {id-mat 124}
var Id_mat_consumerKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 124}

// # ASN.1 Definition:
//
//	id-mat-createTimestamp OBJECT IDENTIFIER ::= {id-mat 125}
var Id_mat_createTimestamp asn1.ObjectIdentifier = []int{2, 5, 30, 1, 125}

// # ASN.1 Definition:
//
//	id-mat-creatorsName OBJECT IDENTIFIER ::= {id-mat 126}
var Id_mat_creatorsName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 126}

// # ASN.1 Definition:
//
//	id-mat-credentials OBJECT IDENTIFIER ::= {id-mat 127}
var Id_mat_credentials asn1.ObjectIdentifier = []int{2, 5, 30, 1, 127}

// # ASN.1 Definition:
//
//	id-mat-distName OBJECT IDENTIFIER ::= {id-mat 128}
var Id_mat_distName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 128}

// # ASN.1 Definition:
//
//	id-mat-dITContentRules OBJECT IDENTIFIER ::= {id-mat 129}
var Id_mat_dITContentRules asn1.ObjectIdentifier = []int{2, 5, 30, 1, 129}

// # ASN.1 Definition:
//
//	id-mat-dITStructureRule OBJECT IDENTIFIER ::= {id-mat 130}
var Id_mat_dITStructureRule asn1.ObjectIdentifier = []int{2, 5, 30, 1, 130}

// # ASN.1 Definition:
//
//	id-mat-dseType OBJECT IDENTIFIER ::= {id-mat 131}
var Id_mat_dseType asn1.ObjectIdentifier = []int{2, 5, 30, 1, 131}

// # ASN.1 Definition:
//
//	id-mat-entryACI OBJECT IDENTIFIER ::= {id-mat 132}
var Id_mat_entryACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 132}

// # ASN.1 Definition:
//
//	id-mat-governingSR OBJECT IDENTIFIER ::= {id-mat 133}
var Id_mat_governingSR asn1.ObjectIdentifier = []int{2, 5, 30, 1, 133}

// # ASN.1 Definition:
//
//	id-mat-matchingRules OBJECT IDENTIFIER ::= {id-mat 134}
var Id_mat_matchingRules asn1.ObjectIdentifier = []int{2, 5, 30, 1, 134}

// # ASN.1 Definition:
//
//	id-mat-matchingRuleUse OBJECT IDENTIFIER ::= {id-mat 135}
var Id_mat_matchingRuleUse asn1.ObjectIdentifier = []int{2, 5, 30, 1, 135}

// # ASN.1 Definition:
//
//	id-mat-modifiersName OBJECT IDENTIFIER ::= {id-mat 136}
var Id_mat_modifiersName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 136}

// # ASN.1 Definition:
//
//	id-mat-modifyTimestamp OBJECT IDENTIFIER ::= {id-mat 137}
var Id_mat_modifyTimestamp asn1.ObjectIdentifier = []int{2, 5, 30, 1, 137}

// # ASN.1 Definition:
//
//	id-mat-myAccessPoint OBJECT IDENTIFIER ::= {id-mat 138}
var Id_mat_myAccessPoint asn1.ObjectIdentifier = []int{2, 5, 30, 1, 138}

// # ASN.1 Definition:
//
//	id-mat-nonSpecificKnowledge OBJECT IDENTIFIER ::= {id-mat 139}
var Id_mat_nonSpecificKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 139}

// # ASN.1 Definition:
//
//	id-mat-objectClass OBJECT IDENTIFIER ::= {id-mat 140}
var Id_mat_objectClass asn1.ObjectIdentifier = []int{2, 5, 30, 1, 140}

// # ASN.1 Definition:
//
//	id-mat-objectClasses OBJECT IDENTIFIER ::= {id-mat 141}
var Id_mat_objectClasses asn1.ObjectIdentifier = []int{2, 5, 30, 1, 141}

// # ASN.1 Definition:
//
//	id-mat-prescriptiveACI OBJECT IDENTIFIER ::= {id-mat 142}
var Id_mat_prescriptiveACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 142}

// # ASN.1 Definition:
//
//	id-mat-nameForms OBJECT IDENTIFIER ::= {id-mat 143}
var Id_mat_nameForms asn1.ObjectIdentifier = []int{2, 5, 30, 1, 143}

// # ASN.1 Definition:
//
//	id-mat-specificKnowledge OBJECT IDENTIFIER ::= {id-mat 144}
var Id_mat_specificKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 144}

// # ASN.1 Definition:
//
//	id-mat-structuralObjectClass OBJECT IDENTIFIER ::= {id-mat 145}
var Id_mat_structuralObjectClass asn1.ObjectIdentifier = []int{2, 5, 30, 1, 145}

// # ASN.1 Definition:
//
//	id-mat-subentryACI OBJECT IDENTIFIER ::= {id-mat 146}
var Id_mat_subentryACI asn1.ObjectIdentifier = []int{2, 5, 30, 1, 146}

// # ASN.1 Definition:
//
//	id-mat-subtreeSpecification OBJECT IDENTIFIER ::= {id-mat 147}
var Id_mat_subtreeSpecification asn1.ObjectIdentifier = []int{2, 5, 30, 1, 147}

// # ASN.1 Definition:
//
//	id-mat-superiorKnowledge OBJECT IDENTIFIER ::= {id-mat 148}
var Id_mat_superiorKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 148}

// # ASN.1 Definition:
//
//	id-mat-supplierKnowledge OBJECT IDENTIFIER ::= {id-mat 149}
var Id_mat_supplierKnowledge asn1.ObjectIdentifier = []int{2, 5, 30, 1, 149}

// # ASN.1 Definition:
//
//	id-mat-dirCommonName OBJECT IDENTIFIER ::= {id-mat 150}
var Id_mat_dirCommonName asn1.ObjectIdentifier = []int{2, 5, 30, 1, 150}

// # ASN.1 Definition:
//
//	id-moc-dsa OBJECT IDENTIFIER ::= {id-moc 0}
var Id_moc_dsa asn1.ObjectIdentifier = []int{2, 5, 30, 2, 0}

// # ASN.1 Definition:
//
//	id-moc-dse OBJECT IDENTIFIER ::= {id-moc 1}
var Id_moc_dse asn1.ObjectIdentifier = []int{2, 5, 30, 2, 1}

// # ASN.1 Definition:
//
//	id-moc-knownDSA OBJECT IDENTIFIER ::= {id-moc 2}
var Id_moc_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 2}

// # ASN.1 Definition:
//
//	id-moc-knownDUA OBJECT IDENTIFIER ::= {id-moc 3}
var Id_moc_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 3}

// # ASN.1 Definition:
//
//	id-moc-dUA OBJECT IDENTIFIER ::= {id-moc 4}
var Id_moc_dUA asn1.ObjectIdentifier = []int{2, 5, 30, 2, 4}

// # ASN.1 Definition:
//
//	id-moc-nHOBMO OBJECT IDENTIFIER ::= {id-moc 5}
var Id_moc_nHOBMO asn1.ObjectIdentifier = []int{2, 5, 30, 2, 5}

// # ASN.1 Definition:
//
//	id-moc-hOBMO OBJECT IDENTIFIER ::= {id-moc 6}
var Id_moc_hOBMO asn1.ObjectIdentifier = []int{2, 5, 30, 2, 6}

// # ASN.1 Definition:
//
//	id-moc-shadowingAgreement OBJECT IDENTIFIER ::= {id-moc 7}
var Id_moc_shadowingAgreement asn1.ObjectIdentifier = []int{2, 5, 30, 2, 7}

// # ASN.1 Definition:
//
//	id-moc-ULconnEnd OBJECT IDENTIFIER ::= {id-moc 8}
var Id_moc_ULconnEnd asn1.ObjectIdentifier = []int{2, 5, 30, 2, 8}

// # ASN.1 Definition:
//
//	id-moc-disManagedObject OBJECT IDENTIFIER ::= {id-moc 9}
var Id_moc_disManagedObject asn1.ObjectIdentifier = []int{2, 5, 30, 2, 9}

// # ASN.1 Definition:
//
//	id-moc-dirCust OBJECT IDENTIFIER ::= {id-moc 10}
var Id_moc_dirCust asn1.ObjectIdentifier = []int{2, 5, 30, 2, 10}

// # ASN.1 Definition:
//
//	id-moc-dirUser OBJECT IDENTIFIER ::= {id-moc 11}
var Id_moc_dirUser asn1.ObjectIdentifier = []int{2, 5, 30, 2, 11}

// # ASN.1 Definition:
//
//	id-moc-dMD OBJECT IDENTIFIER ::= {id-moc 12}
var Id_moc_dMD asn1.ObjectIdentifier = []int{2, 5, 30, 2, 12}

// # ASN.1 Definition:
//
//	id-mnb-dsa-name-binding OBJECT IDENTIFIER ::= {id-mnb 0}
var Id_mnb_dsa_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 0}

// # ASN.1 Definition:
//
//	id-mnb-dse-name-binding OBJECT IDENTIFIER ::= {id-mnb 1}
var Id_mnb_dse_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 1}

// # ASN.1 Definition:
//
//	id-mnb-knownDSA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 2}
var Id_mnb_knownDSA_dSA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 2}

// # ASN.1 Definition:
//
//	id-mnb-knownDUA-dSA-name-binding OBJECT IDENTIFIER ::= {id-mnb 3}
var Id_mnb_knownDUA_dSA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 3}

// # ASN.1 Definition:
//
//	id-mnb-acseInvoc-knownDSA OBJECT IDENTIFIER ::= {id-mnb 4}
var Id_mnb_acseInvoc_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 4}

// # ASN.1 Definition:
//
//	id-mnb-acseInvoc-knownDUA OBJECT IDENTIFIER ::= {id-mnb 5}
var Id_mnb_acseInvoc_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 5}

// # ASN.1 Definition:
//
//	id-mnb-nHOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 6}
var Id_mnb_nHOB_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 6}

// # ASN.1 Definition:
//
//	id-mnb-hOB-name-binding OBJECT IDENTIFIER ::= {id-mnb 7}
var Id_mnb_hOB_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 7}

// # ASN.1 Definition:
//
//	id-mnb-shadowingAgreement-nb OBJECT IDENTIFIER ::= {id-mnb 8}
var Id_mnb_shadowingAgreement_nb asn1.ObjectIdentifier = []int{2, 5, 30, 3, 8}

// # ASN.1 Definition:
//
//	id-mnb-ULconnEnd-knownDSA OBJECT IDENTIFIER ::= {id-mnb 9}
var Id_mnb_ULconnEnd_knownDSA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 9}

// # ASN.1 Definition:
//
//	id-mnb-ULconnEnd-knownDUA OBJECT IDENTIFIER ::= {id-mnb 10}
var Id_mnb_ULconnEnd_knownDUA asn1.ObjectIdentifier = []int{2, 5, 30, 3, 10}

// # ASN.1 Definition:
//
//	id-mnb-dis-Customer-name-binding OBJECT IDENTIFIER ::= {id-mnb 11}
var Id_mnb_dis_Customer_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 11}

// # ASN.1 Definition:
//
//	id-mnb-knownDSA-dUA-name-binding OBJECT IDENTIFIER ::= {id-mnb 12}
var Id_mnb_knownDSA_dUA_name_binding asn1.ObjectIdentifier = []int{2, 5, 30, 3, 12}

// # ASN.1 Definition:
//
//	id-mnb-DirCust-DMD OBJECT IDENTIFIER ::= {id-mnb 13}
var Id_mnb_DirCust_DMD asn1.ObjectIdentifier = []int{2, 5, 30, 3, 13}

// # ASN.1 Definition:
//
//	id-mnb-DirUser-DirCust OBJECT IDENTIFIER ::= {id-mnb 14}
var Id_mnb_DirUser_DirCust asn1.ObjectIdentifier = []int{2, 5, 30, 3, 14}

// # ASN.1 Definition:
//
//	id-mp-dsaPackage OBJECT IDENTIFIER ::= {id-mp 0}
var Id_mp_dsaPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 0}

// # ASN.1 Definition:
//
//	id-mp-readPackage OBJECT IDENTIFIER ::= {id-mp 1}
var Id_mp_readPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 1}

// # ASN.1 Definition:
//
//	id-mp-comparePackage OBJECT IDENTIFIER ::= {id-mp 2}
var Id_mp_comparePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 2}

// # ASN.1 Definition:
//
//	id-mp-abandonPackage OBJECT IDENTIFIER ::= {id-mp 3}
var Id_mp_abandonPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 3}

// # ASN.1 Definition:
//
//	id-mp-listPackage OBJECT IDENTIFIER ::= {id-mp 4}
var Id_mp_listPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 4}

// # ASN.1 Definition:
//
//	id-mp-searchPackage OBJECT IDENTIFIER ::= {id-mp 5}
var Id_mp_searchPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 5}

// # ASN.1 Definition:
//
//	id-mp-addPackage OBJECT IDENTIFIER ::= {id-mp 6}
var Id_mp_addPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 6}

// # ASN.1 Definition:
//
//	id-mp-removePackage OBJECT IDENTIFIER ::= {id-mp 7}
var Id_mp_removePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 7}

// # ASN.1 Definition:
//
//	id-mp-modifyPackage OBJECT IDENTIFIER ::= {id-mp 8}
var Id_mp_modifyPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 8}

// # ASN.1 Definition:
//
//	id-mp-modifyDNPackage OBJECT IDENTIFIER ::= {id-mp 9}
var Id_mp_modifyDNPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 9}

// # ASN.1 Definition:
//
//	id-mp-chainedReadPackage OBJECT IDENTIFIER ::= {id-mp 10}
var Id_mp_chainedReadPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 10}

// # ASN.1 Definition:
//
//	id-mp-chainedComparePackage OBJECT IDENTIFIER ::= {id-mp 11}
var Id_mp_chainedComparePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 11}

// # ASN.1 Definition:
//
//	id-mp-chainedAbandonPackage OBJECT IDENTIFIER ::= {id-mp 12}
var Id_mp_chainedAbandonPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 12}

// # ASN.1 Definition:
//
//	id-mp-chainedListPackage OBJECT IDENTIFIER ::= {id-mp 13}
var Id_mp_chainedListPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 13}

// # ASN.1 Definition:
//
//	id-mp-chainedSearchPackage OBJECT IDENTIFIER ::= {id-mp 14}
var Id_mp_chainedSearchPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 14}

// # ASN.1 Definition:
//
//	id-mp-chainedAddPackage OBJECT IDENTIFIER ::= {id-mp 15}
var Id_mp_chainedAddPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 15}

// # ASN.1 Definition:
//
//	id-mp-chainedRemovePackage OBJECT IDENTIFIER ::= {id-mp 16}
var Id_mp_chainedRemovePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 16}

// # ASN.1 Definition:
//
//	id-mp-chainedModifyPackage OBJECT IDENTIFIER ::= {id-mp 17}
var Id_mp_chainedModifyPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 17}

// # ASN.1 Definition:
//
//	id-mp-chainedModifyDNPackage OBJECT IDENTIFIER ::= {id-mp 18}
var Id_mp_chainedModifyDNPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 18}

// # ASN.1 Definition:
//
//	id-mp-dsePackage OBJECT IDENTIFIER ::= {id-mp 19}
var Id_mp_dsePackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 19}

// # ASN.1 Definition:
//
//	id-mp-knownDSAPackage OBJECT IDENTIFIER ::= {id-mp 20}
var Id_mp_knownDSAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 20}

// # ASN.1 Definition:
//
//	id-mp-knownDUAPackage OBJECT IDENTIFIER ::= {id-mp 21}
var Id_mp_knownDUAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 21}

// # ASN.1 Definition:
//
//	id-mp-dUAPackage OBJECT IDENTIFIER ::= {id-mp 22}
var Id_mp_dUAPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 22}

// # ASN.1 Definition:
//
//	id-mp-nHOBPackage OBJECT IDENTIFIER ::= {id-mp 23}
var Id_mp_nHOBPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 23}

// # ASN.1 Definition:
//
//	id-mp-hOBPackage OBJECT IDENTIFIER ::= {id-mp 24}
var Id_mp_hOBPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 24}

// # ASN.1 Definition:
//
//	id-mp-shadowingAgreementPackage OBJECT IDENTIFIER ::= {id-mp 25}
var Id_mp_shadowingAgreementPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 25}

// # ASN.1 Definition:
//
//	id-mp-ULconnEndPackage OBJECT IDENTIFIER ::= {id-mp 26}
var Id_mp_ULconnEndPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 26}

// # ASN.1 Definition:
//
//	id-mp-disPackage OBJECT IDENTIFIER ::= {id-mp 27}
var Id_mp_disPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 27}

// # ASN.1 Definition:
//
//	id-mp-dcsPackage OBJECT IDENTIFIER ::= {id-mp 28}
var Id_mp_dcsPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 28}

// # ASN.1 Definition:
//
//	id-mp-dirCust OBJECT IDENTIFIER ::= {id-mp 29}
var Id_mp_dirCust asn1.ObjectIdentifier = []int{2, 5, 30, 4, 29}

// # ASN.1 Definition:
//
//	id-mp-dirUser OBJECT IDENTIFIER ::= {id-mp 30}
var Id_mp_dirUser asn1.ObjectIdentifier = []int{2, 5, 30, 4, 30}

// # ASN.1 Definition:
//
//	id-mp-dMD OBJECT IDENTIFIER ::= {id-mp 31}
var Id_mp_dMD asn1.ObjectIdentifier = []int{2, 5, 30, 4, 31}

// # ASN.1 Definition:
//
//	id-mp-dsPackage OBJECT IDENTIFIER ::= {id-mp 32}
var Id_mp_dsPackage asn1.ObjectIdentifier = []int{2, 5, 30, 4, 32}

// # ASN.1 Definition:
//
//	id-mpa-nameProblem OBJECT IDENTIFIER ::= {id-mpa 1}
var Id_mpa_nameProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 1}

// # ASN.1 Definition:
//
//	id-mpa-traceInformation OBJECT IDENTIFIER ::= {id-mpa 2}
var Id_mpa_traceInformation asn1.ObjectIdentifier = []int{2, 5, 30, 5, 2}

// # ASN.1 Definition:
//
//	id-mpa-serviceProblem OBJECT IDENTIFIER ::= {id-mpa 3}
var Id_mpa_serviceProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 3}

// # ASN.1 Definition:
//
//	id-mpa-entryName OBJECT IDENTIFIER ::= {id-mpa 4}
var Id_mpa_entryName asn1.ObjectIdentifier = []int{2, 5, 30, 5, 4}

// # ASN.1 Definition:
//
//	id-mpa-operation OBJECT IDENTIFIER ::= {id-mpa 5}
var Id_mpa_operation asn1.ObjectIdentifier = []int{2, 5, 30, 5, 5}

// # ASN.1 Definition:
//
//	id-mpa-attributeProblem OBJECT IDENTIFIER ::= {id-mpa 6}
var Id_mpa_attributeProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 6}

// # ASN.1 Definition:
//
//	id-mpa-attributeType OBJECT IDENTIFIER ::= {id-mpa 7}
var Id_mpa_attributeType asn1.ObjectIdentifier = []int{2, 5, 30, 5, 7}

// # ASN.1 Definition:
//
//	id-mpa-shadowProblem OBJECT IDENTIFIER ::= {id-mpa 8}
var Id_mpa_shadowProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 8}

// # ASN.1 Definition:
//
//	id-mpa-attributeValue OBJECT IDENTIFIER ::= {id-mpa 9}
var Id_mpa_attributeValue asn1.ObjectIdentifier = []int{2, 5, 30, 5, 9}

// # ASN.1 Definition:
//
//	id-mpa-resource OBJECT IDENTIFIER ::= {id-mpa 10}
var Id_mpa_resource asn1.ObjectIdentifier = []int{2, 5, 30, 5, 10}

// # ASN.1 Definition:
//
//	id-mpa-authenReason OBJECT IDENTIFIER ::= {id-mpa 11}
var Id_mpa_authenReason asn1.ObjectIdentifier = []int{2, 5, 30, 5, 11}

// # ASN.1 Definition:
//
//	id-mpa-updateProblem OBJECT IDENTIFIER ::= {id-mpa 12}
var Id_mpa_updateProblem asn1.ObjectIdentifier = []int{2, 5, 30, 5, 12}

// # ASN.1 Definition:
//
//	id-mpa-extensions OBJECT IDENTIFIER ::= {id-mpa 15}
var Id_mpa_extensions asn1.ObjectIdentifier = []int{2, 5, 30, 5, 15}

// # ASN.1 Definition:
//
//	id-mpa-aliasedRDNs OBJECT IDENTIFIER ::= {id-mpa 16}
var Id_mpa_aliasedRDNs asn1.ObjectIdentifier = []int{2, 5, 30, 5, 16}

// # ASN.1 Definition:
//
//	id-mpa-aliasDereferenced OBJECT IDENTIFIER ::= {id-mpa 17}
var Id_mpa_aliasDereferenced asn1.ObjectIdentifier = []int{2, 5, 30, 5, 17}

// # ASN.1 Definition:
//
//	id-mpa-referenceType OBJECT IDENTIFIER ::= {id-mpa 18}
var Id_mpa_referenceType asn1.ObjectIdentifier = []int{2, 5, 30, 5, 18}

// # ASN.1 Definition:
//
//	id-mpa-operationProgress OBJECT IDENTIFIER ::= {id-mpa 19}
var Id_mpa_operationProgress asn1.ObjectIdentifier = []int{2, 5, 30, 5, 19}

// # ASN.1 Definition:
//
//	id-mpa-pDU OBJECT IDENTIFIER ::= {id-mpa 20}
var Id_mpa_pDU asn1.ObjectIdentifier = []int{2, 5, 30, 5, 20}

// # ASN.1 Definition:
//
//	id-mpa-opId OBJECT IDENTIFIER ::= {id-mpa 21}
var Id_mpa_opId asn1.ObjectIdentifier = []int{2, 5, 30, 5, 21}

// # ASN.1 Definition:
//
//	id-mpa-nhob-bind-id OBJECT IDENTIFIER ::= {id-mpa 22}
var Id_mpa_nhob_bind_id asn1.ObjectIdentifier = []int{2, 5, 30, 5, 22}

// # ASN.1 Definition:
//
//	id-mpa-mhob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 23}
var Id_mpa_mhob_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 23}

// # ASN.1 Definition:
//
//	id-mpa-hob-bind-id OBJECT IDENTIFIER ::= {id-mpa 24}
var Id_mpa_hob_bind_id asn1.ObjectIdentifier = []int{2, 5, 30, 5, 24}

// # ASN.1 Definition:
//
//	id-mpa-hob-dop-prob OBJECT IDENTIFIER ::= {id-mpa 25}
var Id_mpa_hob_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 25}

// # ASN.1 Definition:
//
//	id-mpa-shadowing-dop-prob OBJECT IDENTIFIER ::= {id-mpa 26}
var Id_mpa_shadowing_dop_prob asn1.ObjectIdentifier = []int{2, 5, 30, 5, 26}

// # ASN.1 Definition:
//
//	id-mpa-opIdDN OBJECT IDENTIFIER ::= {id-mpa 27}
var Id_mpa_opIdDN asn1.ObjectIdentifier = []int{2, 5, 30, 5, 27}

// # ASN.1 Definition:
//
//	DirectoryInformationServiceElement-operationType ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type DirectoryInformationServiceElement_operationType = asn1.BitString

const DirectoryInformationServiceElement_operationType_Read int32 = 0

const DirectoryInformationServiceElement_operationType_Compare int32 = 1

const DirectoryInformationServiceElement_operationType_Abandon int32 = 2

const DirectoryInformationServiceElement_operationType_List int32 = 3

const DirectoryInformationServiceElement_operationType_Search int32 = 4

const DirectoryInformationServiceElement_operationType_AddEntry int32 = 5

const DirectoryInformationServiceElement_operationType_RemoveEntry int32 = 6

const DirectoryInformationServiceElement_operationType_ModifyEntry int32 = 7

const DirectoryInformationServiceElement_operationType_ModifyDN int32 = 8

// # ASN.1 Definition:
//
//	SubSchemaSyntax-Item-subSchema ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type SubSchemaSyntax_Item_subSchema struct {
	StructureRules [](DITStructureRuleDescription) `asn1:"optional,explicit,tag:1"`
	ContentRules   [](DITContentRuleDescription)   `asn1:"optional,explicit,tag:2"`
	MatchingRules  [](MatchingRuleDescription)     `asn1:"optional,explicit,tag:3"`
	AttributeTypes [](AttributeTypeDescription)    `asn1:"optional,explicit,tag:4"`
	ObjectClasses  [](ObjectClassDescription)      `asn1:"optional,explicit,tag:5"`
	NameForms      [](NameFormDescription)         `asn1:"optional,explicit,tag:6"`
	MatchRuleUses  [](MatchingRuleUseDescription)  `asn1:"optional,explicit,tag:7"`
}

// # ASN.1 Definition:
//
//	SubSchemaSyntax-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type SubSchemaSyntax_Item struct {
	Name      Name                           `asn1:"explicit,tag:1"`
	SubSchema SubSchemaSyntax_Item_subSchema `asn1:"explicit,tag:2"`
}
