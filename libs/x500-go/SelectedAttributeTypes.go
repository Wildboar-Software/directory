package x500_go

import (
	"encoding/asn1"
	"time"
)

// # ASN.1 Definition:
//
//	UnboundedDirectoryString ::= CHOICE {
//	  teletexString    TeletexString(SIZE (1..MAX)),
//	  printableString  PrintableString(SIZE (1..MAX)),
//	  bmpString        BMPString(SIZE (1..MAX)),
//	  universalString  UniversalString(SIZE (1..MAX)),
//	  uTF8String       UTF8String(SIZE (1..MAX)) }
type UnboundedDirectoryString = asn1.RawValue

// # ASN.1 Definition:
//
//	DirectoryString{INTEGER:maxSize} ::= CHOICE {
//	  teletexString    TeletexString(SIZE (1..maxSize,...)),
//	  printableString  PrintableString(SIZE (1..maxSize,...)),
//	  bmpString        BMPString(SIZE (1..maxSize,...)),
//	  universalString  UniversalString(SIZE (1..maxSize,...)),
//	  uTF8String       UTF8String(SIZE (1..maxSize,...)) }
type DirectoryString = asn1.RawValue

// # ASN.1 Definition:
//
//	UniqueIdentifier ::= BIT STRING
type UniqueIdentifier = asn1.BitString

// # ASN.1 Definition:
//
//	UUIDPair ::= SEQUENCE {
//	  issuerUUID   UUID,
//	  subjectUUID  UUID,
//	  ... }
type UUIDPair struct {
	IssuerUUID  UUID
	SubjectUUID UUID
}

// # ASN.1 Definition:
//
//	UUID ::= OCTET STRING(SIZE (16))
type UUID = []byte

// # ASN.1 Definition:
//
//	URI ::= UTF8String
type URI = string // UTF8String
// # ASN.1 Definition:
//
//	DomainName ::= UTF8String (CONSTRAINED BY { -- Conforms to the format of a domain name. -- })
type DomainName = string // UTF8String
// # ASN.1 Definition:
//
//	IntEmail ::= UTF8String (CONSTRAINED BY { -- Conforms to the format of an (internationalized) email address. -- })
type IntEmail = string // UTF8String
// # ASN.1 Definition:
//
//	Jid ::= UTF8String (CONSTRAINED BY { /* Conforms to the format of a jabber identifier. */ })
type Jid = string // UTF8String
// # ASN.1 Definition:
//
//	CountryName ::= PrintableString(SIZE (2)) (CONSTRAINED BY { -- ISO 3166 alpha-2 codes only -- })
type CountryName = string

// # ASN.1 Definition:
//
//	CountryCode3c ::= PrintableString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 alpha-3 codes only -- })
type CountryCode3c = string

// # ASN.1 Definition:
//
//	CountryCode3n ::= NumericString(SIZE (3)) (CONSTRAINED BY { -- ISO 3166 numeric-3 codes only -- })
type CountryCode3n = string

// # ASN.1 Definition:
//
//	UtmCoordinates ::= SEQUENCE {
//	  zone      PrintableString,
//	  easting   NumericString,
//	  northing  NumericString }
type UtmCoordinates struct {
	Zone     string
	Easting  string
	Northing string
}

// # ASN.1 Definition:
//
//	Guide ::= SET {
//	  objectClass  [0]  OBJECT-CLASS.&id OPTIONAL,
//	  criteria     [1]  Criteria,
//	  ... }
type Guide struct {
	ObjectClass asn1.ObjectIdentifier `asn1:"optional,explicit,tag:0"`
	Criteria    Criteria              `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	Criteria ::= CHOICE {
//	  type  [0]  CriteriaItem,
//	  and   [1]  SET OF Criteria,
//	  or    [2]  SET OF Criteria,
//	  not   [3]  Criteria,
//	  ... }
type Criteria = asn1.RawValue

// # ASN.1 Definition:
//
//	CriteriaItem ::= CHOICE {
//	  equality          [0]  AttributeType,
//	  substrings        [1]  AttributeType,
//	  greaterOrEqual    [2]  AttributeType,
//	  lessOrEqual       [3]  AttributeType,
//	  approximateMatch  [4]  AttributeType,
//	  ... }
type CriteriaItem = asn1.RawValue

// # ASN.1 Definition:
//
//	EnhancedGuide ::= SEQUENCE {
//	  objectClass  [0]  OBJECT-CLASS.&id,
//	  criteria     [1]  Criteria,
//	  subset       [2]  INTEGER {
//	    baseObject   (0),
//	    oneLevel     (1),
//	    wholeSubtree (2)} DEFAULT oneLevel,
//	  ... }
type EnhancedGuide struct {
	ObjectClass asn1.ObjectIdentifier `asn1:"explicit,tag:0"`
	Criteria    Criteria              `asn1:"explicit,tag:1"`
	Subset      EnhancedGuide_subset  `asn1:"optional,explicit,tag:2,default:1"`
}

// # ASN.1 Definition:
//
//	PostalAddress ::= SEQUENCE SIZE (1..MAX) OF UnboundedDirectoryString
type PostalAddress = [](UnboundedDirectoryString)

// # ASN.1 Definition:
//
//	TelephoneNumber ::= PrintableString(SIZE (1..ub-telephone-number))
type TelephoneNumber = string

// # ASN.1 Definition:
//
//	ub-telephone-number INTEGER ::= 32
//
// const Ub_telephone_number int = 32
// # ASN.1 Definition:
//
//	TelexNumber ::= SEQUENCE {
//	  telexNumber  PrintableString(SIZE (1..ub-telex-number)),
//	  countryCode  PrintableString(SIZE (1..ub-country-code)),
//	  answerback   PrintableString(SIZE (1..ub-answerback)),
//	  ... }
type TelexNumber struct {
	TelexNumber string
	CountryCode string
	Answerback  string
}

// # ASN.1 Definition:
//
//	FacsimileTelephoneNumber ::= SEQUENCE {
//	  telephoneNumber  TelephoneNumber,
//	  parameters       G3FacsimileNonBasicParameters OPTIONAL,
//	  ... }
type FacsimileTelephoneNumber struct {
	TelephoneNumber TelephoneNumber
	Parameters      G3FacsimileNonBasicParameters `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	X121Address ::= NumericString(SIZE (1..ub-x121-address))
type X121Address = string

// # ASN.1 Definition:
//
// InternationalISDNNumber  ::=
//
//	NumericString(SIZE (1..ub-international-isdn-number))
type InternationalISDNNumber = string

// # ASN.1 Definition:
//
//	DestinationIndicator ::= PrintableString(SIZE (1..MAX))
type DestinationIndicator = string

// # ASN.1 Definition:
//
//	CommunicationsService ::= OBJECT IDENTIFIER
type CommunicationsService = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	CommunicationsNetwork ::= OBJECT IDENTIFIER
type CommunicationsNetwork = asn1.ObjectIdentifier

// # ASN.1 Definition:
//
//	PreferredDeliveryMethod ::= SEQUENCE OF INTEGER {
//	  any-delivery-method   (0),
//	  mhs-delivery          (1),
//	  physical-delivery     (2),
//	  telex-delivery        (3),
//	  teletex-delivery      (4),
//	  g3-facsimile-delivery (5),
//	  g4-facsimile-delivery (6),
//	  ia5-terminal-delivery (7),
//	  videotex-delivery     (8),
//	  telephone-delivery    (9) }
type PreferredDeliveryMethod = [](PreferredDeliveryMethod_Item)

// # ASN.1 Definition:
//
//	PresentationAddress ::= SEQUENCE {
//	  pSelector   [0]  OCTET STRING OPTIONAL,
//	  sSelector   [1]  OCTET STRING OPTIONAL,
//	  tSelector   [2]  OCTET STRING OPTIONAL,
//	  nAddresses  [3]  SET SIZE (1..MAX) OF OCTET STRING,
//	  ... }
type PresentationAddress struct {
	PSelector  []byte     `asn1:"optional,explicit,tag:0"`
	SSelector  []byte     `asn1:"optional,explicit,tag:1"`
	TSelector  []byte     `asn1:"optional,explicit,tag:2"`
	NAddresses []([]byte) `asn1:"explicit,tag:3,set"`
}

// # ASN.1 Definition:
//
//	ProtocolInformation ::= SEQUENCE {
//	  nAddress  OCTET STRING,
//	  profiles  SET OF OBJECT IDENTIFIER }
type ProtocolInformation struct {
	NAddress []byte
	Profiles [](asn1.ObjectIdentifier) `asn1:"set"`
}

// # ASN.1 Definition:
//
//	NameAndOptionalUID ::= SEQUENCE {
//	  dn   DistinguishedName,
//	  uid  UniqueIdentifier OPTIONAL,
//	  ... }
type NameAndOptionalUID struct {
	Dn  DistinguishedName
	Uid UniqueIdentifier `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	UiiFormat ::= SEQUENCE {
//	  baseObject  URI  OPTIONAL,
//	  subset      ENUMERATED {
//	    baseObject   (0),
//	    oneLevel     (1),
//	    wholeSubtree (2) } DEFAULT baseObject,
//	  next        CHOICE {
//	    length      INTEGER,
//	    filter      UiiFilter } }
type UiiFormat struct {
	BaseObject URI              `asn1:"optional"`
	Subset     UiiFormat_subset `asn1:"optional,default:0"`
	Next       UiiFormat_next
}

// # ASN.1 Definition:
//
//	UiiFilter ::= CHOICE {
//	  item  [0]  UiiItem,
//	  and   [1]  SET OF UiiFilter,
//	  or    [2]  SET OF UiiFilter,
//	  not   [3]  UiiFilter }
type UiiFilter = asn1.RawValue

// # ASN.1 Definition:
//
//	UiiItem ::= SEQUENCE {
//	  type   ATTRIBUTE.&id,
//	  length INTEGER OPTIONAL }
type UiiItem struct {
	Type   asn1.ObjectIdentifier
	Length int `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	EpcFormat ::= SEQUENCE {
//	  fields          SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//	    bits            INTEGER,
//	    charField       CHOICE {
//	      characters  [0] INTEGER,
//	      maxValue    [1] INTEGER },
//	    result          ENUMERATED {
//	      numericPad     (0),
//	      numeric        (1),
//	      alpha7bits     (2) } DEFAULT numericPad },
//	  digitShift  [0] INTEGER                        OPTIONAL,
//	  checkCalc   [1] INTEGER                        OPTIONAL,
//	  urnPrefix       UTF8String                     OPTIONAL }
type EpcFormat struct {
	Fields     [](EpcFormat_fields_Item)
	DigitShift int    `asn1:"optional,explicit,tag:0"`
	CheckCalc  int    `asn1:"optional,explicit,tag:1"`
	UrnPrefix  string `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	MultipleMatchingLocalities ::= SEQUENCE {
//	  matchingRuleUsed  MATCHING-RULE.&id OPTIONAL,
//	  attributeList     SEQUENCE OF AttributeValueAssertion,
//	  ... }
type MultipleMatchingLocalities struct {
	MatchingRuleUsed asn1.ObjectIdentifier `asn1:"optional"`
	AttributeList    [](AttributeValueAssertion)
}

// # ASN.1 Definition:
//
//	MRMappings ::= SEQUENCE OF MRMapping
type MRMappings = [](MRMapping)

// # ASN.1 Definition:
//
//	PwdResponse ::= SEQUENCE {
//	  warning CHOICE {
//	    timeleft        [0] INTEGER(0..MAX),
//	    graceRemaining  [1] INTEGER(0..MAX),
//	    ... } OPTIONAL,
//	  error ENUMERATED {
//	    passwordExpired  (0),
//	    changeAfterReset (1),
//	    ... } OPTIONAL}
type PwdResponse struct {
	Warning PwdResponse_warning `asn1:"optional"`
	Error   PwdResponse_error   `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	SubstringAssertion ::= SEQUENCE OF CHOICE {
//	  initial  [0]  UnboundedDirectoryString,
//	  any      [1]  UnboundedDirectoryString,
//	  final    [2]  UnboundedDirectoryString,
//	    -- at most one initial and one final component
//	  control       Attribute{{SupportedAttributes}},
//	    -- Used to specify interpretation of the following items
//	  ... }
type SubstringAssertion = [](SubstringAssertion_Item)

// # ASN.1 Definition:
//
//	CaseIgnoreList ::= SEQUENCE OF UnboundedDirectoryString
type CaseIgnoreList = [](UnboundedDirectoryString)

// # ASN.1 Definition:
//
//	OctetSubstringAssertion ::= SEQUENCE OF CHOICE {
//	  initial  [0]  OCTET STRING,
//	  any      [1]  OCTET STRING,
//	  final    [2]  OCTET STRING,
//	  ... }
type OctetSubstringAssertion = [](OctetSubstringAssertion_Item)

// # ASN.1 Definition:
//
//	SequenceMatchType ::= ENUMERATED {
//	  sequenceExact                  (0),
//	  sequenceDeletion               (1),
//	  sequenceRestrictedDeletion     (2),
//	  sequencePermutation            (3),
//	  sequencePermutationAndDeletion (4),
//	  sequenceProviderDefined        (5),
//	  ... }
type SequenceMatchType = asn1.Enumerated

const (
	SequenceMatchType_SequenceExact                  SequenceMatchType = 0
	SequenceMatchType_SequenceDeletion               SequenceMatchType = 1
	SequenceMatchType_SequenceRestrictedDeletion     SequenceMatchType = 2
	SequenceMatchType_SequencePermutation            SequenceMatchType = 3
	SequenceMatchType_SequencePermutationAndDeletion SequenceMatchType = 4
	SequenceMatchType_SequenceProviderDefined        SequenceMatchType = 5
)

// # ASN.1 Definition:
//
//	WordMatchTypes ::= ENUMERATED {
//	  wordExact           (0),
//	  wordTruncated       (1),
//	  wordPhonetic        (2),
//	  wordProviderDefined (3),
//	  ... }
type WordMatchTypes = asn1.Enumerated

const (
	WordMatchTypes_WordExact           WordMatchTypes = 0
	WordMatchTypes_WordTruncated       WordMatchTypes = 1
	WordMatchTypes_WordPhonetic        WordMatchTypes = 2
	WordMatchTypes_WordProviderDefined WordMatchTypes = 3
)

// # ASN.1 Definition:
//
//	CharacterMatchTypes ::= ENUMERATED {
//	  characterExact      (0),
//	  characterCaseIgnore (1),
//	  characterMapped     (2),
//	  ... }
type CharacterMatchTypes = asn1.Enumerated

const (
	CharacterMatchTypes_CharacterExact      CharacterMatchTypes = 0
	CharacterMatchTypes_CharacterCaseIgnore CharacterMatchTypes = 1
	CharacterMatchTypes_CharacterMapped     CharacterMatchTypes = 2
)

// # ASN.1 Definition:
//
//	ZonalSelect ::= SEQUENCE OF AttributeType
type ZonalSelect = [](AttributeType)

// # ASN.1 Definition:
//
//	ZonalResult ::= ENUMERATED {
//	  cannot-select-mapping (0),
//	  zero-mappings         (2),
//	  multiple-mappings     (3),
//	   ... }
type ZonalResult = asn1.Enumerated

const (
	ZonalResult_Cannot_select_mapping ZonalResult = 0
	ZonalResult_Zero_mappings         ZonalResult = 2
	ZonalResult_Multiple_mappings     ZonalResult = 3
)

// # ASN.1 Definition:
//
//	LanguageContextSyntax ::= PrintableString(SIZE (2..3))
type LanguageContextSyntax = string

// # ASN.1 Definition:
//
//	TimeSpecification ::= SEQUENCE {
//	  time           CHOICE {
//	    absolute       SEQUENCE {
//	      startTime [0]  GeneralizedTime OPTIONAL,
//	      endTime   [1]  GeneralizedTime OPTIONAL,
//	      ... },
//	    periodic      SET SIZE (1..MAX) OF Period},
//	  notThisTime   BOOLEAN DEFAULT FALSE,
//	  timeZone      TimeZone OPTIONAL,
//	  ... }
type TimeSpecification struct {
	Time        TimeSpecification_time
	NotThisTime bool     `asn1:"optional"`
	TimeZone    TimeZone `asn1:"optional"`
}

// # ASN.1 Definition:
//
//	Period ::= SEQUENCE {
//	  timesOfDay  [0]  SET SIZE (1..MAX) OF DayTimeBand OPTIONAL,
//	  days        [1]  CHOICE {
//	    intDay           SET OF INTEGER,
//	    bitDay           BIT STRING {
//	      sunday    (0),
//	      monday    (1),
//	      tuesday   (2),
//	      wednesday (3),
//	      thursday  (4),
//	      friday    (5),
//	      saturday  (6)},
//	    dayOf            XDayOf,
//	    ...} OPTIONAL,
//	  weeks       [2]  CHOICE {
//	    allWeeks         NULL,
//	    intWeek          SET OF INTEGER,
//	    bitWeek          BIT STRING {
//	      week1     (0),
//	      week2     (1),
//	      week3     (2),
//	      week4     (3),
//	      week5     (4)},
//	    ... } OPTIONAL,
//	  months      [3]  CHOICE {
//	    allMonths        NULL,
//	    intMonth         SET OF INTEGER,
//	    bitMonth         BIT STRING {
//	      january   (0),
//	      february  (1),
//	      march     (2),
//	      april     (3),
//	      may       (4),
//	      june      (5),
//	      july      (6),
//	      august    (7),
//	      september (8),
//	      october   (9),
//	      november  (10),
//	      december  (11)},
//	    ...} OPTIONAL,
//	  years       [4]  SET OF INTEGER(1000..MAX) OPTIONAL,
//	  ... }
type Period struct {
	TimesOfDay [](DayTimeBand) `asn1:"optional,explicit,tag:0,set"`
	Days       Period_days     `asn1:"optional,explicit,tag:1"`
	Weeks      Period_weeks    `asn1:"optional,explicit,tag:2"`
	Months     Period_months   `asn1:"optional,explicit,tag:3"`
	Years      [](int)         `asn1:"optional,explicit,tag:4,set"`
}

// # ASN.1 Definition:
//
//	XDayOf ::= CHOICE {
//	  first   [1]  NamedDay,
//	  second  [2]  NamedDay,
//	  third   [3]  NamedDay,
//	  fourth  [4]  NamedDay,
//	  fifth   [5]  NamedDay }
type XDayOf = asn1.RawValue

// # ASN.1 Definition:
//
//	NamedDay ::= CHOICE {
//	  intNamedDays ENUMERATED {
//	    sunday      (1),
//	    monday      (2),
//	    tuesday     (3),
//	    wednesday   (4),
//	    thursday    (5),
//	    friday      (6),
//	    saturday    (7)},
//	  bitNamedDays BIT STRING {
//	    sunday      (0),
//	    monday      (1),
//	    tuesday     (2),
//	    wednesday   (3),
//	    thursday    (4),
//	    friday      (5),
//	    saturday    (6)} }
type NamedDay = asn1.RawValue

// # ASN.1 Definition:
//
//	DayTimeBand ::= SEQUENCE {
//	  startDayTime  [0]  DayTime DEFAULT {hour 0},
//	  endDayTime    [1]  DayTime DEFAULT {hour 23, minute 59, second 59},
//	  ... }
type DayTimeBand struct {
	StartDayTime DayTime `asn1:"optional,explicit,tag:0"`
	EndDayTime   DayTime `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	DayTime ::= SEQUENCE {
//	  hour    [0]  INTEGER(0..23),
//	  minute  [1]  INTEGER(0..59) DEFAULT 0,
//	  second  [2]  INTEGER(0..59) DEFAULT 0,
//	  ... }
type DayTime struct {
	Hour   int `asn1:"explicit,tag:0"`
	Minute int `asn1:"optional,explicit,tag:1,default:0"`
	Second int `asn1:"optional,explicit,tag:2,default:0"`
}

// # ASN.1 Definition:
//
//	TimeZone ::= INTEGER(-12..12)
type TimeZone = int64

// # ASN.1 Definition:
//
//	TimeAssertion ::= CHOICE {
//	  now             NULL,
//	  at              GeneralizedTime,
//	  between         SEQUENCE {
//	    startTime  [0]  GeneralizedTime,
//	    endTime    [1]  GeneralizedTime OPTIONAL,
//	    entirely        BOOLEAN DEFAULT FALSE,
//	    ...},
//	  ... }
type TimeAssertion = asn1.RawValue

// # ASN.1 Definition:
//
//	LocaleContextSyntax ::= CHOICE {
//	  localeID1  OBJECT IDENTIFIER,
//	  localeID2  UnboundedDirectoryString,
//	  ... }
type LocaleContextSyntax = asn1.RawValue

// # ASN.1 Definition:
//
//	AttributeOptionList ::= SEQUENCE OF UTF8String
type AttributeOptionList = [](string)

// # ASN.1 Definition:
//
//	id-at-knowledgeInformation                OBJECT IDENTIFIER ::= {id-at 2}
var Id_at_knowledgeInformation asn1.ObjectIdentifier = []int{2, 5, 4, 2}

// # ASN.1 Definition:
//
//	id-at-commonName                          OBJECT IDENTIFIER ::= {id-at 3}
var Id_at_commonName asn1.ObjectIdentifier = []int{2, 5, 4, 3}

// # ASN.1 Definition:
//
//	id-at-surname                             OBJECT IDENTIFIER ::= {id-at 4}
var Id_at_surname asn1.ObjectIdentifier = []int{2, 5, 4, 4}

// # ASN.1 Definition:
//
//	id-at-serialNumber                        OBJECT IDENTIFIER ::= {id-at 5}
var Id_at_serialNumber asn1.ObjectIdentifier = []int{2, 5, 4, 5}

// # ASN.1 Definition:
//
//	id-at-countryName                         OBJECT IDENTIFIER ::= {id-at 6}
var Id_at_countryName asn1.ObjectIdentifier = []int{2, 5, 4, 6}

// # ASN.1 Definition:
//
//	id-at-localityName                        OBJECT IDENTIFIER ::= {id-at 7}
var Id_at_localityName asn1.ObjectIdentifier = []int{2, 5, 4, 7}

// # ASN.1 Definition:
//
//	id-at-collectiveLocalityName              OBJECT IDENTIFIER ::= {id-at 7 1}
var Id_at_collectiveLocalityName asn1.ObjectIdentifier = []int{2, 5, 4, 7, 1}

// # ASN.1 Definition:
//
//	id-at-stateOrProvinceName                 OBJECT IDENTIFIER ::= {id-at 8}
var Id_at_stateOrProvinceName asn1.ObjectIdentifier = []int{2, 5, 4, 8}

// # ASN.1 Definition:
//
//	id-at-collectiveStateOrProvinceName       OBJECT IDENTIFIER ::= {id-at 8 1}
var Id_at_collectiveStateOrProvinceName asn1.ObjectIdentifier = []int{2, 5, 4, 8, 1}

// # ASN.1 Definition:
//
//	id-at-streetAddress                       OBJECT IDENTIFIER ::= {id-at 9}
var Id_at_streetAddress asn1.ObjectIdentifier = []int{2, 5, 4, 9}

// # ASN.1 Definition:
//
//	id-at-collectiveStreetAddress             OBJECT IDENTIFIER ::= {id-at 9 1}
var Id_at_collectiveStreetAddress asn1.ObjectIdentifier = []int{2, 5, 4, 9, 1}

// # ASN.1 Definition:
//
//	id-at-organizationName                    OBJECT IDENTIFIER ::= {id-at 10}
var Id_at_organizationName asn1.ObjectIdentifier = []int{2, 5, 4, 10}

// # ASN.1 Definition:
//
//	id-at-collectiveOrganizationName          OBJECT IDENTIFIER ::= {id-at 10 1}
var Id_at_collectiveOrganizationName asn1.ObjectIdentifier = []int{2, 5, 4, 10, 1}

// # ASN.1 Definition:
//
//	id-at-organizationalUnitName              OBJECT IDENTIFIER ::= {id-at 11}
var Id_at_organizationalUnitName asn1.ObjectIdentifier = []int{2, 5, 4, 11}

// # ASN.1 Definition:
//
//	id-at-collectiveOrganizationalUnitName    OBJECT IDENTIFIER ::= {id-at 11 1}
var Id_at_collectiveOrganizationalUnitName asn1.ObjectIdentifier = []int{2, 5, 4, 11, 1}

// # ASN.1 Definition:
//
//	id-at-title                               OBJECT IDENTIFIER ::= {id-at 12}
var Id_at_title asn1.ObjectIdentifier = []int{2, 5, 4, 12}

// # ASN.1 Definition:
//
//	id-at-description                         OBJECT IDENTIFIER ::= {id-at 13}
var Id_at_description asn1.ObjectIdentifier = []int{2, 5, 4, 13}

// # ASN.1 Definition:
//
//	id-at-searchGuide                         OBJECT IDENTIFIER ::= {id-at 14}
var Id_at_searchGuide asn1.ObjectIdentifier = []int{2, 5, 4, 14}

// # ASN.1 Definition:
//
//	id-at-businessCategory                    OBJECT IDENTIFIER ::= {id-at 15}
var Id_at_businessCategory asn1.ObjectIdentifier = []int{2, 5, 4, 15}

// # ASN.1 Definition:
//
//	id-at-postalAddress                       OBJECT IDENTIFIER ::= {id-at 16}
var Id_at_postalAddress asn1.ObjectIdentifier = []int{2, 5, 4, 16}

// # ASN.1 Definition:
//
//	id-at-collectivePostalAddress             OBJECT IDENTIFIER ::= {id-at 16 1}
var Id_at_collectivePostalAddress asn1.ObjectIdentifier = []int{2, 5, 4, 16, 1}

// # ASN.1 Definition:
//
//	id-at-postalCode                          OBJECT IDENTIFIER ::= {id-at 17}
var Id_at_postalCode asn1.ObjectIdentifier = []int{2, 5, 4, 17}

// # ASN.1 Definition:
//
//	id-at-collectivePostalCode                OBJECT IDENTIFIER ::= {id-at 17 1}
var Id_at_collectivePostalCode asn1.ObjectIdentifier = []int{2, 5, 4, 17, 1}

// # ASN.1 Definition:
//
//	id-at-postOfficeBox                       OBJECT IDENTIFIER ::= {id-at 18}
var Id_at_postOfficeBox asn1.ObjectIdentifier = []int{2, 5, 4, 18}

// # ASN.1 Definition:
//
//	id-at-collectivePostOfficeBox             OBJECT IDENTIFIER ::= {id-at 18 1}
var Id_at_collectivePostOfficeBox asn1.ObjectIdentifier = []int{2, 5, 4, 18, 1}

// # ASN.1 Definition:
//
//	id-at-physicalDeliveryOfficeName          OBJECT IDENTIFIER ::= {id-at 19}
var Id_at_physicalDeliveryOfficeName asn1.ObjectIdentifier = []int{2, 5, 4, 19}

// # ASN.1 Definition:
//
//	  id-at-collectivePhysicalDeliveryOfficeName
//
//		OBJECT IDENTIFIER ::= {id-at 19 1}
var Id_at_collectivePhysicalDeliveryOfficeName asn1.ObjectIdentifier = []int{2, 5, 4, 19, 1}

// # ASN.1 Definition:
//
//	id-at-telephoneNumber                     OBJECT IDENTIFIER ::= {id-at 20}
var Id_at_telephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 20}

// # ASN.1 Definition:
//
//	id-at-collectiveTelephoneNumber           OBJECT IDENTIFIER ::= {id-at 20 1}
var Id_at_collectiveTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 20, 1}

// # ASN.1 Definition:
//
//	id-at-telexNumber                         OBJECT IDENTIFIER ::= {id-at 21}
var Id_at_telexNumber asn1.ObjectIdentifier = []int{2, 5, 4, 21}

// # ASN.1 Definition:
//
//	id-at-collectiveTelexNumber               OBJECT IDENTIFIER ::= {id-at 21 1}
var Id_at_collectiveTelexNumber asn1.ObjectIdentifier = []int{2, 5, 4, 21, 1}

// # ASN.1 Definition:
//
//	id-at-facsimileTelephoneNumber            OBJECT IDENTIFIER ::= {id-at 23}
var Id_at_facsimileTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 23}

// # ASN.1 Definition:
//
//	id-at-collectiveFacsimileTelephoneNumber  OBJECT IDENTIFIER ::= {id-at 23 1}
var Id_at_collectiveFacsimileTelephoneNumber asn1.ObjectIdentifier = []int{2, 5, 4, 23, 1}

// # ASN.1 Definition:
//
//	id-at-x121Address                         OBJECT IDENTIFIER ::= {id-at 24}
var Id_at_x121Address asn1.ObjectIdentifier = []int{2, 5, 4, 24}

// # ASN.1 Definition:
//
//	id-at-internationalISDNNumber             OBJECT IDENTIFIER ::= {id-at 25}
var Id_at_internationalISDNNumber asn1.ObjectIdentifier = []int{2, 5, 4, 25}

// # ASN.1 Definition:
//
//	id-at-collectiveInternationalISDNNumber   OBJECT IDENTIFIER ::= {id-at 25 1}
var Id_at_collectiveInternationalISDNNumber asn1.ObjectIdentifier = []int{2, 5, 4, 25, 1}

// # ASN.1 Definition:
//
//	id-at-registeredAddress                   OBJECT IDENTIFIER ::= {id-at 26}
var Id_at_registeredAddress asn1.ObjectIdentifier = []int{2, 5, 4, 26}

// # ASN.1 Definition:
//
//	id-at-destinationIndicator                OBJECT IDENTIFIER ::= {id-at 27}
var Id_at_destinationIndicator asn1.ObjectIdentifier = []int{2, 5, 4, 27}

// # ASN.1 Definition:
//
//	id-at-preferredDeliveryMethod             OBJECT IDENTIFIER ::= {id-at 28}
var Id_at_preferredDeliveryMethod asn1.ObjectIdentifier = []int{2, 5, 4, 28}

// # ASN.1 Definition:
//
//	id-at-presentationAddress                 OBJECT IDENTIFIER ::= {id-at 29}
var Id_at_presentationAddress asn1.ObjectIdentifier = []int{2, 5, 4, 29}

// # ASN.1 Definition:
//
//	id-at-supportedApplicationContext         OBJECT IDENTIFIER ::= {id-at 30}
var Id_at_supportedApplicationContext asn1.ObjectIdentifier = []int{2, 5, 4, 30}

// # ASN.1 Definition:
//
//	id-at-member                              OBJECT IDENTIFIER ::= {id-at 31}
var Id_at_member asn1.ObjectIdentifier = []int{2, 5, 4, 31}

// # ASN.1 Definition:
//
//	id-at-owner                               OBJECT IDENTIFIER ::= {id-at 32}
var Id_at_owner asn1.ObjectIdentifier = []int{2, 5, 4, 32}

// # ASN.1 Definition:
//
//	id-at-roleOccupant                        OBJECT IDENTIFIER ::= {id-at 33}
var Id_at_roleOccupant asn1.ObjectIdentifier = []int{2, 5, 4, 33}

// # ASN.1 Definition:
//
//	id-at-seeAlso                             OBJECT IDENTIFIER ::= {id-at 34}
var Id_at_seeAlso asn1.ObjectIdentifier = []int{2, 5, 4, 34}

// # ASN.1 Definition:
//
//	id-at-name                                OBJECT IDENTIFIER ::= {id-at 41}
var Id_at_name asn1.ObjectIdentifier = []int{2, 5, 4, 41}

// # ASN.1 Definition:
//
//	id-at-givenName                           OBJECT IDENTIFIER ::= {id-at 42}
var Id_at_givenName asn1.ObjectIdentifier = []int{2, 5, 4, 42}

// # ASN.1 Definition:
//
//	id-at-initials                            OBJECT IDENTIFIER ::= {id-at 43}
var Id_at_initials asn1.ObjectIdentifier = []int{2, 5, 4, 43}

// # ASN.1 Definition:
//
//	id-at-generationQualifier                 OBJECT IDENTIFIER ::= {id-at 44}
var Id_at_generationQualifier asn1.ObjectIdentifier = []int{2, 5, 4, 44}

// # ASN.1 Definition:
//
//	id-at-uniqueIdentifier                    OBJECT IDENTIFIER ::= {id-at 45}
var Id_at_uniqueIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 45}

// # ASN.1 Definition:
//
//	id-at-dnQualifier                         OBJECT IDENTIFIER ::= {id-at 46}
var Id_at_dnQualifier asn1.ObjectIdentifier = []int{2, 5, 4, 46}

// # ASN.1 Definition:
//
//	id-at-enhancedSearchGuide                 OBJECT IDENTIFIER ::= {id-at 47}
var Id_at_enhancedSearchGuide asn1.ObjectIdentifier = []int{2, 5, 4, 47}

// # ASN.1 Definition:
//
//	id-at-protocolInformation                 OBJECT IDENTIFIER ::= {id-at 48}
var Id_at_protocolInformation asn1.ObjectIdentifier = []int{2, 5, 4, 48}

// # ASN.1 Definition:
//
//	id-at-distinguishedName                   OBJECT IDENTIFIER ::= {id-at 49}
var Id_at_distinguishedName asn1.ObjectIdentifier = []int{2, 5, 4, 49}

// # ASN.1 Definition:
//
//	id-at-uniqueMember                        OBJECT IDENTIFIER ::= {id-at 50}
var Id_at_uniqueMember asn1.ObjectIdentifier = []int{2, 5, 4, 50}

// # ASN.1 Definition:
//
//	id-at-houseIdentifier                     OBJECT IDENTIFIER ::= {id-at 51}
var Id_at_houseIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 51}

// # ASN.1 Definition:
//
//	id-at-dmdName                             OBJECT IDENTIFIER ::= {id-at 54}
var Id_at_dmdName asn1.ObjectIdentifier = []int{2, 5, 4, 54}

// # ASN.1 Definition:
//
//	id-at-pseudonym                           OBJECT IDENTIFIER ::= {id-at 65}
var Id_at_pseudonym asn1.ObjectIdentifier = []int{2, 5, 4, 65}

// # ASN.1 Definition:
//
//	id-at-communicationsService               OBJECT IDENTIFIER ::= {id-at 66}
var Id_at_communicationsService asn1.ObjectIdentifier = []int{2, 5, 4, 66}

// # ASN.1 Definition:
//
//	id-at-communicationsNetwork               OBJECT IDENTIFIER ::= {id-at 67}
var Id_at_communicationsNetwork asn1.ObjectIdentifier = []int{2, 5, 4, 67}

// # ASN.1 Definition:
//
//	id-at-uuidpair                            OBJECT IDENTIFIER ::= {id-at 77}
var Id_at_uuidpair asn1.ObjectIdentifier = []int{2, 5, 4, 77}

// # ASN.1 Definition:
//
//	id-at-tagOid                              OBJECT IDENTIFIER ::= {id-at 78}
var Id_at_tagOid asn1.ObjectIdentifier = []int{2, 5, 4, 78}

// # ASN.1 Definition:
//
//	id-at-uiiFormat                           OBJECT IDENTIFIER ::= {id-at 79}
var Id_at_uiiFormat asn1.ObjectIdentifier = []int{2, 5, 4, 79}

// # ASN.1 Definition:
//
//	id-at-uiiInUrn                            OBJECT IDENTIFIER ::= {id-at 80}
var Id_at_uiiInUrn asn1.ObjectIdentifier = []int{2, 5, 4, 80}

// # ASN.1 Definition:
//
//	id-at-contentUrl                          OBJECT IDENTIFIER ::= {id-at 81}
var Id_at_contentUrl asn1.ObjectIdentifier = []int{2, 5, 4, 81}

// # ASN.1 Definition:
//
//	id-at-uri                                 OBJECT IDENTIFIER ::= {id-at 83}
var Id_at_uri asn1.ObjectIdentifier = []int{2, 5, 4, 83}

// # ASN.1 Definition:
//
//	id-at-urn                                 OBJECT IDENTIFIER ::= {id-at 86}
var Id_at_urn asn1.ObjectIdentifier = []int{2, 5, 4, 86}

// # ASN.1 Definition:
//
//	id-at-url                                 OBJECT IDENTIFIER ::= {id-at 87}
var Id_at_url asn1.ObjectIdentifier = []int{2, 5, 4, 87}

// # ASN.1 Definition:
//
//	id-at-utmCoordinates                      OBJECT IDENTIFIER ::= {id-at 88}
var Id_at_utmCoordinates asn1.ObjectIdentifier = []int{2, 5, 4, 88}

// # ASN.1 Definition:
//
//	id-at-urnC                                OBJECT IDENTIFIER ::= {id-at 89}
var Id_at_urnC asn1.ObjectIdentifier = []int{2, 5, 4, 89}

// # ASN.1 Definition:
//
//	id-at-uii                                 OBJECT IDENTIFIER ::= {id-at 90}
var Id_at_uii asn1.ObjectIdentifier = []int{2, 5, 4, 90}

// # ASN.1 Definition:
//
//	id-at-epc                                 OBJECT IDENTIFIER ::= {id-at 91}
var Id_at_epc asn1.ObjectIdentifier = []int{2, 5, 4, 91}

// # ASN.1 Definition:
//
//	id-at-tagAfi                              OBJECT IDENTIFIER ::= {id-at 92}
var Id_at_tagAfi asn1.ObjectIdentifier = []int{2, 5, 4, 92}

// # ASN.1 Definition:
//
//	id-at-epcFormat                           OBJECT IDENTIFIER ::= {id-at 93}
var Id_at_epcFormat asn1.ObjectIdentifier = []int{2, 5, 4, 93}

// # ASN.1 Definition:
//
//	id-at-epcInUrn                            OBJECT IDENTIFIER ::= {id-at 94}
var Id_at_epcInUrn asn1.ObjectIdentifier = []int{2, 5, 4, 94}

// # ASN.1 Definition:
//
//	id-at-ldapUrl                             OBJECT IDENTIFIER ::= {id-at 95}
var Id_at_ldapUrl asn1.ObjectIdentifier = []int{2, 5, 4, 95}

// # ASN.1 Definition:
//
//	id-at-tagLocation                         OBJECT IDENTIFIER ::= {id-at 96}
var Id_at_tagLocation asn1.ObjectIdentifier = []int{2, 5, 4, 96}

// # ASN.1 Definition:
//
//	id-at-organizationIdentifier              OBJECT IDENTIFIER ::= {id-at 97}
var Id_at_organizationIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 97}

// # ASN.1 Definition:
//
//	id-at-countryCode3c                       OBJECT IDENTIFIER ::= {id-at 98}
var Id_at_countryCode3c asn1.ObjectIdentifier = []int{2, 5, 4, 98}

// # ASN.1 Definition:
//
//	id-at-countryCode3n                       OBJECT IDENTIFIER ::= {id-at 99}
var Id_at_countryCode3n asn1.ObjectIdentifier = []int{2, 5, 4, 99}

// # ASN.1 Definition:
//
//	id-at-dnsName                             OBJECT IDENTIFIER ::= {id-at 100}
var Id_at_dnsName asn1.ObjectIdentifier = []int{2, 5, 4, 100}

// # ASN.1 Definition:
//
//	id-at-intEmail                            OBJECT IDENTIFIER ::= {id-at 104}
var Id_at_intEmail asn1.ObjectIdentifier = []int{2, 5, 4, 104}

// # ASN.1 Definition:
//
//	id-at-jid                                 OBJECT IDENTIFIER ::= {id-at 105}
var Id_at_jid asn1.ObjectIdentifier = []int{2, 5, 4, 105}

// # ASN.1 Definition:
//
//	id-at-objectIdentifier                    OBJECT IDENTIFIER ::= {id-at 106}
var Id_at_objectIdentifier asn1.ObjectIdentifier = []int{2, 5, 4, 106}

// # ASN.1 Definition:
//
//	id-asx-utmCoords                          OBJECT IDENTIFIER ::= {id-asx 4}
var Id_asx_utmCoords asn1.ObjectIdentifier = []int{2, 5, 40, 4}

// # ASN.1 Definition:
//
//	id-asx-uiiForm                            OBJECT IDENTIFIER ::= {id-asx 5}
var Id_asx_uiiForm asn1.ObjectIdentifier = []int{2, 5, 40, 5}

// # ASN.1 Definition:
//
//	id-asx-epcForm                            OBJECT IDENTIFIER ::= {id-asx 6}
var Id_asx_epcForm asn1.ObjectIdentifier = []int{2, 5, 40, 6}

// # ASN.1 Definition:
//
//	id-asx-countryString3c                    OBJECT IDENTIFIER ::= {id-asx 7}
var Id_asx_countryString3c asn1.ObjectIdentifier = []int{2, 5, 40, 7}

// # ASN.1 Definition:
//
//	id-asx-countryString3n                    OBJECT IDENTIFIER ::= {id-asx 8}
var Id_asx_countryString3n asn1.ObjectIdentifier = []int{2, 5, 40, 8}

// # ASN.1 Definition:
//
//	id-asx-dnsString                          OBJECT IDENTIFIER ::= {id-asx 9}
var Id_asx_dnsString asn1.ObjectIdentifier = []int{2, 5, 40, 9}

// # ASN.1 Definition:
//
//	id-asx-intEmailString                     OBJECT IDENTIFIER ::= {id-asx 11}
var Id_asx_intEmailString asn1.ObjectIdentifier = []int{2, 5, 40, 11}

// # ASN.1 Definition:
//
//	id-asx-jidString                          OBJECT IDENTIFIER ::= {id-asx 12}
var Id_asx_jidString asn1.ObjectIdentifier = []int{2, 5, 40, 12}

// # ASN.1 Definition:
//
//	id-lsx-attributeTypeDescription           OBJECT IDENTIFIER ::= {id-lsx 3}
var Id_lsx_attributeTypeDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 3}

// # ASN.1 Definition:
//
//	id-lsx-bitString                          OBJECT IDENTIFIER ::= {id-lsx 6}
var Id_lsx_bitString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 6}

// # ASN.1 Definition:
//
//	id-lsx-boolean                            OBJECT IDENTIFIER ::= {id-lsx 7}
var Id_lsx_boolean asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 7}

// # ASN.1 Definition:
//
//	id-lsx-countryString                      OBJECT IDENTIFIER ::= {id-lsx 11}
var Id_lsx_countryString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 11}

// # ASN.1 Definition:
//
//	id-lsx-dn                                 OBJECT IDENTIFIER ::= {id-lsx 12}
var Id_lsx_dn asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 12}

// # ASN.1 Definition:
//
//	id-lsx-deliveryMethod                     OBJECT IDENTIFIER ::= {id-lsx 14}
var Id_lsx_deliveryMethod asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 14}

// # ASN.1 Definition:
//
//	id-lsx-directoryString                    OBJECT IDENTIFIER ::= {id-lsx 15}
var Id_lsx_directoryString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 15}

// # ASN.1 Definition:
//
//	id-lsx-dITContentRuleDescription          OBJECT IDENTIFIER ::= {id-lsx 16}
var Id_lsx_dITContentRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 16}

// # ASN.1 Definition:
//
//	id-lsx-dITStructureRuleDescription        OBJECT IDENTIFIER ::= {id-lsx 17}
var Id_lsx_dITStructureRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 17}

// # ASN.1 Definition:
//
//	id-lsx-enhancedGuide                      OBJECT IDENTIFIER ::= {id-lsx 21}
var Id_lsx_enhancedGuide asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 21}

// # ASN.1 Definition:
//
//	id-lsx-facsimileTelephoneNr               OBJECT IDENTIFIER ::= {id-lsx 22}
var Id_lsx_facsimileTelephoneNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 22}

// # ASN.1 Definition:
//
//	id-lsx-fax                                OBJECT IDENTIFIER ::= {id-lsx 23}
var Id_lsx_fax asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 23}

// # ASN.1 Definition:
//
//	id-lsx-generalizedTime                    OBJECT IDENTIFIER ::= {id-lsx 24}
var Id_lsx_generalizedTime asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 24}

// # ASN.1 Definition:
//
//	id-lsx-guide                              OBJECT IDENTIFIER ::= {id-lsx 25}
var Id_lsx_guide asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 25}

// # ASN.1 Definition:
//
//	id-lsx-ia5String                          OBJECT IDENTIFIER ::= {id-lsx 26}
var Id_lsx_ia5String asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 26}

// # ASN.1 Definition:
//
//	id-lsx-integer                            OBJECT IDENTIFIER ::= {id-lsx 27}
var Id_lsx_integer asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 27}

// # ASN.1 Definition:
//
//	id-lsx-jpeg                               OBJECT IDENTIFIER ::= {id-lsx 28}
var Id_lsx_jpeg asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 28}

// # ASN.1 Definition:
//
//	id-lsx-matchingRuleDescription            OBJECT IDENTIFIER ::= {id-lsx 30}
var Id_lsx_matchingRuleDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 30}

// # ASN.1 Definition:
//
//	id-lsx-matchingRuleUseDescription         OBJECT IDENTIFIER ::= {id-lsx 31}
var Id_lsx_matchingRuleUseDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 31}

// # ASN.1 Definition:
//
//	id-lsx-nameAndOptionalUID                 OBJECT IDENTIFIER ::= {id-lsx 34}
var Id_lsx_nameAndOptionalUID asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 34}

// # ASN.1 Definition:
//
//	id-lsx-nameFormDescription                OBJECT IDENTIFIER ::= {id-lsx 35}
var Id_lsx_nameFormDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 35}

// # ASN.1 Definition:
//
//	id-lsx-numericString                      OBJECT IDENTIFIER ::= {id-lsx 36}
var Id_lsx_numericString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 36}

// # ASN.1 Definition:
//
//	id-lsx-objectClassDescription             OBJECT IDENTIFIER ::= {id-lsx 37}
var Id_lsx_objectClassDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 37}

// # ASN.1 Definition:
//
//	id-lsx-oid                                OBJECT IDENTIFIER ::= {id-lsx 38}
var Id_lsx_oid asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 38}

// # ASN.1 Definition:
//
//	id-lsx-otherMailbox                       OBJECT IDENTIFIER ::= {id-lsx 39}
var Id_lsx_otherMailbox asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 39}

// # ASN.1 Definition:
//
//	id-lsx-octetString                        OBJECT IDENTIFIER ::= {id-lsx 40}
var Id_lsx_octetString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 40}

// # ASN.1 Definition:
//
//	id-lsx-postalAddr                         OBJECT IDENTIFIER ::= {id-lsx 41}
var Id_lsx_postalAddr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 41}

// # ASN.1 Definition:
//
//	id-lsx-presentationAddr                   OBJECT IDENTIFIER ::= {id-lsx 43}
var Id_lsx_presentationAddr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 43}

// # ASN.1 Definition:
//
//	id-lsx-printableString                    OBJECT IDENTIFIER ::= {id-lsx 44}
var Id_lsx_printableString asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 44}

// # ASN.1 Definition:
//
//	id-lsx-subtreeSpec                        OBJECT IDENTIFIER ::= {id-lsx 45}
var Id_lsx_subtreeSpec asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 45}

// # ASN.1 Definition:
//
//	id-lsx-telephoneNr                        OBJECT IDENTIFIER ::= {id-lsx 50}
var Id_lsx_telephoneNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 50}

// # ASN.1 Definition:
//
//	id-lsx-telexNr                            OBJECT IDENTIFIER ::= {id-lsx 52}
var Id_lsx_telexNr asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 52}

// # ASN.1 Definition:
//
//	id-lsx-utcTime                            OBJECT IDENTIFIER ::= {id-lsx 53}
var Id_lsx_utcTime asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 53}

// # ASN.1 Definition:
//
//	id-lsx-ldapSyntaxDescription              OBJECT IDENTIFIER ::= {id-lsx 54}
var Id_lsx_ldapSyntaxDescription asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 54}

// # ASN.1 Definition:
//
//	id-lsx-substringAssertion                 OBJECT IDENTIFIER ::= {id-lsx 58}
var Id_lsx_substringAssertion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 58}

// # ASN.1 Definition:
//
//	id-oidC1                                  OBJECT IDENTIFIER ::= {id 0}
var Id_oidC1 asn1.ObjectIdentifier = []int{2, 17, 1, 2, 0}

// # ASN.1 Definition:
//
//	id-oidC2                                  OBJECT IDENTIFIER ::= {id 1}
var Id_oidC2 asn1.ObjectIdentifier = []int{2, 17, 1, 2, 1}

// # ASN.1 Definition:
//
//	id-oidC                                   OBJECT IDENTIFIER ::= {id 2}
var Id_oidC asn1.ObjectIdentifier = []int{2, 17, 1, 2, 2}

// # ASN.1 Definition:
//
//	id-cat-sequenceMatchType                  OBJECT IDENTIFIER ::= {id-cat 1}
var Id_cat_sequenceMatchType asn1.ObjectIdentifier = []int{2, 5, 37, 1}

// # ASN.1 Definition:
//
//	id-cat-wordMatchType                      OBJECT IDENTIFIER ::= {id-cat 2}
var Id_cat_wordMatchType asn1.ObjectIdentifier = []int{2, 5, 37, 2}

// # ASN.1 Definition:
//
//	id-cat-characterMatchTypes                OBJECT IDENTIFIER ::= {id-cat 3}
var Id_cat_characterMatchTypes asn1.ObjectIdentifier = []int{2, 5, 37, 3}

// # ASN.1 Definition:
//
//	id-cat-selectedContexts                   OBJECT IDENTIFIER ::= {id-cat 4}
var Id_cat_selectedContexts asn1.ObjectIdentifier = []int{2, 5, 37, 4}

// # ASN.1 Definition:
//
//	id-not-dSAProblem                         OBJECT IDENTIFIER ::= {id-not 0}
var Id_not_dSAProblem asn1.ObjectIdentifier = []int{2, 5, 35, 0}

// # ASN.1 Definition:
//
//	id-not-searchServiceProblem               OBJECT IDENTIFIER ::= {id-not 1}
var Id_not_searchServiceProblem asn1.ObjectIdentifier = []int{2, 5, 35, 1}

// # ASN.1 Definition:
//
//	id-not-serviceType                        OBJECT IDENTIFIER ::= {id-not 2}
var Id_not_serviceType asn1.ObjectIdentifier = []int{2, 5, 35, 2}

// # ASN.1 Definition:
//
//	id-not-attributeTypeList                  OBJECT IDENTIFIER ::= {id-not 3}
var Id_not_attributeTypeList asn1.ObjectIdentifier = []int{2, 5, 35, 3}

// # ASN.1 Definition:
//
//	id-not-matchingRuleList                   OBJECT IDENTIFIER ::= {id-not 4}
var Id_not_matchingRuleList asn1.ObjectIdentifier = []int{2, 5, 35, 4}

// # ASN.1 Definition:
//
//	id-not-filterItem                         OBJECT IDENTIFIER ::= {id-not 5}
var Id_not_filterItem asn1.ObjectIdentifier = []int{2, 5, 35, 5}

// # ASN.1 Definition:
//
//	id-not-attributeCombinations              OBJECT IDENTIFIER ::= {id-not 6}
var Id_not_attributeCombinations asn1.ObjectIdentifier = []int{2, 5, 35, 6}

// # ASN.1 Definition:
//
//	id-not-contextTypeList                    OBJECT IDENTIFIER ::= {id-not 7}
var Id_not_contextTypeList asn1.ObjectIdentifier = []int{2, 5, 35, 7}

// # ASN.1 Definition:
//
//	id-not-contextList                        OBJECT IDENTIFIER ::= {id-not 8}
var Id_not_contextList asn1.ObjectIdentifier = []int{2, 5, 35, 8}

// # ASN.1 Definition:
//
//	id-not-contextCombinations                OBJECT IDENTIFIER ::= {id-not 9}
var Id_not_contextCombinations asn1.ObjectIdentifier = []int{2, 5, 35, 9}

// # ASN.1 Definition:
//
//	id-not-hierarchySelectList                OBJECT IDENTIFIER ::= {id-not 10}
var Id_not_hierarchySelectList asn1.ObjectIdentifier = []int{2, 5, 35, 10}

// # ASN.1 Definition:
//
//	id-not-searchControlOptionsList           OBJECT IDENTIFIER ::= {id-not 11}
var Id_not_searchControlOptionsList asn1.ObjectIdentifier = []int{2, 5, 35, 11}

// # ASN.1 Definition:
//
//	id-not-serviceControlOptionsList          OBJECT IDENTIFIER ::= {id-not 12}
var Id_not_serviceControlOptionsList asn1.ObjectIdentifier = []int{2, 5, 35, 12}

// # ASN.1 Definition:
//
//	id-not-multipleMatchingLocalities         OBJECT IDENTIFIER ::= {id-not 13}
var Id_not_multipleMatchingLocalities asn1.ObjectIdentifier = []int{2, 5, 35, 13}

// # ASN.1 Definition:
//
//	id-not-proposedRelaxation                 OBJECT IDENTIFIER ::= {id-not 14}
var Id_not_proposedRelaxation asn1.ObjectIdentifier = []int{2, 5, 35, 14}

// # ASN.1 Definition:
//
//	id-not-appliedRelaxation                  OBJECT IDENTIFIER ::= {id-not 15}
var Id_not_appliedRelaxation asn1.ObjectIdentifier = []int{2, 5, 35, 15}

// # ASN.1 Definition:
//
//	id-not-pwdResponse                        OBJECT IDENTIFIER ::= {id-not 16}
var Id_not_pwdResponse asn1.ObjectIdentifier = []int{2, 5, 35, 16}

// # ASN.1 Definition:
//
//	id-not-ldapDiagnosticMsg                  OBJECT IDENTIFIER ::= {id-not 17}
var Id_not_ldapDiagnosticMsg asn1.ObjectIdentifier = []int{2, 5, 35, 17}

// # ASN.1 Definition:
//
//	id-pr-targetDsaUnavailable                OBJECT IDENTIFIER ::= {id-pr 1}
var Id_pr_targetDsaUnavailable asn1.ObjectIdentifier = []int{2, 5, 34, 1}

// # ASN.1 Definition:
//
//	id-pr-dataSourceUnavailable               OBJECT IDENTIFIER ::= {id-pr 2}
var Id_pr_dataSourceUnavailable asn1.ObjectIdentifier = []int{2, 5, 34, 2}

// # ASN.1 Definition:
//
//	id-pr-unidentifiedOperation               OBJECT IDENTIFIER ::= {id-pr 3}
var Id_pr_unidentifiedOperation asn1.ObjectIdentifier = []int{2, 5, 34, 3}

// # ASN.1 Definition:
//
//	id-pr-unavailableOperation                OBJECT IDENTIFIER ::= {id-pr 4}
var Id_pr_unavailableOperation asn1.ObjectIdentifier = []int{2, 5, 34, 4}

// # ASN.1 Definition:
//
//	id-pr-searchAttributeViolation            OBJECT IDENTIFIER ::= {id-pr 5}
var Id_pr_searchAttributeViolation asn1.ObjectIdentifier = []int{2, 5, 34, 5}

// # ASN.1 Definition:
//
//	id-pr-searchAttributeCombinationViolation OBJECT IDENTIFIER ::= {id-pr 6}
var Id_pr_searchAttributeCombinationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 6}

// # ASN.1 Definition:
//
//	id-pr-searchValueNotAllowed               OBJECT IDENTIFIER ::= {id-pr 7}
var Id_pr_searchValueNotAllowed asn1.ObjectIdentifier = []int{2, 5, 34, 7}

// # ASN.1 Definition:
//
//	id-pr-missingSearchAttribute              OBJECT IDENTIFIER ::= {id-pr 8}
var Id_pr_missingSearchAttribute asn1.ObjectIdentifier = []int{2, 5, 34, 8}

// # ASN.1 Definition:
//
//	id-pr-searchValueViolation                OBJECT IDENTIFIER ::= {id-pr 9}
var Id_pr_searchValueViolation asn1.ObjectIdentifier = []int{2, 5, 34, 9}

// # ASN.1 Definition:
//
//	id-pr-attributeNegationViolation          OBJECT IDENTIFIER ::= {id-pr 10}
var Id_pr_attributeNegationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 10}

// # ASN.1 Definition:
//
//	id-pr-searchValueRequired                 OBJECT IDENTIFIER ::= {id-pr 11}
var Id_pr_searchValueRequired asn1.ObjectIdentifier = []int{2, 5, 34, 11}

// # ASN.1 Definition:
//
//	id-pr-invalidSearchValue                  OBJECT IDENTIFIER ::= {id-pr 12}
var Id_pr_invalidSearchValue asn1.ObjectIdentifier = []int{2, 5, 34, 12}

// # ASN.1 Definition:
//
//	id-pr-searchContextViolation              OBJECT IDENTIFIER ::= {id-pr 13}
var Id_pr_searchContextViolation asn1.ObjectIdentifier = []int{2, 5, 34, 13}

// # ASN.1 Definition:
//
//	id-pr-searchContextCombinationViolation   OBJECT IDENTIFIER ::= {id-pr 14}
var Id_pr_searchContextCombinationViolation asn1.ObjectIdentifier = []int{2, 5, 34, 14}

// # ASN.1 Definition:
//
//	id-pr-missingSearchContext                OBJECT IDENTIFIER ::= {id-pr 15}
var Id_pr_missingSearchContext asn1.ObjectIdentifier = []int{2, 5, 34, 15}

// # ASN.1 Definition:
//
//	id-pr-searchContextValueViolation         OBJECT IDENTIFIER ::= {id-pr 16}
var Id_pr_searchContextValueViolation asn1.ObjectIdentifier = []int{2, 5, 34, 16}

// # ASN.1 Definition:
//
//	id-pr-searchContextValueRequired          OBJECT IDENTIFIER ::= {id-pr 17}
var Id_pr_searchContextValueRequired asn1.ObjectIdentifier = []int{2, 5, 34, 17}

// # ASN.1 Definition:
//
//	id-pr-invalidContextSearchValue           OBJECT IDENTIFIER ::= {id-pr 18}
var Id_pr_invalidContextSearchValue asn1.ObjectIdentifier = []int{2, 5, 34, 18}

// # ASN.1 Definition:
//
//	id-pr-unsupportedMatchingRule             OBJECT IDENTIFIER ::= {id-pr 19}
var Id_pr_unsupportedMatchingRule asn1.ObjectIdentifier = []int{2, 5, 34, 19}

// # ASN.1 Definition:
//
//	id-pr-attributeMatchingViolation          OBJECT IDENTIFIER ::= {id-pr 20}
var Id_pr_attributeMatchingViolation asn1.ObjectIdentifier = []int{2, 5, 34, 20}

// # ASN.1 Definition:
//
//	id-pr-unsupportedMatchingUse              OBJECT IDENTIFIER ::= {id-pr 21}
var Id_pr_unsupportedMatchingUse asn1.ObjectIdentifier = []int{2, 5, 34, 21}

// # ASN.1 Definition:
//
//	id-pr-matchingUseViolation                OBJECT IDENTIFIER ::= {id-pr 22}
var Id_pr_matchingUseViolation asn1.ObjectIdentifier = []int{2, 5, 34, 22}

// # ASN.1 Definition:
//
//	id-pr-hierarchySelectForbidden            OBJECT IDENTIFIER ::= {id-pr 23}
var Id_pr_hierarchySelectForbidden asn1.ObjectIdentifier = []int{2, 5, 34, 23}

// # ASN.1 Definition:
//
//	id-pr-invalidHierarchySelect              OBJECT IDENTIFIER ::= {id-pr 24}
var Id_pr_invalidHierarchySelect asn1.ObjectIdentifier = []int{2, 5, 34, 24}

// # ASN.1 Definition:
//
//	id-pr-unavailableHierarchySelect          OBJECT IDENTIFIER ::= {id-pr 25}
var Id_pr_unavailableHierarchySelect asn1.ObjectIdentifier = []int{2, 5, 34, 25}

// # ASN.1 Definition:
//
//	id-pr-invalidSearchControlOptions         OBJECT IDENTIFIER ::= {id-pr 26}
var Id_pr_invalidSearchControlOptions asn1.ObjectIdentifier = []int{2, 5, 34, 26}

// # ASN.1 Definition:
//
//	id-pr-invalidServiceControlOptions        OBJECT IDENTIFIER ::= {id-pr 27}
var Id_pr_invalidServiceControlOptions asn1.ObjectIdentifier = []int{2, 5, 34, 27}

// # ASN.1 Definition:
//
//	id-pr-searchSubsetViolation               OBJECT IDENTIFIER ::= {id-pr 28}
var Id_pr_searchSubsetViolation asn1.ObjectIdentifier = []int{2, 5, 34, 28}

// # ASN.1 Definition:
//
//	id-pr-unmatchedKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 29}
var Id_pr_unmatchedKeyAttributes asn1.ObjectIdentifier = []int{2, 5, 34, 29}

// # ASN.1 Definition:
//
//	id-pr-ambiguousKeyAttributes              OBJECT IDENTIFIER ::= {id-pr 30}
var Id_pr_ambiguousKeyAttributes asn1.ObjectIdentifier = []int{2, 5, 34, 30}

// # ASN.1 Definition:
//
//	id-pr-unavailableRelaxationLevel          OBJECT IDENTIFIER ::= {id-pr 31}
var Id_pr_unavailableRelaxationLevel asn1.ObjectIdentifier = []int{2, 5, 34, 31}

// # ASN.1 Definition:
//
//	id-pr-emptyHierarchySelection             OBJECT IDENTIFIER ::= {id-pr 32}
var Id_pr_emptyHierarchySelection asn1.ObjectIdentifier = []int{2, 5, 34, 32}

// # ASN.1 Definition:
//
//	id-pr-administratorImposedLimit           OBJECT IDENTIFIER ::= {id-pr 33}
var Id_pr_administratorImposedLimit asn1.ObjectIdentifier = []int{2, 5, 34, 33}

// # ASN.1 Definition:
//
//	id-pr-permanentRestriction                OBJECT IDENTIFIER ::= {id-pr 34}
var Id_pr_permanentRestriction asn1.ObjectIdentifier = []int{2, 5, 34, 34}

// # ASN.1 Definition:
//
//	id-pr-temporaryRestriction                OBJECT IDENTIFIER ::= {id-pr 35}
var Id_pr_temporaryRestriction asn1.ObjectIdentifier = []int{2, 5, 34, 35}

// # ASN.1 Definition:
//
//	id-pr-relaxationNotSupported              OBJECT IDENTIFIER ::= {id-pr 36}
var Id_pr_relaxationNotSupported asn1.ObjectIdentifier = []int{2, 5, 34, 36}

// # ASN.1 Definition:
//
//	id-coat-uid                               OBJECT IDENTIFIER ::= {id-coat 1}
var Id_coat_uid asn1.ObjectIdentifier = []int{0, 9, 2342, 19200300, 100, 1, 1}

// # ASN.1 Definition:
//
//	id-coat-dc                                OBJECT IDENTIFIER ::= {id-coat 25}
var Id_coat_dc asn1.ObjectIdentifier = []int{0, 9, 2342, 19200300, 100, 1, 25}

// # ASN.1 Definition:
//
//	id-mr-caseIgnoreMatch                     OBJECT IDENTIFIER ::= {id-mr 2}
var Id_mr_caseIgnoreMatch asn1.ObjectIdentifier = []int{2, 5, 13, 2}

// # ASN.1 Definition:
//
//	id-mr-caseIgnoreOrderingMatch             OBJECT IDENTIFIER ::= {id-mr 3}
var Id_mr_caseIgnoreOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 3}

// # ASN.1 Definition:
//
//	id-mr-caseIgnoreSubstringsMatch           OBJECT IDENTIFIER ::= {id-mr 4}
var Id_mr_caseIgnoreSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 4}

// # ASN.1 Definition:
//
//	id-mr-caseExactMatch                      OBJECT IDENTIFIER ::= {id-mr 5}
var Id_mr_caseExactMatch asn1.ObjectIdentifier = []int{2, 5, 13, 5}

// # ASN.1 Definition:
//
//	id-mr-caseExactOrderingMatch              OBJECT IDENTIFIER ::= {id-mr 6}
var Id_mr_caseExactOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 6}

// # ASN.1 Definition:
//
//	id-mr-caseExactSubstringsMatch            OBJECT IDENTIFIER ::= {id-mr 7}
var Id_mr_caseExactSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 7}

// # ASN.1 Definition:
//
//	id-mr-numericStringMatch                  OBJECT IDENTIFIER ::= {id-mr 8}
var Id_mr_numericStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 8}

// # ASN.1 Definition:
//
//	id-mr-numericStringOrderingMatch          OBJECT IDENTIFIER ::= {id-mr 9}
var Id_mr_numericStringOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 9}

// # ASN.1 Definition:
//
//	id-mr-numericStringSubstringsMatch        OBJECT IDENTIFIER ::= {id-mr 10}
var Id_mr_numericStringSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 10}

// # ASN.1 Definition:
//
//	id-mr-caseIgnoreListMatch                 OBJECT IDENTIFIER ::= {id-mr 11}
var Id_mr_caseIgnoreListMatch asn1.ObjectIdentifier = []int{2, 5, 13, 11}

// # ASN.1 Definition:
//
//	id-mr-caseIgnoreListSubstringsMatch       OBJECT IDENTIFIER ::= {id-mr 12}
var Id_mr_caseIgnoreListSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 12}

// # ASN.1 Definition:
//
//	id-mr-booleanMatch                        OBJECT IDENTIFIER ::= {id-mr 13}
var Id_mr_booleanMatch asn1.ObjectIdentifier = []int{2, 5, 13, 13}

// # ASN.1 Definition:
//
//	id-mr-integerMatch                        OBJECT IDENTIFIER ::= {id-mr 14}
var Id_mr_integerMatch asn1.ObjectIdentifier = []int{2, 5, 13, 14}

// # ASN.1 Definition:
//
//	id-mr-integerOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 15}
var Id_mr_integerOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 15}

// # ASN.1 Definition:
//
//	id-mr-bitStringMatch                      OBJECT IDENTIFIER ::= {id-mr 16}
var Id_mr_bitStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 16}

// # ASN.1 Definition:
//
//	id-mr-octetStringMatch                    OBJECT IDENTIFIER ::= {id-mr 17}
var Id_mr_octetStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 17}

// # ASN.1 Definition:
//
//	id-mr-octetStringOrderingMatch            OBJECT IDENTIFIER ::= {id-mr 18}
var Id_mr_octetStringOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 18}

// # ASN.1 Definition:
//
//	id-mr-octetStringSubstringsMatch          OBJECT IDENTIFIER ::= {id-mr 19}
var Id_mr_octetStringSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 19}

// # ASN.1 Definition:
//
//	id-mr-telephoneNumberMatch                OBJECT IDENTIFIER ::= {id-mr 20}
var Id_mr_telephoneNumberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 20}

// # ASN.1 Definition:
//
//	id-mr-telephoneNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 21}
var Id_mr_telephoneNumberSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 21}

// # ASN.1 Definition:
//
//	id-mr-presentationAddressMatch            OBJECT IDENTIFIER ::= {id-mr 22}
var Id_mr_presentationAddressMatch asn1.ObjectIdentifier = []int{2, 5, 13, 22}

// # ASN.1 Definition:
//
//	id-mr-uniqueMemberMatch                   OBJECT IDENTIFIER ::= {id-mr 23}
var Id_mr_uniqueMemberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 23}

// # ASN.1 Definition:
//
//	id-mr-protocolInformationMatch            OBJECT IDENTIFIER ::= {id-mr 24}
var Id_mr_protocolInformationMatch asn1.ObjectIdentifier = []int{2, 5, 13, 24}

// # ASN.1 Definition:
//
//	id-mr-uTCTimeMatch                        OBJECT IDENTIFIER ::= {id-mr 25}
var Id_mr_uTCTimeMatch asn1.ObjectIdentifier = []int{2, 5, 13, 25}

// # ASN.1 Definition:
//
//	id-mr-uTCTimeOrderingMatch                OBJECT IDENTIFIER ::= {id-mr 26}
var Id_mr_uTCTimeOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 26}

// # ASN.1 Definition:
//
//	id-mr-generalizedTimeMatch                OBJECT IDENTIFIER ::= {id-mr 27}
var Id_mr_generalizedTimeMatch asn1.ObjectIdentifier = []int{2, 5, 13, 27}

// # ASN.1 Definition:
//
//	id-mr-generalizedTimeOrderingMatch        OBJECT IDENTIFIER ::= {id-mr 28}
var Id_mr_generalizedTimeOrderingMatch asn1.ObjectIdentifier = []int{2, 5, 13, 28}

// # ASN.1 Definition:
//
//	id-mr-integerFirstComponentMatch          OBJECT IDENTIFIER ::= {id-mr 29}
var Id_mr_integerFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 29}

// # ASN.1 Definition:
//
//	id-mr-objectIdentifierFirstComponentMatch OBJECT IDENTIFIER ::= {id-mr 30}
var Id_mr_objectIdentifierFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 30}

// # ASN.1 Definition:
//
//	id-mr-directoryStringFirstComponentMatch  OBJECT IDENTIFIER ::= {id-mr 31}
var Id_mr_directoryStringFirstComponentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 31}

// # ASN.1 Definition:
//
//	id-mr-wordMatch                           OBJECT IDENTIFIER ::= {id-mr 32}
var Id_mr_wordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 32}

// # ASN.1 Definition:
//
//	id-mr-keywordMatch                        OBJECT IDENTIFIER ::= {id-mr 33}
var Id_mr_keywordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 33}

// # ASN.1 Definition:
//
//	id-mr-storedPrefixMatch                   OBJECT IDENTIFIER ::= {id-mr 41}
var Id_mr_storedPrefixMatch asn1.ObjectIdentifier = []int{2, 5, 13, 41}

// # ASN.1 Definition:
//
//	id-mr-systemProposedMatch                 OBJECT IDENTIFIER ::= {id-mr 47}
var Id_mr_systemProposedMatch asn1.ObjectIdentifier = []int{2, 5, 13, 47}

// # ASN.1 Definition:
//
//	id-mr-generalWordMatch                    OBJECT IDENTIFIER ::= {id-mr 48}
var Id_mr_generalWordMatch asn1.ObjectIdentifier = []int{2, 5, 13, 48}

// # ASN.1 Definition:
//
//	id-mr-approximateStringMatch              OBJECT IDENTIFIER ::= {id-mr 49}
var Id_mr_approximateStringMatch asn1.ObjectIdentifier = []int{2, 5, 13, 49}

// # ASN.1 Definition:
//
//	id-mr-ignoreIfAbsentMatch                 OBJECT IDENTIFIER ::= {id-mr 50}
var Id_mr_ignoreIfAbsentMatch asn1.ObjectIdentifier = []int{2, 5, 13, 50}

// # ASN.1 Definition:
//
//	id-mr-nullMatch                           OBJECT IDENTIFIER ::= {id-mr 51}
var Id_mr_nullMatch asn1.ObjectIdentifier = []int{2, 5, 13, 51}

// # ASN.1 Definition:
//
//	id-mr-zonalMatch                          OBJECT IDENTIFIER ::= {id-mr 52}
var Id_mr_zonalMatch asn1.ObjectIdentifier = []int{2, 5, 13, 52}

// # ASN.1 Definition:
//
//	id-mr-facsimileNumberMatch                OBJECT IDENTIFIER ::= {id-mr 63}
var Id_mr_facsimileNumberMatch asn1.ObjectIdentifier = []int{2, 5, 13, 63}

// # ASN.1 Definition:
//
//	id-mr-facsimileNumberSubstringsMatch      OBJECT IDENTIFIER ::= {id-mr 64}
var Id_mr_facsimileNumberSubstringsMatch asn1.ObjectIdentifier = []int{2, 5, 13, 64}

// # ASN.1 Definition:
//
//	id-mr-uuidpairmatch                       OBJECT IDENTIFIER ::= {id-mr 68}
var Id_mr_uuidpairmatch asn1.ObjectIdentifier = []int{2, 5, 13, 68}

// # ASN.1 Definition:
//
//	id-mr-uriMatch                            OBJECT IDENTIFIER ::= {id-mr 70}
var Id_mr_uriMatch asn1.ObjectIdentifier = []int{2, 5, 13, 70}

// # ASN.1 Definition:
//
//	id-mr-dnsNameMatch                        OBJECT IDENTIFIER ::= {id-mr 74}
var Id_mr_dnsNameMatch asn1.ObjectIdentifier = []int{2, 5, 13, 74}

// # ASN.1 Definition:
//
//	id-mr-intEmailMatch                       OBJECT IDENTIFIER ::= {id-mr 75}
var Id_mr_intEmailMatch asn1.ObjectIdentifier = []int{2, 5, 13, 75}

// # ASN.1 Definition:
//
//	id-mr-jidMatch                            OBJECT IDENTIFIER ::= {id-mr 76}
var Id_mr_jidMatch asn1.ObjectIdentifier = []int{2, 5, 13, 76}

// # ASN.1 Definition:
//
//	id-lmr-caseExactIA5Match                  OBJECT IDENTIFIER ::= {id-lmr 1}
var Id_lmr_caseExactIA5Match asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 1}

// # ASN.1 Definition:
//
//	id-lmr-caseIgnoreIA5Match                 OBJECT IDENTIFIER ::= {id-lmr 2}
var Id_lmr_caseIgnoreIA5Match asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 2}

// # ASN.1 Definition:
//
//	id-lmr-caseIgnoreIA5SubstringsMatch       OBJECT IDENTIFIER ::= {id-lmr 3}
var Id_lmr_caseIgnoreIA5SubstringsMatch asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 109, 114, 3}

// # ASN.1 Definition:
//
//	id-avc-language                           OBJECT IDENTIFIER ::= {id-avc 0}
var Id_avc_language asn1.ObjectIdentifier = []int{2, 5, 31, 0}

// # ASN.1 Definition:
//
//	id-avc-temporal                           OBJECT IDENTIFIER ::= {id-avc 1}
var Id_avc_temporal asn1.ObjectIdentifier = []int{2, 5, 31, 1}

// # ASN.1 Definition:
//
//	id-avc-locale                             OBJECT IDENTIFIER ::= {id-avc 2}
var Id_avc_locale asn1.ObjectIdentifier = []int{2, 5, 31, 2}

// # ASN.1 Definition:
//
//	id-avc-ldapAttributeOption                OBJECT IDENTIFIER ::= {id-avc 5}
var Id_avc_ldapAttributeOption asn1.ObjectIdentifier = []int{2, 5, 31, 5}

// # ASN.1 Definition:
//
//	EnhancedGuide-subset ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type EnhancedGuide_subset = int64

const EnhancedGuide_subset_BaseObject EnhancedGuide_subset = 0

const EnhancedGuide_subset_OneLevel EnhancedGuide_subset = 1

const EnhancedGuide_subset_WholeSubtree EnhancedGuide_subset = 2

// # ASN.1 Definition:
//
//	PreferredDeliveryMethod-Item ::= INTEGER { -- REMOVED_FROM_UNNESTING -- }
type PreferredDeliveryMethod_Item = int64

const PreferredDeliveryMethod_Item_Any_delivery_method PreferredDeliveryMethod_Item = 0

const PreferredDeliveryMethod_Item_Mhs_delivery PreferredDeliveryMethod_Item = 1

const PreferredDeliveryMethod_Item_Physical_delivery PreferredDeliveryMethod_Item = 2

const PreferredDeliveryMethod_Item_Telex_delivery PreferredDeliveryMethod_Item = 3

const PreferredDeliveryMethod_Item_Teletex_delivery PreferredDeliveryMethod_Item = 4

const PreferredDeliveryMethod_Item_G3_facsimile_delivery PreferredDeliveryMethod_Item = 5

const PreferredDeliveryMethod_Item_G4_facsimile_delivery PreferredDeliveryMethod_Item = 6

const PreferredDeliveryMethod_Item_Ia5_terminal_delivery PreferredDeliveryMethod_Item = 7

const PreferredDeliveryMethod_Item_Videotex_delivery PreferredDeliveryMethod_Item = 8

const PreferredDeliveryMethod_Item_Telephone_delivery PreferredDeliveryMethod_Item = 9

// # ASN.1 Definition:
//
//	UiiFormat-subset ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type UiiFormat_subset = asn1.Enumerated

const (
	UiiFormat_subset_BaseObject   UiiFormat_subset = 0
	UiiFormat_subset_OneLevel     UiiFormat_subset = 1
	UiiFormat_subset_WholeSubtree UiiFormat_subset = 2
)

// # ASN.1 Definition:
//
//	UiiFormat-next ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type UiiFormat_next = asn1.RawValue

// # ASN.1 Definition:
//
//	EpcFormat-fields-Item-charField ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type EpcFormat_fields_Item_charField = asn1.RawValue

// # ASN.1 Definition:
//
//	EpcFormat-fields-Item-result ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type EpcFormat_fields_Item_result = asn1.Enumerated

const (
	EpcFormat_fields_Item_result_NumericPad EpcFormat_fields_Item_result = 0
	EpcFormat_fields_Item_result_Numeric    EpcFormat_fields_Item_result = 1
	EpcFormat_fields_Item_result_Alpha7bits EpcFormat_fields_Item_result = 2
)

// # ASN.1 Definition:
//
//	EpcFormat-fields-Item ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type EpcFormat_fields_Item struct {
	Bits      int
	CharField EpcFormat_fields_Item_charField
	Result    EpcFormat_fields_Item_result `asn1:"optional,default:0"`
}

// # ASN.1 Definition:
//
//	PwdResponse-warning ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type PwdResponse_warning = asn1.RawValue

// # ASN.1 Definition:
//
//	PwdResponse-error ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type PwdResponse_error = asn1.Enumerated

const (
	PwdResponse_error_PasswordExpired  PwdResponse_error = 0
	PwdResponse_error_ChangeAfterReset PwdResponse_error = 1
)

// # ASN.1 Definition:
//
//	SubstringAssertion-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type SubstringAssertion_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	OctetSubstringAssertion-Item ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type OctetSubstringAssertion_Item = asn1.RawValue

// # ASN.1 Definition:
//
//	TimeSpecification-time-absolute ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type TimeSpecification_time_absolute struct {
	StartTime time.Time `asn1:"optional,explicit,tag:0"`
	EndTime   time.Time `asn1:"optional,explicit,tag:1"`
}

// # ASN.1 Definition:
//
//	TimeSpecification-time ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type TimeSpecification_time = asn1.RawValue

// # ASN.1 Definition:
//
//	Period-days-bitDay ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type Period_days_bitDay = asn1.BitString

const Period_days_bitDay_Sunday int32 = 0

const Period_days_bitDay_Monday int32 = 1

const Period_days_bitDay_Tuesday int32 = 2

const Period_days_bitDay_Wednesday int32 = 3

const Period_days_bitDay_Thursday int32 = 4

const Period_days_bitDay_Friday int32 = 5

const Period_days_bitDay_Saturday int32 = 6

// # ASN.1 Definition:
//
//	Period-days ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type Period_days = asn1.RawValue

// # ASN.1 Definition:
//
//	Period-weeks-bitWeek ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type Period_weeks_bitWeek = asn1.BitString

const Period_weeks_bitWeek_Week1 int32 = 0

const Period_weeks_bitWeek_Week2 int32 = 1

const Period_weeks_bitWeek_Week3 int32 = 2

const Period_weeks_bitWeek_Week4 int32 = 3

const Period_weeks_bitWeek_Week5 int32 = 4

// # ASN.1 Definition:
//
//	Period-weeks ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type Period_weeks = asn1.RawValue

// # ASN.1 Definition:
//
//	Period-months-bitMonth ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type Period_months_bitMonth = asn1.BitString

const Period_months_bitMonth_January int32 = 0

const Period_months_bitMonth_February int32 = 1

const Period_months_bitMonth_March int32 = 2

const Period_months_bitMonth_April int32 = 3

const Period_months_bitMonth_May int32 = 4

const Period_months_bitMonth_June int32 = 5

const Period_months_bitMonth_July int32 = 6

const Period_months_bitMonth_August int32 = 7

const Period_months_bitMonth_September int32 = 8

const Period_months_bitMonth_October int32 = 9

const Period_months_bitMonth_November int32 = 10

const Period_months_bitMonth_December int32 = 11

// # ASN.1 Definition:
//
//	Period-months ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type Period_months = asn1.RawValue

// # ASN.1 Definition:
//
//	NamedDay-intNamedDays ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type NamedDay_intNamedDays = asn1.Enumerated

const (
	NamedDay_intNamedDays_Sunday    NamedDay_intNamedDays = 1
	NamedDay_intNamedDays_Monday    NamedDay_intNamedDays = 2
	NamedDay_intNamedDays_Tuesday   NamedDay_intNamedDays = 3
	NamedDay_intNamedDays_Wednesday NamedDay_intNamedDays = 4
	NamedDay_intNamedDays_Thursday  NamedDay_intNamedDays = 5
	NamedDay_intNamedDays_Friday    NamedDay_intNamedDays = 6
	NamedDay_intNamedDays_Saturday  NamedDay_intNamedDays = 7
)

// # ASN.1 Definition:
//
//	NamedDay-bitNamedDays ::= BIT STRING { -- REMOVED_FROM_UNNESTING -- }
type NamedDay_bitNamedDays = asn1.BitString

const NamedDay_bitNamedDays_Sunday int32 = 0

const NamedDay_bitNamedDays_Monday int32 = 1

const NamedDay_bitNamedDays_Tuesday int32 = 2

const NamedDay_bitNamedDays_Wednesday int32 = 3

const NamedDay_bitNamedDays_Thursday int32 = 4

const NamedDay_bitNamedDays_Friday int32 = 5

const NamedDay_bitNamedDays_Saturday int32 = 6

// # ASN.1 Definition:
//
//	TimeAssertion-between ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type TimeAssertion_between struct {
	StartTime time.Time `asn1:"explicit,tag:0"`
	EndTime   time.Time `asn1:"optional,explicit,tag:1"`
	Entirely  bool      `asn1:"optional"`
}
