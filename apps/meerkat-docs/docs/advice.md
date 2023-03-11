# Advice

- It is recommended that administrators prevent subentries from being read
  from non-administrative users entirely, especially access control
  information. It is possible to misconfigure access controls, and if users
  have the ability to read access control information, it makes it easier for
  nefarious users to discover errors in access controls that they can exploit.
- In general, shallower DITs will outperform deeper DITs, and shallower DITs
  have the added benefit of producing more human-friendly distinguished names.
- Try to use a variety of distinguished types in object names (e.g. don't name
  everything using commonName). This helps Meerkat only perform equality
  matching on entries that _could_ match.
- It is recommended that, for attributes that have some implied "default" value
  and which are sensitive, all entries should have this attribute with the
  default value(s) so that information disclosure vulnerabilities that reveal
  the mere presence of attributes cannot be used to determine their values.
- Ensure that your DSA is configured to chain operations to other DSAs using
  strong authentication and TLS, so that the authentication level of chained
  requests is not downgraded as documented
  [here](./distributed.md#restrictions-that-apply-to-both).
- It is strongly advised that you avoid using service administration anywhere in
  the DIT except for "leaf" areas. See
  [this](./deviations-nuances.md#hidden-service-admin-areas) for more info. In
  addition to this problem, nothing in service administrative areas clearly
  indicates whether an entry has no subordinates in the result set because it
  was a part of another service admin area or because it was truly a "leaf"
  entry. This can be unintuitive for directory users.
