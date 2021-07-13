# Distributed Operations

Basically, if a request comes in for an entry that is not within a local naming
context, the DSA should first check if it has a cross reference for a DSA that
serves that naming context. If it cannot find one, it should read the superior
reference from its Root DSE and chain the request to the superior DSA. In this
implementation, this means calling `readLocalEntry()`, even if the entry does
not fall beneath any local naming context. If a result is returned and it falls
within the naming context, the DSA may serve it; otherwise, it might be a cross
reference, in which case, the DSA may chain a request directly to the cross DSA.

Locality will be determined by a function `isLocal()` that ascends the DIT,
searching for a DSE of type `cp` and not `shadow`. If the DSE is of type `alias`
it should be dereferenced; if the dereferenced DSE is of type `cp` and not of
type `shadow`, the named DSE shall still be considered local.

To add an entry to the DIT, it must either be of type `glue`, or it must be of
type `entry` and `cp` and not `shadow`, or it must be a descendant of a `cp`.

To configure your database for the naming contexts `C=US,ST=FL` and
`C=US,ST=GA`, you would need to:

1. Create the `C=US` DSE of type `glue`.
2. Create the `C=US,ST=FL` DSE of type `cp` and `entry`.
2. Create the `C=US,ST=GA` DSE of type `cp` and `entry`.

You do not need to create administrative points, but it is highly recommended.
