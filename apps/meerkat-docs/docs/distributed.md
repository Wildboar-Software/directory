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

## Authentication to Other DSAs

If signing is configured, Meerkat DSA will use its signing certificate and key
to attempt strong authentication to every single DSA to which it chains. If this
fails, Meerkat DSA will attempt credentials that are stored in the
`AccessPointCredentials` table in the DBMS, if the targeted access point has
configured credentials stored there. Otherwise, one last attempt will be made
with an anonymous bind.

Populating the `AccessPointCredentials` table has to be done manually. There is
no way to do this using Meerkat DSA (including the web admin console), currently.

## Security Risks of Chaining

:::caution

If you allow a user to add an entry via the `addEntry` operation and they are
authorization to chain operations, they might be able to spam the DSA with
`targetSystem` values containing LAN IP addresses and make the DSA act as a
TCP port scanner and scan the local network and submit chained requests. This
could be an especially bad problem if a reached TCP port will interpret bytes of
a chained request as a different protocol packet, such as a MySQL packet!

:::

To prevent abuse as described above, do not generously grant permissions to
add entries, and require signed arguments for chaining to make it as difficult
as possible to exploit this.

You can configure the authentication required for chaining via these
configuration options:

- [`MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING`](./env.md#meerkat_min_auth_level_for_chaining)
- [`MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING`](./env.md#meerkat_min_auth_local_qualifier_for_chaining)
- [`MEERKAT_SIGNING_REQUIRED_FOR_CHAINING`](./env.md#meerkat_signing_required_for_chaining)

It is also strongly advised to configure network policies that prevent Meerkat
DSA from reaching other services on its local network that it should not be able
to reach. This is simple to do on Kubernetes or Docker.

:::info

Meerkat DSA will **NOT** chain to a transport service that has the same port
number as the DBMS, while this may seem overly restrictive, it is to prevent
Meerkat DSA from being tricked into sending directory requests to the DBMS,
which could get interpreted as, for example, MySQL packets. This has to be
implemented within Meerkat DSA, because you cannot block Meerkat DSA's access
to the DBMS at the network level.

:::

## Behavior of Signed DSP Results

If Meerkat DSA receives a signed DSP result, it verifies this signature, unless
configured otherwise (there are some checks that are not currently configurable).

If the signature is found to be valid, it still may not be viable to return
directly to the prior DSA. If the security parameters of the DSP result contain
a `name` or `time` component, they cannot be re-used, so the valid DSP result
must be re-signed by the local DSA. If the previous recipient is a DUA (as
indicated by being bound using the Directory Access Protocol), the result will
not be re-signed, since the DSP signature will be discarded.

If the signature is found to be invalid, Meerkat DSA will not discard the
result, but instead, it will simply log what is wrong with the DSP result,
discard any sensitive information, such as cross references, received from the
downstream DSA, and re-sign the DSP result.

:::info

This is the behavior of Meerkat DSA because, in most scenarios, this just means
there is a bug, misconfiguration, certificate expiration, or some other
infrastructure problem, rather than tampering. It would be nice to discard the
result and report a service error having problem `unavailable`, but X.500
directories have the option of providing completely unsigned results, and,
particularly for modification operations, the operation might have truly
succeeded in the remote DSA. Since signatures are optional anyway, it seems like
it would only harm directory availability to discard DSP results with invalid
signatures.

:::

## Cross References

As of version 2.8.0, Meerkat DSA supports the use of cross references, which
speed up name resolution and operation continuation by "bookmarking" the DSAs
involved in an operation and making a direct connection to them, rather than
chaining through the first-level DSAs.

These cross references are relayed between DSAs via the `ChainingResults` that
are appended to the DAP result and traverse backwards along the path taken by
chaining. This means that, if the DSP result is signed (not just the DAP
result), the cross references themselves will have integrity protection in
transit, and if the DSP result is _not_ signed, they will _not_ have integrity
protection.

As any kind of routing information is extremely security-sensitive, Meerkat DSA
will not apply cross references unless they appear in a signed DSP result. If
this signed DSP result has an invalid signature, the cross references will not
only not be applied to the local DSAIT, but the local DSA will also discard all
of the cross references, supply its own, and re-sign the DSP result to restore
its validity.

:::info

The cross references returned in a DSP result which has an invalid signature are
discarded because they are optional and extremely security sensitive. Meerkat
DSA will not be complicit in sharing potentially corrupted routing information
with other DSAs.

:::

Meerkat DSA will request cross references if the prior DSA in a chained
operation requested them, or if the
[`MEERKAT_REQUEST_CROSS_REFERENCES`](./env.md#meerkat_request_cross_references)
configuration option is set to `1`.

<!-- and the knowledge reference used to continue
the operation is of type `superior`, `immediateSuperior`, or `cross`.

THIS IS NO LONGER TRUE. subr and nssr are also requested, because a first-level
DSA still might have an interest in skipping past second-level DSAs.

:::info

The above knowledge types are required to request cross references, because
cross references should not be used for subordinate naming contexts, DIT
bridges, etc. When using a cross reference, cross references are still
requested, just to ensure that Meerkat DSA has up-to-date knowledge references,
since these are not automatically kept up-to-date by an operational binding.

::: -->

In addition to the above, all cross references are validated upon receipt. Any
cross references that describe a context prefix that does not lie within the
path of the `targetObject` or that are subordinate to any naming context held
by the local DSA.

:::info

Cross references in violation of the above validation techniques may be
nefarious attempts to hijack namespaces that do not belong to the called DSA.

:::

If the access point named in a cross reference becomes unreachable, Meerkat DSA
will remove the cross reference. A future version of Meerkat DSA will
periodically ignore cross references to ensure that directory routing is still
valid.
