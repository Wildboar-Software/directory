package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
// UserNotice ::= SEQUENCE {
//   noticeRef     NoticeReference OPTIONAL,
//   explicitText  DisplayText OPTIONAL }
//
//
// type UserNotice struct {
// 	NoticeRef    NoticeReference `asn1:"optional"`
// 	ExplicitText DisplayText     `asn1:"optional"`
// }

// # ASN.1 Definition:
//
//	NoticeReference ::= SEQUENCE {
//	  organization   DisplayText,
//	  noticeNumbers  SEQUENCE OF INTEGER }
//
//
//	type NoticeReference struct {
//	    Organization DisplayText
//	    NoticeNumbers [](int)
//	}
//
// # ASN.1 Definition:
//
//	DisplayText  ::=  CHOICE {
//	  visibleString  VisibleString(SIZE (1..200)),
//	  bmpString      BMPString(SIZE (1..200)),
//	  utf8String     UTF8String(SIZE (1..200)) }
type DisplayText = asn1.RawValue

// # ASN.1 Definition:
//
// AuthorityInfoAccessSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AccessDescription
type AuthorityInfoAccessSyntax = [](AccessDescription) // SequenceOfType
// # ASN.1 Definition:
//
//	AccessDescription ::= SEQUENCE {
//	  accessMethod    OBJECT IDENTIFIER,
//	  accessLocation  GeneralName }
type AccessDescription struct {
	AccessMethod   asn1.ObjectIdentifier
	AccessLocation GeneralName
}

// # ASN.1 Definition:
//
// SubjectInfoAccessSyntax  ::=  SEQUENCE SIZE (1..MAX) OF AccessDescription
type SubjectInfoAccessSyntax = [](AccessDescription) // SequenceOfType
// # ASN.1 Definition:
//
// id-pkix                   OBJECT IDENTIFIER ::= { intSecurity mechanisms(5) pkix(7) }
var Id_pkix asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-pe                     OBJECT IDENTIFIER ::= { id-pkix 1 }
var Id_pe asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ad                     OBJECT IDENTIFIER ::= { id-pkix 48 }
var Id_ad asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-pe-authorityInfoAccess OBJECT IDENTIFIER ::= { id-pe 1 }
var Id_pe_authorityInfoAccess asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-pe-subjectInfoAccess   OBJECT IDENTIFIER ::= { id-pe 11 }
var Id_pe_subjectInfoAccess asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 1, 11} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ad-caIssuers           OBJECT IDENTIFIER ::= { id-ad 2 }
var Id_ad_caIssuers asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-ad-ocsp                OBJECT IDENTIFIER ::= { id-ad 1 }
var Id_ad_ocsp asn1.ObjectIdentifier = []int{1, 3, 6, 1, 5, 5, 7, 48, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
//	G3FacsimileNonBasicParameters  ::=  BIT STRING {
//	  two-dimensional(8), -- As defined in ITU-T Recommendation T.30
//	  fine-resolution(9),
//	  unlimited-length(20), -- These bit values are chosen such that when
//	  b4-length(21), -- encoded using ASN.1 Basic Encoding Rules
//	  a3-width(22), -- the resulting octets have the same values
//	  b4-width(23), -- as for T.30 encoding
//	  t6-coding(25),
//	  uncompressed(30), -- Trailing zero bits are not significant
//	  width-middle-864-of-1728(37), -- It is recommended that implementations
//	  width-middle-1216-of-1728(38), -- should not encode more than 32 bits unless
//	  resolution-type(44), -- higher numbered bits are non-zero
//	  resolution-400x400(45), resolution-300x300(46), resolution-8x15(47),
//	  edi(49), dtm(50), bft(51), mixed-mode(58), character-mode(60),
//	  twelve-bits(65), preferred-huffmann(66), full-colour(67), jpeg(68),
//	  processable-mode-26(71)}
type G3FacsimileNonBasicParameters = asn1.BitString

const G3FacsimileNonBasicParameters_Two_dimensional int32 = 8

const G3FacsimileNonBasicParameters_Fine_resolution int32 = 9

const G3FacsimileNonBasicParameters_Unlimited_length int32 = 20

const G3FacsimileNonBasicParameters_B4_length int32 = 21

const G3FacsimileNonBasicParameters_A3_width int32 = 22

const G3FacsimileNonBasicParameters_B4_width int32 = 23

const G3FacsimileNonBasicParameters_T6_coding int32 = 25

const G3FacsimileNonBasicParameters_Uncompressed int32 = 30

const G3FacsimileNonBasicParameters_Width_middle_864_of_1728 int32 = 37

const G3FacsimileNonBasicParameters_Width_middle_1216_of_1728 int32 = 38

const G3FacsimileNonBasicParameters_Resolution_type int32 = 44

const G3FacsimileNonBasicParameters_Resolution_400x400 int32 = 45

const G3FacsimileNonBasicParameters_Resolution_300x300 int32 = 46

const G3FacsimileNonBasicParameters_Resolution_8x15 int32 = 47

const G3FacsimileNonBasicParameters_Edi int32 = 49

const G3FacsimileNonBasicParameters_Dtm int32 = 50

const G3FacsimileNonBasicParameters_Bft int32 = 51

const G3FacsimileNonBasicParameters_Mixed_mode int32 = 58

const G3FacsimileNonBasicParameters_Character_mode int32 = 60

const G3FacsimileNonBasicParameters_Twelve_bits int32 = 65

const G3FacsimileNonBasicParameters_Preferred_huffmann int32 = 66

const G3FacsimileNonBasicParameters_Full_colour int32 = 67

const G3FacsimileNonBasicParameters_Jpeg int32 = 68

const G3FacsimileNonBasicParameters_Processable_mode_26 int32 = 71

// # ASN.1 Definition:
//
//	ORAddress ::= SEQUENCE {
//	  built-in-standard-attributes        BuiltInStandardAttributes,
//	  built-in-domain-defined-attributes  BuiltInDomainDefinedAttributes OPTIONAL,
//	  -- see also teletex-domain-defined-attributes
//	  extension-attributes                ExtensionAttributes OPTIONAL }
type ORAddress struct {
	Built_in_standard_attributes       BuiltInStandardAttributes
	Built_in_domain_defined_attributes BuiltInDomainDefinedAttributes `asn1:"optional"`
	Extension_attributes               ExtensionAttributesSet         `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	BuiltInStandardAttributes ::= SEQUENCE {
//	  country-name                CountryName OPTIONAL,
//	  administration-domain-name  AdministrationDomainName OPTIONAL,
//	  network-address             [0]  NetworkAddress OPTIONAL,
//	  -- see also extended-network-address
//	  terminal-identifier         [1]  TerminalIdentifier OPTIONAL,
//	  private-domain-name         [2]  PrivateDomainName OPTIONAL,
//	  organization-name           [3]  OrganizationName OPTIONAL,
//	  -- see also teletex-organization-name
//	  numeric-user-identifier     [4]  NumericUserIdentifier OPTIONAL,
//	  personal-name               [5]  PersonalName OPTIONAL,
//	  -- see also teletex-personal-name
//	  organizational-unit-names   [6]  OrganizationalUnitNames OPTIONAL
//	  -- see also teletex-organizational-unit-names --}
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

// # ASN.1 Definition:
//
//	CountryName  ::=  [APPLICATION 1]  CHOICE {
//	  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
//	  iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }
type X400CountryName = asn1.RawValue

// # ASN.1 Definition:
//
//	AdministrationDomainName  ::=  [APPLICATION 2]  CHOICE {
//	  numeric    NumericString(SIZE (0..ub-domain-name-length)),
//	  printable  PrintableString(SIZE (0..ub-domain-name-length)) }
type AdministrationDomainName = asn1.RawValue

// # ASN.1 Definition:
//
// NetworkAddress  ::=  X121Address
type NetworkAddress = X121Address // DefinedType
// # ASN.1 Definition:
//
// X121Address  ::=  NumericString(SIZE (1..ub-x121-address-length))
// type X121Address = string // NumericString
// # ASN.1 Definition:
//
// TerminalIdentifier  ::=  PrintableString(SIZE (1..ub-terminal-id-length))
type TerminalIdentifier = string // PrintableString
// # ASN.1 Definition:
//
//	PrivateDomainName  ::=  CHOICE {
//	  numeric    NumericString(SIZE (1..ub-domain-name-length)),
//	  printable  PrintableString(SIZE (1..ub-domain-name-length)) }
type PrivateDomainName = asn1.RawValue

// # ASN.1 Definition:
//
// OrganizationName  ::=  PrintableString(SIZE (1..ub-organization-name-length))
type OrganizationName = string // PrintableString
// # ASN.1 Definition:
//
// NumericUserIdentifier  ::=  NumericString(SIZE (1..ub-numeric-user-id-length))
type NumericUserIdentifier = string // NumericString
// # ASN.1 Definition:
//
//	PersonalName ::= SET {
//	  surname               [0]  PrintableString(SIZE (1..ub-surname-length)),
//	  given-name
//	    [1]  PrintableString(SIZE (1..ub-given-name-length)) OPTIONAL,
//	  initials
//	    [2]  PrintableString(SIZE (1..ub-initials-length)) OPTIONAL,
//	  generation-qualifier
//	    [3]  PrintableString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }
type PersonalName struct {
	Surname              string `asn1:"explicit,tag:0"`
	Given_name           string `asn1:"optional,explicit,tag:1"`
	Initials             string `asn1:"optional,explicit,tag:2"`
	Generation_qualifier string `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
// OrganizationalUnitNames  ::=
//
//	SEQUENCE SIZE (1..ub-organizational-units) OF OrganizationalUnitName
type OrganizationalUnitNames = [](OrganizationalUnitName) // SequenceOfType
// # ASN.1 Definition:
//
// OrganizationalUnitName  ::=
//
//	PrintableString(SIZE (1..ub-organizational-unit-name-length))
type OrganizationalUnitName = string // PrintableString
// # ASN.1 Definition:
//
// BuiltInDomainDefinedAttributes  ::=
//
//	SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//	  BuiltInDomainDefinedAttribute
type BuiltInDomainDefinedAttributes = [](BuiltInDomainDefinedAttribute) // SequenceOfType
// # ASN.1 Definition:
//
//	BuiltInDomainDefinedAttribute ::= SEQUENCE {
//	  type   PrintableString(SIZE (1..ub-domain-defined-attribute-type-length)),
//	  value  PrintableString(SIZE (1..ub-domain-defined-attribute-value-length)) }
type BuiltInDomainDefinedAttribute struct {
	Type  string
	Value string
}

// # ASN.1 Definition:
//
// ExtensionAttributes  ::=
//
//	SET SIZE (1..ub-extension-attributes) OF ExtensionAttribute
type ExtensionAttributesSet = [](X400ExtensionAttribute) // SetOfType
// # ASN.1 Definition:
//
//	ExtensionAttribute ::= SEQUENCE {
//	  extension-attribute-type
//	    [0]  EXTENSION-ATTRIBUTE.&id({ExtensionAttributeTable}),
//	  extension-attribute-value
//	    [1]  EXTENSION-ATTRIBUTE.&Type
//	           ({ExtensionAttributeTable}{@extension-attribute-type}) }
type X400ExtensionAttribute struct {
	Extension_attribute_type  int           `asn1:"explicit,tag:0"`
	Extension_attribute_value asn1.RawValue `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
// CommonName  ::=  PrintableString(SIZE (1..ub-common-name-length))
type CommonName = string // PrintableString
// # ASN.1 Definition:
//
// TeletexCommonName  ::=  TeletexString(SIZE (1..ub-common-name-length))
type TeletexCommonName = string // TeletexString
// # ASN.1 Definition:
//
// UniversalCommonName  ::=  UniversalOrBMPString{ub-common-name-length}
type UniversalCommonName = UniversalOrBMPString // DefinedType
// # ASN.1 Definition:
//
// TeletexOrganizationName  ::=
//
//	TeletexString(SIZE (1..ub-organization-name-length))
type TeletexOrganizationName = string // TeletexString
// # ASN.1 Definition:
//
// UniversalOrganizationName  ::=  UniversalOrBMPString{ub-organization-name-length}
type UniversalOrganizationName = UniversalOrBMPString // DefinedType
// # ASN.1 Definition:
//
//	TeletexPersonalName ::= SET {
//	  surname               [0]  TeletexString(SIZE (1..ub-surname-length)),
//	  given-name
//	    [1]  TeletexString(SIZE (1..ub-given-name-length)) OPTIONAL,
//	  initials
//	    [2]  TeletexString(SIZE (1..ub-initials-length)) OPTIONAL,
//	  generation-qualifier
//	    [3]  TeletexString(SIZE (1..ub-generation-qualifier-length)) OPTIONAL }
type TeletexPersonalName struct {
	Surname              string `asn1:"explicit,tag:0"`
	Given_name           string `asn1:"optional,explicit,tag:1"`
	Initials             string `asn1:"optional,explicit,tag:2"`
	Generation_qualifier string `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
//	UniversalPersonalName ::= SET {
//	  surname
//	    [0]  UniversalOrBMPString{ub-universal-surname-length},
//	  -- If a language is specified within surname, then that language applies to each of the
//	  -- following optional components unless the component specifies another language.
//	  given-name
//	    [1]  UniversalOrBMPString{ub-universal-given-name-length} OPTIONAL,
//	  initials
//	    [2]  UniversalOrBMPString{ub-universal-initials-length} OPTIONAL,
//	  generation-qualifier
//	    [3]  UniversalOrBMPString{ub-universal-generation-qualifier-length} OPTIONAL }
type UniversalPersonalName struct {
	Surname              UniversalOrBMPString `asn1:"explicit,tag:0"`
	Given_name           UniversalOrBMPString `asn1:"optional,explicit,tag:1"`
	Initials             UniversalOrBMPString `asn1:"optional,explicit,tag:2"`
	Generation_qualifier UniversalOrBMPString `asn1:"optional,explicit,tag:3"`
}

// # ASN.1 Definition:
//
// TeletexOrganizationalUnitNames  ::=
//
//	SEQUENCE SIZE (1..ub-organizational-units) OF TeletexOrganizationalUnitName
type TeletexOrganizationalUnitNames = [](TeletexOrganizationalUnitName) // SequenceOfType
// # ASN.1 Definition:
//
// TeletexOrganizationalUnitName  ::=
//
//	TeletexString(SIZE (1..ub-organizational-unit-name-length))
type TeletexOrganizationalUnitName = string // TeletexString
// # ASN.1 Definition:
//
// UniversalOrganizationalUnitNames  ::=
//
//	SEQUENCE SIZE (1..ub-organizational-units) OF UniversalOrganizationalUnitName
type UniversalOrganizationalUnitNames = [](UniversalOrganizationalUnitName) // SequenceOfType
// # ASN.1 Definition:
//
// UniversalOrganizationalUnitName  ::=
//
//	UniversalOrBMPString{ub-organizational-unit-name-length}
type UniversalOrganizationalUnitName = UniversalOrBMPString // DefinedType
// # ASN.1 Definition:
//
//	UniversalOrBMPString{INTEGER:ub-string-length} ::= SET {
//	  character-encoding     CHOICE {
//	    two-octets             BMPString(SIZE (1..ub-string-length)),
//	    four-octets            UniversalString(SIZE (1..ub-string-length))},
//	  iso-639-language-code  PrintableString(SIZE (2 | 5)) OPTIONAL }
type UniversalOrBMPString struct {
	Character_encoding    UniversalOrBMPString_character_encoding
	Iso_639_language_code string `asn1:"optional"`
}

// # ASN.1 Definition:
//
// PDSName  ::=  PrintableString(SIZE (1..ub-pds-name-length))
type PDSName = string // PrintableString
// # ASN.1 Definition:
//
//	PhysicalDeliveryCountryName  ::=  CHOICE {
//	  x121-dcc-code         NumericString(SIZE (ub-country-name-numeric-length)),
//	  iso-3166-alpha2-code  PrintableString(SIZE (ub-country-name-alpha-length)) }
type PhysicalDeliveryCountryName = asn1.RawValue

// # ASN.1 Definition:
//
//	PostalCode  ::=  CHOICE {
//	  numeric-code    NumericString(SIZE (1..ub-postal-code-length)),
//	  printable-code  PrintableString(SIZE (1..ub-postal-code-length))
//	}
type PostalCode = asn1.RawValue

// # ASN.1 Definition:
//
// PhysicalDeliveryOfficeName  ::=  PDSParameter
type PhysicalDeliveryOfficeName = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPhysicalDeliveryOfficeName  ::=  UniversalPDSParameter
type UniversalPhysicalDeliveryOfficeName = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// PhysicalDeliveryOfficeNumber  ::=  PDSParameter
type PhysicalDeliveryOfficeNumber = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPhysicalDeliveryOfficeNumber  ::=  UniversalPDSParameter
type UniversalPhysicalDeliveryOfficeNumber = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// ExtensionORAddressComponents  ::=  PDSParameter
type ExtensionORAddressComponents = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalExtensionORAddressComponents  ::=  UniversalPDSParameter
type UniversalExtensionORAddressComponents = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// PhysicalDeliveryPersonalName  ::=  PDSParameter
type PhysicalDeliveryPersonalName = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPhysicalDeliveryPersonalName  ::=  UniversalPDSParameter
type UniversalPhysicalDeliveryPersonalName = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// PhysicalDeliveryOrganizationName  ::=  PDSParameter
type PhysicalDeliveryOrganizationName = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPhysicalDeliveryOrganizationName  ::=  UniversalPDSParameter
type UniversalPhysicalDeliveryOrganizationName = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// ExtensionPhysicalDeliveryAddressComponents  ::=  PDSParameter
type ExtensionPhysicalDeliveryAddressComponents = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalExtensionPhysicalDeliveryAddressComponents  ::=  UniversalPDSParameter
type UniversalExtensionPhysicalDeliveryAddressComponents = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
//	UnformattedPostalAddress ::= SET {
//	  printable-address SEQUENCE SIZE (1..ub-pds-physical-address-lines) OF
//	    PrintableString (SIZE (1..ub-pds-parameter-length)) OPTIONAL,
//	  teletex-string    TeletexString(SIZE (1..ub-unformatted-address-length)) OPTIONAL }
type UnformattedPostalAddress struct {
	Printable_address [](string) `asn1:"optional"`
	Teletex_string    string     `asn1:"optional"`
}

// # ASN.1 Definition:
//
// UniversalUnformattedPostalAddress  ::=
//
//	UniversalOrBMPString{ub-unformatted-address-length}
type UniversalUnformattedPostalAddress = UniversalOrBMPString // DefinedType
// # ASN.1 Definition:
//
// StreetAddress  ::=  PDSParameter
type StreetAddress = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalStreetAddress  ::=  UniversalPDSParameter
type UniversalStreetAddress = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// PostOfficeBoxAddress  ::=  PDSParameter
type PostOfficeBoxAddress = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPostOfficeBoxAddress  ::=  UniversalPDSParameter
type UniversalPostOfficeBoxAddress = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// PosteRestanteAddress  ::=  PDSParameter
type PosteRestanteAddress = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalPosteRestanteAddress  ::=  UniversalPDSParameter
type UniversalPosteRestanteAddress = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniquePostalName  ::=  PDSParameter
type UniquePostalName = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalUniquePostalName  ::=  UniversalPDSParameter
type UniversalUniquePostalName = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
// LocalPostalAttributes  ::=  PDSParameter
type LocalPostalAttributes = PDSParameter // DefinedType
// # ASN.1 Definition:
//
// UniversalLocalPostalAttributes  ::=  UniversalPDSParameter
type UniversalLocalPostalAttributes = UniversalPDSParameter // DefinedType
// # ASN.1 Definition:
//
//	PDSParameter ::= SET {
//	  printable-string  PrintableString(SIZE (1..ub-pds-parameter-length)) OPTIONAL,
//	  teletex-string    TeletexString(SIZE (1..ub-pds-parameter-length)) OPTIONAL }
type PDSParameter struct {
	Printable_string string `asn1:"optional"`
	Teletex_string   string `asn1:"optional"`
}

// # ASN.1 Definition:
//
// UniversalPDSParameter  ::=  UniversalOrBMPString{ub-pds-parameter-length}
type UniversalPDSParameter = UniversalOrBMPString // DefinedType
// # ASN.1 Definition:
//
//	ExtendedNetworkAddress  ::=  CHOICE {
//	  e163-4-address    SEQUENCE {
//	    number       [0]  NumericString(SIZE (1..ub-e163-4-number-length)),
//	    sub-address  [1]  NumericString(SIZE (1..ub-e163-4-sub-address-length))
//	                  OPTIONAL},
//	  psap-address [0]  PresentationAddress }
type ExtendedNetworkAddress = asn1.RawValue

// # ASN.1 Definition:
//
//	TerminalType  ::=  INTEGER {
//	  telex(3), teletex(4), g3-facsimile(5), g4-facsimile(6), ia5-terminal(7),
//	  videotex(8)}(0..ub-integer-options)
type TerminalType = int64

const TerminalType_Telex TerminalType = 3

const TerminalType_Teletex TerminalType = 4

const TerminalType_G3_facsimile TerminalType = 5

const TerminalType_G4_facsimile TerminalType = 6

const TerminalType_Ia5_terminal TerminalType = 7

const TerminalType_Videotex TerminalType = 8

// # ASN.1 Definition:
//
// TeletexDomainDefinedAttributes  ::=
//
//	SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//	  TeletexDomainDefinedAttribute
type TeletexDomainDefinedAttributes = [](TeletexDomainDefinedAttribute) // SequenceOfType
// # ASN.1 Definition:
//
//	TeletexDomainDefinedAttribute ::= SEQUENCE {
//	  type   TeletexString(SIZE (1..ub-domain-defined-attribute-type-length)),
//	  value  TeletexString(SIZE (1..ub-domain-defined-attribute-value-length)) }
type TeletexDomainDefinedAttribute struct {
	Type  string
	Value string
}

// # ASN.1 Definition:
//
// UniversalDomainDefinedAttributes  ::=
//
//	SEQUENCE SIZE (1..ub-domain-defined-attributes) OF
//	  UniversalDomainDefinedAttribute
type UniversalDomainDefinedAttributes = [](UniversalDomainDefinedAttribute) // SequenceOfType
// # ASN.1 Definition:
//
//	UniversalDomainDefinedAttribute ::= SEQUENCE {
//	  type   UniversalOrBMPString{ub-domain-defined-attribute-type-length},
//	  value  UniversalOrBMPString{ub-domain-defined-attribute-value-length} }
type UniversalDomainDefinedAttribute struct {
	Type  UniversalOrBMPString
	Value UniversalOrBMPString
}

// # ASN.1 Definition:
//
// ub-integer-options                        INTEGER ::= 256
const Ub_integer_options int = 256

// # ASN.1 Definition:
//
// ub-e163-4-number-length                   INTEGER ::= 15
const Ub_e163_4_number_length int = 15

// # ASN.1 Definition:
//
// ub-e163-4-sub-address-length              INTEGER ::= 40
const Ub_e163_4_sub_address_length int = 40

// # ASN.1 Definition:
//
// ub-unformatted-address-length             INTEGER ::= 180
const Ub_unformatted_address_length int = 180

// # ASN.1 Definition:
//
// ub-pds-parameter-length                   INTEGER ::= 30
const Ub_pds_parameter_length int = 30

// # ASN.1 Definition:
//
// ub-pds-physical-address-lines             INTEGER ::= 6
const Ub_pds_physical_address_lines int = 6

// # ASN.1 Definition:
//
// ub-postal-code-length                     INTEGER ::= 16
const Ub_postal_code_length int = 16

// # ASN.1 Definition:
//
// ub-pds-name-length                        INTEGER ::= 16
const Ub_pds_name_length int = 16

// # ASN.1 Definition:
//
// ub-universal-surname-length               INTEGER ::= 64
const Ub_universal_surname_length int = 64

// # ASN.1 Definition:
//
// ub-universal-given-name-length            INTEGER ::= 40
const Ub_universal_given_name_length int = 40

// # ASN.1 Definition:
//
// ub-universal-initials-length              INTEGER ::= 16
const Ub_universal_initials_length int = 16

// # ASN.1 Definition:
//
// ub-universal-generation-qualifier-length  INTEGER ::= 16
const Ub_universal_generation_qualifier_length int = 16

// # ASN.1 Definition:
//
// ub-common-name-length                     INTEGER ::= 64
const Ub_common_name_length int = 64

// # ASN.1 Definition:
//
// ub-extension-attributes                   INTEGER ::= 256
const Ub_extension_attributes int = 256

// # ASN.1 Definition:
//
// ub-domain-defined-attribute-type-length   INTEGER ::= 8
const Ub_domain_defined_attribute_type_length int = 8

// # ASN.1 Definition:
//
// ub-domain-defined-attribute-value-length  INTEGER ::= 128
const Ub_domain_defined_attribute_value_length int = 128

// # ASN.1 Definition:
//
// ub-domain-defined-attributes              INTEGER ::= 4
const Ub_domain_defined_attributes int = 4

// # ASN.1 Definition:
//
// ub-organizational-unit-name-length        INTEGER ::= 32
const Ub_organizational_unit_name_length int = 32

// # ASN.1 Definition:
//
// ub-organizational-units                   INTEGER ::= 4
const Ub_organizational_units int = 4

// # ASN.1 Definition:
//
// ub-generation-qualifier-length            INTEGER ::= 3
const Ub_generation_qualifier_length int = 3

// # ASN.1 Definition:
//
// ub-initials-length                        INTEGER ::= 5
const Ub_initials_length int = 5

// # ASN.1 Definition:
//
// ub-given-name-length                      INTEGER ::= 16
const Ub_given_name_length int = 16

// # ASN.1 Definition:
//
// ub-surname-length                         INTEGER ::= 40
const Ub_surname_length int = 40

// # ASN.1 Definition:
//
// ub-numeric-user-id-length                 INTEGER ::= 32
const Ub_numeric_user_id_length int = 32

// # ASN.1 Definition:
//
// ub-organization-name-length               INTEGER ::= 64
const Ub_organization_name_length int = 64

// # ASN.1 Definition:
//
// ub-terminal-id-length                     INTEGER ::= 24
const Ub_terminal_id_length int = 24

// # ASN.1 Definition:
//
// ub-x121-address-length                    INTEGER ::= 16
const Ub_x121_address_length int = 16

// # ASN.1 Definition:
//
// ub-domain-name-length                     INTEGER ::= 16
const Ub_domain_name_length int = 16

// # ASN.1 Definition:
//
// ub-country-name-alpha-length              INTEGER ::= 2
const Ub_country_name_alpha_length int = 2

// # ASN.1 Definition:
//
// ub-country-name-numeric-length            INTEGER ::= 3
const Ub_country_name_numeric_length int = 3

// # ASN.1 Definition:
//
// UniversalOrBMPString-character-encoding ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type UniversalOrBMPString_character_encoding = asn1.RawValue

// # ASN.1 Definition:
//
// ExtendedNetworkAddress-e163-4-address ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ExtendedNetworkAddress_e163_4_address struct {
	Number      string `asn1:"explicit,tag:0"`
	Sub_address string `asn1:"optional,explicit,tag:1"`
}
