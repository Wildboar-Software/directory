package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION DAP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DAP-OSI-PDUs  ::=  OSI-PDU{directoryAccessAC}
// ```
type DAP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DAP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION DSP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DSP-OSI-PDUs  ::=  OSI-PDU{directorySystemAC}
// ```
type DSP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DSP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION DOP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DOP-OSI-PDUs  ::=  OSI-PDU{directoryOperationalBindingManagementAC}
// ```
type DOP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DOP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION ShadowSupplierInitiatedDISP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowSupplierInitiatedDISP-OSI-PDUs  ::=  OSI-PDU{shadowSupplierInitiatedAC}
// ```
type ShadowSupplierInitiatedDISP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION ShadowSupplierInitiatedDISP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION ShadowSupplierInitiatedAsynchronousDISP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowSupplierInitiatedAsynchronousDISP-OSI-PDUs  ::=
//   OSI-PDU{shadowSupplierInitiatedAsynchronousAC}
// ```
type ShadowSupplierInitiatedAsynchronousDISP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION ShadowSupplierInitiatedAsynchronousDISP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION ShadowConsumerInitiatedDISP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowConsumerInitiatedDISP-OSI-PDUs  ::=  OSI-PDU{shadowConsumerInitiatedAC}
// ```
type ShadowConsumerInitiatedDISP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION ShadowConsumerInitiatedDISP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION ShadowConsumerInitiatedAsynchronousDISP_OSI_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// ShadowConsumerInitiatedAsynchronousDISP-OSI-PDUs  ::=
//   OSI-PDU{shadowConsumerInitiatedAsynchronousAC}
// ```
type ShadowConsumerInitiatedAsynchronousDISP_OSI_PDUs = OSI_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION ShadowConsumerInitiatedAsynchronousDISP_OSI_PDUs */ /* START_OF_SYMBOL_DEFINITION Id_as_directoryAccessAS */
// ### ASN.1 Definition:
//
// ```asn1
// id-as-directoryAccessAS                       OBJECT IDENTIFIER ::= {id-as 1}
// ```
//
//
var Id_as_directoryAccessAS asn1.ObjectIdentifier = []int{2, 5, 9, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_as_directoryAccessAS */ /* START_OF_SYMBOL_DEFINITION Id_as_directorySystemAS */
// ### ASN.1 Definition:
//
// ```asn1
// id-as-directorySystemAS                       OBJECT IDENTIFIER ::= {id-as 2}
// ```
//
//
var Id_as_directorySystemAS asn1.ObjectIdentifier = []int{2, 5, 9, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_as_directorySystemAS */ /* START_OF_SYMBOL_DEFINITION Id_as_directoryShadowAS */
// ### ASN.1 Definition:
//
// ```asn1
// id-as-directoryShadowAS                       OBJECT IDENTIFIER ::= {id-as 3}
// ```
//
//
var Id_as_directoryShadowAS asn1.ObjectIdentifier = []int{2, 5, 9, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_as_directoryShadowAS */ /* START_OF_SYMBOL_DEFINITION Id_as_directoryOperationalBindingManagementAS */
// ### ASN.1 Definition:
//
// ```asn1
// id-as-directoryOperationalBindingManagementAS OBJECT IDENTIFIER ::= {id-as 4}
// ```
//
//
var Id_as_directoryOperationalBindingManagementAS asn1.ObjectIdentifier = []int{2, 5, 9, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_as_directoryOperationalBindingManagementAS */ /* START_OF_SYMBOL_DEFINITION Id_acseAS */
// ### ASN.1 Definition:
//
// ```asn1
// id-acseAS                                     OBJECT IDENTIFIER ::= {joint-iso-itu-t association-control(2) abstract-syntax(1) apdus(0) version(1)}
// ```
//
//
var Id_acseAS asn1.ObjectIdentifier = []int{2, 2, 1, 0, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_acseAS */ /* START_OF_SYMBOL_DEFINITION Id_ac_directoryAccessAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-directoryAccessAC                       OBJECT IDENTIFIER ::= {id-ac 1}
// ```
//
//
var Id_ac_directoryAccessAC asn1.ObjectIdentifier = []int{2, 5, 3, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_directoryAccessAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_directorySystemAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-directorySystemAC                       OBJECT IDENTIFIER ::= {id-ac 2}
// ```
//
//
var Id_ac_directorySystemAC asn1.ObjectIdentifier = []int{2, 5, 3, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_directorySystemAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_directoryOperationalBindingManagementAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-directoryOperationalBindingManagementAC OBJECT IDENTIFIER ::= {id-ac 3}
// ```
//
//
var Id_ac_directoryOperationalBindingManagementAC asn1.ObjectIdentifier = []int{2, 5, 3, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_directoryOperationalBindingManagementAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_shadowConsumerInitiatedAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-shadowConsumerInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 4}
// ```
//
//
var Id_ac_shadowConsumerInitiatedAC asn1.ObjectIdentifier = []int{2, 5, 3, 4} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_shadowConsumerInitiatedAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_shadowSupplierInitiatedAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-shadowSupplierInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 5}
// ```
//
//
var Id_ac_shadowSupplierInitiatedAC asn1.ObjectIdentifier = []int{2, 5, 3, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_shadowSupplierInitiatedAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_shadowSupplierInitiatedAsynchronousAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-shadowSupplierInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 8}
// ```
//
//
var Id_ac_shadowSupplierInitiatedAsynchronousAC asn1.ObjectIdentifier = []int{2, 5, 3, 8} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_shadowSupplierInitiatedAsynchronousAC */ /* START_OF_SYMBOL_DEFINITION Id_ac_shadowConsumerInitiatedAsynchronousAC */
// ### ASN.1 Definition:
//
// ```asn1
// id-ac-shadowConsumerInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 9}
// ```
//
//
var Id_ac_shadowConsumerInitiatedAsynchronousAC asn1.ObjectIdentifier = []int{2, 5, 3, 9} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_ac_shadowConsumerInitiatedAsynchronousAC */
