package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	ACIItem ::= SEQUENCE {
//	  identificationTag    UnboundedDirectoryString,
//	  precedence           Precedence,
//	  authenticationLevel  AuthenticationLevel,
//	  itemOrUserFirst      CHOICE {
//	    itemFirst       [0]  SEQUENCE {
//	      protectedItems       ProtectedItems,
//	      itemPermissions      SET OF ItemPermission,
//	      ...},
//	    userFirst       [1]  SEQUENCE {
//	      userClasses          UserClasses,
//	      userPermissions      SET OF UserPermission,
//	      ...},
//	    ...},
//	  ... }
type ACIItem struct {
	IdentificationTag   UnboundedDirectoryString
	Precedence          Precedence
	AuthenticationLevel AuthenticationLevel
	ItemOrUserFirst     ACIItem_itemOrUserFirst
}

// # ASN.1 Definition:
//
// Precedence  ::=  INTEGER(0..255,...)
type Precedence = int64

// # ASN.1 Definition:
//
//	ProtectedItems ::= SEQUENCE {
//	  entry                          [0]  NULL OPTIONAL,
//	  allUserAttributeTypes          [1]  NULL OPTIONAL,
//	  attributeType                  [2]  SET SIZE (1..MAX) OF AttributeType
//	                                        OPTIONAL,
//	  allAttributeValues             [3]  SET SIZE (1..MAX) OF AttributeType
//	                                        OPTIONAL,
//	  allUserAttributeTypesAndValues [4]  NULL OPTIONAL,
//	  attributeValue                 [5]  SET SIZE (1..MAX) OF AttributeTypeAndValue
//	                                        OPTIONAL,
//	  selfValue                      [6]  SET SIZE (1..MAX) OF AttributeType
//	                                        OPTIONAL,
//	  rangeOfValues                  [7]  Filter OPTIONAL,
//	  maxValueCount                  [8]  SET SIZE (1..MAX) OF MaxValueCount
//	                                        OPTIONAL,
//	  maxImmSub                      [9]  INTEGER OPTIONAL,
//	  restrictedBy                   [10] SET SIZE (1..MAX) OF RestrictedValue
//	                                        OPTIONAL,
//	  contexts                       [11] SET SIZE (1..MAX) OF ContextAssertion
//	                                        OPTIONAL,
//	  classes                        [12] Refinement OPTIONAL,
//	  ... }
type ProtectedItems struct {
	Entry                          asn1.RawValue                `asn1:"optional,explicit,tag:0"`
	AllUserAttributeTypes          asn1.RawValue                `asn1:"optional,explicit,tag:1"`
	AttributeType                  [](AttributeType)            `asn1:"optional,explicit,tag:2,set"`
	AllAttributeValues             [](AttributeType)            `asn1:"optional,explicit,tag:3,set"`
	AllUserAttributeTypesAndValues asn1.RawValue                `asn1:"optional,explicit,tag:4"`
	AttributeValue                 []pkix.AttributeTypeAndValue `asn1:"optional,explicit,tag:5,set"`
	SelfValue                      [](AttributeType)            `asn1:"optional,explicit,tag:6,set"`
	RangeOfValues                  Filter                       `asn1:"optional,explicit,tag:7"`
	MaxValueCount                  [](MaxValueCount)            `asn1:"optional,explicit,tag:8,set"`
	MaxImmSub                      int                          `asn1:"optional,explicit,tag:9"`
	RestrictedBy                   [](RestrictedValue)          `asn1:"optional,explicit,tag:10,set"`
	Contexts                       [](ContextAssertion)         `asn1:"optional,explicit,tag:11,set"`
	Classes                        Refinement                   `asn1:"optional,explicit,tag:12"`
}

// # ASN.1 Definition:
//
//	MaxValueCount ::= SEQUENCE {
//	  type      AttributeType,
//	  maxCount  INTEGER,
//	  ... }
type MaxValueCount struct {
	Type     AttributeType
	MaxCount int
}

// # ASN.1 Definition:
//
//	RestrictedValue ::= SEQUENCE {
//	  type      AttributeType,
//	  valuesIn  AttributeType,
//	  ... }
type RestrictedValue struct {
	Type     AttributeType
	ValuesIn AttributeType
}

// # ASN.1 Definition:
//
//	UserClasses ::= SEQUENCE {
//	  allUsers   [0]  NULL                                      OPTIONAL,
//	  thisEntry  [1]  NULL                                      OPTIONAL,
//	  name       [2]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
//	  userGroup  [3]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
//	                  -- dn component shall be the name of an
//	                  -- entry of GroupOfUniqueNames
//	  subtree    [4]  SET SIZE (1..MAX) OF SubtreeSpecification OPTIONAL,
//	  ... }
type UserClasses struct {
	AllUsers  asn1.RawValue            `asn1:"optional,explicit,tag:0"`
	ThisEntry asn1.RawValue            `asn1:"optional,explicit,tag:1"`
	Name      [](NameAndOptionalUID)   `asn1:"optional,explicit,tag:2,set"`
	UserGroup [](NameAndOptionalUID)   `asn1:"optional,explicit,tag:3,set"`
	Subtree   [](SubtreeSpecification) `asn1:"optional,explicit,tag:4,set"`
}

// # ASN.1 Definition:
//
//	ItemPermission ::= SEQUENCE {
//	  precedence        Precedence OPTIONAL,
//	             -- defaults to precedence in ACIItem
//	  userClasses       UserClasses,
//	  grantsAndDenials  GrantsAndDenials,
//	  ... }
type ItemPermission struct {
	Precedence       Precedence `asn1:"optional"`
	UserClasses      UserClasses
	GrantsAndDenials GrantsAndDenials
}

// # ASN.1 Definition:
//
//	UserPermission ::= SEQUENCE {
//	  precedence        Precedence OPTIONAL,
//	             -- defaults to precedence in ACIItem
//	  protectedItems    ProtectedItems,
//	  grantsAndDenials  GrantsAndDenials,
//	  ... }
type UserPermission struct {
	Precedence       Precedence `asn1:"optional"`
	ProtectedItems   ProtectedItems
	GrantsAndDenials GrantsAndDenials
}

// # ASN.1 Definition:
//
//	AuthenticationLevel  ::=  CHOICE {
//	  basicLevels     SEQUENCE {
//	    level           ENUMERATED {none(0), simple(1), strong(2),...},
//	    localQualifier  INTEGER OPTIONAL,
//	    signed          BOOLEAN DEFAULT FALSE,
//	    ...},
//	  other           EXTERNAL,
//	  ... }
type AuthenticationLevel = asn1.RawValue

// # ASN.1 Definition:
//
//	GrantsAndDenials  ::=  BIT STRING {
//	  -- permissions that may be used in conjunction
//	  -- with any component of ProtectedItems
//	  grantAdd             (0),
//	  denyAdd              (1),
//	  grantDiscloseOnError (2),
//	  denyDiscloseOnError  (3),
//	  grantRead            (4),
//	  denyRead             (5),
//	  grantRemove          (6),
//	  denyRemove           (7),
//	  -- permissions that may be used only in conjunction
//	  -- with the entry component
//	  grantBrowse          (8),
//	  denyBrowse           (9),
//	  grantExport          (10),
//	  denyExport           (11),
//	  grantImport          (12),
//	  denyImport           (13),
//	  grantModify          (14),
//	  denyModify           (15),
//	  grantRename          (16),
//	  denyRename           (17),
//	  grantReturnDN        (18),
//	  denyReturnDN         (19),
//	  -- permissions that may be used in conjunction
//	  -- with any component, except entry, of ProtectedItems
//	  grantCompare         (20),
//	  denyCompare          (21),
//	  grantFilterMatch     (22),
//	  denyFilterMatch      (23),
//	  grantInvoke          (24),
//	  denyInvoke           (25) }
type GrantsAndDenials = asn1.BitString

const GrantsAndDenials_GrantAdd int32 = 0

const GrantsAndDenials_DenyAdd int32 = 1

const GrantsAndDenials_GrantDiscloseOnError int32 = 2

const GrantsAndDenials_DenyDiscloseOnError int32 = 3

const GrantsAndDenials_GrantRead int32 = 4

const GrantsAndDenials_DenyRead int32 = 5

const GrantsAndDenials_GrantRemove int32 = 6

const GrantsAndDenials_DenyRemove int32 = 7

const GrantsAndDenials_GrantBrowse int32 = 8

const GrantsAndDenials_DenyBrowse int32 = 9

const GrantsAndDenials_GrantExport int32 = 10

const GrantsAndDenials_DenyExport int32 = 11

const GrantsAndDenials_GrantImport int32 = 12

const GrantsAndDenials_DenyImport int32 = 13

const GrantsAndDenials_GrantModify int32 = 14

const GrantsAndDenials_DenyModify int32 = 15

const GrantsAndDenials_GrantRename int32 = 16

const GrantsAndDenials_DenyRename int32 = 17

const GrantsAndDenials_GrantReturnDN int32 = 18

const GrantsAndDenials_DenyReturnDN int32 = 19

const GrantsAndDenials_GrantCompare int32 = 20

const GrantsAndDenials_DenyCompare int32 = 21

const GrantsAndDenials_GrantFilterMatch int32 = 22

const GrantsAndDenials_DenyFilterMatch int32 = 23

const GrantsAndDenials_GrantInvoke int32 = 24

const GrantsAndDenials_DenyInvoke int32 = 25

// # ASN.1 Definition:
//
// id-aca-accessControlScheme     OBJECT IDENTIFIER ::= {id-aca 1}
var Id_aca_accessControlScheme asn1.ObjectIdentifier = []int{2, 5, 24, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-aca-prescriptiveACI         OBJECT IDENTIFIER ::= {id-aca 4}
var Id_aca_prescriptiveACI asn1.ObjectIdentifier = []int{2, 5, 24, 4} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-aca-entryACI                OBJECT IDENTIFIER ::= {id-aca 5}
var Id_aca_entryACI asn1.ObjectIdentifier = []int{2, 5, 24, 5} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-aca-subentryACI             OBJECT IDENTIFIER ::= {id-aca 6}
var Id_aca_subentryACI asn1.ObjectIdentifier = []int{2, 5, 24, 6} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// basicAccessControlScheme       OBJECT IDENTIFIER ::= {id-acScheme 1}
var BasicAccessControlScheme asn1.ObjectIdentifier = []int{2, 5, 28, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// simplifiedAccessControlScheme  OBJECT IDENTIFIER ::= {id-acScheme 2}
var SimplifiedAccessControlScheme asn1.ObjectIdentifier = []int{2, 5, 28, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// rule-based-access-control      OBJECT IDENTIFIER ::= {id-acScheme 3}
var Rule_based_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 3} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// rule-and-basic-access-control  OBJECT IDENTIFIER ::= {id-acScheme 4}
var Rule_and_basic_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 4} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// rule-and-simple-access-control OBJECT IDENTIFIER ::= {id-acScheme 5}
var Rule_and_simple_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 5} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// ACIItem-itemOrUserFirst-itemFirst ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ACIItem_itemOrUserFirst_itemFirst struct {
	ProtectedItems  ProtectedItems
	ItemPermissions [](ItemPermission) `asn1:"set"`
}

// # ASN.1 Definition:
//
// ACIItem-itemOrUserFirst-userFirst ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type ACIItem_itemOrUserFirst_userFirst struct {
	UserClasses     UserClasses
	UserPermissions [](UserPermission) `asn1:"set"`
}

// # ASN.1 Definition:
//
// ACIItem-itemOrUserFirst ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
type ACIItem_itemOrUserFirst = asn1.RawValue

// # ASN.1 Definition:
//
// AuthenticationLevel-basicLevels-level ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
type AuthenticationLevel_basicLevels_level = asn1.Enumerated

const (
	AuthenticationLevel_basicLevels_level_None   AuthenticationLevel_basicLevels_level = 0
	AuthenticationLevel_basicLevels_level_Simple AuthenticationLevel_basicLevels_level = 1
	AuthenticationLevel_basicLevels_level_Strong AuthenticationLevel_basicLevels_level = 2
)

// # ASN.1 Definition:
//
// AuthenticationLevel-basicLevels ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
type AuthenticationLevel_basicLevels struct {
	Level          AuthenticationLevel_basicLevels_level
	LocalQualifier int  `asn1:"optional"`
	Signed         bool `asn1:"optional"`
}
