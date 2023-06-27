# Attribute Certificates

## The attrCertReq Extension

In Meerkat DSA, a special private extension has been added to the `read`
operation--specifically, the `ReadArgumentData` fields--called `attrCertReq`.
It has the following ASN.1 syntax:

```asn1
AttrCertReq ::= [PRIVATE 0] EXPLICIT SET {
    singleUse   [0] EXPLICIT BOOLEAN OPTIONAL,
    noAssertion [1] EXPLICIT BOOLEAN OPTIONAL,
    ...
}
```

If supplied in the `ReadArgumentData`, the DSA--if it recognizes this
extension--should return an X.509 attribute certificate that it signs with its
own signing key, containing the exact set of attributes that are returned from
the `read` operation. In Meerkat DSA, any attribute types (meaning just the
type and no values) that are returned will be filtered out, but this may change
in the future and should not be considered an expected behavior: the obvious
alternative would be to return a `Attribute`s with an empty set of values.

:::note

The rationale for this being supported only in the `read` operation, and not
the `search` operation, is that it could be very computationally expensive to
produce an attribute certificate for every search result for a large set of
search results, and it could therefore open up Meerkat DSA to denial-of-service
attacks whereby it is overwhelmed with requests to produce attribute
certificates for a very large number of results. It is better for this
extension to be reserved for `read` only.

:::

The `issuer` field will be populated with the DSA's AE-title, which is taken
from the signing key in Meerkat DSA. The `holder` field will use a single
`entityName` using the `directoryName` alternative, using an `rdnSequence` that
contains the distinguished name of the entry targeted by the `read` operation
(after aliases have been resolved).

:::note

In the future, there may be another extension to the above to use an unresolved
alias name in the holder field, but this could be a security risk: if
implemented incorrectly, it means that Meerkat DSA could sign attribute
certificates that impute attributes to the wrong entity!

:::

The `attrCertValidityPeriod` field shall have its `notBeforeTime` set to the
moment the request is made (or around that time), and the `notAfterTime` shall
be set to a time that is controlled by the DSA: preferrably a very short amount
of time in comparison to normal X.509 public key certificate durations, such as
an hour or a day. In Meerkat DSA, the duration of the attribute certificate is
controlled by the
[`MEERKAT_ATTR_CERT_DURATION`](./env.md#meerkat_attr_cert_duration)
configuration option.

:::info

The rationale for wanting a lower duration for attribute certificates is that,
assuming the directory does not have availability problems, new attribute
certificates can be requested as needed as the old ones expire: this differs
from the issuance of public key certificates, which usually entail some ordeal
to prove one's identity.

On the other hand, if attribute certificate validities are too long, there is a
risk of the contents of the attribute certificate being out of sync with what is
in the directory. For example, if a person was a member in a group when an
attribute certificate with a validity duration of five years was issued, but the
user's membership was revoked shortly thereafter, the user would be able to
credibly assert to third parties that the user is still in the group for the
remaining five years! Worse yet, Meerkat DSA has no means (currently) to produce
attribute certificate revocation lists or add attribute certificates to them,
making it difficult to revoke them!

:::

If `singleUse` is `TRUE`, the DSA shall insert a `singleUse` extension into the
attribute certificate's extensions. If `noAssertion` is `TRUE`, the DSA shall
insert a `noAssertion` extension into the attribute certificate's extensions. A
DSA that supports this feature may still insert these extensions unless these
fields are explicitly set to `FALSE`, indicating that the user is requesting
that these extensions be excluded from the attribute certificate.

In general, the same authorization required to receive signed results shall
apply to receiving an attribute certificate, since the two are so similar in
concept.

If the DSA chooses not to produce an attribute certificate (say, because of
insufficient authorization for the requesting user) or a lack of a configured
signing key, or fails in producing this attribute certificate, the DSA shall
simply return a normal `read` result. If the request was honored, the bytes of
the attribute certificate shall be added to a private extension in the
`ReadResultData` having the following syntax:

```asn1
    attrCert  [PRIVATE 0] IMPLICIT OCTET STRING OPTIONAL
```

:::note

The rationale for returning the attribute certificate as an octet string is to
prevent a re-encoding from producing a different `toBeSigned` encoding that
would result in an invalidated signature; in other words, its purpose is to
preserve the exact bytes and signature value of the attribute certificate, even
if the directory uses BER or some other set of encoding rules to transmit ASN.1
data.

:::

