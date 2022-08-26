package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION DAP_IDM_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DAP-IDM-PDUs  ::=  IDM-PDU{dap-ip}
// ```
type DAP_IDM_PDUs = IDM_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DAP_IDM_PDUs */ /* START_OF_SYMBOL_DEFINITION DSP_IDM_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DSP-IDM-PDUs  ::=  IDM-PDU{dsp-ip}
// ```
type DSP_IDM_PDUs = IDM_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DSP_IDM_PDUs */ /* START_OF_SYMBOL_DEFINITION DISP_IDM_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DISP-IDM-PDUs  ::=  IDM-PDU{disp-ip}
// ```
type DISP_IDM_PDUs = IDM_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DISP_IDM_PDUs */ /* START_OF_SYMBOL_DEFINITION DOP_IDM_PDUs */
// ### ASN.1 Definition:
//
// ```asn1
// DOP-IDM-PDUs  ::=  IDM-PDU{dop-ip}
// ```
type DOP_IDM_PDUs = IDM_PDU // DefinedType
/* END_OF_SYMBOL_DEFINITION DOP_IDM_PDUs */ /* START_OF_SYMBOL_DEFINITION Id_idm_dap */
// ### ASN.1 Definition:
//
// ```asn1
// id-idm-dap  OBJECT IDENTIFIER ::= {id-idm 0}
// ```
//
//
var Id_idm_dap asn1.ObjectIdentifier = []int{2, 5, 33, 0} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_idm_dap */ /* START_OF_SYMBOL_DEFINITION Id_idm_dsp */
// ### ASN.1 Definition:
//
// ```asn1
// id-idm-dsp  OBJECT IDENTIFIER ::= {id-idm 1}
// ```
//
//
var Id_idm_dsp asn1.ObjectIdentifier = []int{2, 5, 33, 1} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_idm_dsp */ /* START_OF_SYMBOL_DEFINITION Id_idm_disp */
// ### ASN.1 Definition:
//
// ```asn1
// id-idm-disp OBJECT IDENTIFIER ::= {id-idm 2}
// ```
//
//
var Id_idm_disp asn1.ObjectIdentifier = []int{2, 5, 33, 2} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_idm_disp */ /* START_OF_SYMBOL_DEFINITION Id_idm_dop */
// ### ASN.1 Definition:
//
// ```asn1
// id-idm-dop  OBJECT IDENTIFIER ::= {id-idm 3}
// ```
//
//
var Id_idm_dop asn1.ObjectIdentifier = []int{2, 5, 33, 3} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_idm_dop */
