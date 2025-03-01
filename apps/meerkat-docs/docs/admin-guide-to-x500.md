# Administrator's Deep Dive

What follows is a deep dive for administrators of the directory. This is an
attempt to be a high-level overview. Administrators seeking to fully understand
X.500 directories should read the X.500 specifications. See
[Specifications](./specs.md).

## Naming Contexts and Request Routing

Earlier, we established that the directory can be (and is likely to be, given
its use case) partitioned across a multitude of X.500 directory servers (DSAs).

For the various DSAs to provide a seemless experience as though the user were
only interacting with a single server, these DSAs store not only directory
entries, but a supercategory of "things that fall within the DIT" called
DSA-Specific Entries (DSEs). As you can imagine, when you have a distributed
system like this, each DSA is going to have its own "perspective" of what the
directory looks like. For a given distinguished name referring to something in
the DIT, two DSAs might have something stored, but one might be a master entry
in one DSA, and the other might be a shadow (replicated entry) in the other
DSA. In addition to this, DSAs may store "reference DSEs" that "point" to the
DSAs where an entry is really stored.

Let's explore an example. Let's say the United States government runs an X.500
DSA. It administers the `c=US` namespace of the directory. The `c=US` entry
might have some real entries beneath it, such as `c=US,o=Congress`, but also
some subordinate namespaces ("context prefixes") handled by other DSAs. The
substituent 50 states of the United States may themselves have DSAs. For
example, `c=US,st=FL` _could_ be administered in the United States' DSA, but it
would be likely that Florida would want to manage its own DSA.

Hence, the `c=US` DSA would have a reference DSE named `c=US,st=FL` that
points to the network address (IP address or hostname, protocol, and port) of
the DSA that administers the `c=US,st=FL` namespace. The `c=US,st=FL` DSA would
have the real entry for `c=US,st=FL` and for `c=US`, it would have a reference
DSE pointing back to the DSA that administers the `c=US` namespace. No matter
where a request starts in the directory--no matter what entry is sought--the
directory information tree can be navigated up and down using these reference
DSEs to find the DSA that administers a given entry. This works kind of like
the `NS` record in DNS, where a domain can delegate management of a subdomain
to a separate name server: in that same way, DSAs can delegate subtrees
of the DIT to other DSAs by storing reference DSEs identifying the responsible
DSA instead of storing the entry itself.

To clarify, the directory does more than merely store these references: it is
a feature of the directory that the DSAs themselves use them. This is how
chaining is achieved: a DSA descends its own internal DSA-specific information
tree (called a "DSAIT") to find an entry sought by a directory user, and when
it encounters a reference entry, it either forwards the request to the DSA
responsible for that namespace, or it returns a referral back to the user,
thereby saying "you make this request."

To help understand this, let's consider a hypothetical routing scenario: a user
in Hamburg, Germany, wants to read an entry `c=US,st=FL,cn=Jonathan Wilbur`.
This user's "home DSA" is `c=DE,l=Hamburg`: they authenticate to and send
requests to this server. The DSA responsible for `c=DE,l=Hamburg` sees that not
even the first RDN of the sought distinguished name (`c=US`) matches what the
user is searching for, so the request has _ascend_ the directory information
tree until we reach `c=US`, then it can descend. So it forwards the request to
the DSA that administers `c=DE`. This DSA is a special "top-level DSA," which
contains the reference DSEs for all of the other countries, so it forwards the
request laterally to the DSA that administers `c=US`. The DSA for `c=US` sees that it has
a DSE for `c=US,st=FL`, but it is a reference DSE--not the real entry--so the
DSA forwards the request to the DSA that handles the `c=US,st=FL` namespace.
Finally, the DSA that administers `c=US,st=FL` sees that it has the entry named
`c=US,st=FL,cn=Jonathan Wilbur`. It produces a result, possibly signs it to
ensure end-to-end integrity, and propagates this result back to the user,
traversing the exact path from which this request came in reverse.

## Cross References

Forwarding so many requests to a top-level DSA to be able to traverse laterally
in the DIT would be extremely taxing on a very important DSA. One optimization
directories can implement is cross references. These are basically cached
references for other DSAs in the DIT. When you use DNS and resolve,
`www.google.com`, your computer isn't making a request to the root nameserver
every single time: it caches the addresses of the servers that manage `com`,
`google.com`, etc. In this same way, DSAs can store pointers to namespaces they
have previously resolved.

Continuing on our previous example, the DSA for `c=DE,l=Hamburg` can request
that the `c=US` DSA return cross references. The `c=US` DSA's chained request
response can then contain the routable address of the DSA that administers
`c=US,st=FL`. The `c=DE,l=Hamburg` can then forward requests destined for this
namespace directly to the responsible DSA instead of propagating it up and down
through the directory.

Note that cross references, like any cached data, can become stale and contain
information that is out-of-date, and trusting cross-references itself has
security implications that ought to be considered by directory administrators.

## Operational Bindings

One thing you might be wondering is: how do reference DSEs get in the directory?
They could be administered manually, but the preferrable method is for two
correspondent DSAs to establish what is called an "operational binding." An
operational binding is a bilateral agreement between two DSAs to provide some
service.

There is a standard protocol by which a DSA proposes an operational binding to
another DSA: the Directory Operational Binding Management Protocol (DOP). This
protocol provides three operations: establish, modify, and terminate for a given
operational binding. When establishing or modifying operational bindings,
parameters of the proposed bilateral operation are sent. Operational bindings
are identified by unique numbers assigned by the correspondent DSAs, and also
include revision numbers for when modifications are made.

In the X.500 specifications, there are three types of operational bindings
defined, which we will discuss.

### Hierarchical Operational Bindings (HOBs)

In a Hierarchical Operational Binding (HOB), one DSA agrees to be the "superior"
DSA and another a "subordinate." This is a simple case where a DSA delegates a
subtree of the DIT that it would otherwise control to another DSA; concretely,
that means that it forwards requests targeting entries that fall within that
namespace to the subordinate DSA. The result of an HOB in the DIT is a
"subordinate reference" DSE in the superior DSA that points to the subordinate
DSA, and a "superior reference" DSE in the subordinate DSA that points to the
superior DSA.

### Non-Specific Hierarchical Operational Bindings (NHOBs)

A Non-Specific Hierarchical Operational Binding (NHOB) is like the Hierarchical
Operational Binding (HOB), but with a twist: multiple DSAs compete for the
namespace subordinate to an entry. When I say "compete," it is not to insinuate
that there is an adversarial relationship, but merely that names within the
namespace are allocated on a first-come-first-served basis to the involved
subordinate DSAs.

In an NHOB, instead of a single subordinate reference DSE that points to a DSA
(or cluster of them) that _definitely_ has the entry for the next RDN to be
resolved, it uses a _Non-Specific Subordinate Reference_ (NSSR) which contains
a list of subordinate DSAs that _might_ have it. When an entry subordinate to
the reference is sought, all of the subordinate DSAs are queried until one
(or none) returns a result.

DSAs in an NSSR do coordinate to avoid naming conflicts: when they create a new
entry, the subordinate DSA is expected to attempt a read operation to all of
them to check if the entry exists. This is imperfect: there could be a race
condition in which duplicates are introduced, so this requires careful
coordination and doesn't scale well.

It is not obvious to me why NHOBs would even be desirable: it is going to be
less performant to have indeterminate routing information. The only benefit I
can see is less managerial overhead from having to manage a single operational
binding per subordinate naming context as is the case with HOBs. Either way,
NHOBs are there for you to use.

### Shadowing Operational Bindings (SOBs)

We have already discussed shadowing in the User's Deep Dive, so it is presumed
that you understand what shadowing is: basically, the provisioning of read-only
replicas of directory information for better throughput and availability.

Shadowing is established by a Shadowing Operational Binding (SOB). When
established or modified, this operational binding's parameters include:

- What directory information is to be replicated, including:
  - Which entries
  - Which attributes
  - Which values
  - Which contexts
- How often the replication is to take place, which can be:
  - At regular intervals, or
  - Whenever the information changes
- Who is to initiate the replication operations: the shadow DSA or master DSA

SOBs may be "pull" or "push": it may be expected that the shadow supplier
periodically--or upon modifications--push changes to its consumers, or it may
be expected that the shadow consumers periodically "poll" the shadow supplier
for updates.

Shadow updates are coordinated by specific shadowing operations, which are:

- `coordinateShadowUpdate`: used by a shadow supplier in the "push" model to
  announce a forthcoming shadow update, to get prior approval before sending it,
  and ensuring that the DSAs are in agreement as to when the last shadow update
  occurred (this matters for ensuring incremental updates are complete).
- `requestShadowUpdate`: used by a shadow consumer in the "pull" model to
  request an update.
- `updateShadow`: is the operation that contains the actual shadowed data.

The `updateShadow` operation may contain the entirety of all data to be updated,
called a "total refresh," or just whatever changed since the last update, called
an "incremental refresh." Alternative update methods could be defined. The
choice of method used could be requested by a shadow supplier when requesting a
shadow update.

## Administrative Areas

Just as the directory can be physically partitioned among multiple DSAs, the
directory information tree can be partitioned in into "administrative areas" in
which different access control rules, services, assumptions,
collective attributes, etc. apply.

An administrative area is created merely by adding an `administrativeRole`
attribute to an entry in the DIT: this makes this entry an "administrative
point."

Other than this attribute, (almost) all other configuration for administrative
areas falls within special entries immediately subordinate to the administrative
point, called "subentries." Subentries are entries of object class `subentry`.
Subentries MUST contain a name and a specification of the subtree of the
administrative area to which their effects apply: other than this, auxiliary
object classes are used to add more attributes depending on what administrative
area type it configures.

The directory specifications define the following administrative area types:

- Access Control Administrative Areas: where access controls are defined
- Subschema Administrative Areas: where recognized or applicable schema
  (e.g. attributes, object classes, etc.) may vary.
- Collective Attributes Administrative Areas: where collective attributes are
  applied to entries
- Context Default Administrative Areas: where default context assertions are
  applied to requests if none are supplied by the user.
- Service Administrative Areas: where "service rules" are applied to restrict
  what searches may be performed.
- Password Administrative Areas: where the rules for passwords (such as
  length, complexity, alphabets, etc.) are applied.
- Autonomous Areas: where all superior administrative areas are effectively
  marked as "overridden" completely.

Administrative areas may fall within each other: in other words, `c=US` may be
a password administrative area, and `c=US,st=FL` may be one as well. There is
no conflict in this case: when passwords are managed in `c=US,st=FL` the
password administrative area defined there overrides the one defined in `c=US`.
As stated earlier, autonomous administrative areas entirely reset all
superior administrative areas.

In some cases, namely collective attribute administrative areas and access
control administrative areas are further partitioned into "specific areas" and
"inner areas." Specific areas reset all superior administration of like kind:
in other words, an access control specific area completely removes and overrides
all access control rules defined in superior access control administrative
areas. Inner areas, on the other hand, are _additive_. For example, Access
Control Inner Areas (ACIAs) may introduce more access control rules that must be
evaluated without resetting the rules applied from superior Access Control
Specific Areas (ACSAs).

These administrative areas are independent of the physical partitioning by
naming contexts: an administrative area may span across multiple DSAs, or there
can be multiple administrative areas within a single DSA.

## Access Control

X.500 directories are flexible in what access control schemes they can use.
A special attribute, `accessControlScheme`, which is a single-valued attribute
containing an object identifier, is placed in the Access Control Specific
Point (ACSP) (which is the administrative point for an Access Control Specific
Area (ACSA)). This identifier determines what access control scheme is used for
that ACSA. Currently, the X.500 specifications define five access control
schemes, which are:

- `basicAccessControlScheme`: Uses Access Control Items (ACIs) stored in
  entries, subentries, and administrative points
- `simplifiedAccessControlScheme`: Like `basicAccessControlScheme`, but uses
  only the access control rules in administrative points and subentries.
- `rule-based-access-control`: Uses security clearances and labels on data
- `rule-and-basic-access-control`: Combines `rule-based-access-control` and
  `basicAccessControlScheme`.
- `rule-and-simple-access-control`: Combines `rule-based-access-control` and
  `simplifiedAccessControlScheme`.

### Access Control Items: An Intuitive Understanding

If you think about how access control decisions are said aloud in natural
language, such as "forbid janitors from reading database credentials" or
"allow administrator to change password for all employees," you'll notice that
access control rules across any application can be broken down as such:

```
 allow  administrator to change password for all employees
 -----  -------------    ---------------------------------
 Action   Subject                   Operation
```

In some cases, the action is implicit: some access control schemes allow or
deny by default, and access control rules can only be used to restrict or grant
access beyond this default state. In other cases, other actions may be defined,
such as "audit," in which the protected access is logged, but otherwise allowed.

Subjects are arguably a logical necessity for an access control rule. If there
aren't multiple users of something, whose access is being controlled and why?

Operations are a logical necessity as well, even if the operation is an implicit
"everything" or "nothing." Sometimes operations are defined in terms of the
thing being acted upon (the "object"), such that access control rules take the
form of a "subject-verb-predicate" form. In the example above, the "object"
would be "all employees."

All of this was a preface to introduce the Access Control Item (ACI): the unit
of access control configuration under Basic Access Control (BAC) and
Simplified Access Control (SAC). It follows a subject-verb-object format, but
with a few other parameters. In summary, an ACI contains:

- The name of the rule: ACIs are named with human-readable strings
- The precedence: an integer identifying the precedence an ACI has
- The authentication level: how sure we are that the user authenticated is really that user
- The user: the "subject" using the terminology established above.
- The item: the "object" using the terminology established above.
- The operation

There is a twist that makes ACIs difficult for the newcomer to understand, and
for that reason, let me start by establishing what the problem is. In access
control configuration, it is likely that patterns will emerge, if not intended.
In an extremely secure facility that protects the break rooms and bathrooms by
badge entry, lots of employees may be granted, and as such, the access control
rules might look like:

```
allow:alice   :ingress:break_room
allow:bob     :ingress:break_room
allow:charles :ingress:break_room
allow:desmond :ingress:break_room
allow:emerson :ingress:break_room
allow:alice   :ingress:bathroom
allow:bob     :ingress:bathroom
allow:charles :ingress:bathroom
allow:desmond :ingress:bathroom
allow:emerson :ingress:bathroom
```

Depending on the situation, it might be the case that you can simplify the rules
by putting all of these employees in a security group, then grant the security
group access such access, or maybe you could put all objects in an "object
group" and grant access to that. When you do this, you effectively outsource
the rules to some data outside of the rule itself: somewhere, some system
contains a list of people who are members of the security group, or a list of
objects that are substituents of the "object group."

This outsourcing, while unavoidable in some cases, is undesirable on some level:
in real-world systems, it often requires more computational load or latency to
perform a lookup of a group of people or objects. It also makes the rules less
transparent: what information can we glean if the rule is defined as
"allow database readers to read the database"?

There is an alternative: because there are patterns that tend to emerge from
these rules, we can _compress_ them, like so:

```
allow:break_room:ingress:alice,bob,charles,desmond,emerson
allow:bathroom:ingress:alice,bob,charles,desmond,emerson
```

In the above example, we effectively "compressed" the objects column.
Alternatively, we could "compress" the users column, though this is less
effective at reducing the size of the rules:

```
allow:alice   :ingress:break_room,bathroom
allow:bob     :ingress:break_room,bathroom
allow:charles :ingress:break_room,bathroom
allow:desmond :ingress:break_room,bathroom
allow:emerson :ingress:break_room,bathroom
```

The point is that, usually, either subjects or objects in access control rules
can be "compressed" and hence, ACIs in the directory are defined in terms of
"item first" or "user first" variants. Now having the intuition we have about
access control rules, looking at the ASN.1 definition of an ACI will make much
more sense:

```asn1
ACIItem ::= SEQUENCE {
  identificationTag    UnboundedDirectoryString,
  precedence           Precedence,
  authenticationLevel  AuthenticationLevel,
  itemOrUserFirst      CHOICE {
    itemFirst       [0]  SEQUENCE {
      protectedItems       ProtectedItems,
      itemPermissions      SET OF ItemPermission,
      ...},
    userFirst       [1]  SEQUENCE {
      userClasses          UserClasses,
      userPermissions      SET OF UserPermission,
      ...},
    ...},
  ... }

ItemPermission ::= SEQUENCE {
  precedence        Precedence OPTIONAL, -- defaults to precedence in ACIItem
  userClasses       UserClasses,
  grantsAndDenials  GrantsAndDenials,
  ... }

UserPermission ::= SEQUENCE {
  precedence        Precedence OPTIONAL, -- defaults to precedence in ACIItem
  protectedItems    ProtectedItems,
  grantsAndDenials  GrantsAndDenials,
  ... }
```

You will see that any alternative you choose in `itemOrUserFirst` has all of
`UserClasses` (subject), `GrantsAndDenials` (verb), `ProtectedItems` (object).
In fact, the ITU-T Recommendation X.501, which defines the access control
schemes that use ACI, even instructs implementations to effectively "decompress"
these ACIs into "tuples" internally before processing.

With this intuitive understanding, let's now get into the details of an ACI,
starting with the user classes. There are five user classes defined by the X.500
specifications, which I will not explain, since they mean exactly what they
sound like they mean: `allUsers`, `thisEntry`, `name`, `userGroup`, `subtree`.

Protected items can be entries, all user attributes, attribute types, attribute
values, and context values, as you might expect, but the directory also supports
controlling the number of values or the number of subordinate entries. Directory
administrators can even define protected items in terms of object classes,
filters that restrict the ranges of values

There is a special `selfValue` protected item type, which means values that are
distinguished names that represent the currently logged in user. The `selfValue`
is useful for scenarios where you might want a user to be able to read values
that pertain to them in other entries: for example, seeing that they are a
member of a user group in the directory by granting them `selfValue` access to
`member` instead of giving them full access to read all values of `member`.

Finally, the grants and denials are simple bits defined per verb, which are:

- `add`: Add something, such as an entry or attribute
- `discloseOnError`: Disclose the existence of something hidden if there is an
  error pertaining to it
- `read`: Read something, such as an entry or attribute
- `remove`: Remove something, such as an entry or attribute
- `browse`: Access an entry without providing the name explicitly
- `export`: Move an entry out of its current location
- `import`: Move an entry into this location
- `modify`: Modify something, such as an entry or attribute
- `rename`: Rename an entry
- `returnDN`: Disclose the distinguished name of an entry
- `compare`: Compare values, perhaps against an assertion
- `filterMatch`: Match values in a filter
- `invoke`: Attribute type-specific meaning

By default, directories try to avoid disclosing information not needed to be
known by users, even if indirectly via errors. For example, if I am not allowed
to know the entries that fall beneath `c=US,l=Military Base`, but I attempt to
create `c=US,l=Military Base,cn=Nuclear Missile #01` and the directory responds
with an "entry already exists" error, it inadvertently disclosed the existence
of an entry I wasn't allowed to know about. Hence, ACIs define the
`discloseOnError` permission. If `discloseOnError` is not granted, directories
are expected to return errors that portend the non-existence of a protected
item, such as "no such object" or "no such attribute or value" instead.

The `invoke` permission is used in service administration, which we will discuss
later.

For each of the above permissions, a grant or a deny bit may be set, but both
may be unset, which means "I don't have an opinion on this," thereby deferring
to other ACIs to grant or deny for that particular subject-verb-object tuple.

### Basic Access Control

Basic Access Control (BAC) is a scheme that users ACIs distributed throughout
three different operational attributes:

- `prescriptiveACI`: which apply ACIs broadly to entries in the ACSA or ACIA
  from subentries using their subtree specifications
- `entryACI`: which apply "one-off" ACI to the entry in which this attribute exists
- `subentryACI`: live in the administrative point and apply ACI to subentries

Basic Access Control denies by default: in other words, if a user does not
explicitly have permission to do something in an ACI, they will be denied it.
In the interest of security, there is no way to grant access to "all operational
attributes" even though there is for "all user attribute" with an ACI: access to
each operational attribute has to be granted individually.

### Simplified Access Control

Simplified Access Control (SAC) is the same as Basic Access Control (BAC),
except that it uses neither `entryACI` nor Access Control Inner Areas (ACIAs).

### Rule-Based Access Control

Rule-Based Access Control (RBAC) is not to be confused with the much more common
term Role-Based Access Control. RBAC is an authentication scheme defined in
which attribute values in the directory can be labeled with a special context,
`attributeValueSecurityLabelContext`, that defines what security classification,
such as "top secret" or "classified," security categories, and privacy marks
applies to that value. Access is granted based on what clearances a user has
based on what values are present in the `clearance` attribute.

Both clearances and security labels are associated with a security policy via
an object identifier. Both clearances and security labels contain security
classifications: security labels contain only one defining the classification
of the object, and clearances can contain multiple (to be explained soon).

A privacy mark may appear in a security label, which is a textual label. Its
intended use case is something like the "NOFORN" or "CUI" as it is used in the
United States.

Security categories provide further restriction within the context of a
security classification or privacy mark. It's not clear to me how they differ
in purpose from a privacy mark, if at all.

Security policy dictates how clearances and security labels are used to grant
or deny access. An example security policy might be the
[Bell–LaPadula (BLP) model](https://en.wikipedia.org/wiki/Bell%E2%80%93LaPadula_model).
In the BLP model, subjects do not automatically have access to things of a
less sensitive classification, hence the possibility of multiple classification
levels in a clearance.

The integrity of security labels is ensured by digitally signing them.

Rule-Based Access Control can be combined with Basic Access Control or
Simplified Access Control, requiring access to be granted under both schemes
for a given operation.

## Context Assertion Defaults

Through the use of language contexts, the directory allows us to annotate values
with what language they represent. It is likely that, in a real, world-scale
deployment of the directory, certain attributes like `description` might be
present in an entry multiple times using translations across multiple languages.

However, for data that is expected to be of regional interest, the directory has
a way of defining default context assertions so that not all description values
are returned every time a user performs a directory operation without the
appropriate language context assertions. Instead, an administrative area that
covers an exclusively English-speaking region can define `en` as the default
language context, and therfore, directory operations in that administrative area
will only return English descriptions by default.

This is only an example of a broader concept: the directory can supply default
context assertions via Context Default Administrative Areas (CDAAs). Context
defaults can be defined for any user attribute and can use langage contexts or
any other context type.

## Password Administration

Password administrative areas allow directory administrators to define password
policy for an administrative area. Password policy includes things like:

- Requirements on password complexity, characters, words, etc.
- Max failed password attempts before lockout
- Lockout duration
- Password history retention rules
- Password encryption / hashing algorithms
- Whether passwords can be changed via `modifyEntry`, `changePassword` or both
  operations
- How many grace logins a user gets after his password expires

## Service Administration

"Service administration" refers to the administration of search services in the
X.500 directory via "search rules." By default, users may perform any search
they want, subject to access controls. Search rules allow directory
administrators to constraint the searches a user can perform.

Search rules are identified by a combination of an object identifier that
identifiers the Directory Management Domain (DMD), and an integer that is unique
within that domain.

An object identifier also defines the "service type," the meaning of which is
unclear to me. The specifications give no examples. However, `serviceType` can
be supplied in the DAP service controls to select the applicable search rules.

A user class is a group of users identified by an integer that is unique within
the DMD. It's meaning is dependent on the DMD. This too can be supplied in the
service controls.

Service administrators can restrict what attribute types can be used in filters,
what attributes can be returned, what service controls are on by default,
mandatory, how compound entries are searched and returned, what relaxations and
tightenings are applied, how many entries can be returned, and whether the
search can be performed only on the base object, at one level, or for the entire
subtree.

## Subschema Administration

A Subschema Administrative Area is where directory administrators define what
X.500 directory schema is applicable for that area. This includes things that
are universally-defined, such as attributes, object classes, name forms,
matching rules, and context types, but may also contain things that are specific
to that administrative area, such as DIT structure rules, content rules, context
use rules, matching rule usages, and which attributes are considered "friends."

## Integrity at Rest

The directory also supports integrity at rest, although it is not required to do
anything with it, such as verifying it prior to storing such protected data. An
`attributeValueIntegrityInfoContext` context can be used to annotate attribute
values with cryptographic signatures proving that they were not tampered with
and are authentic in their origination.

The `attributeIntegrityInfo` attribute
can be used to sign all (or a selection of) the attributes in an entry, all at
once. Note that the entire signature would have to be re-calculated if any of
the involved attributes change. This attribute can be used in any entry by
giving the entry the `integrityInfo` object class.

It is my belief that this integrity mechanism is vulnerable to a sort of
"replay-like" exploit: since nothing in the context value or signature binds
the value to the entry, these values could just be copied to other entries with
their signatures intact. I will report this to the ITU Study Group 17, but until
this is resolved, beware relying on them.
