# Operational Bindings

## Hierarchical Operational Bindings

The only way hierarchical operational bindings may be created is through the
`addEntry` operation with the `targetSystem` parameter set to the access point
of the subordinate DSA to which the entry is to be added.

There is no way to initiate a hierarchical operational binding as a subordinate
DSA, but this may change in the future.

## Other Operational Bindings

There is no way to initiate any other type of operational binding.

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
