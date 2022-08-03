# Architecture

## Representation of the Distinguished Names in Persistent Storage

Directory names do not lend themselves to easy storage and searching in a
traditional database, because the same attribute values may be encoded in
multiple different ways. For instance, strings may be constructed, defaulting
fields of constructed types may be omitted or included, and different types
of length encoding (definite form and indefinite form) may be used. This means
that, in many cases, values can only be stored in the database, but must be
extracted to be evaluated in memory using more sophisticated functions that
no database provides.

This differs from how OpenLDAP represents distinguished names when using the
SQL backend: the distinguished name is treated as a string and used as a
materialized path.

## Why Not a Document-Oriented Database?

I wanted Meerkat DSA to support multiple different databases, which I thought
I would be able to do using Prisma. However, it turns out that Prisma does not
lend itself to multiple different databases very well. This part just turned
out to have been a mistake.

However, I also wanted Meerkat DSA to store data in a form that could be
analyzed, exported, and inspected using popular tools. Databases such as
MongoDB would have been fine (great, even) for storing and searching directory
data, but the tooling around them is limited. There is a lot of existing tools
for analyzing data that is stored in relational databases.

That said, I still wish that I had used MongoDB. MongoDB's dynamism lends
itself better to representing attribute values of multiple different types.
In fact, if MongoDB were used in the first place, attribute drivers would be
almost entirely unnecessary.

## Why do Materialized Paths end with a period?

If they did not, searching for `1.2.3` would also turn up results for `1.2.31`.

<!-- ## Search Filtering

Search filtering functions must take the entire family grouping at a time,
because  -->

## Functional Programming

Meerkat DSA uses almost exclusively functional programming. Almost every
function takes a "context object." The context object is like the context
object in Functions-as-a-Service (FaaS) functions, like AWS Lambda functions or
Azure Functions. This context object has pretty much everything that any
function would need implicitly within a directory application: logs,
configuration, telemetry, all current connections, the database client, and
knowledge of all directory schema.

This looks sort of like a reducer pattern, but it is not quite, since not every
function mutates or even uses the context object. It is used sort of like what
I would call "poor man's dependency injection." Rather than resolving the
dependencies at run time, the context object pattern is type-safe at
build-time.

The advantage of this pattern is that it makes functions "pure" (or at least
closer to it). You don't need to import the logger, for instance, it is passed
into every function as an argument via the context object. It is also very easy
for every function to get access to whatever it needs. Almost every function
has access to the context object and can pass it down to functions that it
calls.

Examples of this pattern can be seen in OpenSSL and Postfix.

Another advantage of this pattern is that, configuration information is
sometimes not available in an immediately useful format. Take X.509 certificates
for example. They are not stored in a format that can be copied-and-pasted
directly into memory: they have to be decoded / deserialized. To add to this,
they are often PEM-encoded too. If every function directly read configuration
from a configuration file, every usage of a given X.509 certificate would
require removing the PEM encoding, then parsing the resulting DER encoding.

Instead, this "context object" pattern abstracts away the configuration from the
medium in which it is stored. Configuration in the context object is always
kept in its most readily useful form. On start up, this context object is
populated once from the configuration source, whether it is a file, environment
variables, or something else.

## X.518 Procedures

Almost all of the procedures in ITU Recommendation X.518 are represented as a
function in `apps/meerkat/src/app/distributed/`. Meerkat DSA tries to implement
these procedures as they are specified, even if contemporary coding practices
would lend themselves to different implementations. This is most notable in the
Find DSE procedure, which was implemented the way I imagine such a
procedure would be implemented in C rather than in TypeScript.

The benefit of doing this is the avoidance of bugs resulting from incorrect
implementation and that most of the code in `apps/meerkat/src/app/distributed/`
is effectively "already documented" by the steps of the procedures defined in
ITU Recommendation X.518.

## Why target ES2019?

As of the current version of Nx and/or Webpack I am using, optional chaining
gets _removed_ from the transpiled output if you use ES2020 or higher as your
build target. I think this should be fixed with an update to the latest version
of Nx.
