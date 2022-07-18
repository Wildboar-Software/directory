# The Web Admin Console

Meerkat DSA also provides a web-based administrative console, which does not use
JavaScript so as to be lightweight, maximally compatible, and secure. If you are
wondering why the web-based administrative portal is ugly, that's why. The lack
of Javascript means that you can access your Meerkat DSA web admin console over
[TOR](https://www.torproject.org/).

The web admin console is only necessary for accepting or rejecting requested
operational bindings and triggering [hibernation](./administration.md#hibernation); everything else can be done using the X.500 protocols. In
the future, we will find a way to make even this possible without the web
console.

:::caution

Note that exposing the web-based administrative console is a **security risk**
because, if a user can obtain illegitimate access to the web administration
console, all entries may be read, entries may be deleted, and many more hazards.
If you do not expect to need this, it is strongly recommended that you do not
enable it.

:::

## Authentication

Meerkat DSA only supports HTTP basic authentication for the web admin console.
This is a deliberate design feature. Meerkat DSA's web admin console is meant to
be lightweight, cross-platform, and low maintenance. Originally, there was no
security on the web administration console whatsoever, but this was added so
that DSA administrators could have a modicum of security with minimal setup.

:::caution

HTTP Basic Authentication will only be enabled if both the
[`MEERKAT_WEB_ADMIN_AUTH_USERNAME`](#meerkatwebadminauthusername) and
[`MEERKAT_WEB_ADMIN_AUTH_PASSWORD`](#meerkatwebadminauthpassword) environment
variables are set.

:::

:::caution

HTTP Basic Authentication transmits your username and password in the clear
(without encryption). This means that you should secure your communication with
the web admin console by ensuring that
[`MEERKAT_WEB_ADMIN_USE_TLS`](#meerkatwebadminusetls) is set to `1` and that
[TLS is configured](./tls.md) (otherwise, the former environment variable will
have no effect). Otherwise, intermediaries may be able to sniff your password.

Since this password is not well-protected, it is highly recommended that you
also ensure that this password is not used for any other services. This password
should be unique to Meerkat DSA's web admin console, and not used as the
password for any entry in your DSA.

:::

:::caution

Using passwords in general is vastly inferior to TLS client certificate
authentication. HTTP Basic Authentication was implemented in Meerkat DSA so that
admininstrators could have a modicum of security with little upfront setup, but
it is **highly recommended** that administrators configure a secure reverse
proxy, such as Nginx, Caddy, or Apache, to use TLS client certificate
authentication, rather than relying on the security of a password. Even better
yet, the web admin console should only be accessible behind a VPN, or have some
kind of network access controls to prevent users from accessing it entirely.

:::

:::tip

Don't rely on your own ability to generate a secure password. Generate a secure
password using an offline tool such as the OpenSSL command line. You can run
this command on Unix-like systems (Linux, BSDs, MacOS, etc.) to generate a
secure password: `openssl rand 32 | base64`.

:::

## TLS

Even if [HTTP Basic Authentication](#authentication) is used, TLS should still
be enabled to encrypt your traffic to and from the web admin console. To
configure TLS for the web admin console, you simply configure TLS for your
entire DSA, using the environment variables starting with `MEERKAT_TLS_`.

The only case in which you should _not_ enable TLS for the web admin console is
if you are using an HTTPS-enabled reverse proxy, such as Nginx, Caddy, or
Apache Web Server.
