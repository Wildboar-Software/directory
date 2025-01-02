package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
// id-avlprot          OBJECT IDENTIFIER ::= {id-wrprot 0}
var Id_avlprot asn1.ObjectIdentifier = []int{2, 5, 43, 0} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-casubprot        OBJECT IDENTIFIER ::= {id-wrprot 1}
var Id_casubprot asn1.ObjectIdentifier = []int{2, 5, 43, 1} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-tbprot           OBJECT IDENTIFIER ::= {id-wrprot 2}
var Id_tbprot asn1.ObjectIdentifier = []int{2, 5, 43, 2} /* OBJECT_IDENTIFIER */
