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

## The Web Console

Meerkat DSA also provides a web-based administrative console, which does not
listen over TLS and which provides no authentication or security at all. **Users
are expected to place some sort of proxy in front of this that requires
authentication, or simply not expose it at all.** It is only necessary for
accepting or rejecting requested operational bindings; everything else can be
done using the X.500 protocols. In the future, we will find a way to make even
this possible without the web console.

Note that listening with the web-based
administrative console is a **security risk** because there is no
authentication or access controls required; all entries in memory may be read,
entries may be deleted, and many more hazards. If you do not expect to need
this, it is strongly recommended that you do not enable it. Also note that, even
if authentication is configured for the web console via a proxy, there may be
other security issues; we suspect it may be vulnerable to CSRF, but this has yet
to be tested.

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

## TLS Configuration

> Many details in this section will change soon.

TLS can be configured via the following environment variables:

- `MEERKAT_TLS_CERT_FILE`
- `MEERKAT_TLS_KEY_FILE`

Or by including

- `MEERKAT_TLS_PFX_FILE`

`MEERKAT_TLS_CERT_FILE` contains a file path to the X.509 certificate to be
used for TLS. `MEERKAT_TLS_KEY_FILE` shall contain the file path to the
private key to be used for TLS. If both of these are present, TLS will be
enabled. Otherwise, TLS will silently fail.

If either the key file or PFX file are password-protected, these can be
decrypted by supplying the passphrase in the `MEERKAT_TLS_KEY_PASSPHRASE`
environment variable.

## Result Signing

Currently, results may not be digitally-signed by Meerkat DSA, but the keypair
to be used for digital-signing (eventually) can be configured via these
environment variables:

- `MEERKAT_SIGNING_CERT_CHAIN`
- `MEERKAT_SIGNING_KEY`

`MEERKAT_SIGNING_CERT_CHAIN` contains the file path to the PEM-encoded X.509
certificate chain. `MEERKAT_SIGNING_KEY` shall contain the file path to the
private key to be used for results signing.

Note that these settings may differ from the keypair used for TLS. This is
intentional, because DSA administrators may want results to be signed with a
different keypair that what is used for transport-layer security.

Even if you do not plan to use results signing, you should still configure a
signing key-pair.

_Meerkat DSA determines it's Application Entity (AE) title from its signing certificate._

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
