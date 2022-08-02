# Networking

## Directory Protocols

Currently, Meerkat DSA only supports the transport of X.500 protocols via IDM
or IDMS (IDM encapsulated in TLS).
LDAP may be used as well, and may be optionally encapsulated in TLS. For both
categories of protocols, StartTLS may be used as well.

The protocols which Meerkat DSA uses can be controlled by the following
environment variables, which specify the port number on which these services
listen:

- `MEERKAT_WEB_ADMIN_PORT` (Recommended: 18080; be careful when exposing this.)
- `MEERKAT_IDM_PORT` (Recommended: 4632)
- `MEERKAT_IDMS_PORT` (Recommended: 44632)
- `MEERKAT_LDAP_PORT` (Recommended: 389; requires root privileges)
- `MEERKAT_LDAPS_PORT` (Recommended: 636; requires root privileges)

If a port number is set, Meerkat DSA listens on that port for the given service.
If no port is set, that service does not listen at all. This means that it is
possible to run Meerkat DSA as an LDAP-only or X.500-only server by simply
not configuring ports for those services.

## Distributed Operation

For distributed operations, Meerkat DSA stores the access points obtained from
knowledge attributes in the `AccessPoint` table. Currently, Meerkat DSA can only
make use of IDM-based (and IDMS-based) access points. All other access points
will be ignored.

You may directly alter the rows in the `AccessPoint` table to add or remove
access points, but Meerkat DSA may have to be restarted for your changes to
take effect. (We say "may" literally: it might not require a restart if you are
not using in-memory caching of the DIT.) It is recommended that you instead use
the Directory Access Protocol with the `manageDSAIT` flag set to modify
knowledge attributes rather than altering the database directly.

## DNS Configuration

It is not necessary at all, but for the sake of service discovery, it is
recommended that you configure DNS for your domain to name your directory as
a service using `SRV` records. If you want to keep your directory a secret, it
is advised that you refrain from exposing it to the global Internet at all.

SRV records should be defined for IDM, IDMS, LDAP, and LDAPS like so:

```
_idm._tcp.example.com 3600 IN SRV 0 5 <IDM port number> dsa01.example.com
_idms._tcp.example.com 3600 IN SRV 0 5 <IDMS port number> dsa01.example.com
_ldap._tcp.example.com 3600 IN SRV 0 5 <LDAP port number> dsa01.example.com
_ldaps._tcp.example.com 3600 IN SRV 0 5 <LDAPS port number> dsa01.example.com
```

Note that, in the above example you will need to swap out `example.com` with
your domain, `dsa01` with your DSA's host name, the port numbers enclosed in
brackets above and configure the other SRV record parameters as you see fit.

You will also need A and/or AAAA records corresponding to the hostnames on the
right hand side of the SRV records.

Again, DNS configuration is NOT required for Meerkat DSA to work.

## The Future

In the future, Meerkat DSA may support:

- TOR / Onion Routing / SOCKS Transport
- ZMQ Transport
- ITOT Transport
- LPP Transport
