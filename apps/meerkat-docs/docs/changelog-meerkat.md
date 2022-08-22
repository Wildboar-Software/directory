# Changelog for Meerkat DSA

## Version 1.2.0

- The List Continuation Reference (LCR) procedure is now supported.
- Fixed a bug where continuation references produced during the `list` operation
  where not added to the partial outcome qualifier in the result.
- Almost all LDAP schema objects
  [published with IANA](https://www.iana.org/assignments/ldap-parameters/ldap-parameters.xhtml)
  and almost all X.500 schema objects defined in any ITU recommendation
  are built-in to Meerkat DSA now.
  - "Schema objects" refers to attribute types, context types, matching rules,
    LDAP syntaxes, object classes, and name forms.
  - These schema objects include those to support:
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
    - And more!
  - Many new operational attributes are supported, such as:
    - `vendorName`
    - `vendorVersion`
    - `administratorsAddress`
    - `entryDN`
    - `superiorUUID`
  - Wildboar Software defined name forms for most structural object classes that
    were added to this release, to lessen the burden of setup.

## Version 1.1.0

- Distributed operation is now secure.
- Production and verification of signed arguments, results, and errors.
- Strong authentication is now supported.
- Many performance improvements.
- The web admin console may now be protected using TLS and HTTP basic.
  authentication. It is also secure against CSRF attacks.
- Fixed a bug with parsing attribute certificates.
- Fixed hidden LDAP entries that have non-LDAP attribute types in RDNs.
- Fixed display of dates and times.
- Fix bug with Trust Anchor List file decoding (not reading a `ContentInfo`).
- Search Aliases procedure used the DSA's name in the chaining arguments
  originator field. (Not a security vulnerability, though, since the association
  _was_ used for AC decisions.)
- Fix bug where entry could be created without required attribute by merely
  providing the attribute with no values.

### Migration

- `MEERKAT_TLS_CLIENT_CERT_AUTH` no longer controls `rejectUnauthorized`. This
  was a security bug. In fact, this environment variable is no longer used
  entirely. `MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS` controls mTLS. If set to
  `1`, mTLS is enforced.
- `MEERKAT_SIGNING_KEY` has been renamed to `MEERKAT_SIGNING_KEY_FILE`
- `MEERKAT_SIGNING_CERT_CHAIN` has been renamed to `MEERKAT_SIGNING_CERTS_CHAIN_FILE`
- Removed `DANGEROUSLY` from `ENABLE_DSP` and `ENABLE_DOP`
  - Just use the `ENABLE_DSP` and `ENABLE_DOP` environment variables to enable
    DSP and DOP, respectively.
