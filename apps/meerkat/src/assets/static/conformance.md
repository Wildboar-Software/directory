# Conformance

In the statements below, the term "Meerkat DSA" refers to version 3.2.0 of
Meerkat DSA, hence these statements are only claimed for version 3.2.0 of
Meerkat DSA.

## X.519 Conformance Statement

The following conformance statement is intended to conform to the conformance
statement requirements specified in International Telecommunications Union
Recommendation X.519 (2019), Section 13.

### Section 13.2.1 Conformance

#### A. Protocol Support

The following is an exhaustive list of all Internet-Directly-Mapped (IDM) protocols supported:

| Protocol                                                | Object Identifier  |
|---------------------------------------------------------|--------------------|
| Directory Access Protocol (DAP)                         | 2.5.33.0           |
| Directory System Protocol (DSP)                         | 2.5.33.1           |
| Directory Information Shadowing Protocol (DISP)         | 2.5.33.2           |
| Directory Operational Binding Management Protocol (DOP) | 2.5.33.3           |

The following is an exhaustive list of all ISO Transport Over TCP (ITOT) application contexts supported:

| Protocol                                                | Object Identifier  |
|---------------------------------------------------------|--------------------|
| Directory Access Protocol (DAP)                         | 2.5.3.1            |
| Directory System Protocol (DSP)                         | 2.5.3.2            |
| Directory Operational Binding Management Protocol (DOP) | 2.5.3.3            |
| Consumer-Initiated Shadowing (DISP)                     | 2.5.3.4            |
| Supplier-Initiated Shadowing (DISP)                     | 2.5.3.5            |
| Asynchronous Supplier-Initiated Shadowing (DISP)        | 2.5.3.8            |
| Asynchronous Consumer-Initiated Shadowing (DISP)        | 2.5.3.9            |

#### B. Operational Binding Support

| Supported? | Operational Binding Type                           | Object Identifier  |
|------------|----------------------------------------------------|--------------------|
| Yes        | Hierarchical Operational Binding (HOB)             | 2.5.19.2           |
| Yes        | Non-Specific Hierarchical Operation Binding (NHOB) | 2.5.19.3           |
| Yes        | Shadowing Operational Binding (SOB)                | 2.5.19.1           |

#### C. First-Level DSA Support

Meerkat DSA is capable of acting as a first-level DSA.

#### D. Chaining Support

Meerkat DSA supports chaining, and validates digital signatures on arguments,
results, and errors.

#### E. Directory Access Protocol (DAP) Authentication

Meerkat DSA supports the following bind authentication mechanisms for the
Directory Access Protocol (DAP).

| Supported? | Credential Type |
|------------|-----------------|
| Yes        | Simple          |
| Yes        | Strong          |
| Yes        | External        |
| Yes        | SPKM            |
| No         | SASL            |

Meerkat DSA supports simple authentication:

- Without a password,
- With a password, and
- With a protected password.

Meerkat DSA supports both Identity-Based Requestor Authentication (IBRA), as
described in ITU Recommendation X.518 (2019), Section 22.1.1 as well as
Signature-Based Requester Authentication (SBRA), as described in ITU
Recommendation X.518 (2019), Section 22.1.2.

Meerkat DSA supports result authentication.

#### F. Directory System Protocol (DSP) Authentication

Meerkat DSA supports the following bind authentication mechanisms for the
Directory System Protocol (DSP).

| Supported? | Credential Type |
|------------|-----------------|
| Yes        | Simple          |
| Yes        | Strong          |
| Yes        | External        |
| Yes        | SPKM            |

Meerkat DSA supports simple authentication:

- Without a password,
- With a password, and
- With a protected password.

Meerkat DSA supports both Identity-Based Requestor Authentication (IBRA), as
described in ITU Recommendation X.518 (2019), Section 22.1.1 as well as
Signature-Based Requester Authentication (SBRA), as described in ITU
Recommendation X.518 (2019), Section 22.1.2.

Meerkat DSA supports result authentication.

#### G. Attribute Types

Meerkat DSA supports all of the attribute types defined in the
International Telecommunication Union's Recommendation X.520 (2019). For
attributes having the `DirectoryString` syntax, support is present for all
defined alternatives.

In addition to this, Meerkat DSA is extensible, such that it can be configured
to accommodate any attribute type. Despite this, Meerkat DSA is hard-coded to
support the Recommendation X.520 selected attribute types, so those will always
be supported.

Meerkat DSA also comes hard-coded with what is called "parity schema," which
contains X.500 equivalents of almost all schema objects registered with IANA as
well as other LDAP schema objects used by popular LDAP servers (using
identical object identifiers). The schema hard-coded into Meerkat DSA can be
used for:

- Samba Servers / Active Directory Domain Controllers
- PGP Key Servers
- SSH Authentication
- PAM Authentication
- DNS Servers
- Java
- Sabayon Servers
- Kerberos Servers
- Email Servers
- FTP Servers
- RADIUS Servers
- Remote Calendars
- Printer Discovery
- Sudo Configuration
- LDAP Tables
- Voicemail
- X.400 Messaging
- X.952 Open Distributed Processing
- DHCP Server Configuration
- DUA Configuration
- Dynamic Groups
- Federated Filesystem
- H.323 Multimedia
- Intelligent Networks

#### H. Object Classes

Meerkat DSA supports all of the object classes defined in the
International Telecommunication Union's Recommendation X.521 (2019).

In addition to this, Meerkat DSA is extensible, such that it can be configured
to accommodate any object class. Despite this, Meerkat DSA is hard-coded to
support the Recommendation X.521 selected object classes, so those will always
be supported.

Meerkat DSA also comes hard-coded with what is called "parity schema," which
contains X.500 equivalents of almost all schema objects registered with IANA as
well as other LDAP schema objects used by popular LDAP servers (using
identical object identifiers). The schema hard-coded into Meerkat DSA can be
used for:

- Samba Servers / Active Directory Domain Controllers
- PGP Key Servers
- SSH Authentication
- PAM Authentication
- DNS Servers
- Java
- Sabayon Servers
- Kerberos Servers
- Email Servers
- FTP Servers
- RADIUS Servers
- Remote Calendars
- Printer Discovery
- Sudo Configuration
- LDAP Tables
- Voicemail
- X.400 Messaging
- X.952 Open Distributed Processing
- DHCP Server Configuration
- DUA Configuration
- Dynamic Groups
- Federated Filesystem
- H.323 Multimedia
- Intelligent Networks

#### I. Extensions Supported

These extensions are defined in International Telecommunications Union's
Recommendation X.511 (2019), Section 7.3.1.

| Extension                                          | Identifier | Supported? |
|----------------------------------------------------|------------|------------|
| Subentries                                         | 1          | Yes        |
| Copy Shall Do                                      | 2          | Yes        |
| Attribute Size Limit                               | 3          | Yes        |
| Extra Attributes                                   | 4          | Yes        |
| Modify Rights Request                              | 5          | Yes        |
| Paged Results Request                              | 6          | Yes        |
| Matched Values Only                                | 7          | Yes        |
| Extended Filter                                    | 8          | Yes        |
| Target System                                      | 9          | Yes        |
| Use Alias On Update                                | 10         | Yes        |
| New Superior                                       | 11         | Yes        |
| Manage DSAIT                                       | 12         | Yes        |
| Use of Contexts                                    | 13         | Yes        |
| Partial Name Resolution                            | 14         | Yes        |
| Overspec Filter                                    | 15         | No         |
| Selection On Modify                                | 16         | Yes        |
| Security Parameters - Operation Code               | 18         | Yes        |
| Security Parameters - Attribute Certification Path | 19         | Yes        |
| Security Parameters - Error Protection             | 20         | Yes        |
| Service Administration                             | 25         | Yes        |
| Entry Count                                        | 26         | Yes        |
| Hierarchy Selections                               | 27         | Yes        |
| Relaxation                                         | 28         | Yes        |
| Family Grouping                                    | 29         | Yes        |
| Family Return                                      | 30         | Yes        |
| Search Distinguished Name Attributes               | 31         | Yes        |
| Friend Attributes                                  | 32         | Yes        |
| Abandon of Paged Results                           | 33         | Yes        |
| Paged Results on the DSP                           | 34         | Yes        |
| Entry Modification `replaceValues`                 | 35         | Yes        |

#### J. Collective Attributes Support

Collective Attributes are completely supported by Meerkat DSA.

#### K. Hierarchical Attributes Support

All hierarchy selections are fully supported by Meerkat DSA.

#### L. Operational Attribute Types Support

All operational attribute types defined in the International Telecommunications
Union's Recommendation X.501 are supported by Meerkat DSA.

#### M. Alias Dereferencing Support

Meerkat DSA fully supports alias dereferencing as described in the
International Telecommunication Union's Recommendation X.511 (2019), Section
7.7.1.

#### N. Entry Incompleteness Indication

Meerkat DSA supports the `incompleteEntry` field in `EntryInformation` data
types to indicate that not all attributes or values requested were returned.

#### O. Object Class Modification

Meerkat DSA supports adding auxiliary object classes.

#### P. Basic Access Control

Meerkat DSA supports the Basic Access Control defined in
International Telecommunication Union's Recommendation X.501 (2019).

#### Q. Simplified Access Control

Meerkat DSA supports the Simplified Access Control defined in
International Telecommunication Union's Recommendation X.501 (2019).

#### R. Subschema Administration

Meerkat DSA supports subschema administration, and validates entries and their
names and locations against subschema, if present, as defined in
International Telecommunication Union's Recommendation X.501 (2019).

#### S. Name Forms

Meerkat DSA supports all of the name forms defined in the
International Telecommunication Union's Recommendation X.521 (2019).

In addition to this, Meerkat DSA is extensible, such that it can be configured
to accommodate any name form. Despite this, Meerkat DSA is hard-coded to
support the Recommendation X.521 name forms, so those will always be supported.

Meerkat DSA also comes hard-coded with what is called "parity schema," which
contains X.500 equivalents of almost all schema objects registered with IANA as
well as other LDAP schema objects used by popular LDAP servers (using
identical object identifiers). The schema hard-coded into Meerkat DSA can be
used for:

- Samba Servers / Active Directory Domain Controllers
- PGP Key Servers
- SSH Authentication
- PAM Authentication
- DNS Servers
- Java
- Sabayon Servers
- Kerberos Servers
- Email Servers
- FTP Servers
- RADIUS Servers
- Remote Calendars
- Printer Discovery
- Sudo Configuration
- LDAP Tables
- Voicemail
- X.400 Messaging
- X.952 Open Distributed Processing
- DHCP Server Configuration
- DUA Configuration
- Dynamic Groups
- Federated Filesystem
- H.323 Multimedia
- Intelligent Networks

#### T. Collective Attribute Administration

Collective Attributes are completely supported by Meerkat DSA.

#### U. Contexts

Meerkat DSA supports all of the context types defined in the
International Telecommunication Union's Recommendation X.520 (2019).

In addition to this, Meerkat DSA is extensible, such that it can be configured
to accommodate any context type. Despite this, Meerkat DSA is hard-coded to
support the Recommendation X.520 context types, so those will always be
supported.

#### V. Context Support

Meerkat DSA fully supports the use of contexts as defined in the
International Telecommunication Union's Recommendation X.501 (2019).

#### W. DSA Information Tree Management

Meerkat DSA supports management of the DSA Information Tree.

#### X. Rule-Based Access Control

Meerkat DSA fully supports Rule-Based Access Control (RBAC).

#### Y. Integrity of Directory Operations

This requirement is not understood by the author of Meerkat DSA, but it is
believed that this refers to the usage of attribute integrity information, which
is not supported by Meerkat DSA.

Signed requests, results, and errors _are_ supported, and their signatures are
checked for validity.

#### Z. Encrypted and Digitally-Signed Information

Meerkat DSA cannot provide access to encrypted and/or signed attributes. For
clarification, this does not mean that communications with Meerkat DSA cannot be
secured with TLS, STARTTLS, digitally-signed responses, etc: those things are
supported.

#### AA. Strong Authentication Certificate and CRL Extensions Supported

Meerkat DSA supports strong authentication, signed arguments, signed results,
and signed errors.

Meerkat DSA supports all of the X.509v3 public key certificate extensions
defined in ITU Recommendation X.509 (2019). Meerkat DSA does not support any of
the certificate revocation list extensions defined in ITU Recommendation X.509,
but most of these are always non-critical and don't impact revocation checking.
Notably, the status referral extension is critical and not understood by
Meerkat DSA.

Meerkat DSA also supports the Online Certificate Status Protocol (OCSP) and uses
it to check the validity of certification paths according to the procedures
defined in [IETF RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960), if
configured to do so.

### Section 13.2.2 Conformance

Meerkat DSA conforms to the static requirements described in ITU Recommendation
X.519 (2019), Section 13.2.2, with the following exceptions:

- Meerkat DSA does not support the `multiStrand` family grouping described in X.511 7.3.2.

In addition to this, Meerkat DSA conforms in the following respects:

- It supports the inclusion of the RelaxationPolicy construct in a search request
- It supports both mapping-based matching and matching rule substitution
  - In particular, the following mapping-based matchings are supported:
    - `postalZonalMatch` (`1.3.6.1.4.1.56490.58.1`), described [here](https://wildboar-software.github.io/directory/docs/zonal)
- All hierarchical selection options are supported.
- Meerkat DSA supports Service-specific administrative points different from
  autonomous administrative points.
- Meerkat DSA supports the context feature within search rules.
- Meerkat DSA supports the compound-entry-related features of search rules.
- Meerkat DSA supports the search relaxation feature within search rules.
- Meerkat DSA supports hierarchical groups within search rules.

### Section 13.2.3 Conformance

Meerkat DSA conforms to the static requirements described in ITU Recommendation
X.519 (2019), Section 13.2.3.

### Section 13.3.1 Conformance

Meerkat DSA is capable as acting as a shadow supplier.

#### A. Application Contexts

Meerkat DSA, as a shadow supplier, supports the following application contexts
and IDM protocols:

- `shadowSupplierInitiatedAC` (`2.5.3.5`)
- `shadowConsumerInitiatedAC` (`2.5.3.4`)
- `shadowSupplierInitiatedAsynchronousAC` (`2.5.3.8`)
- `shadowConsumerInitiatedAsynchronousAC` (`2.5.3.9`)
- `disp-ip` (`2.5.33.2`)

When the `disp-ip` IDM protocol is used, Meerkat DSA is capable of receiving
both `requestShadowUpdate` and `coordinateShadowUpdate` requests, and will
return an error if such a request does not conform to the update mode of the
shadow agreement.

#### B. Conformance Security Level

Meerkat DSA supports the use of DISP protocols over TLS for both IDM and ITOT
transports or StartTLS only when IDM transport is used. In addition to this,
the integrity of requests, results, and errors, can be (and by default, are, as
long as a signing key and certificate path are configured) secured by
cryptographic signatures. Meerkat DSA also supports the use of data
integrity contexts, but does not verify them; nevertheless, these can be used
by relying parties to further ensure data integrity. Meerkat DSA can be
configured to require strong authentication (or merely simple authentication)
for shadowing operations.

Particular to shadowing, Meerkat DSA verifies that shadow updates only update
regions within the agreed-upon shadow subtree. Meerkat DSA _does not_ verify
that two shadowed areas do not overlap; as such, two shadow suppliers could
overwrite each other's information; it is the responsibility of the
administrator to ensure no overlap.

To summarize the above: as Meerkat DSA provides point-to-point, end-to-end, and
at rest-integrity, combined with point-to-point confidentiality using TLS,
strong public-key-cryptography-based authentication, and actively verifies the
contents of shadow updates, it can be stated that Meerkat DSA supports a
"strong" security-level.

#### C. Unit of Replication of Support

Meerkat DSA supports all features of the `UnitOfReplication` used in defining
ITU Recommendation X.525 shadowing agreements, including:

- Entry filtering on `objectClass`
- Selection / exclusion of attributes via `AttributeSelection`
- Inclusion of subordinate knowledge
- Inclusion of extended knowledge
- Selection / exclusion of attribute values based on contexts

### Section 13.3.2 Conformance

Meerkat DSA conforms to the static requirements described in ITU Recommendation
X.519 (2019), Section 13.3.2, including providing support for the
`modifyTimestamp` and `createTimestamp` operational attributes.

### Section 13.3.3 Conformance

Meerkat DSA conforms to the dynamic requirements described in ITU Recommendation
X.519 (2019), Section 13.3.3. The mapping of application contexts onto OSI
services is conformant, and has been tested against Quipu and ISODE DUAs.

### Section 13.4.1 Conformance

Meerkat DSA is capable of acting as a shadow consumer.

#### A. Application Contexts

Meerkat DSA, as a shadow consumer, supports the following application contexts
and IDM protocols:

- `shadowSupplierInitiatedAC` (`2.5.3.5`)
- `shadowConsumerInitiatedAC` (`2.5.3.4`)
- `shadowSupplierInitiatedAsynchronousAC` (`2.5.3.8`)
- `shadowConsumerInitiatedAsynchronousAC` (`2.5.3.9`)
- `disp-ip` (`2.5.33.2`)

When the `disp-ip` IDM protocol is used, Meerkat DSA is capable of receiving
both `requestShadowUpdate` and `coordinateShadowUpdate` requests, and will
return an error if such a request does not conform to the update mode of the
shadow agreement.

#### B. Conformance Security Level

See "B. Conformance Security Level" above under "Section 13.3.1 Conformance."

#### C. Secondary Shadows

Meerkat DSA is capable of acting as a secondary shadow supplier. This
functionality has been tested manually.

#### D. Shadowing of Overlapping Units of Replication

Meerkat DSA neither supports overlapping units of replication, nor verifies that
all shadowing agreements do not overlap.

### Section 13.4.2 Conformance

Meerkat DSA conforms to the static requirements described in ITU Recommendation
X.519 (2019), Section 13.4.2, including providing support for the
`modifyTimestamp` and `createTimestamp` operational attributes and the
`copyShallDo` service control.

### Section 13.4.3 Conformance

Meerkat DSA conforms to the dynamic requirements described in ITU Recommendation
X.519 (2019), Section 13.4.3. The mapping of application contexts onto OSI
services is conformant, and has been tested against Quipu and ISODE DUAs.
