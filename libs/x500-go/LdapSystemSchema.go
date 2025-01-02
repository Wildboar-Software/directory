package x500_go

import (
	"encoding/asn1"
)

// # ASN.1 Definition:
//
//	LdapSyntaxDescription ::= SEQUENCE {
//	  identifier               SYNTAX-NAME.&id,
//	  description              UnboundedDirectoryString OPTIONAL,
//	  ... }
type LdapSyntaxDescription struct {
	Identifier  asn1.ObjectIdentifier
	Description UnboundedDirectoryString `asn1:"optional"`
}

// # ASN.1 Definition:
//
// id-lat-namingContexts                     OBJECT IDENTIFIER ::= {id-lat 5}
var Id_lat_namingContexts asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 5} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-lat-altServer                          OBJECT IDENTIFIER ::= {id-lat 6}
var Id_lat_altServer asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 6} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-lat-supportedExtension                 OBJECT IDENTIFIER ::= {id-lat 7}
var Id_lat_supportedExtension asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 7} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-lat-supportedControl                   OBJECT IDENTIFIER ::= {id-lat 13}
var Id_lat_supportedControl asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 13} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-lat-supportedSASLMechanisms            OBJECT IDENTIFIER ::= {id-lat 14}
var Id_lat_supportedSASLMechanisms asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 14} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-lat-supportedLDAPVersion               OBJECT IDENTIFIER ::= {id-lat 15}
var Id_lat_supportedLDAPVersion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 15} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-soa-ldapSyntaxes                       OBJECT IDENTIFIER ::= {id-lat 16}
var Id_soa_ldapSyntaxes asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 16} /* OBJECT_IDENTIFIER */
// # ASN.1 Definition:
//
// id-oat-supportedFeatures                  OBJECT IDENTIFIER ::= {id-oat 5}
var Id_oat_supportedFeatures asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 4203, 1, 3, 5} /* OBJECT_IDENTIFIER */
