# Why Not LDAP?

LDAP is a perfectly fine protocol, and in many respects, it simplifies access to
directories. However, it was invented at a time when the X.500 standards had not
defined the Internet Directly-Mapped (IDM) transport, which allows directory
protocols to be transported over TCP/IP. Since TCP/IP became the de facto
standard for transport on the Internet, this made LDAP much more appealing.

However, now we have IDM, as well as ISO Transport over TCP (ITOT). If you look
at how LDAP and DAP work under the hood, they use similar encodings, so easier
implementation of an LDAP client is not much of a selling point (although
implementing an LDAP _server_ is MUCH easier).

The point is: I believe LDAP took off primarily because it used TCP/IP and
because server implementations were easier and as such, more likely to be free
and open source. But now, we have a free and open-source X.500 DSA
(Meerkat DSA), and we can transport the X.500 protocols over TCP/IP. DAP has
many more features over LDAP, and it is not much harder to implement a DAP
client over an LDAP client. That said, I believe Directory Access Protocol to
be a superior alternative.

LDAP once served an important role as a simpler protocol for directory
operations, and to some extent it still does. But it should be understood to be
_lightweight_ only; its value lies in supporting low-power devices and other
simple clients. An LDAP server is essentially just a searchable string
database, whereas an X.500 directory server is so feature rich as to be an
application in and of itself.

To elaborate upon the features that Directory Access Protocol (DAP) has that
Lightweight Directory Access Protocol (LDAP) does not:

- Contexts, whereby you can associate metadata to values
  - LDAP has something similar, but it is just a very constrained string, and
    the only defined use of it is to specify a language.
- Compound entry-awareness, meaning that you can view a compound entry has
  having nested entries, rather than viewing them all separately, and you can
  filter on complete compound entries (or subsets thereof), kind of like a
  join in a relational database. For example, if you have objects of class
  `device` as child entries to the ancestor of object class `person`, you can
  search the directory for a `person` who has a `device` that has a particular
  `serialNumber`. This is not possible with LDAP; there is no join-like concept
  in LDAP.
- True distributed operation: the X.500 protocols capably support fully
  distributed operation. LDAP has little to no concept of distributed operation
  and primarily uses referrals and expects clients to issue their own
  subrequests.
- More detailed results
- More detailed errors
- Hierarchy selections, whereby separate "virtual hierarchy" can exist on top
  of the DIT, and be searched
- Relaxation, which works kind of like "auto-correct" in searches
- A `list` operation, which can be more performant
- Password management operations, `changePassword` and `administerPassword`
  - There are extensions for password modification in LDAP, but no guarantee
    that any LDAP server supports them, since it is just an extension.
- Mapping-based matching, including Zonal Matching, where the directory can
  intelligently modify a search filter that names a specific location (such as a
  city) to be a "fuzzy search" over all nearby postal codes.
- Signed requests, responses, and errors, providing end-to-end integrity,
  despite the distributed nature of the directory.
- More authentication options: authentication via a cryptographically-signed
  token using X.509 PKI, or via the
  [GSS-API's SPKM mechanism](https://www.rfc-editor.org/rfc/rfc2025).
- Data integrity at rest using cryptographically-signed entries, attributes, and
  attribute values.
- A well-defined universal access control mechanism.
  - This is one huge problem with LDAP. There is no way to define access
    controls that will be understood by all LDAP servers. An X.500 directory
    server has multiple standardized access control mechanisms.

Note that a feature being in the list above does not mean that it is currently
supported by Meerkat DSA. Most features are, though.
