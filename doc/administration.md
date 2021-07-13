# Administration

## Hibernate

- All requests, both DAP, DSP, and LDAP, return `busy`.

## Lockdown

- Server stays up, sockets remain open, but IDM sockets return an `abort`
  packet to all requests, with the reason `reasonNotSpecified`.
- All LDAP connections are immediately terminated.

## Hierarchical Operational Bindings

### Blacklisting Requests

- by Requestor
- by Requestor + Type
- by Requestor + Type + Parameters

## Shadow Operational Bindings

## Updates

## Blacklisting DSAs

## Whitelisting DSAs
