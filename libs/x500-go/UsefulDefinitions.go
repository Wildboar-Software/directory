package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	ID    ::= OBJECT IDENTIFIER
type ID = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	ds ID ::= {joint-iso-itu-t ds(5)}
var Ds ID = []int{2, 5}

// # ASN.1 Definition:
//
//	id ID ::= {joint-iso-itu-t registration-procedures(17) module(1) directory-defs(2)}
var Id ID = []int{2, 17, 1, 2}

// # ASN.1 Definition:
//
//	internet            ID ::= {iso(1) identified-organization(3) dod(6) internet(1)}
var Internet ID = []int{1, 3, 6, 1}

// # ASN.1 Definition:
//
//	ldap-dir            ID ::= {internet directory(1)}
var Ldap_dir ID = []int{1, 3, 6, 1, 1}

// # ASN.1 Definition:
//
//	intSecurity         ID ::= {internet security(5)}
var IntSecurity ID = []int{1, 3, 6, 1, 5}

// # ASN.1 Definition:
//
//	ldap-enterprise     ID ::= {internet private(4) enterprise(1)}
var Ldap_enterprise ID = []int{1, 3, 6, 1, 4, 1}

// # ASN.1 Definition:
//
//	ldap-x509           ID ::= {ldap-dir x509(15)}
var Ldap_x509 ID = []int{1, 3, 6, 1, 1, 15}

// # ASN.1 Definition:
//
//	ldap-openLDAP       ID ::= {ldap-enterprise openLDAP(4203) ldap(1)}
var Ldap_openLDAP ID = []int{1, 3, 6, 1, 4, 1, 4203, 1}

// # ASN.1 Definition:
//
//	openLDAP-attributes ID ::= {ldap-openLDAP attributeType(3)}
var OpenLDAP_attributes ID = []int{1, 3, 6, 1, 4, 1, 4203, 1, 3}

// # ASN.1 Definition:
//
//	openLDAP-controls   ID ::= {ldap-openLDAP controls(10)}
var OpenLDAP_controls ID = []int{1, 3, 6, 1, 4, 1, 4203, 1, 10}

// # ASN.1 Definition:
//
//	ldap-wall           ID ::= {ldap-enterprise wahl(1466)}
var Ldap_wall ID = []int{1, 3, 6, 1, 4, 1, 1466}

// # ASN.1 Definition:
//
//	ldap-dynExt         ID ::= {ldap-wall 101 119}
var Ldap_dynExt ID = []int{1, 3, 6, 1, 4, 1, 1466, 101, 119}

// # ASN.1 Definition:
//
//	ldap-attr           ID ::= {ldap-wall 101 120}
var Ldap_attr ID = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120}

// # ASN.1 Definition:
//
//	ldap-match          ID ::= {ldap-wall 109 114}
var Ldap_match ID = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114}

// # ASN.1 Definition:
//
//	ldap-syntax         ID ::= {ldap-wall 115 121 1}
var Ldap_syntax ID = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1}

// # ASN.1 Definition:
//
//	cosine              ID ::= {itu-t(0) data(9) pss(2342) ucl(19200300) pilot(100)}
var Cosine ID = []int{0, 9, 2342, 19200300, 100}

// # ASN.1 Definition:
//
//	cosineAttr          ID ::= {cosine pilotAttributeType(1)}
var CosineAttr ID = []int{0, 9, 2342, 19200300, 100, 1}

// # ASN.1 Definition:
//
//	module                                   ID ::= {ds 1}
var Module ID = []int{2, 5, 1}

// # ASN.1 Definition:
//
//	serviceElement                           ID ::= {ds 2}
var ServiceElement ID = []int{2, 5, 2}

// # ASN.1 Definition:
//
//	applicationContext                       ID ::= {ds 3}
var ApplicationContext ID = []int{2, 5, 3}

// # ASN.1 Definition:
//
//	attributeType                            ID ::= {ds 4}
var AttributeTypeOID ID = []int{2, 5, 4}

// # ASN.1 Definition:
//
//	attributeSyntaxVendor                    ID ::= {ds 5}
var AttributeSyntaxVendor ID = []int{2, 5, 5}

// # ASN.1 Definition:
//
//	objectClass                              ID ::= {ds 6}
var ObjectClass ID = []int{2, 5, 6}

// # ASN.1 Definition:
//
//	attributeSet                             ID ::= {ds 7}
var AttributeSet ID = []int{2, 5, 7}

// # ASN.1 Definition:
//
//	algorithm                                ID ::= {ds 8}
var Algorithm ID = []int{2, 5, 8}

// # ASN.1 Definition:
//
//	abstractSyntax                           ID ::= {ds 9}
var AbstractSyntax ID = []int{2, 5, 9}

// # ASN.1 Definition:
//
//	object                                   ID ::= {ds 10}
var Object ID = []int{2, 5, 10}

// # ASN.1 Definition:
//
//	port                                     ID ::= {ds 11}
var Port ID = []int{2, 5, 11}

// # ASN.1 Definition:
//
//	dsaOperationalAttribute                  ID ::= {ds 12}
var DsaOperationalAttribute ID = []int{2, 5, 12}

// # ASN.1 Definition:
//
//	matchingRule                             ID ::= {ds 13}
var MatchingRule ID = []int{2, 5, 13}

// # ASN.1 Definition:
//
//	knowledgeMatchingRule                    ID ::= {ds 14}
var KnowledgeMatchingRule ID = []int{2, 5, 14}

// # ASN.1 Definition:
//
//	nameForm                                 ID ::= {ds 15}
var NameForm ID = []int{2, 5, 15}

// # ASN.1 Definition:
//
//	group                                    ID ::= {ds 16}
var Group ID = []int{2, 5, 16}

// # ASN.1 Definition:
//
//	subentry                                 ID ::= {ds 17}
var Subentry ID = []int{2, 5, 17}

// # ASN.1 Definition:
//
//	operationalAttributeType                 ID ::= {ds 18}
var OperationalAttributeType ID = []int{2, 5, 18}

// # ASN.1 Definition:
//
//	operationalBinding                       ID ::= {ds 19}
var OperationalBinding ID = []int{2, 5, 19}

// # ASN.1 Definition:
//
//	schemaObjectClass                        ID ::= {ds 20}
var SchemaObjectClass ID = []int{2, 5, 20}

// # ASN.1 Definition:
//
//	schemaOperationalAttribute               ID ::= {ds 21}
var SchemaOperationalAttribute ID = []int{2, 5, 21}

// # ASN.1 Definition:
//
//	administrativeRoles                      ID ::= {ds 23}
var AdministrativeRoles ID = []int{2, 5, 23}

// # ASN.1 Definition:
//
//	accessControlAttribute                   ID ::= {ds 24}
var AccessControlAttribute ID = []int{2, 5, 24}

// # ASN.1 Definition:
//
//	rosObject                                ID ::= {ds 25}
var RosObject ID = []int{2, 5, 25}

// # ASN.1 Definition:
//
//	contract                                 ID ::= {ds 26}
var Contract ID = []int{2, 5, 26}

// # ASN.1 Definition:
//
//	package                                  ID ::= {ds 27}
var Package ID = []int{2, 5, 27}

// # ASN.1 Definition:
//
//	accessControlSchemes                     ID ::= {ds 28}
var AccessControlSchemes ID = []int{2, 5, 28}

// # ASN.1 Definition:
//
//	certificateExtension                     ID ::= {ds 29}
var CertificateExtension ID = []int{2, 5, 29}

// # ASN.1 Definition:
//
//	managementObject                         ID ::= {ds 30}
var ManagementObject ID = []int{2, 5, 30}

// # ASN.1 Definition:
//
//	attributeValueContext                    ID ::= {ds 31}
var AttributeValueContext ID = []int{2, 5, 31}

// # ASN.1 Definition:
//
//	securityExchange                         ID ::= {ds 32}
var SecurityExchange ID = []int{2, 5, 32}

// # ASN.1 Definition:
//
//	idmProtocol                              ID ::= {ds 33}
var IdmProtocol ID = []int{2, 5, 33}

// # ASN.1 Definition:
//
//	problem                                  ID ::= {ds 34}
var Problem ID = []int{2, 5, 34}

// # ASN.1 Definition:
//
//	notification                             ID ::= {ds 35}
var Notification ID = []int{2, 5, 35}

// # ASN.1 Definition:
//
//	matchingRestriction                      ID ::= {ds 36}
var MatchingRestriction ID = []int{2, 5, 36}

// # ASN.1 Definition:
//
//	controlAttributeType                     ID ::= {ds 37}
var ControlAttributeType ID = []int{2, 5, 37}

// # ASN.1 Definition:
//
//	keyPurposes                              ID ::= {ds 38}
var KeyPurposes ID = []int{2, 5, 38}

// # ASN.1 Definition:
//
//	passwordQuality                          ID ::= {ds 39}
var PasswordQuality ID = []int{2, 5, 39}

// # ASN.1 Definition:
//
//	attributeSyntax                          ID ::= {ds 40}
var AttributeSyntax ID = []int{2, 5, 40}

// # ASN.1 Definition:
//
//	avRestriction                            ID ::= {ds 41}
var AvRestriction ID = []int{2, 5, 41}

// # ASN.1 Definition:
//
//	cmsContentType                           ID ::= {ds 42}
var CmsContentType ID = []int{2, 5, 42}

// # ASN.1 Definition:
//
//	usefulDefinitions                        ID ::= {module usefulDefinitions(0) 9}
var UsefulDefinitions ID = []int{2, 5, 1, 0, 9}

// # ASN.1 Definition:
//
//	informationFramework                     ID ::= {module informationFramework(1) 9}
var InformationFramework ID = []int{2, 5, 1, 1, 9}

// # ASN.1 Definition:
//
//	directoryAbstractService                 ID ::= {module directoryAbstractService(2) 9}
var DirectoryAbstractService ID = []int{2, 5, 1, 2, 9}

// # ASN.1 Definition:
//
//	distributedOperations                    ID ::= {module distributedOperations(3) 9}
var DistributedOperations ID = []int{2, 5, 1, 3, 9}

// # ASN.1 Definition:
//
//	protocolObjectIdentifiers                ID ::= {module protocolObjectIdentifiers(4) 9}
var ProtocolObjectIdentifiers ID = []int{2, 5, 1, 4, 9}

// # ASN.1 Definition:
//
//	selectedAttributeTypes                   ID ::= {module selectedAttributeTypes(5) 9}
var SelectedAttributeTypes ID = []int{2, 5, 1, 5, 9}

// # ASN.1 Definition:
//
//	selectedObjectClasses                    ID ::= {module selectedObjectClasses(6) 9}
var SelectedObjectClasses ID = []int{2, 5, 1, 6, 9}

// # ASN.1 Definition:
//
//	authenticationFramework                  ID ::= {module authenticationFramework(7) 9}
var AuthenticationFramework ID = []int{2, 5, 1, 7, 9}

// # ASN.1 Definition:
//
//	algorithmObjectIdentifiers               ID ::= {module algorithmObjectIdentifiers(8) 9}
var AlgorithmObjectIdentifiers ID = []int{2, 5, 1, 8, 9}

// # ASN.1 Definition:
//
//	directoryObjectIdentifiers               ID ::= {module directoryObjectIdentifiers(9) 9}
var DirectoryObjectIdentifiers ID = []int{2, 5, 1, 9, 9}

// # ASN.1 Definition:
//
//	upperBounds                              ID ::= {module upperBounds(10) 9}
var UpperBounds ID = []int{2, 5, 1, 10, 9}

// # ASN.1 Definition:
//
//	dap                                      ID ::= {module dap(11) 9}
var Dap ID = []int{2, 5, 1, 11, 9}

// # ASN.1 Definition:
//
//	dsp                                      ID ::= {module dsp(12) 9}
var Dsp ID = []int{2, 5, 1, 12, 9}

// # ASN.1 Definition:
//
//	distributedDirectoryOIDs                 ID ::= {module distributedDirectoryOIDs(13) 9}
var DistributedDirectoryOIDs ID = []int{2, 5, 1, 13, 9}

// # ASN.1 Definition:
//
//	directoryShadowOIDs                      ID ::= {module directoryShadowOIDs(14) 9}
var DirectoryShadowOIDs ID = []int{2, 5, 1, 14, 9}

// # ASN.1 Definition:
//
//	directoryShadowAbstractService           ID ::= {module directoryShadowAbstractService(15) 9}
var DirectoryShadowAbstractService ID = []int{2, 5, 1, 15, 9}

// # ASN.1 Definition:
//
//	disp                                     ID ::= {module disp(16) 7}
var Disp ID = []int{2, 5, 1, 16, 7}

// # ASN.1 Definition:
//
//	dop                                      ID ::= {module dop(17) 7}
var Dop ID = []int{2, 5, 1, 17, 7}

// # ASN.1 Definition:
//
//	opBindingManagement                      ID ::= {module opBindingManagement(18) 9}
var OpBindingManagement ID = []int{2, 5, 1, 18, 9}

// # ASN.1 Definition:
//
//	opBindingOIDs                            ID ::= {module opBindingOIDs(19) 9}
var OpBindingOIDs ID = []int{2, 5, 1, 19, 9}

// # ASN.1 Definition:
//
//	hierarchicalOperationalBindings          ID ::= {module hierarchicalOperationalBindings(20) 9}
var HierarchicalOperationalBindings ID = []int{2, 5, 1, 20, 9}

// # ASN.1 Definition:
//
//	dsaOperationalAttributeTypes             ID ::= {module dsaOperationalAttributeTypes(22) 9}
var DsaOperationalAttributeTypes ID = []int{2, 5, 1, 22, 9}

// # ASN.1 Definition:
//
//	schemaAdministration                     ID ::= {module schemaAdministration(23) 9}
var SchemaAdministration ID = []int{2, 5, 1, 23, 9}

// # ASN.1 Definition:
//
//	basicAccessControl                       ID ::= {module basicAccessControl(24) 9}
var BasicAccessControl ID = []int{2, 5, 1, 24, 9}

// # ASN.1 Definition:
//
//	directoryOperationalBindingTypes         ID ::= {module directoryOperationalBindingTypes(25) 9}
var DirectoryOperationalBindingTypes ID = []int{2, 5, 1, 25, 9}

// # ASN.1 Definition:
//
//	certificateExtensions                    ID ::= {module certificateExtensions(26) 9}
var CertificateExtensions ID = []int{2, 5, 1, 26, 9}

// # ASN.1 Definition:
//
//	directoryManagement                      ID ::= {module directoryManagement(27) 9}
var DirectoryManagement ID = []int{2, 5, 1, 27, 9}

// # ASN.1 Definition:
//
//	enhancedSecurity                         ID ::= {module enhancedSecurity(28) 9}
var EnhancedSecurity ID = []int{2, 5, 1, 28, 9}

// # ASN.1 Definition:
//
//	directorySecurityExchanges               ID ::= {module directorySecurityExchanges (29) 9}
var DirectorySecurityExchanges ID = []int{2, 5, 1, 29, 9}

// # ASN.1 Definition:
//
//	iDMProtocolSpecification                 ID ::= {module iDMProtocolSpecification(30) 9}
var IDMProtocolSpecification ID = []int{2, 5, 1, 30, 9}

// # ASN.1 Definition:
//
//	directoryIDMProtocols                    ID ::= {module directoryIDMProtocols(31) 9}
var DirectoryIDMProtocols ID = []int{2, 5, 1, 31, 9}

// # ASN.1 Definition:
//
//	attributeCertificateDefinitions          ID ::= {module attributeCertificateDefinitions(32) 9}
var AttributeCertificateDefinitions ID = []int{2, 5, 1, 32, 9}

// # ASN.1 Definition:
//
//	serviceAdministration                    ID ::= {module serviceAdministration(33) 9}
var ServiceAdministration ID = []int{2, 5, 1, 33, 9}

// # ASN.1 Definition:
//
//	ldapAttributes                           ID ::= {module ldapAttributes(34) 9}
var LdapAttributes ID = []int{2, 5, 1, 34, 9}

// # ASN.1 Definition:
//
//	commonProtocolSpecification              ID ::= {module commonProtocolSpecification(35) 9}
var CommonProtocolSpecification ID = []int{2, 5, 1, 35, 9}

// # ASN.1 Definition:
//
//	oSIProtocolSpecification                 ID ::= {module oSIProtocolSpecification(36) 9}
var OSIProtocolSpecification ID = []int{2, 5, 1, 36, 9}

// # ASN.1 Definition:
//
//	directoryOSIProtocols                    ID ::= {module directoryOSIProtocols(37) 9}
var DirectoryOSIProtocols ID = []int{2, 5, 1, 37, 9}

// # ASN.1 Definition:
//
//	ldapSystemSchema                         ID ::= {module ldapSystemSchema(38) 9}
var LdapSystemSchema ID = []int{2, 5, 1, 38, 9}

// # ASN.1 Definition:
//
//	passwordPolicy                           ID ::= {module passwordPolicy(39) 9}
var PasswordPolicy ID = []int{2, 5, 1, 39, 9}

// # ASN.1 Definition:
//
//	pkiPmiExternalDataTypes                  ID ::= {module pkiPmiExternalDataTypes(40) 9}
var PkiPmiExternalDataTypes ID = []int{2, 5, 1, 40, 9}

// # ASN.1 Definition:
//
//	extensionAttributes                      ID ::= {module extensionAttributes(41) 9}
var ExtensionAttributes ID = []int{2, 5, 1, 41, 9}

// # ASN.1 Definition:
//
//	pkiPmiWrapper                            ID ::= {module pkiPmiWrapper(42) 9}
var PkiPmiWrapper ID = []int{2, 5, 1, 42, 9}

// # ASN.1 Definition:
//
//	avlManagement                            ID ::= {module avlManagement(43) 9}
var AvlManagement ID = []int{2, 5, 1, 43, 9}

// # ASN.1 Definition:
//
//	trustBrokerProtocol                      ID ::= {module trustBrokerProtocol(44) 9}
var TrustBrokerProtocol ID = []int{2, 5, 1, 44, 9}

// # ASN.1 Definition:
//
//	id-oc                                    ID ::= objectClass
var Id_oc ID = ObjectClass

// # ASN.1 Definition:
//
//	id-at                                    ID ::= attributeType
var Id_at ID = AttributeTypeOID

// # ASN.1 Definition:
//
//	id-as                                    ID ::= abstractSyntax
var Id_as ID = AbstractSyntax

// # ASN.1 Definition:
//
//	id-mr                                    ID ::= matchingRule
var Id_mr ID = MatchingRule

// # ASN.1 Definition:
//
//	id-nf                                    ID ::= nameForm
var Id_nf ID = NameForm

// # ASN.1 Definition:
//
//	id-sc                                    ID ::= subentry
var Id_sc ID = Subentry

// # ASN.1 Definition:
//
//	id-oa                                    ID ::= operationalAttributeType
var Id_oa ID = OperationalAttributeType

// # ASN.1 Definition:
//
//	id-ob                                    ID ::= operationalBinding
var Id_ob ID = OperationalBinding

// # ASN.1 Definition:
//
//	id-doa                                   ID ::= dsaOperationalAttribute
var Id_doa ID = DsaOperationalAttribute

// # ASN.1 Definition:
//
//	id-kmr                                   ID ::= knowledgeMatchingRule
var Id_kmr ID = KnowledgeMatchingRule

// # ASN.1 Definition:
//
//	id-soc                                   ID ::= schemaObjectClass
var Id_soc ID = SchemaObjectClass

// # ASN.1 Definition:
//
//	id-soa                                   ID ::= schemaOperationalAttribute
var Id_soa ID = SchemaOperationalAttribute

// # ASN.1 Definition:
//
//	id-ar                                    ID ::= administrativeRoles
var Id_ar ID = AdministrativeRoles

// # ASN.1 Definition:
//
//	id-aca                                   ID ::= accessControlAttribute
var Id_aca ID = AccessControlAttribute

// # ASN.1 Definition:
//
//	id-ac                                    ID ::= applicationContext
var Id_ac ID = ApplicationContext

// # ASN.1 Definition:
//
//	id-rosObject                             ID ::= rosObject
var Id_rosObject ID = RosObject

// # ASN.1 Definition:
//
//	id-contract                              ID ::= contract
var Id_contract ID = Contract

// # ASN.1 Definition:
//
//	id-package                               ID ::= package
var Id_package ID = Package

// # ASN.1 Definition:
//
//	id-acScheme                              ID ::= accessControlSchemes
var Id_acScheme ID = AccessControlSchemes

// # ASN.1 Definition:
//
//	id-ce                                    ID ::= certificateExtension
var Id_ce ID = CertificateExtension

// # ASN.1 Definition:
//
//	id-mgt                                   ID ::= managementObject
var Id_mgt ID = ManagementObject

// # ASN.1 Definition:
//
//	id-avc                                   ID ::= attributeValueContext
var Id_avc ID = AttributeValueContext

// # ASN.1 Definition:
//
//	id-se                                    ID ::= securityExchange
var Id_se ID = SecurityExchange

// # ASN.1 Definition:
//
//	id-idm                                   ID ::= idmProtocol
var Id_idm ID = IdmProtocol

// # ASN.1 Definition:
//
//	id-pr                                    ID ::= problem
var Id_pr ID = Problem

// # ASN.1 Definition:
//
//	id-not                                   ID ::= notification
var Id_not ID = Notification

// # ASN.1 Definition:
//
//	id-mre                                   ID ::= matchingRestriction
var Id_mre ID = MatchingRestriction

// # ASN.1 Definition:
//
//	id-cat                                   ID ::= controlAttributeType
var Id_cat ID = ControlAttributeType

// # ASN.1 Definition:
//
//	id-kp                                    ID ::= keyPurposes
var Id_kp ID = KeyPurposes

// # ASN.1 Definition:
//
//	id-pq                                    ID ::= passwordQuality
var Id_pq ID = PasswordQuality

// # ASN.1 Definition:
//
//	id-ats                                   ID ::= attributeSyntax
var Id_ats ID = AttributeSyntax

// # ASN.1 Definition:
//
//	id-asx                                   ID ::= attributeSyntax
var Id_asx ID = AttributeSyntax

// # ASN.1 Definition:
//
//	id-lsx                                   ID ::= ldap-syntax
var Id_lsx ID = Ldap_syntax

// # ASN.1 Definition:
//
//	id-ldx                                   ID ::= ldap-x509
var Id_ldx ID = Ldap_x509

// # ASN.1 Definition:
//
//	id-lat                                   ID ::= ldap-attr
var Id_lat ID = Ldap_attr

// # ASN.1 Definition:
//
//	id-lmr                                   ID ::= ldap-match
var Id_lmr ID = Ldap_match

// # ASN.1 Definition:
//
//	id-oat                                   ID ::= openLDAP-attributes
var Id_oat ID = OpenLDAP_attributes

// # ASN.1 Definition:
//
//	id-coat                                  ID ::= cosineAttr
var Id_coat ID = CosineAttr

// # ASN.1 Definition:
//
//	id-avr                                   ID ::= avRestriction
var Id_avr ID = AvRestriction

// # ASN.1 Definition:
//
//	id-cmsct                                 ID ::= cmsContentType
var Id_cmsct ID = CmsContentType

// # ASN.1 Definition:
//
//	distributedDirectoryObjectIdentifiers ID ::= {module 13}
var DistributedDirectoryObjectIdentifiers ID = []int{2, 5, 1, 13}

// # ASN.1 Definition:
//
//	operationalBindingOIDs                ID ::= {module 25}
var OperationalBindingOIDs ID = []int{2, 5, 1, 25}
