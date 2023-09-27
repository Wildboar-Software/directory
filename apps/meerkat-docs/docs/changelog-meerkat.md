# Changelog for Meerkat DSA

## Version 3.2.4

This version _doubles_ the speed of inserting new entries by caching
subschema subentries between invocations of the `addEntry` operation.

## Version 3.2.3

This version improves the speed of inserting new entries by about 10% by caching
schema between invocations of the `addEntry` operation.

## Version 3.2.2

This version **dramatically** improves the performance of the DSA for `search`
and `list` operations and for `addEntry` when performed in rapid succession, as
well as for a few other use cases. In general, you should see a 400% to 1000%
increase in performance.

## Version 3.2.1

Fix bug with writing to IDM sockets.

## Version 3.2.0

This new version introduces new features around authentication and chaining.

### New Features / Improvements

- Support for SPKM authentication
- Support for `externalProcedure` authentication
- Mutual binding: Meerkat DSA will now send strong credentials or SPKM
  credentials back to the client.
- Verifying credentials returned by DSAs during chaining.
- Added the [`MEERKAT_TLS_REQUEST_CERT`](./env.md#meerkat_tls_request_cert)
  option to enable the DSA to request the TLS client certificate, even when
  client certificate authentication is not enforced.

### Bug Fixes

- Fixed incorrect object identifier for the
[Simple Security Policy](./authorization.md#the-simple-security-policy).

### Upgrading

You do not have to do anything to upgrade to this version. Just update the
Meerkat DSA version.

## Version 3.1.0

This version introduces support for Rule-Based Access Control (RBAC), thereby
enabling Meerkat DSA to enforce the `rule-based-access-control`,
`rule-and-basic-access-control` and `rule-and-simple-access-control` access
control schemes defined in
[ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en).

### New Features / Improvements

- Support for Rule-Based Access Control
- Slight performance improvement when creating a new entry

### Bug Fixes

- Fix invalid OCSP requests
  - OCSP requests were made using the subject's `subjectPublicKeyInfo` rather than the issuer's.
- Fix invalid OCSP verification
  - Verification would occur using the same issuer certificate over and over again
- Fix invalid invalid remote CRL signature validation

## Version 3.0.0

The defining aspect of this version is support for cross references. Cross
references allow a DSA to "bookmark" the DSAs that were involved in servicing
a previous request, so that, in chaining subsequent requests, the correct DSA
can be used directly, rather than routing the request through a first-level DSA.

### New Features / Improvements

- Using cross references for routing purposes
- Returning cross references
- Requesting cross references from other DSAs
- More performant and correct `namingContexts` attribute
- More resilient and performant updating of superior DSAs
- Better logging surrounding name resolution
- Signature verification is faster and more resilient
- Chained results get verified
- Chained results returned from other DSAs get re-signed if they need it

### Bug Fixes

- Log invalid DSP signatures received from chained results.
- Wrong error code returned to DOP associations
  - The `operationalBindingError` was being coded as a `securityError`.
- Bug where results received from chaining could get cross-wired
  - Meaning that a request might receive a result that belongs to another
    different request.
- Time-related signatures verification issues
  - Signatures on certificates could be wrongfully rejected if verified at
    certain times of the year (due to a bizarre, undocumented behavior in
    ECMAScript).

### Upgrading

This is a breaking change, because the database schema had to be changed in a
breaking manner. If you upgrade to this version, you will need to repopulate
a new Meerkat DSA database.

## Version 2.7.0

The defining aspect of this version is support for shadowing, which allows you
to replicate entries across multiple DSAs. It also includes many very serious
bug fixes.

## New Features / Improvements

- Support shadowing
  - Shadow operational binding management via DOP
    - This includes [relayed DOP](https://wildboar-software.github.io/directory/docs/opbinding#relayed-operational-bindings)
  - All DISP operations: consumer-initiated and supplier-initiated
  - Total and incremental refreshes
- Significant performance enhancements when inserting entries
- Improvements to the [web admin console](https://wildboar-software.github.io/directory/docs/webadmin)
- The `moddn` command in the X.500 CLI has been separated into two different
  `move` and `rename` commands, making it clearer what the syntax of the
  arguments should be.
- DAP / DSP operations can now be chained with signing when using bulk insert mode.
- Signatures on requests, results, and errors are ignored when using bulk insert mode.
- Connections between DSAs retained and reused, greatly improving performance for
  distributed operations.
  - This means that the TCP connections and TLS do not need to be re-established
    each time the DSA performs a distributed operation directed at a DSA that
    it has had prior contact with.

### Bug Fixes

- Fix display of operational binding expiration times in the
  [web admin console](https://wildboar-software.github.io/directory/docs/webadmin)
- Fix non-use of shadow context prefix knowledge in Find DSE procedure
- Do not enforce access controls when moving an entry to the top level if open
  top level is configured.
- Fix a bug with getting context assertion defaults
- Fix logging unbinds at warning level
- Fix StartTLS establishment
- Fix OSI application association rejection when encountering an unsupported application context
- Fix OSI transmission of errors
- Fix handling of malformed TPDUs in the OSI transport layer
- Fix negotiation of TPDU size in OSI transport layer
- Use timeout supplied to X.500 client function to determine the TCP socket timeout
- Do not include the `valuesWithContext` in an attribute if there are no contexts
- Fix establishment of governing structure rule in a context prefix established
  by a hierarchical operational binding
- Chained operations will not be retried if they are modification operations and
  the outcome was an abort or reject, except with certain reason / problem codes.
  - This is because these outcomes could indicate an internal error, in which
    case, the modification might have been half-completed. If the error was
    caused by the user, we also do not want to propagate requests that were
    already determined to be invalid.
- Fix back-propagation of rejects, aborts, and timeouts received from chained
  operations.
- Fix crash when encountering a malformed Invoke ID

### Upgrading

You do not need to do anything for this to work other than apply migrations.

## Version 2.6.0

- Create X.509 attribute certificates using an extension to the `read`
  operation, documented [here](https://wildboar-software.github.io/directory/docs/attr-cert).

## Version 2.5.0

- Support Non-Specific Hierarchical Operational Bindings (NHOBs), which allow
  entries in multiple directories to share / compete for the same namespace.
- Fixed bugs in operational binding management
- Fix issues with validating some self-signed certificates

## Version 2.4.4

**SECURITY UPDATE**

- Fix use of `prescriptiveACI` to regulate subentries in simplified access
  control.

This security bug was introduced as a result of version 2.4.2. You were
unaffected if you did not use versions 2.4.2 or 2.4.3, or if you never used
simplified access control.

## Version 2.4.3

Summary: small deviation introduced in which searches recurse one entry into
other service administrative areas for the sake of DIT discoverability.

### Changes

The X.500 specifications mandate that searches are not to recurse into other
service administrative areas, but this means that service admin points will not
be discoverable at all via `search` operations. Since LDAP has no `list`
operation, it also means that LDAP users will never be able to find any entry
that lies in a different service administrative area (except by "guessing" that
it exists).

For example, if `C=US,ST=FL` is a service admin point, and a user performs a
one-level search at `C=US`, the `ST=FL` subordinate will be hidden from the
results entirely. The user will have no way of even finding `ST=FL` except for
performing a `list` operation and noticing that this subordinate differs from
the results obtained by a one-level search (since `list` is not governed by
service administration).

This version of Meerkat DSA onwards will deviate from the specification by
recursing one entry into other service administrative areas so that the DIT is
traversible to users. Continuing on the previous example, this means that, if a
user performs a one-level search at `C=US`, the `ST=FL` subordinate will be
returned. If a subtree search at `C=US` is performed, `ST=FL` will be returned
as well, but none of its subordinates (the latter of which is technically
correct behavior).

If this is undesirable, meaning that you want Meerkat DSA to behave exactly as
the specifications specify, fear not: this version of Meerkat DSA also
introduces a new option, `MEERKAT_PRINCIPLED_SERVICE_ADMIN`, which, if set to
`1`, disables this deviation. Meerkat DSA will thereby adhere strictly to the
specifications and service admin points will be hidden from search results.

:::note

The above issue will be reported to the ITU working group that authors the X.500
specifications, so it may be resolved in a future version.

:::

### Updating

You do not have to do anything to upgrade to this version. Just update the
Meerkat DSA version.

## Version 2.4.2

**SECURITY UPDATE**

- Fix non-use of `prescriptiveACI` to regulate subentries in several access
  control schemes.

Meerkat DSA previously did not use `prescriptiveACI` from superior access
control areas to govern access to subentries.

## Version 2.4.1

- Fix Denial-of-Service caused by failing assertion

You do not have to do anything for this upgrade to work. Just update the
version of Meerkat DSA you're using.

## Version 2.4.0

- Service Administration
  - This means that directory administrators can define search rules that
    constrain the types of searches users can perform

You do not have to do anything for this upgrade to work. Just update the
version of Meerkat DSA you're using. The Demo DIT has a
[service administrative area](./demo.md#demo-dit-overview) in
`C=US,ST=FL,L=MAR,L=Ocala` that you can experiment with.

## Version 2.3.0

- Relaxations and Tightenings
  - This means that users can specify a desired minimum and maximum number of
    entries to be returned from the search, and, if the first pass of the search
    does not return a number of results within this range, a new pass of the
    search will proceed, but using a user-specified replacement of the otherwise
    applicable matching rules that makes the search filter stricter or more
    relaxed.
- Zonal matching
  - This is a type of relaxation that replaces locale-related attributes in the
    search filter with their equivalent "zone identifiers," such as postal
    codes, and can intelligently expand the scope of the search by including
    neighboring zones.
  - See [the documentation on zonal matching](https://wildboar-software.github.io/directory/docs/usage).

 You do not need to do anything for this to work other than apply migrations.

## Version 2.2.0

### Changes

- Support all hierarchy selections in the `search` operation.
- Use the `extendedFilter` component of `search` operation arguments.

### Upgrading to this version

- If you previously set any hierarchical group-related attributes on any
  entries, hierarchical selections might not work as expected. You can fix this
  by removing the attributes and re-adding them.

## Version 2.1.0

- Implement the Search Continuation Reference Procedure defined in
  [ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en),
  Section 20.4.3.
  - This means that, in some circumstances, instead of returning continuation
    references to the client, Meerkat DSA will chain searches to other DSAs to
    continue the search.
- Improved distinguished name comparison for checking which remote DSAs are
  trusted for Identity-Based Requester Authentication, described in
  [ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.519/en),
  Section 22.1.1.
- Properly support the `unmerged` option in paginated `list` and `search`
  operations.

## Version 2.0.0

### Changes

- Password Administration via Password Administrative Areas
- Password Assertion via the `compare` operation
  - Before, asserting a password using the `compare` operation would never work,
    because of a security feature of Meerkat DSA. User passwords were not even
    accessible via normal means in the code of Meerkat DSA (to prevent
    disclosing them, even if they are encrypted).
  - Now, the `compare` operation can evaluate user passwords, and it has all of
    the same side-effects as attempting a password during a bind operation (e.g.
    incrementing `pwdFails` if the password is wrong).
- Remote password checking via the `compare` operation during binding
  - This means that, no matter what DSA you attempt to bind to, it can submit a
    `compare` operation to the DSA that actually contains the password for a
    given user.
  - This is configurable via the
    [`MEERKAT_REMOTE_PWD_TIME_LIMIT`](https://wildboar-software.github.io/directory/docs/env#meerkat_remote_pwd_time_limit)
    environment variable. It defaults to 0, meaning that this feature is
    disabled by default. This is for security reasons.
- Nearly doubled performance for most workloads
- TLS Debugging Options
  - The ability to log (pre-)master secrets, either to the log or to a separate
    file via the [`MEERKAT_LOG_TLS_SECRETS`](https://wildboar-software.github.io/directory/docs/env#meerkat_log_tls_secrets) environment variable.
  - The ability to print OpenSSL trace information via the
    [`MEERKAT_SSLKEYLOG_FILE`](https://wildboar-software.github.io/directory/docs/env#meerkat_sslkeylog_file)
    environment variable.

### Upgrading to this Version

The reason this version is a major version update is that I had to introduce a
breaking change into the database schema. The schema for this version is totally
incompatible with earlier versions. There is no way to "upgrade" to this
version. You must completely restart.

Fortunately, this update is a massive improvement and fix of many issues over
the previous version, so it is plausible that this will mean fewer breaking
changes going forward.

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
