# OSI Networking Library

## Note

One of the shortcomings of this library is that it does not currently support
multiple (N)-entities per (N-1)-entity. Every single connection has only one
network, transport, session and presentation entity.

I think this could be implemented by refactoring individual entities into
"layer" objects, which do nothing more than provide mapping between (N)-SAP
addresses and the entities themselves, to which "incoming events" would be
dispatched as they are now.

### Segmenting of SSDUs in the ITU Rec. X.225 Annex A State Tables

I had to hunt forever to find some clarification on what to do here.

ITU Recommendation X.225 (1995), Annex A, Section A.4.2.3:

> The state tables do not take account of segmented SSDUs. When an outgoing SSDU
> is to be segmented or an incoming SSDU is segmented, the procedures defined in
> 7.37 apply to the outgoing event at the appropriate intersection of the state
> tables (that part of the action which transmits the SPDU).

Also worthy of mention, ITU Recommendation X.225 (1995), Section 7.37.1, states
that:

> Where an SSDU is segmented, the first SPDU contains all the parameters which
> would have been present in the SPDU if the SSDU had not been segmented...

This means that this implementation needs to:

1. Record the parameters of the first SPDU that starts a new SSDU.
2. Avoid changing state other than buffering user data until the complete SSDU
   arrives.

I think implementing (1) above could be done (albeit in an ugly fashion) by
having per-SPDU type fields on the SPM state (e.g. `cn`, `fn`, `ab`, etc.). The
properties of this saved SPDU would simply be spread into the final assembled
SPDU. This really only seems necessary for `REFUSE` and `ACCEPT`. The other
SPDUs have not-super-important non-user-data parameters where it would likely
be okay if those were not persisted between SPDUs.

For implementing (2) above, before dispatching the SPDUs, you could check for
the Enclosure Item parameter and defer dispatching if it indicates that there
are more segments of the complete SSDU to follow. This would cleanly avoid state
change, and it would not require too much code. The downside is that it would
require buffering the entire SSDU before returning an error, if there is one.

## Deviations

One big deviations from the specification in this implementation is that some
"invalid intersections" (combination of a current state and an incoming event)
do not lend themselves to following the specified instructions for invalid
intersections.

For instance, in the ACSE, if a `P-CONcnf-` (presentation-layer connect reject)
is received, it makes no sense to send an ACSE abort, because you don't have a
presentation layer over which to do that! So, necessarily, we must deviate from
the specification for handling certain "invalid intersections."

## To Do

- [ ] Return (N)-SAP selectors at each layer.
- [ ] Support many-to-one (N)-entities-to-(N-1)-entities mapping.
