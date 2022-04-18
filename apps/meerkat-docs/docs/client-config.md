# X.500 Client Configuration File

There can be a lot of options that go into performing a single X.500 directory
operation through the command-line interface. For this reason, Wildboar Software
has defined a file for persisting directory configuration.

## Location

Unless its location is changed via a command-line parameter, this file should be
located in the user's home directory, in a folder called `.config`, and in a
file called `directory.yaml` or `directory.yml` or `directory.json`. This is
true whether the user is on Windows, Mac OS, Linux, or some other operating
system that has a conception of a home directory. Where file systems are
case-sensitive, the file names should be lowercased, including the extensions.

## File Serialization

The X.500 configuration file should be serialized as YAML if its file name ends
with the extensions `.yaml` or `yml`, and it should be serialized as JSON if
its file name ends with the extension `.json`.

## Versioning

The X.500 configuration file specification is exclusively managed by Wildboar
Software. No other organizations shall claim to have defined a new version of
the X.500 configuration file format defined here, unless it is clear that
Wildboar Software has abandoned the specification and will never define a future
version.

Versioning follows [Semantic Versioning](https://semver.org/), and the first,
only, and current version as of this time of writing is `1.0.0`. This may be the
only version ever defined if it works perfectly for everybody's use cases.

## Values

### File Paths

File paths should use forward slashes as the file path delimiter, and clients on
systems that do not use forward slashes (such as Windows) should still translate
these delimiters to the system-specific delimiters for use.

### Distinguished Names

Distinguished names shall be encoded as a string via the procedures in
[IETF RFC 4514](https://datatracker.ietf.org/doc/html/rfc4514), but reversed so
that the relative distinguished name of the object immediately subordinate to
the root appears first.

:::note

In the X.500 specifications, distinguished names appear in order of decreasing
proximity to the root DSE. In LDAP distinguished names, this is reversed. Even
though the configuration file uses the procedures for "stringifying" a
distinguished name for LDAP, no such reversal should take place. In other words,
`c=US,st=FL,l=Tampa` would be correct and `l=Tampa,st=FL,c=US` would be
incorrect.

:::

## Data Structure

The format of the configuration file is inspired by the configuration file used
by the Kubernetes command-line interface, `kubectl`. If you have ever used this
file before, you should see some similarities. Let's start with the example:

```yaml
apiVersion: v1.0.0
kind: X500ClientConfig
metadata:
  name: main
  labels:
    client: x500-cli
  annotations:
    author: Jonathan M. Wilbur
current-context: localdev
preference-profiles:
  - name: main
    logLevel: debug
    sizeLimit: 1000
    timeLimit: 10
    attributeSizeLimit: 1000
    readOnly: false
    disable-start-tls: false
dsas:
  - name: localdev
    accessPoints:
      - urls:
          - idm://localhost:4632
        category: master
  - name: azure
    accessPoints:
      - urls:
          - idm://20.62.238.5:4632
        category: master
credentials:
  - name: azure
    credential:
      type: simple
      name: cn=admin
      password:
        unprotected: mypassword123
contexts:
  - name: localdev
    context:
      dsa: localdev
      preferences: main
  - name: azure
    context:
      dsa: azure
      preferences: main
```

:::note

The rationale for using a `kubectl` configuration-like format is that:

1. It made sense to copy some existing popular technology for the sake of the
   user's familiarity and ease of use.
2. There may have been a lot of trial-and-error and thought put into the
   `kubectl` configuration file format by Google when it designed the format. It
   was my assumption that this file format was well thought-out (and it does
   seem to work pretty well for Kubernetes usage), so it made sense to copy it
   so Meerkat DSA could benefit from Google's refinement.

:::

In a `kubectl` configuration file, you define the clusters you know of, all
credentials you have for any of them, and then you define _contexts_ which are
combinations of said credentials and clusters. The X.500 configuration file
works the same way, but with different objects: an X.500 configuration context
is a combination of a directory system agent (DSA), an optional credential, and
an optional preferences profile. Contexts are identified by a case-sensitive
name.

A DSA can be "composed" of multiple access
points, which may be masters or shadows. Each access point is associated with
at least one URL; the ordering of these URLs is important and the client MUST
attempt to reach each of these URLs in the order that they are given. A DSA is
identified by a case-sensitive name.

A preferences profile is a profile of... preferences. Rather than being
universal across all contexts, profile preferences allow you to have apply
different preferences to different contexts. A preference profile is identified
by a case-sensitive name.

### Fields

Here is a breakdown of what each field means.

| Field                            | Usage / Meaning                                                                                |
|----------------------------------|------------------------------------------------------------------------------------------------|
| `apiVersion`                     | The version of this configuration file format, always proceeded by `v`.                        |
| `kind`                           | Always `X500ClientConfig`.                                                                     |
| `metadata`                       | An object containing metadata about the configuration file.                                    |
| `current-context`                | The case-sensitive name of the currently-selected context.                                     |
| `preference-profiles`            | An array of preference profiles.                                                               |
| `dsas`                           | An array of known Directory System Agents (DSAs).                                              |
| `credentials`                    | An array of credentials.                                                                       |
| `contexts`                       | An array of configuration contexts.                                                            |
| `dsas.*.name`                    | A case-sensitive name for a DSA only used within this configuration file.                      |
| `dsas.*.accessPoints`            | An array of access points by which the DSA can be reached.                                     |
| `dsas.*.accessPoints.*.urls`     | An array of URLs for accessing a given access point, listed in order of descending preference. |
| `dsas.*.accessPoints.*.category` | `master`, `shadow`, or `writeableCopy` depending on what the DSA is.                           |
| `credentials.*.name`             | A case-sensitive name for a credential.                                                        |
| `credentials.*.credential`       | The actual credential itself, which may take on multiple different forms.                      |
| `credentials.*.credentia.type`   | The type discriminator for a credential. Usually `simple`, `strong`, or `sasl`.                |
| `contexts.*.name`                | The case-sensitive name of the context only used within this configuration file.               |
| `contexts.*.context`             | The context itself.                                                                            |
| `contexts.*.context.dsa`         | The name of the DSA for this context.                                                          |
| `contexts.*.context.credential`  | The name of the credential for this context.                                                   |
| `contexts.*.context.preferences` | The name of the preferences profile for this context.                                          |

### Preferences

Each preferences profile is a somewhat free-form object, except for the
following preferences. This list is subject to change. More preferences may be
added in future versions of this configuration.

| Preference           | Meaning                                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------------------|
| `logLevel`           | The logging level of the client, which can be `debug`, `info`, `warn`, `error`, or `silent`.                |
| `sizeLimit`          | A positive integer; the default `sizeLimit` supplied in `search` or `list` operations.                      |
| `timeLimit`          | A positive integer; the default `timeLimit` supplied in directory operations.                               |
| `attributeSizeLimit` | A positive integer; the default `attributeSizeLimit` supplied in directory operations.                      |
| `readOnly`           | A boolean indicating whether no write operations should be permitted.                                       |
| `disable-start-tls`  | A boolean indicating whether the client should refrain from upgrading the connection security via StartTLS. |

Note that some preferences may be overridden by command-line arguments or other
options specified in a user interface. For instance, if the command explicitly
calls for a high size limit than is present in the preferences profile, this
size limit should prevail. In many cases, a preference setting exists only to
define a sensible default.

### Credentials

The type of credentials used is determined by the `type` field of each
credential. Other than this field, the contents of a particular credential will
vary depending on the type of credential.

#### Simple Credentials

When defining a credential of type `simple`, the defined fields are `name` and
`password`.

`name` is the distinguished name of the object to which the client shall bind.

`password` can take on two forms, each of which is an object, and the keys of
this object are used to determine the form. If the key `unprotected` is used,
the password is stored in an unprotected form as a string as its value. If the
keys `algorithmIdentifier` and `hashValue` are used, then the password is
stored in a hashed form. `algorithmIdentifier` is an object with a single field:
`algorithm`, which an array of positive integers of the object identifier of the
hash algorithm used. `hashValue` is the hexadecimal-encoded hash of the
password produced by the algorithm specified in `algorithmIdentifier.algorithm`.

#### Strong Credentials

When defining a credential of type `simple`, the defined fields are `name`,
`keyPath`, `certPath`, and `attrCertPath`.

`name` is the distinguished name of the object to which the client shall bind.

The other keys are all paths on the local file system.

`keyPath` is a path on the local filesystem to a PEM-encoded PKCS #8 formatted
private key. Clients SHOULD also tolerate a binary PKCS #8 file, but this is not
required.

`certPath` is a path on the local filesystem to a concatenation of PEM-encoded
X.509 public key certificates in order of increasing proximity to the trusted
root.

`attrCertPath` is a path on the local filesystem to a concatenation of
PEM-encoded X.509 attribute certificates in order of increasing proximity to the
trusted root.

#### SASL Credentials

Credentials of type `sasl` currently have an undefined syntax.

### Creating and Editing

X.500 clients may update the `current-context` field of this file. Since there
may be multiple X.500 clients installed and used (even concurrently) on a
system, there shall be no requirement for clients to use this field to determine
which client they should access; client's MAY store the name of their
currently-selected context elsewhere.

- Read operations may prefer shadow DSAs.
- The ordering does not matter.
- `x500 config init`