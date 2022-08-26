package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION ID */
// ### ASN.1 Definition:
//
// ```asn1
// ID     ::=  OBJECT IDENTIFIER
// ```
type ID = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION ID */ /* START_OF_SYMBOL_DEFINITION Ds */
// ### ASN.1 Definition:
//
// ```asn1
// ds ID ::= {joint-iso-itu-t ds(5)}
// ```
//
//
var Ds ID = []int{2, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ds */ /* START_OF_SYMBOL_DEFINITION Id */
// ### ASN.1 Definition:
//
// ```asn1
// id ID ::= {joint-iso-itu-t registration-procedures(17) module(1) directory-defs(2)}
// ```
//
//
var Id ID = []int{2, 17, 1, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id */ /* START_OF_SYMBOL_DEFINITION Internet */
// ### ASN.1 Definition:
//
// ```asn1
// internet            ID ::= {iso(1) identified-organization(3) dod(6) internet(1)}
// ```
//
//
var Internet ID = []int{1, 3, 6, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Internet */ /* START_OF_SYMBOL_DEFINITION Ldap_dir */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-dir            ID ::= {internet directory(1)}
// ```
//
//
var Ldap_dir ID = []int{1, 3, 6, 1, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_dir */ /* START_OF_SYMBOL_DEFINITION IntSecurity */
// ### ASN.1 Definition:
//
// ```asn1
// intSecurity         ID ::= {internet security(5)}
// ```
//
//
var IntSecurity ID = []int{1, 3, 6, 1, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION IntSecurity */ /* START_OF_SYMBOL_DEFINITION Ldap_enterprise */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-enterprise     ID ::= {internet private(4) enterprise(1)}
// ```
//
//
var Ldap_enterprise ID = []int{1, 3, 6, 1, 4, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_enterprise */ /* START_OF_SYMBOL_DEFINITION Ldap_x509 */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-x509           ID ::= {ldap-dir x509(15)}
// ```
//
//
var Ldap_x509 ID = []int{1, 3, 6, 1, 1, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_x509 */ /* START_OF_SYMBOL_DEFINITION Ldap_openLDAP */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-openLDAP       ID ::= {ldap-enterprise openLDAP(4203) ldap(1)}
// ```
//
//
var Ldap_openLDAP ID = []int{1, 3, 6, 1, 4, 1, 4203, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_openLDAP */ /* START_OF_SYMBOL_DEFINITION OpenLDAP_attributes */
// ### ASN.1 Definition:
//
// ```asn1
// openLDAP-attributes ID ::= {ldap-openLDAP attributeType(3)}
// ```
//
//
var OpenLDAP_attributes ID = []int{1, 3, 6, 1, 4, 1, 4203, 1, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OpenLDAP_attributes */ /* START_OF_SYMBOL_DEFINITION OpenLDAP_controls */
// ### ASN.1 Definition:
//
// ```asn1
// openLDAP-controls   ID ::= {ldap-openLDAP controls(10)}
// ```
//
//
var OpenLDAP_controls ID = []int{1, 3, 6, 1, 4, 1, 4203, 1, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OpenLDAP_controls */ /* START_OF_SYMBOL_DEFINITION Ldap_wall */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-wall           ID ::= {ldap-enterprise wahl(1466)}
// ```
//
//
var Ldap_wall ID = []int{1, 3, 6, 1, 4, 1, 1466} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_wall */ /* START_OF_SYMBOL_DEFINITION Ldap_dynExt */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-dynExt         ID ::= {ldap-wall 101 119}
// ```
//
//
var Ldap_dynExt ID = []int{1, 3, 6, 1, 4, 1, 1466, 101, 119} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_dynExt */ /* START_OF_SYMBOL_DEFINITION Ldap_attr */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-attr           ID ::= {ldap-wall 101 120}
// ```
//
//
var Ldap_attr ID = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_attr */ /* START_OF_SYMBOL_DEFINITION Ldap_match */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-match          ID ::= {ldap-wall 109 114}
// ```
//
//
var Ldap_match ID = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_match */ /* START_OF_SYMBOL_DEFINITION Ldap_syntax */
// ### ASN.1 Definition:
//
// ```asn1
// ldap-syntax         ID ::= {ldap-wall 115 121 1}
// ```
//
//
var Ldap_syntax ID = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Ldap_syntax */ /* START_OF_SYMBOL_DEFINITION Cosine */
// ### ASN.1 Definition:
//
// ```asn1
// cosine              ID ::= {itu-t(0) data(9) pss(2342) ucl(19200300) pilot(100)}
// ```
//
//
var Cosine ID = []int{0, 9, 2342, 19200300, 100} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Cosine */ /* START_OF_SYMBOL_DEFINITION CosineAttr */
// ### ASN.1 Definition:
//
// ```asn1
// cosineAttr          ID ::= {cosine pilotAttributeType(1)}
// ```
//
//
var CosineAttr ID = []int{0, 9, 2342, 19200300, 100, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION CosineAttr */ /* START_OF_SYMBOL_DEFINITION Module */
// ### ASN.1 Definition:
//
// ```asn1
// module                                   ID ::= {ds 1}
// ```
//
//
var Module ID = []int{2, 5, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Module */ /* START_OF_SYMBOL_DEFINITION ServiceElement */
// ### ASN.1 Definition:
//
// ```asn1
// serviceElement                           ID ::= {ds 2}
// ```
//
//
var ServiceElement ID = []int{2, 5, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ServiceElement */ /* START_OF_SYMBOL_DEFINITION ApplicationContext */
// ### ASN.1 Definition:
//
// ```asn1
// applicationContext                       ID ::= {ds 3}
// ```
//
//
var ApplicationContext ID = []int{2, 5, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ApplicationContext */ /* START_OF_SYMBOL_DEFINITION AttributeType */
// ### ASN.1 Definition:
//
// ```asn1
// attributeType                            ID ::= {ds 4}
// ```
//
//
var AttributeTypeOID ID = []int{2, 5, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeType */ /* START_OF_SYMBOL_DEFINITION AttributeSyntaxVendor */
// ### ASN.1 Definition:
//
// ```asn1
// attributeSyntaxVendor                    ID ::= {ds 5}
// ```
//
//
var AttributeSyntaxVendor ID = []int{2, 5, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeSyntaxVendor */ /* START_OF_SYMBOL_DEFINITION ObjectClass */
// ### ASN.1 Definition:
//
// ```asn1
// objectClass                              ID ::= {ds 6}
// ```
//
//
var ObjectClass ID = []int{2, 5, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ObjectClass */ /* START_OF_SYMBOL_DEFINITION AttributeSet */
// ### ASN.1 Definition:
//
// ```asn1
// attributeSet                             ID ::= {ds 7}
// ```
//
//
var AttributeSet ID = []int{2, 5, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeSet */ /* START_OF_SYMBOL_DEFINITION Algorithm */
// ### ASN.1 Definition:
//
// ```asn1
// algorithm                                ID ::= {ds 8}
// ```
//
//
var Algorithm ID = []int{2, 5, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Algorithm */ /* START_OF_SYMBOL_DEFINITION AbstractSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// abstractSyntax                           ID ::= {ds 9}
// ```
//
//
var AbstractSyntax ID = []int{2, 5, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AbstractSyntax */ /* START_OF_SYMBOL_DEFINITION Object */
// ### ASN.1 Definition:
//
// ```asn1
// object                                   ID ::= {ds 10}
// ```
//
//
var Object ID = []int{2, 5, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Object */ /* START_OF_SYMBOL_DEFINITION Port */
// ### ASN.1 Definition:
//
// ```asn1
// port                                     ID ::= {ds 11}
// ```
//
//
var Port ID = []int{2, 5, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Port */ /* START_OF_SYMBOL_DEFINITION DsaOperationalAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// dsaOperationalAttribute                  ID ::= {ds 12}
// ```
//
//
var DsaOperationalAttribute ID = []int{2, 5, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DsaOperationalAttribute */ /* START_OF_SYMBOL_DEFINITION MatchingRule */
// ### ASN.1 Definition:
//
// ```asn1
// matchingRule                             ID ::= {ds 13}
// ```
//
//
var MatchingRule ID = []int{2, 5, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION MatchingRule */ /* START_OF_SYMBOL_DEFINITION KnowledgeMatchingRule */
// ### ASN.1 Definition:
//
// ```asn1
// knowledgeMatchingRule                    ID ::= {ds 14}
// ```
//
//
var KnowledgeMatchingRule ID = []int{2, 5, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION KnowledgeMatchingRule */ /* START_OF_SYMBOL_DEFINITION NameForm */
// ### ASN.1 Definition:
//
// ```asn1
// nameForm                                 ID ::= {ds 15}
// ```
//
//
var NameForm ID = []int{2, 5, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION NameForm */ /* START_OF_SYMBOL_DEFINITION Group */
// ### ASN.1 Definition:
//
// ```asn1
// group                                    ID ::= {ds 16}
// ```
//
//
var Group ID = []int{2, 5, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Group */ /* START_OF_SYMBOL_DEFINITION Subentry */
// ### ASN.1 Definition:
//
// ```asn1
// subentry                                 ID ::= {ds 17}
// ```
//
//
var Subentry ID = []int{2, 5, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Subentry */ /* START_OF_SYMBOL_DEFINITION OperationalAttributeType */
// ### ASN.1 Definition:
//
// ```asn1
// operationalAttributeType                 ID ::= {ds 18}
// ```
//
//
var OperationalAttributeType ID = []int{2, 5, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OperationalAttributeType */ /* START_OF_SYMBOL_DEFINITION OperationalBinding */
// ### ASN.1 Definition:
//
// ```asn1
// operationalBinding                       ID ::= {ds 19}
// ```
//
//
var OperationalBinding ID = []int{2, 5, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OperationalBinding */ /* START_OF_SYMBOL_DEFINITION SchemaObjectClass */
// ### ASN.1 Definition:
//
// ```asn1
// schemaObjectClass                        ID ::= {ds 20}
// ```
//
//
var SchemaObjectClass ID = []int{2, 5, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SchemaObjectClass */ /* START_OF_SYMBOL_DEFINITION SchemaOperationalAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// schemaOperationalAttribute               ID ::= {ds 21}
// ```
//
//
var SchemaOperationalAttribute ID = []int{2, 5, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SchemaOperationalAttribute */ /* START_OF_SYMBOL_DEFINITION AdministrativeRoles */
// ### ASN.1 Definition:
//
// ```asn1
// administrativeRoles                      ID ::= {ds 23}
// ```
//
//
var AdministrativeRoles ID = []int{2, 5, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AdministrativeRoles */ /* START_OF_SYMBOL_DEFINITION AccessControlAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// accessControlAttribute                   ID ::= {ds 24}
// ```
//
//
var AccessControlAttribute ID = []int{2, 5, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AccessControlAttribute */ /* START_OF_SYMBOL_DEFINITION RosObject */
// ### ASN.1 Definition:
//
// ```asn1
// rosObject                                ID ::= {ds 25}
// ```
//
//
var RosObject ID = []int{2, 5, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION RosObject */ /* START_OF_SYMBOL_DEFINITION Contract */
// ### ASN.1 Definition:
//
// ```asn1
// contract                                 ID ::= {ds 26}
// ```
//
//
var Contract ID = []int{2, 5, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Contract */ /* START_OF_SYMBOL_DEFINITION Package */
// ### ASN.1 Definition:
//
// ```asn1
// package                                  ID ::= {ds 27}
// ```
//
//
var Package ID = []int{2, 5, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Package */ /* START_OF_SYMBOL_DEFINITION AccessControlSchemes */
// ### ASN.1 Definition:
//
// ```asn1
// accessControlSchemes                     ID ::= {ds 28}
// ```
//
//
var AccessControlSchemes ID = []int{2, 5, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AccessControlSchemes */ /* START_OF_SYMBOL_DEFINITION CertificateExtension */
// ### ASN.1 Definition:
//
// ```asn1
// certificateExtension                     ID ::= {ds 29}
// ```
//
//
var CertificateExtension ID = []int{2, 5, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION CertificateExtension */ /* START_OF_SYMBOL_DEFINITION ManagementObject */
// ### ASN.1 Definition:
//
// ```asn1
// managementObject                         ID ::= {ds 30}
// ```
//
//
var ManagementObject ID = []int{2, 5, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ManagementObject */ /* START_OF_SYMBOL_DEFINITION AttributeValueContext */
// ### ASN.1 Definition:
//
// ```asn1
// attributeValueContext                    ID ::= {ds 31}
// ```
//
//
var AttributeValueContext ID = []int{2, 5, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeValueContext */ /* START_OF_SYMBOL_DEFINITION SecurityExchange */
// ### ASN.1 Definition:
//
// ```asn1
// securityExchange                         ID ::= {ds 32}
// ```
//
//
var SecurityExchange ID = []int{2, 5, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SecurityExchange */ /* START_OF_SYMBOL_DEFINITION IdmProtocol */
// ### ASN.1 Definition:
//
// ```asn1
// idmProtocol                              ID ::= {ds 33}
// ```
//
//
var IdmProtocol ID = []int{2, 5, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION IdmProtocol */ /* START_OF_SYMBOL_DEFINITION Problem */
// ### ASN.1 Definition:
//
// ```asn1
// problem                                  ID ::= {ds 34}
// ```
//
//
var Problem ID = []int{2, 5, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Problem */ /* START_OF_SYMBOL_DEFINITION Notification */
// ### ASN.1 Definition:
//
// ```asn1
// notification                             ID ::= {ds 35}
// ```
//
//
var Notification ID = []int{2, 5, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Notification */ /* START_OF_SYMBOL_DEFINITION MatchingRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// matchingRestriction                      ID ::= {ds 36}
// ```
//
//
var MatchingRestriction ID = []int{2, 5, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION MatchingRestriction */ /* START_OF_SYMBOL_DEFINITION ControlAttributeType */
// ### ASN.1 Definition:
//
// ```asn1
// controlAttributeType                     ID ::= {ds 37}
// ```
//
//
var ControlAttributeType ID = []int{2, 5, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ControlAttributeType */ /* START_OF_SYMBOL_DEFINITION KeyPurposes */
// ### ASN.1 Definition:
//
// ```asn1
// keyPurposes                              ID ::= {ds 38}
// ```
//
//
var KeyPurposes ID = []int{2, 5, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION KeyPurposes */ /* START_OF_SYMBOL_DEFINITION PasswordQuality */
// ### ASN.1 Definition:
//
// ```asn1
// passwordQuality                          ID ::= {ds 39}
// ```
//
//
var PasswordQuality ID = []int{2, 5, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION PasswordQuality */ /* START_OF_SYMBOL_DEFINITION AttributeSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// attributeSyntax                          ID ::= {ds 40}
// ```
//
//
var AttributeSyntax ID = []int{2, 5, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeSyntax */ /* START_OF_SYMBOL_DEFINITION AvRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// avRestriction                            ID ::= {ds 41}
// ```
//
//
var AvRestriction ID = []int{2, 5, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AvRestriction */ /* START_OF_SYMBOL_DEFINITION CmsContentType */
// ### ASN.1 Definition:
//
// ```asn1
// cmsContentType                           ID ::= {ds 42}
// ```
//
//
var CmsContentType ID = []int{2, 5, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION CmsContentType */ /* START_OF_SYMBOL_DEFINITION UsefulDefinitions */
// ### ASN.1 Definition:
//
// ```asn1
// usefulDefinitions                        ID ::= {module usefulDefinitions(0) 9}
// ```
//
//
var UsefulDefinitions ID = []int{2, 5, 1, 0, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION UsefulDefinitions */ /* START_OF_SYMBOL_DEFINITION InformationFramework */
// ### ASN.1 Definition:
//
// ```asn1
// informationFramework                     ID ::= {module informationFramework(1) 9}
// ```
//
//
var InformationFramework ID = []int{2, 5, 1, 1, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION InformationFramework */ /* START_OF_SYMBOL_DEFINITION DirectoryAbstractService */
// ### ASN.1 Definition:
//
// ```asn1
// directoryAbstractService                 ID ::= {module directoryAbstractService(2) 9}
// ```
//
//
var DirectoryAbstractService ID = []int{2, 5, 1, 2, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryAbstractService */ /* START_OF_SYMBOL_DEFINITION DistributedOperations */
// ### ASN.1 Definition:
//
// ```asn1
// distributedOperations                    ID ::= {module distributedOperations(3) 9}
// ```
//
//
var DistributedOperations ID = []int{2, 5, 1, 3, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DistributedOperations */ /* START_OF_SYMBOL_DEFINITION ProtocolObjectIdentifiers */
// ### ASN.1 Definition:
//
// ```asn1
// protocolObjectIdentifiers                ID ::= {module protocolObjectIdentifiers(4) 9}
// ```
//
//
var ProtocolObjectIdentifiers ID = []int{2, 5, 1, 4, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ProtocolObjectIdentifiers */ /* START_OF_SYMBOL_DEFINITION SelectedAttributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// selectedAttributeTypes                   ID ::= {module selectedAttributeTypes(5) 9}
// ```
//
//
var SelectedAttributeTypes ID = []int{2, 5, 1, 5, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SelectedAttributeTypes */ /* START_OF_SYMBOL_DEFINITION SelectedObjectClasses */
// ### ASN.1 Definition:
//
// ```asn1
// selectedObjectClasses                    ID ::= {module selectedObjectClasses(6) 9}
// ```
//
//
var SelectedObjectClasses ID = []int{2, 5, 1, 6, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SelectedObjectClasses */ /* START_OF_SYMBOL_DEFINITION AuthenticationFramework */
// ### ASN.1 Definition:
//
// ```asn1
// authenticationFramework                  ID ::= {module authenticationFramework(7) 9}
// ```
//
//
var AuthenticationFramework ID = []int{2, 5, 1, 7, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AuthenticationFramework */ /* START_OF_SYMBOL_DEFINITION AlgorithmObjectIdentifiers */
// ### ASN.1 Definition:
//
// ```asn1
// algorithmObjectIdentifiers               ID ::= {module algorithmObjectIdentifiers(8) 9}
// ```
//
//
var AlgorithmObjectIdentifiers ID = []int{2, 5, 1, 8, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AlgorithmObjectIdentifiers */ /* START_OF_SYMBOL_DEFINITION DirectoryObjectIdentifiers */
// ### ASN.1 Definition:
//
// ```asn1
// directoryObjectIdentifiers               ID ::= {module directoryObjectIdentifiers(9) 9}
// ```
//
//
var DirectoryObjectIdentifiers ID = []int{2, 5, 1, 9, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryObjectIdentifiers */ /* START_OF_SYMBOL_DEFINITION UpperBounds */
// ### ASN.1 Definition:
//
// ```asn1
// upperBounds                              ID ::= {module upperBounds(10) 9}
// ```
//
//
var UpperBounds ID = []int{2, 5, 1, 10, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION UpperBounds */ /* START_OF_SYMBOL_DEFINITION Dap */
// ### ASN.1 Definition:
//
// ```asn1
// dap                                      ID ::= {module dap(11) 9}
// ```
//
//
var Dap ID = []int{2, 5, 1, 11, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Dap */ /* START_OF_SYMBOL_DEFINITION Dsp */
// ### ASN.1 Definition:
//
// ```asn1
// dsp                                      ID ::= {module dsp(12) 9}
// ```
//
//
var Dsp ID = []int{2, 5, 1, 12, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Dsp */ /* START_OF_SYMBOL_DEFINITION DistributedDirectoryOIDs */
// ### ASN.1 Definition:
//
// ```asn1
// distributedDirectoryOIDs                 ID ::= {module distributedDirectoryOIDs(13) 9}
// ```
//
//
var DistributedDirectoryOIDs ID = []int{2, 5, 1, 13, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DistributedDirectoryOIDs */ /* START_OF_SYMBOL_DEFINITION DirectoryShadowOIDs */
// ### ASN.1 Definition:
//
// ```asn1
// directoryShadowOIDs                      ID ::= {module directoryShadowOIDs(14) 9}
// ```
//
//
var DirectoryShadowOIDs ID = []int{2, 5, 1, 14, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryShadowOIDs */ /* START_OF_SYMBOL_DEFINITION DirectoryShadowAbstractService */
// ### ASN.1 Definition:
//
// ```asn1
// directoryShadowAbstractService           ID ::= {module directoryShadowAbstractService(15) 9}
// ```
//
//
var DirectoryShadowAbstractService ID = []int{2, 5, 1, 15, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryShadowAbstractService */ /* START_OF_SYMBOL_DEFINITION Disp */
// ### ASN.1 Definition:
//
// ```asn1
// disp                                     ID ::= {module disp(16) 7}
// ```
//
//
var Disp ID = []int{2, 5, 1, 16, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Disp */ /* START_OF_SYMBOL_DEFINITION Dop */
// ### ASN.1 Definition:
//
// ```asn1
// dop                                      ID ::= {module dop(17) 7}
// ```
//
//
var Dop ID = []int{2, 5, 1, 17, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Dop */ /* START_OF_SYMBOL_DEFINITION OpBindingManagement */
// ### ASN.1 Definition:
//
// ```asn1
// opBindingManagement                      ID ::= {module opBindingManagement(18) 9}
// ```
//
//
var OpBindingManagement ID = []int{2, 5, 1, 18, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OpBindingManagement */ /* START_OF_SYMBOL_DEFINITION OpBindingOIDs */
// ### ASN.1 Definition:
//
// ```asn1
// opBindingOIDs                            ID ::= {module opBindingOIDs(19) 9}
// ```
//
//
var OpBindingOIDs ID = []int{2, 5, 1, 19, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OpBindingOIDs */ /* START_OF_SYMBOL_DEFINITION HierarchicalOperationalBindings */
// ### ASN.1 Definition:
//
// ```asn1
// hierarchicalOperationalBindings          ID ::= {module hierarchicalOperationalBindings(20) 9}
// ```
//
//
var HierarchicalOperationalBindings ID = []int{2, 5, 1, 20, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION HierarchicalOperationalBindings */ /* START_OF_SYMBOL_DEFINITION DsaOperationalAttributeTypes */
// ### ASN.1 Definition:
//
// ```asn1
// dsaOperationalAttributeTypes             ID ::= {module dsaOperationalAttributeTypes(22) 9}
// ```
//
//
var DsaOperationalAttributeTypes ID = []int{2, 5, 1, 22, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DsaOperationalAttributeTypes */ /* START_OF_SYMBOL_DEFINITION SchemaAdministration */
// ### ASN.1 Definition:
//
// ```asn1
// schemaAdministration                     ID ::= {module schemaAdministration(23) 9}
// ```
//
//
var SchemaAdministration ID = []int{2, 5, 1, 23, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SchemaAdministration */ /* START_OF_SYMBOL_DEFINITION BasicAccessControl */
// ### ASN.1 Definition:
//
// ```asn1
// basicAccessControl                       ID ::= {module basicAccessControl(24) 9}
// ```
//
//
var BasicAccessControl ID = []int{2, 5, 1, 24, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION BasicAccessControl */ /* START_OF_SYMBOL_DEFINITION DirectoryOperationalBindingTypes */
// ### ASN.1 Definition:
//
// ```asn1
// directoryOperationalBindingTypes         ID ::= {module directoryOperationalBindingTypes(25) 9}
// ```
//
//
var DirectoryOperationalBindingTypes ID = []int{2, 5, 1, 25, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryOperationalBindingTypes */ /* START_OF_SYMBOL_DEFINITION CertificateExtensions */
// ### ASN.1 Definition:
//
// ```asn1
// certificateExtensions                    ID ::= {module certificateExtensions(26) 9}
// ```
//
//
var CertificateExtensions ID = []int{2, 5, 1, 26, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION CertificateExtensions */ /* START_OF_SYMBOL_DEFINITION DirectoryManagement */
// ### ASN.1 Definition:
//
// ```asn1
// directoryManagement                      ID ::= {module directoryManagement(27) 9}
// ```
//
//
var DirectoryManagement ID = []int{2, 5, 1, 27, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryManagement */ /* START_OF_SYMBOL_DEFINITION EnhancedSecurity */
// ### ASN.1 Definition:
//
// ```asn1
// enhancedSecurity                         ID ::= {module enhancedSecurity(28) 9}
// ```
//
//
var EnhancedSecurity ID = []int{2, 5, 1, 28, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION EnhancedSecurity */ /* START_OF_SYMBOL_DEFINITION DirectorySecurityExchanges */
// ### ASN.1 Definition:
//
// ```asn1
// directorySecurityExchanges               ID ::= {module directorySecurityExchanges (29) 9}
// ```
//
//
var DirectorySecurityExchanges ID = []int{2, 5, 1, 29, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectorySecurityExchanges */ /* START_OF_SYMBOL_DEFINITION IDMProtocolSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// iDMProtocolSpecification                 ID ::= {module iDMProtocolSpecification(30) 9}
// ```
//
//
var IDMProtocolSpecification ID = []int{2, 5, 1, 30, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION IDMProtocolSpecification */ /* START_OF_SYMBOL_DEFINITION DirectoryIDMProtocols */
// ### ASN.1 Definition:
//
// ```asn1
// directoryIDMProtocols                    ID ::= {module directoryIDMProtocols(31) 9}
// ```
//
//
var DirectoryIDMProtocols ID = []int{2, 5, 1, 31, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryIDMProtocols */ /* START_OF_SYMBOL_DEFINITION AttributeCertificateDefinitions */
// ### ASN.1 Definition:
//
// ```asn1
// attributeCertificateDefinitions          ID ::= {module attributeCertificateDefinitions(32) 9}
// ```
//
//
var AttributeCertificateDefinitions ID = []int{2, 5, 1, 32, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AttributeCertificateDefinitions */ /* START_OF_SYMBOL_DEFINITION ServiceAdministration */
// ### ASN.1 Definition:
//
// ```asn1
// serviceAdministration                    ID ::= {module serviceAdministration(33) 9}
// ```
//
//
var ServiceAdministration ID = []int{2, 5, 1, 33, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ServiceAdministration */ /* START_OF_SYMBOL_DEFINITION LdapAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// ldapAttributes                           ID ::= {module ldapAttributes(34) 9}
// ```
//
//
var LdapAttributes ID = []int{2, 5, 1, 34, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION LdapAttributes */ /* START_OF_SYMBOL_DEFINITION CommonProtocolSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// commonProtocolSpecification              ID ::= {module commonProtocolSpecification(35) 9}
// ```
//
//
var CommonProtocolSpecification ID = []int{2, 5, 1, 35, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION CommonProtocolSpecification */ /* START_OF_SYMBOL_DEFINITION OSIProtocolSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// oSIProtocolSpecification                 ID ::= {module oSIProtocolSpecification(36) 9}
// ```
//
//
var OSIProtocolSpecification ID = []int{2, 5, 1, 36, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OSIProtocolSpecification */ /* START_OF_SYMBOL_DEFINITION DirectoryOSIProtocols */
// ### ASN.1 Definition:
//
// ```asn1
// directoryOSIProtocols                    ID ::= {module directoryOSIProtocols(37) 9}
// ```
//
//
var DirectoryOSIProtocols ID = []int{2, 5, 1, 37, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DirectoryOSIProtocols */ /* START_OF_SYMBOL_DEFINITION LdapSystemSchema */
// ### ASN.1 Definition:
//
// ```asn1
// ldapSystemSchema                         ID ::= {module ldapSystemSchema(38) 9}
// ```
//
//
var LdapSystemSchema ID = []int{2, 5, 1, 38, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION LdapSystemSchema */ /* START_OF_SYMBOL_DEFINITION PasswordPolicy */
// ### ASN.1 Definition:
//
// ```asn1
// passwordPolicy                           ID ::= {module passwordPolicy(39) 9}
// ```
//
//
var PasswordPolicy ID = []int{2, 5, 1, 39, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION PasswordPolicy */ /* START_OF_SYMBOL_DEFINITION PkiPmiExternalDataTypes */
// ### ASN.1 Definition:
//
// ```asn1
// pkiPmiExternalDataTypes                  ID ::= {module pkiPmiExternalDataTypes(40) 9}
// ```
//
//
var PkiPmiExternalDataTypes ID = []int{2, 5, 1, 40, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION PkiPmiExternalDataTypes */ /* START_OF_SYMBOL_DEFINITION ExtensionAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// extensionAttributes                      ID ::= {module extensionAttributes(41) 9}
// ```
//
//
var ExtensionAttributes ID = []int{2, 5, 1, 41, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION ExtensionAttributes */ /* START_OF_SYMBOL_DEFINITION PkiPmiWrapper */
// ### ASN.1 Definition:
//
// ```asn1
// pkiPmiWrapper                            ID ::= {module pkiPmiWrapper(42) 9}
// ```
//
//
var PkiPmiWrapper ID = []int{2, 5, 1, 42, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION PkiPmiWrapper */ /* START_OF_SYMBOL_DEFINITION AvlManagement */
// ### ASN.1 Definition:
//
// ```asn1
// avlManagement                            ID ::= {module avlManagement(43) 9}
// ```
//
//
var AvlManagement ID = []int{2, 5, 1, 43, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION AvlManagement */ /* START_OF_SYMBOL_DEFINITION TrustBrokerProtocol */
// ### ASN.1 Definition:
//
// ```asn1
// trustBrokerProtocol                      ID ::= {module trustBrokerProtocol(44) 9}
// ```
//
//
var TrustBrokerProtocol ID = []int{2, 5, 1, 44, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION TrustBrokerProtocol */ /* START_OF_SYMBOL_DEFINITION Id_oc */
// ### ASN.1 Definition:
//
// ```asn1
// id-oc                                    ID ::= objectClass
// ```
//
//
var Id_oc ID = ObjectClass

/* END_OF_SYMBOL_DEFINITION Id_oc */ /* START_OF_SYMBOL_DEFINITION Id_at */
// ### ASN.1 Definition:
//
// ```asn1
// id-at                                    ID ::= attributeType
// ```
//
//
var Id_at ID = AttributeTypeOID

/* END_OF_SYMBOL_DEFINITION Id_at */ /* START_OF_SYMBOL_DEFINITION Id_as */
// ### ASN.1 Definition:
//
// ```asn1
// id-as                                    ID ::= abstractSyntax
// ```
//
//
var Id_as ID = AbstractSyntax

/* END_OF_SYMBOL_DEFINITION Id_as */ /* START_OF_SYMBOL_DEFINITION Id_mr */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr                                    ID ::= matchingRule
// ```
//
//
var Id_mr ID = MatchingRule

/* END_OF_SYMBOL_DEFINITION Id_mr */ /* START_OF_SYMBOL_DEFINITION Id_nf */
// ### ASN.1 Definition:
//
// ```asn1
// id-nf                                    ID ::= nameForm
// ```
//
//
var Id_nf ID = NameForm

/* END_OF_SYMBOL_DEFINITION Id_nf */ /* START_OF_SYMBOL_DEFINITION Id_sc */
// ### ASN.1 Definition:
//
// ```asn1
// id-sc                                    ID ::= subentry
// ```
//
//
var Id_sc ID = Subentry

/* END_OF_SYMBOL_DEFINITION Id_sc */ /* START_OF_SYMBOL_DEFINITION Id_oa */
// ### ASN.1 Definition:
//
// ```asn1
// id-oa                                    ID ::= operationalAttributeType
// ```
//
//
var Id_oa ID = OperationalAttributeType

/* END_OF_SYMBOL_DEFINITION Id_oa */ /* START_OF_SYMBOL_DEFINITION Id_ob */
// ### ASN.1 Definition:
//
// ```asn1
// id-ob                                    ID ::= operationalBinding
// ```
//
//
var Id_ob ID = OperationalBinding

/* END_OF_SYMBOL_DEFINITION Id_ob */ /* START_OF_SYMBOL_DEFINITION Id_doa */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa                                   ID ::= dsaOperationalAttribute
// ```
//
//
var Id_doa ID = DsaOperationalAttribute

/* END_OF_SYMBOL_DEFINITION Id_doa */ /* START_OF_SYMBOL_DEFINITION Id_kmr */
// ### ASN.1 Definition:
//
// ```asn1
// id-kmr                                   ID ::= knowledgeMatchingRule
// ```
//
//
var Id_kmr ID = KnowledgeMatchingRule

/* END_OF_SYMBOL_DEFINITION Id_kmr */ /* START_OF_SYMBOL_DEFINITION Id_soc */
// ### ASN.1 Definition:
//
// ```asn1
// id-soc                                   ID ::= schemaObjectClass
// ```
//
//
var Id_soc ID = SchemaObjectClass

/* END_OF_SYMBOL_DEFINITION Id_soc */ /* START_OF_SYMBOL_DEFINITION Id_soa */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa                                   ID ::= schemaOperationalAttribute
// ```
//
//
var Id_soa ID = SchemaOperationalAttribute

/* END_OF_SYMBOL_DEFINITION Id_soa */ /* START_OF_SYMBOL_DEFINITION Id_ar */
// ### ASN.1 Definition:
//
// ```asn1
// id-ar                                    ID ::= administrativeRoles
// ```
//
//
var Id_ar ID = AdministrativeRoles

/* END_OF_SYMBOL_DEFINITION Id_ar */ /* START_OF_SYMBOL_DEFINITION Id_aca */
// ### ASN.1 Definition:
//
// ```asn1
// id-aca                                   ID ::= accessControlAttribute
// ```
//
//
var Id_aca ID = AccessControlAttribute

/* END_OF_SYMBOL_DEFINITION Id_aca */ /* START_OF_SYMBOL_DEFINITION Id_ac */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac                                    ID ::= applicationContext
// ```
//
//
var Id_ac ID = ApplicationContext

/* END_OF_SYMBOL_DEFINITION Id_ac */ /* START_OF_SYMBOL_DEFINITION Id_rosObject */
// ### ASN.1 Definition:
//
// ```asn1
// id-rosObject                             ID ::= rosObject
// ```
//
//
var Id_rosObject ID = RosObject

/* END_OF_SYMBOL_DEFINITION Id_rosObject */ /* START_OF_SYMBOL_DEFINITION Id_contract */
// ### ASN.1 Definition:
//
// ```asn1
// id-contract                              ID ::= contract
// ```
//
//
var Id_contract ID = Contract

/* END_OF_SYMBOL_DEFINITION Id_contract */ /* START_OF_SYMBOL_DEFINITION Id_package */
// ### ASN.1 Definition:
//
// ```asn1
// id-package                               ID ::= package
// ```
//
//
var Id_package ID = Package

/* END_OF_SYMBOL_DEFINITION Id_package */ /* START_OF_SYMBOL_DEFINITION Id_acScheme */
// ### ASN.1 Definition:
//
// ```asn1
// id-acScheme                              ID ::= accessControlSchemes
// ```
//
//
var Id_acScheme ID = AccessControlSchemes

/* END_OF_SYMBOL_DEFINITION Id_acScheme */ /* START_OF_SYMBOL_DEFINITION Id_ce */
// ### ASN.1 Definition:
//
// ```asn1
// id-ce                                    ID ::= certificateExtension
// ```
//
//
var Id_ce ID = CertificateExtension

/* END_OF_SYMBOL_DEFINITION Id_ce */ /* START_OF_SYMBOL_DEFINITION Id_mgt */
// ### ASN.1 Definition:
//
// ```asn1
// id-mgt                                   ID ::= managementObject
// ```
//
//
var Id_mgt ID = ManagementObject

/* END_OF_SYMBOL_DEFINITION Id_mgt */ /* START_OF_SYMBOL_DEFINITION Id_avc */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc                                   ID ::= attributeValueContext
// ```
//
//
var Id_avc ID = AttributeValueContext

/* END_OF_SYMBOL_DEFINITION Id_avc */ /* START_OF_SYMBOL_DEFINITION Id_se */
// ### ASN.1 Definition:
//
// ```asn1
// id-se                                    ID ::= securityExchange
// ```
//
//
var Id_se ID = SecurityExchange

/* END_OF_SYMBOL_DEFINITION Id_se */ /* START_OF_SYMBOL_DEFINITION Id_idm */
// ### ASN.1 Definition:
//
// ```asn1
// id-idm                                   ID ::= idmProtocol
// ```
//
//
var Id_idm ID = IdmProtocol

/* END_OF_SYMBOL_DEFINITION Id_idm */ /* START_OF_SYMBOL_DEFINITION Id_pr */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr                                    ID ::= problem
// ```
//
//
var Id_pr ID = Problem

/* END_OF_SYMBOL_DEFINITION Id_pr */ /* START_OF_SYMBOL_DEFINITION Id_not */
// ### ASN.1 Definition:
//
// ```asn1
// id-not                                   ID ::= notification
// ```
//
//
var Id_not ID = Notification

/* END_OF_SYMBOL_DEFINITION Id_not */ /* START_OF_SYMBOL_DEFINITION Id_mre */
// ### ASN.1 Definition:
//
// ```asn1
// id-mre                                   ID ::= matchingRestriction
// ```
//
//
var Id_mre ID = MatchingRestriction

/* END_OF_SYMBOL_DEFINITION Id_mre */ /* START_OF_SYMBOL_DEFINITION Id_cat */
// ### ASN.1 Definition:
//
// ```asn1
// id-cat                                   ID ::= controlAttributeType
// ```
//
//
var Id_cat ID = ControlAttributeType

/* END_OF_SYMBOL_DEFINITION Id_cat */ /* START_OF_SYMBOL_DEFINITION Id_kp */
// ### ASN.1 Definition:
//
// ```asn1
// id-kp                                    ID ::= keyPurposes
// ```
//
//
var Id_kp ID = KeyPurposes

/* END_OF_SYMBOL_DEFINITION Id_kp */ /* START_OF_SYMBOL_DEFINITION Id_pq */
// ### ASN.1 Definition:
//
// ```asn1
// id-pq                                    ID ::= passwordQuality
// ```
//
//
var Id_pq ID = PasswordQuality

/* END_OF_SYMBOL_DEFINITION Id_pq */ /* START_OF_SYMBOL_DEFINITION Id_ats */
// ### ASN.1 Definition:
//
// ```asn1
// id-ats                                   ID ::= attributeSyntax
// ```
//
//
var Id_ats ID = AttributeSyntax

/* END_OF_SYMBOL_DEFINITION Id_ats */ /* START_OF_SYMBOL_DEFINITION Id_asx */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx                                   ID ::= attributeSyntax
// ```
//
//
var Id_asx ID = AttributeSyntax

/* END_OF_SYMBOL_DEFINITION Id_asx */ /* START_OF_SYMBOL_DEFINITION Id_lsx */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx                                   ID ::= ldap-syntax
// ```
//
//
var Id_lsx ID = Ldap_syntax

/* END_OF_SYMBOL_DEFINITION Id_lsx */ /* START_OF_SYMBOL_DEFINITION Id_ldx */
// ### ASN.1 Definition:
//
// ```asn1
// id-ldx                                   ID ::= ldap-x509
// ```
//
//
var Id_ldx ID = Ldap_x509

/* END_OF_SYMBOL_DEFINITION Id_ldx */ /* START_OF_SYMBOL_DEFINITION Id_lat */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat                                   ID ::= ldap-attr
// ```
//
//
var Id_lat ID = Ldap_attr

/* END_OF_SYMBOL_DEFINITION Id_lat */ /* START_OF_SYMBOL_DEFINITION Id_lmr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lmr                                   ID ::= ldap-match
// ```
//
//
var Id_lmr ID = Ldap_match

/* END_OF_SYMBOL_DEFINITION Id_lmr */ /* START_OF_SYMBOL_DEFINITION Id_oat */
// ### ASN.1 Definition:
//
// ```asn1
// id-oat                                   ID ::= openLDAP-attributes
// ```
//
//
var Id_oat ID = OpenLDAP_attributes

/* END_OF_SYMBOL_DEFINITION Id_oat */ /* START_OF_SYMBOL_DEFINITION Id_coat */
// ### ASN.1 Definition:
//
// ```asn1
// id-coat                                  ID ::= cosineAttr
// ```
//
//
var Id_coat ID = CosineAttr

/* END_OF_SYMBOL_DEFINITION Id_coat */ /* START_OF_SYMBOL_DEFINITION Id_avr */
// ### ASN.1 Definition:
//
// ```asn1
// id-avr                                   ID ::= avRestriction
// ```
//
//
var Id_avr ID = AvRestriction

/* END_OF_SYMBOL_DEFINITION Id_avr */ /* START_OF_SYMBOL_DEFINITION Id_cmsct */
// ### ASN.1 Definition:
//
// ```asn1
// id-cmsct                                 ID ::= cmsContentType
// ```
//
//
var Id_cmsct ID = CmsContentType

/* END_OF_SYMBOL_DEFINITION Id_cmsct */ /* START_OF_SYMBOL_DEFINITION DistributedDirectoryObjectIdentifiers */
// ### ASN.1 Definition:
//
// ```asn1
// distributedDirectoryObjectIdentifiers ID ::= {module 13}
// ```
//
//
var DistributedDirectoryObjectIdentifiers ID = []int{2, 5, 1, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION DistributedDirectoryObjectIdentifiers */ /* START_OF_SYMBOL_DEFINITION OperationalBindingOIDs */
// ### ASN.1 Definition:
//
// ```asn1
// operationalBindingOIDs                ID ::= {module 25}
// ```
//
//
var OperationalBindingOIDs ID = []int{2, 5, 1, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION OperationalBindingOIDs */
