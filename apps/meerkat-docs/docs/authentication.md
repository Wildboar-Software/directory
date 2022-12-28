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

:::note

The web administration console is an exception to the above. It _does_ return the
encrypted user passwords. This is yet another reason why the web administration
console should only be enabled when needed, and why it should be configured with
authentication and TLS!

:::

The password is stored in the database. If password is supplied using cleartext,
it will be salted and hashed using the Scrypt algorithm and stored in the
database. If the password is already encrypted / hashed, it will be stored using
the algorithm that was used to encrypt it.

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

It is recommended to use the `administerPassword` and/or `changePassword`
operations to modify an entry's password, rather than the `modifyEntry` or
`addEntry` operations.

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
