package x500_go

import (
	"encoding/asn1"
)

/* START_OF_SYMBOL_DEFINITION LdapSyntaxDescription */
// ### ASN.1 Definition:
//
// ```asn1
// LdapSyntaxDescription ::= SEQUENCE {
//   identifier               SYNTAX-NAME.&id,
//   description              UnboundedDirectoryString OPTIONAL,
//   ... }
// ```
//
//
type LdapSyntaxDescription struct {
	Identifier  asn1.ObjectIdentifier
	Description UnboundedDirectoryString `asn1:"optional"`
}

/* END_OF_SYMBOL_DEFINITION LdapSyntaxDescription */ /* START_OF_SYMBOL_DEFINITION Id_lat_namingContexts */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-namingContexts                     OBJECT IDENTIFIER ::= {id-lat 5}
// ```
//
//
var Id_lat_namingContexts asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_namingContexts */ /* START_OF_SYMBOL_DEFINITION Id_lat_altServer */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-altServer                          OBJECT IDENTIFIER ::= {id-lat 6}
// ```
//
//
var Id_lat_altServer asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 6} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_altServer */ /* START_OF_SYMBOL_DEFINITION Id_lat_supportedExtension */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-supportedExtension                 OBJECT IDENTIFIER ::= {id-lat 7}
// ```
//
//
var Id_lat_supportedExtension asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 7} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_supportedExtension */ /* START_OF_SYMBOL_DEFINITION Id_lat_supportedControl */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-supportedControl                   OBJECT IDENTIFIER ::= {id-lat 13}
// ```
//
//
var Id_lat_supportedControl asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 13} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_supportedControl */ /* START_OF_SYMBOL_DEFINITION Id_lat_supportedSASLMechanisms */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-supportedSASLMechanisms            OBJECT IDENTIFIER ::= {id-lat 14}
// ```
//
//
var Id_lat_supportedSASLMechanisms asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 14} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_supportedSASLMechanisms */ /* START_OF_SYMBOL_DEFINITION Id_lat_supportedLDAPVersion */
// ### ASN.1 Definition:
//
// ```asn1
// id-lat-supportedLDAPVersion               OBJECT IDENTIFIER ::= {id-lat 15}
// ```
//
//
var Id_lat_supportedLDAPVersion asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 15} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_lat_supportedLDAPVersion */ /* START_OF_SYMBOL_DEFINITION Id_soa_ldapSyntaxes */
// ### ASN.1 Definition:
//
// ```asn1
// id-soa-ldapSyntaxes                       OBJECT IDENTIFIER ::= {id-lat 16}
// ```
//
//
var Id_soa_ldapSyntaxes asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 1466, 101, 120, 16} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_soa_ldapSyntaxes */ /* START_OF_SYMBOL_DEFINITION Id_oat_supportedFeatures */
// ### ASN.1 Definition:
//
// ```asn1
// id-oat-supportedFeatures                  OBJECT IDENTIFIER ::= {id-oat 5}
// ```
//
//
var Id_oat_supportedFeatures asn1.ObjectIdentifier = []int{1, 3, 6, 1, 4, 1, 4203, 1, 3, 5} /* OBJECT_IDENTIFIER */
/* END_OF_SYMBOL_DEFINITION Id_oat_supportedFeatures */
