---
title: Usage

---
# Usage

Meerkat DSA is an X.500 directory server that users can interact with via the
Directory Access Protocol (DAP) or the Lightweight Directory Access Protocol
(LDAP). The Directory Access Protocol (DAP) is transported using
Internet Direct Mapping (IDM) as is specified in the
[International Telecommunication Union's Recommendation X.519](https://www.itu.int/itu-t/recommendations/rec.aspx?rec=X.519).
In the future,
more transport protocols may be supported for DAP. For clarification, none of
the above statements preclude the usage of the Directory System Protocol (DSP)
or the Directory Operational Binding Management Protocol (DOP) by other DSAs.
The Directory Information Shadowing Protocol (DISP) is unsupported, currently,
but it will be supported in the future.

Both of these protocols may use StartTLS to secure traffic, or they may be
encapsulated in TLS completely. The use of these URL schemes will have these
meanings to Meerkat DSA:

- `idm` - Internet Direct Mapping (IDM)
- `idms` - Internet Direct Mapping over TLS
- `ldap` - LDAP
- `ldaps` - LDAP over TLS
- `itot` - ISO Transport Over TCP
- `lpp` - Lightweight Presentation Protocol

## X.500 Clients

### X.500 CLI

Currently, there is only one X.500 client that we know about: the `x500`
command-line interface (CLI), which is also published by wildboar software. This
tool uses the Directory Access Protocol to interact with the directory.

## LDAP Clients

Meerkat DSA supports LDAP, though LDAP functionality is only of secondary
importance to the project's goals. Meerkat DSA's LDAP implementation was
primarily tested against Apache Directory Studio; for that reason, it is the
recommended LDAP client, but there are
[others](https://en.wikipedia.org/wiki/List_of_LDAP_software). You can download
Apache Directory Studio [here](http://directory.apache.org/studio/).

We encourage you to read the documentation on how Meerkat DSA handles LDAP.
There are important nuances that, for instance, could result in searches not
behaving the way you would expect.

## LDAP Nuances

Meerkat DSA does not process LDAP requests directly. LDAP Service is provided
by Meerkat DSA by translating an LDAP request to an equivalent DAP request,
processing the DAP request as usual, and converting the DAP result into an LDAP
result. This approach works well for most use cases, but it does have its
nuances:

- LDAP has no concept of contexts. All values with contexts will be included in
  LDAP results containing attribute values, but the contexts themselves will not
  be included.
- For all LDAP searches, a temporal context assertion of "now" will be quietly
  added to the DAP request that is produced from the LDAP request so that
  attribute values that are "not current" will be excluded from the results.
- When LDAP attribute options are supplied, they will be converted to the
  `ldapAttributeOptionContext` context values. Note that, to use LDAP attribute
  options, DIT context use rules must permit them.
- In modification operations, all values with and without contexts will be
  treated equally, meaning that values with contexts will behave as though they
  had no contexts, with the exception of `ldapAttributeOptionContext`s and
  temporal contexts, as noted above. For this reason, it is recommended that
  sensitive modification operations take place over DAP instead of LDAP.
- In LDAP, the `subtreeSpec` attribute is a `userApplications` attribute, but in
  X.500, `subtreeSpecification` is a `directoryOperation` attribute. The latter
  is respected.

## Internationalization

The language of the logging used by Meerkat DSA is determined by the system's
environment variable `LANG`. If your selected language is not supported, English
will be used as a default.

Currently, only English is supported, but future editions may support other
languages.

In LDAP, diagnostic messages will be returned in the language of the DSA. There
is no current means for indicating an LDAP user's language preference.

## Approximate Matching

Meerkat DSA implements some "approximate" equivalents of some of the matching
rules defined in the X.500 series of specifications. These equivalents are used
whenever `approximateMatch` alternative of a `FilterItem` is used.

Approximate matching rules are only implemented where it would not be easy to
construct equivalent semantics using some combination of other matching rules.
For instance, you could not easily craft an search filter that tolerates a
single-letter typo or transposition for every possible permutation of letters in
a word, so an approximate matching rule has be implemented for this.

| Matching Rule                      | Behavior                                                                        |
|------------------------------------|---------------------------------------------------------------------------------|
| acceptableCertPoliciesMatch        | Matches if a simple majority of the asserted policies are present.              |
| algorithmIdentifierMatch           | Matches if just the `algorithm` object identifier matches.                      |
| attDescriptor                      | Leading and trailing whitespace and casing are ignored.                         |
| bitStringMatch                     | Tolerates a single inverted bit from the assertion.                             |
| caseIgnoreIA5Match                 | Trims whitespace and tolerates a fast Levenshtein difference of 1.              |
| caseIgnoreListMatch                | Same as `caseIgnoreIA5Match`.                                                   |
| caseIgnoreMatch                    | Same as `caseIgnoreIA5Match`.                                                   |
| directoryStringFirstComponentMatch | Trims whitespace and ignores casing.                                            |
| distinguishedNameMatch             | Matches if all but the last RDN matches the assertion.                          |
| dualStringMatch                    | Tolerates a fast Levenshtein difference of 1.                                   |
| generalizedTimeMatch               | Tolerates an mismatching time by one day.                                       |
| integerFirstComponentMatch         | Matches an integer that is up to 10% incorrect.                                 |
| integerMatch                       | Matches an integer that is up to 10% incorrect.                                 |
| intEmailMatch                      | Trims whitespace, lowercases, and matches if local parts differ by FL* of 1.    |
| jidMatch                           | Same as `intEmailMatch`.                                                        |
| objectIdentifierMatch              | Matches if either value is a prefix of the other.                               |
| pwdEncAlgMatch                     | Matches if just the `algorithm` object identifier matches.                      |
| uniqueMemberMatch                  | Matches if only the distinguished name matches.                                 |
| uriMatch                           | Matches if only protocol, hostname, port, and path matches.                     |
| uTCTimeMatch                       | Tolerates an mismatching time by one day.                                       |

* "FL" = Fast Levenshtein.
