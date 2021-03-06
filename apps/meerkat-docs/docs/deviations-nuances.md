# Deviations and Nuances

Meerkat DSA deviates from the X.500 specifications in a few ways, often due to
ambiguities in the specifications or creative leeway given by the
specifications to DSA implementors. These deviations are noted below. Also
noted below are nuances in Meerkat DSA:

- RFC 4512: "The root DSE SHALL NOT be included if the client performs a subtree
  search starting from the root." I could not find anywhere in the X.500
  specifications where this behavior is required, however, it makes sense to me:
  a search that does not explicitly target the root DSE should not include it,
  because the root DSE is, in some sense, not a "real" entry in the DIT.
- Meerkat will not allow the creation of attribute values from the modifyDN
  operation. This is for security / integrity purposes.
- Meerkat DSA automatically sets the
  `SearchControlOptions.separateFamilyMembers` option when LDAP search requests
  are converted to DAP search requests. This does not violate the X.500
  standards, but it is not mentioned. In fact, there is no specified behavior on
  how to translate an LDAP request into DAP--only the opposite.
- Meerkat DSA will not throw a `noSuchAttributeOrValue` error during a compare
  operation. That is insecure because it reveals that the entry does not have an
  attribute of the asserted type.
- The "Target Not Found" subprocedure defined in X.518 seems to imply that a
  single CR must be chosen from candidateRefs to be added to the
  NRContinuationList. Instead, Meerkat DSA adds all of them. Why not try all of
  them?
- Check Suitability of filter for a subtree search in a shadowed area is
  extremely complicated and guaranteed to be incorrect. However, it will
  function better when the attribute selection of replication and the filter is
  simpler.
- Check Suitability of selection for a search or read is not performed at all.
  The selection will return whatever attributes are requested and replicated.
- The X.500 specifications are not clear at all as to how the `uniqueIdentifier`
  attribute is to be used for authentication, since it is multi-valued and
  user-modifiable, so, during bind, the first `uniqueIdentifier`, if it exists,
  will be used as the bound `NameAndOptionalUID`.
- How LDAP matching rule assertion syntax is obtained from
  MatchingRuleDescription: it is not. It is obtained from the
  `ldapAssertionSyntax` property of matching rules.
- Because LDAP schema values are converted to the equivalent X.500 types,
  extensions (fields starting with "X-") will be ignored and not preserved.
- The `unmerged` parameter of paged results requests will be ignored for now.
- ITU Recommendation X.511, Section 7.5.f is not clear in what it means by
  "behaves as though normal entries do not exist." The parent of a subentry is
  necessarily a normal entry. Does this mean that a subtree search can only
  return subentries immediately subordinate to the base object? Meerkat DSA
  behaves as if this were so.
- `administrativeRole` is automatically added to top-level DSEs when added if it
  is not present, making the entry an AAP.
- The specification is not clear as to whether `pageNumber` is zero-indexed or
  one-indexed. Meerkat DSA will treat this as zero-indexed. This means that,
  whether the parameter is 0 or not supplied in the request, a simple falsy
  check can inform the DSA as to whether it can ignore this parameter. If a user
  did not want to use paging, they should omit this value, rather than setting
  it to zero or one to indicate that they want the first page; for this reason,
  1 will be treated as the "second" page. As another slight benefit, this also
  means that if clients differ in their behavior from this, it means that
  _fewer_ entries will be returned.
- Pagination may not be used when signing is required and chaining is not
  prohibited. This is because there is no way to merge results while preserving
  the signatures from other DSAs. If chaining is prohibited, there will only be
  results from the local DSA, which mean that the results can be paginated and
  signed.
- There are necessarily no access controls that can be applied to first-level
  DSEs that do not yet exist. This begs the question: how do we control which
  users can add first-level DSEs? Meerkat DSA does this by prohibiting entries
  that do not have a `may_add_top_level_dse` flag set. The first entry to have
  a password set will automatically get this flag set as well. After that first
  entry, any other entries that should have this permission will require
  direct database queries to get this flag set. To use this privilege, a user
  cannot be authenticated anonymously. This does not apply if there are no
  users with passwords set, or if the `MEERKAT_OPEN_TOP_LEVEL` environment
  variable is set to `1`.
- When sorting is used in LDAP requests, the response will always indicate a
  successful sort by including the sort response control with a success code. If
  ever in the future, sorting status can "trickle-up" to the LDAP response from
  the operation dispatcher, maybe this will change.
- `matchedValuesOnly` keeps only the matched values from all members of the
  returned family. This might not be incorrect, since the X.500 specifications
  do not clarify what the expected behavior is for non-contributing family
  members, but it is something to be aware of.
- The `restrictedBy` alternative of `ProtectedItems` is not supported for the
  purposes of access control.
- Pending implementation: it will be slightly more efficient to use the
  user-first alternative for ACI Items, because the ACI Items can be
  "pre-filtered" to only retain the relevant ones.
- `DiscloseOnError` permissions do not apply to some operations, such as list
  and search when they return 0 results, or addEntry, because Meerkat DSA
  requires the target objects to be discoverable in the first place.
- We do not check for `DiscloseOnError` in modifyEntry and addEntry operations
  that add values, to determine when an attribute value already exists before it
  is added, because checks are already in place to determine if it can be added.
  The X.500 specifications permit the attribute value's existence to be
  disclosed if DiscloseOnError OR Add permissions exist for that value, but
  since Add permissions are a necessary pre-requisite before Meerkat DSA even
  checks for duplicates, there is no need to worry about `DiscloseOnError`
  permissions.
- The ITU specs do not explicitly say that an IDM client cannot make multiple
  subsequent bind attempts before the first one gets a response. If this is
  allowed, it opens the doors to brute-force attempts. Nefarious users can
  circumvent rate-limiting by submitting back-to-back bind requests without
  waiting for each one to succeed sequentially. Meerkat DSA aborts IDM
  connections with clients that attempt back-to-back binds.
- ITU X.511 (2016), Page 43, Footnote 2: This is because, apparently, the ACI
  for a subordinate reference may not be available locally (see ITU X.518
  (2016), Section 19.3.1.2.1, item 3). If this is the case, the DSA _must_ chain
  to let the subordinate DSA decide whether to reveal this entry. There is not
  really a good way to know if the subordinate DSA actually informed the
  superior DSA of relevant access control information, so Meerkat DSA will
  _assume_ that it has all of the ACI information necessary to make this
  decision. If the subordinate does not inform the superior of ACI information,
  it is the fault of the subordinate if its `subr` entry is disclosed. For that
  matter, the subordinate DSA could use no access control or an unsupported
  access control scheme, for all the superior DSA knows.
- The specification is not clear as to which member of search or list results,
  including those within a compound entry or hierarchy selection, should have
  `partialName` set to `TRUE` when a name is partially-resolved. Meerkat DSA
  will only set `partialName` for the base object, unless
  `separateFamilyMembers` is used, in which case all members of the family will
  be marked accordingly.
- Permission to read the entry and the attribute types and values of the new RDN
  are required for renaming an entry. This prevents information disclosure where
  a nefarious user could attempt to discover values present in the entry by
  seeing which newRDN choices come back with a "no such values" error.
- The X.500 specifications demand that, if a change or removal of a subschema or
  DIT structural rule results in a change in the governing structural rule of
  any entry in the subschema, every entry within the subtree beneath that entry
  downwards until autonomous administrative points must have their governing
  structure rules recalculated. Meerkat DSA does not update governing structure
  rules automatically, because it could mean that potentially millions (or even
  billions, depending on how big the directory gets!) of entries would be
  affected. With Meerkat DSA, administrators must manually kick off a
  recalculation of an entry's governing structure rule. This can be done by
  performing a modifyDN operation that 'renames' an entry to its exact same name
  on every entry, starting from the immediate subordinates of any affected entry
  downwards until you reach autonomous administrative points or subschema
  administrative points. Note that, whenever an entry is made into an autonomous
  administrative point or subschema administrative point, or whenever such an
  administrative point has a DIT structure rule added, removed, or modified in
  its subschema, its governing structure rule will be automatically
  recalculated; this does not recurse downward automatically.
- When a subentry is added below an administrative point that is also a context
  prefix, the superior DSA's operational binding (if one exists) is updated.
- The Root DSE may not be modified.
- The information selection of a read or search operation is not evaluated against the
  selection of information that is shadowed for a shadow DSE. Meerkat DSA
  will simply return whatever it has.
- When using the `removeValues` change from the `modifyEntry` operation, the
  presence of the values to be removed will not be checked. Whether they exist
  or not, this change will succeed. One benefit of this is that we do not have
  to worry about accidentally disclosing to users which values exist and do not
  exist for an entry by returning a different error when they do exist.
- When using the `alterValues` change from the `modifyEntry` operation, `Modify`
  permission is also required for the values that are to be replaced. This is
  more strict than the specification.
- Default context values are not used exactly as specified in X.501 (2016),
  Section 13.9.2. If the context is required by context use rules, and if the
  context of that type is not supplied, a default value can "fill the gap," but
  beyond that, default context values are not used. This is because the verbiage
  of the section 13.9.2 is unclear.
- ITU Recommendation X.501 (2016), Section 14.10 states that, when a
  hierarchical parent is removed, its children are to be removed from _the_
  hierarchical group. The specification does not make it clear whether they
  should now belong to separate hierarchical groups with themselves at the top
  or if we should recursively remove all hierarchical group attributes for all
  hierarchical descendants. Meerkat DSA puts the children in their own separate
  hierarchical groups. It is not clear whether this is a deviation from the
  specification at all. This was chosen because it is the most performant,
  easiest to implement, and preserves potentially a lot of work from accidental
  deletion.
- Meerkat DSA does not throw an error if a search or list operation returns a
  null result (a result with zero entries or RDNs).

## The "Never Contributing" Bug

X.511 (2016), Section 7.13 states that:

> If the filter used is the default filter (and : { }), then all members of a
> family grouping shall be marked as participating members, but not as
> contributing members.

This is a problem, because `familyReturn` defaults to `contributingEntriesOnly`,
which means that _nothing_ will be returned even though the compound entry as a
whole matches `and:{}`. In other words, if the default search filter and
selection are used, compound entries will be entirely hidden from results if the
X.500 specifications are observed strictly.

This was probably not intentional, so I reported it. In early January of 2022.
Until I get clarification, Meerkat DSA will mark every entry as a contributing
member if there is a match, but no identified contributing members.

## Other Deviations

There are other deviations that haven't been mentioned here. Most deviations
are the frequency of automated updates to operational bindings. Meerkat DSA
updates operational bindings more frequently than is required by the
specifications. This should not be of significance more the vast majority of
users, and is probably desirable.
