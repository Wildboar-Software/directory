package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	Code  ::=  CHOICE {
//	  local   INTEGER,
//	  global  OBJECT IDENTIFIER,
//	  ... }
type Code = asn1.RawValue

// # ASN.1 Definition:
//
//	InvokeId  ::=  CHOICE {
//	  present  INTEGER,
//	  absent   NULL,
//	  ... }
type InvokeId = asn1.RawValue
