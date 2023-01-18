# Changelog for Meerkat DSA

## Version 2.0.0

- Password Administration
- Password Assertion via the `compare` operation
- Remote password checking via the `compare` operation during binding
- Nearly doubled performance for most workloads
- TLS Debugging Options
  - The ability to log (pre-)master secrets, either to the log or to a separate file
  - The ability to print OpenSSL trace information

## Version 1.3.0

### Changes

- Support ISO Transport Over TCP (ITOT), as defined in [IETF RFC 1006](https://datatracker.ietf.org/doc/html/rfc1006).
  - This is supported both when Meerkat DSA acts as a server and as a client (in DSP, DOP, or DISP, for instance).
  - It is recommended that you leave this disabled unless you need it for some reason.
- Introduce missing LDAP syntaxes:
    - `utmCoordinates`
    - `uiiForm`
    - `epcForm`
    - `countryString3c`
    - `countryString3n`
    - `dnsString`
    - `intEmailString`
    - `jidString`
- Reject chaining to any TCP port that has the same port as the DBMS.
  - This is a security feature to prevent malicious users from tricking your DSA
    into making requests to your DBMS. (In all likelihood, your DBMS will
    probably just interpret these as corrupt packets, but there is a _chance_
    that it might not!)

### Announcement

Wildboar Software is now maintaining the
[ISO Development Environment](https://en.wikipedia.org/wiki/ISO_Development_Environment)!
This massive project contains an X.500 directory that was implemented in the
early 90s called "Quipu." Check it out
[here](https://github.com/Wildboar-Software/isode)! It was recently updated in a
[BountySource challenge](https://app.bountysource.com/issues/109508245-will-not-compile-on-a-modern-linux-system-bounty)
to run on modern Linux systems, such as Ubuntu. Thank you
[@abcpro1](https://github.com/abcpro1) for your work on this!

Part of the rationale for prioritizing ITOT support was for integration testing
with Quipu DSA. The `@wildboar/rose-transport` and `@wildboar/x500-client-ts`
libraries have been tested with Quipu DSA, but Meerkat DSA has not been
integration-tested with Quipu DSA yet. However, this is in the works!

More documentation about Quipu DSA, the X.500 libraries, terminal client, and
other tools found within ISODE will be added soon!

### Next Developments

No promises, but the current plan is to work on X.500 clients and SDKs next so
that X.500 directories can be easily used. These include:

- A Rust SDK / Library
  - This will open up possibilities for PAM modules, Linux kernel modules, and more!
- A Golang SDK / Library (which is already [partially complete](https://github.com/Wildboar-Software/directory/tree/master/libs/x500-go))
- A [PassportJS](https://www.passportjs.org/) Strategy

Depending on how long this takes, work may also begin on an X.500 GUI client!

## Version 1.2.7

- Fix excessively frequent database report telemetry.

## Version 1.2.6

- Fix crashes caused by use of telemetry.

## Version 1.2.5

- Fix use of `ManageDSAIT` control in LDAP not returning most search results.
  - This was caused because of a deviation in behavior from LDAP and DAP. Code
    was added so that LDAP behaves as would be expected from LDAP, while leaving
    the DAP code unchanged.

No administrative action is needed to upgrade to this version. Just download it
and use it.

## Version 1.2.4

- Log much more information on LDAP searches
  - Almost the entire search request is logged.
  - The number of search results returned is logged.
  - This was implemented specifically to make it easier to diagnose issues with
    integration with tools that use LDAP authentication. Often, LDAP searches
    are used to enumerate users, so it is important to be able to debug these.
- Log bound distinguished names if the `MEERKAT_LOG_BOUND_DN` environment
  variable is set to `1`.

No administrative action is needed to upgrade to this version. Just download it
and use it.

## Version 1.2.3

- Fixed a bug where `uid` and `dc` did not have LDAP names.

No administrative action is needed to upgrade to this version. Just download it
and use it.

## Version 1.2.2

- Fixed access controls being too restrictive on LDAP users. Now LDAP user
  access controls work just like DAP user access controls.
- Added the `MEERKAT_REVEAL_USER_PWD` configuration option, which allows for
  hashed password values to be disclosed in the `userPwd` attribute.

No administrative action is needed to upgrade to this version. Just download it
and use it.

## Version 1.2.1

- Fixed invalid object classes, such as `inetOrgPerson`, which did not permit
  some optional attributes that it should have, such as `mail`.

No administrative action is needed to upgrade to this version. Just download it
and use it.

## Version 1.2.0

- The List Continuation Reference (LCR) procedure is now supported.
- Fixed a bug where continuation references produced during the `list` operation
  where not added to the partial outcome qualifier in the result.
- Fixed a security vulnerability where the names of subordinate references could
  be disclosed in a `search` operation to clients not authorized to see it.
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
