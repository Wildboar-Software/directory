# Authorization

Meerkat currently only supports the Basic Access Control and Simplified Access
Control schemes defined in
[ITU Recommendation X.501](https://www.itu.int/rec/T-REC-X.501/en). Future
versions may implement:

- Rule-Based Access Control
- A "points-based" access control scheme
- An "OpenLDAP-like" access control scheme

This documentation will not discuss how Basic Access Control or Simplified
Access Control works; only the implementation-specific details that apply to
Meerkat DSA.

## Enabling Access Controls

Access control does not exist in Meerkat DSA (and the directory as a whole) by
default. It must be configured. For Meerkat DSA to observe access controls for a
given Access Control Specific Area (ACSA), the following must be in place:

1.  There must be an administrative point defined with an `administrativeRole`
    attribute value of `id-ar-autonomousArea` (2.5.23.1).
2.  There must be an administrative point defined with an `administrativeRole`
    attribute value of `id-ar-accessControlSpecificArea` (2.5.23.2). The entry
    used for this administrative point may be the same as the entry used for the
    autonomous administrative point. (An administrative point may have multiple
    roles.)
<!-- 3.  There must be at least one attribute value for `subentryACI` in the access
    access control administrative point to regulate who can modify access
    control subentries.
    - Rationale: if there is no access control defined for
      subentries, there is no point in even checking access control within the
      ACSA, because anybody could just change the subentries themselves to
      change the access controls! -->
<!-- 3.  There must be either an `entryACI` attribute value on the administrative
    point, or a `prescriptiveACI` attribute value that applies to the
    administrative point, that allows administrators to at least browse the
    administrative point and modify its `accessControlScheme` attribute and to
    browse its subentries.
    - Rationale: if this is not done, once access control
      is turned on, administrators will be locked out of the entire ACSA,
      because there are no ACI items defined that grant them permission to it! -->
3.  The access control administrative point must have an `accessControlScheme`
    attribute value of `basicAccessControlScheme` (2.5.28.1) or
    `simplifiedAccessControlScheme` (2.5.28.2), depending on what you want.
    - Note that, if you use the `rule-and-basic-access-control` or
      `rule-and-simple-access-control` access control schemes instead, they will
      follow the semantics of the Basic Access Control and Simplified Access
      Control schemes; the "rule-based" aspects of these access control schemes
      will be ignored, however, because Meerkat DSA does not understand
      rule-based access control, and some access control is usually preferrable
      to none.

Note that the ACI items should be created before enabling access control. If
there are no ACI items defined at all, then _nobody_ is permitted to do
_anything_. It is possible for administrators to accidentally configure
rules that prevent even themselves from accessing their own DSA!

## Getting Locked Out

If an administrator gets locked out of Meerkat DSA by having misconfigured
access controls, it will have to be corrected by directly modifying the
database to achieve one of the following goals:

- To ensure that one of the conditions stated above for enabling access controls
  is no longer met, and thereby disable authorization for that ACSA entirely.
- To delete the offending ACI item.

The former option should be used when administrators don't know what they did
wrong, or when the ACSA does not contain any private information; it is quicker
and easier to just disable access control entirely, fix the problem, then
re-enable access controls once it is fixed. If administrators know which ACI
item is causing them to be locked out, the latter option may preferrable.

One way you can "delete" an ACI item is by changing the `active` column in the
`ACIItem` table in the database to `FALSE` for that ACI item.

### Disabling Access Controls

The easiest way to do this with minimal loss of data is to delete the
access control scheme attribute value from the `EntryAccessControlScheme` table.
The administrator will have to determine the ID of the entry that is the
administrative point for the ACSA so he can delete the correct access control
scheme value. It may be helpful to inspect the `EntryAdministrativeRole` table
to determine the ID of the offending administrative point.

Note that Meerkat DSA will have to be restarted for this change to take effect,
since the access control scheme may still be cached in memory.

### Deleting an ACI Item from the database

ACI items may be deleted from the `ACIItem` table.

Note that Meerkat DSA may have to be restarted for this change to take effect,
since the ACI items may still be cached in memory.

Another way you can "delete" an ACI item is by changing the `active` column in
the `ACIItem` table in the database to `FALSE` for that ACI item.

## Access Controls in Hierarchical Operational Bindings

When Meerkat DSA establishes itself as a subordinate DSA in a Hierarchical
Operational Binding (HOB), it will honor all administrative points that lie
within the naming context up until and including the closest Autonomous
Administrative Point (AAP). In other words, if a Meerkat DSA does not define its
newly minted context prefix to be an Autonomous Administrative Point (AAP), it
may be governed by the access controls (and other administrative controls) of
the superior DSA. To be clear, this is the correct behavior for an X.500
directory--not an accidental nuance of Meerkat DSA. Unless you are okay with
the superior DSA having _complete control_ over the subordinate naming context
that you establish with it, you should define each new context prefix to be
an Autonomous Administrative Point (AAP) and each should be an access control
administrative point with the desired access controls configured.

Everything stated above will also apply to Non-Specific Hierarchical Operational
Bindings (NHOBs), even though these are not yet supported in Meerkat DSA.

To clarify with an example, let's say that the administrator for C=US wishes to
establish your DSA as the owner of `C=US,ST=FL` and everything below it. He does
this by submitting an `addEntry` request to his DSA with `targetSystem` set to
your DSA, which triggers his DSA to attempt to establish an HOB with your DSA.
If you accept the hierarchical operational binding, the DSA for `C=US` will now
redirect (chain) all operations within the namespace `C=US,ST=FL` to your DSA.

If the administrator for `C=US` has defined an Access Control Specific Area
(ACSA) with `C=US` as the administrative point that makes `C=US,ST=FL,L=Tampa`
world-writeable, the DSA for `C=US,ST=FL` would still honor this configuration,
and permit all writes to `C=US,ST=FL,L=Tampa` even though the rule permitting it
is external and superior to your DSA. The creation of an
Autonomous Administrative Point (AAP) that halts the propagation of access
control rules (ACI items, for instance) from superior DSAs would prevent this
behavior.

## Recommendation Access Control

While DSA administrators will likely use their DSAs differently, there are a few
commonalities particular to access controls that almost all uses of X.500
directory services will find useful. For use common use cases, access controls
should be defined that:

- Allow administrators to administer.
- Allow users to change their password.
  - There are perfectly good arguments to _not_ allowing this, too. It may be
    preferrable to have secure system-generated passwords instead; in this case,
    administrators should implement access controls that _prevent_ users from
    modifying their passwords so that a service can do this on their behalf.
- Explicitly prohibit users from changing the passwords of others.
- Explicitly allow administrators to change the passwords of others.
- Allow users to read their entire entry.
  - This should include the child entries if the user's entry is a compound
    entry.
- Allow users to modify certain attributes of their entry.
  - For example, administrators may not want users to be able to change their
    `employeeID` attribute, but may want to allow users to change their
    emergency contact information as they please.
- Explicitly prohibit users from adding new entries, except within permitted
  subtrees.
- Explicitly prohibit users from modifying or deleting entries that they did not
  author.
- Carefully choose which users can modify `hierarchyParent` and
  `aliasedEntryName`, because these attributes could be used to initiate attacks
  against the directory (e.g. trying to exploit a bug in access control by
  using aliases or attempting to enumerate entries with timing attacks via the
  `hierarchyParent` attribute validation.)
