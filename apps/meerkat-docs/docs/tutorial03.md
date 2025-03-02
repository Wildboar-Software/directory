# Tutorial 3: Add NHOBs and Subordinates

Non-Specific Operational Bindings (NHOB) allow multiple DSAs to share a
namespace immediately subordinate to an entry. This special entry that serves as
the immediate superior to this shared namespace is referred to as a
Non-Specific Subordinate Reference (NSSR). As a part of it's role as an NSSR, it
stores the exhaustive list of access points for the subordinate DSAs where all
immediate subordinates may be found.

In this tutorial, you will learn how to use the
[X.500 command-line interface](./x500cli.md) to set up an NHOB in your DSA.

There are two ways that NHOBs can be created in X.500 directories: from the
superior to the subordinate DSAs, or vice versa. In other words, the superior
DSA can solicit subordinate DSAs to share a namespace below one of its entries,
or a subordinate DSA can request to join such a namespace within a superior DSA.
We will review both here.

## Relayed Operational Bindings

Though the X.500 specifications formalize the means by which operational
bindings are established, modified, and terminated between DSAs, some
operational bindings have no defined procedures for being triggered by the
administrator. To create a normal Hierarchical Operational Binding (HOB), you
can use the `addEntry` operation with the `targetSystem` component, which
should trigger a DSA to establish a new Hierarchical Operational Binding.

This is NOT the case for an NHOB. There is no defined way in the X.500
specifications to induce a DSA to establish an NHOB with another DSA. For this
reason, Wildboar Software implemented a feature in Meerkat DSA that makes this
possible:
[Relayed Operational Bindings](./opbinding.md#relayed-operational-bindings).

:::info

You do not need to know how Relayed Operational Bindings work, but you should
know that this tutorial will only apply to Meerkat DSA because of this feature.

:::

### Client Setup

The use of Relayed Operational Bindings requires the DUA to use the _exact same_
signing key as is used by the DSA for signing the DOP request. This basically
informs the DSA that "I have permission to act on behalf of you, the DSA. I am
clearly an administrator because I possess your signing key." You will need to
obtain the signing key and certificate chain and
[configure your X.500 CLI](./client-config.md#strong-credentials) to use them.
This is only necessary for the commands that begin with `x500 dop`. Other
commands in this section can be executed using normal authentication.

## Scenario and Setup for Both Approaches

First, we create an entry. It could be a first level entry, but in our case, we
will add a deeper entry. This entry will represent the North American Directory
Form (NADF), which is a real organization that once existed long ago for
promoting the X.500 directory standards.

```bash
x500 dap add org 'c=US,o=NADF' --organizationName=NADF
```

We will pretend that this organization is a conglomeration of other
organizations (which might have been true). As such, for an organization to
formally join the NADF, they would have to have an entry of object class
`organization` beneath the NADF's entry in the DIT. We will make NADF an NSSR
in an NHOB (take some time to digest those acronyms if you need), so that
multiple DSAs can host the organization entries that are immediately subordinate
to the `c=US,o=NADF` entry.

We will refer to these two fictional subordinate DSAs by their AE-titles:

- `c=US,st=GA,l=Atlanta,cn=Atlanta DSA`
- `c=US,st=VA,l=Norfolk,cn=Norfolk DSA`

The root DSA will be: `cn=dsa01.root.mkdemo.wildboar.software`.

## Procedures for Superior-Initiated NHOBs

In Meerkat DSA, establishing the NHOB from the superior is a simple
one-line command:

```bash
x500 dop become nssr 'c=US,o=NADF' 'c=US,st=GA,l=Atlanta,cn=Atlanta DSA' --naddr=idms://dsa.atlanta.gov:44632
```

We can break down this command like so:

- `x500`: the name of the excutable
- `dop`: Directory Operational Binding Management subcommands
- `become nssr`: Establish a new NHOB by making a DSE an NSSR with respect to a subordinate DSA
- `c=US,o=NADF`: The entry that we want to become the NSSR
- `c=US,st=GA,l=Atlanta,cn=Atlanta DSA`: The AE-title of the subordinate DSA
- `--naddr=idms://dsa.atlanta.gov:44632`: At least one network address where the subordinate DSA can be reached

When this command is executed, the X.500 CLI will send a Relayed DOP request
to your local Meerkat DSA. Meerkat DSA will then modify this DOP request,
filling in details, re-sign it, and submit it to the DSA indicated.

The AE-title provided in the command above is required both for the DSA to
perform strong authentication and because the AE title is a required part of
the `AccessPoint` construct used in X.500 directories.

After you have ran this command, `c=US,o=NADF` will be an NSSR, and it will
search for its subordinates in one or more subordinate DSAs. If the subordinate
DSA is a Meerkat DSA instance, it will automatically add any non-existing
entries in the context prefix; so the subordinate DSA in this example will also
have `C=US,o=NADF`, but these will only be DSEs of type `glue`, `admPoint`,
`rhob`, etc. (unless they already existed as something else) as are usually
created by hierarchical operational bindings. This also means that you can add
entries beneath this prefix within the subordinate DSA now.

The command above may be run multiple times for the same NSSR. So even though
the name of the command is `x500 dop become nssr`, it will work fine even if the
targeted DSE is already an NSSR.

Let's say we add an entry **to the Atlanta DSA**, like so:

```bash
x500 dap add org 'c=US,o=NADF,o=Wildboar Software' --organizationName='Wildboar Software'
```

Now, when you use the `list` operation to list the subordinates of `c=US,o=NADF`,
your request will be continued--if permitted by access control and other
configuration--into the subordinate DSAs to obtain the complete list of all
subordinate entries. There is only `o=Wildboar Software` in our case.

```
$ x500 dap list 'c=US,o=NADF'
::::BEGIN LIST RESULT:::::
(Composed of the next 1 uncorrelated result sets)
:::::BEGIN LIST RESULT:::::
ALIAS DEREFERENCED: FALSE
PERFORMER: c=US,st=GA,l=Atlanta,cn=Atlanta DSA
SECURITY PARAMETERS
| NAME: cn=dsa01.root.mkdemo.wildboar.software
| TIME: Thu Apr 20 2023 08:19:39 GMT-0400 (Eastern Daylight Time)
| RANDOM: 11001001101111110110010001111000
| TARGET: 1
| OPCODE: 4
| ERROR PROTECTION: 1
SUBORDINATES:
#0001: - ! o=Wildboar Software

:::::END LIST RESULT:::::
:::::END LIST RESULT:::::

```

Behaviorally, this may seem just like a normal hierarchical operational binding,
but if you add more subordinate DSAs, your requests will fan out into each of
them in the process of resolving names or continuing list or search operations.

## Procedures for Subordinate-Initiated NHOBs

Joining an NSSR as a subordinate DSA is also a one-line command:

```bash
x500 dop join nssr 'c=US,o=NADF' 'cn=dsa01.root.mkdemo.wildboar.software' --naddr=idms://dsa01.root.mkdemo.wildboar.software:44632
```

Note that, in this case, you are binding to the subordinate DSA and therefore,
you will need to use the subordinate DSA's signing key and certificate chain
for signing the request.

After the above command completes, you should be get the same list results as
shown in the section above.

## Using the AddEntry operation to Add NHOB Subordinate Entries

You may also use the `addEntry` operation to add subordinates to an NHOB. In
Meerkat DSA, if the immediate superior of the new entry is an NSSR, and if the
`targetSystem` component of the argument is present and refers to one of the
access points named as a subordinate in a related NHOB, Meerkat DSA will chain
the `addEntry` operation to that subordinate, rather than creating the entry
locally or creating a hierarchical operational binding.

Continuing on our previous examples, you might do so like this:

```bash
x500 dap add org 'c=US,o=NADF,o=Dispatch.fm' \
  --organizationName='Dispatch.fm' \
  --target-ae-title='cn=dispatch.fm' \
  --target-naddr=idms://dsa01.dispatch.fm:44632
```

If `dsa01.dispatch.fm` already has an NHOB established with the superior DSA,
this entry will simply get added in this DSA, rather than establishing a new
Hierarchical Operational Binding (HOB).

## Terminating an NHOB

Terminating an NHOB is easy as well, if you can obtain the operational binding
identifier. Continuing on the previous example, if we assume that our root DSA's
operational binding established with `dispatch.fm` has an operational binding
identifier of `12345`, this command will terminate that operational binding:

```bash
x500 dop terminate '2.5.19.3' 12345 'cn=dispatch.fm'
```

The above command almost speaks for itself except for the `2.5.19.3`. This is
the object identifier of the NHOB operational binding type. The final argument
is the AE-title of the DSA with whom the operational binding shall be
terminated.
