# Dynamic Entries

Meerkat DSA supports dynamic entries, as detailed in
[IETF RFC 2589](https://www.rfc-editor.org/rfc/rfc2589.html), but deviates from
the specification 

If an entry is marked as a dynamic object using the `dynamicObject` object
class (OID `1.3.6.1.4.1.1466.101.119.2`), but the created entry does not contain
the `entryTtl` operational attribute, the default value of the `entryTtl` will
be determined by the
[`MEERKAT_DEFAULT_ENTRY_TTL`](./env.md#meerkatdefaultentryttl) environment
variable. If unset, this value defaults to 60, meaning that dynamic objects
created without an `entryTtl` attribute that specifies otherwise will be
automatically deleted after one minute.

## Deviations

The Meerkat DSA implementation of dynamic entries deviates from the
specification in two ways:

1. By allowing the `entryTtl` operational attribute
   (OID `1.3.6.1.4.1.1466.101.119.3`) to be modified normally like any other
   attribute. The LDAP "Refresh Request" extension is not needed.
2. While the specification forbids the creation of non-dynamic entries under
   dynamic ones, Meerkat DSA does not forbid this. This is a feature: entire
   subtrees may be made dynamic by merely making their roots dynamic.

## Security

:::danger

The power to use dynamic entries is the power to delete them! If a user can
apply an `entryTtl` attribute value to an entry, it means that the entry can and
will be deleted after the specified time. A user's permission to delete an entry
is neither checked when the `entryTtl` attribute value is added, nor when the
value is modified or removed.

:::

A user's ability to create dynamic entries can be controlled normally by access
controls. Simply ensure that a user cannot create, modify, or delete `entryTtl`
attributes and/or values, and ensure that users cannot create objects with an
`objectClass` of `dynamicObject`.

## Recovery

If a dynamic entry is automatically deleted by accident, it may still be
recoverable, because Meerkat DSA does not actually remove the entry from the
database: it simply ceases to appear in results after the expiration time. If
you search in the database and find the wrongly expired entry, you can set the
`expiresTimestamp` column to `NULL`.

In the future, there will be extended operations that allow DSA administrators
to actually delete entries that are marked as deleted or expired. If such an
operation is used, expired entries may, in fact, be unrecoverable. But, again,
this is not currently implemented.
