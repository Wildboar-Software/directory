# Setup

## Installation / Deployment

### Local

### Docker / Docker-Compose

### Kubernetes

## Database Setup

## DSA Initialization

When your DSA comes online, if there are no DITs, it creates a new default DIT.
If there are no entries within this DIT, your DSA will create a single root DSE.

In its initial state, you can only add entries that are:

- Of type `glue`, or
- Of types `entry` and `cp` (Context Prefix)

Other restrictions apply. Notably, neither may be of type `shadow`.

To use your DSA like normal, you will need an entry _somewhere_ in your DIT
that is of type `entry` and `cp`. Any such entry present in your DSA will
constitute a context prefix that your DSA considers local; in other words, this
vertex says "this entry and everything under it (until subordinate naming
contexts) is authoritatively held by this DSA." Once you have such an entry
present in your DSA, you will be able to add entries of other types under it
like normal.

You are not required to create an autonomous administrative point (AAP) (an
entry of type `admPoint` with an `administrativeRole` attribute having value
`id-ar-id-ar-autonomousArea`) within a single particular DSA, but it MUST be
present in at least one DSA that you own and control.

> WARNING:
> If you do not define an autonomous administrative point that is superior to
> every naming context your DSAs serve, you will implicitly allow superior
> naming contexts (potentially operated by other people / organizations) to
> control security policies of your DSA. Allowing somebody else to control your
> DSA like that is probably not what you intend! This could result in outages or
> unwanted information disclosures!

## Access Control

At this point, your DSA will be world-readable and world-writeable. If you do
not want this, you will need to implement access controls. To do this, you will
need to define an Access Control Specific Area (ACSA) that spans the entirety of
your autonomous administrative area. To do this, you will need to do these
things in this specific order (details to follow):

1. Create an administrative user.
2. Set a password for the administrative user.
3. Create an administrative point, then
4. Create access control subentries under this administrative point, then
5. Add the `id-ar-accessControlSpecificArea` value to the `administrativeRole`
   attribute of the administrative point, and set the `accessControlScheme`
   attribute of the administrative point.

   - `basicAccessControlScheme`
   - `simplifiedAccessControlScheme`
   - `rule-based-access-control`
   - `rule-and-basic-access-control`
   - `rule-and-simple-access-control`

> WARNING:
> If you create the administrative point with an ACSA role before creating the
> subentries, you might be locked out, unable to read or write anything including
> and below that administrative point! This is because an absence of Access
> Control Information (ACI) items, as would be present in subentries, indicates
> a denial of access. Creating the ACSA administrative point is the switch that
> turns access control on. Ensure you configure your ACI items in your ACSA and
> ACIA subentries are configured to allow you to continue to set up your DSA!

### Creating the administrative user

You will need to create a DSE of type `entry` that will represent the
administrator of the DSA. There are no requirements as to what object classes
this entry must have.

### Set a password for the administrative user

This administrator's DSE should have a password set through the
`administerPassword` operation, which will set a password for this entry. The
password SHOULD NOT be set using the `modifyEntry` or `addEntry` operation.

### Creating the administrative point

You may use an existing administrative point if you'd like, but, again, anything
in your DSA that is not enclosed by an ACSA admininstrative point will be
world-readable and world-writeable. This administrative point MUST NOT have the
`id-ar-accessControlSpecificArea` role value present in its `administrativeRole`
attribute (for right now).

### Creating access control subentries

You will need to create access control subentries beneath your soon-to-be
access control administrative point. These subentries contain Access Control
Information (ACI) items. These subentries shall:

- Have an `objectClass` attribute having a value `accessControlSubentry`.
- Have a `prescriptiveACI` attribute with values.

Defining what ACI items are here is outside of scope for this documentation, but
the ACI items that you define SHOULD:

- Allow administrators all permissions to all entries.
- Allow users to read and write to their own entries,
  - Including:
    - Changing their passwords
    - Deleting their entry
  - Excluding:
    - Modifying operational attributes
- Allow unauthenticated / anonymous users to only read non-sensitive entries and
  attributes, if any.

When defining ACI items, keep in mind that the server will apply a configurable
local qualifier to the calculated `AuthenticationLevel` for a user based on
whether the connection is secured through Transport Layer Security (TLS) or some
other means. The "points" that Meerkat assigns to a connection secured as such
is determined by the value of the environment variable
`AUTH_LEVEL_LOCAL_QUALIFIER_POINTS_FOR_TLS`. This environment variable shall
contain a reasonably-sized (not extremely large) integer.

The ACI items you define SHOULD be few in number, and, for performance reasons,
all ACI items within an ACSA SHOULD have distinct `precedence` values.

### Making the administrative point an access control administrative point

You should then define an access control administrative point. This can overlap
with your autonomous administrative point. This is a DSE of type `admPoint` that
has an `administrativeRole` attribute having value
`id-ar-accessControlSpecificArea`.

> WARNING:
> If you do not have access control administrative points defined, your DSA will
> be world-readable and world-writeable!

One this point exists, your access control will activate.

## Password Policy

## Subschema Administration

## Collective Attributes

## Default Context Assertions

## Name Resolution through Hierarchical Operational Bindings

### Subordinating to a Superior Naming Context

### Adding a Subordinate Naming Context

## Replication through Shadow Operational Bindings

## Extending the Schema

## Public Key Infrastructure

### Certificate Authority (Enterprise Edition only)

### Attribute Authority (Enterprise Edition only)

## LDAP Support

## Rate Limiting

## Telemetry

## Performance

## Security

### TLS

#### Direct TLS

#### TLS Reverse Proxy Configuration

### Subscription to Security Alerts

### Remote Circuit Breaker

- Will only be activated if a vulnerability could result in unauthenticated
  reads or writes.

## Monitoring

### Logging

### SNMP (Enterprise Edition only)

### CMIP (Enterprise Edition only)

## Integration

### Email LDIF (Enterprise Edition only)

### Email MFA (Enterprise Edition only)

### SMS MFA (Enterprise Edition only)

## Hooks

## Publication

## Wildboar Schema

## Troubleshooting

### Diagnostic Information Page

## Professional Support and Consulting
