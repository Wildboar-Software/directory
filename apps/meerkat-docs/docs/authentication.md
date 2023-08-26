# Authentication

Meerkat DSA supports simple authentication (meaning authentication with a
password) and strong authentication (meaning authentication with digital signatures)
in DAP, DSP, and DOP. LDAP only supports simple authentication.

## Anonymous Authentication

Users of Meerkat DSA may bind anonymously by supplying no password. If this is
used, authentication will always succeed, even if the bound distinguished name
does not correspond to any real entry present and even if the entry _does_ exist
and has a password. This behavior is to avoid information disclosure.

:::note

If Meerkat DSA did not do this, it would be possible for a nefarious
actor to enumerate the entries in a DSA, despite access controls, by guessing
distinguished names in the bind operation and seeing which attempts come back
with errors saying "entry does not exist" and which come back with "invalid
password." This is the same reason that websites with logins must give you the
same error message, regardless of whether you got the username or password
wrong.

:::

When users are bound anonymously, they may perform operations against Meerkat
DSA. It is the responsibility of administrators to configure access controls to
prevent anonymous users from doing things they should not be able to do.

Currently, anonymous usage can only be prevented by access control, but a future
feature will enable administrators to reject all anonymous traffic.

## How Meerkat DSA Handles Passwords

In the X.500 specifications, there is no specified attribute that is expected to
serve as the authoritative source of the password for an entry. Each DSA may
choose to use a different attribute type to store password information; in fact,
passwords might not even be stored in entries at all! This is why the
`administerPassword` and `changePassword` operations were introduced to the
Directory Access Protocol (DAP).

In Meerkat DSA, both the `userPassword` attribute (specified in
[ITU Recommendation X.509](https://www.itu.int/rec/T-REC-X.509/en)) and the
`userPwd` attribute (specified in
[ITU Recommendation X.520](https://www.itu.int/rec/T-REC-X.520/en)) are used.
However, regardless of any access controls, whenever these values are read, they
return empty strings. This is because passwords are extremely sensitive, and
let's face it: people re-use passwords between services. To prevent
administrators from misconfiguring Meerkat DSA and leaking all of their users'
passwords, the passwords are simply never returned, even if queried directly,
and even if access controls permit it. An empty string is returned as the value
so that directory users can at least know _if_ an entry has a password. In other
words, passwords are _write-only_ in Meerkat DSA. This also applies to the
encrypted variants of passwords: they are never returned so that they can never
be used for
[offline password cracking](https://csrc.nist.gov/glossary/term/offline_attack).

The password is stored in the database. If password is supplied using cleartext,
it will be salted and hashed using the Scrypt algorithm and stored in the
database. If the password is already encrypted / hashed, it will be stored using
the algorithm that was used to encrypt it.

## Simple Protected Passwords

Simple authentication allows users to supply a `protected` password. Unlike the
`unprotected` and `userPwd` variants of the simple credentials password, this
variation can be protected against
[replay attacks](https://en.wikipedia.org/wiki/Replay_attack), and it provides
a form of eavesdropping-mitigating encryption, even when TLS is not used to
secure the connection.

There is no specified algorithm for producing a `protected` password, although
[ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
Annex E, provides a suggested algorith. Meerkat DSA deviates from this
algorithm slightly for security reasons. The entirety of the procedures used by
Meerkat DSA are documented [here](./deviations-nuances.md#protected-passwords).

In short, to produce a protected password, a client must produce a DER-encoded
value of an ASN.1 value having the following type:

```asn1
Meerkats-Actual-Hashable1 ::= SEQUENCE {
    name        DistinguishedName,
    time1       GeneralizedTime,
    random1     BIT STRING OPTIONAL,
    password    encrypted < UserPwd -- This is an ASN.1 "selection type." -- }
```

In the above type, `name` is the distinguished name to which the user is
attempting to bind, `time1` is a time a few seconds into the future, `random1`
is a sequence of randomly-generated bits of any length (preferrably at least 64
bits), and `password` is the `UserPwd` construction of the user's password,
which _must_ use the `encrypted` alternative, and

<!-- FIXME: Terminated sentence here. -->

:::tip

It is strongly advised to use protected passwords whenever simple authentication
is used, since they are immune to replay attacks.

:::

## How to Set or Change Passwords

You may set or modify a password for an entry in four ways:

- At creation time, by including password attributes in the `addEntry` operation.
- By modifying the entry via the `modifyEntry` operation.
  - If this is performed within a password administrative area, this requires
    the `pwdModifyEntryAllowed` operational attribute for the applicable
    subentry to have a value of `TRUE`.
- By modifying the entry via the `changePassword` operation
  - If this is performed within a password administrative area, this requires
    the `pwdChangeAllowed` operational attribute for the applicable subentry to
    have a value of `TRUE`.
- By modifying the entry via the `administerPassword` operation
  - In addition to requiring permission to add / modify / delete the `userPwd`
    and `userPassword` values, as is the case for the other three, this option
    also requires the same permissions for the `userPwdHistory` attribute.
  - Note that, when this operation is used, the user will have to reset his or
    her password upon logging in again.

It is recommended to use the `administerPassword` and/or `changePassword`
operations to modify an entry's password, rather than the `modifyEntry` or
`addEntry` operations.

## Password Policy

Meerkat DSA allows you to configure password policy exactly as described in ITU
Recommendations X.501 and X.520.

### Password Dictionaries

You can configure password vocabulary by adding entries to the
`passwordDictionaryItem` table in the database (usually MySQL), along with a
"bit number" indicating the category in which the vocabulary item appears,
according to the syntax of the `pwdVocabulary` operational attribute, which is:

```asn1
PwdVocabulary ::= BIT STRING {
  noDictionaryWords (0),
  noPersonNames (1),
  noGeographicalNames (2) }
```

This means that, if you set the `bit` to `2`, the row that you create will be
considered a "geographical name." **Password dictionary items inserted into the
database MUST be upper-cased, or they will have no effect.**

There is no way to configure password dictionaries via DAP, currently. The
`pwdDictionaries` is purely informative and is not used by the directory in any
way.

:::tip

It is recommended that you DO NOT use this operational attribute, as it goes
against modern guidance on password-based authentication. Namely, it is actually
recommended to construct passwords from four or more dictionary words, as such
passwords are more memorable, yet provide much more entropy than the
prior guidance of the "8 characters minimum, at least one digit, at least one
symbol, etc." password.

:::

### Password Lockouts

Meerkat DSA fully supports password lockouts, as described in
[ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en). This
means that administrators can configure their directories to "lock out" users
after so many failed authentication attempts.

To enable password lockouts, just set the `pwdMaxFailures` operational attribute
on the applicable password administration subentries. You can make the lockout
temporary using the `pwdLockoutDuration` operational attribute, if desired.

:::caution

Enabling password lockouts might not be a good idea. This feature can allow
nefarious users to purposefully guess wrong passwords for other users to lock
them out of their accounts. It may be a good idea to refrain from enabling this
unless you are having problems with brute-force attacks, and even then, the
`pwdLockoutDuration` should be set to a low value to ensure that accounts are
automatically unlocked after a short period of time.

:::

## Strong Authentication

Meerkat DSA supports strong authentication. If a certification path is supplied,
this is used to verify the signature and trustworthiness of the bind token
provided in strong authentication.

If a certification path is _not_ supplied in the bind argument, but a name _is_
supplied (via the `name` parameter), and if the environment variable
[`MEERKAT_LOOKUP_UNCERT_STRONG_AUTH`](./env.md#meerkatlookupuncertstrongauth) is
set to `1` (enabled), Meerkat DSA searches internally for a user by the asserted
distinguished name; if this user is found, and it is of object class
`pkiCertPath`, and it has an attribute of type `pkiPath`, each value of its
`pkiPath` attribute is tried until a certification path is found that verifies
the bind token. If no such vindicating certification path is found, Meerkat DSA
rejects the authentication attempt. It is strongly preferred for clients to
supply a certification path in the bind argument so that this lookup need not
happen.

:::caution

Enabling the above feature is risky, since it can open your DSA up to
denial-of-service attacks. See more
[here](./env.md#meerkatlookupuncertstrongauth).

:::

The certification path is verified with the trust anchors configured in
[`MEERKAT_SIGNING_CA_FILE`](./env.md#meerkatsigningcafile). If this environment
variable is not configured, the bundle of certificates that are built in to
the NodeJS runtime are used by default.

If [`MEERKAT_SIGNING_DISABLE_VERIFICATION`](./env.md#meerkatsigningdisableverification)
is enabled (meaning that all signature verification is disabled in Meerkat DSA),
strong authentication will always fail.

## SPKM Authentication

Meerkat DSA supports SPKM Authentication, but does not use it when binding to
other DSAs. It is almost identical in functionality and security to strong
authentication, except that it is based on existing standards exterior to the
X.500 specifications. If you need high-security authentication, prefer the
`strong` mechanism over `spkm`.

## Architectural Details

You might notice that it can take a few seconds to authenticate to Meerkat DSA.
This is no accident.

Authentication is protected against
[timing attacks](https://ropesec.com/articles/timing-attacks/) by response time
randomization and constant-time string comparison. (These two methods may seem
to contradict each other, and you'd be right to point that out; however, both
are used so that, if one does not work, the other will.) By default, Meerkat DSA
always waits one second, but potentially up to two seconds, before responding
with an authentication result. Response time randomization can be configured by administrators via the `MEERKAT_BIND_MIN_SLEEP_MS`
and `MEERKAT_BIND_SLEEP_RANGE_MS` environment variables.

Notably, Meerkat DSA does not sleep for a random amount of time, perform the
credential evaluation, then return a result; it performs a credential evaluation
then waits the remaining amount of time such that the randomly-selected sleep
time has passed. If the former methodology were used, nefarious actors could
still perform a timing attack by attempting authentication many times to see
which attempts take the longest response time on average.
