# Database Administration

## How to Customize the Database Schema

Meerkat DSA uses Prisma as an ORM for interacting with the database. If you want
to change the database schema, you may do so using the normal methods for
updating Prisma schema and the Prisma client.

## Maximum entries

There is a maximum of 2.1 billion entries possible in the database. There is
almost no way any reasonable use case would ever use this many entries, and the
DIT should be spread across multiple DSAs long before this maximum is reached.

Note that entries are soft-deleted, meaning that they are not truly "deleted"
from the database, but merely marked as deleted with a deletion timestamp.

If you run low on storage space, deleting these soft-deleted entries can be
a good way to reclaim some space.

## Bulk Insertion

In Meerkat DSA, you can insert a large number of entries either through the
Directory Access Protocol (DAP) `addEntry` operation, or you can bypass the
Directory protocols entirely and insert entries directly into the database.

The former method is good for when you need to insert up to 100,000 entries or
so. The former method will ensure that you do not violate schema, object class
definitions, and access controls, but it will be much slower than the
alternative. If you use this method, you should ensure that the NodeJS runtime
is not using debugging and that the client you are using for the insertion is
not authenticating between each entry addition; in other words, you should
ensure that the same authenticated session is used to insert all entries.

Direct insertion into the database, on the other hand, will be much faster, but
you have a greater chance of screwing up and not inserting what you expected.

Note that entries will not be validated when they are read and searched--not
when they are inserted. This means that, for instance, if you have a violation
of the object class (such as by missing a mandatory attribute), Meerkat DSA will
be oblivious to this change, and there will usually not be any degredation of
functionality, but entries could still be technically incorrect. Be aware that
there _are_ cases where invalid entries could have catastrophic effects:
inserting an invalid access control subentry, for instance, could introduce a
severe security vulnerability!

### Bulk Insertion Mode

Bulk insertion mode can be enabled by setting the `MEERKAT_BULK_INSERT_MODE`
environment variable to `1`. This is a dangerous setting and should only be used
when the DSA is not exposed to the public Internet, because all access controls
are disabled. This will only make insertions very slightly faster.

According to empirical experiments, it seems that you should be able to insert
about 10 entries per second when using bulk insertion mode.

## Use of Different Database Types

In the future, Meerkat DSA may support Postgres and SQLite for the free version
and Microsoft SQL Server in the paid version. For now, only MySQL is supported.
MariaDB might be compatible, but a single test early on was not successful.
