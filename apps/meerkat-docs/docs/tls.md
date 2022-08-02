# Transport Layer Security (TLS)

TLS is an essential part of directory security. It gives your directory
point-to-point confidentiality and integrity.

However, it _does not_ give your directory operations end-to-end integrity;
intermediary DSAs may spoof arguments, results, and errors, except when signing
is used. See [here](./signing.md) for information on configuring signing.

## TLS Configuration

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

Almost all TLS-related environment variables start with `MEERKAT_TLS_`.

You can configure your trust anchors (root certificate authorities) through the
use of the [`MEERKAT_TLS_CA_FILE`](./env#meerkattlscafile) environment variable.
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
[`MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS`](./env.md#meerkattlsrejectunauthorizedclients)
to `1` (enabled).

## Disabling Server Authentication

Yes, it is possible to disable server authentication. You can do this by setting
the environment variable
[`MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS`](./env.md#meerkattlsrejectunauthorizedclients)
to `0` (disabled). This will cause Meerkat DSA to ignore an invalid
certification path presented by a server to which it connects.

:::caution

If you disable server authentication, it mitigates the protection afforded by
TLS; anybody can impersonate the server. If you disable server authentication

:::

## The Web Admin Console

Enabling TLS is also critical for securing your web admin console (if enabled).
See more information [here](./webadmin.md#tls).
