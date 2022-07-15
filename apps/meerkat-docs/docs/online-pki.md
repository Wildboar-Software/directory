# Online PKI

## OCSP and Remote CRLs

It is important that you understand the risks of using the
[Online Certificate Status Protocol (OCSP)](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol)
and/or remote CRLs for the validation of a certificate chain. These features can
be useful for obtaining timely notification of certificate revocation. However,
these features also come at cost.

### Pros

You can get up-to-date information on certificate revocation. This means that,
if somebody's private key gets hacked, their certificate can get added to the
OCSP responder's list of revoked certificates, and your DSA will know about it
as soon as the OCSP responder is queried again for that certificate's status.
The same can be said for remote CRLs.

### Cons

The first downside is latency. Since both OCSP and remote CRLs require network
requests, they will introduce high latency to the verification. If your DSA's
users are submitting many requests synchronously, and in rapid succession, such
as may be the case in bulk-loading, the latency introduced may be unacceptable.

Meerkat DSA currently caches recently fetched remote CRLs, but this is currently
not configurable. Meerkat DSA does not cache OCSP responses at all.

The second downside is, ironically, security vulnerabilities: enabling these
features means that user inputs can make your Meerkat DSA make certain requests
to arbitrary hosts/services. This can be used (among other things) by attackers
to scan your network. Meerkat DSA does not really have any defense against this
currently (one possible defense would be to block the use of IP addresses as
CRL distribution points and OCSP responders entirely, but this requires further
study).

:::tip

No matter what Meerkat DSA implements, you should always secure your
network. If you are using Kubernetes, you can (and should) configure network
policies. Generally speaking, Meerkat DSA does not need to access anything in
your internal network except for the MySQL database.

:::

[Here is an example of what can go wrong if you enable these](https://liveoverflow.com/gitlab-11-4-7-remote-code-execution-real-world-ctf-2018/).

### Recommendation

By default, OCSP and remote CRL checking are _disabled_ in Meerkat DSA. It is
the opinion of the developer of Meerkat DSA, Jonathan Wilbur, that the risks of
enabling these protocols outweighs the gains to be had from a more timely
notification of certificate revocation (which should be an infrequent event in
general).

In lieu thereof, it is recommended to implement automation to obtain up-to-date
CRLs and simply update the
[`MEERKAT_SIGNING_CRL_FILE`](./env.md#meerkatsigningcrlfile) file and restart
Meerkat DSA every so often so that it is up-to-date. This will be far more
performant, far more secure, and can still give you very fresh information, if
you choose to update it frequently.

### Answering OCSP Requests

Meerkat DSA can also be configured to provide OCSP requests for its own
configured TLS certificate on demand. If
[`MEERKAT_TLS_ANSWER_OCSP_REQUESTS`](./env.md#meerkattlsanswerocsprequests) is
set to `1` (enabled), Meerkat DSA will staple OCSP requests in the TLS
handshake. This option does not affect how Meerkat DSA validates other TLS or
signing peers.

## Server-Based Certificate Validation Protocol (SCVP)

Meerkat DSA does not currently support
[Server-Based Certificate Validation Protocol (SCVP)](https://en.wikipedia.org/wiki/SCVP),
but it will eventually. This means that, when presented with a signed arguments,
results, or errors, along with a certificate or certificate chain, Meerkat DSA
will be able to offload the verification of the digital signatures and the
certification path to the SCVP server. This may also have the benefit of finer
controls over the certification path verification that would make Meerkat DSA
too bloated if implemented.
