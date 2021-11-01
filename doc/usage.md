# Usage

Meerkat DSA is an X.500 directory server that users can interact with via the
Directory Access Protocol (DAP) or the Lightweight Directory Access Protocol
(LDAP). The Directory Access Protocol (DAP) is transported using
Internet Direct Mapping (IDM) as is specified in the
[International Telecommunication Union's Recommendation X.519](). In the future,
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
