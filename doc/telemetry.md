# Telemetry

The free edition of Meerkat DSA uses a lot of telemetry, and does not provide a
way for users to opt out (though you could block it somewhat easily if you do a
little digging on how it works). This is a small homage to pay to somebody that
just wrote a free and open-sourced X.500 DSA for you. The telemetry data
collected is owned by Wildboar Software.

Note that what follows is subject to change and is not warrantied. We could be
wrong about what follows. As a general principle, Meerkat DSA telemetry will not
include highly sensitive data or data that could become highly sensitive.

## What Data Is Collected

Meerkat DSA collects telemetry data on all DAP and DSP requests, and sends this
data back to "the mothership" _after_ the request is complete, thereby not
blocking the response on sending telemetry data. This data is extremely
granular. Meerkat DSA collects a _ridiculous_ amount of information about each
request, which includes (but is not limited to):

- Statistics relating to the host system, including:
  - The operation system
  - Memory and CPU status
  - The hostname
  - The uptime
  - License status
- Statistics relating to the connection, including:
  - IP address
  - TCP port
  - Transport and presentation layers
  - Authentication level
  - Outstanding operations and pagination
- Statistics relating to the request and response, including:
  - The operation code of the request
  - The error code of any errors
  - The attribute types (but not values) used in filters and selections
  - The context types (but not values) used in filters and selections
  - Statistics on the number of results returned from search and list operations
  - Statistics on paging
  - Statistics on continuation references, chaining, networking, etc
  - Statistics on security parameters (nothing sensitive is collected)

In addition to this, Meerkat DSA periodically creates a "database report" which
collects data including, but not limited to the following:

- Statistics on the number of entries
  - This includes categories, such as subentries, administrative points, etc.
- Statistics on the object classes of entries that are stored.
- Schema statistics, including:
  - Attribute types
  - Context types
  - Matching rules
  - Matching rule uses
  - DIT structure rules
  - DIT content rules
  - DIT context use rules
  - Name forms
  - Friendships
- Statistics on operational bindings
- Known access points

If request telemetry is tolerable, but the database reports are not, the latter
may be blocked by restarting Meerkat DSA before each report is sent. We will not
tell you how often that is or help you disable it, but if you look at the code,
you might be able to figure out how often to restart Meerkat DSA to effectively
prohibit database reports.

## What Data is Not Collected

Meerkat DSA does not collect any information regarding the `administerPassword`
or `changePassword` operations. (Technically speaking, Meerkat DSA does
_generate_ some relatively non-descript telemetry data, then discards it rather
than transmitting it.)

Meerkat DSA does not collect the names of entries, but does sometimes collect
the length of their distinguished names. (The utility of this is in determining
how deep the DIT is.)

Meerkat DSA also does not collect the contents of specific entries, but will
collect aggregate data that comes from entries. For example, a count of all
distinct object classes in use will be collected, but not which object classes
any particular entry has.

Statistics on passwords is never collected.

## Why This Data Is Collected

The telemetry data collected by Meerkat DSA primarily to provide support, bug
fixes, and improvements.

Here are some examples of how the data collected could help improve Meerkat DSA:

- The types of object classes stored can give us a hint as to whether Meerkat
  DSA is being used as a store of user information for an identity provider. If
  it turned out that Meerkat DSA were exclusively being used as such, we might
  try to prioritize features relating to security above other features, or we
  might try to discover why users don't use Meerkat DSA for other purposes.
- If we see an unexpected, large number of failed authentication attempts, it
  could tell us that the network is under attack by nefarious actors using
  brute-force methods. We can alert the known network of users and prioritize
  updates that stifle these attacks.
- Seeing search requests consistently return zero results may indicate that
  there is an issue with a matching rule implementation, which can be fixed.
- Collecting the operational bindings may be useful in constructing a "map" of
  the directory landscape. This data could be useful for identifying single
  points of failure in the network, establishing global first-level DSAs based
  on which DSAs are already popular, publishing reports and studies, and more.

Future versions of Meerkat DSA, where Meerkat is less buggy, might not collect
as much data, since the primary purpose of collecting this data is to provide
support and fix bugs.

## Bulk Insertion Mode

Telemetry is disabled when using Bulk Insertion Mode. Be sure to understand the
trade-offs regarding the use of Bulk Insertion Mode before enabling it to
circumvent telemetry: Bulk Insertion Mode disables all access controls and
most schema validation for `addEntry` operations.

## Prisma Telemetry

Prisma, which is the ORM that Meerkat DSA uses for interacting with the
database, uses its own telemetry.
Read [this documentation](https://www.prisma.io/docs/concepts/more/telemetry)
for information on how to disable Prisma's telemetry. As of this writing,
Prisma's telemetry may be disabled by setting the `CHECKPOINT_DISABLE` to `1`.

## Other Telemetry

There may be other telemetry collected by Meerkat DSA's dependencies or the
platform or database on which Meerkat runs. Wildboar Software and the makers of
Meerkat DSA offer no warranty on what telemetry is or is not collected from
these sources. Other than dependencies we ourselves have created, we do not have
control over telemetry collected by the dependencies or infrastructure.
