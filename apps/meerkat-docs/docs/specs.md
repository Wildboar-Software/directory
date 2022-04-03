# X.500-Related Specifications

## X.500 Specifications

Below are links to the the "X.500 specifications" that define the X.500
directory system:

- [ITU Recommendation X.500](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.500)
  - This introduces the directory system. It is a more detailed introduction for
    somebody that has no idea what the X.500 directory system is.
- [ITU Recommendation X.501](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.501)
  - This describes how X.500 directories model information, including entries,
    attributes, contexts, operational bindings, schema, and access control
    information. It is lengthy, but it is a great read for somebody wanting to
    administer an X.500 directory.
- [ITU Recommendation X.509](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.509)
  - This describes the security of X.500 directories, including password-based
    authentication, the use of public and private keys, the use of certificates,
    attribute certificates, and authorization and validation lists, and
    public key infrastructure.
  - Yes, this is the original specification where X.509 certificates, used in
    TLS/SSL were and are defined.
    [IETF RFC 5280](https://datatracker.ietf.org/doc/html/rfc5280.html) is
    merely a _profile_ of the X.509 PKI defined for usage by the Internet.
- [ITU Recommendation X.510](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.510)
  - This is a new specification that was first defined in 2020, but it is
    merely extracted from the 2016 version of X.509 (with some added
    clarification). It defines protocols for the management of public key
    infrastructure and privilege management infrastructure. To some extent, you
    can think of it like the [ACME protocol](https://datatracker.ietf.org/doc/html/rfc8555).
- [ITU Recommendation X.511](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.511)
  - This specification defines the protocol that would be used by clients of the
    directory system.
- [ITU Recommendation X.518](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.518)
  - This specification defines the procedures to be used for directories to
    cooperate to provide the directory service. This is much more technical and
    in-depth than the other specifications.
- [ITU Recommendation X.519](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.519)
  - This puts a bow on the preceeding X.500 specifications by defining the
    protocols to transport the abstract operations defined in the other
    specifications. It defines transport over the OSI networking stack as well
    as TCP/IP (called the Internet-Directly-Mapped (IDM)).
- [ITU Recommendation X.520](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.520)
  - This defines a minimal set of attribute types, context types, and matching
    rules that every DSA should support.
- [ITU Recommendation X.521](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.521)
  - This defines a minimal set of object classes and name forms that every DSA
    should support.
- [ITU Recommendation X.525](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.525)
  - This defines the abstract operations for the Directory Information
    Shadowing Protocol (DISP), which is used to replicate directory information
    across directory servers.
- [ITU Recommendation X.530](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.530)
  - This defines X.700 management objects for managing the directory system.
    This specification has not been updated since 2008.

## LDAP Specifications

It is worth reiterating here that Meerkat DSA is primarily an X.500 directory
server (DSA), and only secondarily an LDAP server. Here are the specifications
that define the Lightweight Directory Access Protocol (LDAP):

- [IETF RFC 4510](https://datatracker.ietf.org/doc/html/rfc4510)
  - This is a very brief introduction to LDAP and an index of the other
    specifications.
- [IETF RFC 4511](https://datatracker.ietf.org/doc/html/rfc4511)
  - This defines the LDAP protocol.
- [IETF RFC 4512](https://datatracker.ietf.org/doc/html/rfc4512)
  - This defines LDAP directory information models, kind of like
    [ITU Recommendation X.501](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.501).
- [IETF RFC 4513](https://datatracker.ietf.org/doc/html/rfc4513)
  - This defines authentication and security mechanisms used by LDAP.
- [IETF RFC 4514](https://datatracker.ietf.org/doc/html/rfc4514)
  - This defines how LDAP converts X.500 distinguished names into strings.
- [IETF RFC 4515](https://datatracker.ietf.org/doc/html/rfc4515)
  - This defines how LDAP search filters can be represented with strings.
- [IETF RFC 4516](https://datatracker.ietf.org/doc/html/rfc4516)
  - This defines the `ldap://` and `ldaps://` URL scheme.
- [IETF RFC 4517](https://datatracker.ietf.org/doc/html/rfc4517)
  - This defines LDAP syntaxes and matching rules.
- [IETF RFC 4518](https://datatracker.ietf.org/doc/html/rfc4518)
  - This defines how LDAP converts and normalizes strings.
- [IETF RFC 4519](https://datatracker.ietf.org/doc/html/rfc4519)
  - This defines directory schema to be used by LDAP directories. A lot of the
    schema here mirrors the schema found in
    [ITU Recommendation X.520](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.520)
    and
    [ITU Recommendation X.521](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.521).

## Recommended Reading

If you only plan to act as a client (a Directory User Agent) to an X.500
directory, you should read, at minimum, X.500 and X.511. If you plan to host
an X.500 directory server, you should read, at minimum X.500, X.501, X.509. If
you are hosting an X.500 directory server and expect to use shadowing
(replication), you should read X.525. If you expect to develop an X.500
directory server or contribute to Meerkat DSA, you should read, at minimum,
X.500, X.501, X.509, X.511, X.518, X.519, and X.525 (which is all of the X.500
specifications to date, except X.510 and X.530).

## A Note About Versions

When the 2019 versions were made free, I downloaded them and checked for
differences between them and the 2016 versions. There is almost no difference
at all, except that some of the contents of X.509 were split off into X.510.
So if, for some reason, you can only get ahold of the 2016 versions, don't fret:
they are still pretty much "up-to-date."
