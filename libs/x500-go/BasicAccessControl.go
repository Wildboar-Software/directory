package x500_go

import (
	"crypto/x509/pkix"
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION ACIItem */
// ### ASN.1 Definition:
//
// ```asn1
// ACIItem ::= SEQUENCE {
//   identificationTag    UnboundedDirectoryString,
//   precedence           Precedence,
//   authenticationLevel  AuthenticationLevel,
//   itemOrUserFirst      CHOICE {
//     itemFirst       [0]  SEQUENCE {
//       protectedItems       ProtectedItems,
//       itemPermissions      SET OF ItemPermission,
//       ...},
//     userFirst       [1]  SEQUENCE {
//       userClasses          UserClasses,
//       userPermissions      SET OF UserPermission,
//       ...},
//     ...},
//   ... }
// ```
//
//
type ACIItem struct {
	IdentificationTag   UnboundedDirectoryString
	Precedence          Precedence
	AuthenticationLevel AuthenticationLevel
	ItemOrUserFirst     ACIItem_itemOrUserFirst
}

/* END_OF_SYMBOL_DEFINITION ACIItem */ /* START_OF_SYMBOL_DEFINITION Precedence */
// ### ASN.1 Definition:
//
// ```asn1
// Precedence  ::=  INTEGER(0..255,...)
// ```
type Precedence = int64

/* END_OF_SYMBOL_DEFINITION Precedence */ /* START_OF_SYMBOL_DEFINITION ProtectedItems */
// ### ASN.1 Definition:
//
// ```asn1
// ProtectedItems ::= SEQUENCE {
//   entry                          [0]  NULL OPTIONAL,
//   allUserAttributeTypes          [1]  NULL OPTIONAL,
//   attributeType                  [2]  SET SIZE (1..MAX) OF AttributeType
//                                         OPTIONAL,
//   allAttributeValues             [3]  SET SIZE (1..MAX) OF AttributeType
//                                         OPTIONAL,
//   allUserAttributeTypesAndValues [4]  NULL OPTIONAL,
//   attributeValue                 [5]  SET SIZE (1..MAX) OF AttributeTypeAndValue
//                                         OPTIONAL,
//   selfValue                      [6]  SET SIZE (1..MAX) OF AttributeType
//                                         OPTIONAL,
//   rangeOfValues                  [7]  Filter OPTIONAL,
//   maxValueCount                  [8]  SET SIZE (1..MAX) OF MaxValueCount
//                                         OPTIONAL,
//   maxImmSub                      [9]  INTEGER OPTIONAL,
//   restrictedBy                   [10] SET SIZE (1..MAX) OF RestrictedValue
//                                         OPTIONAL,
//   contexts                       [11] SET SIZE (1..MAX) OF ContextAssertion
//                                         OPTIONAL,
//   classes                        [12] Refinement OPTIONAL,
//   ... }
// ```
//
//
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

/* END_OF_SYMBOL_DEFINITION ProtectedItems */ /* START_OF_SYMBOL_DEFINITION MaxValueCount */
// ### ASN.1 Definition:
//
// ```asn1
// MaxValueCount ::= SEQUENCE {
//   type      AttributeType,
//   maxCount  INTEGER,
//   ... }
// ```
//
//
type MaxValueCount struct {
	Type     AttributeType
	MaxCount int
}

/* END_OF_SYMBOL_DEFINITION MaxValueCount */ /* START_OF_SYMBOL_DEFINITION RestrictedValue */
// ### ASN.1 Definition:
//
// ```asn1
// RestrictedValue ::= SEQUENCE {
//   type      AttributeType,
//   valuesIn  AttributeType,
//   ... }
// ```
//
//
type RestrictedValue struct {
	Type     AttributeType
	ValuesIn AttributeType
}

/* END_OF_SYMBOL_DEFINITION RestrictedValue */ /* START_OF_SYMBOL_DEFINITION UserClasses */
// ### ASN.1 Definition:
//
// ```asn1
// UserClasses ::= SEQUENCE {
//   allUsers   [0]  NULL                                      OPTIONAL,
//   thisEntry  [1]  NULL                                      OPTIONAL,
//   name       [2]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
//   userGroup  [3]  SET SIZE (1..MAX) OF NameAndOptionalUID   OPTIONAL,
//                   -- dn component shall be the name of an
//                   -- entry of GroupOfUniqueNames
//   subtree    [4]  SET SIZE (1..MAX) OF SubtreeSpecification OPTIONAL,
//   ... }
// ```
//
//
type UserClasses struct {
	AllUsers  asn1.RawValue            `asn1:"optional,explicit,tag:0"`
	ThisEntry asn1.RawValue            `asn1:"optional,explicit,tag:1"`
	Name      [](NameAndOptionalUID)   `asn1:"optional,explicit,tag:2,set"`
	UserGroup [](NameAndOptionalUID)   `asn1:"optional,explicit,tag:3,set"`
	Subtree   [](SubtreeSpecification) `asn1:"optional,explicit,tag:4,set"`
}

/* END_OF_SYMBOL_DEFINITION UserClasses */ /* START_OF_SYMBOL_DEFINITION ItemPermission */
// ### ASN.1 Definition:
//
// ```asn1
// ItemPermission ::= SEQUENCE {
//   precedence        Precedence OPTIONAL,
//              -- defaults to precedence in ACIItem
//   userClasses       UserClasses,
//   grantsAndDenials  GrantsAndDenials,
//   ... }
// ```
//
//
type ItemPermission struct {
	Precedence       Precedence `asn1:"optional"`
	UserClasses      UserClasses
	GrantsAndDenials GrantsAndDenials
}

/* END_OF_SYMBOL_DEFINITION ItemPermission */ /* START_OF_SYMBOL_DEFINITION UserPermission */
// ### ASN.1 Definition:
//
// ```asn1
// UserPermission ::= SEQUENCE {
//   precedence        Precedence OPTIONAL,
//              -- defaults to precedence in ACIItem
//   protectedItems    ProtectedItems,
//   grantsAndDenials  GrantsAndDenials,
//   ... }
// ```
//
//
type UserPermission struct {
	Precedence       Precedence `asn1:"optional"`
	ProtectedItems   ProtectedItems
	GrantsAndDenials GrantsAndDenials
}

/* END_OF_SYMBOL_DEFINITION UserPermission */ /* START_OF_SYMBOL_DEFINITION AuthenticationLevel */
// ### ASN.1 Definition:
//
// ```asn1
// AuthenticationLevel  ::=  CHOICE {
//   basicLevels     SEQUENCE {
//     level           ENUMERATED {none(0), simple(1), strong(2),...},
//     localQualifier  INTEGER OPTIONAL,
//     signed          BOOLEAN DEFAULT FALSE,
//     ...},
//   other           EXTERNAL,
//   ... }
// ```
type AuthenticationLevel = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION AuthenticationLevel */ /* START_OF_SYMBOL_DEFINITION GrantsAndDenials */
// ### ASN.1 Definition:
//
// ```asn1
// GrantsAndDenials  ::=  BIT STRING {
//   -- permissions that may be used in conjunction
//   -- with any component of ProtectedItems
//   grantAdd             (0),
//   denyAdd              (1),
//   grantDiscloseOnError (2),
//   denyDiscloseOnError  (3),
//   grantRead            (4),
//   denyRead             (5),
//   grantRemove          (6),
//   denyRemove           (7),
//   -- permissions that may be used only in conjunction
//   -- with the entry component
//   grantBrowse          (8),
//   denyBrowse           (9),
//   grantExport          (10),
//   denyExport           (11),
//   grantImport          (12),
//   denyImport           (13),
//   grantModify          (14),
//   denyModify           (15),
//   grantRename          (16),
//   denyRename           (17),
//   grantReturnDN        (18),
//   denyReturnDN         (19),
//   -- permissions that may be used in conjunction
//   -- with any component, except entry, of ProtectedItems
//   grantCompare         (20),
//   denyCompare          (21),
//   grantFilterMatch     (22),
//   denyFilterMatch      (23),
//   grantInvoke          (24),
//   denyInvoke           (25) }
// ```
type GrantsAndDenials = asn1.BitString

/* END_OF_SYMBOL_DEFINITION GrantsAndDenials */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantAdd */
const GrantsAndDenials_GrantAdd int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantAdd */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyAdd */
const GrantsAndDenials_DenyAdd int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyAdd */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantDiscloseOnError */
const GrantsAndDenials_GrantDiscloseOnError int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantDiscloseOnError */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyDiscloseOnError */
const GrantsAndDenials_DenyDiscloseOnError int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyDiscloseOnError */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRead */
const GrantsAndDenials_GrantRead int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRead */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRead */
const GrantsAndDenials_DenyRead int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRead */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRemove */
const GrantsAndDenials_GrantRemove int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRemove */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRemove */
const GrantsAndDenials_DenyRemove int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRemove */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantBrowse */
const GrantsAndDenials_GrantBrowse int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantBrowse */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyBrowse */
const GrantsAndDenials_DenyBrowse int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyBrowse */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantExport */
const GrantsAndDenials_GrantExport int32 = 10 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantExport */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyExport */
const GrantsAndDenials_DenyExport int32 = 11 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyExport */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantImport */
const GrantsAndDenials_GrantImport int32 = 12 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantImport */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyImport */
const GrantsAndDenials_DenyImport int32 = 13 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyImport */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantModify */
const GrantsAndDenials_GrantModify int32 = 14 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantModify */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyModify */
const GrantsAndDenials_DenyModify int32 = 15 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyModify */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRename */
const GrantsAndDenials_GrantRename int32 = 16 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantRename */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRename */
const GrantsAndDenials_DenyRename int32 = 17 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyRename */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantReturnDN */
const GrantsAndDenials_GrantReturnDN int32 = 18 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantReturnDN */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyReturnDN */
const GrantsAndDenials_DenyReturnDN int32 = 19 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyReturnDN */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantCompare */
const GrantsAndDenials_GrantCompare int32 = 20 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantCompare */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyCompare */
const GrantsAndDenials_DenyCompare int32 = 21 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyCompare */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantFilterMatch */
const GrantsAndDenials_GrantFilterMatch int32 = 22 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantFilterMatch */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyFilterMatch */
const GrantsAndDenials_DenyFilterMatch int32 = 23 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyFilterMatch */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantInvoke */
const GrantsAndDenials_GrantInvoke int32 = 24 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_GrantInvoke */

/* START_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyInvoke */
const GrantsAndDenials_DenyInvoke int32 = 25 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION GrantsAndDenials_DenyInvoke */ /* START_OF_SYMBOL_DEFINITION Id_aca_accessControlScheme */
// ### ASN.1 Definition:
//
// ```asn1
// id-aca-accessControlScheme     OBJECT IDENTIFIER ::= {id-aca 1}
// ```
//
//
var Id_aca_accessControlScheme asn1.ObjectIdentifier = []int{2, 5, 24, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_aca_accessControlScheme */ /* START_OF_SYMBOL_DEFINITION Id_aca_prescriptiveACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-aca-prescriptiveACI         OBJECT IDENTIFIER ::= {id-aca 4}
// ```
//
//
var Id_aca_prescriptiveACI asn1.ObjectIdentifier = []int{2, 5, 24, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_aca_prescriptiveACI */ /* START_OF_SYMBOL_DEFINITION Id_aca_entryACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-aca-entryACI                OBJECT IDENTIFIER ::= {id-aca 5}
// ```
//
//
var Id_aca_entryACI asn1.ObjectIdentifier = []int{2, 5, 24, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_aca_entryACI */ /* START_OF_SYMBOL_DEFINITION Id_aca_subentryACI */
// ### ASN.1 Definition:
//
// ```asn1
// id-aca-subentryACI             OBJECT IDENTIFIER ::= {id-aca 6}
// ```
//
//
var Id_aca_subentryACI asn1.ObjectIdentifier = []int{2, 5, 24, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_aca_subentryACI */ /* START_OF_SYMBOL_DEFINITION BasicAccessControlScheme */
// ### ASN.1 Definition:
//
// ```asn1
// basicAccessControlScheme       OBJECT IDENTIFIER ::= {id-acScheme 1}
// ```
//
//
var BasicAccessControlScheme asn1.ObjectIdentifier = []int{2, 5, 28, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION BasicAccessControlScheme */ /* START_OF_SYMBOL_DEFINITION SimplifiedAccessControlScheme */
// ### ASN.1 Definition:
//
// ```asn1
// simplifiedAccessControlScheme  OBJECT IDENTIFIER ::= {id-acScheme 2}
// ```
//
//
var SimplifiedAccessControlScheme asn1.ObjectIdentifier = []int{2, 5, 28, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION SimplifiedAccessControlScheme */ /* START_OF_SYMBOL_DEFINITION Rule_based_access_control */
// ### ASN.1 Definition:
//
// ```asn1
// rule-based-access-control      OBJECT IDENTIFIER ::= {id-acScheme 3}
// ```
//
//
var Rule_based_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Rule_based_access_control */ /* START_OF_SYMBOL_DEFINITION Rule_and_basic_access_control */
// ### ASN.1 Definition:
//
// ```asn1
// rule-and-basic-access-control  OBJECT IDENTIFIER ::= {id-acScheme 4}
// ```
//
//
var Rule_and_basic_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Rule_and_basic_access_control */ /* START_OF_SYMBOL_DEFINITION Rule_and_simple_access_control */
// ### ASN.1 Definition:
//
// ```asn1
// rule-and-simple-access-control OBJECT IDENTIFIER ::= {id-acScheme 5}
// ```
//
//
var Rule_and_simple_access_control asn1.ObjectIdentifier = []int{2, 5, 28, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Rule_and_simple_access_control */ /* START_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst_itemFirst */
// ### ASN.1 Definition:
//
// ```asn1
// ACIItem-itemOrUserFirst-itemFirst ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ACIItem_itemOrUserFirst_itemFirst struct {
	ProtectedItems  ProtectedItems
	ItemPermissions [](ItemPermission) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst_itemFirst */ /* START_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst_userFirst */
// ### ASN.1 Definition:
//
// ```asn1
// ACIItem-itemOrUserFirst-userFirst ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type ACIItem_itemOrUserFirst_userFirst struct {
	UserClasses     UserClasses
	UserPermissions [](UserPermission) `asn1:"set"`
}

/* END_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst_userFirst */ /* START_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst */
// ### ASN.1 Definition:
//
// ```asn1
// ACIItem-itemOrUserFirst ::= CHOICE { -- REMOVED_FROM_UNNESTING -- }
// ```
type ACIItem_itemOrUserFirst = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION ACIItem_itemOrUserFirst */ /* START_OF_SYMBOL_DEFINITION AuthenticationLevel_basicLevels_level */
// ### ASN.1 Definition:
//
// ```asn1
// AuthenticationLevel-basicLevels-level ::= ENUMERATED { -- REMOVED_FROM_UNNESTING -- }
// ```
type AuthenticationLevel_basicLevels_level = int

const (
	AuthenticationLevel_basicLevels_level_None   AuthenticationLevel_basicLevels_level = 0 // LONG_NAMED_ENUMERATED_VALUE,
	AuthenticationLevel_basicLevels_level_Simple AuthenticationLevel_basicLevels_level = 1 // LONG_NAMED_ENUMERATED_VALUE,
	AuthenticationLevel_basicLevels_level_Strong AuthenticationLevel_basicLevels_level = 2 // LONG_NAMED_ENUMERATED_VALUE
)

/* END_OF_SYMBOL_DEFINITION AuthenticationLevel_basicLevels_level */ /* START_OF_SYMBOL_DEFINITION AuthenticationLevel_basicLevels */
// ### ASN.1 Definition:
//
// ```asn1
// AuthenticationLevel-basicLevels ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type AuthenticationLevel_basicLevels struct {
	Level          AuthenticationLevel_basicLevels_level
	LocalQualifier int  `asn1:"optional"`
	Signed         bool `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION AuthenticationLevel_basicLevels */
