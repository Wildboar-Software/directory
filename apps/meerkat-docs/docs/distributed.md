# Distributed / Chained Operations

## Authentication of Distributed Operations

There are two ways defined for a DSA to authenticate the original requester of
a chained operation: either by trusted the `originator` and `authenticationLevel`
asserted by a remote DSA in its `ChainingArguments` by fiat (which is called
Identity-Based Requester Authentication (IBRA)), or by validating
digital signatures on signed DAP arguments (which is called Signature-Based
Requester Authentication (SBRA)). The latter is obviously more secure
than the former. These are described in
[ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en),
Section 22.

### Identity-Based Requester Authentication

In Meerkat DSA, the only way to accept a new proposed operational binding
(currently) is via the [web administration console](./webadmin.md). When you
accept an operational binding in the "Operational Bindings" section, you will
be able to check a box that indicates that the proposing DSA will be trusted
for Identity-Based Requester Authentication.

:::caution

This is a dangerous setting, because it means that you will trust that DSA to
honestly indicate the originator and authentication level. Do NOT enable this
unless you completely trust the other DSA will ALL information in your DSA!

:::

### Signature-Based Requester Authentication

Unless you intentionally disable all signature validation (not recommended),
Signature-Based Requester Authentication (SBRA) is _always_ enabled. If the
signature on the original DAP operation is cryptographically signed and this
signature is trustworthy according to the
[trust anchors configured for signing](./signing.md#configuring-signing),
Meerkat DSA will use the subject of the end entity certificate as the requester
and will attribute an authentication level of "strong" to the requester, since
a valid signed argument is effectively as good as strong authentication, _subject to the
restrictions below_.

In other words, if the DAP argument is signed, the requester's authentication
level will (subject to the restrictions that follow), be equal to this
`AuthenticationLevel`:

```asn1
withSignedDAPArgument AuthenticationLevel ::= {
  basicLevels {
    level strong,
    signed TRUE
  }
}
```

## Restrictions that Apply to Both

The effective authentication level for a user will be _the lesser of the level
and localQualifier_ for the DAP originator and the client DSA. This is not a
requirement of the X.500 specifications, but a nuance of how Meerkat DSA
operates. For example, if a requester authenticates using strong authentication,
but the operation is chained via a DSA that anonymously binds to another DSA to
continue the operation, the request is effectively considered "anonymous,"
despite the original user's strong authentication.

:::info

The rationale for this is that the real authentication level of a request could
be argued to be the authentication of the "weakest link" as a request traverses
one or more DSAs. Therefore, if a user authenticates using strong authentication,
but a DSA chains their operation by authenticating to another DSA with only a
password, the request itself is only as authenticated as a password.

This was a design choice in line with Meerkat DSA's philosophy: whenever an
ambiguity exists in the specification, pick the more secure interpretation.

:::

For this reason, it is important for DSAs that cooperate to perform chaining
should all use strong authentication and TLS, so that the authentication levels
of chained operations do not get "downgraded" in the eyes of Meerkat DSA.

## Handling of Invalid Signatures

Invalid / untrusted signatures on arguments are not immediately treated as
failures by Meerkat DSA, because signed operations that are given to a DSA may
end up being chained to another DSA. The DSA that initially receives the signed
arguments may not be the one that actually performs the operation. However,
access controls are still an important aspect of name resolution. Meerkat DSA
has to decide, before the operation is chained to another DSA, whether a bound
DUA even has permission to know of the existence of a given subordinate
reference, for instance.

For this reason, when a digital signature is invalid in the eyes of a given
Meerkat DSA instance, the authentication level attributed to the request is
downgraded, such that `signed` is `FALSE`, and the operation proceeds with the
resulting authentication level. This means that the Find DSE procedure may
traverse subtrees of the DIT that are only discoverable to, say,
password-authenticated users, but not ones that require valid signed arguments.
Once the target entry is located, and operation execution has begun, the
performing DSA (assuming it is a Meerkat DSA instance) will check if the
argument is signed, but the authentication level's `signed` component is set to
`FALSE`, which indicates that the signature is invalid. If this is the case, it
means that the signature was determined to be invalid earlier (in the request
validation procedure), and at that point, the operation will fail with an error,
indicating that the signature is invalid.

That was a mouthful. To summarize: the digital signature is checked by each
Meerkat DSA instance in a distributed operation, and if the signature is
invalid, the authentication level is silently downgraded to reflect that, but
the operation continues. If the Meerkat DSA instance that actually performs the
operation (as opposed to merely chaining the operation to another DSA) has
determined that the signature is invalid, an error is returned.

:::info

To be clear, the above only applies to Meerkat DSA. This behavior is not
specified in the X.500 specifications, so other DSA implementations may not
conform to the behavior described above.

:::
