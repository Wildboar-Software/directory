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

## Performance Tuning

### Connection Pool Size

Empirical testing has not demonstrated any significant performance improvements
by editing the default connection pool, but it should be done anyway, to avoid
this being a problem in the first place. In a typical use case, where Meerkat
DSA is the only client to the backing database, its connection pool may be set
higher. This can be done by adding a `?connection_limit=##` query parameter to
the end of your `DATABASE_URL`, like so:

`mysql://root:example@localhost:3306/directory?connection_limit=40`

You'll want to set this number to more than `2*N + 1`, where `N` is the number
of CPU cores on the system where Meerkat DSA is running; if you set it equal to
or lower, you will likely hinder performance.

### Unix Sockets

The use of Unix Domain Sockets to connect to the database instead of TCP
likewise has shown little effect on performance, but if available, Unix Domain
Sockets should be preferred over TCP sockets. Unix Domain Sockets have much
lower latency and higher throughput than TCP.

They can be configured by adding the socket name to your `DATABASE_URL` like so:

`mysql://user2:asdf2@localhost/directory2?socket=/var/run/mysqld/mysqld.sock`

Obviously, you'll want to replace `/var/run/mysqld/mysqld.sock` with the real
path to the Unix socket.
