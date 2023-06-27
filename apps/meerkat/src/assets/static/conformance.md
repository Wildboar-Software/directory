# Conformance

In the statements below, the term "Meerkat DSA" refers to version 2.6.0 of
Meerkat DSA, hence these statements are only claimed for version 2.6.0 of
Meerkat DSA.

## X.519 Conformance Statement

The following conformance statement is intended to conform to the conformance
statement requirements specified in International Telecommunications Union
Recommendation X.519 (2019), Section 13.

### Section 13.2.1 Conformance

#### A. Protocol Support

Meerkat DSA does not support any application contexts.

The following is an exhaustive list of all Internet-Directly-Mapped (IDM) protocols supported:

| Protocol                                                | Object Identifier  |
|---------------------------------------------------------|--------------------|
| Directory Access Protocol (DAP)                         | 2.5.33.0           |
| Directory System Protocol (DSP)                         | 2.5.33.1           |
| Directory Operational Binding Management Protocol (DOP) | 2.5.33.3           |

The following is an exhaustive list of all ISO Transport Over TCP (ITOT) application contexts supported:

| Protocol                                                | Object Identifier  |
|---------------------------------------------------------|--------------------|
| Directory Access Protocol (DAP)                         | 2.5.3.1            |
| Directory System Protocol (DSP)                         | 2.5.3.2            |
| Directory Operational Binding Management Protocol (DOP) | 2.5.3.3            |

#### B. Operational Binding Support

| Supported? | Operational Binding Type                           | Object Identifier  |
|------------|----------------------------------------------------|--------------------|
| Yes        | Hierarchical Operational Binding (HOB)             | 2.5.19.2           |
| Yes        | Non-Specific Hierarchical Operation Binding (NHOB) | 2.5.19.3           |
| No         | Shadowing Operational Binding (SOB)                | 2.5.19.1           |

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
| No         | External        |
| No         | SPKM            |
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
| No         | External        |
| No         | SPKM            |

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

#### H. Object Classes

Meerkat DSA supports all of the object classes defined in the
International Telecommunication Union's Recommendation X.521 (2019).

In addition to this, Meerkat DSA is extensible, such that it can be configured
to accommodate any object class. Despite this, Meerkat DSA is hard-coded to
support the Recommendation X.521 selected object classes, so those will always
be supported.

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

Meerkat DSA **does not** support Rule-Based Access Control.

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
