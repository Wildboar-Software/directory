# Operational Binding

## Authentication

A DSA will almost never have an AE-Title that falls within a naming context of
a remote DSA. Even if so, it would only be for one remote DSA. For operational
binding to scale, Meerkat DSA must have some procedure for authenticating to any
DSA in the world.

## Authorization

### Authorizing users to create operational bindings through the `targetSystem` option

Users may log in as the root DSE. The root DSE user has all permissions. The
root DSE user is the only user that may use the `targetSystem` option to create
new hierarchical operational bindings.

Alternatively, I could just allow any user with normal permissions to add that
entry to initiate the HOB.

### Accepting operational binding requests from remote DSAs

Accepting operational binding requests from remote DSAs can only be done via the
administrative web portal. A requested operational binding will sit in the queue
until the sooner of `OPERATIONAL_BINDING_REQUEST_TTL_IN_SECONDS` seconds or the
`timeLimit` of the request, if one is requested, before a
`currentlyNotDecidable` error is returned. If the request is rejected, the
rejecting administrator may instruct the local DSA to respond with a
`invalidStartTime`, `invalidEndTime`, or `invalidAgreement` error.

<!-- By default, a DSA blacklists all other DSAs. Any DSA attempting to create an
operational binding must be explicitly whitelisted. In addition, the remote DSA
will be checked against an explicit blacklist. The blacklist is for prohibiting
DSAs from all operations, chained or operational, entirely. The whitelist is
solely for permitting operational binding operations.

If the DSA is whitelisted according to the above, the operational binding will
then be checked against an explicit whitelist filter that is recursively
composed of `and`, `or`, `not`, and `item` alternatives, just like the X.500
`Filter` or `Refinement` types. The `item` alternatives are:

- `host`, which filters what DSA(s) are authorized by their hostname or IP address (string)
- `since`, which filters the time after which the request may be authorized (date string)
- `until`, which filters the time before which the request may be authorized (date string)
- `type`, which filters what types of operational bindings may be authorized (OID string)
- ~~`tls`, which filters if `tls` was used to secure the request (boolean)~~ (This cannot be used, because future interactions cannot be guaranteed.)
- `duration`, which limits how long the operational binding may last in seconds (integer)
- `subtree`, which limits the entries that may be targeted for the HOB or shadowing (JSON `SubtreeSpecification`) -->
