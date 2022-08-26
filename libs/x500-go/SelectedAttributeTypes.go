package x500_go

import (
	"encoding/asn1"
	"time"
)

/* START_OF_SYMBOL_DEFINITION UnboundedDirectoryString */
// ### ASN.1 Definition:
//
// ```asn1
// UnboundedDirectoryString  ::=  CHOICE {
//   teletexString    TeletexString(SIZE (1..MAX)),
//   printableString  PrintableString(SIZE (1..MAX)),
//   bmpString        BMPString(SIZE (1..MAX)),
//   universalString  UniversalString(SIZE (1..MAX)),
//   uTF8String       UTF8String(SIZE (1..MAX)) }
// ```
type UnboundedDirectoryString = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UnboundedDirectoryString */ /* START_OF_SYMBOL_DEFINITION DirectoryString */
// ### ASN.1 Definition:
//
// ```asn1
// DirectoryString{INTEGER:maxSize}  ::=  CHOICE {
//   teletexString    TeletexString(SIZE (1..maxSize,...)),
//   printableString  PrintableString(SIZE (1..maxSize,...)),
//   bmpString        BMPString(SIZE (1..maxSize,...)),
//   universalString  UniversalString(SIZE (1..maxSize,...)),
//   uTF8String       UTF8String(SIZE (1..maxSize,...)) }
// ```
type DirectoryString = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION DirectoryString */ /* START_OF_SYMBOL_DEFINITION UniqueIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// UniqueIdentifier  ::=  BIT STRING
// ```
type UniqueIdentifier = asn1.BitString

/* END_OF_SYMBOL_DEFINITION UniqueIdentifier */ /* START_OF_SYMBOL_DEFINITION UUIDPair */
// ### ASN.1 Definition:
//
// ```asn1
// UUIDPair ::= SEQUENCE {
//   issuerUUID   UUID,
//   subjectUUID  UUID,
//   ... }
// ```
//
//
type UUIDPair struct {
	IssuerUUID  UUID
	SubjectUUID UUID
}

/* END_OF_SYMBOL_DEFINITION UUIDPair */ /* START_OF_SYMBOL_DEFINITION UUID */
// ### ASN.1 Definition:
//
// ```asn1
// UUID  ::=  OCTET STRING(SIZE (16))
// ```
type UUID = []byte // OctetStringType
/* END_OF_SYMBOL_DEFINITION UUID */ /* START_OF_SYMBOL_DEFINITION URI */
// ### ASN.1 Definition:
//
// ```asn1
// URI  ::=  UTF8String
// ```
type URI = string // UTF8String
/* END_OF_SYMBOL_DEFINITION URI */ /* START_OF_SYMBOL_DEFINITION DomainName */
// ### ASN.1 Definition:
//
// ```asn1
// DomainName  ::=  UTF8String (CONSTRAINED BY { -- Conforms to the format of a domain name. -- })
// ```
type DomainName = string // UTF8String
/* END_OF_SYMBOL_DEFINITION DomainName */ /* START_OF_SYMBOL_DEFINITION IntEmail */
// ### ASN.1 Definition:
//
// ```asn1
// IntEmail  ::=  UTF8String (CONSTRAINED BY { -- Conforms to the format of an (internationalized) email address. -- })
// ```
type IntEmail = string // UTF8String
/* END_OF_SYMBOL_DEFINITION IntEmail */ /* START_OF_SYMBOL_DEFINITION Jid */
// ### ASN.1 Definition:
//
// ```asn1
// Jid  ::=  UTF8String (CONSTRAINED BY { /* Conforms to the format of a jabber identifier. */ })
// ```
type Jid = string // UTF8String
/* END_OF_SYMBOL_DEFINITION Jid */ /* START_OF_SYMBOL_DEFINITION CountryName */
// ### ASN.1 Definition:
//
// ```asn1
// CountryName  ::=  PrintableString(SIZE (2)) (CONSTRAINED BY { -- ISO 3166 alpha-2 codes only -- })
// ```
type CountryName = string // PrintableString
/* END_OF_SYMBOL_DEFINITION CountryName */ /* START_OF_SYMBOL_DEFINITION CountryCode3c */
// ### ASN.1 Definition:
//
// ```asn1
// CountryCode3c  ::=  PrintableString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 alpha-3 codes only -- })
// ```
type CountryCode3c = string // PrintableString
/* END_OF_SYMBOL_DEFINITION CountryCode3c */ /* START_OF_SYMBOL_DEFINITION CountryCode3n */
// ### ASN.1 Definition:
//
// ```asn1
// CountryCode3n  ::=  NumericString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 numeric-3 codes only -- })
// ```
type CountryCode3n = string // NumericString
/* END_OF_SYMBOL_DEFINITION CountryCode3n */ /* START_OF_SYMBOL_DEFINITION UtmCoordinates */
// ### ASN.1 Definition:
//
// ```asn1
// UtmCoordinates ::= SEQUENCE {
//   zone      PrintableString,
//   easting   NumericString,
//   northing  NumericString }
// ```
//
//
type UtmCoordinates struct {
	Zone     string
	Easting  string
	Northing string
}

/* END_OF_SYMBOL_DEFINITION UtmCoordinates */ /* START_OF_SYMBOL_DEFINITION Guide */
// ### ASN.1 Definition:
//
// ```asn1
// Guide ::= SET {
//   objectClass  [0]  OBJECT-CLASS.&id OPTIONAL,
//   criteria     [1]  Criteria,
//   ... }
// ```
//
//
type Guide struct {
	ObjectClass asn1.ObjectIdentifier `asn1:"optional,explicit,tag:0"`
	Criteria    Criteria              `asn1:"explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION Guide */ /* START_OF_SYMBOL_DEFINITION Criteria */
// ### ASN.1 Definition:
//
// ```asn1
// Criteria  ::=  CHOICE {
//   type  [0]  CriteriaItem,
//   and   [1]  SET OF Criteria,
//   or    [2]  SET OF Criteria,
//   not   [3]  Criteria,
//   ... }
// ```
type Criteria = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Criteria */ /* START_OF_SYMBOL_DEFINITION CriteriaItem */
// ### ASN.1 Definition:
//
// ```asn1
// CriteriaItem  ::=  CHOICE {
//   equality          [0]  AttributeType,
//   substrings        [1]  AttributeType,
//   greaterOrEqual    [2]  AttributeType,
//   lessOrEqual       [3]  AttributeType,
//   approximateMatch  [4]  AttributeType,
//   ... }
// ```
type CriteriaItem = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION CriteriaItem */ /* START_OF_SYMBOL_DEFINITION EnhancedGuide */
// ### ASN.1 Definition:
//
// ```asn1
// EnhancedGuide ::= SEQUENCE {
//   objectClass  [0]  OBJECT-CLASS.&id,
//   criteria     [1]  Criteria,
//   subset       [2]  INTEGER {
//     baseObject   (0),
//     oneLevel     (1),
//     wholeSubtree (2)} DEFAULT oneLevel,
//   ... }
// ```
//
//
type EnhancedGuide struct {
	ObjectClass asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	Criteria    Criteria              `asn1:"explicit,tag:1"`
	Subset      EnhancedGuide_subset  `asn1:"optional,explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION EnhancedGuide */ /* START_OF_SYMBOL_DEFINITION PostalAddress */
// ### ASN.1 Definition:
//
// ```asn1
// PostalAddress  ::=  SEQUENCE SIZE (1..MAX) OF UnboundedDirectoryString
// ```
type PostalAddress = [](UnboundedDirectoryString) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION PostalAddress */ /* START_OF_SYMBOL_DEFINITION TelephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// TelephoneNumber  ::=  PrintableString(SIZE (1..ub-telephone-number))
// ```
type TelephoneNumber = string // PrintableString
/* END_OF_SYMBOL_DEFINITION TelephoneNumber */ /* START_OF_SYMBOL_DEFINITION Ub_telephone_number */
// ### ASN.1 Definition:
//
// ```asn1
// ub-telephone-number INTEGER ::= 32
// ```
//
//
// const Ub_telephone_number int = 32
/* END_OF_SYMBOL_DEFINITION Ub_telephone_number */ /* START_OF_SYMBOL_DEFINITION TelexNumber */
// ### ASN.1 Definition:
//
// ```asn1
// TelexNumber ::= SEQUENCE {
//   telexNumber  PrintableString(SIZE (1..ub-telex-number)),
//   countryCode  PrintableString(SIZE (1..ub-country-code)),
//   answerback   PrintableString(SIZE (1..ub-answerback)),
//   ... }
// ```
//
//
type TelexNumber struct {
	TelexNumber string
	CountryCode string
	Answerback  string
}

/* END_OF_SYMBOL_DEFINITION TelexNumber */ /* START_OF_SYMBOL_DEFINITION Ub_telex_number */
// ### ASN.1 Definition:
//
// ```asn1
// ub-telex-number INTEGER ::= 14
// ```
//
//
// const Ub_telex_number int = 14

/* END_OF_SYMBOL_DEFINITION Ub_telex_number */ /* START_OF_SYMBOL_DEFINITION Ub_country_code */
// ### ASN.1 Definition:
//
// ```asn1
// ub-country-code INTEGER ::= 4
// ```
//
//
// const Ub_country_code int = 4

/* END_OF_SYMBOL_DEFINITION Ub_country_code */ /* START_OF_SYMBOL_DEFINITION Ub_answerback */
// ### ASN.1 Definition:
//
// ```asn1
// ub-answerback   INTEGER ::= 8
// ```
//
//
// const Ub_answerback int = 8

/* END_OF_SYMBOL_DEFINITION Ub_answerback */ /* START_OF_SYMBOL_DEFINITION FacsimileTelephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// FacsimileTelephoneNumber ::= SEQUENCE {
//   telephoneNumber  TelephoneNumber,
//   parameters       G3FacsimileNonBasicParameters OPTIONAL,
//   ... }
// ```
//
//
type FacsimileTelephoneNumber struct {
	TelephoneNumber TelephoneNumber
	Parameters      G3FacsimileNonBasicParameters `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION FacsimileTelephoneNumber */ /* START_OF_SYMBOL_DEFINITION X121Address */
// ### ASN.1 Definition:
//
// ```asn1
// X121Address  ::=  NumericString(SIZE (1..ub-x121-address))
// ```
type X121Address = string // NumericString
/* END_OF_SYMBOL_DEFINITION X121Address */ /* START_OF_SYMBOL_DEFINITION Ub_x121_address */
// ### ASN.1 Definition:
//
// ```asn1
// ub-x121-address INTEGER ::= 15
// ```
//
//
// const Ub_x121_address int = 15

/* END_OF_SYMBOL_DEFINITION Ub_x121_address */ /* START_OF_SYMBOL_DEFINITION InternationalISDNNumber */
// ### ASN.1 Definition:
//
// ```asn1
// InternationalISDNNumber  ::=
//   NumericString(SIZE (1..ub-international-isdn-number))
// ```
type InternationalISDNNumber = string // NumericString
/* END_OF_SYMBOL_DEFINITION InternationalISDNNumber */ /* START_OF_SYMBOL_DEFINITION Ub_international_isdn_number */
// ### ASN.1 Definition:
//
// ```asn1
// ub-international-isdn-number INTEGER ::= 16
// ```
//
//
// const Ub_international_isdn_number int = 16

/* END_OF_SYMBOL_DEFINITION Ub_international_isdn_number */ /* START_OF_SYMBOL_DEFINITION DestinationIndicator */
// ### ASN.1 Definition:
//
// ```asn1
// DestinationIndicator  ::=  PrintableString(SIZE (1..MAX))
// ```
type DestinationIndicator = string // PrintableString
/* END_OF_SYMBOL_DEFINITION DestinationIndicator */ /* START_OF_SYMBOL_DEFINITION CommunicationsService */
// ### ASN.1 Definition:
//
// ```asn1
// CommunicationsService  ::=  OBJECT IDENTIFIER
// ```
type CommunicationsService = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION CommunicationsService */ /* START_OF_SYMBOL_DEFINITION CommunicationsNetwork */
// ### ASN.1 Definition:
//
// ```asn1
// CommunicationsNetwork  ::=  OBJECT IDENTIFIER
// ```
type CommunicationsNetwork = asn1.ObjectIdentifier // ObjectIdentifierType
/* END_OF_SYMBOL_DEFINITION CommunicationsNetwork */ /* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod */
// ### ASN.1 Definition:
//
// ```asn1
// PreferredDeliveryMethod  ::=  SEQUENCE OF INTEGER {
//   any-delivery-method   (0),
//   mhs-delivery          (1),
//   physical-delivery     (2),
//   telex-delivery        (3),
//   teletex-delivery      (4),
//   g3-facsimile-delivery (5),
//   g4-facsimile-delivery (6),
//   ia5-terminal-delivery (7),
//   videotex-delivery     (8),
//   telephone-delivery    (9) }
// ```
type PreferredDeliveryMethod = [](PreferredDeliveryMethod_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod */ /* START_OF_SYMBOL_DEFINITION PresentationAddress */
// ### ASN.1 Definition:
//
// ```asn1
// PresentationAddress ::= SEQUENCE {
//   pSelector   [0]  OCTET STRING OPTIONAL,
//   sSelector   [1]  OCTET STRING OPTIONAL,
//   tSelector   [2]  OCTET STRING OPTIONAL,
//   nAddresses  [3]  SET SIZE (1..MAX) OF OCTET STRING,
//   ... }
// ```
//
//
type PresentationAddress struct {
	PSelector  []byte     `asn1:"optional,explicit,tag:0"`
	SSelector  []byte     `asn1:"optional,explicit,tag:1"`
	TSelector  []byte     `asn1:"optional,explicit,tag:2"`
	NAddresses []([]byte) `asn1:"explicit,tag:3,set"`
}

/* END_OF_SYMBOL_DEFINITION PresentationAddress */ /* START_OF_SYMBOL_DEFINITION ProtocolInformation */
// ### ASN.1 Definition:
//
// ```asn1
// ProtocolInformation ::= SEQUENCE {
//   nAddress  OCTET STRING,
//   profiles  SET OF OBJECT IDENTIFIER }
// ```
//
//
type ProtocolInformation struct {
	NAddress []byte
	Profiles [](asn1.ObjectIdentifier) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ProtocolInformation */ /* START_OF_SYMBOL_DEFINITION NameAndOptionalUID */
// ### ASN.1 Definition:
//
// ```asn1
// NameAndOptionalUID ::= SEQUENCE {
//   dn   DistinguishedName,
//   uid  UniqueIdentifier OPTIONAL,
//   ... }
// ```
//
//
type NameAndOptionalUID struct {
	Dn  DistinguishedName
	Uid UniqueIdentifier `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION NameAndOptionalUID */ /* START_OF_SYMBOL_DEFINITION UiiFormat */
// ### ASN.1 Definition:
//
// ```asn1
// UiiFormat ::= SEQUENCE {
//   baseObject  URI  OPTIONAL,
//   subset      ENUMERATED {
//     baseObject   (0),
//     oneLevel     (1),
//     wholeSubtree (2) } DEFAULT baseObject,
//   next        CHOICE {
//     length      INTEGER,
//     filter      UiiFilter } }
// ```
//
//
type UiiFormat struct {
	BaseObject URI              `asn1:"optional"`
	Subset     UiiFormat_subset `asn1:"optional"`
	Next       UiiFormat_next
}

/* END_OF_SYMBOL_DEFINITION UiiFormat */ /* START_OF_SYMBOL_DEFINITION UiiFilter */
// ### ASN.1 Definition:
//
// ```asn1
// UiiFilter  ::=  CHOICE {
//   item  [0]  UiiItem,
//   and   [1]  SET OF UiiFilter,
//   or    [2]  SET OF UiiFilter,
//   not   [3]  UiiFilter }
// ```
type UiiFilter = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UiiFilter */ /* START_OF_SYMBOL_DEFINITION UiiItem */
// ### ASN.1 Definition:
//
// ```asn1
// UiiItem ::= SEQUENCE {
//   type   ATTRIBUTE.&id,
//   length INTEGER OPTIONAL }
// ```
//
//
type UiiItem struct {
	Type   asn1.ObjectIdentifier
	Length int `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION UiiItem */ /* START_OF_SYMBOL_DEFINITION EpcFormat */
// ### ASN.1 Definition:
//
// ```asn1
// EpcFormat ::= SEQUENCE {
//   fields          SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//     bits            INTEGER,
//     charField       CHOICE {
//       characters  [0] INTEGER,
//       maxValue    [1] INTEGER },
//     result          ENUMERATED {
//       numericPad     (0),
//       numeric        (1),
//       alpha7bits     (2) } DEFAULT numericPad },
//   digitShift  [0] INTEGER                        OPTIONAL,
//   checkCalc   [1] INTEGER                        OPTIONAL,
//   urnPrefix       UTF8String                     OPTIONAL }
// ```
//
//
type EpcFormat struct {
	Fields     [](EpcFormat_fields_Item)
	DigitShift int    `asn1:"optional,explicit,tag:0"`
	CheckCalc  int    `asn1:"optional,explicit,tag:1"`
	UrnPrefix  string `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION EpcFormat */ /* START_OF_SYMBOL_DEFINITION MultipleMatchingLocalities */
// ### ASN.1 Definition:
//
// ```asn1
// MultipleMatchingLocalities ::= SEQUENCE {
//   matchingRuleUsed  MATCHING-RULE.&id OPTIONAL,
//   attributeList     SEQUENCE OF AttributeValueAssertion,
//   ... }
// ```
//
//
type MultipleMatchingLocalities struct {
	MatchingRuleUsed asn1.ObjectIdentifier `asn1:"optional"`
	AttributeList    [](AttributeValueAssertion)
}

/* END_OF_SYMBOL_DEFINITION MultipleMatchingLocalities */ /* START_OF_SYMBOL_DEFINITION MRMappings */
// ### ASN.1 Definition:
//
// ```asn1
// MRMappings  ::=  SEQUENCE OF MRMapping
// ```
type MRMappings = [](MRMapping) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION MRMappings */ /* START_OF_SYMBOL_DEFINITION PwdResponse */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponse ::= SEQUENCE {
//   warning CHOICE {
//     timeleft        [0] INTEGER(0..MAX),
//     graceRemaining  [1] INTEGER(0..MAX),
//     ... } OPTIONAL,
//   error ENUMERATED {
//     passwordExpired  (0),
//     changeAfterReset (1),
//     ... } OPTIONAL}
// ```
//
//
type PwdResponse struct {
	Warning PwdResponse_warning `asn1:"optional"`
	Error   PwdResponse_error   `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION PwdResponse */ /* START_OF_SYMBOL_DEFINITION SubstringAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// SubstringAssertion  ::=  SEQUENCE OF CHOICE {
//   initial  [0]  UnboundedDirectoryString,
//   any      [1]  UnboundedDirectoryString,
//   final    [2]  UnboundedDirectoryString,
//     -- at most one initial and one final component
//   control       Attribute{{SupportedAttributes}},
//     -- Used to specify interpretation of the following items
//   ... }
// ```
type SubstringAssertion = [](SubstringAssertion_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION SubstringAssertion */ /* START_OF_SYMBOL_DEFINITION CaseIgnoreList */
// ### ASN.1 Definition:
//
// ```asn1
// CaseIgnoreList  ::=  SEQUENCE OF UnboundedDirectoryString
// ```
type CaseIgnoreList = [](UnboundedDirectoryString) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION CaseIgnoreList */ /* START_OF_SYMBOL_DEFINITION OctetSubstringAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// OctetSubstringAssertion  ::=  SEQUENCE OF CHOICE {
//   initial  [0]  OCTET STRING,
//   any      [1]  OCTET STRING,
//   final    [2]  OCTET STRING,
//   ... }
// ```
type OctetSubstringAssertion = [](OctetSubstringAssertion_Item) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION OctetSubstringAssertion */ /* START_OF_SYMBOL_DEFINITION SequenceMatchType */
// ### ASN.1 Definition:
//
// ```asn1
// SequenceMatchType  ::=  ENUMERATED {
//   sequenceExact                  (0),
//   sequenceDeletion               (1),
//   sequenceRestrictedDeletion     (2),
//   sequencePermutation            (3),
//   sequencePermutationAndDeletion (4),
//   sequenceProviderDefined        (5),
//   ... }
// ```
type SequenceMatchType = int

const (
	SequenceMatchType_SequenceExact                  SequenceMatchType = 0 // LONG_NAMED_ENUMERATED_VALUE,
	SequenceMatchType_SequenceDeletion               SequenceMatchType = 1 // LONG_NAMED_ENUMERATED_VALUE,
	SequenceMatchType_SequenceRestrictedDeletion     SequenceMatchType = 2 // LONG_NAMED_ENUMERATED_VALUE,
	SequenceMatchType_SequencePermutation            SequenceMatchType = 3 // LONG_NAMED_ENUMERATED_VALUE,
	SequenceMatchType_SequencePermutationAndDeletion SequenceMatchType = 4 // LONG_NAMED_ENUMERATED_VALUE,
	SequenceMatchType_SequenceProviderDefined        SequenceMatchType = 5 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION SequenceMatchType */ /* START_OF_SYMBOL_DEFINITION WordMatchTypes */
// ### ASN.1 Definition:
//
// ```asn1
// WordMatchTypes  ::=  ENUMERATED {
//   wordExact           (0),
//   wordTruncated       (1),
//   wordPhonetic        (2),
//   wordProviderDefined (3),
//   ... }
// ```
type WordMatchTypes = int

const (
	WordMatchTypes_WordExact           WordMatchTypes = 0 // LONG_NAMED_ENUMERATED_VALUE,
	WordMatchTypes_WordTruncated       WordMatchTypes = 1 // LONG_NAMED_ENUMERATED_VALUE,
	WordMatchTypes_WordPhonetic        WordMatchTypes = 2 // LONG_NAMED_ENUMERATED_VALUE,
	WordMatchTypes_WordProviderDefined WordMatchTypes = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION WordMatchTypes */ /* START_OF_SYMBOL_DEFINITION CharacterMatchTypes */
// ### ASN.1 Definition:
//
// ```asn1
// CharacterMatchTypes  ::=  ENUMERATED {
//   characterExact      (0),
//   characterCaseIgnore (1),
//   characterMapped     (2),
//   ... }
// ```
type CharacterMatchTypes = int

const (
	CharacterMatchTypes_CharacterExact      CharacterMatchTypes = 0 // LONG_NAMED_ENUMERATED_VALUE,
	CharacterMatchTypes_CharacterCaseIgnore CharacterMatchTypes = 1 // LONG_NAMED_ENUMERATED_VALUE,
	CharacterMatchTypes_CharacterMapped     CharacterMatchTypes = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION CharacterMatchTypes */ /* START_OF_SYMBOL_DEFINITION ZonalSelect */
// ### ASN.1 Definition:
//
// ```asn1
// ZonalSelect  ::=  SEQUENCE OF AttributeType
// ```
type ZonalSelect = [](AttributeType) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION ZonalSelect */ /* START_OF_SYMBOL_DEFINITION ZonalResult */
// ### ASN.1 Definition:
//
// ```asn1
// ZonalResult  ::=  ENUMERATED {
//   cannot-select-mapping (0),
//   zero-mappings         (2),
//   multiple-mappings     (3),
//    ... }
// ```
type ZonalResult = int

const (
	ZonalResult_Cannot_select_mapping ZonalResult = 0 // LONG_NAMED_ENUMERATED_VALUE,
	ZonalResult_Zero_mappings         ZonalResult = 2 // LONG_NAMED_ENUMERATED_VALUE,
	ZonalResult_Multiple_mappings     ZonalResult = 3 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION ZonalResult */ /* START_OF_SYMBOL_DEFINITION LanguageContextSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// LanguageContextSyntax  ::=  PrintableString(SIZE (2..3))
// ```
type LanguageContextSyntax = string // PrintableString
/* END_OF_SYMBOL_DEFINITION LanguageContextSyntax */ /* START_OF_SYMBOL_DEFINITION TimeSpecification */
// ### ASN.1 Definition:
//
// ```asn1
// TimeSpecification ::= SEQUENCE {
//   time           CHOICE {
//     absolute       SEQUENCE {
//       startTime [0]  GeneralizedTime OPTIONAL,
//       endTime   [1]  GeneralizedTime OPTIONAL,
//       ... },
//     periodic      SET SIZE (1..MAX) OF Period},
//   notThisTime   BOOLEAN DEFAULT FALSE,
//   timeZone      TimeZone OPTIONAL,
//   ... }
// ```
//
//
type TimeSpecification struct {
	Time        TimeSpecification_time
	NotThisTime bool     `asn1:"optional"`
	TimeZone    TimeZone `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TimeSpecification */ /* START_OF_SYMBOL_DEFINITION Period */
// ### ASN.1 Definition:
//
// ```asn1
// Period ::= SEQUENCE {
//   timesOfDay  [0]  SET SIZE (1..MAX) OF DayTimeBand OPTIONAL,
//   days        [1]  CHOICE {
//     intDay           SET OF INTEGER,
//     bitDay           BIT STRING {
//       sunday    (0),
//       monday    (1),
//       tuesday   (2),
//       wednesday (3),
//       thursday  (4),
//       friday    (5),
//       saturday  (6)},
//     dayOf            XDayOf,
//     ...} OPTIONAL,
//   weeks       [2]  CHOICE {
//     allWeeks         NULL,
//     intWeek          SET OF INTEGER,
//     bitWeek          BIT STRING {
//       week1     (0),
//       week2     (1),
//       week3     (2),
//       week4     (3),
//       week5     (4)},
//     ... } OPTIONAL,
//   months      [3]  CHOICE {
//     allMonths        NULL,
//     intMonth         SET OF INTEGER,
//     bitMonth         BIT STRING {
//       january   (0),
//       february  (1),
//       march     (2),
//       april     (3),
//       may       (4),
//       june      (5),
//       july      (6),
//       august    (7),
//       september (8),
//       october   (9),
//       november  (10),
//       december  (11)},
//     ...} OPTIONAL,
//   years       [4]  SET OF INTEGER(1000..MAX) OPTIONAL,
//   ... }
// ```
//
//
type Period struct {
	TimesOfDay [](DayTimeBand) `asn1:"optional,explicit,tag:0,set"`
	Days       Period_days     `asn1:"optional,explicit,tag:1"`
	Weeks      Period_weeks    `asn1:"optional,explicit,tag:2"`
	Months     Period_months   `asn1:"optional,explicit,tag:3"`
	Years      [](int)         `asn1:"optional,explicit,tag:4,set"`
}

/* END_OF_SYMBOL_DEFINITION Period */ /* START_OF_SYMBOL_DEFINITION XDayOf */
// ### ASN.1 Definition:
//
// ```asn1
// XDayOf  ::=  CHOICE {
//   first   [1]  NamedDay,
//   second  [2]  NamedDay,
//   third   [3]  NamedDay,
//   fourth  [4]  NamedDay,
//   fifth   [5]  NamedDay }
// ```
type XDayOf = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION XDayOf */ /* START_OF_SYMBOL_DEFINITION NamedDay */
// ### ASN.1 Definition:
//
// ```asn1
// NamedDay  ::=  CHOICE {
//   intNamedDays ENUMERATED {
//     sunday      (1),
//     monday      (2),
//     tuesday     (3),
//     wednesday   (4),
//     thursday    (5),
//     friday      (6),
//     saturday    (7)},
//   bitNamedDays BIT STRING {
//     sunday      (0),
//     monday      (1),
//     tuesday     (2),
//     wednesday   (3),
//     thursday    (4),
//     friday      (5),
//     saturday    (6)} }
// ```
type NamedDay = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION NamedDay */ /* START_OF_SYMBOL_DEFINITION DayTimeBand */
// ### ASN.1 Definition:
//
// ```asn1
// DayTimeBand ::= SEQUENCE {
//   startDayTime  [0]  DayTime DEFAULT {hour 0},
//   endDayTime    [1]  DayTime DEFAULT {hour 23, minute 59, second 59},
//   ... }
// ```
//
//
type DayTimeBand struct {
	StartDayTime DayTime `asn1:"optional,explicit,tag:0"`
	EndDayTime   DayTime `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION DayTimeBand */ /* START_OF_SYMBOL_DEFINITION DayTime */
// ### ASN.1 Definition:
//
// ```asn1
// DayTime ::= SEQUENCE {
//   hour    [0]  INTEGER(0..23),
//   minute  [1]  INTEGER(0..59) DEFAULT 0,
//   second  [2]  INTEGER(0..59) DEFAULT 0,
//   ... }
// ```
//
//
type DayTime struct {
	Hour   int `asn1:"explicit,tag:0"`
	Minute int `asn1:"optional,explicit,tag:1,default:0"`
	Second int `asn1:"optional,explicit,tag:2,default:0"`
}

/* END_OF_SYMBOL_DEFINITION DayTime */ /* START_OF_SYMBOL_DEFINITION TimeZone */
// ### ASN.1 Definition:
//
// ```asn1
// TimeZone  ::=  INTEGER(-12..12)
// ```
type TimeZone = int64

/* END_OF_SYMBOL_DEFINITION TimeZone */ /* START_OF_SYMBOL_DEFINITION TimeAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// TimeAssertion  ::=  CHOICE {
//   now             NULL,
//   at              GeneralizedTime,
//   between         SEQUENCE {
//     startTime  [0]  GeneralizedTime,
//     endTime    [1]  GeneralizedTime OPTIONAL,
//     entirely        BOOLEAN DEFAULT FALSE,
//     ...},
//   ... }
// ```
type TimeAssertion = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TimeAssertion */ /* START_OF_SYMBOL_DEFINITION LocaleContextSyntax */
// ### ASN.1 Definition:
//
// ```asn1
// LocaleContextSyntax  ::=  CHOICE {
//   localeID1  OBJECT IDENTIFIER,
//   localeID2  UnboundedDirectoryString,
//   ... }
// ```
type LocaleContextSyntax = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION LocaleContextSyntax */ /* START_OF_SYMBOL_DEFINITION AttributeOptionList */
// ### ASN.1 Definition:
//
// ```asn1
// AttributeOptionList  ::=  SEQUENCE OF UTF8String
// ```
type AttributeOptionList = [](string) // SequenceOfType
/* END_OF_SYMBOL_DEFINITION AttributeOptionList */ /* START_OF_SYMBOL_DEFINITION Id_at_knowledgeInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-knowledgeInformation                OBJECT IDENTIFIER ::= {id-at 2}
// ```
//
//
var Id_at_knowledgeInformation asn1.ObjectIdentifier = []int{2, 5, 4, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_knowledgeInformation */ /* START_OF_SYMBOL_DEFINITION Id_at_commonName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-commonName                          OBJECT IDENTIFIER ::= {id-at 3}
// ```
//
//
var Id_at_commonName asn1.ObjectIdentifier = []int{2, 5, 4, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_commonName */ /* START_OF_SYMBOL_DEFINITION Id_at_surname */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-surname                             OBJECT IDENTIFIER ::= {id-at 4}
// ```
//
//
var Id_at_surname asn1.ObjectIdentifier = []int{2, 5, 4, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_surname */ /* START_OF_SYMBOL_DEFINITION Id_at_serialNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-serialNumber                        OBJECT IDENTIFIER ::= {id-at 5}
// ```
//
//
var Id_at_serialNumber asn1.ObjectIdentifier = []int{2, 5, 4, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_serialNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_countryName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-countryName                         OBJECT IDENTIFIER ::= {id-at 6}
// ```
//
//
var Id_at_countryName asn1.ObjectIdentifier = []int{2, 5, 4, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_countryName */ /* START_OF_SYMBOL_DEFINITION Id_at_localityName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-localityName                        OBJECT IDENTIFIER ::= {id-at 7}
// ```
//
//
var Id_at_localityName asn1.ObjectIdentifier = []int{2, 5, 4, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_localityName */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveLocalityName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveLocalityName              OBJECT IDENTIFIER ::= {id-at 7 1}
// ```
//
//
var Id_at_collectiveLocalityName asn1.ObjectIdentifier = []int{2, 5, 4, 7, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveLocalityName */ /* START_OF_SYMBOL_DEFINITION Id_at_stateOrProvinceName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-stateOrProvinceName                 OBJECT IDENTIFIER ::= {id-at 8}
// ```
//
//
var Id_at_stateOrProvinceName asn1.ObjectIdentifier = []int{2, 5, 4, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_stateOrProvinceName */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveStateOrProvinceName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveStateOrProvinceName       OBJECT IDENTIFIER ::= {id-at 8 1}
// ```
//
//
var Id_at_collectiveStateOrProvinceName asn1.ObjectIdentifier = []int{2, 5, 4, 8, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveStateOrProvinceName */ /* START_OF_SYMBOL_DEFINITION Id_at_streetAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-streetAddress                       OBJECT IDENTIFIER ::= {id-at 9}
// ```
//
//
var Id_at_streetAddress asn1.ObjectIdentifier = []int{2, 5, 4, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_streetAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveStreetAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveStreetAddress             OBJECT IDENTIFIER ::= {id-at 9 1}
// ```
//
//
var Id_at_collectiveStreetAddress asn1.ObjectIdentifier = []int{2, 5, 4, 9, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveStreetAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_organizationName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-organizationName                    OBJECT IDENTIFIER ::= {id-at 10}
// ```
//
//
var Id_at_organizationName asn1.ObjectIdentifier = []int{2, 5, 4, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_organizationName */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveOrganizationName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveOrganizationName          OBJECT IDENTIFIER ::= {id-at 10 1}
// ```
//
//
var Id_at_collectiveOrganizationName asn1.ObjectIdentifier = []int{2, 5, 4, 10, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveOrganizationName */ /* START_OF_SYMBOL_DEFINITION Id_at_organizationalUnitName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-organizationalUnitName              OBJECT IDENTIFIER ::= {id-at 11}
// ```
//
//
var Id_at_organizationalUnitName asn1.ObjectIdentifier = []int{2, 5, 4, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_organizationalUnitName */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveOrganizationalUnitName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveOrganizationalUnitName    OBJECT IDENTIFIER ::= {id-at 11 1}
// ```
//
//
var Id_at_collectiveOrganizationalUnitName asn1.ObjectIdentifier = []int{2, 5, 4, 11, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveOrganizationalUnitName */ /* START_OF_SYMBOL_DEFINITION Id_at_title */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-title                               OBJECT IDENTIFIER ::= {id-at 12}
// ```
//
//
var Id_at_title asn1.ObjectIdentifier = []int{2, 5, 4, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_title */ /* START_OF_SYMBOL_DEFINITION Id_at_description */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-description                         OBJECT IDENTIFIER ::= {id-at 13}
// ```
//
//
var Id_at_description asn1.ObjectIdentifier = []int{2, 5, 4, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_description */ /* START_OF_SYMBOL_DEFINITION Id_at_searchGuide */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-searchGuide                         OBJECT IDENTIFIER ::= {id-at 14}
// ```
//
//
var Id_at_searchGuide asn1.ObjectIdentifier = []int{2, 5, 4, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_searchGuide */ /* START_OF_SYMBOL_DEFINITION Id_at_businessCategory */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-businessCategory                    OBJECT IDENTIFIER ::= {id-at 15}
// ```
//
//
var Id_at_businessCategory asn1.ObjectIdentifier = []int{2, 5, 4, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_businessCategory */ /* START_OF_SYMBOL_DEFINITION Id_at_postalAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-postalAddress                       OBJECT IDENTIFIER ::= {id-at 16}
// ```
//
//
var Id_at_postalAddress asn1.ObjectIdentifier = []int{2, 5, 4, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_postalAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_collectivePostalAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectivePostalAddress             OBJECT IDENTIFIER ::= {id-at 16 1}
// ```
//
//
var Id_at_collectivePostalAddress asn1.ObjectIdentifier = []int{2, 5, 4, 16, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectivePostalAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_postalCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-postalCode                          OBJECT IDENTIFIER ::= {id-at 17}
// ```
//
//
var Id_at_postalCode asn1.ObjectIdentifier = []int{2, 5, 4, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_postalCode */ /* START_OF_SYMBOL_DEFINITION Id_at_collectivePostalCode */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectivePostalCode                OBJECT IDENTIFIER ::= {id-at 17 1}
// ```
//
//
var Id_at_collectivePostalCode asn1.ObjectIdentifier = []int{2, 5, 4, 17, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectivePostalCode */ /* START_OF_SYMBOL_DEFINITION Id_at_postOfficeBox */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-postOfficeBox                       OBJECT IDENTIFIER ::= {id-at 18}
// ```
//
//
var Id_at_postOfficeBox asn1.ObjectIdentifier = []int{2, 5, 4, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_postOfficeBox */ /* START_OF_SYMBOL_DEFINITION Id_at_collectivePostOfficeBox */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectivePostOfficeBox             OBJECT IDENTIFIER ::= {id-at 18 1}
// ```
//
//
var Id_at_collectivePostOfficeBox asn1.ObjectIdentifier = []int{2, 5, 4, 18, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectivePostOfficeBox */ /* START_OF_SYMBOL_DEFINITION Id_at_physicalDeliveryOfficeName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-physicalDeliveryOfficeName          OBJECT IDENTIFIER ::= {id-at 19}
// ```
//
//
var Id_at_physicalDeliveryOfficeName asn1.ObjectIdentifier = []int{2, 5, 4, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_physicalDeliveryOfficeName */ /* START_OF_SYMBOL_DEFINITION Id_at_collectivePhysicalDeliveryOfficeName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectivePhysicalDeliveryOfficeName
//                                           OBJECT IDENTIFIER ::= {id-at 19 1}
// ```
//
//
var Id_at_collectivePhysicalDeliveryOfficeName asn1.ObjectIdentifier = []int{2, 5, 4, 19, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectivePhysicalDeliveryOfficeName */ /* START_OF_SYMBOL_DEFINITION Id_at_telephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-telephoneNumber                     OBJECT IDENTIFIER ::= {id-at 20}
// ```
//
//
var Id_at_telephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_telephoneNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveTelephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveTelephoneNumber           OBJECT IDENTIFIER ::= {id-at 20 1}
// ```
//
//
var Id_at_collectiveTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 20, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveTelephoneNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_telexNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-telexNumber                         OBJECT IDENTIFIER ::= {id-at 21}
// ```
//
//
var Id_at_telexNumber asn1.ObjectIdentifier = []int{2, 5, 4, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_telexNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveTelexNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveTelexNumber               OBJECT IDENTIFIER ::= {id-at 21 1}
// ```
//
//
var Id_at_collectiveTelexNumber asn1.ObjectIdentifier = []int{2, 5, 4, 21, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveTelexNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_facsimileTelephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-facsimileTelephoneNumber            OBJECT IDENTIFIER ::= {id-at 23}
// ```
//
//
var Id_at_facsimileTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_facsimileTelephoneNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveFacsimileTelephoneNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveFacsimileTelephoneNumber  OBJECT IDENTIFIER ::= {id-at 23 1}
// ```
//
//
var Id_at_collectiveFacsimileTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 23, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveFacsimileTelephoneNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_x121Address */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-x121Address                         OBJECT IDENTIFIER ::= {id-at 24}
// ```
//
//
var Id_at_x121Address asn1.ObjectIdentifier = []int{2, 5, 4, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_x121Address */ /* START_OF_SYMBOL_DEFINITION Id_at_internationalISDNNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-internationalISDNNumber             OBJECT IDENTIFIER ::= {id-at 25}
// ```
//
//
var Id_at_internationalISDNNumber asn1.ObjectIdentifier = []int{2, 5, 4, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_internationalISDNNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_collectiveInternationalISDNNumber */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-collectiveInternationalISDNNumber   OBJECT IDENTIFIER ::= {id-at 25 1}
// ```
//
//
var Id_at_collectiveInternationalISDNNumber asn1.ObjectIdentifier = []int{2, 5, 4, 25, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_collectiveInternationalISDNNumber */ /* START_OF_SYMBOL_DEFINITION Id_at_registeredAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-registeredAddress                   OBJECT IDENTIFIER ::= {id-at 26}
// ```
//
//
var Id_at_registeredAddress asn1.ObjectIdentifier = []int{2, 5, 4, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_registeredAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_destinationIndicator */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-destinationIndicator                OBJECT IDENTIFIER ::= {id-at 27}
// ```
//
//
var Id_at_destinationIndicator asn1.ObjectIdentifier = []int{2, 5, 4, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_destinationIndicator */ /* START_OF_SYMBOL_DEFINITION Id_at_preferredDeliveryMethod */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-preferredDeliveryMethod             OBJECT IDENTIFIER ::= {id-at 28}
// ```
//
//
var Id_at_preferredDeliveryMethod asn1.ObjectIdentifier = []int{2, 5, 4, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_preferredDeliveryMethod */ /* START_OF_SYMBOL_DEFINITION Id_at_presentationAddress */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-presentationAddress                 OBJECT IDENTIFIER ::= {id-at 29}
// ```
//
//
var Id_at_presentationAddress asn1.ObjectIdentifier = []int{2, 5, 4, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_presentationAddress */ /* START_OF_SYMBOL_DEFINITION Id_at_supportedApplicationContext */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-supportedApplicationContext         OBJECT IDENTIFIER ::= {id-at 30}
// ```
//
//
var Id_at_supportedApplicationContext asn1.ObjectIdentifier = []int{2, 5, 4, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_supportedApplicationContext */ /* START_OF_SYMBOL_DEFINITION Id_at_member */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-member                              OBJECT IDENTIFIER ::= {id-at 31}
// ```
//
//
var Id_at_member asn1.ObjectIdentifier = []int{2, 5, 4, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_member */ /* START_OF_SYMBOL_DEFINITION Id_at_owner */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-owner                               OBJECT IDENTIFIER ::= {id-at 32}
// ```
//
//
var Id_at_owner asn1.ObjectIdentifier = []int{2, 5, 4, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_owner */ /* START_OF_SYMBOL_DEFINITION Id_at_roleOccupant */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-roleOccupant                        OBJECT IDENTIFIER ::= {id-at 33}
// ```
//
//
var Id_at_roleOccupant asn1.ObjectIdentifier = []int{2, 5, 4, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_roleOccupant */ /* START_OF_SYMBOL_DEFINITION Id_at_seeAlso */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-seeAlso                             OBJECT IDENTIFIER ::= {id-at 34}
// ```
//
//
var Id_at_seeAlso asn1.ObjectIdentifier = []int{2, 5, 4, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_seeAlso */ /* START_OF_SYMBOL_DEFINITION Id_at_name */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-name                                OBJECT IDENTIFIER ::= {id-at 41}
// ```
//
//
var Id_at_name asn1.ObjectIdentifier = []int{2, 5, 4, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_name */ /* START_OF_SYMBOL_DEFINITION Id_at_givenName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-givenName                           OBJECT IDENTIFIER ::= {id-at 42}
// ```
//
//
var Id_at_givenName asn1.ObjectIdentifier = []int{2, 5, 4, 42} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_givenName */ /* START_OF_SYMBOL_DEFINITION Id_at_initials */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-initials                            OBJECT IDENTIFIER ::= {id-at 43}
// ```
//
//
var Id_at_initials asn1.ObjectIdentifier = []int{2, 5, 4, 43} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_initials */ /* START_OF_SYMBOL_DEFINITION Id_at_generationQualifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-generationQualifier                 OBJECT IDENTIFIER ::= {id-at 44}
// ```
//
//
var Id_at_generationQualifier asn1.ObjectIdentifier = []int{2, 5, 4, 44} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_generationQualifier */ /* START_OF_SYMBOL_DEFINITION Id_at_uniqueIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uniqueIdentifier                    OBJECT IDENTIFIER ::= {id-at 45}
// ```
//
//
var Id_at_uniqueIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uniqueIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_at_dnQualifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-dnQualifier                         OBJECT IDENTIFIER ::= {id-at 46}
// ```
//
//
var Id_at_dnQualifier asn1.ObjectIdentifier = []int{2, 5, 4, 46} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_dnQualifier */ /* START_OF_SYMBOL_DEFINITION Id_at_enhancedSearchGuide */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-enhancedSearchGuide                 OBJECT IDENTIFIER ::= {id-at 47}
// ```
//
//
var Id_at_enhancedSearchGuide asn1.ObjectIdentifier = []int{2, 5, 4, 47} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_enhancedSearchGuide */ /* START_OF_SYMBOL_DEFINITION Id_at_protocolInformation */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-protocolInformation                 OBJECT IDENTIFIER ::= {id-at 48}
// ```
//
//
var Id_at_protocolInformation asn1.ObjectIdentifier = []int{2, 5, 4, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_protocolInformation */ /* START_OF_SYMBOL_DEFINITION Id_at_distinguishedName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-distinguishedName                   OBJECT IDENTIFIER ::= {id-at 49}
// ```
//
//
var Id_at_distinguishedName asn1.ObjectIdentifier = []int{2, 5, 4, 49} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_distinguishedName */ /* START_OF_SYMBOL_DEFINITION Id_at_uniqueMember */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uniqueMember                        OBJECT IDENTIFIER ::= {id-at 50}
// ```
//
//
var Id_at_uniqueMember asn1.ObjectIdentifier = []int{2, 5, 4, 50} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uniqueMember */ /* START_OF_SYMBOL_DEFINITION Id_at_houseIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-houseIdentifier                     OBJECT IDENTIFIER ::= {id-at 51}
// ```
//
//
var Id_at_houseIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 51} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_houseIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_at_dmdName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-dmdName                             OBJECT IDENTIFIER ::= {id-at 54}
// ```
//
//
var Id_at_dmdName asn1.ObjectIdentifier = []int{2, 5, 4, 54} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_dmdName */ /* START_OF_SYMBOL_DEFINITION Id_at_pseudonym */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-pseudonym                           OBJECT IDENTIFIER ::= {id-at 65}
// ```
//
//
var Id_at_pseudonym asn1.ObjectIdentifier = []int{2, 5, 4, 65} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_pseudonym */ /* START_OF_SYMBOL_DEFINITION Id_at_communicationsService */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-communicationsService               OBJECT IDENTIFIER ::= {id-at 66}
// ```
//
//
var Id_at_communicationsService asn1.ObjectIdentifier = []int{2, 5, 4, 66} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_communicationsService */ /* START_OF_SYMBOL_DEFINITION Id_at_communicationsNetwork */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-communicationsNetwork               OBJECT IDENTIFIER ::= {id-at 67}
// ```
//
//
var Id_at_communicationsNetwork asn1.ObjectIdentifier = []int{2, 5, 4, 67} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_communicationsNetwork */ /* START_OF_SYMBOL_DEFINITION Id_at_uuidpair */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uuidpair                            OBJECT IDENTIFIER ::= {id-at 77}
// ```
//
//
var Id_at_uuidpair asn1.ObjectIdentifier = []int{2, 5, 4, 77} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uuidpair */ /* START_OF_SYMBOL_DEFINITION Id_at_tagOid */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-tagOid                              OBJECT IDENTIFIER ::= {id-at 78}
// ```
//
//
var Id_at_tagOid asn1.ObjectIdentifier = []int{2, 5, 4, 78} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_tagOid */ /* START_OF_SYMBOL_DEFINITION Id_at_uiiFormat */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uiiFormat                           OBJECT IDENTIFIER ::= {id-at 79}
// ```
//
//
var Id_at_uiiFormat asn1.ObjectIdentifier = []int{2, 5, 4, 79} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uiiFormat */ /* START_OF_SYMBOL_DEFINITION Id_at_uiiInUrn */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uiiInUrn                            OBJECT IDENTIFIER ::= {id-at 80}
// ```
//
//
var Id_at_uiiInUrn asn1.ObjectIdentifier = []int{2, 5, 4, 80} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uiiInUrn */ /* START_OF_SYMBOL_DEFINITION Id_at_contentUrl */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-contentUrl                          OBJECT IDENTIFIER ::= {id-at 81}
// ```
//
//
var Id_at_contentUrl asn1.ObjectIdentifier = []int{2, 5, 4, 81} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_contentUrl */ /* START_OF_SYMBOL_DEFINITION Id_at_uri */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uri                                 OBJECT IDENTIFIER ::= {id-at 83}
// ```
//
//
var Id_at_uri asn1.ObjectIdentifier = []int{2, 5, 4, 83} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uri */ /* START_OF_SYMBOL_DEFINITION Id_at_urn */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-urn                                 OBJECT IDENTIFIER ::= {id-at 86}
// ```
//
//
var Id_at_urn asn1.ObjectIdentifier = []int{2, 5, 4, 86} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_urn */ /* START_OF_SYMBOL_DEFINITION Id_at_url */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-url                                 OBJECT IDENTIFIER ::= {id-at 87}
// ```
//
//
var Id_at_url asn1.ObjectIdentifier = []int{2, 5, 4, 87} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_url */ /* START_OF_SYMBOL_DEFINITION Id_at_utmCoordinates */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-utmCoordinates                      OBJECT IDENTIFIER ::= {id-at 88}
// ```
//
//
var Id_at_utmCoordinates asn1.ObjectIdentifier = []int{2, 5, 4, 88} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_utmCoordinates */ /* START_OF_SYMBOL_DEFINITION Id_at_urnC */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-urnC                                OBJECT IDENTIFIER ::= {id-at 89}
// ```
//
//
var Id_at_urnC asn1.ObjectIdentifier = []int{2, 5, 4, 89} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_urnC */ /* START_OF_SYMBOL_DEFINITION Id_at_uii */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-uii                                 OBJECT IDENTIFIER ::= {id-at 90}
// ```
//
//
var Id_at_uii asn1.ObjectIdentifier = []int{2, 5, 4, 90} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_uii */ /* START_OF_SYMBOL_DEFINITION Id_at_epc */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-epc                                 OBJECT IDENTIFIER ::= {id-at 91}
// ```
//
//
var Id_at_epc asn1.ObjectIdentifier = []int{2, 5, 4, 91} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_epc */ /* START_OF_SYMBOL_DEFINITION Id_at_tagAfi */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-tagAfi                              OBJECT IDENTIFIER ::= {id-at 92}
// ```
//
//
var Id_at_tagAfi asn1.ObjectIdentifier = []int{2, 5, 4, 92} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_tagAfi */ /* START_OF_SYMBOL_DEFINITION Id_at_epcFormat */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-epcFormat                           OBJECT IDENTIFIER ::= {id-at 93}
// ```
//
//
var Id_at_epcFormat asn1.ObjectIdentifier = []int{2, 5, 4, 93} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_epcFormat */ /* START_OF_SYMBOL_DEFINITION Id_at_epcInUrn */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-epcInUrn                            OBJECT IDENTIFIER ::= {id-at 94}
// ```
//
//
var Id_at_epcInUrn asn1.ObjectIdentifier = []int{2, 5, 4, 94} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_epcInUrn */ /* START_OF_SYMBOL_DEFINITION Id_at_ldapUrl */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-ldapUrl                             OBJECT IDENTIFIER ::= {id-at 95}
// ```
//
//
var Id_at_ldapUrl asn1.ObjectIdentifier = []int{2, 5, 4, 95} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_ldapUrl */ /* START_OF_SYMBOL_DEFINITION Id_at_tagLocation */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-tagLocation                         OBJECT IDENTIFIER ::= {id-at 96}
// ```
//
//
var Id_at_tagLocation asn1.ObjectIdentifier = []int{2, 5, 4, 96} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_tagLocation */ /* START_OF_SYMBOL_DEFINITION Id_at_organizationIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-organizationIdentifier              OBJECT IDENTIFIER ::= {id-at 97}
// ```
//
//
var Id_at_organizationIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 97} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_organizationIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_at_countryCode3c */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-countryCode3c                       OBJECT IDENTIFIER ::= {id-at 98}
// ```
//
//
var Id_at_countryCode3c asn1.ObjectIdentifier = []int{2, 5, 4, 98} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_countryCode3c */ /* START_OF_SYMBOL_DEFINITION Id_at_countryCode3n */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-countryCode3n                       OBJECT IDENTIFIER ::= {id-at 99}
// ```
//
//
var Id_at_countryCode3n asn1.ObjectIdentifier = []int{2, 5, 4, 99} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_countryCode3n */ /* START_OF_SYMBOL_DEFINITION Id_at_dnsName */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-dnsName                             OBJECT IDENTIFIER ::= {id-at 100}
// ```
//
//
var Id_at_dnsName asn1.ObjectIdentifier = []int{2, 5, 4, 100} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_dnsName */ /* START_OF_SYMBOL_DEFINITION Id_at_intEmail */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-intEmail                            OBJECT IDENTIFIER ::= {id-at 104}
// ```
//
//
var Id_at_intEmail asn1.ObjectIdentifier = []int{2, 5, 4, 104} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_intEmail */ /* START_OF_SYMBOL_DEFINITION Id_at_jid */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-jid                                 OBJECT IDENTIFIER ::= {id-at 105}
// ```
//
//
var Id_at_jid asn1.ObjectIdentifier = []int{2, 5, 4, 105} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_jid */ /* START_OF_SYMBOL_DEFINITION Id_at_objectIdentifier */
// ### ASN.1 Definition:
//
// ```asn1
// id-at-objectIdentifier                    OBJECT IDENTIFIER ::= {id-at 106}
// ```
//
//
var Id_at_objectIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 106} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_at_objectIdentifier */ /* START_OF_SYMBOL_DEFINITION Id_asx_utmCoords */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-utmCoords                          OBJECT IDENTIFIER ::= {id-asx 4}
// ```
//
//
var Id_asx_utmCoords asn1.ObjectIdentifier = []int{2, 5, 40, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_utmCoords */ /* START_OF_SYMBOL_DEFINITION Id_asx_uiiForm */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-uiiForm                            OBJECT IDENTIFIER ::= {id-asx 5}
// ```
//
//
var Id_asx_uiiForm asn1.ObjectIdentifier = []int{2, 5, 40, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_uiiForm */ /* START_OF_SYMBOL_DEFINITION Id_asx_epcForm */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-epcForm                            OBJECT IDENTIFIER ::= {id-asx 6}
// ```
//
//
var Id_asx_epcForm asn1.ObjectIdentifier = []int{2, 5, 40, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_epcForm */ /* START_OF_SYMBOL_DEFINITION Id_asx_countryString3c */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-countryString3c                    OBJECT IDENTIFIER ::= {id-asx 7}
// ```
//
//
var Id_asx_countryString3c asn1.ObjectIdentifier = []int{2, 5, 40, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_countryString3c */ /* START_OF_SYMBOL_DEFINITION Id_asx_countryString3n */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-countryString3n                    OBJECT IDENTIFIER ::= {id-asx 8}
// ```
//
//
var Id_asx_countryString3n asn1.ObjectIdentifier = []int{2, 5, 40, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_countryString3n */ /* START_OF_SYMBOL_DEFINITION Id_asx_dnsString */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-dnsString                          OBJECT IDENTIFIER ::= {id-asx 9}
// ```
//
//
var Id_asx_dnsString asn1.ObjectIdentifier = []int{2, 5, 40, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_dnsString */ /* START_OF_SYMBOL_DEFINITION Id_asx_intEmailString */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-intEmailString                     OBJECT IDENTIFIER ::= {id-asx 11}
// ```
//
//
var Id_asx_intEmailString asn1.ObjectIdentifier = []int{2, 5, 40, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_intEmailString */ /* START_OF_SYMBOL_DEFINITION Id_asx_jidString */
// ### ASN.1 Definition:
//
// ```asn1
// id-asx-jidString                          OBJECT IDENTIFIER ::= {id-asx 12}
// ```
//
//
var Id_asx_jidString asn1.ObjectIdentifier = []int{2, 5, 40, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_asx_jidString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_attributeTypeDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-attributeTypeDescription           OBJECT IDENTIFIER ::= {id-lsx 3}
// ```
//
//
var Id_lsx_attributeTypeDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_attributeTypeDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_bitString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-bitString                          OBJECT IDENTIFIER ::= {id-lsx 6}
// ```
//
//
var Id_lsx_bitString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_bitString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_boolean */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-boolean                            OBJECT IDENTIFIER ::= {id-lsx 7}
// ```
//
//
var Id_lsx_boolean asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_boolean */ /* START_OF_SYMBOL_DEFINITION Id_lsx_countryString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-countryString                      OBJECT IDENTIFIER ::= {id-lsx 11}
// ```
//
//
var Id_lsx_countryString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_countryString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_dn */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-dn                                 OBJECT IDENTIFIER ::= {id-lsx 12}
// ```
//
//
var Id_lsx_dn asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_dn */ /* START_OF_SYMBOL_DEFINITION Id_lsx_deliveryMethod */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-deliveryMethod                     OBJECT IDENTIFIER ::= {id-lsx 14}
// ```
//
//
var Id_lsx_deliveryMethod asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_deliveryMethod */ /* START_OF_SYMBOL_DEFINITION Id_lsx_directoryString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-directoryString                    OBJECT IDENTIFIER ::= {id-lsx 15}
// ```
//
//
var Id_lsx_directoryString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_directoryString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_dITContentRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-dITContentRuleDescription          OBJECT IDENTIFIER ::= {id-lsx 16}
// ```
//
//
var Id_lsx_dITContentRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_dITContentRuleDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_dITStructureRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-dITStructureRuleDescription        OBJECT IDENTIFIER ::= {id-lsx 17}
// ```
//
//
var Id_lsx_dITStructureRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_dITStructureRuleDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_enhancedGuide */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-enhancedGuide                      OBJECT IDENTIFIER ::= {id-lsx 21}
// ```
//
//
var Id_lsx_enhancedGuide asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_enhancedGuide */ /* START_OF_SYMBOL_DEFINITION Id_lsx_facsimileTelephoneNr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-facsimileTelephoneNr               OBJECT IDENTIFIER ::= {id-lsx 22}
// ```
//
//
var Id_lsx_facsimileTelephoneNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_facsimileTelephoneNr */ /* START_OF_SYMBOL_DEFINITION Id_lsx_fax */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-fax                                OBJECT IDENTIFIER ::= {id-lsx 23}
// ```
//
//
var Id_lsx_fax asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_fax */ /* START_OF_SYMBOL_DEFINITION Id_lsx_generalizedTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-generalizedTime                    OBJECT IDENTIFIER ::= {id-lsx 24}
// ```
//
//
var Id_lsx_generalizedTime asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_generalizedTime */ /* START_OF_SYMBOL_DEFINITION Id_lsx_guide */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-guide                              OBJECT IDENTIFIER ::= {id-lsx 25}
// ```
//
//
var Id_lsx_guide asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_guide */ /* START_OF_SYMBOL_DEFINITION Id_lsx_ia5String */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-ia5String                          OBJECT IDENTIFIER ::= {id-lsx 26}
// ```
//
//
var Id_lsx_ia5String asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_ia5String */ /* START_OF_SYMBOL_DEFINITION Id_lsx_integer */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-integer                            OBJECT IDENTIFIER ::= {id-lsx 27}
// ```
//
//
var Id_lsx_integer asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_integer */ /* START_OF_SYMBOL_DEFINITION Id_lsx_jpeg */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-jpeg                               OBJECT IDENTIFIER ::= {id-lsx 28}
// ```
//
//
var Id_lsx_jpeg asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_jpeg */ /* START_OF_SYMBOL_DEFINITION Id_lsx_matchingRuleDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-matchingRuleDescription            OBJECT IDENTIFIER ::= {id-lsx 30}
// ```
//
//
var Id_lsx_matchingRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_matchingRuleDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_matchingRuleUseDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-matchingRuleUseDescription         OBJECT IDENTIFIER ::= {id-lsx 31}
// ```
//
//
var Id_lsx_matchingRuleUseDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_matchingRuleUseDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_nameAndOptionalUID */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-nameAndOptionalUID                 OBJECT IDENTIFIER ::= {id-lsx 34}
// ```
//
//
var Id_lsx_nameAndOptionalUID asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_nameAndOptionalUID */ /* START_OF_SYMBOL_DEFINITION Id_lsx_nameFormDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-nameFormDescription                OBJECT IDENTIFIER ::= {id-lsx 35}
// ```
//
//
var Id_lsx_nameFormDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_nameFormDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_numericString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-numericString                      OBJECT IDENTIFIER ::= {id-lsx 36}
// ```
//
//
var Id_lsx_numericString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_numericString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_objectClassDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-objectClassDescription             OBJECT IDENTIFIER ::= {id-lsx 37}
// ```
//
//
var Id_lsx_objectClassDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 37} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_objectClassDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_oid */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-oid                                OBJECT IDENTIFIER ::= {id-lsx 38}
// ```
//
//
var Id_lsx_oid asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 38} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_oid */ /* START_OF_SYMBOL_DEFINITION Id_lsx_otherMailbox */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-otherMailbox                       OBJECT IDENTIFIER ::= {id-lsx 39}
// ```
//
//
var Id_lsx_otherMailbox asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 39} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_otherMailbox */ /* START_OF_SYMBOL_DEFINITION Id_lsx_octetString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-octetString                        OBJECT IDENTIFIER ::= {id-lsx 40}
// ```
//
//
var Id_lsx_octetString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 40} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_octetString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_postalAddr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-postalAddr                         OBJECT IDENTIFIER ::= {id-lsx 41}
// ```
//
//
var Id_lsx_postalAddr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_postalAddr */ /* START_OF_SYMBOL_DEFINITION Id_lsx_presentationAddr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-presentationAddr                   OBJECT IDENTIFIER ::= {id-lsx 43}
// ```
//
//
var Id_lsx_presentationAddr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 43} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_presentationAddr */ /* START_OF_SYMBOL_DEFINITION Id_lsx_printableString */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-printableString                    OBJECT IDENTIFIER ::= {id-lsx 44}
// ```
//
//
var Id_lsx_printableString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 44} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_printableString */ /* START_OF_SYMBOL_DEFINITION Id_lsx_subtreeSpec */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-subtreeSpec                        OBJECT IDENTIFIER ::= {id-lsx 45}
// ```
//
//
var Id_lsx_subtreeSpec asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 45} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_subtreeSpec */ /* START_OF_SYMBOL_DEFINITION Id_lsx_telephoneNr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-telephoneNr                        OBJECT IDENTIFIER ::= {id-lsx 50}
// ```
//
//
var Id_lsx_telephoneNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 50} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_telephoneNr */ /* START_OF_SYMBOL_DEFINITION Id_lsx_telexNr */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-telexNr                            OBJECT IDENTIFIER ::= {id-lsx 52}
// ```
//
//
var Id_lsx_telexNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 52} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_telexNr */ /* START_OF_SYMBOL_DEFINITION Id_lsx_utcTime */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-utcTime                            OBJECT IDENTIFIER ::= {id-lsx 53}
// ```
//
//
var Id_lsx_utcTime asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 53} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_utcTime */ /* START_OF_SYMBOL_DEFINITION Id_lsx_ldapSyntaxDescription */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-ldapSyntaxDescription              OBJECT IDENTIFIER ::= {id-lsx 54}
// ```
//
//
var Id_lsx_ldapSyntaxDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 54} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_ldapSyntaxDescription */ /* START_OF_SYMBOL_DEFINITION Id_lsx_substringAssertion */
// ### ASN.1 Definition:
//
// ```asn1
// id-lsx-substringAssertion                 OBJECT IDENTIFIER ::= {id-lsx 58}
// ```
//
//
var Id_lsx_substringAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 58} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lsx_substringAssertion */ /* START_OF_SYMBOL_DEFINITION Id_oidC1 */
// ### ASN.1 Definition:
//
// ```asn1
// id-oidC1                                  OBJECT IDENTIFIER ::= {id 0}
// ```
//
//
var Id_oidC1 asn1.ObjectIdentifier = []int{2, 17, 1, 2, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oidC1 */ /* START_OF_SYMBOL_DEFINITION Id_oidC2 */
// ### ASN.1 Definition:
//
// ```asn1
// id-oidC2                                  OBJECT IDENTIFIER ::= {id 1}
// ```
//
//
var Id_oidC2 asn1.ObjectIdentifier = []int{2, 17, 1, 2, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oidC2 */ /* START_OF_SYMBOL_DEFINITION Id_oidC */
// ### ASN.1 Definition:
//
// ```asn1
// id-oidC                                   OBJECT IDENTIFIER ::= {id 2}
// ```
//
//
var Id_oidC asn1.ObjectIdentifier = []int{2, 17, 1, 2, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oidC */ /* START_OF_SYMBOL_DEFINITION Id_cat_sequenceMatchType */
// ### ASN.1 Definition:
//
// ```asn1
// id-cat-sequenceMatchType                  OBJECT IDENTIFIER ::= {id-cat 1}
// ```
//
//
var Id_cat_sequenceMatchType asn1.ObjectIdentifier = []int{2, 5, 37, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_cat_sequenceMatchType */ /* START_OF_SYMBOL_DEFINITION Id_cat_wordMatchType */
// ### ASN.1 Definition:
//
// ```asn1
// id-cat-wordMatchType                      OBJECT IDENTIFIER ::= {id-cat 2}
// ```
//
//
var Id_cat_wordMatchType asn1.ObjectIdentifier = []int{2, 5, 37, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_cat_wordMatchType */ /* START_OF_SYMBOL_DEFINITION Id_cat_characterMatchTypes */
// ### ASN.1 Definition:
//
// ```asn1
// id-cat-characterMatchTypes                OBJECT IDENTIFIER ::= {id-cat 3}
// ```
//
//
var Id_cat_characterMatchTypes asn1.ObjectIdentifier = []int{2, 5, 37, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_cat_characterMatchTypes */ /* START_OF_SYMBOL_DEFINITION Id_cat_selectedContexts */
// ### ASN.1 Definition:
//
// ```asn1
// id-cat-selectedContexts                   OBJECT IDENTIFIER ::= {id-cat 4}
// ```
//
//
var Id_cat_selectedContexts asn1.ObjectIdentifier = []int{2, 5, 37, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_cat_selectedContexts */ /* START_OF_SYMBOL_DEFINITION Id_not_dSAProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-dSAProblem                         OBJECT IDENTIFIER ::= {id-not 0}
// ```
//
//
var Id_not_dSAProblem asn1.ObjectIdentifier = []int{2, 5, 35, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_dSAProblem */ /* START_OF_SYMBOL_DEFINITION Id_not_searchServiceProblem */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-searchServiceProblem               OBJECT IDENTIFIER ::= {id-not 1}
// ```
//
//
var Id_not_searchServiceProblem asn1.ObjectIdentifier = []int{2, 5, 35, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_searchServiceProblem */ /* START_OF_SYMBOL_DEFINITION Id_not_serviceType */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-serviceType                        OBJECT IDENTIFIER ::= {id-not 2}
// ```
//
//
var Id_not_serviceType asn1.ObjectIdentifier = []int{2, 5, 35, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_serviceType */ /* START_OF_SYMBOL_DEFINITION Id_not_attributeTypeList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-attributeTypeList                  OBJECT IDENTIFIER ::= {id-not 3}
// ```
//
//
var Id_not_attributeTypeList asn1.ObjectIdentifier = []int{2, 5, 35, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_attributeTypeList */ /* START_OF_SYMBOL_DEFINITION Id_not_matchingRuleList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-matchingRuleList                   OBJECT IDENTIFIER ::= {id-not 4}
// ```
//
//
var Id_not_matchingRuleList asn1.ObjectIdentifier = []int{2, 5, 35, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_matchingRuleList */ /* START_OF_SYMBOL_DEFINITION Id_not_filterItem */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-filterItem                         OBJECT IDENTIFIER ::= {id-not 5}
// ```
//
//
var Id_not_filterItem asn1.ObjectIdentifier = []int{2, 5, 35, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_filterItem */ /* START_OF_SYMBOL_DEFINITION Id_not_attributeCombinations */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-attributeCombinations              OBJECT IDENTIFIER ::= {id-not 6}
// ```
//
//
var Id_not_attributeCombinations asn1.ObjectIdentifier = []int{2, 5, 35, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_attributeCombinations */ /* START_OF_SYMBOL_DEFINITION Id_not_contextTypeList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-contextTypeList                    OBJECT IDENTIFIER ::= {id-not 7}
// ```
//
//
var Id_not_contextTypeList asn1.ObjectIdentifier = []int{2, 5, 35, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_contextTypeList */ /* START_OF_SYMBOL_DEFINITION Id_not_contextList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-contextList                        OBJECT IDENTIFIER ::= {id-not 8}
// ```
//
//
var Id_not_contextList asn1.ObjectIdentifier = []int{2, 5, 35, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_contextList */ /* START_OF_SYMBOL_DEFINITION Id_not_contextCombinations */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-contextCombinations                OBJECT IDENTIFIER ::= {id-not 9}
// ```
//
//
var Id_not_contextCombinations asn1.ObjectIdentifier = []int{2, 5, 35, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_contextCombinations */ /* START_OF_SYMBOL_DEFINITION Id_not_hierarchySelectList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-hierarchySelectList                OBJECT IDENTIFIER ::= {id-not 10}
// ```
//
//
var Id_not_hierarchySelectList asn1.ObjectIdentifier = []int{2, 5, 35, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_hierarchySelectList */ /* START_OF_SYMBOL_DEFINITION Id_not_searchControlOptionsList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-searchControlOptionsList           OBJECT IDENTIFIER ::= {id-not 11}
// ```
//
//
var Id_not_searchControlOptionsList asn1.ObjectIdentifier = []int{2, 5, 35, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_searchControlOptionsList */ /* START_OF_SYMBOL_DEFINITION Id_not_serviceControlOptionsList */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-serviceControlOptionsList          OBJECT IDENTIFIER ::= {id-not 12}
// ```
//
//
var Id_not_serviceControlOptionsList asn1.ObjectIdentifier = []int{2, 5, 35, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_serviceControlOptionsList */ /* START_OF_SYMBOL_DEFINITION Id_not_multipleMatchingLocalities */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-multipleMatchingLocalities         OBJECT IDENTIFIER ::= {id-not 13}
// ```
//
//
var Id_not_multipleMatchingLocalities asn1.ObjectIdentifier = []int{2, 5, 35, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_multipleMatchingLocalities */ /* START_OF_SYMBOL_DEFINITION Id_not_proposedRelaxation */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-proposedRelaxation                 OBJECT IDENTIFIER ::= {id-not 14}
// ```
//
//
var Id_not_proposedRelaxation asn1.ObjectIdentifier = []int{2, 5, 35, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_proposedRelaxation */ /* START_OF_SYMBOL_DEFINITION Id_not_appliedRelaxation */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-appliedRelaxation                  OBJECT IDENTIFIER ::= {id-not 15}
// ```
//
//
var Id_not_appliedRelaxation asn1.ObjectIdentifier = []int{2, 5, 35, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_appliedRelaxation */ /* START_OF_SYMBOL_DEFINITION Id_not_pwdResponse */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-pwdResponse                        OBJECT IDENTIFIER ::= {id-not 16}
// ```
//
//
var Id_not_pwdResponse asn1.ObjectIdentifier = []int{2, 5, 35, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_pwdResponse */ /* START_OF_SYMBOL_DEFINITION Id_not_ldapDiagnosticMsg */
// ### ASN.1 Definition:
//
// ```asn1
// id-not-ldapDiagnosticMsg                  OBJECT IDENTIFIER ::= {id-not 17}
// ```
//
//
var Id_not_ldapDiagnosticMsg asn1.ObjectIdentifier = []int{2, 5, 35, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_not_ldapDiagnosticMsg */ /* START_OF_SYMBOL_DEFINITION Id_pr_targetDsaUnavailable */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-targetDsaUnavailable                OBJECT IDENTIFIER ::= {id-pr 1}
// ```
//
//
var Id_pr_targetDsaUnavailable asn1.ObjectIdentifier = []int{2, 5, 34, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_targetDsaUnavailable */ /* START_OF_SYMBOL_DEFINITION Id_pr_dataSourceUnavailable */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-dataSourceUnavailable               OBJECT IDENTIFIER ::= {id-pr 2}
// ```
//
//
var Id_pr_dataSourceUnavailable asn1.ObjectIdentifier = []int{2, 5, 34, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_dataSourceUnavailable */ /* START_OF_SYMBOL_DEFINITION Id_pr_unidentifiedOperation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unidentifiedOperation               OBJECT IDENTIFIER ::= {id-pr 3}
// ```
//
//
var Id_pr_unidentifiedOperation asn1.ObjectIdentifier = []int{2, 5, 34, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unidentifiedOperation */ /* START_OF_SYMBOL_DEFINITION Id_pr_unavailableOperation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unavailableOperation                OBJECT IDENTIFIER ::= {id-pr 4}
// ```
//
//
var Id_pr_unavailableOperation asn1.ObjectIdentifier = []int{2, 5, 34, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unavailableOperation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchAttributeViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchAttributeViolation            OBJECT IDENTIFIER ::= {id-pr 5}
// ```
//
//
var Id_pr_searchAttributeViolation asn1.ObjectIdentifier = []int{2, 5, 34, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchAttributeViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchAttributeCombinationViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchAttributeCombinationViolation OBJECT IDENTIFIER ::= {id-pr 6}
// ```
//
//
var Id_pr_searchAttributeCombinationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchAttributeCombinationViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchValueNotAllowed */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchValueNotAllowed               OBJECT IDENTIFIER ::= {id-pr 7}
// ```
//
//
var Id_pr_searchValueNotAllowed asn1.ObjectIdentifier = []int{2, 5, 34, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchValueNotAllowed */ /* START_OF_SYMBOL_DEFINITION Id_pr_missingSearchAttribute */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-missingSearchAttribute              OBJECT IDENTIFIER ::= {id-pr 8}
// ```
//
//
var Id_pr_missingSearchAttribute asn1.ObjectIdentifier = []int{2, 5, 34, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_missingSearchAttribute */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchValueViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchValueViolation                OBJECT IDENTIFIER ::= {id-pr 9}
// ```
//
//
var Id_pr_searchValueViolation asn1.ObjectIdentifier = []int{2, 5, 34, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchValueViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_attributeNegationViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-attributeNegationViolation          OBJECT IDENTIFIER ::= {id-pr 10}
// ```
//
//
var Id_pr_attributeNegationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_attributeNegationViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchValueRequired */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchValueRequired                 OBJECT IDENTIFIER ::= {id-pr 11}
// ```
//
//
var Id_pr_searchValueRequired asn1.ObjectIdentifier = []int{2, 5, 34, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchValueRequired */ /* START_OF_SYMBOL_DEFINITION Id_pr_invalidSearchValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-invalidSearchValue                  OBJECT IDENTIFIER ::= {id-pr 12}
// ```
//
//
var Id_pr_invalidSearchValue asn1.ObjectIdentifier = []int{2, 5, 34, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_invalidSearchValue */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchContextViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchContextViolation              OBJECT IDENTIFIER ::= {id-pr 13}
// ```
//
//
var Id_pr_searchContextViolation asn1.ObjectIdentifier = []int{2, 5, 34, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchContextViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchContextCombinationViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchContextCombinationViolation   OBJECT IDENTIFIER ::= {id-pr 14}
// ```
//
//
var Id_pr_searchContextCombinationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchContextCombinationViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_missingSearchContext */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-missingSearchContext                OBJECT IDENTIFIER ::= {id-pr 15}
// ```
//
//
var Id_pr_missingSearchContext asn1.ObjectIdentifier = []int{2, 5, 34, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_missingSearchContext */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchContextValueViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchContextValueViolation         OBJECT IDENTIFIER ::= {id-pr 16}
// ```
//
//
var Id_pr_searchContextValueViolation asn1.ObjectIdentifier = []int{2, 5, 34, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchContextValueViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchContextValueRequired */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchContextValueRequired          OBJECT IDENTIFIER ::= {id-pr 17}
// ```
//
//
var Id_pr_searchContextValueRequired asn1.ObjectIdentifier = []int{2, 5, 34, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchContextValueRequired */ /* START_OF_SYMBOL_DEFINITION Id_pr_invalidContextSearchValue */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-invalidContextSearchValue           OBJECT IDENTIFIER ::= {id-pr 18}
// ```
//
//
var Id_pr_invalidContextSearchValue asn1.ObjectIdentifier = []int{2, 5, 34, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_invalidContextSearchValue */ /* START_OF_SYMBOL_DEFINITION Id_pr_unsupportedMatchingRule */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unsupportedMatchingRule             OBJECT IDENTIFIER ::= {id-pr 19}
// ```
//
//
var Id_pr_unsupportedMatchingRule asn1.ObjectIdentifier = []int{2, 5, 34, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unsupportedMatchingRule */ /* START_OF_SYMBOL_DEFINITION Id_pr_attributeMatchingViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-attributeMatchingViolation          OBJECT IDENTIFIER ::= {id-pr 20}
// ```
//
//
var Id_pr_attributeMatchingViolation asn1.ObjectIdentifier = []int{2, 5, 34, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_attributeMatchingViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_unsupportedMatchingUse */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unsupportedMatchingUse              OBJECT IDENTIFIER ::= {id-pr 21}
// ```
//
//
var Id_pr_unsupportedMatchingUse asn1.ObjectIdentifier = []int{2, 5, 34, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unsupportedMatchingUse */ /* START_OF_SYMBOL_DEFINITION Id_pr_matchingUseViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-matchingUseViolation                OBJECT IDENTIFIER ::= {id-pr 22}
// ```
//
//
var Id_pr_matchingUseViolation asn1.ObjectIdentifier = []int{2, 5, 34, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_matchingUseViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_hierarchySelectForbidden */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-hierarchySelectForbidden            OBJECT IDENTIFIER ::= {id-pr 23}
// ```
//
//
var Id_pr_hierarchySelectForbidden asn1.ObjectIdentifier = []int{2, 5, 34, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_hierarchySelectForbidden */ /* START_OF_SYMBOL_DEFINITION Id_pr_invalidHierarchySelect */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-invalidHierarchySelect              OBJECT IDENTIFIER ::= {id-pr 24}
// ```
//
//
var Id_pr_invalidHierarchySelect asn1.ObjectIdentifier = []int{2, 5, 34, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_invalidHierarchySelect */ /* START_OF_SYMBOL_DEFINITION Id_pr_unavailableHierarchySelect */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unavailableHierarchySelect          OBJECT IDENTIFIER ::= {id-pr 25}
// ```
//
//
var Id_pr_unavailableHierarchySelect asn1.ObjectIdentifier = []int{2, 5, 34, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unavailableHierarchySelect */ /* START_OF_SYMBOL_DEFINITION Id_pr_invalidSearchControlOptions */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-invalidSearchControlOptions         OBJECT IDENTIFIER ::= {id-pr 26}
// ```
//
//
var Id_pr_invalidSearchControlOptions asn1.ObjectIdentifier = []int{2, 5, 34, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_invalidSearchControlOptions */ /* START_OF_SYMBOL_DEFINITION Id_pr_invalidServiceControlOptions */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-invalidServiceControlOptions        OBJECT IDENTIFIER ::= {id-pr 27}
// ```
//
//
var Id_pr_invalidServiceControlOptions asn1.ObjectIdentifier = []int{2, 5, 34, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_invalidServiceControlOptions */ /* START_OF_SYMBOL_DEFINITION Id_pr_searchSubsetViolation */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-searchSubsetViolation               OBJECT IDENTIFIER ::= {id-pr 28}
// ```
//
//
var Id_pr_searchSubsetViolation asn1.ObjectIdentifier = []int{2, 5, 34, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_searchSubsetViolation */ /* START_OF_SYMBOL_DEFINITION Id_pr_unmatchedKeyAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unmatchedKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 29}
// ```
//
//
var Id_pr_unmatchedKeyAttributes asn1.ObjectIdentifier = []int{2, 5, 34, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unmatchedKeyAttributes */ /* START_OF_SYMBOL_DEFINITION Id_pr_ambiguousKeyAttributes */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-ambiguousKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 30}
// ```
//
//
var Id_pr_ambiguousKeyAttributes asn1.ObjectIdentifier = []int{2, 5, 34, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_ambiguousKeyAttributes */ /* START_OF_SYMBOL_DEFINITION Id_pr_unavailableRelaxationLevel */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-unavailableRelaxationLevel          OBJECT IDENTIFIER ::= {id-pr 31}
// ```
//
//
var Id_pr_unavailableRelaxationLevel asn1.ObjectIdentifier = []int{2, 5, 34, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_unavailableRelaxationLevel */ /* START_OF_SYMBOL_DEFINITION Id_pr_emptyHierarchySelection */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-emptyHierarchySelection             OBJECT IDENTIFIER ::= {id-pr 32}
// ```
//
//
var Id_pr_emptyHierarchySelection asn1.ObjectIdentifier = []int{2, 5, 34, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_emptyHierarchySelection */ /* START_OF_SYMBOL_DEFINITION Id_pr_administratorImposedLimit */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-administratorImposedLimit           OBJECT IDENTIFIER ::= {id-pr 33}
// ```
//
//
var Id_pr_administratorImposedLimit asn1.ObjectIdentifier = []int{2, 5, 34, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_administratorImposedLimit */ /* START_OF_SYMBOL_DEFINITION Id_pr_permanentRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-permanentRestriction                OBJECT IDENTIFIER ::= {id-pr 34}
// ```
//
//
var Id_pr_permanentRestriction asn1.ObjectIdentifier = []int{2, 5, 34, 34} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_permanentRestriction */ /* START_OF_SYMBOL_DEFINITION Id_pr_temporaryRestriction */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-temporaryRestriction                OBJECT IDENTIFIER ::= {id-pr 35}
// ```
//
//
var Id_pr_temporaryRestriction asn1.ObjectIdentifier = []int{2, 5, 34, 35} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_temporaryRestriction */ /* START_OF_SYMBOL_DEFINITION Id_pr_relaxationNotSupported */
// ### ASN.1 Definition:
//
// ```asn1
// id-pr-relaxationNotSupported              OBJECT IDENTIFIER ::= {id-pr 36}
// ```
//
//
var Id_pr_relaxationNotSupported asn1.ObjectIdentifier = []int{2, 5, 34, 36} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_pr_relaxationNotSupported */ /* START_OF_SYMBOL_DEFINITION Id_coat_uid */
// ### ASN.1 Definition:
//
// ```asn1
// id-coat-uid                               OBJECT IDENTIFIER ::= {id-coat 1}
// ```
//
//
var Id_coat_uid asn1.ObjectIdentifier = []int{0, 9, 2342, 19200300, 100, 1, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_coat_uid */ /* START_OF_SYMBOL_DEFINITION Id_coat_dc */
// ### ASN.1 Definition:
//
// ```asn1
// id-coat-dc                                OBJECT IDENTIFIER ::= {id-coat 25}
// ```
//
//
var Id_coat_dc asn1.ObjectIdentifier = []int{0, 9, 2342, 19200300, 100, 1, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_coat_dc */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseIgnoreMatch                     OBJECT IDENTIFIER ::= {id-mr 2}
// ```
//
//
var Id_mr_caseIgnoreMatch asn1.ObjectIdentifier = []int{2, 5, 13, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseIgnoreOrderingMatch             OBJECT IDENTIFIER ::= {id-mr 3}
// ```
//
//
var Id_mr_caseIgnoreOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseIgnoreSubstringsMatch           OBJECT IDENTIFIER ::= {id-mr 4}
// ```
//
//
var Id_mr_caseIgnoreSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseExactMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseExactMatch                      OBJECT IDENTIFIER ::= {id-mr 5}
// ```
//
//
var Id_mr_caseExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseExactMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseExactOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseExactOrderingMatch              OBJECT IDENTIFIER ::= {id-mr 6}
// ```
//
//
var Id_mr_caseExactOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseExactOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseExactSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseExactSubstringsMatch            OBJECT IDENTIFIER ::= {id-mr 7}
// ```
//
//
var Id_mr_caseExactSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseExactSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_numericStringMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-numericStringMatch                  OBJECT IDENTIFIER ::= {id-mr 8}
// ```
//
//
var Id_mr_numericStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_numericStringMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_numericStringOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-numericStringOrderingMatch          OBJECT IDENTIFIER ::= {id-mr 9}
// ```
//
//
var Id_mr_numericStringOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_numericStringOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_numericStringSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-numericStringSubstringsMatch        OBJECT IDENTIFIER ::= {id-mr 10}
// ```
//
//
var Id_mr_numericStringSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 10} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_numericStringSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreListMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseIgnoreListMatch                 OBJECT IDENTIFIER ::= {id-mr 11}
// ```
//
//
var Id_mr_caseIgnoreListMatch asn1.ObjectIdentifier = []int{2, 5, 13, 11} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreListMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreListSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-caseIgnoreListSubstringsMatch       OBJECT IDENTIFIER ::= {id-mr 12}
// ```
//
//
var Id_mr_caseIgnoreListSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 12} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_caseIgnoreListSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_booleanMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-booleanMatch                        OBJECT IDENTIFIER ::= {id-mr 13}
// ```
//
//
var Id_mr_booleanMatch asn1.ObjectIdentifier = []int{2, 5, 13, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_booleanMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_integerMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-integerMatch                        OBJECT IDENTIFIER ::= {id-mr 14}
// ```
//
//
var Id_mr_integerMatch asn1.ObjectIdentifier = []int{2, 5, 13, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_integerMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_integerOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-integerOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 15}
// ```
//
//
var Id_mr_integerOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_integerOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_bitStringMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-bitStringMatch                      OBJECT IDENTIFIER ::= {id-mr 16}
// ```
//
//
var Id_mr_bitStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_bitStringMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_octetStringMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-octetStringMatch                    OBJECT IDENTIFIER ::= {id-mr 17}
// ```
//
//
var Id_mr_octetStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 17} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_octetStringMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_octetStringOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-octetStringOrderingMatch            OBJECT IDENTIFIER ::= {id-mr 18}
// ```
//
//
var Id_mr_octetStringOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 18} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_octetStringOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_octetStringSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-octetStringSubstringsMatch          OBJECT IDENTIFIER ::= {id-mr 19}
// ```
//
//
var Id_mr_octetStringSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 19} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_octetStringSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_telephoneNumberMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-telephoneNumberMatch                OBJECT IDENTIFIER ::= {id-mr 20}
// ```
//
//
var Id_mr_telephoneNumberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 20} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_telephoneNumberMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_telephoneNumberSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-telephoneNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 21}
// ```
//
//
var Id_mr_telephoneNumberSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 21} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_telephoneNumberSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_presentationAddressMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-presentationAddressMatch            OBJECT IDENTIFIER ::= {id-mr 22}
// ```
//
//
var Id_mr_presentationAddressMatch asn1.ObjectIdentifier = []int{2, 5, 13, 22} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_presentationAddressMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_uniqueMemberMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-uniqueMemberMatch                   OBJECT IDENTIFIER ::= {id-mr 23}
// ```
//
//
var Id_mr_uniqueMemberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 23} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_uniqueMemberMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_protocolInformationMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-protocolInformationMatch            OBJECT IDENTIFIER ::= {id-mr 24}
// ```
//
//
var Id_mr_protocolInformationMatch asn1.ObjectIdentifier = []int{2, 5, 13, 24} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_protocolInformationMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_uTCTimeMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-uTCTimeMatch                        OBJECT IDENTIFIER ::= {id-mr 25}
// ```
//
//
var Id_mr_uTCTimeMatch asn1.ObjectIdentifier = []int{2, 5, 13, 25} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_uTCTimeMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_uTCTimeOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-uTCTimeOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 26}
// ```
//
//
var Id_mr_uTCTimeOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 26} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_uTCTimeOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_generalizedTimeMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-generalizedTimeMatch                OBJECT IDENTIFIER ::= {id-mr 27}
// ```
//
//
var Id_mr_generalizedTimeMatch asn1.ObjectIdentifier = []int{2, 5, 13, 27} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_generalizedTimeMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_generalizedTimeOrderingMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-generalizedTimeOrderingMatch        OBJECT IDENTIFIER ::= {id-mr 28}
// ```
//
//
var Id_mr_generalizedTimeOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 28} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_generalizedTimeOrderingMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_integerFirstComponentMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-integerFirstComponentMatch          OBJECT IDENTIFIER ::= {id-mr 29}
// ```
//
//
var Id_mr_integerFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 29} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_integerFirstComponentMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_objectIdentifierFirstComponentMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-objectIdentifierFirstComponentMatch OBJECT IDENTIFIER ::= {id-mr 30}
// ```
//
//
var Id_mr_objectIdentifierFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 30} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_objectIdentifierFirstComponentMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_directoryStringFirstComponentMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-directoryStringFirstComponentMatch  OBJECT IDENTIFIER ::= {id-mr 31}
// ```
//
//
var Id_mr_directoryStringFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 31} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_directoryStringFirstComponentMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_wordMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-wordMatch                           OBJECT IDENTIFIER ::= {id-mr 32}
// ```
//
//
var Id_mr_wordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 32} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_wordMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_keywordMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-keywordMatch                        OBJECT IDENTIFIER ::= {id-mr 33}
// ```
//
//
var Id_mr_keywordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 33} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_keywordMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_storedPrefixMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-storedPrefixMatch                   OBJECT IDENTIFIER ::= {id-mr 41}
// ```
//
//
var Id_mr_storedPrefixMatch asn1.ObjectIdentifier = []int{2, 5, 13, 41} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_storedPrefixMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_systemProposedMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-systemProposedMatch                 OBJECT IDENTIFIER ::= {id-mr 47}
// ```
//
//
var Id_mr_systemProposedMatch asn1.ObjectIdentifier = []int{2, 5, 13, 47} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_systemProposedMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_generalWordMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-generalWordMatch                    OBJECT IDENTIFIER ::= {id-mr 48}
// ```
//
//
var Id_mr_generalWordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 48} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_generalWordMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_approximateStringMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-approximateStringMatch              OBJECT IDENTIFIER ::= {id-mr 49}
// ```
//
//
var Id_mr_approximateStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 49} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_approximateStringMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_ignoreIfAbsentMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-ignoreIfAbsentMatch                 OBJECT IDENTIFIER ::= {id-mr 50}
// ```
//
//
var Id_mr_ignoreIfAbsentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 50} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_ignoreIfAbsentMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_nullMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-nullMatch                           OBJECT IDENTIFIER ::= {id-mr 51}
// ```
//
//
var Id_mr_nullMatch asn1.ObjectIdentifier = []int{2, 5, 13, 51} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_nullMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_zonalMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-zonalMatch                          OBJECT IDENTIFIER ::= {id-mr 52}
// ```
//
//
var Id_mr_zonalMatch asn1.ObjectIdentifier = []int{2, 5, 13, 52} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_zonalMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_facsimileNumberMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-facsimileNumberMatch                OBJECT IDENTIFIER ::= {id-mr 63}
// ```
//
//
var Id_mr_facsimileNumberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 63} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_facsimileNumberMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_facsimileNumberSubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-facsimileNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 64}
// ```
//
//
var Id_mr_facsimileNumberSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 64} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_facsimileNumberSubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_uuidpairmatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-uuidpairmatch                       OBJECT IDENTIFIER ::= {id-mr 68}
// ```
//
//
var Id_mr_uuidpairmatch asn1.ObjectIdentifier = []int{2, 5, 13, 68} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_uuidpairmatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_uriMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-uriMatch                            OBJECT IDENTIFIER ::= {id-mr 70}
// ```
//
//
var Id_mr_uriMatch asn1.ObjectIdentifier = []int{2, 5, 13, 70} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_uriMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_dnsNameMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-dnsNameMatch                        OBJECT IDENTIFIER ::= {id-mr 74}
// ```
//
//
var Id_mr_dnsNameMatch asn1.ObjectIdentifier = []int{2, 5, 13, 74} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_dnsNameMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_intEmailMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-intEmailMatch                       OBJECT IDENTIFIER ::= {id-mr 75}
// ```
//
//
var Id_mr_intEmailMatch asn1.ObjectIdentifier = []int{2, 5, 13, 75} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_intEmailMatch */ /* START_OF_SYMBOL_DEFINITION Id_mr_jidMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-mr-jidMatch                            OBJECT IDENTIFIER ::= {id-mr 76}
// ```
//
//
var Id_mr_jidMatch asn1.ObjectIdentifier = []int{2, 5, 13, 76} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_mr_jidMatch */ /* START_OF_SYMBOL_DEFINITION Id_lmr_caseExactIA5Match */
// ### ASN.1 Definition:
//
// ```asn1
// id-lmr-caseExactIA5Match                  OBJECT IDENTIFIER ::= {id-lmr 1}
// ```
//
//
var Id_lmr_caseExactIA5Match asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lmr_caseExactIA5Match */ /* START_OF_SYMBOL_DEFINITION Id_lmr_caseIgnoreIA5Match */
// ### ASN.1 Definition:
//
// ```asn1
// id-lmr-caseIgnoreIA5Match                 OBJECT IDENTIFIER ::= {id-lmr 2}
// ```
//
//
var Id_lmr_caseIgnoreIA5Match asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lmr_caseIgnoreIA5Match */ /* START_OF_SYMBOL_DEFINITION Id_lmr_caseIgnoreIA5SubstringsMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-lmr-caseIgnoreIA5SubstringsMatch       OBJECT IDENTIFIER ::= {id-lmr 3}
// ```
//
//
var Id_lmr_caseIgnoreIA5SubstringsMatch asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lmr_caseIgnoreIA5SubstringsMatch */ /* START_OF_SYMBOL_DEFINITION Id_avc_language */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-language                           OBJECT IDENTIFIER ::= {id-avc 0}
// ```
//
//
var Id_avc_language asn1.ObjectIdentifier = []int{2, 5, 31, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_language */ /* START_OF_SYMBOL_DEFINITION Id_avc_temporal */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-temporal                           OBJECT IDENTIFIER ::= {id-avc 1}
// ```
//
//
var Id_avc_temporal asn1.ObjectIdentifier = []int{2, 5, 31, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_temporal */ /* START_OF_SYMBOL_DEFINITION Id_avc_locale */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-locale                             OBJECT IDENTIFIER ::= {id-avc 2}
// ```
//
//
var Id_avc_locale asn1.ObjectIdentifier = []int{2, 5, 31, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_locale */ /* START_OF_SYMBOL_DEFINITION Id_avc_ldapAttributeOption */
// ### ASN.1 Definition:
//
// ```asn1
// id-avc-ldapAttributeOption                OBJECT IDENTIFIER ::= {id-avc 5}
// ```
//
//
var Id_avc_ldapAttributeOption asn1.ObjectIdentifier = []int{2, 5, 31, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_avc_ldapAttributeOption */ /* START_OF_SYMBOL_DEFINITION EnhancedGuide_subset */
// ### ASN.1 Definition:
//
// ```asn1
// EnhancedGuide-subset ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type EnhancedGuide_subset = int64

/* END_OF_SYMBOL_DEFINITION EnhancedGuide_subset */

/* START_OF_SYMBOL_DEFINITION EnhancedGuide_subset_BaseObject */
const EnhancedGuide_subset_BaseObject EnhancedGuide_subset = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION EnhancedGuide_subset_BaseObject */

/* START_OF_SYMBOL_DEFINITION EnhancedGuide_subset_OneLevel */
const EnhancedGuide_subset_OneLevel EnhancedGuide_subset = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION EnhancedGuide_subset_OneLevel */

/* START_OF_SYMBOL_DEFINITION EnhancedGuide_subset_WholeSubtree */
const EnhancedGuide_subset_WholeSubtree EnhancedGuide_subset = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION EnhancedGuide_subset_WholeSubtree */ /* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item */
// ### ASN.1 Definition:
//
// ```asn1
// PreferredDeliveryMethod-Item ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
// ```
type PreferredDeliveryMethod_Item = int64

/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Any_delivery_method */
const PreferredDeliveryMethod_Item_Any_delivery_method PreferredDeliveryMethod_Item = 0 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Any_delivery_method */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Mhs_delivery */
const PreferredDeliveryMethod_Item_Mhs_delivery PreferredDeliveryMethod_Item = 1 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Mhs_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Physical_delivery */
const PreferredDeliveryMethod_Item_Physical_delivery PreferredDeliveryMethod_Item = 2 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Physical_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Telex_delivery */
const PreferredDeliveryMethod_Item_Telex_delivery PreferredDeliveryMethod_Item = 3 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Telex_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Teletex_delivery */
const PreferredDeliveryMethod_Item_Teletex_delivery PreferredDeliveryMethod_Item = 4 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Teletex_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_G3_facsimile_delivery */
const PreferredDeliveryMethod_Item_G3_facsimile_delivery PreferredDeliveryMethod_Item = 5 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_G3_facsimile_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_G4_facsimile_delivery */
const PreferredDeliveryMethod_Item_G4_facsimile_delivery PreferredDeliveryMethod_Item = 6 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_G4_facsimile_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Ia5_terminal_delivery */
const PreferredDeliveryMethod_Item_Ia5_terminal_delivery PreferredDeliveryMethod_Item = 7 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Ia5_terminal_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Videotex_delivery */
const PreferredDeliveryMethod_Item_Videotex_delivery PreferredDeliveryMethod_Item = 8 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Videotex_delivery */

/* START_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Telephone_delivery */
const PreferredDeliveryMethod_Item_Telephone_delivery PreferredDeliveryMethod_Item = 9 // LONG_NAMED_INTEGER_VALUE
/* END_OF_SYMBOL_DEFINITION PreferredDeliveryMethod_Item_Telephone_delivery */ /* START_OF_SYMBOL_DEFINITION UiiFormat_subset */
// ### ASN.1 Definition:
//
// ```asn1
// UiiFormat-subset ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type UiiFormat_subset = int

const (
	UiiFormat_subset_BaseObject   UiiFormat_subset = 0 // LONG_NAMED_ENUMERATED_VALUE,
	UiiFormat_subset_OneLevel     UiiFormat_subset = 1 // LONG_NAMED_ENUMERATED_VALUE,
	UiiFormat_subset_WholeSubtree UiiFormat_subset = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION UiiFormat_subset */ /* START_OF_SYMBOL_DEFINITION UiiFormat_next */
// ### ASN.1 Definition:
//
// ```asn1
// UiiFormat-next ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type UiiFormat_next = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION UiiFormat_next */ /* START_OF_SYMBOL_DEFINITION EpcFormat_fields_Item_charField */
// ### ASN.1 Definition:
//
// ```asn1
// EpcFormat-fields-Item-charField ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type EpcFormat_fields_Item_charField = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION EpcFormat_fields_Item_charField */ /* START_OF_SYMBOL_DEFINITION EpcFormat_fields_Item_result */
// ### ASN.1 Definition:
//
// ```asn1
// EpcFormat-fields-Item-result ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type EpcFormat_fields_Item_result = int

const (
	EpcFormat_fields_Item_result_NumericPad EpcFormat_fields_Item_result = 0 // LONG_NAMED_ENUMERATED_VALUE,
	EpcFormat_fields_Item_result_Numeric    EpcFormat_fields_Item_result = 1 // LONG_NAMED_ENUMERATED_VALUE,
	EpcFormat_fields_Item_result_Alpha7bits EpcFormat_fields_Item_result = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION EpcFormat_fields_Item_result */ /* START_OF_SYMBOL_DEFINITION EpcFormat_fields_Item */
// ### ASN.1 Definition:
//
// ```asn1
// EpcFormat-fields-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type EpcFormat_fields_Item struct {
	Bits      int
	CharField EpcFormat_fields_Item_charField
	Result    EpcFormat_fields_Item_result `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION EpcFormat_fields_Item */ /* START_OF_SYMBOL_DEFINITION PwdResponse_warning */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponse-warning ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type PwdResponse_warning = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION PwdResponse_warning */ /* START_OF_SYMBOL_DEFINITION PwdResponse_error */
// ### ASN.1 Definition:
//
// ```asn1
// PwdResponse-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type PwdResponse_error = int

const (
	PwdResponse_error_PasswordExpired  PwdResponse_error = 0 // LONG_NAMED_ENUMERATED_VALUE,
	PwdResponse_error_ChangeAfterReset PwdResponse_error = 1 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION PwdResponse_error */ /* START_OF_SYMBOL_DEFINITION SubstringAssertion_Item */
// ### ASN.1 Definition:
//
// ```asn1
// SubstringAssertion-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type SubstringAssertion_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION SubstringAssertion_Item */ /* START_OF_SYMBOL_DEFINITION OctetSubstringAssertion_Item */
// ### ASN.1 Definition:
//
// ```asn1
// OctetSubstringAssertion-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type OctetSubstringAssertion_Item = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION OctetSubstringAssertion_Item */ /* START_OF_SYMBOL_DEFINITION TimeSpecification_time_absolute */
// ### ASN.1 Definition:
//
// ```asn1
// TimeSpecification-time-absolute ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type TimeSpecification_time_absolute struct {
	StartTime time.Time `asn1:"optional,explicit,tag:0"`
	EndTime   time.Time `asn1:"optional,explicit,tag:1"`
}

/* END_OF_SYMBOL_DEFINITION TimeSpecification_time_absolute */ /* START_OF_SYMBOL_DEFINITION TimeSpecification_time */
// ### ASN.1 Definition:
//
// ```asn1
// TimeSpecification-time ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type TimeSpecification_time = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION TimeSpecification_time */ /* START_OF_SYMBOL_DEFINITION Period_days_bitDay */
// ### ASN.1 Definition:
//
// ```asn1
// Period-days-bitDay ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_days_bitDay = asn1.BitString

/* END_OF_SYMBOL_DEFINITION Period_days_bitDay */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Sunday */
const Period_days_bitDay_Sunday int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Sunday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Monday */
const Period_days_bitDay_Monday int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Monday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Tuesday */
const Period_days_bitDay_Tuesday int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Tuesday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Wednesday */
const Period_days_bitDay_Wednesday int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Wednesday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Thursday */
const Period_days_bitDay_Thursday int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Thursday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Friday */
const Period_days_bitDay_Friday int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Friday */

/* START_OF_SYMBOL_DEFINITION Period_days_bitDay_Saturday */
const Period_days_bitDay_Saturday int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_days_bitDay_Saturday */ /* START_OF_SYMBOL_DEFINITION Period_days */
// ### ASN.1 Definition:
//
// ```asn1
// Period-days ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_days = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Period_days */ /* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek */
// ### ASN.1 Definition:
//
// ```asn1
// Period-weeks-bitWeek ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_weeks_bitWeek = asn1.BitString

/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek */

/* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week1 */
const Period_weeks_bitWeek_Week1 int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week1 */

/* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week2 */
const Period_weeks_bitWeek_Week2 int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week2 */

/* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week3 */
const Period_weeks_bitWeek_Week3 int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week3 */

/* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week4 */
const Period_weeks_bitWeek_Week4 int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week4 */

/* START_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week5 */
const Period_weeks_bitWeek_Week5 int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_weeks_bitWeek_Week5 */ /* START_OF_SYMBOL_DEFINITION Period_weeks */
// ### ASN.1 Definition:
//
// ```asn1
// Period-weeks ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_weeks = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Period_weeks */ /* START_OF_SYMBOL_DEFINITION Period_months_bitMonth */
// ### ASN.1 Definition:
//
// ```asn1
// Period-months-bitMonth ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_months_bitMonth = asn1.BitString

/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_January */
const Period_months_bitMonth_January int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_January */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_February */
const Period_months_bitMonth_February int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_February */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_March */
const Period_months_bitMonth_March int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_March */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_April */
const Period_months_bitMonth_April int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_April */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_May */
const Period_months_bitMonth_May int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_May */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_June */
const Period_months_bitMonth_June int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_June */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_July */
const Period_months_bitMonth_July int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_July */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_August */
const Period_months_bitMonth_August int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_August */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_September */
const Period_months_bitMonth_September int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_September */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_October */
const Period_months_bitMonth_October int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_October */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_November */
const Period_months_bitMonth_November int32 = 10 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_November */

/* START_OF_SYMBOL_DEFINITION Period_months_bitMonth_December */
const Period_months_bitMonth_December int32 = 11 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION Period_months_bitMonth_December */ /* START_OF_SYMBOL_DEFINITION Period_months */
// ### ASN.1 Definition:
//
// ```asn1
// Period-months ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type Period_months = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Period_months */ /* START_OF_SYMBOL_DEFINITION NamedDay_intNamedDays */
// ### ASN.1 Definition:
//
// ```asn1
// NamedDay-intNamedDays ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type NamedDay_intNamedDays = int

const (
	NamedDay_intNamedDays_Sunday    NamedDay_intNamedDays = 1 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Monday    NamedDay_intNamedDays = 2 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Tuesday   NamedDay_intNamedDays = 3 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Wednesday NamedDay_intNamedDays = 4 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Thursday  NamedDay_intNamedDays = 5 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Friday    NamedDay_intNamedDays = 6 // LONG_NAMED_ENUMERATED_VALUE,
	NamedDay_intNamedDays_Saturday  NamedDay_intNamedDays = 7 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION NamedDay_intNamedDays */ /* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays */
// ### ASN.1 Definition:
//
// ```asn1
// NamedDay-bitNamedDays ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
// ```
type NamedDay_bitNamedDays = asn1.BitString

/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Sunday */
const NamedDay_bitNamedDays_Sunday int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Sunday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Monday */
const NamedDay_bitNamedDays_Monday int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Monday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Tuesday */
const NamedDay_bitNamedDays_Tuesday int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Tuesday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Wednesday */
const NamedDay_bitNamedDays_Wednesday int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Wednesday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Thursday */
const NamedDay_bitNamedDays_Thursday int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Thursday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Friday */
const NamedDay_bitNamedDays_Friday int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Friday */

/* START_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Saturday */
const NamedDay_bitNamedDays_Saturday int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION NamedDay_bitNamedDays_Saturday */ /* START_OF_SYMBOL_DEFINITION TimeAssertion_between */
// ### ASN.1 Definition:
//
// ```asn1
// TimeAssertion-between ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type TimeAssertion_between struct {
	StartTime time.Time `asn1:"explicit,tag:0"`
	EndTime   time.Time `asn1:"optional,explicit,tag:1"`
	Entirely  bool      `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION TimeAssertion_between */
