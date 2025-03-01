# User's Deep Dive

The X.500 specifications are so rich in features that it can seem difficult to
break into it. This is a brief explanation of X.500 concepts for a user to
meaningfully use an X.500 directory.

## Object Identifiers

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

## Information Model

### Entries and Attributes

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

### Matching Rules

X.500 directories use "matching rules" to define the logic of how two values are
to be compared, sorted, and searched, which are called equality matching rules,
ordering matching rules, and substring matching rules, respectively. The
simplest example of a matching rule might be the `caseIgnoreMatch`, which
compares two attributes that have a string syntax case-insensitively.

If you have ever used a database, you might know how data types have an
algorithm for comparing two values built-in and assumed for that data type.
For example, when you query a SQL database with a clause like
`lastName == 'Wilbur'` that database might perform a case-sensitive comparison
unless you specify otherwise. This is not so with directories: the rules for
comparing, ordering, and searching for substrings within values are explicitly
associated as a part of each value's attribute type. Even though, for instance,
a URL and a last name might be stored as strings, URL attribute values may be
evaluated using case-sensitive matching, whereas last name attribute values may
be evaluated using case-insensitive matching. Explicitly defining how values
are expected to be compared can help DSAs index values appropriately.

Attribute types may have _no_ matching rules associated. This does not mean that
they cannot be compared; it just means that the matching rule to be used will
have to be explicitly specified in search filters. However, attribute types for
which no default equality matching rule is defined cannot have their values
individually added, removed, or modified: the entire attribute must be replaced
all at once with the new desired values, and no checks take place for
duplicates.

In general, attribute types that are expected to contain longer strings, such
as descriptions, do not define equality matching rules or ordering rules--only
substring matching rules. It can get computationally expensive to perform many
string comparisons over large strings like that to check for duplicates. This
also prevents huge strings, like those that might appear in the `description`
attribute, from being used for naming entries.

Ordering rules are often _not_ defined when there is an ambiguous way for values
to be sorted: for instance, should you sort telephone numbers by ASCII character
code points, alphabetically, or remove all the non-numeric characters and sort
them like integers? There is no obvious, universally-assumed way of sorting
them.

Substring matching rules are usually undefined for an attribute type when the
values are expected to be small enough that there is little value in substring
searches or when a substring of the value would not have any meaning, such as
a substring of an identifier generated from randomness.

A matching rule may have "parent matching rules," whose meaning is left up to
interpretation. A matching rule may also have an assertion syntax that differs
from the syntax of the value being evaluated: for example, a "letter count"
matching rule might take an integer as an assertion value, but evaluate against
a string type by counting the number of letters in the string. A matching rule
may define procedures for converting a value of a different syntax into the
assertion syntax. If no assertion syntax is defined for a matching rule, the
assertion syntax is the same as the syntax of the attribute on which the
matching rule is used.

### Context Types

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

### The Directory Information Tree

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

### Names

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

### Aliases

Sometimes the names of directory entries need to be changed. For instance, when
people get married, it is common for the wife to change her last name to the
husband's last name. Hence, an entry representing a person may need to be
renamed from time to time. In other cases, there are acronyms or pseudonyms by
which people refer to something other than its proper name. To make it easy for
directory users to find what they are looking for, directories support
"aliases." Aliases are special entries that are simply named pointers to other
entries.

For example, let's say a woman with a directory name `cn=Peggy Sue` gets married
and changes her last name to "Smith." The directory entry can be renamed to
`cn=Peggy Smith` and a new alias entry named `cn=Peggy Sue` can be created,
which contains a pointer to the `cn=Peggy Smith` entry. The directory can
seemlessly translate requests to, for example, read the birth date of
`cn=Peggy Sue` to a request to read the birth date of `cn=Peggy Smith`. The
reverse is true as well: `cn=Peggy Smith` could be the alias and point to
`cn=Peggy Sue` instead.

For another use case, people may customarily refer to a company such as
"Pricewaterhouse Coopers International Limited" simply as "PwC" and hence, a
directory name `o=PwC` could be used as an alias for
`o=Pricewaterhouse Coopers International Limited`.

Aliases can be dereferenced in the course of locating an entry, even if they are
not the entry sought by a user. For instance, if a directory user tries to read
an entry `c=US,st=Florida,cn=Jonathan Wilbur`, the directory can resolve the
alias `st=Florida` to `st=FL` to obtain `c=US,st=FL,cn=Jonathan Wilbur`.

### Schema

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

Friend attributes are "friends" of an "anchor attribute." If the anchor
attribute is used in a search filter, its friends will be evaluated for matches.
If the anchor attribute is to be returned in response from the directory, the
friend attributes will be returned automatically as well. Both of these cases
can be disabled via service controls.

### Compound Entries

In many document-oriented databases, such as MongoDB, ElasticSearch, or CouchDB,
documents themselves can contain "nested documents," and the directory is no
different in this regard: except these are called "child entries" and the
overall entry within which they are a substituent is called a "compound entry."

Child entries are (almost) no different than any other entry in the directory:
they are just normal entries, except they have the `child` auxiliary object
class (`2.5.6.29`). An entry having this object class means "I am really a part
of my immediate superior as a compound entry, rather than being a separate
entry."

Compound entries are useful for providing relational features to the directory.
For example, you can have a compound entries that represent people, and child
entries that represents computing devices they own. If you want to find
a person that resides in Florida **and** has a certain model of device, you
can use the "family grouping" feature of a search to obtain only these results,
rather than performing two separate searches for people and devices and
performing an inner join on the client-side.

### Hierarchical Groups

Entries in the directory are arranged into a hierarchy, as established already.
However, sometimes there is a need for some other hierarchy that is independent
of the underlying directory structure. X.500 directories allow this via
"hierarchical groups," which function like a "virtual hierarchy" on top of the
directory.

Hierarchical groups work very simply: each member in the virtual hierarchy has
an attribute `hierarchicalParent` that points to its superior in this virtual
hierarchy. There are other attributes that are supposed to be managed by the
directory automatically:

- `hierarchyBelow` is a `BOOLEAN` that indicates whether a hierarchical group
  member has subordinates in the virtual hierarchy.
- `hierarchyTop` points to the most superior entry in the virtual hierarchy.
- `hierarchyLevel` indicates how deep within the virtual hierarchy an entry
  resides.

These are only used in searches to provide relational capabilities across this
virtual hierarchy. For example, if the virtual hierarchy reflects the managerial
structure of an organization, you can query the directory for all managers of
employees that have poor performance reviews.

### Collective Attributes

As the directory grows, there might be a need to place the same attribute values
within entries over and over again, thereby wasting data storage space. For
example, in a small city that falls entirely within a single postal code, every
resident might have the exact same postal code (e.g. a "ZIP code" in the United
States). Instead of creating 100,000 copies of this value for 100,000 denizens,
the directory can store a collective variant of postal code that applies to
all denizens automatically.

Collective attributes are typically subtypes of some other non-collective
attribute type, so that assertions that match against the collective variant
match against the non-collective, and vice versa. As with other features we've
mentioned so far, this provides relational searches. Recycling the previous
example, you could search for all people with a certain name residing within a
certain postal code.

This may seem precarious in that a single exception to a collective attribute
assignment may necessitate abandoning the collective assignment of this
attribute, and individually assigning the attribute, making us no better off
than before, but the X.500 specifications have this scenario covered by allowing
entries to be marked as one-off exceptions via the `collectiveExclusions`
attribute. If 99,999 of our denizens live in a postal code, but a single person
lives in a different one, we can mark them as excluded from the applicability of
this collective attribute.

## Operations

Interactions with the directory use a request-response model. The types of
requests and responses supported by the directory are defined as "operations."
As a simple example, "operations" for a padlock might be "lock" and "unlock."
"Operations" for a video player might include "play," "pause," "fast-forward,"
etc. In a database, "operations" might include "search," or "insert."

The definition of an operation includes the syntax of the parameters for it
(the "argument type"), the parameters expected in the response (the "result
type"), and what types of errors might be returned by an operation. The errors
themselves specify what parameters they might include.

For example, an operation to read an entry from a directory takes the
distinguished name of the entry to read in the argument. The result includes
the entry if it exists and if the user is authorized. If the entry does not
exist, the user is not authorized, or some other issue makes it impossible or
undesirable to fulfill the request, an error may be returned, indicating the
nature of the problem.

## ROSE Protocols and Transport

In the same way that a protocol stack such as TCP/IP encapsulates messages used
by the application layer and provides services such as in-order delivery, the
Remote Operation Service element (ROSE) is an abstract service that "frames"
messages to the directory to identify whether they are requests, results,
errors, rejections, etc., tags requests with a unique numeric identifier so
they can be cancelled or monitored, and tags requests with an identifier of the
operation type (such as a "read" or "search"). ROSE is, in other words, a
Remote Procedure Call (RPC) mechanism.

The abstract Remote Operation Service Element can be provided by the OSI
protocol stack via a protocol defined in the X.880-series of ITU-T
Recommendations, but it can also be provided over the "Internet Directly-Mapped"
(IDM) protocol defined in ITU-T Recommendation X.519 specifically for usage by
the directory, which runs over TCP/IP. There may be more implementations I do
not know about: it is defined as an abstract service so it can be provided in
many ways.

## Binding and Unbinding

Before a Remote Operation Service Element (ROSE) can provide the Remote
Operations Service (ROS), the "initiator" between two correspondent endpoints
must "bind." A bind is a special operation that performs any initial setup for
the ongoing ROS dialogue, which usually includes authentication, but could also
include version or feature negotiation. The bind operation has no invocation
identifier: there may only be one bind operation outstanding at a time.

When a ROS peer is done, they may (or must, depending on how you look at it),
unbind. Unbind basically just says "I'm done," but it could also include a
reason why "I'm done" such as "I'm done, because I am suffering from an
unrecoverable error."

Requests may not be sent after unbinding. After unbinding, the dialogue is
complete. However, the underlying transport may remain open, if desired; in
concrete terms, the TCP socket may still be kept alive and re-used for a
subsequent bind, perhaps to authenticate as a different user.

## Authentication

As we have established, authentication information is carried in the bind
operation.

There are five forms of authentication defined in the directory specifications:

- `simple`: Authentication via a distinguished name (username) and password
- `strong`: Authentication via a cryptographic signature proving you possess a key
- `externalProcedure`: An authentication procedure identified by an object identifier
- `spkm`: Simple Public-Key GSS-API Mechanism (SPKM) described in IETF RFC 2025
- `sasl`: Simple Authentication and Security Layer (SASL), which is itself a
          flexible encapsulation mechanism for many more authentication
          exchanges.

## The DAP Operations

The directory service is provided to users via the Directory Access Protocol
(DAP), which is a suite of 11 operations briefly described as such:

- `read`: Read a single entry
- `compare`: Evaluate an assertion against an entry, returning whether it matches
- `abandon`: Abandon an ongoing operation
- `list`: List the entries immediately subordinate to an entry in the DIT
- `search`: Search for entries using a filter
- `addEntry`: Create a new entry
- `removeEntry`: Delete an entry
- `modifyEntry`: Modify an entry, such as by adding attributes
- `modifyDN`: Rename an entry, or move it and its descendants entirely
- `administerPassword`: Reset a password of an entry
- `changePassword`: Change a password of an entry

Almost all of these operations share some parameters in their arguments (called
"the common arguments"), and likewise, their results also share some parameters,
called "the common results."

The common arguments include "service controls," which can be used to specify
among other things, how requests may be passed on to other directory servers,
the priority of the request, the time limit of the request, the limit on the
number of entries returned from searches or listings, whether (possibly
out-of-date) replicated data is sufficient, whether aliases should be
dereferenced automatically, and how large of an attribute is "too large." Other
common arguments can be supplied to specify what contexts should be used for
assertions, or how compound entries are to be evaluated for matches in searches.

The common results may include the name of the server that fulfilled the
request, a flag indicating whether an alias was dereferenced, or attributes used
to provide notifications, warnings, or other information to the directory user.

## Chaining

The entire directory service can be (and is likely to be) split up among a
multitude of servers cooperating with each other. The individual servers
providing the directory service are called Directory System Agents (DSAs), and
the clients that interact with them are called Directory User Agents (DUAs).
Sometimes, the right place for a request to be fulfilled is not the DSA that
originally received the request from the DUA. In other cases, the original
recipient of the request may only be able to partially satisfy the request, and
may require more information from other directory servers. To fulfill such
requests, directory servers do what is called "chaining," which is where they
wrap the request in an envelope of sorts, send this request to other servers
saying "this is the original request, and this is what specifically I need from
you to fulfill it." These secondary recipients may, in turn, chain the request,
recursively, meaning that a single request could potentially propagate into a
large number of chained messages to many DSAs.

The protocol that DSAs speak with each other to provide chaining, and
therefore the total satisfaction of requests, is called the Directory System
Protocol (DSP). The syntax for almost all of its operations are identical to
those of the Directory Access Protocol (DAP), except with a "chaining arguments"
envelope that encloses the analogous DAP request, result, or error.

In lieu of chaining, directory servers may simply return a referral, which
basically says "here is the server to which you need to send your request."

Directory users may indicate that they prefer chaining or that they forbid
chaining entirely. They can also indicate that replicas of entries are
satisfactory--that master copies are not needed--and hence, the directory
should not chain requests to servers hosting the master copy if they themselves
have a non-master copy. (What an excellent segue to our next topic!)

## Shadowing

The directory supports the replication of entries as read-only copies into
other directories for performance purposes (arguably security as well). This
replication is called "shadowing." Directory servers that store read-only copies
or the "master" directory entries are said to "shadow" the "master" DSAs.

Shadowing improves the throughput of the directory because read-only operations,
such as searches, can be handled by an infinite number of replicas, and the
master can exclusively deal with modification operations, such as `addEntry`
or `modifyEntry`.

Shadowing is very flexible and can include all entries within a subtree of the
DIT or only a selection of said entries, and the replicated entries may receive
all of the attributes of the master copies, or just a selection of them.

Shadowed information can be shadowed from other shadow DSAs as well. For this
reason, the directory specifications make use of the terms "shadow supplier"
and "shadow consumer" rather than "master" and "shadow," because the supplier of
the shadowed data could itself be a shadow.

Directory users can indicate that copies will suffice for their request. Copies
are often less authoritative than shadows, since they may contain stale or
out-of-date information, depending on how frequently updates to the master are
propagated to the shadows, but using copies is likely to speed up directory
operations.

## Relaxation or Tightening

Sometimes when you perform a search, you start with an idea of how many entries
you'd like to receive. The directory has a mechanism for altering search
criteria on the fly to target the requested number of entries. This is done via
"relaxation" which is where search criteria are altered to become less strict or
removed entirely to increase the number of results returned, or "tightening" in
which they become more restrictive to reduce the number of results returned.

There are two ways this is achieved: matching-rule substitution and
mapping-based matching.

In matching-rule substitution, the matching rules used
to compose the search filter are replaced with more or less restrictive
equivalents. For instance, a case-sensitive search could be replaced with a
case-insensitive search if too few results are matching.

In mapping-based matching, certain filter criteria are replaced with others
based on exterior data the directory has. One example of this would be a
map of postal codes to cities. If a search is not turning up enough results, the
directory can retry the request by replacing a filter selecting for a certain
city with a filter for all of the postal codes that intersect with the bounds of
the city and those neighboring them. In this sense, the directory would use its
geographic knowledge to search a broader area for matching entries.

In fact, the directory also allows users to control _how much broader_ each
subsequent retry of the search is via an "extended area" parameter.

## Signing

Directory requests, results, and errors may be cryptographically-signed to
provide non-repudiation and integrity. Transport Layer Security (TLS) provides
confidentiality and integrity in point-to-point traffic between a client and
server, but it does not protect a message that is passed along a chain of
servers. One of the servers in the chain could alter the message along the way
unless it is signed to prove its authenticity!

Even if a user does not sign his requests, he can still request that the DSA
sign its responses, including errors.
