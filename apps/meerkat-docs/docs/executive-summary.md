# Executive Summary

:::note

(This is the page you show to your management to get the on board with using
an X.500 directory. It intentionally abstains from the more technical details
of X.500 directories.) For an overview for a more general audience, see the
[Intro](./intro.md).

:::

The X.500 directory is a technology for producing a global, distributed database
(although it can be used exclusively privately as well). It is "distributed" in
the sense that the data can be split across a nearly infinite number of
independent servers.

The way that data is represented in an X.500 directory lends itself to great
flexibility. An X.500 directory has features that make it like a time-series
database, a graph database, a document-oriented database, and a relational
database, all in one. It is designed primarily to store information about
people and organizations, but it can store any kind of data.

## The Problem It Solves

Databases already exist, and they already have access controls, sharding,
authentication, integrity at rest, and so on. However, many organizations still
feel the need to put a REST API between end users and the database, which
demonstrates some fundamental shortcoming of existing solutions. Existing
solutions fall short in these respects, in which X.500 directories excel:

1. **Standardized implementations with expectations of interoperability.** X.500
   is a series of standards. Implementations of X.500 directories are generally
   interoperable, if well-constructed. There is no "MySQL standard" or "Postgres
   standard" where you could implement your own alternative and expect future
   compatibility with all other implementations. Abundance of implementations
   means more options, better security, and a better ecosystem.
2. **Advanced access controls.** In many databases, access controls can
   constrain who has access to particular collections, documents, columns,
   tables, and so on, but X.500 directories can regulate specific values, use
   groups as layer of indirection, and regulate complex selections of the data.
3. **Designed to be split across domains of trust.** Unlike database sharding,
   X.500 directories are designed to confederate data across the
   organizational boundary. Organizations can share their data, and even let
   others modify it, but control who, how, when, and so on.
4. **Directly usable by end users.** Traditional databases often store or
   present data in a format that is not directly usable by end users. For this
   reason, custom REST APIs and web apps are created to convert a
   mess of relational tables into composed, meaningful "objects" representing
   real world things. In X.500 directories, the data is already stored in this
   manner: X.500 directories model data as real world things, and they are
   browseable by human-friendly names like `CN=Jonathan M. Wilbur` rather than
   UUIDs or serial numbers. You do not need to re-invent the wheel when you
   already have a Porsche waiting for you.
5. **Standardized schema.** How one organization represents a "person" in a
   database may differ from how another organization would, but X.500 schema
   uses an inheritance model, whereby data can adhere to certain standardized
   characteristics while still being extensible and widely recognizable. If two
   companies that wish to merge use X.500 directories, and they have customized
   the schema for representing a "person," their directory implementations and
   directory-enabled applications can still seemlessly utilize the commonalities
   that are standardized for a "person entry" across substituent organizations
   for instance.

There are a few other benefits that are simply too technical for an executive
summary, but the above should be sufficient.

## The Future

The X.500 specifications were conceived in the late 1980s by the
International Telecommunications Union with the intent of creating a sort of
"distributed, global phonebook," and, admittedly, they had much more traction
back then. However, if you research why the enthusiasm waned, you'll find that
much of it is for reasons that are no longer applicable. X.500 directories are
thought of as "legacy" mistakenly: I believe they are the _future_. There are
technologies that died off because they are objectively inferior, such as
floppy disks, and there are those that were dormant for a long time simply
because they were invented before their time.

## Other Executive Summaries

In addition to the above summary, other executive summaries of X.500 directory
services can be found in:

- [ITU Recommendation X.500 (2019)](https://www.itu.int/rec/T-REC-X.500/en)
- [IETF RFC 1308](https://www.rfc-editor.org/rfc/rfc1308.html)
