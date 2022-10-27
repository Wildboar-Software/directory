# OSI Networking Library

## Note

One of the shortcomings of this library is that it does not currently support
multiple (N)-entities per (N-1)-entity. Every single connection has only one
network, transport, session and presentation entity.

I think this could be implemented by refactoring individual entities into
"layer" objects, which do nothing more than provide mapping between (N)-SAP
addresses and the entities themselves, to which "incoming events" would be
dispatched as they are now.
