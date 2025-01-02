package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	DAP-OSI-PDUs ::= OSI-PDU{directoryAccessAC}
type DAP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	DSP-OSI-PDUs ::= OSI-PDU{directorySystemAC}
type DSP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	DOP-OSI-PDUs ::= OSI-PDU{directoryOperationalBindingManagementAC}
type DOP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	ShadowSupplierInitiatedDISP-OSI-PDUs ::= OSI-PDU{shadowSupplierInitiatedAC}
type ShadowSupplierInitiatedDISP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	ShadowSupplierInitiatedAsynchronousDISP-OSI-PDUs ::= OSI-PDU{shadowSupplierInitiatedAsynchronousAC}
type ShadowSupplierInitiatedAsynchronousDISP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	ShadowConsumerInitiatedDISP-OSI-PDUs ::= OSI-PDU{shadowConsumerInitiatedAC}
type ShadowConsumerInitiatedDISP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	ShadowConsumerInitiatedAsynchronousDISP-OSI-PDUs ::= OSI-PDU{shadowConsumerInitiatedAsynchronousAC}
type ShadowConsumerInitiatedAsynchronousDISP_OSI_PDUs = OSI_PDU

// # ASN.1 Definition:
//
//	id-as-directoryAccessAS                       OBJECT IDENTIFIER ::= {id-as 1}
var Id_as_directoryAccessAS asn1.ObjectIdentifier = []int{2, 5, 9, 1}

// # ASN.1 Definition:
//
//	id-as-directorySystemAS                       OBJECT IDENTIFIER ::= {id-as 2}
var Id_as_directorySystemAS asn1.ObjectIdentifier = []int{2, 5, 9, 2}

// # ASN.1 Definition:
//
//	id-as-directoryShadowAS                       OBJECT IDENTIFIER ::= {id-as 3}
var Id_as_directoryShadowAS asn1.ObjectIdentifier = []int{2, 5, 9, 3}

// # ASN.1 Definition:
//
//	id-as-directoryOperationalBindingManagementAS OBJECT IDENTIFIER ::= {id-as 4}
var Id_as_directoryOperationalBindingManagementAS asn1.ObjectIdentifier = []int{2, 5, 9, 4}

// # ASN.1 Definition:
//
//	id-acseAS                                     OBJECT IDENTIFIER ::= {joint-iso-itu-t association-control(2) abstract-syntax(1) apdus(0) version(1)}
var Id_acseAS asn1.ObjectIdentifier = []int{2, 2, 1, 0, 1}

// # ASN.1 Definition:
//
//	id-ac-directoryAccessAC                       OBJECT IDENTIFIER ::= {id-ac 1}
var Id_ac_directoryAccessAC asn1.ObjectIdentifier = []int{2, 5, 3, 1}

// # ASN.1 Definition:
//
//	id-ac-directorySystemAC                       OBJECT IDENTIFIER ::= {id-ac 2}
var Id_ac_directorySystemAC asn1.ObjectIdentifier = []int{2, 5, 3, 2}

// # ASN.1 Definition:
//
//	id-ac-directoryOperationalBindingManagementAC OBJECT IDENTIFIER ::= {id-ac 3}
var Id_ac_directoryOperationalBindingManagementAC asn1.ObjectIdentifier = []int{2, 5, 3, 3}

// # ASN.1 Definition:
//
//	id-ac-shadowConsumerInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 4}
var Id_ac_shadowConsumerInitiatedAC asn1.ObjectIdentifier = []int{2, 5, 3, 4}

// # ASN.1 Definition:
//
//	id-ac-shadowSupplierInitiatedAC               OBJECT IDENTIFIER ::= {id-ac 5}
var Id_ac_shadowSupplierInitiatedAC asn1.ObjectIdentifier = []int{2, 5, 3, 5}

// # ASN.1 Definition:
//
//	id-ac-shadowSupplierInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 8}
var Id_ac_shadowSupplierInitiatedAsynchronousAC asn1.ObjectIdentifier = []int{2, 5, 3, 8}

// # ASN.1 Definition:
//
//	id-ac-shadowConsumerInitiatedAsynchronousAC   OBJECT IDENTIFIER ::= {id-ac 9}
var Id_ac_shadowConsumerInitiatedAsynchronousAC asn1.ObjectIdentifier = []int{2, 5, 3, 9}
