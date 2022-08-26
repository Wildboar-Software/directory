package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION Code */
// ### ASN.1 Definition:
//
// ```asn1
// Code  ::=  CHOICE {
//   local   INTEGER,
//   global  OBJECT IDENTIFIER,
//   ... }
// ```
type Code = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION Code */ /* START_OF_SYMBOL_DEFINITION InvokeId */
// ### ASN.1 Definition:
//
// ```asn1
// InvokeId  ::=  CHOICE {
//   present  INTEGER,
//   absent   NULL,
//   ... }
// ```
type InvokeId = asn1.RawValue

/* END_OF_SYMBOL_DEFINITION InvokeId */
