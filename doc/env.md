# Environment Variables

Meerkat DSA is configured via environment variables. In the future, it will
also be configurable via command-line arguments. Environment variables that
are specific to Meerkat DSA are namespaced such that they all start with
`MEERKAT_`.

Meerkat DSA environment variables that represent boolean types will use
`1` to represent TRUE and `0` to represent FALSE. This is because digits
are more locale-independent. Most cultures would recognize `1` to mean
TRUE and `0` to mean FALSE. In general, where boolean environment variables
are used, anything other than `1` simply gets interpreted as FALSE.

Meerkat DSA does not validate environment variable values. If you supply
invalid values, you will get unspecified behavior.

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

## MEERKAT_BIND_MIN_SLEEP_MS

This is the amount of time in milliseconds (at minimum) that Meerkat DSA will
take to respond to a failed authentication attempt. This exists to stifle
[timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

## MEERKAT_BIND_SLEEP_RANGE_MS

This is the maximum amount of time in milliseconds that Meerkat DSA will
add to the time taken to respond to a failed authentication attempt on top of
the minimum as configured by the `MEERKAT_BIND_MIN_SLEEP_MS` environment
variable. The additional time taken in milliseconds is selected uniformly and
at random from 0 to this number.

This exists to stifle
[timing attacks](https://en.wikipedia.org/wiki/Timing_attack).

## MEERKAT_BULK_INSERT_MODE

If set to `1`, this enables bulk-insert mode, where all access control checks
are disabled, some schema checks are disabled, and other validation is
disabled. This exists to speed up a bulk insertion of data when a directory is
still being set up.

## MEERKAT_CLIENT_CERT_ENGINE

This is an open-ended string that specifies the client certificate engine that
OpenSSL can use to obtain a client certificate.

## MEERKAT_DANGEROUSLY_ENABLE_DOP

If set to `1`, this enables Directory Operational Binding Management Protocol
(DOP). This is dangerous and should not be enabled unless you need it.

## MEERKAT_DANGEROUSLY_ENABLE_DSP

If set to `1`, this enables Directory System Protocol (DSP).
This is dangerous and should not be enabled unless you need it.

## MEERKAT_ECDH_CURVES

A colon-separated list of ECDH curves to use in ECDH key agreement. Each curve
can be an NID or name.

## MEERKAT_ENABLE_DAP

If set to `0`, this disables Directory Access Protocol (DAP).

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

## MEERKAT_MIN_AUTH_LEVEL_FOR_OB

The integer representation of the minimum authentication level required for
Meerkat DSA to accept DOP requests.

This defaults to `1`, which corresponds to simple authentication, meaning that,
to use DOP, a DSA must have authenticated using simple authentication
or something stronger.

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
below this number, the TCP socket is closed. This is important for the
prevention of
[Slow Loris attacks](https://en.wikipedia.org/wiki/Slowloris_(computer_security)).

## MEERKAT_MY_ACCESS_POINT_NSAPS

Whitespace-separated NSAP URLs that locate this DSA. This is important for
enabling other DSAs to chain requests to this DSA. These NSAP URLs are used to
populate the `myAccessPoint` attribute in the Root DSE.

**WARNING:** Do NOT include usernames and passwords in any URL
(e.g. `https://username:password@example.com`) you supply with this environment
variable. These URLs will be disclosed freely to all users regardless of
authentication or access control, so nothing sensitive should be included in
them at all.

## MEERKAT_NO_COLOR

If set to `1`, Meerkat DSA will not use colors in log outputs.

## MEERKAT_NO_CONSOLE

If set to `1`, Meerkat DSA will not log to the console.

## MEERKAT_NO_TIMESTAMP

If set to `1`, Meerkat DSA will not include the timestamp in log messages.

## MEERKAT_OPEN_TOP_LEVEL

If set to `1`, Meerkat DSA will not apply any access controls to adding new
entries to the top level. Note that this does not negate access controls for
already-existing first-level DSEs.

## MEERKAT_PRIVATE_KEY_ENGINE

This is an open-ended string that specifies the private key engine that
OpenSSL can use to obtain a private key.

## MEERKAT_PROHIBIT_CHAINING

If set to `1`, Meerkat DSA will not chain any requests.

## MEERKAT_SENTINEL_DOMAIN

This is a fully-qualified DNS name. If it contains a TXT record whose text is
`meerkat:kill`, Meerkat DSA will exit as soon as it detects this. If this
record's text is `meerkat:hibernate`, Meerkat DSA will enter hibernation as
soon as it detects this.

This exists so that Meerkat DSA may be remotely shut down in the event that
a severe security vulnerability is discovered. It is a "remote killswitch."

## MEERKAT_SIGNING_CERT_CHAIN

The filepath to a certificate chain to use for signing requests and responses
from the DSA. This does not affect TLS and may be a totally different chain
than that used for TLS.

## MEERKAT_SIGNING_KEY

The filepath to a private key to use for signing requests and responses
from the DSA. This does not affect TLS and may be a totally different key
than that used for TLS.

## MEERKAT_TCP_NO_DELAY

If set to `1`, Meerkat DSA will disable Nagle's algorithm for TCP connections.
This exists as a slight performance enhancement. There is little reason to use
this.

## MEERKAT_TCP_TIMEOUT_IN_SECONDS

The amount of time (in seconds) after receiving no bytes from the TCP socket
after which the TCP connection will be reset.

## MEERKAT_TLS_CA_FILE

The filepath of the certificate authority certs file to use for mTLS.

## MEERKAT_TLS_CERT_FILE

The filepath of the PEM-encoded X.509 certificate chain to use for TLS.

## MEERKAT_TLS_CIPHERS

The OpenSSL-formatted cipher list to use for TLS.

## MEERKAT_TLS_CLIENT_CERT_AUTH

If set to `1`, Meerkat DSA will demand client certificate authentication to
establish a TLS socket with a client.

Note that there is little point to enabling this if non-TLS versions of the
directory protocols are enabled.

## MEERKAT_TLS_CRL_FILE

The filepath to the PEM-encoded certificate revocation list (CRL) file to use
for evaluating the status of TLS client certificates.

## MEERKAT_TLS_DH_PARAM_FILE

The filepath to the Diffie-Hellman parameters to use to enable Perfect Forward
Secrecy (PFS).

## MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS

The number of seconds before completing the handshake after which a TLS socket
will be closed.

## MEERKAT_TLS_KEY_FILE

The filepath to the private key to use for TLS.

## MEERKAT_TLS_KEY_PASSPHRASE

The password to use to decrypt the private key to use for TLS.

## MEERKAT_TLS_MAX_VERSION

The maximum TLS version supported.

## MEERKAT_TLS_MIN_VERSION

The minimum TLS version supported.

## MEERKAT_TLS_PFX_FILE

The filepath to a PFX / PKCS #12 file to use for TLS.

## MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS

The time after which a TLS session will expire and a TLS client will have to
negotiate a new pre-master secret.

## MEERKAT_TLS_SIG_ALGS

Colon-separated list of supported signature algorithms. The list can contain
digest algorithms (SHA256, MD5 etc.), public key algorithms (RSA-PSS, ECDSA
etc.), combination of both (e.g 'RSA+SHA384') or TLS v1.3 scheme names (e.g.
rsa_pss_pss_sha512).

> I copied the above from the NodeJS documentation.

## MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER

Currently unused.

## MEERKAT_TRANSCODE_VALUES_TO_DER

Currently unused.

## MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES

Even if subordinates are cached in memory, Meerkat DSA will directly query the
database to find a specific subordinate instead of iterating through the
in-memory entries when there are more than this many subordinates in memory.

## MEERKAT_WEB_ADMIN_PORT

If set, this names a TCP port on which Meerkat DSA listens locally for the
web admin console.

## NODE_ENV

This is a standard NodeJS-related environment variable. This should be set to
`production` unless you are actually developing Meerkat DSA.
