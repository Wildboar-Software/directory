# Introduction to X.500 Directory Systems

## What is an X.500 Directory?

An X.500 directory is a distributed, hierarchical database whose characteristics
are defined in the International Telecommunications Union's X.500 series of
specifications (hence the name). ITU Recommendation X.500 is the introduction
to X.500 directory services, as well as an index to the other X.500-series
specifications; all versions can be read for free
[here](https://www.itu.int/rec/T-REC-X.500/en).

The distributed database is called the "Directory Information Base" (DIB), and
is composed of one or more hierarchical "trees" of information, called
Directory Information Trees (DITs). Data is typically not shared between DITs:
each DIT is more-or-less isolated from each other DIT. Each DIT contains
"entries" which are named groups of attributes that describe a real-world object
such as a person, a car, a city, etc. These attributes can be things like
"first name," "manufacturer," "phone number," and so on.

Any data can be stored in an X.500 directory, but its original purpose was to
store information about people--particularly information pertaining to
telecommunications, such as phone numbers and fax numbers--so that there could
be a global, distributed white pages and yellow pages. Schema and access
controls can be used to limit who can do what, when, where, and how in the
directory. X.500 directories may support replication and caching of read-only;
this feature is called "shadowing."

The X.500 directory service is provided by one or more Directory System Agents
(DSAs) that cooperate to serve the distributed database. "DSA" is basically the
X.500 term for a directory server. Each DSA may hold an entire directory
information tree, or just a subset of it. Requests made to a DSA may be routed
to other cooperating DSAs to provide the totality of the directory service.

A Directory User Agent (DUA) is a client application that interacts directly
with a DSA to provide a user with the services of the directory. A DUA is to the
directory what email clients like Thunderbird, iMail, or Microsoft Outlook are
to email.

## How is an X.500 directory used?

X.500 directories expose functionality that you would expect from a database:
the ability read entries, write entries, search for entries, list entries,
modify entries, rename entries, and delete entries.

An X.500 directory is accessed through the Directory Access Protocol (DAP) or
through the Lightweight Directory Access Protocol (LDAP). Behind the scenes,
DSAs cooperate with each other to provide directory services to users through
the Directory System Protocol (DSP). The Directory Operational Binding
Management Protocol (DOP) may be used to manage agreements between DSAs, which
pertains to things like replication and the assumption of responsibility for
subsets of the directory information tree that the DSAs cooperate to provide.
The Directory Information Shadowing Protocol (DISP) may be used to replicate
entries from "master" DSAs into read-only copies in "shadow" DSAs, which may or
may not be out of date.

X.500 directory usage is highly configurable. Users of an X.500 directory can:

- Use advanced filters to search for data.
- Specify time limits, size limits, and other limits on the results returned.
- Demand a given quality of service, such as the priority of a particular
  request, or indicate whether potentially out-of-date shadow copies will
  suffice.
- Display certain information depending on context, such as
  displaying the French name of an entry for French users and the English name
  for English users.

The Lightweight Directory Access Protocol (LDAP) is a simpler alternative to the
Directory Access Protocol (DAP). It was implemented because the Directory Access
Protocol was deemed as too complicated by some. Notably, much of the data that
the DAP represents as binary data is represented as UTF-8 strings in LDAP.

Almost no implementations of a user-friendly DUA exist, but many LDAP clients
exist. [Apache Directory Studio](https://directory.apache.org/studio/) is a good
one.

## What is Meerkat DSA?

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

## Why Should I use an X.500 Directory?

There is no one-size-fits-all best data store for all data. Some data should be
stored in a relational database, some data should be stored in a document
oriented database, and some data should not be stored at all! If what you are
trying to store fits a few of these descriptions, it might be a good candidate
for storage in an X.500 directory:

- The data is innately hierarchical.
- The data is read from more often than it is written to.
- The data needs to be browseable by name.
- The data needs to be annotated with contextual information, such as
  language, time, certainty, etc.
- The data needs to be protected with fine-grained access control.
- The data needs to be distributed across multiple organizations that cannot
  or should not trust each other entirely.
- The data pertains to people and/or contact information.
- The data contains authentication information that will integrate with
  digital services, such as websites and enterprise applications, to provide
  single sign-on (SSO) or reduced sign-on (RSO).

Data that fits these descriptions would **not** be good candidates for storage
in an X.500 directory:

- The data rapidly changes.
- Transactions are need to ensure that multiple things either happen or do not
  happen as a unit.
- The primary use case for the data is for it to be analyzed and/or summarized.
- Giant binary objects.

Here are examples of data that are good candidates for storage in an X.500
directory:

- A database of all employees in your company.
- Electronic health records.
- A list of your customers.
- DNS records.
- Makes and models of automobiles.
- Countries, states, counties, cities, neighborhoods, buildings.
- Universities, schools, hospitals, governments, law enforcement
  offices, parks.
- A taxonomical or cladistic hierarchy of organisms.
- Data about songs, movies, books, and other media.
  - But _not_ the songs, movies, and books themselves!

Here are examples of data that are _not_ good candidates for storage in an X.500
directory:

- Financial transactions.
- Real-time GPS tracking data.
- Time-series data, such as system logs.
- Images, movies, audio.
  - X.500 directories are innately not well-suited for storing large files.
