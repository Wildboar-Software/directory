# Transport Layer Security (TLS)

TLS is an essential part of directory security. It gives your directory
point-to-point confidentiality and integrity.

However, it _does not_ give your directory operations end-to-end integrity;
intermediary DSAs may spoof arguments, results, and errors, except when signing
is used. See [here](./signing.md) for information on configuring signing.

## TLS Configuration

Almost all TLS-related environment variables start with `MEERKAT_TLS_`. Review
these environment variables [here](./env.md#meerkat_tls_answer_ocsp_requests) for
information on specific configuration options.

Your TLS configuration applies to scenarios where Meerkat DSA operates both as a
server and a client. The only exceptions to this are:

- [`MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS`](./env.md#meerkat_tls_reject_unauthorized_clients)
- [`MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS`](./env.md#meerkat_tls_reject_unauthorized_servers)

Which, as their names imply, operate differently depending on whether Meerkat
DSA acts as a TLS client or server.

At minimum, TLS can be configured via the following environment variables:

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

You can configure your trust anchors (root certificate authorities) through the
use of the [`MEERKAT_TLS_CA_FILE`](./env#meerkat_tls_ca_file) environment variable.
The file referred to by this variable contains the certificate authorities used
to verify TLS peers. If unset, this defaults to a bundle of trust anchors that
are built-in to the NodeJS runtime.

## TLS Client Certificate Authentication

:::note

TLS Client Certificate Authentication is also known as
["Mutual TLS" or "mTLS"](https://en.wikipedia.org/wiki/Mutual_authentication#mTLS).

:::

One way to greatly enhance the security of your directory is to require TLS
client certificate authentication. If you use TLS client certificate
authentication, clients that (attempt to) connect to your directory will be
required to present proof of possession of a private key whose validity can be
traced back to a configured trust anchor. This is much more secure than a
password, and it blocks clients at the TLS socket, rather than at the
application layer, meaning that a smaller attack surface is exposed by a DSA
configured as such.

As long as you have TLS already configured (as described above), all you need to
do to enable this is set the environment variable
[`MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS`](./env.md#meerkat_tls_reject_unauthorized_clients)
to `1` (enabled).

:::warning

While TLS client certificate authentication is generally very secure, there are
risks involved. Namely, you are inviting TLS peers to submit X.509 certificates
to your TLS socket for validation. These inputs are complicated, and in the
past, there have been security vulnerabilities discovered in TLS implementations
whereby maliciously-crafted client certificates could be used to, say, bring
services offline, read memory, or take control of remote hosts.

See [CVE-2022-0778](https://nvd.nist.gov/vuln/detail/CVE-2022-0778) for an
example of what could go wrong. Still, if extreme privacy and authentication are
needed, the benefits of this usually outweigh the risks.

:::

## Disabling Server Authentication

Yes, it is possible to disable server authentication. You can do this by setting
the environment variable
[`MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS`](./env.md#meerkat_tls_reject_unauthorized_servers)
to `0` (disabled). This will cause Meerkat DSA to ignore an invalid
certification path presented by a server to which it connects.

:::warning

If you disable server authentication, it mitigates the protection afforded by
TLS; anybody can impersonate the server. If you disable server authentication

:::

## The Web Admin Console

Enabling TLS is also critical for securing your web admin console (if enabled).
See more information [here](./webadmin.md#tls).

## Setting the Local Qualifier

The meaning of the `localQualifier` component of the `AuthenticationLevel` as
described in [ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
Section 18.4.2.3, is left to DSA implementations. In Meerkat DSA the
`localQualifier` is given a value depending on the level of transport security
that is used to protect a connection with a client.

See [here](./authorization.md#setting-the-local-qualifier-of-a-client) for
documentation on how to configure how your DSA sets the `localQualifier` for a
given client.
