# Operational Bindings

## Hierarchical Operational Bindings (HOBs)

Hierarchical operational bindings may be created is through the `addEntry`
operation with the `targetSystem` parameter set to the access point of the
subordinate DSA to which the entry is to be added. This is a standard behavior
defined in the X.500 specifications.

The `governingStructureRule` is supposed to be replicated from a hierarchical
superior to a hierarchical subordinate, but in case it is not, Meerkat DSA, when
acting as a subordinate DSA in a HOB will attempt to calculate the governing
structure rule from what information is replicated regarding the superior
administrative points and subentries. This applies to the context prefix and the
`immSupr` DSE that is created above it.

## Non-Specific Hierarchical Operational Bindings (NHOBs)

Once a Non-Specific Hierarchical Operational Binding (NHOB) is established, a
directory user may add subordinates to it using the `addEntry` DAP operation.
The `targetSystem` field must be set to the access point of the DSA to which the
entry shall be added, and this access point (more specifically, the AE-title of
the DSA) shall be present in the access points present in the
`nonSpecificKnowledge` attribute of the Non-Specific Subordinate Reference
(NSSR) entry. If the `targetSystem` field is not present, the entry will just
be created locally, subordinate to the NSSR. If the `targetSystem` field is
present, but it does not name of the access points participating in the NSSR,
a normal Hierarchical Oeprational Binding (HOB) will be established instead.

To reiterate, the procedure for adding entries to an NHOB in Meerkat DSA is
as follows: if the target DSE is an NSSR:

1. And the `targetSystem` component is not present, just create a local entry.
2. And the `targetSystem` component IS present, AND:
  1. The `targetSystem` refers to one of the access points in the
     `nonSpecificKnowledge` attribute, forward the request to the DSA unchanged.
  2. The targetSystem does NOT refer to one of the access points in the
     `nonSpecificKnowledge` attribute, establish an HOB with the targeted DSA as
     usual.

It is not clear whether this is a deviation from the X.500 specifications.

`removeEntry` can be used like normal to remove entries from an NHOB as usual,
but Meerkat DSA--in deviation from the X.500 specifications--will NOT terminate
the NHOB when the last subordinate entry is removed from an NHOB.

## Authentication

Operational bindings are extremely sensitive matters. For this reason, Meerkat
DSA _requires_ at least simple authentication over TLS to authorize a
Directory Operational Binding Management Protocol (DOP) request. This can be
configured via the `MEERKAT_MIN_AUTH_LEVEL_FOR_OB` environment variable, which
controls the authentication level required for operational bindings, and the
`MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB`, which controls the local qualifier
required for operational bindings.

Even after this, operational bindings require acceptance. The only way to do
this currently is with the web administration console. Review the requested
operational binding and click the "approve" button to approve it. If you do
not click "approve" quickly enough, the request will expire and the proposed
operational binding will be rejected. Currently the timeout is five minutes,
but this will eventually be configurable.

**It is DANGEROUS to enable the web administration console at all. Please
ensure that it is only available behind a reverse proxy that requires
authentication and transport security.**

## Relayed Operational Bindings

The X.500 specifications define three operational bindings, and for each, two
ways in which they can be established _in theory_. However, in practice, the
X.500 specifications do not define any way these operational bindings can be
initiated using X.500 protocols, meaning that DSAs must define some non-standard
way for DSA administrators to trigger a DSA to propose and establish an
operational binding with another DSA. For instance, there is no X.500-defined
procedure for triggering a DSA to request a shadowing operational binding with
a supplier DSA.

For this reason, Meerkat DSA defines a private extension to the
`EstablishOperationalBindingResultData` and
`TerminateOperationalBindingArgumentData` ASN.1 productions: `relayTo`, and with
it, the DSA behavior referred heretofore as "relayed operational bindings."

Relayed Operational Bindings (ROB) requests, are "pseudo-DOP" requests received
from a DSA admin, and signed using the DSA's own private key. The `relayTo`
field contains an access point to which the bound DSA should relay a similar
DOP request of its own. In other words, a DSA admin can send the
`establishOperationalBinding` or `terminateOperationalBinding` request to the
DSA they administer with the `relayTo` field, which the DSA shall then relay,
possibly after modification and re-signing, to the other DSA that is to
cooperate in the operational binding.

This feature is not technically a "deviation" from the specification, since it
does not conflict with the behaviors of the X.500 directory specifications.

### Authentication

As stated above, ROB requests MUST be signed and they MUST signed with the
_bound DSA's private key_. Since there is no access control that applies to the
DSA in general, this serves as a form of access control: a DSA administrator
that can obtain the signing private key for a DSA can demonstrate their
legitimacy to act on behalf of the DSA. Having the signing private key for a DSA
basically proves that _you are the DSA_. Hence, a DSA that supports ROB will
check that ROB requests are signed with its own private key before relaying
such requests.

:::warning

Using the DSA's private key usually entails it being installed on the device of
the X.500 DUA. This means that the private key will be present on two or more
devices, which presents a security risk. If one such device is compromised, and
the private key exfiltrated, nefarious users may act on behalf of the DSA.

For this reason, it is recommended to rotate the DSA's signing key after the
desired relayed operational bindings have been established or terminated.

:::

### Behavior

With a relayed operational binding request, the DSA reserves the right to modify
the request, so long as the "general intention" of the request is preserved.

:::note

The rationale for this is that the DSA administrator's information may be
incorrect or out-of-date. For instance, when populating the context prefix info
of a hierarchical operational binding, the DSA administrator might have misnamed
some of the vertices or missed a subentry. In either such case, the bound DSA
may modify this request to correct for errors like these, so long as major
details of the request are still preserved.

:::

You may have also noticed that the documentation above does not mention that
`relayTo` is available for `modifyOperationalBinding`. This is because, for all
operational bindings defined in the X.500 specifications, there exist procedures
for a DSA to automatically update the operational bindings correspondent DSAs,
namely when entries are added, modified, or deleted. Further, the added
complexity just isn't worth the effort and risk for a non-standard feature that
may be obviated in future X.500 specifications.

### ASN.1 Specification and Formal Procedure

The following component is added to to the ASN.1 `SEQUENCE` types,
`EstablishOperationalBindingResultData` and
`TerminateOperationalBindingArgumentData`, defined in
[ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en):

```asn1
relayTo [PRIVATE 0] AccessPoint
```

`AccessPoint` is defined in
[ITU Recommendation X.518 (2019)](https://www.itu.int/rec/T-REC-X.518/en), in
the `DistributedOperation` ASN.1 module.

If the above private extension is included in an `establishOperationalBinding`
or `terminateOperationalBinding` request, the request is, by definition, a
Relayed Operational Binding (ROB) request.

The formal procedure for handling such a request by a bound DSA is as follows:

1. Validate the signatures of the request as usual, meaning both the validity
   of the digital signature and the PKI used to authenticate the public key that
   produced it.
2. Check that the request was signed with the bound DSA's own private signing
   key. (NOT the private key used for TLS, unless this is the exact same key as
   is used for signing.)
3. Construct a new request by:
  1. Removing the `relayTo` private extension. This is critical for preventing
     subsequent DSAs from interpreting the relayed DOP request as yet another
     relayed DOP request, which might create an infinite loop.
  2. Correcting small errors in the request, and filling in useful details.
  3. Updating the `time` field of any `SecurityParameters`.
  4. Changing the `random` field of any `SecurityParameters`.
  5. Re-signing the DOP request.
4. If the request cannot be formulated as described in step 3, or cannot be
   honored for some other reason (such as the bound DSA not controlling the
   context prefix named in the `HierarchicalAgreement` of a proposed HOB), the
   bound DSA shall return an `operationalBindingError` to the user hinting at
   the particular aspect of the relayed DOP request that could not be honored
   (e.g. use the `invalidAgreement` problem to indicate a problem with the
   agreement). If this is the case, the error data's `performer` field MUST
   contain the distinguished name of the bound DSA, so as to indicate that the
   request could not be relayed at all.
5. Transmit the newly-formulated DOP request to the DSA indicated by the
   `relayTo` parameter of the original DOP request. The bound DSA shall then,
   in every other way, respond to the outcome of this request as required by
   the specifications, but return a response (which may differ from this
   outcome) to the DSA admin that requested the relayed DOP.
   - If a result or error is obtained, the result should be forwarded back to
     the requestor unchanged.
   - In other cases, such as rejects or aborts, the bound DSA's behavior will
     remain undefined by these procedures.
   - If the correspondent DSA cannot be reached, the response to
     the DSA admin should not time out or close the association: a
     `serviceError` should be returned instead.


NOTE for later: document absence of algorithm identifier in signed arguments,
results, errors, etc.

4