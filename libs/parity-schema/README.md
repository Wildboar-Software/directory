# TypeScript X.500 Schema for Functional Parity with LDAP

This project contains the TypeScript compilation of X.500 Schema in the
`docs/modules` folder, which was created to provide the functionality provided
by IANA-registered LDAP schema and the operational schema of popular LDAP
servers to X.500 directories, referred to by name as "the parity schema."

For instance, many LDAP servers support the `posixAccount` object class, but
this class was defined in LDAP / LDIF notation. This, among many other such
schema objects, has been converted into proper X.500 ASN.1 schema, and compiled
using [Wildboar Software](https://wildboarsoftware.com/en)'s
[ASN.1 Compiler](https://wildboarsoftware.com/en/asn1-compilation).
