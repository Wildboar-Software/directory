package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION UserNotice */
// ### ASN.1 Definition:
//
// ```asn1
// UserNotice ::= SEQUENCE {
//   noticeRef     NoticeReference OPTIONAL,
//   explicitText  DisplayText OPTIONAL }
// ```
//
//
// type UserNotice struct {
// 	NoticeRef    NoticeReference `asn1:"optional"`
// 	ExplicitText DisplayText     `asn1:"optional"`
// }

/* END_OF_SYMBOL_DEFINITION UserNotice */ /* START_OF_SYMBOL_DEFINITION NoticeReference */
// ### ASN.1 Definition:
//
// ```asn1
// NoticeReference ::= SEQUENCE {
//   organization   DisplayText,
//   noticeNumbers  SEQUENCE OF INTEGER }
// ```
//
//
// type NoticeReference struct {
//     Organization DisplayText
//     NoticeNumbers [](int)
// }
/* END_OF_SYMBOL_DEFINITION NoticeReference */ /* START_OF_SYMBOL_DEFINITION DisplayText */
// ### ASN.1 Definition:
//
// ```asn1
// DisplayText  ::=  CHOICE {
//   visibleString  VisibleString(SIZE (1..200)),
//   bmpString      BMPString(SIZE (1..200)),
//   utf8String     UTF8String(SIZE (1..200)) }
// ```
type DisplayText = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DisplayText */ /* START_OF_SYMBOL_DEFINITION AuthorityInfoAccessSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// AuthorityInfoAccessSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AccessDescription
// ```
type AuthorityInfoAccessSyntax = [](AccessDescription) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AuthorityInfoAccessSyntax */ /* START_OF_SYMBOL_DEFINITION AccessDescription */
// ### ASN.1 Definition:
//
// ```asn1
// AccessDescription ::= SEQUENCE {
//   accessMethod    OBJECT IDENTIFIER,
//   accessLocation  GeneralName }
// ```
//
//
type AccessDescription struct {
	AccessMethod   asn1.ObjectIdentifier
	AccessLocation GeneralName
}

/* END_OF_SYMBOL_DEFINITION AccessDescription */ /* START_OF_SYMBOL_DEFINITION SubjectInfoAccessSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// SubjectInfoAccessSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AccessDescription
// ```
type SubjectInfoAccessSyntax = [](AccessDescription) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SubjectInfoAccessSyntax */ /* START_OF_SYMBOL_DEFINITION Id_pkix */
// ### ASN.1 Definition:
//
// ```asn1
// id-pkix                   OBJECT IDENTIFIER ::= { intSecurity mechanisms(5) pkix(7) }
// ```
//
//
var Id_pkix asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pkix */ /* START_OF_SYMBOL_DEFINITION Id_pe */
// ### ASN.1 Definition:
//
// ```asn1
// id-pe                     OBJECT IDENTIFIER ::= { id-pkix 1 }
// ```
//
//
var Id_pe asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pe */ /* START_OF_SYMBOL_DEFINITION Id_ad */
// ### ASN.1 Definition:
//
// ```asn1
// id-ad                     OBJECT IDENTIFIER ::= { id-pkix 48 }
// ```
//
//
var Id_ad asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ad */ /* START_OF_SYMBOL_DEFINITION Id_pe_authorityInfoAccess */
// ### ASN.1 Definition:
//
// ```asn1
// id-pe-authorityInfoAccess OBJECT IDENTIFIER ::= { id-pe 1 }
// ```
//
//
var Id_pe_authorityInfoAccess asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pe_authorityInfoAccess */ /* START_OF_SYMBOL_DEFINITION Id_pe_subjectInfoAccess */
// ### ASN.1 Definition:
//
// ```asn1
// id-pe-subjectInfoAccess   OBJECT IDENTIFIER ::= { id-pe 11 }
// ```
//
//
var Id_pe_subjectInfoAccess asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pe_subjectInfoAccess */ /* START_OF_SYMBOL_DEFINITION Id_ad_caIssuers */
// ### ASN.1 Definition:
//
// ```asn1
// id-ad-caIssuers           OBJECT IDENTIFIER ::= { id-ad 2 }
// ```
//
//
var Id_ad_caIssuers asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ad_caIssuers */ /* START_OF_SYMBOL_DEFINITION Id_ad_ocsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-ad-ocsp                OBJECT IDENTIFIER ::= { id-ad 1 }
// ```
//
//
var Id_ad_ocsp asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ad_ocsp */ /* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters */
// ### ASN.1 Definition:
//
// ```asn1
// G3FacsimileNonBasicParameters  ::=  BIT STRING {
//   two-dimensional(8), -- As defined in ITU-T Recommendation T.30
//   fine-resolution(9),
//   unlimited-length(20), -- These bit values are chosen such that when
//   b4-length(21), -- encoded using ASN.1 Basic Encoding Rules
//   a3-width(22), -- the resulting octets have the same values
//   b4-width(23), -- as for T.30 encoding
//   t6-coding(25),
//   uncompressed(30), -- Trailing zero bits are not significant
//   width-middle-864-of-1728(37), -- It is recommended that implementations
//   width-middle-1216-of-1728(38), -- should not encode more than 32 bits unless
//   resolution-type(44), -- higher numbered bits are non-zero
//   resolution-400x400(45), resolution-300x300(46), resolution-8x15(47),
//   edi(49), dtm(50), bft(51), mixed-mode(58), character-mode(60),
//   twelve-bits(65), preferred-huffmann(66), full-colour(67), jpeg(68),
//   processable-mode-26(71)}
// ```
type G3FacsimileNonBasicParameters = asn1.BitString

/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Two_dimensional */
const G3FacsimileNonBasicParameters_Two_dimensional int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Two_dimensional */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Fine_resolution */
const G3FacsimileNonBasicParameters_Fine_resolution int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Fine_resolution */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Unlimited_length */
const G3FacsimileNonBasicParameters_Unlimited_length int32 = 20 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Unlimited_length */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_B4_length */
const G3FacsimileNonBasicParameters_B4_length int32 = 21 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_B4_length */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_A3_width */
const G3FacsimileNonBasicParameters_A3_width int32 = 22 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_A3_width */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_B4_width */
const G3FacsimileNonBasicParameters_B4_width int32 = 23 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_B4_width */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_T6_coding */
const G3FacsimileNonBasicParameters_T6_coding int32 = 25 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_T6_coding */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Uncompressed */
const G3FacsimileNonBasicParameters_Uncompressed int32 = 30 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Uncompressed */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Width_middle_864_of_1728 */
const G3FacsimileNonBasicParameters_Width_middle_864_of_1728 int32 = 37 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Width_middle_864_of_1728 */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Width_middle_1216_of_1728 */
const G3FacsimileNonBasicParameters_Width_middle_1216_of_1728 int32 = 38 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Width_middle_1216_of_1728 */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_type */
const G3FacsimileNonBasicParameters_Resolution_type int32 = 44 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_type */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_400x400 */
const G3FacsimileNonBasicParameters_Resolution_400x400 int32 = 45 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_400x400 */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_300x300 */
const G3FacsimileNonBasicParameters_Resolution_300x300 int32 = 46 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_300x300 */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_8x15 */
const G3FacsimileNonBasicParameters_Resolution_8x15 int32 = 47 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Resolution_8x15 */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Edi */
const G3FacsimileNonBasicParameters_Edi int32 = 49 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Edi */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Dtm */
const G3FacsimileNonBasicParameters_Dtm int32 = 50 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Dtm */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Bft */
const G3FacsimileNonBasicParameters_Bft int32 = 51 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Bft */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Mixed_mode */
const G3FacsimileNonBasicParameters_Mixed_mode int32 = 58 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Mixed_mode */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Character_mode */
const G3FacsimileNonBasicParameters_Character_mode int32 = 60 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Character_mode */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Twelve_bits */
const G3FacsimileNonBasicParameters_Twelve_bits int32 = 65 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Twelve_bits */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Preferred_huffmann */
const G3FacsimileNonBasicParameters_Preferred_huffmann int32 = 66 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Preferred_huffmann */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Full_colour */
const G3FacsimileNonBasicParameters_Full_colour int32 = 67 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Full_colour */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Jpeg */
const G3FacsimileNonBasicParameters_Jpeg int32 = 68 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Jpeg */

/* START_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Processable_mode_26 */
const G3FacsimileNonBasicParameters_Processable_mode_26 int32 = 71 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION G3FacsimileNonBasicParameters_Processable_mode_26 */ /* START_OF_SYMBOL_DEFINITION ORAddress */
// ### ASN.1 Definition:
//
// ```asn1
// ORAddress ::= SEQUENCE {
//   built-in-standard-attributes        BuiltInStandardAttributes,
//   built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
//   -- see also teletex-domain-defined-attributes
//   extension-attributes                ExtensionAttributes OPTIONAL }
// ```
//
//
type ORAddress struct {
	Built_in_standard_attributes       BuiltInStandardAttributes
	Built_in_domain_defined_attributes BuiltInDomainDefinedAttributes `asn1:"optional"`
	Extension_attributes               ExtensionAttributesSet         `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION ORAddress */ /* START_OF_SYMBOL_DEFINITION BuiltInStandardAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// BuiltInStandardAttributes ::= SEQUENCE {
//   country-name                CountryName OPTIONAL,
//   administration-domain-name  AdministrationDomainName OPTIONAL,
//   network-address             [0]  NetworkAddress OPTIONAL,
//   -- see also extended-network-address
//   terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
//   private-domain-name         [2]  PrivateDomainName OPTIONAL,
//   organization-name           [3]  OrganizationName OPTIONAL,
//   -- see also teletex-organization-name
//   numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
//   personal-name               [5]  PersonalName OPTIONAL,
//   -- see also teletex-personal-name
//   organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
//   -- see also teletex-organizational-unit-names --}
// ```
//
//
type BuiltInStandardAttributes struct {
	Country_name               X400CountryName          `asn1:"optional"`
	Administration_domain_name AdministrationDomainName `asn1:"optional"`
	Network_address            NetworkAddress           `asn1:"optional,explicit,tag:0"`
	Terminal_identifier        TerminalIdentifier       `asn1:"optional,explicit,tag:1"`
	Private_domain_name        PrivateDomainName        `asn1:"optional,explicit,tag:2"`
	Organization_name          OrganizationName         `asn1:"optional,explicit,tag:3"`
	Numeric_user_identifier    NumericUserIdentifier    `asn1:"optional,explicit,tag:4"`
	Personal_name              PersonalName             `asn1:"optional,explicit,tag:5"`
	Organizational_unit_names  OrganizationalUnitNames  `asn1:"optional,explicit,tag:6"`
}

/* END_OF_SYMBOL_DEFINITION BuiltInStandardAttributes */ /* START_OF_SYMBOL_DEFINITION CountryName */
// ### ASN.1 Definition:
//
// ```asn1
// CountryName  ::=  [APPLICATION 1]  CHOICE {
//   x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
//   iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }
// ```
type X400CountryName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CountryName */ /* START_OF_SYMBOL_DEFINITION AdministrationDomainName */
// ### ASN.1 Definition:
//
// ```asn1
// AdministrationDomainName  ::=  [APPLICATION 2]  CHOICE {
//   numeric    NumericString(SIZE (0..ub-domain-name-length)),
//   printable  PrintableString(SIZE (0..ub-domain-name-length)) }
// ```
type AdministrationDomainName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AdministrationDomainName */ /* START_OF_SYMBOL_DEFINITION NetworkAddress */
// ### ASN.1 Definition:
//
// ```asn1
// NetworkAddress  ::=  X121Address
// ```
type NetworkAddress = X121Address // DefinedType
/* END_OF_SYMBOL_DEFINITION NetworkAddress */ /* START_OF_SYMBOL_DEFINITION X121Address */
// ### ASN.1 Definition:
//
// ```asn1
// X121Address  ::=  NumericString(SIZE (1..ub-x121-address-length))
// ```
// type X121Address = string // NumericString
/* END_OF_SYMBOL_DEFINITION X121Address */ /* START_OF_SYMBOL_DEFINITION TerminalIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// TerminalIdentifier  ::=  PrintableString(SIZE (1..ub-terminal-id-length))
// ```
type TerminalIdentifier = string // PrintableString
/* END_OF_SYMBOL_DEFINITION TerminalIdentifier */ /* START_OF_SYMBOL_DEFINITION PrivateDomainName */
// ### ASN.1 Definition:
//
// ```asn1
// PrivateDomainName  ::=  CHOICE {
//   numeric    NumericString(SIZE (1..ub-domain-name-length)),
//   printable  PrintableString(SIZE (1..ub-domain-name-length)) }
// ```
type PrivateDomainName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PrivateDomainName */ /* START_OF_SYMBOL_DEFINITION OrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// OrganizationName  ::=  PrintableString(SIZE (1..ub-organization-name-length))
// ```
type OrganizationName = string // PrintableString
/* END_OF_SYMBOL_DEFINITION OrganizationName */ /* START_OF_SYMBOL_DEFINITION NumericUserIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// NumericUserIdentifier  ::=  NumericString(SIZE (1..ub-numeric-user-id-length))
// ```
type NumericUserIdentifier = string // NumericString
/* END_OF_SYMBOL_DEFINITION NumericUserIdentifier */ /* START_OF_SYMBOL_DEFINITION PersonalName */
// ### ASN.1 Definition:
//
// ```asn1
// PersonalName ::= SET {
//   surname               [0]  PrintableString(SIZE (1..ub-surname-length)),
//   given-name
//     [1]  PrintableString(SIZE (1..ub-given-name-length)) OPTIONAL,
//   initials
//     [2]  PrintableString(SIZE (1..ub-initials-length)) OPTIONAL,
//   generation-qualifier
//     [3]  PrintableString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }
// ```
//
//
type PersonalName struct {
	Surname              string `asn1:"explicit,tag:0"`
	Given_name           string `asn1:"optional,explicit,tag:1"`
	Initials             string `asn1:"optional,explicit,tag:2"`
	Generation_qualifier string `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION PersonalName */ /* START_OF_SYMBOL_DEFINITION OrganizationalUnitNames */
// ### ASN.1 Definition:
//
// ```asn1
// OrganizationalUnitNames  ::=
//   SEQUENCE SIZE (1..ub-organizational-units) OF OrganizationalUnitName
// ```
type OrganizationalUnitNames = [](OrganizationalUnitName) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION OrganizationalUnitNames */ /* START_OF_SYMBOL_DEFINITION OrganizationalUnitName */
// ### ASN.1 Definition:
//
// ```asn1
// OrganizationalUnitName  ::=
//   PrintableString(SIZE (1..ub-organizational-unit-name-length))
// ```
type OrganizationalUnitName = string // PrintableString
/* END_OF_SYMBOL_DEFINITION OrganizationalUnitName */ /* START_OF_SYMBOL_DEFINITION BuiltInDomainDefinedAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// BuiltInDomainDefinedAttributes  ::=
//   SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//     BuiltInDomainDefinedAttribute
// ```
type BuiltInDomainDefinedAttributes = [](BuiltInDomainDefinedAttribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION BuiltInDomainDefinedAttributes */ /* START_OF_SYMBOL_DEFINITION BuiltInDomainDefinedAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// BuiltInDomainDefinedAttribute ::= SEQUENCE {
//   type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
//   value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length)) }
// ```
//
//
type BuiltInDomainDefinedAttribute struct {
	Type  string
	Value string
}

/* END_OF_SYMBOL_DEFINITION BuiltInDomainDefinedAttribute */ /* START_OF_SYMBOL_DEFINITION ExtensionAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionAttributes  ::=
//   SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute
// ```
type ExtensionAttributesSet = [](X400ExtensionAttribute) // SetOfType
/* END_OF_SYMBOL_DEFINITION ExtensionAttributes */ /* START_OF_SYMBOL_DEFINITION ExtensionAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionAttribute ::= SEQUENCE {
//   extension-attribute-type
//     [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
//   extension-attribute-value
//     [1]  EXTENSION-ATTRIBUTE.&Type
//            ({ExtensionAttributeTable}{@extension-attribute-type}) }
// ```
//
//
type X400ExtensionAttribute struct {
	Extension_attribute_type  int           `asn1:"explicit,tag:0"`
	Extension_attribute_value asn1.RawValue `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION ExtensionAttribute */ /* START_OF_SYMBOL_DEFINITION CommonName */
// ### ASN.1 Definition:
//
// ```asn1
// CommonName  ::=  PrintableString(SIZE (1..ub-common-name-length))
// ```
type CommonName = string // PrintableString
/* END_OF_SYMBOL_DEFINITION CommonName */ /* START_OF_SYMBOL_DEFINITION TeletexCommonName */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexCommonName  ::=  TeletexString(SIZE (1..ub-common-name-length))
// ```
type TeletexCommonName = string // TeletexString
/* END_OF_SYMBOL_DEFINITION TeletexCommonName */ /* START_OF_SYMBOL_DEFINITION UniversalCommonName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalCommonName  ::=  UniversalOrBMPString{ub-common-name-length}
// ```
type UniversalCommonName = UniversalOrBMPString // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalCommonName */ /* START_OF_SYMBOL_DEFINITION TeletexOrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexOrganizationName  ::=
//   TeletexString(SIZE (1..ub-organization-name-length))
// ```
type TeletexOrganizationName = string // TeletexString
/* END_OF_SYMBOL_DEFINITION TeletexOrganizationName */ /* START_OF_SYMBOL_DEFINITION UniversalOrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalOrganizationName  ::=  UniversalOrBMPString{ub-organization-name-length}
// ```
type UniversalOrganizationName = UniversalOrBMPString // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalOrganizationName */ /* START_OF_SYMBOL_DEFINITION TeletexPersonalName */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexPersonalName ::= SET {
//   surname               [0]  TeletexString(SIZE (1..ub-surname-length)),
//   given-name
//     [1]  TeletexString(SIZE (1..ub-given-name-length)) OPTIONAL,
//   initials
//     [2]  TeletexString(SIZE (1..ub-initials-length)) OPTIONAL,
//   generation-qualifier
//     [3]  TeletexString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }
// ```
//
//
type TeletexPersonalName struct {
	Surname              string `asn1:"explicit,tag:0"`
	Given_name           string `asn1:"optional,explicit,tag:1"`
	Initials             string `asn1:"optional,explicit,tag:2"`
	Generation_qualifier string `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION TeletexPersonalName */ /* START_OF_SYMBOL_DEFINITION UniversalPersonalName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPersonalName ::= SET {
//   surname
//     [0]  UniversalOrBMPString{ub-universal-surname-length},
//   -- If a language is specified within surname, then that language applies to each of the
//   -- following optional components unless the component specifies another language.
//   given-name
//     [1]  UniversalOrBMPString{ub-universal-given-name-length} OPTIONAL,
//   initials
//     [2]  UniversalOrBMPString{ub-universal-initials-length} OPTIONAL,
//   generation-qualifier
//     [3]  UniversalOrBMPString{ub-universal-generation-qualifier-length} OPTIONAL }
// ```
//
//
type UniversalPersonalName struct {
	Surname              UniversalOrBMPString `asn1:"explicit,tag:0"`
	Given_name           UniversalOrBMPString `asn1:"optional,explicit,tag:1"`
	Initials             UniversalOrBMPString `asn1:"optional,explicit,tag:2"`
	Generation_qualifier UniversalOrBMPString `asn1:"optional,explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION UniversalPersonalName */ /* START_OF_SYMBOL_DEFINITION TeletexOrganizationalUnitNames */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexOrganizationalUnitNames  ::=
//   SEQUENCE SIZE (1..ub-organizational-units) OF TeletexOrganizationalUnitName
// ```
type TeletexOrganizationalUnitNames = [](TeletexOrganizationalUnitName) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION TeletexOrganizationalUnitNames */ /* START_OF_SYMBOL_DEFINITION TeletexOrganizationalUnitName */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexOrganizationalUnitName  ::=
//   TeletexString(SIZE (1..ub-organizational-unit-name-length))
// ```
type TeletexOrganizationalUnitName = string // TeletexString
/* END_OF_SYMBOL_DEFINITION TeletexOrganizationalUnitName */ /* START_OF_SYMBOL_DEFINITION UniversalOrganizationalUnitNames */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalOrganizationalUnitNames  ::=
//   SEQUENCE SIZE (1..ub-organizational-units) OF UniversalOrganizationalUnitName
// ```
type UniversalOrganizationalUnitNames = [](UniversalOrganizationalUnitName) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION UniversalOrganizationalUnitNames */ /* START_OF_SYMBOL_DEFINITION UniversalOrganizationalUnitName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalOrganizationalUnitName  ::=
//   UniversalOrBMPString{ub-organizational-unit-name-length}
// ```
type UniversalOrganizationalUnitName = UniversalOrBMPString // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalOrganizationalUnitName */ /* START_OF_SYMBOL_DEFINITION UniversalOrBMPString */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalOrBMPString{INTEGER:ub-string-length} ::= SET {
//   character-encoding     CHOICE {
//     two-octets             BMPString(SIZE (1..ub-string-length)),
//     four-octets            UniversalString(SIZE (1..ub-string-length))},
//   iso-639-language-code  PrintableString(SIZE (2 | 5)) OPTIONAL }
// ```
//
//
type UniversalOrBMPString struct {
	Character_encoding    UniversalOrBMPString_character_encoding
	Iso_639_language_code string `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION UniversalOrBMPString */ /* START_OF_SYMBOL_DEFINITION PDSName */
// ### ASN.1 Definition:
//
// ```asn1
// PDSName  ::=  PrintableString(SIZE (1..ub-pds-name-length))
// ```
type PDSName = string // PrintableString
/* END_OF_SYMBOL_DEFINITION PDSName */ /* START_OF_SYMBOL_DEFINITION PhysicalDeliveryCountryName */
// ### ASN.1 Definition:
//
// ```asn1
// PhysicalDeliveryCountryName  ::=  CHOICE {
//   x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
//   iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }
// ```
type PhysicalDeliveryCountryName = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PhysicalDeliveryCountryName */ /* START_OF_SYMBOL_DEFINITION PostalCode */
// ### ASN.1 Definition:
//
// ```asn1
// PostalCode  ::=  CHOICE {
//   numeric-code    NumericString(SIZE (1..ub-postal-code-length)),
//   printable-code  PrintableString(SIZE (1..ub-postal-code-length))
// }
// ```
type PostalCode = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PostalCode */ /* START_OF_SYMBOL_DEFINITION PhysicalDeliveryOfficeName */
// ### ASN.1 Definition:
//
// ```asn1
// PhysicalDeliveryOfficeName  ::=  PDSParameter
// ```
type PhysicalDeliveryOfficeName = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PhysicalDeliveryOfficeName */ /* START_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOfficeName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPhysicalDeliveryOfficeName  ::=  UniversalPDSParameter
// ```
type UniversalPhysicalDeliveryOfficeName = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOfficeName */ /* START_OF_SYMBOL_DEFINITION PhysicalDeliveryOfficeNumber */
// ### ASN.1 Definition:
//
// ```asn1
// PhysicalDeliveryOfficeNumber  ::=  PDSParameter
// ```
type PhysicalDeliveryOfficeNumber = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PhysicalDeliveryOfficeNumber */ /* START_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOfficeNumber */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPhysicalDeliveryOfficeNumber  ::=  UniversalPDSParameter
// ```
type UniversalPhysicalDeliveryOfficeNumber = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOfficeNumber */ /* START_OF_SYMBOL_DEFINITION ExtensionORAddressComponents */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionORAddressComponents  ::=  PDSParameter
// ```
type ExtensionORAddressComponents = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION ExtensionORAddressComponents */ /* START_OF_SYMBOL_DEFINITION UniversalExtensionORAddressComponents */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalExtensionORAddressComponents  ::=  UniversalPDSParameter
// ```
type UniversalExtensionORAddressComponents = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalExtensionORAddressComponents */ /* START_OF_SYMBOL_DEFINITION PhysicalDeliveryPersonalName */
// ### ASN.1 Definition:
//
// ```asn1
// PhysicalDeliveryPersonalName  ::=  PDSParameter
// ```
type PhysicalDeliveryPersonalName = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PhysicalDeliveryPersonalName */ /* START_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryPersonalName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPhysicalDeliveryPersonalName  ::=  UniversalPDSParameter
// ```
type UniversalPhysicalDeliveryPersonalName = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryPersonalName */ /* START_OF_SYMBOL_DEFINITION PhysicalDeliveryOrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// PhysicalDeliveryOrganizationName  ::=  PDSParameter
// ```
type PhysicalDeliveryOrganizationName = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PhysicalDeliveryOrganizationName */ /* START_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPhysicalDeliveryOrganizationName  ::=  UniversalPDSParameter
// ```
type UniversalPhysicalDeliveryOrganizationName = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPhysicalDeliveryOrganizationName */ /* START_OF_SYMBOL_DEFINITION ExtensionPhysicalDeliveryAddressComponents */
// ### ASN.1 Definition:
//
// ```asn1
// ExtensionPhysicalDeliveryAddressComponents  ::=  PDSParameter
// ```
type ExtensionPhysicalDeliveryAddressComponents = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION ExtensionPhysicalDeliveryAddressComponents */ /* START_OF_SYMBOL_DEFINITION UniversalExtensionPhysicalDeliveryAddressComponents */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalExtensionPhysicalDeliveryAddressComponents  ::=  UniversalPDSParameter
// ```
type UniversalExtensionPhysicalDeliveryAddressComponents = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalExtensionPhysicalDeliveryAddressComponents */ /* START_OF_SYMBOL_DEFINITION UnformattedPostalAddress */
// ### ASN.1 Definition:
//
// ```asn1
// UnformattedPostalAddress ::= SET {
//   printable-address SEQUENCE SIZE (1..ub-pds-physical-address-lines) OF
//     PrintableString (SIZE (1..ub-pds-parameter-length)) OPTIONAL,
//   teletex-string    TeletexString(SIZE (1..ub-unformatted-address-length)) OPTIONAL }
// ```
//
//
type UnformattedPostalAddress struct {
	Printable_address [](string) `asn1:"optional"`
	Teletex_string    string     `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION UnformattedPostalAddress */ /* START_OF_SYMBOL_DEFINITION UniversalUnformattedPostalAddress */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalUnformattedPostalAddress  ::=
//   UniversalOrBMPString{ub-unformatted-address-length}
// ```
type UniversalUnformattedPostalAddress = UniversalOrBMPString // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalUnformattedPostalAddress */ /* START_OF_SYMBOL_DEFINITION StreetAddress */
// ### ASN.1 Definition:
//
// ```asn1
// StreetAddress  ::=  PDSParameter
// ```
type StreetAddress = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION StreetAddress */ /* START_OF_SYMBOL_DEFINITION UniversalStreetAddress */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalStreetAddress  ::=  UniversalPDSParameter
// ```
type UniversalStreetAddress = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalStreetAddress */ /* START_OF_SYMBOL_DEFINITION PostOfficeBoxAddress */
// ### ASN.1 Definition:
//
// ```asn1
// PostOfficeBoxAddress  ::=  PDSParameter
// ```
type PostOfficeBoxAddress = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PostOfficeBoxAddress */ /* START_OF_SYMBOL_DEFINITION UniversalPostOfficeBoxAddress */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPostOfficeBoxAddress  ::=  UniversalPDSParameter
// ```
type UniversalPostOfficeBoxAddress = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPostOfficeBoxAddress */ /* START_OF_SYMBOL_DEFINITION PosteRestanteAddress */
// ### ASN.1 Definition:
//
// ```asn1
// PosteRestanteAddress  ::=  PDSParameter
// ```
type PosteRestanteAddress = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION PosteRestanteAddress */ /* START_OF_SYMBOL_DEFINITION UniversalPosteRestanteAddress */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPosteRestanteAddress  ::=  UniversalPDSParameter
// ```
type UniversalPosteRestanteAddress = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPosteRestanteAddress */ /* START_OF_SYMBOL_DEFINITION UniquePostalName */
// ### ASN.1 Definition:
//
// ```asn1
// UniquePostalName  ::=  PDSParameter
// ```
type UniquePostalName = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniquePostalName */ /* START_OF_SYMBOL_DEFINITION UniversalUniquePostalName */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalUniquePostalName  ::=  UniversalPDSParameter
// ```
type UniversalUniquePostalName = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalUniquePostalName */ /* START_OF_SYMBOL_DEFINITION LocalPostalAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// LocalPostalAttributes  ::=  PDSParameter
// ```
type LocalPostalAttributes = PDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION LocalPostalAttributes */ /* START_OF_SYMBOL_DEFINITION UniversalLocalPostalAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalLocalPostalAttributes  ::=  UniversalPDSParameter
// ```
type UniversalLocalPostalAttributes = UniversalPDSParameter // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalLocalPostalAttributes */ /* START_OF_SYMBOL_DEFINITION PDSParameter */
// ### ASN.1 Definition:
//
// ```asn1
// PDSParameter ::= SET {
//   printable-string  PrintableString(SIZE (1..ub-pds-parameter-length)) OPTIONAL,
//   teletex-string    TeletexString(SIZE (1..ub-pds-parameter-length)) OPTIONAL }
// ```
//
//
type PDSParameter struct {
	Printable_string string `asn1:"optional"`
	Teletex_string   string `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION PDSParameter */ /* START_OF_SYMBOL_DEFINITION UniversalPDSParameter */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalPDSParameter  ::=  UniversalOrBMPString{ub-pds-parameter-length}
// ```
type UniversalPDSParameter = UniversalOrBMPString // DefinedType
/* END_OF_SYMBOL_DEFINITION UniversalPDSParameter */ /* START_OF_SYMBOL_DEFINITION ExtendedNetworkAddress */
// ### ASN.1 Definition:
//
// ```asn1
// ExtendedNetworkAddress  ::=  CHOICE {
//   e163-4-address    SEQUENCE {
//     number       [0]  NumericString(SIZE (1..ub-e163-4-number-length)),
//     sub-address  [1]  NumericString(SIZE (1..ub-e163-4-sub-address-length))
//                   OPTIONAL},
//   psap-address [0]  PresentationAddress }
// ```
type ExtendedNetworkAddress = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ExtendedNetworkAddress */ /* START_OF_SYMBOL_DEFINITION TerminalType */
// ### ASN.1 Definition:
//
// ```asn1
// TerminalType  ::=  INTEGER {
//   telex(3), teletex(4), g3-facsimile(5), g4-facsimile(6), ia5-terminal(7),
//   videotex(8)}(0..ub-integer-options)
// ```
type TerminalType = int64

/* END_OF_SYMBOL_DEFINITION TerminalType */

/* START_OF_SYMBOL_DEFINITION TerminalType_Telex */
const TerminalType_Telex TerminalType = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_Telex */

/* START_OF_SYMBOL_DEFINITION TerminalType_Teletex */
const TerminalType_Teletex TerminalType = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_Teletex */

/* START_OF_SYMBOL_DEFINITION TerminalType_G3_facsimile */
const TerminalType_G3_facsimile TerminalType = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_G3_facsimile */

/* START_OF_SYMBOL_DEFINITION TerminalType_G4_facsimile */
const TerminalType_G4_facsimile TerminalType = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_G4_facsimile */

/* START_OF_SYMBOL_DEFINITION TerminalType_Ia5_terminal */
const TerminalType_Ia5_terminal TerminalType = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_Ia5_terminal */

/* START_OF_SYMBOL_DEFINITION TerminalType_Videotex */
const TerminalType_Videotex TerminalType = 8 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION TerminalType_Videotex */ /* START_OF_SYMBOL_DEFINITION TeletexDomainDefinedAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexDomainDefinedAttributes  ::=
//   SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//     TeletexDomainDefinedAttribute
// ```
type TeletexDomainDefinedAttributes = [](TeletexDomainDefinedAttribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION TeletexDomainDefinedAttributes */ /* START_OF_SYMBOL_DEFINITION TeletexDomainDefinedAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// TeletexDomainDefinedAttribute ::= SEQUENCE {
//   type   TeletexString(SIZE (1..ub-domain-defined-attribute-type-length)),
//   value  TeletexString(SIZE (1..ub-domain-defined-attribute-value-length)) }
// ```
//
//
type TeletexDomainDefinedAttribute struct {
	Type  string
	Value string
}

/* END_OF_SYMBOL_DEFINITION TeletexDomainDefinedAttribute */ /* START_OF_SYMBOL_DEFINITION UniversalDomainDefinedAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalDomainDefinedAttributes  ::=
//   SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//     UniversalDomainDefinedAttribute
// ```
type UniversalDomainDefinedAttributes = [](UniversalDomainDefinedAttribute) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION UniversalDomainDefinedAttributes */ /* START_OF_SYMBOL_DEFINITION UniversalDomainDefinedAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalDomainDefinedAttribute ::= SEQUENCE {
//   type   UniversalOrBMPString{ub-domain-defined-attribute-type-length},
//   value  UniversalOrBMPString{ub-domain-defined-attribute-value-length} }
// ```
//
//
type UniversalDomainDefinedAttribute struct {
	Type  UniversalOrBMPString
	Value UniversalOrBMPString
}

/* END_OF_SYMBOL_DEFINITION UniversalDomainDefinedAttribute */ /* START_OF_SYMBOL_DEFINITION Ub_integer_options */
// ### ASN.1 Definition:
//
// ```asn1
// ub-integer-options                        INTEGER ::= 256
// ```
//
//
const Ub_integer_options int = 256

/* END_OF_SYMBOL_DEFINITION Ub_integer_options */ /* START_OF_SYMBOL_DEFINITION Ub_e163_4_number_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-e163-4-number-length                   INTEGER ::= 15
// ```
//
//
const Ub_e163_4_number_length int = 15

/* END_OF_SYMBOL_DEFINITION Ub_e163_4_number_length */ /* START_OF_SYMBOL_DEFINITION Ub_e163_4_sub_address_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-e163-4-sub-address-length              INTEGER ::= 40
// ```
//
//
const Ub_e163_4_sub_address_length int = 40

/* END_OF_SYMBOL_DEFINITION Ub_e163_4_sub_address_length */ /* START_OF_SYMBOL_DEFINITION Ub_unformatted_address_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-unformatted-address-length             INTEGER ::= 180
// ```
//
//
const Ub_unformatted_address_length int = 180

/* END_OF_SYMBOL_DEFINITION Ub_unformatted_address_length */ /* START_OF_SYMBOL_DEFINITION Ub_pds_parameter_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-pds-parameter-length                   INTEGER ::= 30
// ```
//
//
const Ub_pds_parameter_length int = 30

/* END_OF_SYMBOL_DEFINITION Ub_pds_parameter_length */ /* START_OF_SYMBOL_DEFINITION Ub_pds_physical_address_lines */
// ### ASN.1 Definition:
//
// ```asn1
// ub-pds-physical-address-lines             INTEGER ::= 6
// ```
//
//
const Ub_pds_physical_address_lines int = 6

/* END_OF_SYMBOL_DEFINITION Ub_pds_physical_address_lines */ /* START_OF_SYMBOL_DEFINITION Ub_postal_code_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-postal-code-length                     INTEGER ::= 16
// ```
//
//
const Ub_postal_code_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_postal_code_length */ /* START_OF_SYMBOL_DEFINITION Ub_pds_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-pds-name-length                        INTEGER ::= 16
// ```
//
//
const Ub_pds_name_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_pds_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_universal_surname_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-universal-surname-length               INTEGER ::= 64
// ```
//
//
const Ub_universal_surname_length int = 64

/* END_OF_SYMBOL_DEFINITION Ub_universal_surname_length */ /* START_OF_SYMBOL_DEFINITION Ub_universal_given_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-universal-given-name-length            INTEGER ::= 40
// ```
//
//
const Ub_universal_given_name_length int = 40

/* END_OF_SYMBOL_DEFINITION Ub_universal_given_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_universal_initials_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-universal-initials-length              INTEGER ::= 16
// ```
//
//
const Ub_universal_initials_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_universal_initials_length */ /* START_OF_SYMBOL_DEFINITION Ub_universal_generation_qualifier_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-universal-generation-qualifier-length  INTEGER ::= 16
// ```
//
//
const Ub_universal_generation_qualifier_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_universal_generation_qualifier_length */ /* START_OF_SYMBOL_DEFINITION Ub_common_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-common-name-length                     INTEGER ::= 64
// ```
//
//
const Ub_common_name_length int = 64

/* END_OF_SYMBOL_DEFINITION Ub_common_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_extension_attributes */
// ### ASN.1 Definition:
//
// ```asn1
// ub-extension-attributes                   INTEGER ::= 256
// ```
//
//
const Ub_extension_attributes int = 256

/* END_OF_SYMBOL_DEFINITION Ub_extension_attributes */ /* START_OF_SYMBOL_DEFINITION Ub_domain_defined_attribute_type_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-domain-defined-attribute-type-length   INTEGER ::= 8
// ```
//
//
const Ub_domain_defined_attribute_type_length int = 8

/* END_OF_SYMBOL_DEFINITION Ub_domain_defined_attribute_type_length */ /* START_OF_SYMBOL_DEFINITION Ub_domain_defined_attribute_value_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-domain-defined-attribute-value-length  INTEGER ::= 128
// ```
//
//
const Ub_domain_defined_attribute_value_length int = 128

/* END_OF_SYMBOL_DEFINITION Ub_domain_defined_attribute_value_length */ /* START_OF_SYMBOL_DEFINITION Ub_domain_defined_attributes */
// ### ASN.1 Definition:
//
// ```asn1
// ub-domain-defined-attributes              INTEGER ::= 4
// ```
//
//
const Ub_domain_defined_attributes int = 4

/* END_OF_SYMBOL_DEFINITION Ub_domain_defined_attributes */ /* START_OF_SYMBOL_DEFINITION Ub_organizational_unit_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-organizational-unit-name-length        INTEGER ::= 32
// ```
//
//
const Ub_organizational_unit_name_length int = 32

/* END_OF_SYMBOL_DEFINITION Ub_organizational_unit_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_organizational_units */
// ### ASN.1 Definition:
//
// ```asn1
// ub-organizational-units                   INTEGER ::= 4
// ```
//
//
const Ub_organizational_units int = 4

/* END_OF_SYMBOL_DEFINITION Ub_organizational_units */ /* START_OF_SYMBOL_DEFINITION Ub_generation_qualifier_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-generation-qualifier-length            INTEGER ::= 3
// ```
//
//
const Ub_generation_qualifier_length int = 3

/* END_OF_SYMBOL_DEFINITION Ub_generation_qualifier_length */ /* START_OF_SYMBOL_DEFINITION Ub_initials_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-initials-length                        INTEGER ::= 5
// ```
//
//
const Ub_initials_length int = 5

/* END_OF_SYMBOL_DEFINITION Ub_initials_length */ /* START_OF_SYMBOL_DEFINITION Ub_given_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-given-name-length                      INTEGER ::= 16
// ```
//
//
const Ub_given_name_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_given_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_surname_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-surname-length                         INTEGER ::= 40
// ```
//
//
const Ub_surname_length int = 40

/* END_OF_SYMBOL_DEFINITION Ub_surname_length */ /* START_OF_SYMBOL_DEFINITION Ub_numeric_user_id_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-numeric-user-id-length                 INTEGER ::= 32
// ```
//
//
const Ub_numeric_user_id_length int = 32

/* END_OF_SYMBOL_DEFINITION Ub_numeric_user_id_length */ /* START_OF_SYMBOL_DEFINITION Ub_organization_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-organization-name-length               INTEGER ::= 64
// ```
//
//
const Ub_organization_name_length int = 64

/* END_OF_SYMBOL_DEFINITION Ub_organization_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_terminal_id_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-terminal-id-length                     INTEGER ::= 24
// ```
//
//
const Ub_terminal_id_length int = 24

/* END_OF_SYMBOL_DEFINITION Ub_terminal_id_length */ /* START_OF_SYMBOL_DEFINITION Ub_x121_address_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-x121-address-length                    INTEGER ::= 16
// ```
//
//
const Ub_x121_address_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_x121_address_length */ /* START_OF_SYMBOL_DEFINITION Ub_domain_name_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-domain-name-length                     INTEGER ::= 16
// ```
//
//
const Ub_domain_name_length int = 16

/* END_OF_SYMBOL_DEFINITION Ub_domain_name_length */ /* START_OF_SYMBOL_DEFINITION Ub_country_name_alpha_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-country-name-alpha-length              INTEGER ::= 2
// ```
//
//
const Ub_country_name_alpha_length int = 2

/* END_OF_SYMBOL_DEFINITION Ub_country_name_alpha_length */ /* START_OF_SYMBOL_DEFINITION Ub_country_name_numeric_length */
// ### ASN.1 Definition:
//
// ```asn1
// ub-country-name-numeric-length            INTEGER ::= 3
// ```
//
//
const Ub_country_name_numeric_length int = 3

/* END_OF_SYMBOL_DEFINITION Ub_country_name_numeric_length */ /* START_OF_SYMBOL_DEFINITION UniversalOrBMPString_character_encoding */
// ### ASN.1 Definition:
//
// ```asn1
// UniversalOrBMPString-character-encoding ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type UniversalOrBMPString_character_encoding = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UniversalOrBMPString_character_encoding */ /* START_OF_SYMBOL_DEFINITION ExtendedNetworkAddress_e163_4_address */
// ### ASN.1 Definition:
//
// ```asn1
// ExtendedNetworkAddress-e163-4-address ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ExtendedNetworkAddress_e163_4_address struct {
	Number      string `asn1:"explicit,tag:0"`
	Sub_address string `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION ExtendedNetworkAddress_e163_4_address */
