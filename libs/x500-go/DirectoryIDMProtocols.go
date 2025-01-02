package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
// DAP-IDM-PDUs  ::=  IDM-PDU{dap-ip}
type DAP_IDM_PDUs = IDM_PDU // DefinedType
// # ASN.1 Definition:
//
// DSP-IDM-PDUs  ::=  IDM-PDU{dsp-ip}
type DSP_IDM_PDUs = IDM_PDU // DefinedType
// # ASN.1 Definition:
//
// DISP-IDM-PDUs  ::=  IDM-PDU{disp-ip}
type DISP_IDM_PDUs = IDM_PDU // DefinedType
// # ASN.1 Definition:
//
// DOP-IDM-PDUs  ::=  IDM-PDU{dop-ip}
type DOP_IDM_PDUs = IDM_PDU // DefinedType
// # ASN.1 Definition:
//
// id-idm-dap  OBJECT IDENTIFIER ::= {id-idm 0}
var Id_idm_dap asn1.ObjectIdentifier = []int{2, 5, 33, 0} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-idm-dsp  OBJECT IDENTIFIER ::= {id-idm 1}
var Id_idm_dsp asn1.ObjectIdentifier = []int{2, 5, 33, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-idm-disp OBJECT IDENTIFIER ::= {id-idm 2}
var Id_idm_disp asn1.ObjectIdentifier = []int{2, 5, 33, 2} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-idm-dop  OBJECT IDENTIFIER ::= {id-idm 3}
var Id_idm_dop asn1.ObjectIdentifier = []int{2, 5, 33, 3} /* OBJECT_IDENTIFIER */
