# Shadowing

Meerkat DSA supports all features of shadowing as described in
[ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en), as
well as the establishment of shadowing through the use of the
Directory Operational Binding Management Protocol (DOP). The Directory
Information Shadowing Protocol (DISP) is fully supported, and can use IDM, ITOT,
IDM-over-TLS, and ITOT-over-TLS as transports (like the other directory
protocols). Meerkat DSA is capable of acting as a shadow supplier and consumer
at the first-level and otherwise.

## Establishment

Shadow operational bindings may be proposed like other operational bindings
via the use of
[Relayed Operational Bindings](./opbinding.md#relayed-operational-bindings).
Shadow operational bindings proposed by third parties may be agreed to via the
[Web Administration Console](./webadmin.md).

## Update Behavior

If Meerkat DSA is acting as a shadow supplier, upon first establishing a
shadowing agreement, Meerkat DSA will provide a total refresh to its consumer.
Likewise, when acting as a consumer, Meerkat DSA will request a total refresh
for the first update. Thereafter, Meerkat DSA produces and requests only
incremental updates, with a few exceptions:

- After a shadowing agreement modification, a total refresh is performed.
- Secondary shadows always receive total refreshes for every update.
- If a previous total refresh did not succeed, another one will be performed.

## Secondary Shadows

Meerkat DSA supports secondary shadows, however, secondary consumers will only
receive total refreshes as stated above. This can be extremely expensive in
terms of performance, and it should only be used for a small number of entries.

:::info

The rationale for this is that it is difficult to determine whether the shadow
update from the master DSA overlaps with the the shadowed area of the secondary.
If there is overlap, the attributes, values, and contexts received from the
master may not be the same as those provided to the secondary. This problem gets
very complicated. Future versions of Meerkat DSA will likely improve upon this.

:::

## Timing Requirements and Behavior

Shadowing updates can be configured to occur at regular intervals in the
shadowing agreement, and they may be allowed to being at a configurable amount
of time after the start of the interval (the "window"). Meerkat DSA will allow
nearly any value (measured in number of seconds) for these intervals and windows,
but aberrant behavior is likely to be observed if the frequency of shadow
updates is less than one minute.

:::tip

It is strongly recommended to use shadow update intervals of no less than one
hour, and shadow window sizes of no less than 30 minutes. Replicating a large
amount of data could take a very long time to insert into the database!

:::

Directory operations must eventually time out to ensure that resources are
freed up when correspondent DSAs become non-responsive. For the purposes of
determining the timeouts used for the `updateShadow` operation, Meerkat DSA
measures the time taken to prepare the shadow update locally, multiplies it by
ten, and restricts this value between 30 seconds and the configured update
interval. This means that, if it takes 1 second to locally prepare a shadow
update, Meerkat DSA will give the remote DSA 30 seconds to respond to the
`updateShadow` operation before timing out; if it takes 30 seconds to produce
a shadow update, Meerkat DSA will grant the consumer 300 seconds to respond to
the `updateShadow` operation, so long as the update interval is not smaller than
this number.

## Loops

It is possible to create shadows that result in an infinite loop using the
`onChange` update mode. In other words, if an entry changes, a master DSA may
update its shadow, and its shadow may have another shadow that it updates
`onChange`. This secondary shadow may have the master DSA as its shadow consumer,
which would cause an infinite loop of updates.

Meerkat DSA has no defenses against this scenario. Administrators should only
accept operational bindings from trustworthy parties. It falls upon
administrators to ensure the sanity of shadowing agreements before agreeing to
them.

## Role Reversal

Meerkat DSA does not support a shadow consumer becoming a shadow supplier
through a modification of a shadow operational binding. The shadowing roles may
never be reversed. The use of the DISP operations are policed for their
origination by the appropriate party in a shadow operational binding.

## Modification

Under the hood, the modification of shadowing agreements has almost the same
effect of terminating a shadowing agreement and creating a new one. The only
exception, as stated above, is that the roles may not be reversed. However, the
update modes may be reversed, meaning that a supplier-initiated shadowing may
become consumer-initiated and vice versa.

## Termination

When shadow operational bindings are terminated, the shadow DSEs that remained
are not discarded. It is up to the administrator of the DSA to manually remove
these, if that is desired. Otherwise, they will continue to work as shadow DSEs,
and never receive updates until an applicable shadowing agreement is resumed.

## Information Planes and Alternative Relative Distinguished Names

The concepts of information "planes" and "alternative relative distinguished
names" introduced seemingly out of nowhere in ITU Recommendation X.525 are not
supported. Relative distinguished names must be unique for all DSEs within
Meerkat DSA, even if they are shadows.

## Overlapping Shadowed Areas

Meerkat DSA neither supports the use of overlapping shadowed areas, nor
verifies that all current shadowing agreements do not overlap with each other.
**It is the responsibility of the administrator to ensure that shadowing
agreements do not overlap.**

By "overlapping shadowed areas," this means overlap of entries specified by the
shadowing agreements subtree specification, even if the attributes or values
replicated do not conflict.

Note that refinement of said subtree using the `specificationFilter` can produce
shadowed areas that do not overlap; shadowed areas that are "interleaved"
through the use of object class refinement--in other words, those shadowed areas
that would overlap but for the use of the `specificationFilter`--should be free
from conflict. For example, there should be no problem if one shadowing
agreement replicates all entries of object class `person` and another replicates
all entries of object class `country` for an otherwise identical subtree
specification.

:::caution

It is still strongly recommended to avoid using overlapping shadowed areas. The
use of overlapping shadowed areas has not been tested at all. If overlapping
shadowed areas are used at all, it would likely be less error-prone to replicate
from different context prefixes or base entries at least.

:::

:::info

The reason that overlapping shadowed areas are not supported is that it is
unclear how to handle certain conflicting facts. For instance, if one DSA says
that an SDSE has SDSEType `nssr` and another says it has type `familyMember`,
what is to be done? There are too many combinations of SDSE types to validate
all of them and ensure that the shadowed DSE is coherent. In addition to this,
resolving which attributes and values are "complete" as a result of merging two
shadow updates from differing origins could be very error-prone.

On top of this, I believe overlapping shadowed areas is a strange edge case that
is not worthy of much support: there is supposed to be only one master DSA for
any given entry, so it would be strange for there to be multiple shadowing
agreements for the same area. If you really need this functionality, let me
know!

:::

## Performance

Shadowing will be much faster if context selections are not used and if either
all contexts or no contexts are supplied. Otherwise, little can be done to
speed up shadowing specifically.

## Network Disruption

Meerkat DSA's shadowing is resilient to network failure. When
acting as a shadow supplier, Meerkat DSA does not discard its queue of pending
incremental shadow updates until it receives a response to the `updateShadow`
operation from a consumer. If no update has ever succeeded, a Meerkat DSA
supplier will provide a total refresh. In either case, refreshes are
idempotent, meaning that duplicate entries, attributes, values, etc. should just
be ignored. If you experience a deviation on this front, it is a bug.

:::caution

This does not mean that Meerkat DSA is resilient to storage / database failures.
Depending on the configuration of your operating system or database, writes may
not really be persisted. Meerkat DSA responds to the `updateShadow` operation
when the database _claims_ that it has saved the data. What constitutes
"persistence" is a much greater philosophical topic; to learn more, search for
the terms "Write-Through" or "Write-Back."

:::
