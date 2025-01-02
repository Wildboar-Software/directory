package x500_go

// # ASN.1 Definition:
//
// HierarchicalAgreement ::= SEQUENCE {
//   rdn                [0]  RelativeDistinguishedName,
//   immediateSuperior  [1]  DistinguishedName,
//   ... }
//
//
type HierarchicalAgreement struct {
	Rdn               RelativeDistinguishedName `asn1:"explicit,tag:0"`
	ImmediateSuperior DistinguishedName         `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
// SuperiorToSubordinate ::= SEQUENCE {
//   contextPrefixInfo     [0]  DITcontext,
//   entryInfo             [1]  SET SIZE (1..MAX) OF
//                                Attribute{{SupportedAttributes}} OPTIONAL,
//   immediateSuperiorInfo [2]  SET SIZE (1..MAX) OF
//                                Attribute{{SupportedAttributes}} OPTIONAL,
//   ... }
//
//
type SuperiorToSubordinate struct {
	ContextPrefixInfo     DITcontext    `asn1:"explicit,tag:0"`
	EntryInfo             [](Attribute) `asn1:"optional,explicit,tag:1,set"`
	ImmediateSuperiorInfo [](Attribute) `asn1:"optional,explicit,tag:2,set"`
}

// # ASN.1 Definition:
//
// DITcontext  ::=  SEQUENCE OF Vertex
type DITcontext = [](Vertex) // SequenceOfType
// # ASN.1 Definition:
//
// Vertex ::= SEQUENCE {
//   rdn           [0]  RelativeDistinguishedName,
//   admPointInfo  [1]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}} OPTIONAL,
//   subentries    [2]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
//   accessPoints  [3]  MasterAndShadowAccessPoints OPTIONAL,
//   ... }
//
//
type Vertex struct {
	Rdn          RelativeDistinguishedName   `asn1:"explicit,tag:0"`
	AdmPointInfo [](Attribute)               `asn1:"optional,explicit,tag:1,set"`
	Subentries   [](SubentryInfo)            `asn1:"optional,explicit,tag:2,set"`
	AccessPoints MasterAndShadowAccessPoints `asn1:"optional,explicit,tag:3"`
}

// WARNING: If you encounter a bug encoding or decoding, it is probably the
// info field, which may need to be a `[]pkix.AttributeTypeAndValueSET`.
//
// # ASN.1 Definition:
//
// SubentryInfo ::= SEQUENCE {
//   rdn   [0]  RelativeDistinguishedName,
//   info  [1]  SET OF Attribute{{SupportedAttributes}},
//   ... }
//
//
type SubentryInfo struct {
	Rdn  RelativeDistinguishedName `asn1:"explicit,tag:0"`
	Info [](Attribute)             `asn1:"explicit,tag:1,set"`
}

// # ASN.1 Definition:
//
// SubordinateToSuperior ::= SEQUENCE {
//   accessPoints  [0]  MasterAndShadowAccessPoints OPTIONAL,
//   alias         [1]  BOOLEAN DEFAULT FALSE,
//   entryInfo     [2]  SET SIZE (1..MAX) OF Attribute{{SupportedAttributes}} OPTIONAL,
//   subentries    [3]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
//   ... }
//
//
type SubordinateToSuperior struct {
	AccessPoints MasterAndShadowAccessPoints `asn1:"optional,explicit,tag:0"`
	Alias        bool                        `asn1:"optional,explicit,tag:1"`
	EntryInfo    [](Attribute)               `asn1:"optional,explicit,tag:2,set"`
	Subentries   [](SubentryInfo)            `asn1:"optional,explicit,tag:3,set"`
}

// # ASN.1 Definition:
//
// SuperiorToSubordinateModification  ::=  SuperiorToSubordinate (
//   WITH COMPONENTS {..., entryInfo  ABSENT } )
type SuperiorToSubordinateModification = SuperiorToSubordinate // DefinedType
// # ASN.1 Definition:
//
// NonSpecificHierarchicalAgreement ::= SEQUENCE {
//   immediateSuperior  [1]  DistinguishedName,
//   ... }
//
//
type NonSpecificHierarchicalAgreement struct {
	ImmediateSuperior DistinguishedName `asn1:"explicit,tag:1"`
}

// # ASN.1 Definition:
//
// NHOBSuperiorToSubordinate  ::=  SuperiorToSubordinate (
//   WITH COMPONENTS {..., entryInfo  ABSENT } )
type NHOBSuperiorToSubordinate = SuperiorToSubordinate // DefinedType
// # ASN.1 Definition:
//
// NHOBSubordinateToSuperior ::= SEQUENCE {
//   accessPoints  [0]  MasterAndShadowAccessPoints OPTIONAL,
//   subentries    [3]  SET SIZE (1..MAX) OF SubentryInfo OPTIONAL,
//   ... }
//
//
type NHOBSubordinateToSuperior struct {
	AccessPoints MasterAndShadowAccessPoints `asn1:"optional,explicit,tag:0"`
	Subentries   [](SubentryInfo)            `asn1:"optional,explicit,tag:3,set"`
}
