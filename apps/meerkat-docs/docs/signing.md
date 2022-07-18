# Signed Operations

Meerkat DSA fully supports signed arguments, results, and errors as described in
[ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501-201910-I/en),
Section 17.3, simply referred to in this documentation as "signing."

## What is Signing?

In addition to the point-to-point security provided by TLS, X.500 directories
ensure the integrity of data as it is relayed from DSA to DSA via cryptographic
signatures applied to results or errors. Since, by design, a DSA might be an
intermediary between a client and another DSA, it is necessary for signing to
exist to ensure that the intermediate DSA can spoof results or errors that it
claims to have originated from another DSA. To be clear, TLS only provides
confidentiality and integrity of data transfered between one server to another,
but not for the data that is _relayed_ between servers, thereby necessitating
signing. TLS provides point-to-point confidentiality and integrity. Signing
provides end-to-end integrity, but not confidentiality.

## Configuring Signing

Signing is configured, like [all other configuration options](./env.md), by
environment variables. The environment variables used for configuring signing
start with `MEERKAT_SIGNING_`. You will notice some that start with
`MEERKAT_SIGNING_BIND_`; these variables are what is referred to as "bind
overrides," which are discussed [here](./env.md#tls-and-signing-options).

At minimum, you MUST define a
[`MEERKAT_SIGNING_CERTS_CHAIN_FILE`](./env.md#meerkatsigningcertschainfile) and
[`MEERKAT_SIGNING_KEY`](./env.md#meerkatsigningkey) to enable signing. Notably,
Meerkat DSA determines its Application Entity Title (AE-Title) from the signing
certificate. (NOT the TLS certificate.)

By default, Meerkat DSA will check neither remote CRLs (given in an X.509
certificate's `cRLDistributionPoints` extension) nor OCSP responders for the
validity of a certificate used in signing unless these are turned on using the
[`MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS`](./env.md#meerkatsigningremotecrlcheckiness)
and [`MEERKAT_SIGNING_OCSP_CHECKINESS`](./env.md#meerkatsigningocspcheckiness)
options. Before enabling these, you should understand the
[pros and cons of doing so](./online-pki.md#ocsp-and-remote-crls).

## Verification of Signed Data

Any client can submit signed arguments, and DSAs with which Meerkat DSA
associates may return signed results or errors, provided that the operation
itself permits such signed alternatives. If the
[`MEERKAT_SIGNING_DISABLE_VERIFICATION`](./env.md#meerkatsigningdisableverification)
configuration option is enabled (set to `1`), these signature will NOT be
verified, nor the presented certification path; otherwise, the presented
signature will be verified in accordance with
[ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509-201910-I/en),
Section 6, and the presented certification path will be verified in accordance
with
[ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509-201910-I/en),
Section 12.

The certification path verification procedures are almost identical--if not
actually identical--to those described in
[IETF RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280.html).

## Authorization for Signed Results and Errors

Production of digital signatures can be computationally expensive, especially
if a DSA is getting overwhelmed by a large number of requests, which means that
the production of signed results and errors can be a vector of attack for
hackers looking to intentionally overwhelm your DSA to make it unusable
(a [denial-of-service attack](https://en.wikipedia.org/wiki/Denial-of-service_attack)).

Also, the cryptographic entropy that can be used in the production of digital
signatures
[can be exhausted](https://superuser.com/questions/944510/why-am-i-constantly-running-out-of-entropy),
and, to the extent that results can be controlled by a user, they can be vectors
for [chosen plaintext attacks](https://www.crypto-it.net/eng/attacks/chosen-plaintext.html).

For this reason, it may be desirable to limit who can receive signed results and
errors. Meerkat DSA allows you to define a minimum threshold for authentication
that a user must achieve to receive signed results or errors. Note that, in
addition to meeting this level of authentication, this user will also have to
_request_ signed results or errors: X.500 directory systems are not supposed to
return signed results or errors unless they are requested. How signed results
or errors are requested is discussed later.

Meerkat DSA also allows you to define a different threshold of authentication
just for receiving signed errors. This may differ from the threshold for
receiving signed results. If not explicitly configured, this threshold will be
the same as it is for receiving signed results. It may be desirable to configure
a more stringent threshold of authentication for receiving signed errors than
signed results, since a _result_ generally means that something went well, as
opposed to an error. The presence of a lot of errors may indicate a hacking
attempt, and we don't want to waste precious resources doing favors for hackers,
do we?

The overall authentication requirements for receiving signed results and errors
comes from these environment variables:

- [`MEERKAT_SIGNING_MIN_AUTH_LEVEL`](./env.md#meerkatsigningminauthlevel)
- [`MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER`](./env.md#meerkatsigningminauthlocalqualifier)
- [`MEERKAT_SIGNING_MIN_AUTH_SIGNED`](./env.md#meerkatsigningminauthsigned)

These variables correspond to values of the `AuthenticationLevel` data
structure defined in
[ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
Section 18.4.2.3, which is depicted below:

```asn1

AuthenticationLevel ::= CHOICE {
  basicLevels     SEQUENCE {
    level           ENUMERATED {none(0), simple(1), strong(2),...},
    localQualifier  INTEGER OPTIONAL,
    signed          BOOLEAN DEFAULT FALSE,
    ...},
  other           EXTERNAL,
  ... }

```

Meerkat internally tracks each client's authentication level as a value of the
`basicLevels` alternative shown above. The environment variables shown above
are used to populate an `AuthenticationLevel` to which the client's
`AuthenticationLevel` is compared to determine whether they are permitted to
receive signed results or errors. You can tell what component of
`AuthenticationLevel.basicLevels` each environment variable determines by their
names.

For example, this set of configuration options will require that, to receive
authenticated results or errors, a given user must have authenticated with
_at least_ a password (if not something stronger, such as strong
authentication), and they MUST be using TLSv1.3 (or higher), and they MUST have
signed their argument:

```
MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3=128
MEERKAT_SIGNING_MIN_AUTH_LEVEL=1
MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER=128
MEERKAT_SIGNING_MIN_AUTH_SIGNED=1
```

By authenticating with a password (rather than anonymously or with no
credentials), a user will have an authentication level of 1. By using TLSv1.3 or
higher, the user will receive 128 `localQualifier` points from this DSA, which
means that this user meets the threshold of `localQualifier` "points." By
signing the argument, the user meets the signing requirement as well.

You may want a different authentication level requirement for receiving signed
errors. You can do so by modifying these environment variables, which follow the
same semantics. These environment variables override the authentication level
required for receiving signed results, if they are specified:

- [`MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL`](./env.md#meerkatsigningerrorsminauthlevel)
- [`MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER`](./env.md#meerkatsigningerrorsminauthlocalqualifier)
- [`MEERKAT_SIGNING_ERRORS_MIN_AUTH_SIGNED`](./env.md#meerkatsigningerrorsminauthsigned)

## How to Request Signed Results or Errors

For all DAP operations, with the exception of the `abandon`, `changePassword`,
and `administerPassword` operations, set the `securityParameters.target`
property to `signed` (value 1) to request signed results; set
`securityParameters.errorProtection` to `signed` (value 1) to request signed
errors.

:::info

The `abandon`, `changePassword`, and `administerPassword` operations do not have
`securityParameters`, which is why signing cannot be requested with these
operations.

:::

## How Signing Affects Pagination and Chaining

:::note

This section only applies to `list` and `search` operations.

:::

In Meerkat DSA, signing cannot be used with pagination and chaining. Pagination
and chaining, together, mean that the results may contain digital signatures
produced by other DSAs that were produced over results returned by other DSAs.

There is no way to break these results into pages, nor sorting them, while
retaining their digital signatures obtained from other DSAs; do so invalidates
the signatures. Therefore, signing and pagination are fundamentally at odds with
one another.

:::info

Rationale for this behavior:

Since the search and list results might be important, and since the expected
behavior in this case is not well-defined, Meerkat DSA will not
invalidate the digital signatures to provide the chained and paginated results,
and will simply return an error when these conflicting options are chosen.

:::