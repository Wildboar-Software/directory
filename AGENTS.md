# X.500 Directory Monorepo

## Overview

This repository contains X.500 directory packages and applications, which are
currently all written in TypeScript. This not primarily Lightweight Directory
Access Protocol (LDAP) code: the repo implements the full X.500 standards as
defined by the International Telecommunications Union's X.500 series of
specifications.

This repository is an Nx monorepo. All Typescript subprojects are expected to
compile to ESM only with fairly strict Typescript configuration. Vitest is used
for testing.

## Meerkat DSA

The flagship project in this repository is Meerkat DSA, which is an X.500
directory server or "Directory System Agent" (DSA). It provides the X.500
directory service

The X.500 directory service is essentially a distributed database that stores
"entries" composed of "attributes" kind of like a document-oriented database.
These entries live in a hierarchical namespace called the Directory Information
Tree (DIT). Each node in the tree is identified by a Relative Distinguished
Name (RDN), which is a selection of one or more attribute values from the entry.
Each entry is uniquely identied by the sequence of RDNs traversed starting from
the root of the DIT to reach that entry (including the entry's own RDN). The
root itself has no RDN. This fully-qualified name is called the "distinguished
name" (DN) of the entry.

Meerkat DSA's code is located in `apps/meerkat`. Meerkat DSA is configured via
environment variables. The `.env` file contains some of these settings for
local testing. Meerkat DSA stores its data in a SQLite database, which it
accesses via the Prisma ORM.

Nearly every function in Meerkat DSA takes a "context object," which is a huge
object that contains the logger, the database, the configuration values, a
reference to the root of the DIT in memory, some timers, knowledge of attribute
types, object classes, and other schema constructs, and many more things.
Conceptually, it is intended to be like OpenSSL's `ctx` context that many
verification-related functions use. It's intended purpose is to avoid the use
of static variables or side-effects: the functions of Meerkat DSA should be as
pure as possible, except for database writes and logging.

Meerkat DSA strives to be fully internationalized: almost every string
displayed to end users and in logs should use internationalization. The English
strings can be found in `apps/meerkat/src/assets/locales/en/language/*.json`
and these are used by `i18next`.

Meerkat DSA exposes a web administration console, which uses no Javascript:
just static HTML, CSS, and forms. Unlike everything else, it is not
internationalized.

Meerkat DSA implements every X.500 feature, including zonal matching, contexts,
relaxation, service administration, password administration, shadowing,
all standard access control schemes, LDAP service, ISO transport over TCP
(ITOT), PKI and PMI verification and authorization, compound entries, signing
of requests and results and errors (as well as verification of them), all
service controls, pagination, chaining, simple and strong authentication,
hierarchy selection, the Directory Operational Binding Protocol (DOP) and many
more features.

Meerkat DSA is packaged as a Debian package, a Snapcraft Snap, an Alpine
package, an Arch package, a Brew formula, an NPM package, a Docker image, and
a Helm chart. Most of these packaging files are located in `pkg/`.

## Reference

You can find the ASN.1 modules for the X.500 protocols, schema, and other X.500
constructs in `doc/modules`.

