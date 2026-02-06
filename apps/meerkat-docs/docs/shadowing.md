# Shadowing

Meerkat DSA supports all features of shadowing as described in
[ITU Recommendation X.525 (2019)](https://www.itu.int/rec/T-REC-X.525/en), as
well as the establishment of shadowing through the use of the
Directory Operational Binding Management Protocol (DOP). The Directory
Information Shadowing Protocol (DISP) is fully supported, and can use IDM, ITOT,
IDM-over-TLS, and ITOT-over-TLS as transports (like the other directory
protocols). Meerkat DSA is capable of acting as a shadow supplier and consumer
at the first-level and otherwise.

## Shadow Update Size Limits

There are no size limits on shadow updates imposed by Meerkat DSA, but shadowing
has only been tested with 20,000 entries. It is believed that Meerkat DSA should
work fine up to 100,000 entries and beyond.

## Establishment

Shadow operational bindings may be proposed like other operational bindings
via the use of
[Relayed Operational Bindings](./opbinding.md#relayed-operational-bindings).
Shadow operational bindings proposed by third parties may be agreed to via the
[Web Administration Console](./webadmin.md).

### "Replicate-Everything" Shadowing

An easier-to-setup alternative was designed for Meerkat DSA whereby you can set
an environment variable,
[`MEERKAT_REPLICATE_EVERYTHING_FROM`](./env.md#meerkat_replicate_everything_from),
to the URL of the master DSA, and the shadowing DSA, upon start up, will
establish a shadowing operational binding with the pointed-to master DSA and
replicate _everything_ from the master DSA. This is a coarse and sloppy
approach, but it is easy to set up.

To start, merely set
[`MEERKAT_REPLICATE_EVERYTHING_FROM`](./env.md#meerkat_replicate_everything_from)
in the shadowing DSA to the URL of the master DSA and start or restart your
shadowing DSA. Upon startup, it should establish a new shadow operational
binding automatically. This URL can be specially configured for working in a
Kubernetes StatefulSet.

You may also want to set the value of
[`MEERKAT_REPLICATE_EVERYTHING_FROM_AE_TITLE`](./env.md#meerkat_replicate_everything_from_ae_title).
If this is unset, Meerkat DSA will submit intentionally invalid credentials to
the "replicate everything from" DSA in an attempt to discover its AE title from
the bind error. The AE title is ultimately required to establish replication.

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

## Update Spill-over

Long-running shadow updates will not be terminated. They will run to completion,
and if they take so long that they spill over into another shadow update,
Meerkat DSA will not detect this or abort the shadow update. It falls on
administrators to ensure that shadow updates are not taking too long. In
general, it is recommended to make shadow update intervals no shorter than one
hour.

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

:::warning

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

:::warning

This does not mean that Meerkat DSA is resilient to storage / database failures.
Depending on the configuration of your operating system or database, writes may
not really be persisted. Meerkat DSA responds to the `updateShadow` operation
when the database _claims_ that it has saved the data. What constitutes
"persistence" is a much greater philosophical topic; to learn more, search for
the terms "Write-Through" or "Write-Back."

:::

## Usage of Shadowed Entries

The X.500 specifications are somewhat vague as to how to validate whether the
locally shadowed information can satisfy a request, and therefore, whether a
shadow DSA should respond to the request, or chain it to the master DSA,
particularly as it relates to the `search` operation.

:::note

Meerkat DSA's rules for determining whether a request can be satisfied locally
can and will change throughout time, and in addition to this, the code
embodying these rules is very complex and likely to be buggy. What follows
should be considered to be _generally_ true.

:::

As heuristics for determining whether a Meerkat DSA shadow consumer will
consider its shadowed data "suitable" for fulfilling the request, the following
general principles apply:

- All modification operations always get chained to the master DSA.
- For shadowed information to be suitable, the target entry / entries must be
  present.
  - This is obvious for single-entry interrogation procedures, such as `read` and `compare`.
  - For `list`, all immediate subordinates must be replicated, but they do not
    have to have any specific attributes or values.
  - For `search` requests, only the base entry must be present if `baseObject`
    `search` is used.
    - Theoretically, a search could return the subtree of family members from a
      `baseObject` search. This implementation will assume that compound
      entries are always replicated as a unit.
  - All immediate subordinates under the base entry must be replicated if
    `oneLevel` `search` is used.
  - If `wholeSubtree` `search` is used, all shadowing agreements that apply to
    the searched area must use empty shadow subtrees (a `SubtreeSpecification`
    that specifies no `base`, `minimum`, `maximum`, `specificExclusions`, or
    `specificationFilter` of any kind). This is the only way to ensure that the
    shadowed area would contain all the same entries that the master DSA(s)
    would.
- In addition to this, the filtering and selection of attributes is considered:
  - As stated in the specifications, operational attributes never factor into
    deciding whether or not an entry is suitable, because they are always
    considered incomplete within shadowed DSEs. If you want authoritative,
    up-to-date operational attributes, query the master DSA.
  - For single-entry interrogation operations (e.g. `read` and `compare`), the
    entry will always be suitable if all attributes are replicated, as indicated
    by the shadow DSE's `attributesComplete` flag.
  - For `search`, the shadowing agreement is consulted to ensure that all
    filtered and selected attributes are replicated and complete.
  - Given the targeted nature of `compare`, the `compare` operation is extremely
    picky with respect to considering an entry suitable. If `noSubtypeMatch` is
    not provided as a service control and the entry is incomplete, the shadow
    DSE will not be suitable, because it cannot be known whether some unknown
    subtype of the asserted attribute type has been replicated.
    - For similar reasons, the target entry will be unsuitable unless the
      `dontMatchFriends` service control is used or all friend attributes are
      replicated as well.
- Determining entry suitability based on contexts is somewhat shaky. The code
  for determining if there is sufficient overlap between replicated contexts and
  asserted or requested contexts gets extremely complicated. As such, it is
  strongly recommended to always replicate all contexts in Meerkat DSA.
- In general, the more narrow the focus of an operation, the more picky Meerkat
  DSA's implementation of the Check Suitability procedure will be for
  determining whether the shadowed data is suitable. A `compare` operation will
  be extremely strict, whereas a `search` operation will be much more inclined
  to using shadowed data.

You can check the `performer` field of the responses to see whether the shadow
DSA or the master DSA responded. This will tell you whether or not the target
entry was determined to be "suitable" with respect to the request.
