# Information Disclosure

There are innate limitations to the confidentiality of X.500 directory systems,
and there are even more limitations added by specific implementations, such as
Meerkat DSA. Certain aspects of Meerkat DSA may be used by nefarious users to
reveal information to which they would not otherwise have access.

The known information disclosures are listed below:

- If a user can read the DIT structure rules and the names of entries, they can
  determine their object classes. This is an innate limitation of X.500
  directories.
- Adding the `hierarchyParent` attribute to an entry can be used to discover
  the existence of entries and whether they are members of a compound entry.
  (See the database driver for `hierarchyParent`.) This is caused by Meerkat
  DSA, and not by the X.500 specifications. It is recommended that add
  permission to the `hierarchyParent` attribute only be granted to
  administrators or, at least, users that are permitted to know of the
  existence of every entry in the DSA.
<!-- - Schema that apply to the Root DSE will appear in `cn=subschema`, which is
  a hard-coded subschema subentry that only "exists" when queried directly
  (e.g. a search with a `baseObject` scope that specifically names
  `cn=subschema`). Though this entry is read-only, it will reveal all known
  attribute types and object classes to users that are authenticated. -->
- It is recommended that, for attributes that have some implied "default" value
  and which are sensitive, all entries should have this attribute with the
  default value(s) so that information disclosure vulnerabilities that reveal
  the mere presence of attributes cannot be used to determine their values.
- See Note 4 on page 11 of ITU Recommendation X.511 (2016 edition).
- `removeEntry` will display an `updateError` with problem
  `notAllowedOnNonLeaf` when the entry to be removed has non-child
  subordinates. This is supposed to happen, according to the X.500
  specifications, but it can only be used to reveal this fact if the user
  already has remove permissions on that entry.
- Attempting to remove a compound entry via a non-ancestor entry will yield an
  `updateError` with problem `notAncestor`, which can reveal that an entry is a
  compound entry, but this is not a big deal, because, by the point this is
  checked, the user already has remove permissions, can probably read the
  object class of the entry or its superior (which would have `parent`), and
  might be able to read `dseType`.

There are probably more information disclosures out there, but the most severe
ones are believed to be prevented and covered by tests.
