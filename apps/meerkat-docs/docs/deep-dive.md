# Deep Dive

## Executive Summary

The X.500 directory is a technology for producing a global, distributed database
(although it can be used exclusively privately as well). It is "distributed" in
the sense that the data can be split across a nearly infinite number of
independent servers.

The way that data is represented in an X.500 directory lends itself to great
flexibility. An X.500 directory has features that make it like a time-series
database, a graph database, a document-oriented database, and a relational
database, all in one. It is designed primarily to store information about
people and organizations, but it can store any kind of data.

### The Problem It Solves

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

There are a few other benefits that are simply too technical for an executive
summary, but the above should be sufficient.

### The Future

The X.500 specifications were conceived in the late 1980s by the
International Telecommunications Union with the intent of creating a sort of
"distributed, global phonebook," and, admittedly, they had much more traction
back then. However, if you research why the enthusiasm waned, you'll find that
much of it is for reasons that are no longer applicable. X.500 directories are
thought of as "legacy" mistakenly: I believe they are the _future_. There are
technologies that died off because they are objectively inferior, such as
floppy disks, and there are those that were dormat for a long time simply
because they were invented before their time.

### Other Executive Summaries

In addition to the above summary, other executive summaries of X.500 directory
services can be found in:

- [ITU Recommendation X.500 (2019)](https://www.itu.int/rec/T-REC-X.500/en)
- [IETF RFC 1308](https://www.rfc-editor.org/rfc/rfc1308.html)

## User's Deep Dive

The X.500 specifications are so rich in features that it can seem difficult to
break into it. This is a brief explanation of X.500 concepts for a user to
meaningfully use an X.500 directory.

### Object Identifiers

X.500 directories use object identifiers to identify almost everything, so
understanding what they are is important. If you finish reading this section
understanding nothing else, understand that _object identifiers are
globally-unique, numeric identifiers._

Object identifiers are composed of an ordered sequence of non-negative integers,
such as `2.5.4.3`. Each number in this list, called an _arc_, identifies
_something_. Arcs can be associated with a textual identifier, called a
_descriptor_, but these are optional and only serve to enhance readability.

The first number is the root arc, which can have the values `0`,
`1`, or `2`, exclusively. Each root arc is associated with and self-assigned to
one of three international standards organizations. These organizations define
object identifier arcs beneath the roots, which may be granted / delegated to
other organizations; these secondhand organizations may then grant arcs beneath
theirs to other organizations, recursively.

There is no universal process for "registering" an object identifier. If you or
your organization define an object identifier, you just simply _publish
what it means somewhere_. You can obtain an object identifier arc of your own
by registering with certain organizations. The Internet Assigned Numbers
Authority (IANA), gives away free object identifier arcs under `1.3.6.1.4.1`,
which it calls "Private Enterprise Numbers." The Private Enterprise Number for
Wildboar Software is `56490`, meaning that the object identifier is
`1.3.6.1.4.1.56490`. This means that Wildboar Software is free to define all
object identifiers that start with `1.3.6.1.4.1.56490`.

With this out of the way, we can go over how an X.500 directory presents its
information.

### Information Model

#### Entries and Attributes

Directories represent information as _entries_. Entries represent real-world
objects, such as a person, organization, device, etc. Entries are represented
like documents in a document-oriented database, or a row in a relational
database or spreadsheet.

Entries are composed of _attributes_, which represent aspects of the real-world
object. If the entry represents a person, it might have a "first name"
attribute; if the entry represents a device, it might have a "serial number"
attribute; if the entry represents an organization, it might have a
"phone number" attribute. Attributes are like the columns in a relational
database or spreadsheet, or like the fields of a document in a document-oriented
database. Attributes are identified by an _attribute type_, which is a
globally-unique, numeric identifier. As a user of the X.500 directory, you do
not need to know or memorize these identifiers: it is expected that whatever
tool you use to browse the X.500 directory will translate these object
identifiers into human-friendly names, such as "First Name" or "Serial Number."
Object identifiers that are unrecognized by your tooling can be searched for on
websites like [this](http://www.oid-info.com/) if your tooling does not already
do this for you.

Attributes contain one or more _values_, reflecting that some attributes of
real world attributes may have multiple values. A person may have multiple email
addresses, or an organization might have multiple mailing addresses, for
instance. Some attributes may be defined in such a way as to only permit a
single value, however; this is generally only used when it is known with
certainty that only a single value could ever apply, such as in the
`createTimestamp` attribute, which indicates the time at which a directory
entry was created.

As part of an attribute's definition, an attribute may be defined to have a
specific syntax; for instance, the `telephoneNumber` attribute type is defined
to have a telephone number as its syntax. A user cannot insert a value of the
`telephoneNumber` attribute into a well-behaved directory server that is not a
valid telephone number. In addition, there may be rules specified for how values
of such an attribute type are to be compared, sorted, or searched (called
"matching rules"), as well as whether users are able to modify values of a given
attribute type or whether they should be managed by the directory server itself.

The attribute type definition can also indicate whether the attribute's purpose
is to be used by the end user of the directory, making it a _user attribute_, or
whether the attribute is for the directory's internal operation, which is called
an _operational attribute_. Yes, X.500 directories use entries and attributes to
manage their own configuration!

Attribute types may be defined to be _dummy_ attributes, which are kind of like
"aliases" to one or more other attributes, or labeled as "obsolete," preventing
them from being added to the directory any further.

An attribute type may be defined as a _subtype_ of another. For instance, the
`mobileTelephoneNumber` attribute type is defined as a subtype of
`telephoneNumber`. This means that, if you query the X.500 directory for the
`telephoneNumber` of a person, the directory will return values of the
`telephoneNumber` attribute as well as the `mobileTelephoneNumber` attribute,
and any other subtypes of `telephoneNumber`, such as `workTelephoneNumber`,
unless you explicitly request for the directory to not do this. This also
applies to matching: searches in the directory for a entries with a given
`telephoneNumber` value will also return results for entries with a matching
`mobileTelephoneNumber` value, but not the reverse.

The attributes used to compose an entry are governed by the entry's _object
classes_. Object classes specify what attributes an entry _must_ have or _may_
have or both. Object classes are identified by an object identifier.

There are _structural object classes_, which immutably define what an
entry represents, such as a `person`, `organization`, or `device`. There are
also auxiliary object classes, such as `married`, which can be used to permit
further attributes in an entry, above and beyond the structural object classes,
such as `spouseName`, and which usually indicate some circumstantial data about
an entry, rather than something inherent to its definition; a `person` is always
a `person`, and can never become a `device`, but a person can become `married`
(and divorced, too!).

Like attribute types, object classes can be defined as subclasses of each other.
An `organizationalPerson` is defined as a subclass of `person`. The `person`
object class requires a `surname` attribute, but permits a `commonName`
attribute. As such, the `organizationalPerson` subclass does the same, but also
permits more attribute types, such as `telephoneNumber`.

There is a third type of object class, which is an _abstract object class_.
Abstract object classes cannot be used to govern entries exclusively: they may
only be used to define further subclasses, which may then be used. These are
rare, but you should know about them at least.

The most specific structural object class that defines an entry is refered to as
the entry's _structural object class_. For instance, if an entry has the object
class `organizationalPerson`, it necessarily also has the object class `person`,
but its _structural object class_ would be `organizationalPerson`, because
`organizationalPerson` is the most specific object class.

The object classes of an entry are stored in the `objectClass` attribute, which
has an object identifier of `2.5.4.0`. This is technically defined as a user
attribute for historical reasons, but it still functions like an operational
attribute.

#### Context Types

Attribute values can be tagged with a sort of "metadata" called _contexts_.
Contexts are more general-purpose annotations for attribute values that are used
like so:

- To annotate strings with the language. For instance, if an organization has a
  `description` attribute value in English and another value in German, the
  English value can be tagged with a `languageContext` with a value that
  identifies it as English, and likewise for the German description.
- To indicate the time in which a value was/is true: by using a
  `temporalContext`, a directory entry can indicate that Mrs. Jane Smith's last
  name was Doe up until July 25th, 2023, when she got married. This would be
  done by having a `surname` attribute value of `Doe` using a `temporalContext`
  indicating that this value is not applicable after July 25th, 2023, and
  another value of `Smith` with no contexts. Instead of deleting old information
  in the directory, it can be annotated with the "validity time" so that the
  directory can be queried across time. This means that a directory can
  function like a time-series database.
- To indicate the applicable locale of a numeric unit, such as a currency.
- To indicate a level of certainty associated with a value whose validity is
  uncertain.
- To annotate a value with a source of its information. For instance, if an
  attribute value was sourced from a person's birth certificate, this could be
  indicated.
- To annotate a value with a digital signature, providing data integrity at
  rest.

The type of context is identified by an object identifier. An attribute value
may have zero, one, or more contexts of a given type, and may have multiple
context types as well.

#### The Directory Information Tree

The entries in a directory are arranged in a hierarchical structure, referred to
as the Directory Information Tree (DIT). In computer science, a "tree" is
conventionally thought of and spoken of as being upside-down. The "root" of the
tree is at the "top," and there are branches beneath the root, leading down to
"leaves" that terminate branches of the tree. Leaves are at the "bottom" of the
tree, when using this terminology.

The root of the tree is a magical entry called the "Root DSE," and it is not
technically an "entry," but rather a special entry that is unique for every
directory server, and used to provide information about the directory server.

The entries immediately beneath the Root DSE are referred to as the "top level"
or "first level." The first level contains real entries, which usually represent
countries, international organizations, or top-level domains. These have entries
beneath them, and those entries may have entries beneath them, recursively.

#### Names

Directory entries are named using a selection of attribute values that are
called "distinguished values," each of which are presented as an attribute type
object identifier and a value. This group of one or more distinguished values is
known as the Relative Distinguished Name (RDN) of the entry.

There may only be, at most, one value from each attribute type within a relative
distinguished name. Only certain attribute types may be used in naming. As
implied, the relative distinguished name must come from attribute values that
are actually present in the entry: entries cannot "distinguish" values that they
do not have.

The following attribute types are commonly used for naming:

- `countryName`, often abbreviated as `c`
- `stateOrProvinceName`, often abbreviated as `st`
- `localityName`, often abbreviated as `l`
- `organizationName`, often abbreviated as `o`
- `organizationalUnitName`, often abbreviated as `ou`
- `commonName`, often abbreviated as `cn`
- `givenName`, often abbreviated as `gn`
- `surname`, often abbreviated as `sn`
- `domainComponent`, often abbreviated as `dc`
- `uid`
- `title`
- `dnQualifier`

For the purposes of displaying to humans, attribute types and values are often
represented as type-equals-value pairs (e.g. `cn=Jonathan Wilbur`). When
displaying whole relative distinguished names, the distinguished values are
joined with plus signs (`+`), after escaping any plus signs and backslashes
within the attribute values with backslashes (e.g. `gn=Jonathan+sn=Wilbur`).

Relative distinguished names are only expected to be unique among all entries
immediately subordinate to a given other entry.

The ordered sequence of relative distinguished names going from the top level
entry to the identified entry is refered to as the "distinguished name." This
name uniquely and globally identifies an entry. When displayed textually, it
is the string-form relative distinguished names, joined by commas, semi-colons,
or forward slashes (e.g. `c=US,st=FL,l=Tampa,gn=Jonathan+sn=Wilbur`).

The Root DSE is an exception to the rules above. The Root DSE has a zero-length
distinguished name, and if needed, its relative distinguished name can be
represented as a zero-length relative distinguished name.

The attribute types that must be present or may be present in an entry's
relative distinguished name is governed by a _name form_. A name form is a
schema construct that is enforced by the X.500 directory and uniquely identified
by an object identifier. Name forms target entries by their structural object
class, and there can be multiple name forms defined for a given structural
object class. Name forms are not expected to apply uniformly throughout the
Directory Information Tree; some regions of the tree can enforce different
naming conventions from others.

#### Schema

In addition to the X.500 schema constructs mentioned above, further constructs
can constrain where entries can appear and what object classes, attributes, and
contexts they can have.

DIT Structure Rules are used to constrain what name forms (and hence, which
entries) may be present in a given location in the Directory Information Tree.
DIT Structure Rules are identified by a numeric identifier that is only unique
within a region of the DIT. DIT Structure Rules are recursively defined as
subordinates of other DIT Structure Rules. An example DIT Structure Rule might
constrain entries of structural object class `locality` to appear beneath
entries of structural object class `country`, since the reverse does not make
sense. The DIT Structure Rule that permitted an entry to be inserted where it
resides in the DIT is known as that entry's _governing structure rule_.

DIT Content Rules circumscribe which auxiliary object classes, entries within
a region of the DIT may have, as well as what attribute types MUST, MAY, and
MUST NOT be present within entries that fall within the purview of the DIT
Content Rule.

Context Use Rules govern which contexts may be present in which attribute
values within a region of the DIT. Matching use rules are used to control which
matching combinations are defined for usage.

#### Matching Rules

X.500 directories use "matching rules" to define the logic of how two values are
to be compared, sorted, and searched, which are called equality matching rules,
ordering matching rules, and substring matching rules, respectively.

#### Compound Entries

X.500 directory entries

#### Hierarchical Groups


#### Collective Attributes

- These are often subtypes of non-collective attributes, so that they match.

### Usage

#### ROSE Protocols and Transport

#### Binding

#### The DAP Operations

#### Chaining

#### Shadowing

#### Relaxation

#### Signing

####


## Administrator's Deep Dive

### Administrative Areas

### Access Control

### Context Assertion Defaults