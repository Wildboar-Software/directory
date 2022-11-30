# Meerkat DSA

Meerkat DSA is an X.500 DSA created by
[Wildboar Software](https://wildboarsoftware.com/en). This version is free and
open source, but there is a proprietary version that adds enterprise features.
Meerkat DSA is written in TypeScript, runs on NodeJS, and currently uses MySQL
as a data store, but support for other common DBMSs is intended for future
releases.

The goals of Meerkat DSA are:

- To provide a feature-complete X.500 directory service.
- To be secure enough for enterprise usage.
- To be scalable enough for enterprise usage.
- To be performant enough for non-analytical uses.
- To store X.500 data in a format that can be used independently of Meerkat DSA.
  This means that data shall be stored in a widely-used DBMS, such as MySQL,
  rather than in some format that is only defined for use by Meerkat DSA.
- To be extensible such that it can be configured for storing nearly any kind of
  information.

The non-goals of Meerkat DSA are:

- To be the fastest / most efficient way to search for information.
- To handle rapidly-changing data and/or real-time data.
- To be a compact / storage-efficient data store. (Storage is cheap.)

See [the documentation](https://wildboar-software.github.io/directory/).