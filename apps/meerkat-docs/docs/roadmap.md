# Roadmap

We will not promise any particular schedule of delivery of features or bug fixes
at this time. However, the very high-level roadmap for Meerkat DSA can be
broken down to the following versions.

## Version 2.1.0 - SCR Procedure

This update will introduce support for the Search Continuation Reference (SCR)
procedure, which will allow your search requests to results spanning across
DSAs. This update will also include some minor performance enhancements.

Beyond that, a lot of work done around this time will focus on SDKs, clients,
and other tooling.

## Version 2.2.0 - Hierarchy Selection and Cross References

This update will introduce support for hierarchical selections. This means
that searches can traverse a "virtual" hierarchy that lays atop the real
hierarchical structure of the DIT. This update will also introduce support for
cross references, allowing DSAs to share routing information pertaining to other
known DSAs. This will allow the entire DIT to become more discoverable and
performant.

## Version 2.3.0 - Service Administration

This update will introduce support for service administrative areas. This allows
directory administrators to limit (including rate limit) what kind of searches
may be performed. Service administrative areas can set a "lower boundary" on
subtree searches.

## Version 2.4.0 - Schema Update ("Wildboar Schema")

This update will introduce thousands of new schema objects defined by Wildboar
Software into the default schema. This is desirable so that X.500 directories
can build upon a common framework of mutually-understood schemata, rather than
"re-inventing the wheel" each in isolation from each other. For instance, there
may be a desire for X.500 directories to store marital information about users,
using a `married` auxiliary object class that permits the presence of a
`spouseDN` attribute in an entry. It would be unfortunate for directory
administrators everywhere to define their own equivalent object classes, thereby
duplicating work and reducing inter-domain compatibility.

## Version 2.5.0 - Non-Specific Subordinate References (NSSRs)

This update will introduce support for Non-Specific Subordinate References
(NSSRs). These are entries whose subordinate namespace is a "free-for-all"
among one or more participating DSAs.

## Version 2.6.0 - Zonal Matching

This update will introduce zonal matching, whereby a DSA can perform
geographically-intelligent searches.

## Version 2.7.0 - Shadowing

This update will introduce support for the Directory Information Shadowing
Protocol (DISP). This will allow directory information to be replicated to
other DSAs to produce read-only copies.

## Version 2.8.0 and Beyond

Not much can be said about anything this far in the future. However, these
features need to be introduced at some point:

- SASL Authentication, allowing alternative authentication mechanisms
- Rule-Based Access Control, allowing an alternative access control mechanism
  - This might _not_ be supported, because its semantics are extremely vague.

## Integration, Scalability, and Security

It is assumed that, after a few months or years of existence, there will be
many Meerkat DSA instances running, and much more data stored in DSAs. As such,
it will be more important for Meerkat DSA to be scalable, secure, and capable
of integration.

After extensive testing as an identity provider and private database, and
particularly after rigorous security testing, distributed operation will be
a primary focus of this phase.

Scalability will be a parameter of this phase; Meerkat DSA will be hardened
against denial-of-service attacks, excessive resource consumption, and generally
heavily tuned for performance.

It is expected that, before this is implemented, Quota Administrative Areas
will be implemented, which will be a new administrative area type defined by
Meerkat DSA that rate-limits user activity.

Support for other databases may be added to help increase adoption.

## Advanced Features

After proving itself as a fully-featured, X.500-compliant DSA, Meerkat DSA will
gain new features that make it even better than the directory service
envisioned by the X.500 specification authors. These advanced features are:

- LDIF uploads
- ZeroMQ Transport
- Onion Routing
- Multiple Password Hashes
- OpenLDAP-like access control
- XML Encoding Rules (XER) Support
- Directory Service Markup Language (DSML) Support
- SCIM Support (Maybe)
- gRPC API
- LDAP-to-JSON API
- Storage Administrative Areas
- IPFS
- Blockchain Integration

## Enterprise Features

Yes, there will eventually be a paid version of Meerkat DSA.

This is not really a coherent phase, since enterprise features will be developed
alongside all other phases, but enterprise users will have these features:

- SNMP Monitoring
- Analytic Extensions
- User Behavior Analytics
- Legal Hold
- Compliance Features
- Webhooks
- SMTP and SMS notifications
- Audit Logging
- Active Directory Integration
- PKI-related features
  - Generate keypair and cert for an entry
  - Generate attribute certificate for an entry
- Automation

## Never Will Support

- LDAP `matchedValues` control, because it is a superset of the DAP
  `matchedValuesOnly` option.
- Multi-stage SASL authentication mechanisms, because the specification does not
  make it clear how the DSA is expected to return an intermediate SASL response.
  Note that the `credentials` field of a `DirectoryBindResult` is to
  authenticate the DSA to the DUA, not to provide SASL continuation.
