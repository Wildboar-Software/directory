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

:::warning

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
[`MEERKAT_LOOKUP_UNCERT_STRONG_AUTH`](./env.md#meerkat_lookup_uncert_strong_auth) is
set to `1` (enabled), Meerkat DSA searches internally for a user by the asserted
distinguished name; if this user is found, and it is of object class
`pkiCertPath`, and it has an attribute of type `pkiPath`, each value of its
`pkiPath` attribute is tried until a certification path is found that verifies
the bind token. If no such vindicating certification path is found, Meerkat DSA
rejects the authentication attempt. It is strongly preferred for clients to
supply a certification path in the bind argument so that this lookup need not
happen.

:::warning

Enabling the above feature is risky, since it can open your DSA up to
denial-of-service attacks. See more
[here](./env.md#meerkat_lookup_uncert_strong_auth).

:::

The certification path is verified with the trust anchors configured in
[`MEERKAT_SIGNING_CA_FILE`](./env.md#meerkat_signing_ca_file). If this environment
variable is not configured, the bundle of certificates that are built in to
the NodeJS runtime are used by default.

If [`MEERKAT_SIGNING_DISABLE_VERIFICATION`](./env.md#meerkat_signing_disable_verification)
is enabled (meaning that all signature verification is disabled in Meerkat DSA),
strong authentication will always fail.

## SPKM Authentication

Meerkat DSA supports SPKM Authentication, but does not use it when binding to
other DSAs. It is almost identical in functionality and security to strong
authentication, except that it is based on existing standards exterior to the
X.500 specifications. If you need high-security authentication, prefer the
`strong` mechanism over `spkm`.

## External Authentication

Meerkat DSA supports the `externalProcedure` authentication mechanism described
in [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en).
This mechanism is an intentionally open-ended and extensible mechanism for
authentication. The parameter for an `externalProcedure` authentication is an
ASN.1 `EXTERNAL`.

Meerkat DSA only uses an `EXTERNAL` value that uses the `syntax` alternative of
the `identification` field. When encoded according to the encoding rules
detailed in ITU Recommendation X.690, such as the Basic Encoding Rules, this
field is referred to as the `direct-reference` field. If the
`indirect-reference` field is supplied, or the `direct-reference` field is not
supplied in the encoded `EXTERNAL` value, Meerkat DSA will respond with an
"authentication mechanism unsupported" error.

The `syntax` field of the `EXTERNAL` (or `direct-reference` according to the
X.690 parlance) is used to transmit an object identifier that identifies the
external authentication mechanism. Meerkat DSA looks up the external
authentication procedure associated with that object identifier and calls a
function to execute that authentication mechanism. If the mechanism is
unrecognized or unsupported, Meerkat DSA will return an "authentication
mechanism unsupported" error.

:::info

There are two reasons that the `presentation-context-id` is not recognized by
Meerkat DSA for the external authentication procedure parameter:

1. It would be really complicated from a code standpoint to "look up" the
   presentation contexts from the underlying protocol stack, especially when
   that has been intentionally abstracted away from the Remote Operation
   Service Element (ROSE).
2. Presentation contexts presented by the presentation layers are likely not
   going to be used for the external authentication procedure because their
   abstract syntaxes usually describe an application-layer protocol, not an
   external procedure.

If you don't understand what this means, don't worry about it.

:::

### TLS Client Certificate Authentication

Meerkat DSA comes with one `externalProcedure` authentication mechanism
built-in: TLS client certificate authentication. It's parameter can be described
using the following ASN.1 syntax:

```asn1
id-tlsClientCertAuth OBJECT IDENTIFIER ::= { 1 3 6 1 4 1 56490 5 401 1 }
tlsClientCertAuth ABSTRACT-SYNTAX ::= { NULL IDENTIFIED BY id-tlsClientCertAuth }
```

In other words, if you send a bind request using an `externalProcedure`
credential having the `syntax` of `1.3.6.1.4.1.56490.5.401.1` and a `data-value`
of `NULL` (although this part is not validated or checked at all), Meerkat DSA
will use TLS Client Certificate Authentication.

This means that Meerkat DSA will determine the user's distinguished name from
the `subject` field of the client certificate asserted via TLS, and consider the
user strongly-authenticated, assuming that the asserted certificate chain is
valid.

Note that, for this to be enabled, the client MUST connect over TLS, and Meerkat
DSA MUST be configured to request a client certificate by either:

1. Setting [`MEERKAT_TLS_REQUEST_CERT`](./env.md#meerkat_tls_request_cert) to `1`, or
2. Setting [`MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS`](./env.md#meerkat_tls_reject_unauthorized_clients) to `1`

(Of course, the client, must also actually _send_ the client certificate. That
is implied.)

### Custom External Authentication Procedures

You can add your own external authentication procedures in the
[init script](./env.md#meerkat_init_js). An external authentication procedure
function has a signature like so:

```typescript
type ExternalAuthFunction = (
    ctx: Context, // The context object
    socket: Socket | TLSSocket, // The TCP or TLS socket underlying the association with the client.
    ext: EXTERNAL, // The EXTERNAL that is the parameter of the `externalProcedure` credential.
    // Set to DirectoryBindError for DAP, and DSABindError otherwise.
    BindErrorClass: (typeof DirectoryBindError) | (typeof DSABindError),
) => Promise<BindReturn>;

// This is what is returned from such a function.
interface BindReturn {
    /**
     * The bound vertex, which will only be set if this DSA has the bound DSE
     * locally.
     *
     * Defined in @wildboar/meerkat-types.
     */
    boundVertex?: Vertex;

    /**
     * The bound distinguished name and optional unique identifier. The
     * distinguished name will be set even if the user provided no credentials
     * to prove that they were that entry. The unique identifier will be set if
     * a local DSE having the bound distinguished name can be found and it has
     * at least one `uniqueIdentifier` attribute value. The first
     * `uniqueIdentifier` attribute value will be used to populate this field,
     * even though there may potentially be multiple such values.
     *
     * Defined in @wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta
     */
    boundNameAndUID?: NameAndOptionalUID;

    /**
     * The level of credibility with which the user claimed to be the bound
     * entry. Whether the user bound anonymously, with a password, or with a
     * asymmetric cryptography will be represented here.
     *
     * Defined in @wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta
     */
    authLevel: AuthenticationLevel;

    /**
     * Information about a user password to return in the bind response or
     * error.
     *
     * Defined in @wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue.ta
     */
    pwdResponse?: PwdResponseValue;

    /**
     * The clearances associated with this user.
     *
     * Defined in @wildboar/x500/src/lib/modules/EnhancedSecurity/Clearance.ta
     */
    clearances: Clearance[];

    /**
     * The credentials for the DSA to return to the client to provide mutual
     * authentication.
     *
     * Defined in @wildboar/x500/src/lib/modules/DistributedOperations/DSACredentials.ta
     */
    reverseCredentials?: DSACredentials;

}
```

If you would like an example implementation, see
[this function](https://github.com/Wildboar-Software/directory/blob/master/apps/meerkat/src/app/authn/external/tls_client_auth.ts),
which is the implementation of the TLS Client Certificate Authentication
mechanism described above.

Once you have your function defined, add it to Meerkat DSA's internal index of
`externalProcedure` mechanisms in the init script like so:

```javascript

const YOUR_MECHANISM_OID_REPLACE_ME = "1.2.3.4.5";

async function init(ctx) {
  // Here, we associate the mechanism ID with the function that does the verification.
  ctx.externalProcedureAuthFunctions.set(YOUR_MECHANISM_OID_REPLACE_ME, your_function);

  // This is just logging, just to show you that you can do this. :)
  ctx.log.info("Added my own custom external authentication mechanism");
}

export default init;
```

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
