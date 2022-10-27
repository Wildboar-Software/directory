# OSI Networking Library

## Note

One of the shortcomings of this library is that it does not currently support
multiple (N)-entities per (N-1)-entity. Every single connection has only one
network, transport, session and presentation entity.

I think this could be implemented by refactoring individual entities into
"layer" objects, which do nothing more than provide mapping between (N)-SAP
addresses and the entities themselves, to which "incoming events" would be
dispatched as they are now.

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