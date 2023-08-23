# Authorization

Meerkat supports all access control schemes defined in the X.500 specifications,
meaning:

- Basic Access Control
- Simplified Access Control
- Rule-Based Access Control
- Rule-and-Basic Access Control
- Rule-and-Simple Access Control.

Future versions of Meerkat DSA may introduce new access control schemes, like:

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
    attribute value set to the object identifier of the access control scheme
    you want to use in that administrative area.

:::caution

Note that the ACI items should be created before enabling access control. If
there are no ACI items defined at all, then _nobody_ is permitted to do
_anything_. It is possible for administrators to accidentally configure
rules that prevent even themselves from accessing their own DSA!

:::

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
- Explicitly prohibit users from modifying the `clearance` attribute.

## Access Control in a Distributed Environment

Meerkat DSA makes access control decisions based upon local information, but, in
a distributed environment, authentication information may come from other DSAs.
How this authentication information itself is authenticated is a topic in its
own right, which is documented
[here](./distributed.md#authentication-of-distributed-operations).

## Setting the Local Qualifier of a Client

The meaning of the `localQualifier` component of the `AuthenticationLevel` as
described in [ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
Section 18.4.2.3, is left to DSA implementations. In Meerkat DSA the
`localQualifier` is given a value depending on the level of transport security
that is used to protect a connection with a client.

The `localQualifier` is a simple integer, and Meerkat DSA adds "points" to this
integer, depending on configuration. A different number of points may be granted
for more or less secure transports. For instance, TLSv1.3 could be (and usually
should be) granted more `localQualifier` "points" than SSLv3, which is
completely insecure (but better than nothing).

The environment variables that are used to configure the `localQualifier` are:

- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3`](./env.md#meerkatlocalqualifierpointsforusingssl3)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS`](./env.md#meerkatlocalqualifierpointsforusingstarttls)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS`](./env.md#meerkatlocalqualifierpointsforusingtls)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0`](./env.md#meerkatlocalqualifierpointsforusingtls10)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1`](./env.md#meerkatlocalqualifierpointsforusingtls11)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2`](./env.md#meerkatlocalqualifierpointsforusingtls12)
- [`MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3`](./env.md#meerkatlocalqualifierpointsforusingtls13)

## Rule-Based Access Control

Rule-Based Access Control is intentionally vague as to how a clearance value is
compared to a security label: it is open-ended by being left to the security
policy to determine how this comparison is performed. This means that Meerkat
DSA must use a means for mapping a security policy identifier (which is an
object identifier) to a function that is used to compare the user's clearance
with the security label.

### Controlling Access to Entries

The X.500 specifications state that access to a given entry is denied under
Rule-Based Access Control when access to all attribute values is denied.
However, enforcing this would be devastating from a performance perspective.
When performing a `list` operation, Meerkat DSA would have to check what might
be thousands of attributes per entry. Instead, Meerkat DSA denies access to
an entry if access to any of its distinguished values are denied. This is much
faster, since usually only one single value is evaluated, and it is technically
more strict from a security perspective.

### Where Clearances Come From

Clearances may be associated with a user in three ways:

1. By being present as attribute values of the `clearance` attribute in the
   entry within the bound DSA, so long as the
   [`MEERKAT_GET_CLEARANCES_FROM_DSAIT`](./env.md#meerkat_get_clearances_from_dsait)
   environment variable is not set to `0`.
2. By being present as attribute values of the `clearance` attribute in the
   X.509 public key certificate asserted by the user upon successful strong
   authentication, so long as the
   [`MEERKAT_GET_CLEARANCES_FROM_PKC`](./env.md#meerkat_get_clearances_from_pkc)
   environment variable is not set to `0`.
3. By being present as attribute values of the `clearance` attribute in the
   attribute certificate asserted by the user upon successful strong
   authentication, so long as the
   [`MEERKAT_GET_CLEARANCES_FROM_ATTR_CERTS`](./env.md#meerkat_get_clearances_from_attr_certs)
   environment variable is not set to `0`.

### Labelling Authorities and Clearance Authorities

Security labels are signed data structures. Their signatures are generally
produced by the public keys of "labelling authorities." Clearances do not have
to be signed, since they can be taken from the DSAIT, but generally, they should
be signed by being presented in an X.509 public key certificate or attribute
certificate asserted by a user during strong authentication. Thus, for both
verifying security labels and clearance values, there is a need for Meerkat DSA
to have a configurable set of trust anchors explicitly for the purposes of
labelling and clearance issuance.

This can be done by pointing to Trust Anchor List files by using the
[`MEERKAT_CLEARANCE_AUTHORITIES`](./env.md#meerkat_clearance_authorities) and
[`MEERKAT_LABELLING_AUTHORITIES`](./env.md#meerkat_labelling_authorities)
environment variables.

If either of these are unset, they default to the trust anchors used for
signing.

### The Simple Security Policy

For the sake of easy use of the Rule-Based Access Control (RBAC), Meerkat DSA
comes with a security policy built-in, called the "simple security policy."
It's object identifier is `1.3.6.1.4.1.56490.403.1`. This security policy does
nothing with security categories, and permits access to the labeled attribute
value if the clearance level is greater than or equal to the clearance level
required by the labeled attribute value. Unless you plan to make use of security
categories, this should be a sensible default for most use cases.

The Simple Security Policy treats the "unmarked" classification as being of
higher sensitivity than "unclassified," but of lesser sensitivity than
"restricted." The rationale for this is that "unclassified" explicitly names
something as having the most relaxed classification, whereas "unmarked" is an
absence of information, but it may also indicate that the labeled thing is not
important enough to have labeled properly in the first place, hence, it lies
between total declassification and the "restricted" classification.

The Simple Security Policy does not treat reads and writes differently: if
access is granted to read an entry, access is also granted to modify an entry.
There is an exception, however: any modification operation that affects a value
with security labels MUST be performed with top-secret clearance.

:::note

If no security policy is listed in the security label or clearance, it defaults
to the Simple Security Policy described above.

:::

### Custom Security Policies

If you want to define your own security policies, you may do so in the
[init script](./env.md#meerkat_init_js) like demonstrated below.

```javascript

// This is the object identifier of your security policy.
const your_security_policy_id = "1.3.6.1.4.1.99999.1";

// The is the Access Control Decision Function (ACDF) for your security policy.
// This determines how a clearance value compares to a security label.

const your_custom_acdf = (
    ctx, // Context
    assn, // ClientAssociation // This has a clearance field.
    target, // Vertex
    signedLabel, // SignedSecurityLabel
    value, // ASN1Element
    contexts, // X500Context[]
    permissions, // number[]
): boolean => {
    const label = signedLabel.toBeSigned.securityLabel;
    const classification = Number(label.security_classification ?? SecurityClassification_unmarked);
    if (classification === SecurityClassification_unclassified) {
        return true; // If unclassified, the user may always see it.
    }
    let highestClearanceLevel: number = 0;
    // Note that a client may be associated with multiple clearance values.
    // How you handle this is up to you.
    for (const clearance of assn.clearances) {
        if (!clearance.policyId.toString() !== your_security_policy_id) {
            // We ignore clearances that do not pertain to this security policy.
            continue;
        }
        const clearanceLevel: SecurityClassification = (() => {
            if (!clearance.classList) {
                return SecurityClassification_unclassified;
            }
            else if (clearance.classList[ClassList_topSecret] === TRUE_BIT) {
                return SecurityClassification_top_secret;
            }
            else if (clearance.classList[ClassList_secret] === TRUE_BIT) {
                return SecurityClassification_secret;
            }
            else if (clearance.classList[ClassList_confidential] === TRUE_BIT) {
                return SecurityClassification_confidential;
            }
            else if (clearance.classList[ClassList_restricted] === TRUE_BIT) {
                return SecurityClassification_restricted;
            }
            else if (clearance.classList[ClassList_unmarked] === TRUE_BIT) {
                return SecurityClassification_unmarked;
            }
            else {
                return SecurityClassification_unclassified;
            }
        })();
        if (clearanceLevel > highestClearanceLevel) {
            highestClearanceLevel = Number(clearanceLevel);
        }
    }
    // Just to make sure that classification cannot be given a large,
    // illegitimate value to make a protected value universally inaccessible.
    if (highestClearanceLevel == SecurityClassification_top_secret) {
        return true;
    }
    return (highestClearanceLevel >= classification);
}

async function init(ctx) {
  // Here, we associate the policy ID with the ACDF
  ctx.rbacPolicies.set(your_security_policy_id, your_custom_acdf);

  // This is just logging, just to show you that you can do this. :)
  ctx.log.info("Added my own custom security policy");
}

export default init;
```

The Access Control Decision Function (ACDF) associated with the security policy
takes several arguments associated with the user, attribute value, contexts, the
DSA itself, and returns a `boolean`: if this `boolean` is `true`, it means that
the user's access request was granted; if `false`, the requested access is
denied.

### Chaining Rule-Based Access Control

The clearances associated with a user are not preserved across the DSA boundary:
they are not chained. With Basic Access Control and Simplified Access Control,
the user's authentication level can be relayed to other DSAs, but there is no
defined mechanism for a users clearances to survive across chaining. As such,
Rule-Based Access Control is only viable for regulating access within a single
DSA.

For security reasons, only DAP and LDAP associations will have any clearances
associated: this is so that downstream DSAs do not make access control decisions
on the basis of the upstream DSA's clearances rather than the originating DAP
requester when chaining is used.

### Users with No Clearance

Users with no clearances at all will automatically be given access only to
attribute values having a security label with a class of `unclassified`.

### Invalid Hashes, Untrusted Labels, and Untrusted Labelling Authorities

In Meerkat DSA, an invalid hash, invalid signature, or untrusted labelling
authority having issued a security label will make the security label
inaccessible to all users not having top-secret clearance for the identified
security policy.

:::info

When establishing the above behavior, I had--broadly speaking--two choices:

1. Generally allow access (with possible caveats) when a security label is
   invalid for some reason.
2. Generally deny access (with possible caveats) when a security label is
   invalid for some reason.

If I chose option 1, there would be a risk of disclosing classified information
as a result of accidentally malformed labels or bugs in the DER encoding,
hashing, or signing. If I chose option 2, there would be a risk of nefarious
users either creating illegitimate labels or copying otherwise legitimate
labels from correct values to cripple directory access to legitimate users.

I chose option 2 for these reasons:

1. Not all malformed labels are malicious; some are produced by accident, and
   the risk of accidentally disclosing classified information could be much
   greater than temporarily having lost access to part of the directory.
2. Since labelled values are generally going to be created by people that
   already have clearance for that information, there would be no immediate
   feedback to indicate that something was wrong if access were granted for
   invalid labels; the value would still appear to that user as expected. By
   restricting access for invalid labels, there may be a visible consequence
   that users can seek to rectify.
3. There is no real way to know if a label is valid until you submit it to
   Meerkat DSA. This means that users would have to add the classified
   information to Meerkat DSA, then determine if the labels are valid after the
   fact being checking if the classified information is disclosed to
   unauthorized users.
4. At least with the Simple Security Policy, modifying security labels in the
   first place is only granted to users with top-secret clearance.

:::

Note that, as a result of the above, changing the configured
[labelling authorities](./env.md#meerkat_labelling_authorities) could invalidate
existing security labels, making values "disappear" to users that would
otherwise have access to them.

### Unrecognized Policies

When Meerkat DSA encounters an unrecognized policy on a security label, it
only grants access to the protected value if the label indicates that the
item is `unclassified` or if the user has top-secret clearance.

### Multiple Security Labels

[ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en)
mandates a limit of one security label context per value. Meerkat DSA does not
enforce this. The behavior of Meerkat DSA in the presence of multiple security
labels for a given value will remain undefined, but it usually results in the
first one being used exclusively, and the remainder ignored.
