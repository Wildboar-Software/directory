# Roadmap

We will not promise any particular schedule of delivery of features or bug fixes
at this time. However, the very high-level roadmap for Meerkat DSA can be
broken down to these phases:

## Version 1.0.0 / Minimally-Viable Product

A minimally-viable product. Possible bugs and security vulnerabilities that
can only be exploited with network access. At this stage, Meerkat DSA is
generally expected to only be used as an identity provider, a private data store
running on a private network, or a fully-public data store containing
non-sensitive information.

Since few DSAs are expected to exist at this time, distributed operation will be
of secondary importance, and likely to have bugs if it works at all.

Notable features to be excluded from this release are:

- Service administrative areas
- Password administrative areas
- Cross References
- Rule-Based Access Control
- Shadowing via the DISP
- LDAP Syntaxes for Public Key Infrastructure Types
- Results Signing
- Signature Checking
- Strong Credentials
- SASL Authentication

Version 1.0.0 is expected to be released by late January of 2022.

## Feature Completeness

After release of the minimally-viable product, the remaining features needed to
adhere to the X.500 standards will be implemented, which are named in the
section above.

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

It is expected that, before this is implemented, Quote Administrative Areas
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
