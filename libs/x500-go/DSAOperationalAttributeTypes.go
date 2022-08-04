package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION DSEType */
// ### ASN.1 Definition:
//
// ```asn1
// DSEType  ::=  BIT STRING {
//   root           (0),  -- root DSE
//   glue           (1),  -- represents knowledge of a name only
//   cp             (2),  -- context prefix
//   entry          (3),  -- object entry
//   alias          (4),  -- alias entry
//   subr           (5),  -- subordinate reference
//   nssr           (6),  -- non-specific subordinate reference
//   supr           (7),  -- superior reference
//   xr             (8),  -- cross reference
//   admPoint       (9),  -- administrative point
//   subentry       (10), -- subentry
//   shadow         (11), -- shadow copy
//   immSupr        (13), -- immediate superior reference
//   rhob           (14), -- rhob information
//   sa             (15), -- subordinate reference to alias entry
//   dsSubentry     (16), -- DSA Specific subentry
//   familyMember   (17), -- family member
//   ditBridge      (18)}
// ```
type DSEType = asn1.BitString

/* END_OF_SYMBOL_DEFINITION DSEType */

/* START_OF_SYMBOL_DEFINITION DSEType_Root */
const DSEType_Root int32 = 0 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Root */

/* START_OF_SYMBOL_DEFINITION DSEType_Glue */
const DSEType_Glue int32 = 1 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Glue */

/* START_OF_SYMBOL_DEFINITION DSEType_Cp */
const DSEType_Cp int32 = 2 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Cp */

/* START_OF_SYMBOL_DEFINITION DSEType_Entry */
const DSEType_Entry int32 = 3 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Entry */

/* START_OF_SYMBOL_DEFINITION DSEType_Alias */
const DSEType_Alias int32 = 4 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Alias */

/* START_OF_SYMBOL_DEFINITION DSEType_Subr */
const DSEType_Subr int32 = 5 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Subr */

/* START_OF_SYMBOL_DEFINITION DSEType_Nssr */
const DSEType_Nssr int32 = 6 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Nssr */

/* START_OF_SYMBOL_DEFINITION DSEType_Supr */
const DSEType_Supr int32 = 7 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Supr */

/* START_OF_SYMBOL_DEFINITION DSEType_Xr */
const DSEType_Xr int32 = 8 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Xr */

/* START_OF_SYMBOL_DEFINITION DSEType_AdmPoint */
const DSEType_AdmPoint int32 = 9 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_AdmPoint */

/* START_OF_SYMBOL_DEFINITION DSEType_Subentry */
const DSEType_Subentry int32 = 10 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Subentry */

/* START_OF_SYMBOL_DEFINITION DSEType_Shadow */
const DSEType_Shadow int32 = 11 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Shadow */

/* START_OF_SYMBOL_DEFINITION DSEType_ImmSupr */
const DSEType_ImmSupr int32 = 13 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_ImmSupr */

/* START_OF_SYMBOL_DEFINITION DSEType_Rhob */
const DSEType_Rhob int32 = 14 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Rhob */

/* START_OF_SYMBOL_DEFINITION DSEType_Sa */
const DSEType_Sa int32 = 15 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_Sa */

/* START_OF_SYMBOL_DEFINITION DSEType_DsSubentry */
const DSEType_DsSubentry int32 = 16 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_DsSubentry */

/* START_OF_SYMBOL_DEFINITION DSEType_FamilyMember */
const DSEType_FamilyMember int32 = 17 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_FamilyMember */

/* START_OF_SYMBOL_DEFINITION DSEType_DitBridge */
const DSEType_DitBridge int32 = 18 /* LONG_NAMED_BIT */
/* END_OF_SYMBOL_DEFINITION DSEType_DitBridge */ /* START_OF_SYMBOL_DEFINITION SupplierOrConsumer */
// ### ASN.1 Definition:
//
// ```asn1
// SupplierOrConsumer ::= SET {
//   COMPONENTS OF              AccessPoint, -- supplier or consumer
//   agreementID           [3]  OperationalBindingID,
//   ... }
// ```
//
//
type SupplierOrConsumer struct {
	Ae_title            Name                    `asn1:"explicit,tag:0"`
	Address             PresentationAddress     `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation) `asn1:"optional,explicit,tag:2,set"`
	AgreementID         OperationalBindingID    `asn1:"explicit,tag:3"`
}

/* END_OF_SYMBOL_DEFINITION SupplierOrConsumer */ /* START_OF_SYMBOL_DEFINITION SupplierInformation */
// ### ASN.1 Definition:
//
// ```asn1
// SupplierInformation ::= SET {
//   COMPONENTS OF              SupplierOrConsumer, -- supplier
//   supplier-is-master    [4]  BOOLEAN DEFAULT TRUE,
//   non-supplying-master  [5]  AccessPoint OPTIONAL,
//   ... }
// ```
//
//
type SupplierInformation struct {
	Ae_title             Name                    `asn1:"explicit,tag:0"`
	Address              PresentationAddress     `asn1:"explicit,tag:1"`
	ProtocolInformation  [](ProtocolInformation) `asn1:"optional,explicit,tag:2,set"`
	AgreementID          OperationalBindingID    `asn1:"explicit,tag:3"`
	Supplier_is_master   bool                    `asn1:"optional,explicit,tag:4"`
	Non_supplying_master AccessPoint             `asn1:"optional,explicit,tag:5"`
}

/* END_OF_SYMBOL_DEFINITION SupplierInformation */ /* START_OF_SYMBOL_DEFINITION ConsumerInformation */
// ### ASN.1 Definition:
//
// ```asn1
// ConsumerInformation  ::=  SupplierOrConsumer
// ```
type ConsumerInformation = SupplierOrConsumer // DefinedType
/* END_OF_SYMBOL_DEFINITION ConsumerInformation */ /* START_OF_SYMBOL_DEFINITION SupplierAndConsumers */
// ### ASN.1 Definition:
//
// ```asn1
// SupplierAndConsumers ::= SET {
//   COMPONENTS OF         AccessPoint, -- supplier
//   consumers        [3]  SET OF AccessPoint,
//   ... }
// ```
//
//
type SupplierAndConsumers struct {
	Ae_title            Name                    `asn1:"explicit,tag:0"`
	Address             PresentationAddress     `asn1:"explicit,tag:1"`
	ProtocolInformation [](ProtocolInformation) `asn1:"optional,explicit,tag:2,set"`
	Consumers           [](AccessPoint)         `asn1:"explicit,tag:3,set"`
}

/* END_OF_SYMBOL_DEFINITION SupplierAndConsumers */ /* START_OF_SYMBOL_DEFINITION Id_doa_dseType */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-dseType                  OBJECT IDENTIFIER ::= {id-doa 0}
// ```
//
//
var Id_doa_dseType asn1.ObjectIdentifier = []int{2, 5, 12, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_dseType */ /* START_OF_SYMBOL_DEFINITION Id_doa_myAccessPoint */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-myAccessPoint            OBJECT IDENTIFIER ::= {id-doa 1}
// ```
//
//
var Id_doa_myAccessPoint asn1.ObjectIdentifier = []int{2, 5, 12, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_myAccessPoint */ /* START_OF_SYMBOL_DEFINITION Id_doa_superiorKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-superiorKnowledge        OBJECT IDENTIFIER ::= {id-doa 2}
// ```
//
//
var Id_doa_superiorKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_superiorKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_doa_specificKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-specificKnowledge        OBJECT IDENTIFIER ::= {id-doa 3}
// ```
//
//
var Id_doa_specificKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_specificKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_doa_nonSpecificKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-nonSpecificKnowledge     OBJECT IDENTIFIER ::= {id-doa 4}
// ```
//
//
var Id_doa_nonSpecificKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_nonSpecificKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_doa_supplierKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-supplierKnowledge        OBJECT IDENTIFIER ::= {id-doa 5}
// ```
//
//
var Id_doa_supplierKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_supplierKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_doa_consumerKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-consumerKnowledge        OBJECT IDENTIFIER ::= {id-doa 6}
// ```
//
//
var Id_doa_consumerKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_consumerKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_doa_secondaryShadows */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-secondaryShadows         OBJECT IDENTIFIER ::= {id-doa 7}
// ```
//
//
var Id_doa_secondaryShadows asn1.ObjectIdentifier = []int{2, 5, 12, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_secondaryShadows */ /* START_OF_SYMBOL_DEFINITION Id_doa_ditBridgeKnowledge */
// ### ASN.1 Definition:
//
// ```asn1
// id-doa-ditBridgeKnowledge       OBJECT IDENTIFIER ::= {id-doa 8}
// ```
//
//
var Id_doa_ditBridgeKnowledge asn1.ObjectIdentifier = []int{2, 5, 12, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_doa_ditBridgeKnowledge */ /* START_OF_SYMBOL_DEFINITION Id_kmr_accessPointMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-kmr-accessPointMatch         OBJECT IDENTIFIER ::= {id-kmr 0}
// ```
//
//
var Id_kmr_accessPointMatch asn1.ObjectIdentifier = []int{2, 5, 14, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_kmr_accessPointMatch */ /* START_OF_SYMBOL_DEFINITION Id_kmr_masterShadowMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-kmr-masterShadowMatch        OBJECT IDENTIFIER ::= {id-kmr 1}
// ```
//
//
var Id_kmr_masterShadowMatch asn1.ObjectIdentifier = []int{2, 5, 14, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_kmr_masterShadowMatch */ /* START_OF_SYMBOL_DEFINITION Id_kmr_supplierConsumerMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-kmr-supplierConsumerMatch    OBJECT IDENTIFIER ::= {id-kmr 2}
// ```
//
//
var Id_kmr_supplierConsumerMatch asn1.ObjectIdentifier = []int{2, 5, 14, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_kmr_supplierConsumerMatch */ /* START_OF_SYMBOL_DEFINITION Id_kmr_supplierConsumersMatch */
// ### ASN.1 Definition:
//
// ```asn1
// id-kmr-supplierConsumersMatch   OBJECT IDENTIFIER ::= {id-kmr 3}
// ```
//
//
var Id_kmr_supplierConsumersMatch asn1.ObjectIdentifier = []int{2, 5, 14, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_kmr_supplierConsumersMatch */ /* START_OF_SYMBOL_DEFINITION SupplierOrConsumerInformationMatch_AssertionType */
// ### ASN.1 Definition:
//
// ```asn1
// supplierOrConsumerInformationMatch-AssertionType ::= SEQUENCE { -- REMOVED_FROM_UNNESTING -- }
// ```
//
//
type SupplierOrConsumerInformationMatch_AssertionType struct {
	Ae_title             Name `asn1:"explicit,tag:0"`
	Agreement_identifier int  `asn1:"explicit,tag:2"`
}

/* END_OF_SYMBOL_DEFINITION SupplierOrConsumerInformationMatch_AssertionType */
