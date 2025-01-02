package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	id-op-binding-shadow                     OBJECT IDENTIFIER ::= {id-ob 1}
var Id_op_binding_shadow asn1.ObjectIdentifier = []int{2, 5, 19, 1}

// # ASN.1 Definition:
//
//	id-op-binding-hierarchical               OBJECT IDENTIFIER ::= {id-ob 2}
var Id_op_binding_hierarchical asn1.ObjectIdentifier = []int{2, 5, 19, 2}

// # ASN.1 Definition:
//
//	id-op-binding-non-specific-hierarchical  OBJECT IDENTIFIER ::= {id-ob 3}
var Id_op_binding_non_specific_hierarchical asn1.ObjectIdentifier = []int{2, 5, 19, 3}
