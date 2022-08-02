# Configuration

Meerkat DSA is configured via environment variables. In the future, it will
also be configurable via command-line arguments. Environment variables that
are specific to Meerkat DSA are namespaced such that they all start with
`MEERKAT_`.

## Representation of Values

Meerkat DSA environment variables that represent boolean types will use
`1` to represent TRUE and `0` to represent FALSE. This is because digits
are more locale-independent. Most cultures would recognize `1` to mean
TRUE and `0` to mean FALSE. In general, where boolean environment variables
are used, anything other than `1` simply gets interpreted as FALSE.

Meerkat DSA environment variables that represent object identifiers only accept
the dot-delimited, numeric representation of the object identifier, such as
`2.5.4.3`; human-friendly names for these object identifiers are _not supported_
by Meerkat DSA (e.g. `id-at-commonName`).

Meerkat DSA does not validate environment variable values. If you supply
invalid values, you will get unspecified behavior.

## Updating Configuration

Meerkat DSA reads the environment variables one time: at start up. This means
that, if you want to re-configure your Meerkat DSA instance, **you will have to
restart Meerkat DSA**--you cannot simply modify the environment variables as it
runs.

## TLS and Signing Options

You will notice a few options that _seem_ similar: in Meerkat DSA, TLS options
and signing options (those pertaining to signed arguments, results, or errors)
both have a suite of similar configuration options. The TLS options start with
`MEERKAT_TLS_` and the signing options start with `MEERKAT_SIGNING_`.

:::caution

The TLS options do not affect the signing options, and vice versa. That means
that, if you want to configure, say, a certificate authorities file for
verifying _both_ TLS peers and the signatures on signed arguments, results, and
errors, you will have to set both the `MEERKAT_TLS_CA_FILE` and
`MEERKAT_SIGNING_CA_FILE` environment variables to the same value.

This makes Meerkat really flexible, but it also means that you can inadvertently
leave certain security-related settings to their default values, which might not
be what you intend!

:::

To further complicate this, there is another set of similar options for signed
arguments, results, and errors that only pertains to bind operations. These
options start with `MEERKAT_SIGNING_BIND_`. These environment variables override
the values of their equivalent `MEERKAT_SIGNING_` environment variables, hence
they are referred to as the "bind overrides."

:::info

The rationale for this design is that bind operations are typically (1) more
security-sensitive, since they determine authorization for all future requests,
(2) probable targets for brute-force and denial-of-service attacks, and (3) it
is usually acceptable to have a somewhat high latency (like three seconds) for a
bind operation, but not for subsequent operations. These three significant
differences mean that it would be desirable for Meerkat DSA to support a
different set of signing-related configuration options that pertain only to the
bind operation for a given protocol.

:::

## Required



## DATABASE_URL

**Required**. A database URL indicating the database to which Meerkat DSA must
connect for persistent storage. Meerkat DSA assumes full read-write access to
this database (not the DBMS, just the database). This URL may have a username
and password. Read the
[Prisma Documentation](https://www.prisma.io/docs/reference/database-reference/connection-urls)
for more information about this URL.

## LANG

This is a standard environment variable on Unix-like systems. In Meerkat DSA,
this environment variable determines the locale used for log and error
messages.

## MEERKAT_ADMINISTRATOR_EMAIL

The email that you specify here will be submitted along with telemetry events.
This will help Meerkat network administrators reach out to you to offer support,
inform you of security vulnerabilities or active attacks, or contact you for
other Meerkat DSA-related things.

## MEERKAT_ATTR_CERT_CHAIN_FILE

The filepath of the chain of attribute certificates and
public key certificates path to use for
outbound strong authentication (when your Meerkat DSA instance binds to
another DSA). The attribute certificate path supplied here will populate the
`attributeCertificationPath` field of the strong credentials. Meerkat DSA does
not currently use this in any way other than that.

This file MUST contain only attribute certificates and public key certificates,
which MUST have the PEM labels `ATTRIBUTE CERTIFICATE` and `CERTIFICATE`,
respectively. The first and last PEM-encoded objects MUST be attribute
certificates, not public key certificates. Any public key certificate is
associated with the attribute certificate that follows it. There MUST NOT be
multiple public key certificates adjacent to each other, but there MAY be two or
more attribute certificates adjacent to each other.

Using `A` to represent an attribute certificate and `P` to represent a public
key certificate, the following sequences are valid: `AAA`, `APAPA`, `APAA`. The
following sequences are _invalid_: `PAA`, `AAP`, `APPA`, `APAPPA`.

:::info

If this strictness seems bizarre, it is because this file is used to populate
this data structure (represented in ASN.1):

```asn1

AttributeCertificationPath ::= SEQUENCE {
  attributeCertificate  AttributeCertificate,
  acPath                SEQUENCE OF ACPathData OPTIONAL,
  ... }

ACPathData ::= SEQUENCE {
  certificate           [0]  Certificate OPTIONAL,
  attributeCertificate  [1]  AttributeCertificate OPTIONAL,
  ... }

```

Perhaps you can see how a file, constructed as described above, can be used to
populate the above data structure. Since this is used for access controls or
authentication in some cases (not by Meerkat DSA, but perhaps by another DSA),
it is important for there to be no ambiguity as to how a given certificate in
the path is to be used.

:::

The certs should be ordered by ascending authority: in other words, the Start Of
Authority (SOA) attribute certificate should be closest to the _bottom_ of the
file and the end-entity attribute certificate (used directly by Meerkat DSA)
should be closest to the _top_ of the file.

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN ATTRIBUTE CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END ATTRIBUTE CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END CERTIFICATE-----
-----BEGIN ATTRIBUTE CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END ATTRIBUTE CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END CERTIFICATE-----
-----BEGIN ATTRIBUTE CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END ATTRIBUTE CERTIFICATE-----
```

This does not affect the production of signed arguments, results, or errors, nor
does it affect TLS.

## MEERKAT_BIND_MIN_SLEEP_MS

This is the amount of time in milliseconds (at minimum) that Meerkat DSA will
take to respond to a failed authentication attempt.

:::note

This exists to stifle
[timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

:::

## MEERKAT_BIND_SLEEP_RANGE_MS

This is the maximum amount of time in milliseconds that Meerkat DSA will
add to the time taken to respond to a failed authentication attempt on top of
the minimum as configured by the `MEERKAT_BIND_MIN_SLEEP_MS` environment
variable. The additional time taken in milliseconds is selected uniformly and
at random from 0 to this number.

:::note

This exists to stifle
[timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

:::

## MEERKAT_BULK_INSERT_MODE

If set to `1`, this enables bulk-insert mode, where all access control checks
are disabled, some schema checks are disabled, and other validation is
disabled. This exists to speed up a bulk insertion of data when a directory is
still being set up.

:::caution

Enabling this _disables_ access controls. This should NOT be enabled if your
directory is accessible over a network to users that should not have
unrestricted access.

This SHOULD be turned off and Meerkat DSA SHOULD be restarted as soon as the
initial bulk loading is complete.

:::

:::note

The bulk loading of data does not have to be done in one session. It is possible
to load some data, exit bulk insert mode, use the directory normally, and later
re-enable bulk insert mode.

:::

## MEERKAT_CLIENT_CERT_ENGINE

This is an open-ended string that specifies the client certificate engine that
OpenSSL can use to obtain a client certificate.

## MEERKAT_CHAINING_TLS_OPTIONAL

If set to `1`, this permits the non-usage of TLS in chaining to other DSAs. In
other words, if this is set to `1`, this DSA will still chain operations to
other DSAs after attempting to use StartTLS, regardless of whether StartTLS
succeeds.

If this is enabled, transported operations, data, errors, responses,
credentials, etc. are susceptible to inspection by intermediaries, which is a
security problem. These operations may not be susceptible to tampering (other
than by omission) if cryptographic signing is used.

## MEERKAT_ECDH_CURVES

A colon-separated list of ECDH curves to use in ECDH key agreement. Each curve
can be an NID or name.

## MEERKAT_ENABLE_DAP

If set to `0`, this disables Directory Access Protocol (DAP).

## MEERKAT_ENABLE_DOP

If set to `1`, this enables Directory Operational Binding Management Protocol
(DOP).

## MEERKAT_ENABLE_DSP

If set to `1`, this enables Directory System Protocol (DSP).

## MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE

The number of entries that Meerkat DSA will load into memory at a time when
searching for a subordinate.

Meerkat DSA searches in order of _descending_ IDs of entries, with the theory
being that larger IDs are entries that have been recently added, and recently
added entries are more likely to be requested than older entries. That said,
this can generally be set to a fairly low number for optimal results.

## MEERKAT_FORBID_ANONYMOUS_BIND

If set to `1`, anonymous binds are declined entirely.

## MEERKAT_HONOR_CIPHER_ORDER

If set to `1`, Meerkat DSA will attempt to use its own preferred TLS cipher
suites instead of the client's.

## MEERKAT_IDM_BUFFER_SIZE

The number of bytes in size of the IDM buffer. This innately limits the size
of an IDM frame. This should be large enough to accomodate all well-intentioned
requests and responses, but small enough to prohibit nefariously large requests
that are intended to exhaust Meerkat DSA's memory.

## MEERKAT_IDM_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for IDM
traffic.

## MEERKAT_IDMS_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for IDMS
(IDM over TLS) traffic.

## MEERKAT_INIT_JS

If set, this is the filepath to an init script. At startup, Meerkat DSA will
load this script and execute the default export or an export named `init`, if
either one exists.

## MEERKAT_LDAP_BUFFER_SIZE

The number of bytes in size of the LDAP buffer. This innately limits the size of
an LDAP message. This should be large enough to accomodate all well-intentioned
requests and responses, but small enough to prohibit nefariously large requests
that are intended to exhaust Meerkat DSA's memory.

## MEERKAT_LDAP_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for LDAP
traffic.

## MEERKAT_LDAPS_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for LDAPS
(LDAP over TLS) traffic.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using SSLv3 to secure their traffic.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using StartTLS to secure their traffic.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using any version of Transport Layer Security (TLS) to secure their
traffic.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using TLS version 1.0 to secure their traffic. These points are added
on top of the points granted via the
`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using TLS version 1.1 to secure their traffic. These points are added
on top of the points granted via the
`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using TLS version 1.2 to secure their traffic. These points are added
on top of the points granted via the
`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.

## MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3

The number of `localQualifier` "points" that Meerkat DSA grants to a client
for using TLS version 1.3 to secure their traffic. These points are added
on top of the points granted via the
`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS` environment variable.

## MEERKAT_LOG_FILE

The filepath of the Meerkat DSA's log file. If set, Meerkat DSA will log to
this file.

## MEERKAT_LOG_FILE_MAX_FILES

The maximum number of log files Meerkat DSA will produce before it deletes
the oldest one to make room for the newest one.

This has no effect if the `MEERKAT_LOG_FILE` environment variable is not set.

## MEERKAT_LOG_FILE_MAX_SIZE

The maximum size (in bytes) of a log file before Meerkat DSA will start a new
log file.

This has no effect if the `MEERKAT_LOG_FILE` environment variable is not set.

## MEERKAT_LOG_HTTP

If set to a URL, Meerkat DSA will POST log messages to this URL. This URL may
contain a username and password, which will make Meerkat DSA use HTTP basic
authentication.

## MEERKAT_LOG_JSON

Setting this to `1` will cause log messages to be logged in JSON format instead
of the default plain / human-friendly format. This can be useful if your logs
are exported to an SIEM like LogRhythm, or an APM like DataDog or
ElasticSearch.

## MEERKAT_LOG_LEVEL

This controls the logging level. Can be one of `debug`, `info`, `warn`, or
`error`. Log messages at or above the specified level will get logged; all
others will be silently discarded.

## MEERKAT_LOG_TAILABLE

Setting this to `1` will...
just read this: https://github.com/winstonjs/winston/blob/HEAD/docs/transports.md#file-transport.

This has no effect if the `MEERKAT_LOG_FILE` environment variable is not set.

## MEERKAT_LOG_ZIP

If set to `1`, Meerkat DSA will compress non-current log files.

This has no effect if the `MEERKAT_LOG_FILE` environment variable is not set.

## MEERKAT_LOOKUP_UNCERT_STRONG_AUTH

If set to `1`, a strong authentication attempt that does not provide
a certification path, but which _does_ provide a distinguished name in
the `name` field of the strong credentials, will result in Meerkat DSA
reading the DSE of having the distinguished name `name` if it is present
locally, and, if it has object class `pkiCertPath` and has attribute
values of type `pkiPath`, these values will be used as certification
paths, and each will be tried until a certification path is found that
verifies the bind token. If no such vindicating certification path is
found, Meerkat DSA rejects the authentication attempt. It is strongly
preferred for clients to supply a certification path in the bind argument
so that this lookup need not happen.

:::caution

Enabling this opens up your Meerkat DSA instance to denial-of-service attacks.
A particular lookup can be computationally expensive, and since a given user may
have an unlimited number of `pkiPath` attribute values, this could result in a
potentially unlimited number of certification path validations that must be done
before your DSA accepts or rejects a strong authentication attempt.

It is recommended to keep this disabled, unless the certification path
itself is highly sensitive and should not be sent over the network, and
the potential threat of denial-of-service is controlled for.

:::

Enabling this can be useful if your users must not transmit their certification
path over the network.

## MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION

The number of maximum concurrent operations per connection. If a connection
attempts more operations than this permits, they will be automatically
rejected.

## MEERKAT_MAX_CONNECTIONS

The absolute maximum number of connections globally. Connections opened after
this maximum has been reached will be automatically closed.

## MEERKAT_MAX_CONNECTIONS_PER_ADDRESS

The absolute maximum number of connections permitted from a given address.
Connections by a given address opened after this maximum has been reached will
be automatically closed. This is important for the prevention of
[Slow Loris attacks](https://en.wikipedia.org/wiki/Slowloris_(computer_security)).

## MEERKAT_MAX_IDM_PDU_SIZE

The maximum size, in bytes, of an IDM PDU. IDM PDUs larger than this will be
rejected automatically, possibly before they are even fully read.

## MEERKAT_MAX_IDM_SEGMENTS

The maximum number of IDM segments into which an IDM client may split an IDM
PDU. This is important for preventing a denial of service. Without this limit,
nefarious IDM clients may submit an infinitely-large number of IDM segments and
exhaust memory.

## MEERKAT_MAX_PRE_BIND_REQUESTS

ITU Recommendation X.519 permits clients to submit requests after the bind
request has been submitted, but before the bind response or error has been
received. Meerkat DSA can handle this, but it is important to limit the
number of pre-bind requests so that unauthenticated users cannot flood the
queue with an unlimited number of pending requests and exhaust memory.

It is not a security vulnerability for this to be a number greater than zero,
but it should be a low number. It should probably not be higher than 10.

## MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING

The integer representation of the minimum authentication level required for
Meerkat DSA to chain requests to other DSAs. This is a security feature to
prevent unauthenticated (and therefore, unaccountable) users from spamming
the distributed directory with cumbersome (if not malicious) requests.

This is important, because chaining can have the effect of making a request
"fan-out" to multiple DSAs. A nefarious request may multiply exponentially
without this check in place.

This defaults to `1`, which corresponds to simple authentication, meaning that,
to utilize chaining, a user must have authenticated using simple authentication
or something stronger.

Possible values are:

- `0` for no authentication / anonymous.
- `1` for simple authentication, which corresponds to any authentication
  mechanism using a password, regardless of whether that password is presented
  in plain text or with some form of hashing or encryption.
- `2` for strong authentication, which corresponds to Strong or SPKM authentication.

## MEERKAT_MIN_AUTH_LEVEL_FOR_OB

The integer representation of the minimum authentication level required for
Meerkat DSA to accept DOP requests.

This defaults to `1`, which corresponds to simple authentication, meaning that,
to use DOP, a DSA must have authenticated using simple authentication
or something stronger.

Possible values are:

- `0` for no authentication / anonymous.
- `1` for simple authentication, which corresponds to any authentication
  mechanism using a password, regardless of whether that password is presented
  in plain text or with some form of hashing or encryption.
- `2` for strong authentication, which corresponds to Strong or SPKM authentication.

## MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING

The minimum `localQualifier` "points" required (on top of the minimum
authentication level) for Meerkat DSA to chain requests to other DSAs.
If the minimum authentication level--as configured by the
`MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING` environment variable--is exceeded, this
does not matter.

This is important, because chaining can have the effect of making a request
"fan-out" to multiple DSAs. A nefarious request may multiply exponentially
without this check in place.

## MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB

The minimum `localQualifier` "points" required (on top of the minimum
authentication level) for Meerkat DSA to accept DOP requests.
If the minimum authentication level--as configured by the
`MEERKAT_MIN_AUTH_LEVEL_FOR_OB` environment variable--is exceeded, this
does not matter.

## MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE

This specifies the minimum number of bytes a TCP connection is expected to
transfer within one minute. If the average number of bytes per minute falls
below this number, the TCP socket is closed.

:::note

This is important for the prevention of
[Slow Loris attacks](https://en.wikipedia.org/wiki/Slowloris_(computer_security)).

:::

## MEERKAT_MY_ACCESS_POINT_NSAPS

Whitespace-separated NSAP URLs that locate this DSA. This is important for
enabling other DSAs to chain requests to this DSA. These NSAP URLs are used to
populate the `myAccessPoint` attribute in the Root DSE.

:::caution

Do NOT include usernames and passwords in any URL
(e.g. `https://username:password@example.com`) you supply with this environment
variable. These URLs will be disclosed freely to all users regardless of
authentication or access control, so nothing sensitive should be included in
them at all.

:::

## MEERKAT_NO_COLOR

If set to `1`, Meerkat DSA will not use colors in log outputs.

## MEERKAT_NO_CONSOLE

If set to `1`, Meerkat DSA will not log to the console.

## MEERKAT_NO_TIMESTAMP

If set to `1`, Meerkat DSA will not include the timestamp in log messages.


:::caution

Enabling this (thereby turning off timestamps in log messages) can make your
logs unusable, since you might not know when a particular concerning log event
was recorded. Unless you record log timestamps in some other manner, it is
strongly recommended that you do not enable this option.

:::

## MEERKAT_OB_AUTO_ACCEPT

If set to `1`, Meerkat DSA shall accept ALL requested operational bindings.

:::caution

Your DSA is **INSECURE** if this is enabled. It means that your DSA will
automatically agree to:

- Replicate an arbitrarily large amount of data
- Defer to any other DSA for chained operations
- Create any requested subtree within the DIT

:::

## MEERKAT_OPEN_TOP_LEVEL

If set to `1`, Meerkat DSA will not apply any access controls to adding new
entries to the top level. Note that this does not negate access controls for
already-existing first-level DSEs.

:::caution

This option being enabled reduces security of the system, because users can
arbitarily create new entries at the top level. Only enable this option if you
would not mind any connected user creating an arbitrarily large number of top
level entries.

:::

:::info

This is useful for testing purposes, because you can create "test subtrees"
within a single DSA for the purposes of testing functionality in isolation from
other tests.

:::

## MEERKAT_PRIVATE_KEY_ENGINE

This is an open-ended string that specifies the private key engine that
OpenSSL can use to obtain a private key.

## MEERKAT_PROHIBIT_CHAINING

If set to `1`, Meerkat DSA will not chain any requests. If you expect to operate
your DSA instance in isolation from all other DSAs, it is recommended to enable
this (meaning that chaining would be disabled).

## MEERKAT_SCVP_ATTR_CERT_CHECKS

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_ATTR_CERT_WANT_BACKS

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_CACHED_RESPONSE

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_DISCLOSE_AE_TITLE

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_FULL_REQUEST_IN_RESPONSE

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_HASH_ALGORITHM

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_INHIBIT_ANY_POLICY

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_INHIBIT_POLICY_MAPPING

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_PROTECT_RESPONSE

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_PUBLIC_KEY_CERT_CHECKS

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_PUBLIC_KEY_CERT_WANT_BACKS

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_REQUESTOR_TEXT

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_REQUIRE_EXPLICIT_POLICY

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_RESPONSE_VALIDATION_POLICY_BY_REF

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_SIGNATURE_ALGORITHM

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_URL

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_VALIDATION_ALGORITHM_ID

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SCVP_VALIDATION_POLICY_REF_ID

[Server-based Certificate Validation Protocol](https://en.wikipedia.org/wiki/SCVP)
is not currently supported in Meerkat DSA, so setting this environment variable
will have no effect. This is merely reserved for later use.

## MEERKAT_SENTINEL_DOMAIN

This is a fully-qualified DNS name. If it contains a TXT record whose text is
`meerkat:kill`, Meerkat DSA will exit as soon as it detects this. If this
record's text is `meerkat:hibernate`, Meerkat DSA will enter hibernation as
soon as it detects this.

This exists so that Meerkat DSA may be remotely shut down in the event that
a severe security vulnerability is discovered. It is a "remote killswitch."

## MEERKAT_SIGNING_ACCEPTABLE_CERT_POLICIES

A list of object identifiers of certificate policies that are acceptable for a
X.509 certification path processing for certification paths used for signed arguments, results, or errors.

The value of this environment variable, if set, should be a comma-delimited list
of period-delimited object identifiers of the acceptable certification
policies (e.g. `1.2.3.4, 5.6.7.8`). Whitespace between object identifiers and
commas is tolerated.

If not set, any policy or no explicit policy will be considered acceptable for
the purposes of X.509 certification path processing.


## MEERKAT_SIGNING_BIND_ACCEPTABLE_CERT_POLICIES

This environment variable overrides the value of
`MEERKAT_SIGNING_ACCEPTABLE_CERT_POLICIES`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_CRL_DP_ATTEMPTS_PER_CERT

This environment variable overrides the value of
`MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_MAX_ENDPOINTS_PER_CRL_DP

This environment variable overrides the value of
`MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_OCSP_CHECKINESS

This environment variable overrides the value of
`MEERKAT_SIGNING_OCSP_CHECKINESS`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_OCSP_MAX_REQUESTS_PER_CERT

This environment variable overrides the value of
`MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_OCSP_SIGN_REQUESTS

This environment variable overrides the value of
`MEERKAT_SIGNING_OCSP_SIGN_REQUESTS`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_OCSP_TIMEOUT

This environment variable overrides the value of
`MEERKAT_SIGNING_OCSP_TIMEOUT`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_OCSP_UNKNOWN_IS_FAILURE

This environment variable overrides the value of
`MEERKAT_SIGNING_OCSP_UNKNOWN_IS_FAILURE`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_REMOTE_CRL_CACHE_TTL

This environment variable overrides the value of
`MEERKAT_SIGNING_REMOTE_CRL_CACHE_TTL`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_REMOTE_CRL_CHECKINESS

This environment variable overrides the value of
`MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_REMOTE_CRL_SUPPORTED_PROTOCOLS

This environment variable overrides the value of
`MEERKAT_SIGNING_REMOTE_CRL_SUPPORTED_PROTOCOLS`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_REMOTE_CRL_TIMEOUT

This environment variable overrides the value of
`MEERKAT_SIGNING_REMOTE_CRL_TIMEOUT`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_BIND_TOLERATE_UNAVAILABLE_REMOTE_CRL

This environment variable overrides the value of
`MEERKAT_SIGNING_TOLERATE_UNAVAILABLE_REMOTE_CRL`
for the bind operation for all application contexts / protocols.

In the case of DAP, DSP, DOP, and DISP, this governs the validation of the
bind token used in strong authentication.

## MEERKAT_SIGNING_CA_FILE

The filepath of the certificate authority certificates file to use for
verifying signed arguments, results, and errors. This is NOT used for TLS; the
TLS equivalent of this variable is [`MEERKAT_TLS_CA_FILE`](#meerkattlscafile).

The format of this file is the same as
[`MEERKAT_SIGNING_CERTS_CHAIN_FILE`](#meerkatsigningcertschainfile), but there
is no meaning imputed to the ordering of certificates in this file.

If this is unspecified, a default bundle of trust anchors that are built into
the NodeJS runtime (curated by Mozilla) are trusted. This is usually good
enough for most use cases.

If this option _is_ specified, it does not _add_ to the default trust anchors
mentioned above: it _overwrites_ them. That means that, if you want to add your
own trust anchor, but still trust Mozilla's curated default trust anchors, you
MUST obtain this bundle of certificates and add it to this file.

This option does _add_ to the trust anchors trusted with the
[`MEERKAT_TRUST_ANCHORS_FILE`](#meerkattrustanchorsfile) file.

:::info

The reason that two configuration options exist for setting trust anchors is
so that the more commonly used PEM format can be used, but the more extensible
Trust Anchor List format can be used, if that is desired.

:::

## MEERKAT_SIGNING_CERTS_CHAIN_FILE

The filepath to a certificate chain to use for signing requests and responses
from the DSA. This does not affect TLS and may be a totally different chain
than that used for TLS.

This file should have the same exact formatting as
[`MEERKAT_TLS_CERT_FILE`](#meerkattlscertfile).

## MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT

The maximum number of CRL distribution points from which to attempt to fetch a
remote CRL per a given X.509 certificate.

To limit the number of endpoints within a distribution point that get checked,
see
[`MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP`](#meerkatsigningmaxendpointspercrldp).

:::info

To clarify, a given X.509 certificate may have multiple CRL distribution points
listed. Each CRL distribution point may, in turn, have multiple endpoints.

:::

:::info

This exists to prevent denial-of-service attacks by clients that present X.509
certificates that have an outrageously large number of CRL distribution points.

:::

## MEERKAT_SIGNING_CRL_FILE

The filepath to the PEM-encoded certificate revocation list (CRL) file to use
for evaluating the status of certificates used for signed arguments, results,
and errors.

There may be multiple CRLs concatenated together. There is no meaning imputed to
the ordering of CRLs in this file.

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
```

## MEERKAT_SIGNING_DISABLE_VERIFICATION

Whether no digital signatures should be checked at all. If this is set to
`1`, all digital signatures and certification paths will not be checked at all.

When used for bind operations using strong authentication, the signature
will always be treated as invalid. The rationale for this is that it
prevents users from obtaining strong authentication with invalid
credentials. Users will be forced to use simple or lesser authentication.

For all other operations, signatures will simply be ignored, but requests
may be treated as signed for the purposes of validation.

## MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL

This overrides the value of
[`MEERKAT_SIGNING_MIN_AUTH_LEVEL`](#meerkatsigningminauthlevel),
but only for signed errors.

## MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER

This overrides the value of
[`MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER`](#meerkatsigningminauthlocalqualifier),
but only for signed errors.

## MEERKAT_SIGNING_ERRORS_MIN_AUTH_SIGNED

This overrides the value of
[`MEERKAT_SIGNING_MIN_AUTH_SIGNED`](#meerkatsigningminauthsigned),
but only for signed errors.

## MEERKAT_SIGNING_KEY_FILE

The filepath to the PEM-encoded PKCS #8-formatted private key to use for signing
arguments, results, and errors from this DSA. This does not affect TLS and may
be a totally different key than that used for TLS (which is configured via the
[`MEERKAT_TLS_KEY_FILE`](#meerkattlskeyfile) environment variable).

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN PRIVATE KEY-----
<Some base64-encoded data starting with "MII">
-----END PRIVATE KEY-----
```

:::caution

This file is a secret key. Do not give it to anybody unless you are sure that
they should be able to impersonate / act on behalf of this Meerkat DSA instance.

:::

## MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP

The maximum number of endpoints (URLs, directory names, etc.) to check within a
given CRL distribution point listed on an X.509 certificate. This MUST be unset
or an unsigned decimal integer.

To limit the number of distribution points checked, see
[`MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT`](#meerkatsigningcrldpattemptspercert).

:::info

To clarify, a given X.509 certificate may have multiple CRL distribution points
listed. Each CRL distribution point may, in turn, have multiple endpoints.

:::

:::info

This exists to prevent denial-of-service attacks by clients present X.509
certificates that have an outrageously large number of endpoints listed in a
given CRL distribution point.

:::

## MEERKAT_SIGNING_MIN_AUTH_LEVEL

The integer representation of the minimum authentication level required for
Meerkat DSA to sign results or errors to a client. If a client does not meet
this level of authentication, requests for signed results or errors will not
be honored; it will not result in an error if the client requests signed results
or errors.

This is important, because digital signing can be computationally expensive, so
it may be desirable to prevent anonymous users from overwhelming the directory
with unnecessary signing.

This defaults to `1`, which corresponds to simple authentication, meaning that,
to receive signed results or errors, a user must have authenticated using simple
authentication or something stronger.

Possible values are:

- `0` for no authentication / anonymous.
- `1` for simple authentication, which corresponds to any authentication
  mechanism using a password, regardless of whether that password is presented
  in plain text or with some form of hashing or encryption.
- `2` for strong authentication, which corresponds to Strong or SPKM authentication.

If a different setting is desired for errors only, consider setting the
[`MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL`](#meerkatsigningerrorsminauthlevel)
environment variable to override this for errors.

## MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER

The minimum `localQualifier` "points" required (on top of the minimum
authentication level) for Meerkat DSA to sign results or errors for a given
client / association. This shall be a positive integer.

If the minimum authentication level--as configured by the
`MEERKAT_SIGNING_MIN_AUTH_LEVEL` environment variable--is exceeded, this value
does not matter.

If a different setting is desired for errors only, consider setting the
[`MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER`](#meerkatsigningerrorsminauthlocalqualifier)
environment variable to override this for errors.

## MEERKAT_SIGNING_MIN_AUTH_SIGNED

If set to `1` a client association shall have signed arguments for a given
operation in order to receive signed results or errors.

If a different setting is desired for errors only, consider setting the
[`MEERKAT_SIGNING_ERRORS_MIN_AUTH_SIGNED`](#meerkatsigningerrorsminauthsigned)
environment variable to override this for errors.

## MEERKAT_SIGNING_OCSP_CHECKINESS

If set to `0` or unset, this DSA will not check with OCSP responders for the
status of an asserted certificate used in producing signed arguments, results,
or errors. If greater than zero, this DSA will check
with OCSP responders for the status of an asserted certificate (if an OCSP
responder is defined for that certificate)
~~and cache the result for this value's number of seconds~~.

## MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT

The maximum number of OCSP responders to check with before giving up for a given
certificate. This MUST be an unsigned integer, or unset. If unset, this defaults
to `3`.

This only applies to OCSP responses obtained in the verification of signed
arguments, results, and errors--not TLS peers. The equivalent of this
configuration option for TLS peers is
[`MEERKAT_TLS_OCSP_MAX_REQUESTS_PER_CERT`](#meerkattlsocspmaxrequestspercert).

## MEERKAT_SIGNING_OCSP_REPLAY_WINDOW

The number of seconds by which the OCSP `producedAt` time and `thisUpdate`
time may differ from the current time before an OCSP response is
considered invalid on the grounds of being a possible
[replay attack](https://en.wikipedia.org/wiki/Replay_attack).

This only affects OCSP verification of signed arguments, results, or errors; the
equivalent of this configuration option that controls OCSP verification for TLS
is [`MEERKAT_TLS_OCSP_REPLAY_WINDOW`](#meerkattlsocspreplaywindow).

An attacker's ability to replay an OCSP response is not too dangerous as long as
this threshold is low (in other words, the window is small). If the replay
window is large, it means that, if an attacker can intercept your communication
with the OCSP responder, he can replay the OCSP response to illegitimately make
it appear as though the certificate is still valid. If the replay window is too
small, such as 1 second, then a slight variation in the OCSP responder's system
clock could mean that Meerkat DSA rejects the response as a "replay" (speciously). This is like the `clockskew` configuration option in MIT's
Kerberos implementation.

It is recommended that you leave this at the **default value of 15 seconds**.

## MEERKAT_SIGNING_OCSP_RESPONSE_SIZE_LIMIT

The maximum size in bytes of OCSP responses. If an OCSP response is fetched and
it exceeds this size, Meerkat DSA will cancel fetching it, and/or refuse to
decode it. This limit should NOT be considered exact.

:::info

This is important because OCSP requests can be configured to be submitted
automatically by Meerkat DSA to any endpoint listed on an X.509 certificate
presented by a client / association. This prevents a malicious user from
presenting Meerkat DSA with a malicious X.509 certificate that defers to a
maliciously-designed OCSP responder that responds with an exhaustively large
payload that inundates this Meerkat DSA instance.

:::

## MEERKAT_SIGNING_OCSP_SIGN_REQUESTS

If set to `1`, Meerkat DSA will use its signing key to digitally sign OCSP
requests issued to verify signed arguments, results, or errors, and present its
signing certificate chain to the OCSP responder.

## MEERKAT_SIGNING_OCSP_TIMEOUT

The number of seconds for a given OCSP responder to respond before Meerkat DSA
abandons the request. If set, this MUST be an unsigned decimal integer. This
setting only applies to the verification of signed arguments, results, and
errors; the equivalent setting for TLS is
[`MEERKAT_TLS_OCSP_TIMEOUT`](#meerkattlsocsptimeout).

## MEERKAT_SIGNING_OCSP_UNKNOWN_IS_FAILURE

If set to `1`, Meerkat DSA will treat OCSP responses that indicate that a
certificate's status is `unknown` as a failure, as though the certificate was
`revoked`. This only applies to verification of signed arguments, results, or
errors--not OCSP responses received via TLS.

## MEERKAT_SIGNING_PERMITTED_ALGORITHMS

A comma-delimited list of dot-formatted object identifiers of signing algorithms
that are permitted for verifying signed arguments, results, and errors.
Whitespace is tolerated between object identifiers and commas.

If specified, only the intersection of this list and Meerkat DSA's innately
supported signature algorithms will be tolerated in digital signatures. If not
specified, Meerkat will tolerate the use of any of its supported signature
algorithms.

## MEERKAT_SIGNING_REMOTE_CRL_CACHE_TTL

The number of seconds during which a fetched remote CRL shall remain in the
cache of remote CRLs. If set, this MUST be an unsigned decimal integer. If not
set, this defaults to 300 (five minutes).

:::info

This is important, because CRLs can be quite large, and downloading a CRL for
every single request can inundate Meerkat DSA (or any program, for that matter).

:::

## MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS

Determines how aggressively this DSA demands to check remote CRLs.

Possible values are:

- `0`, meaning _never_ check remote CRLs.
- `1`, meaning _only_ check remote CRLs when the `cRLDistributionPoints` X.509v3
  extension is marked as "critical."
- `2`, meaning _always_ check remote CRLs, even if the `cRLDistributionPoints`
  X.509v3 extension is _not_ marked as "critical."

## MEERKAT_SIGNING_REMOTE_CRL_SIZE_LIMIT

The maximum size in bytes of remote CRLs. If a remote CRL is fetched and it
exceeds this size, Meerkat DSA will cancel fetching it. This limit should NOT be considered exact. When used by LDAP, which can return multiple objects in
a single "fetch," the size limit applies to the entire response packet. When
used by DAP, this applies per-attribute, but remote DSAs may ignore this.

## MEERKAT_SIGNING_REMOTE_CRL_SUPPORTED_PROTOCOLS

The protcols to be supported by remote CRL fetching, identified by their URL
scheme equivalents, e.g. "http", "ftp", "ldaps", etc. If `undefined`, all
supported fetching protocols will be allowed. Protocols MUST be separated by
commas and optional whitespace.

## MEERKAT_SIGNING_REMOTE_CRL_TIMEOUT

The number of seconds for a given CRL distribution point to respond before
Meerkat DSA abandons the request. If specified, this MUST be an unsigned decimal
integer. If unspecified, this defaults to `5` (five seconds).

## MEERKAT_SIGNING_REQUIRED_FOR_CHAINING

If set to `1`, Meerkat DSA will NOT chain DAP operations that have not been
signed.

## MEERKAT_SIGNING_REQUIRED_FOR_OB

If set to `1`, Meerkat DSA will reject Directory Operational Binding Management
Protocol (DOP) requests that are not signed.

:::info

This exists because operational binding management is an extremely
security-sensitive aspect of directory management. Requiring signing is a great
way to prevent hacking attempts via malicious DOP requests.

:::

## MEERKAT_SIGNING_TOLERATE_UNAVAILABLE_REMOTE_CRL

If set to `1`, unavailable remote CRLs will not be treated as a failure for the
purposes of certification path validation.

## MEERKAT_TCP_NO_DELAY

If set to `1`, Meerkat DSA will disable Nagle's algorithm for TCP connections.
This exists as a slight performance enhancement. There is little reason to use
this.

## MEERKAT_TCP_TIMEOUT_IN_SECONDS

The amount of time (in seconds) after receiving no bytes from the TCP socket
after which the TCP connection will be reset.

## MEERKAT_TLS_ANSWER_OCSP_REQUESTS

If set to `1`, Meerkat DSA will answer OCSP requests submitted as a part of the
TLS handshake.

## MEERKAT_TLS_CA_FILE

The filepath of the certificate authority certificates file to use for TLS. This
is used both for validating TLS clients that connect to Meerkat DSA and TLS
servers to which Meerkat DSA connects as a client (such as in chained
operations).

The format of this file is the same as `MEERKAT_TLS_CERT_FILE`, but there is no
meaning imputed to the ordering of certificates in this file.

If this is unspecified, a default bundle of trust anchors that are built into
the NodeJS runtime (curated by Mozilla) are trusted. This is usually good
enough for most use cases.

If this option _is_ specified, it does not _add_ to the default trust anchors
mentioned above: it _overwrites_ them. That means that, if you want to add your
own trust anchor, but still trust Mozilla's curated default trust anchors, you
MUST obtain this bundle of certificates and add it to this file.

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_CA_FILE`](#meerkatsigningcafile).

## MEERKAT_TLS_CERT_FILE

The filepath of the PEM-encoded X.509 certificate chain to use for TLS. The
certs should be ordered by ascending authority: in other words, the certificate
authority / trust anchor certificate should be closest to the _bottom_ of the
file and the end-entity certificate (used directly by Meerkat DSA) should be
closest to the _top_ of the file.

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
<Some base64-encoded data starting with "MII">
-----END CERTIFICATE-----
```

This does not affect the production of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_CERTS_CHAIN_FILE`](#meerkatsigningcertschainfile).

## MEERKAT_TLS_CIPHERS

The OpenSSL-formatted cipher list to use for TLS.

## MEERKAT_TLS_CLIENT_CERT_AUTH

If set to `1`, Meerkat DSA will demand client certificate authentication to
establish a TLS socket with a client.

Note that there is little point to enabling this if non-TLS versions of the
directory protocols are enabled.

## MEERKAT_TLS_CRL_FILE

The filepath to the PEM-encoded certificate revocation list (CRL) file to use
for evaluating the status of TLS client certificates. There may be multiple
CRLs concatenated together. There is no meaning imputed to the ordering of CRLs
in this file.

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
-----BEGIN X509 CRL-----
<Some base64-encoded data starting with "MII">
-----END X509 CRL-----
```

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_CRL_FILE`](#meerkatsigningcrlfile).

## MEERKAT_TLS_DH_PARAM_FILE

The filepath to the Diffie-Hellman parameters to use to enable Perfect Forward
Secrecy (PFS).

## MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS

The number of seconds before completing the handshake after which a TLS socket
will be closed.

## MEERKAT_TLS_KEY_FILE

The filepath to the PEM-encoded PKCS #8-formatted private key to use for TLS.

The file contents should look like this if you open them up in a text editor:

```
-----BEGIN PRIVATE KEY-----
<Some base64-encoded data starting with "MII">
-----END PRIVATE KEY-----
```

:::caution

This file is a secret key. Do not give it to anybody unless you are sure that
they should be able to impersonate / act on behalf of this Meerkat DSA instance.

:::

This does not affect the production of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_KEY`](#meerkatsigningkey).

## MEERKAT_TLS_KEY_PASSPHRASE

The password to use to decrypt the private key to use for TLS.

:::caution

This value is a secret. Do not give it to anybody unless you are sure that
they should be able to impersonate / act on behalf of this Meerkat DSA instance.

:::

## MEERKAT_TLS_MAX_VERSION

The maximum TLS version supported as a string. Possible values are:

- `TLSv1.3`
- `TLSv1.2`
- `TLSv1.1`
- `TLSv1`

## MEERKAT_TLS_MIN_VERSION

The minimum TLS version supported. Possible values are:

- `TLSv1.3`
- `TLSv1.2`
- `TLSv1.1`
- `TLSv1`

:::caution

Avoid setting this value to `TLSv1.1` or `TLSv1` unless absolutely necessary.
These versions of TLS are much less secure. (Though, still better than no
TLS at all.)

:::

## MEERKAT_TLS_OCSP_CHECKINESS

If set to `0` or unset, this DSA will not check with OCSP responders for the
status of an asserted certificate used in TLS. If greater than zero, this DSA
will check with OCSP responders for the status of an asserted certificate (if an
OCSP responder is defined for that certificate)
~~and cache the result for this value's number of seconds~~.

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_OCSP_CHECKINESS`](#meerkatsigningocspcheckiness).

## MEERKAT_TLS_OCSP_MAX_REQUESTS_PER_CERT

The maximum number of OCSP responders to check with before giving up for a given
certificate. This MUST be an unsigned integer, or unset. If unset, this defaults
to `3`.

This only applies to OCSP responses obtained in the verification TLS peers--not
signed arguments, results, or errors. The equivalent of this
configuration option for signed arguments, results, or errors is
[`MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT`](#meerkatsigningocspmaxrequestspercert).

## MEERKAT_TLS_OCSP_REPLAY_WINDOW

The number of seconds by which the OCSP `producedAt` time and `thisUpdate`
time may differ from the current time before an OCSP response is
considered invalid on the grounds of being a possible
[replay attack](https://en.wikipedia.org/wiki/Replay_attack).

This only affects OCSP verification for TLS and does not affect OCSP
verification for signed arguments, results, or errors; that is controlled by
the [`MEERKAT_SIGNING_OCSP_REPLAY_WINDOW`](#meerkatsigningocspreplaywindow) configuration option.

An attacker's ability to replay an OCSP response is not too dangerous as long as
this threshold is low (in other words, the window is small). If the replay
window is large, it means that, if an attacker can intercept your communication
with the OCSP responder, he can replay the OCSP response to illegitimately make
it appear as though the certificate is still valid. If the replay window is too
small, such as 1 second, then a slight variation in the OCSP responder's system
clock could mean that Meerkat DSA rejects the response as a "replay" (speciously). This is like the `clockskew` configuration option in MIT's
Kerberos implementation.

It is recommended that you leave this at the **default value of 15 seconds**.

## MEERKAT_TLS_OCSP_RESPONSE_SIZE_LIMIT

The maximum size in bytes of OCSP responses. If an OCSP response is fetched and
it exceeds this size, Meerkat DSA will cancel fetching it, and/or refuse to
decode it. This limit should NOT be considered exact.

This only affects OCSP verification for TLS and does not affect OCSP
verification for signed arguments, results, or errors; that is controlled by
the [`MEERKAT_SIGNING_OCSP_RESPONSE_SIZE_LIMIT`](#meerkatsigningocspresponsesizelimit) configuration option.

:::info

This is important because OCSP requests can be configured to be submitted
automatically by Meerkat DSA to any endpoint listed on an X.509 certificate
presented by a client / association. This prevents a malicious user from
presenting Meerkat DSA with a malicious X.509 certificate that defers to a
maliciously-designed OCSP responder that responds with an exhaustively large
payload that inundates this Meerkat DSA instance.

:::

## MEERKAT_TLS_OCSP_SIGN_REQUESTS

If set to `1`, Meerkat DSA will use its signing key to digitally sign OCSP
requests issued in relation to TLS, and present its
signing certificate chain to the OCSP responder.

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_OCSP_SIGN_REQUESTS`](#meerkatsigningocspsignrequests).

## MEERKAT_TLS_OCSP_TIMEOUT

The number of seconds for a given OCSP responder to respond before Meerkat DSA
abandons the request. If set, this MUST be an unsigned decimal integer.

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_OCSP_TIMEOUT`](#meerkatsigningocsptimeout).

## MEERKAT_TLS_OCSP_UNKNOWN_IS_FAILURE

If set to `1`, Meerkat DSA will treat OCSP responses that indicate that a
certificate's status is `unknown` as a failure, as though the certificate was
`revoked`. This only applies to verification OCSP responses received via TLS and
does not affect the verification of signed arguments, results, or errors.

This does not affect the verification of signed arguments, results, or errors;
the equivalent of this environment variable that affects signing is:
[`MEERKAT_SIGNING_OCSP_UNKNOWN_IS_FAILURE`](#meerkatsigningocspunknownisfailure).

## MEERKAT_TLS_PFX_FILE

The filepath to a PFX / PKCS #12 file to use for TLS.

:::caution

This is a security-sensitive file that contains both your X.509 certificate
chain as well as your private key. Do NOT give this file to anybody that should
not be able to impersonate / act on behalf of this Meerkat DSA instance.

:::

## MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS

If set to `1`, Meerkat DSA will refuse to establish a TLS session with a
client that does not present a valid X.509 certification path that can be trusted
according to the trust anchors defined in the `MEERKAT_TLS_CA_FILE` file. This
is used to enable TLS client certificate authentication, otherwise known as
Mutual TLS (mTLS). This defaults to `0`, meaning that it will be disabled.

## MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS

If set to `0`, Meerkat DSA will NOT refuse to establish a TLS session with a
server that does not present a valid X.509 certification path that can be trusted
according to the trust anchors defined in the `MEERKAT_TLS_CA_FILE` file. This
defaults to enabled, meaning that the identities of TLS servers will be checked
as is usually expected from TLS.

:::caution

It is a security vulnerability to set this to `0`, because Meerkat DSA will not
check the identities of peers that it connects to over TLS!

:::

## MEERKAT_TLS_REQUEST_OCSP

If set to `1`, Meerkat DSA will request OCSP stapling from TLS peers to which
it acts as a client and validate the stapled OCSP responses, if present. This
applies to both TLS clients and TLS servers.

## MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS

The time after which a TLS session will expire and a TLS client will have to
negotiate a new pre-master secret.

## MEERKAT_TLS_SIG_ALGS

Colon-separated list of supported signature algorithms. The list can contain
digest algorithms (SHA256, MD5 etc.), public key algorithms (RSA-PSS, ECDSA
etc.), combination of both (e.g 'RSA+SHA384') or TLS v1.3 scheme names (e.g.
rsa_pss_pss_sha512).

:::info

I copied the above from the NodeJS documentation.

:::

## MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER

Currently unused.

## MEERKAT_TRANSCODE_VALUES_TO_DER

Currently unused.

## MEERKAT_TRUST_ANCHORS_FILE

The filepath of the Trust Anchor List file. See
[IETF RFC 5914](https://datatracker.ietf.org/doc/html/rfc5914). This file
contains information on the trust anchors to be used for verifying
signed arguments, results, and errors.

The trust anchor list shall be encapsulated in a Cryptographic Message Syntax
(CMS) message. It does not need to be the top-level object, however. It can be
nested within authenticated data, signed data, or digested data objects, as
defined in [IETF RFC 5652](https://datatracker.ietf.org/doc/html/rfc5652).

This file may also be PEM-encoded. The PEM label must be `TRUST ANCHOR LIST`,
such that the file looks like this when opened in a text editor:

```
-----BEGIN TRUST ANCHOR LIST-----
<Some base64-encoded data>
-----END TRUST ANCHOR LIST-----
```

This file is NOT used for verifying TLS peers.

## MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES

Even if subordinates are cached in memory, Meerkat DSA will directly query the
database to find a specific subordinate instead of iterating through the
in-memory entries when there are more than this many subordinates in memory.

## MEERKAT_WEB_ADMIN_AUTH_USERNAME

If set, this is the username that the web admin console will expect as part of
HTTP basic authentication.

:::caution

HTTP Basic Authentication will only be enabled if both the
[`MEERKAT_WEB_ADMIN_AUTH_USERNAME`](#meerkatwebadminauthusername) and
[`MEERKAT_WEB_ADMIN_AUTH_PASSWORD`](#meerkatwebadminauthpassword) environment
variables are set.

:::

:::caution

HTTP Basic Authentication transmits your username and password in the clear
(without encryption). This means that you should secure your communication with
the web admin console by ensuring that
[`MEERKAT_WEB_ADMIN_USE_TLS`](#meerkatwebadminusetls) is set to `1` and that
[TLS is configured](./tls.md) (otherwise, the former environment variable will
have no effect). Otherwise, intermediaries may be able to sniff your password.

Since this password is not well-protected, it is highly recommended that you
also ensure that this password is not used for any other services. This password
should be unique to Meerkat DSA's web admin console, and not used as the
password for any entry in your DSA.

:::

:::caution

Using passwords in general is vastly inferior to TLS client certificate
authentication. HTTP Basic Authentication was implemented in Meerkat DSA so that
admininstrators could have a modicum of security with little upfront setup, but
it is **highly recommended** that administrators configure a secure reverse
proxy, such as Nginx, Caddy, or Apache, to use TLS client certificate
authentication, rather than relying on the security of a password. Even better
yet, the web admin console should only be accessible behind a VPN, or have some
kind of network access controls to prevent users from accessing it entirely.

:::

## MEERKAT_WEB_ADMIN_AUTH_PASSWORD

If set, this is the password that the web admin console will expect as part of
HTTP basic authentication.

:::caution

HTTP Basic Authentication will only be enabled if both the
[`MEERKAT_WEB_ADMIN_AUTH_USERNAME`](#meerkatwebadminauthusername) and
[`MEERKAT_WEB_ADMIN_AUTH_PASSWORD`](#meerkatwebadminauthpassword) environment
variables are set.

:::

:::caution

HTTP Basic Authentication transmits your username and password in the clear
(without encryption). This means that you should secure your communication with
the web admin console by ensuring that
[`MEERKAT_WEB_ADMIN_USE_TLS`](#meerkatwebadminusetls) is set to `1` and that
[TLS is configured](./tls.md) (otherwise, the former environment variable will
have no effect). Otherwise, intermediaries may be able to sniff your password.

Since this password is not well-protected, it is highly recommended that you
also ensure that this password is not used for any other services. This password
should be unique to Meerkat DSA's web admin console, and not used as the
password for any entry in your DSA.

:::

:::caution

Using passwords in general is vastly inferior to TLS client certificate
authentication. HTTP Basic Authentication was implemented in Meerkat DSA so that
admininstrators could have a modicum of security with little upfront setup, but
it is **highly recommended** that administrators configure a secure reverse
proxy, such as Nginx, Caddy, or Apache, to use TLS client certificate
authentication, rather than relying on the security of a password. Even better
yet, the web admin console should only be accessible behind a VPN, or have some
kind of network access controls to prevent users from accessing it entirely.

:::

## MEERKAT_WEB_ADMIN_AUTH_REALM

If set, this is the realm that the web admin console will expect as part of
HTTP basic authentication.

This has no effect other than controlling the realm displayed to the end user.
(If it is displayed at all.)

## MEERKAT_WEB_ADMIN_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for the
web admin console.

## MEERKAT_WEB_ADMIN_USE_TLS

If set to `0`, the web admin console will _not_ use HTTPS and use HTTP instead.

:::caution

This will have no effect if TLS is not configured in Meerkat DSA in the first
place.

:::

If TLS is enabled, the web admin console will use the same TLS configuration
that the directory services are configured to use.

:::caution

You should only disable TLS on the web admin console if you are using a reverse
proxy that provides TLS.

:::

## NODE_ENV

This is a standard NodeJS-related environment variable. This should be set to
`production` unless you are actually developing Meerkat DSA.
