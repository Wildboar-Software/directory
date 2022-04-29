# Tutorial 2: Hooking up Gitea with Meerkat DSA

In this tutorial, we will configure a [Gitea](https://gitea.io/) server to use
Meerkat DSA as a source of authentication. After this tutorial, you will be
able to add users to a Meerkat DSA instance and have them gain access to a
Gitea server automatically. These users will be members of a fictitious
organization named Foobar, Inc.

Gitea was chosen for this tutorial because it is one of the easiest applications
to start up with almost no configuration. In fact, merely installing it via the
[Helm chart](https://gitea.com/gitea/helm-chart/) with no modified settings is
sufficient for this tutorial.

This tutorial will assume that you have a Meerkat DSA instance already started,
but there is no data other than the Root DSE (which is created automatically if
it is not found).

This tutorial will also assume that you have installed and configured the
[X.500 command-line interface](./x500cli.md) to connect anonymously to your DSA.

## Creating the Organization's DSE

Create an organization first-level DSE using the following command:

```bash
x500 dap add org 'o=Foobar' --organizationName='Foobar'
```

We are also going to set the password for the organization, because we will
consider this DSE to be the administrative user for the organization. It will
have supreme permissions to read and write everything in the organization.

We _could_ have done this
in the previous command using the `--userPassword` option, but this is less
secure, because this command might end up in your shell's history, and the
password can be transmitted hashed if we use the `apw` command instead, which
means that we can set the password without the DSA ever even knowing what it is.
To do so, run this command:

```bash
x500 dap apw 'o=Foobar'
```

Note that, because we defined our first password in this DSA, no users will be
able to add top-level DSEs except this first one.

:::tip

There is no defined, standard way to restrict who can add first-level DSEs, so
Meerkat DSA's solution is to grant the first user with a password the ability to
add first-level DSEs. Prior to this first password's existence, any user can add
new first-level DSEs. For this reason, it is important to create a user with a
password as soon as you have your first-level DSEs created. For clarification,
this special privilege is only for adding first-level DSEs; outside of adding
these entries, normal access controls apply.

:::

## Configure Access Control

First we need to create an access control subentry. Its subtree specification
will cover the whole administrative area, which makes our command a lot
simpler.

```bash
x500 dap add subentry 'o=Foobar,cn=Access Control' --commonName='Access Control'
```

Now, we want this subentry to become an access control subentry, so run this
command:

```bash
x500 dap mod become acsub 'o=Foobar,cn=Access Control'
```

Unfortunately, our next command is not simple at all. We have to define
Access Control Information (ACI) items, which define our access control rules.
The first one we should add establishes that the organization user (the
administrator) can do anything within the organzation.

```bash
x500 dap mod add aci 'o=Foobar,cn=Access Control' prescriptive 'Organization administrator' 250 simple \
  --userName='o=Foobar' \
  --entry \
  --allUserAttributeTypesAndValues \
  --allOperationalAttributeTypesAndValues \
  --grantAdd \
  --grantDiscloseOnError \
  --grantRead \
  --grantRemove \
  --grantBrowse \
  --grantExport \
  --grantImport \
  --grantModify \
  --grantRename \
  --grantReturnDN \
  --grantCompare \
  --grantFilterMatch \
  --grantInvoke
```

The above command creates a prescriptive ACI item with the tag
"Organization administrator" and a precedence of 250 (pretty high, ensuring that
the administrator will always have administrative access) and `simple`
authentication level. The `userName` parameter specifically names `o=Foobar` as
the subject of this ACI item. The `entry` and `allUserAttributeTypesAndValues`
options name entries themselves and all of their attribute types and values as
the objects of this ACI item. Finally, we use every single `--grant*` option to
permit the subject every permissions to the objects.

:::tip

You will almost _always_ want to use an authentication level of `simple` for
anything that needs to be restricted, because `none` means no authentication,
and `strong` authentication is not (currently) supported by Meerkat DSA.

:::

For now, we only need this single ACI item. In a real directory, you will
probably want to define many more before you "flip the switch" to turn on access
controls. We are going to turn on access controls now, using the following
commands:

```bash
x500 dap mod become admpoint 'o=Foobar' -z -a -u
```

The `-z` option will make this administrative point an autonomous administrative
point. (It should already be autonomous, though. The X.500 specifications
require that all first-level DSEs are autonomous administrative points, so
Meerkat DSA automatically adds the autonomous administrative role to first-level
DSEs created without an `administrativeRole` attribute.) The `-a` option will
make this an access control administrative point for an Access Control Specific
Area (ACSA). The `-u` option will make this a subschema administrative area,
which will be useful shortly.

Finally, there is one more step to turn on access controls: add an access
control scheme attribute to the administrative point by using this command:

```bash
x500 dap mod add acs 'o=Foobar' 2.5.28.1
```

This adds an access control scheme of `2.5.28.1` to this administrative point,
which enables the Basic Access Control detailed in ITU Recommendation X.501.

:::info

Because we enabled access controls, and we only defined ACI items for the
`o=Foobar` user, no other users will be able to do _anything_ in this Access
Control Administrative Area (ACSA) unless the administrator, `o=Foobar` adds
more ACI items to allow it.

:::

Because you enabled access controls, you will need to change your X.500
configuration file to authenticate as `o=Foobar` with a password instead of
anonymously. You will not be able to do anything otherwise.

## Creating Schema

Just because you are logged in as a user whose access controls permit you to do
_anything_ does not _really_ mean that you can do anything. You are still
governed by schema rules, and since you did not define any DIT structure rules,
you cannot add any entries beneath `o=Foobar`, nor assign any auxiliary object
classes to any entries, nor use contexts, etc. Fortunately, `o=Foobar` has the
permissions needed to change this.

We are going to create a new subentry for the subschema.

:::info

Technically, there is
no reason you could not use the access control subentry for this, but we named
this subentry "Access Control," so it would be a misleading name if we also put
our subschema in there. Also, it is a requirement of the X.500 specifications
that subschema administrative areas apply to the whole area (e.g. the subtree
specification has to have 0 minimum, no maximum, no chops, no refinements, and
an empty base), which means that, if we changed or added a subtree to our access
control subentry, it would make our subschema non-compliant. (Technically,
Meerkat DSA just ignores the subtree specifications for subschema subentries, so
this shouldn't be a problem for Meerkat DSA, but you don't want to be
non-compliant, do you?)

:::

Run the following command:

```bash
x500 dap add subentry 'o=Foobar,cn=Subschema' --commonName='Subschema'
```

Now, we want to make this a subschema subentry, so run this command:

```bash
x500 dap mod become subschema 'o=Foobar,cn=Subschema'
```

Now, we can get to business. You could define your own name forms, but we are
just going to use the `orgNameForm` that comes installed in Meerkat DSA by
default, so we just need to define a DIT structure rule to use it. Run this
command to define a DIT structure rule that applies to the administrative point:

```bash
x500 dap mod add sr 'o=Foobar,cn=Subschema' 1 2.5.15.3
```

The command above defines a DIT structure rule with ID 1 that applies to an
administrative point with the name form identified by the object identifier
`2.5.15.3`. This object identifier is for `orgNameForm`. Since this name form
conforms to what we named our administrative point, and since this DIT structure
rule names no superior structure rules, this structure rule applies to the
administrative point `o=Foobar`, which will set the _governing structure rule_
for `o=Foobar`. Now that `o=Foobar` has a governing structure rule, you can
place other entries beneath it once you define other structure rules that permit
them.

Run this command to permit the creation of an `organizationalPerson` with the
name form `orgPersonNameForm` beneath `o=Foobar`:

```bash
x500 dap mod add sr 'o=Foobar,cn=Subschema' 2 2.5.15.6 -s 1
```

The above command will create a structure rule with an ID of 2. The object
identifier `2.5.15.6` is for `orgPersonNameForm`. The `-s 1` says that this
structure rule may permit entries under another entry whose governing structure
rule is 1 (which is our administrative point, `o=Foobar`, in this case).

That should be sufficient for our simple use case, but in a real DIT, you would
probably want to define many more structure rules, as well as content rules,
context use rules, matching rule uses, etc.

## Creating Users

Now, we need to have a heart-to-heart: the schema specified in the X.500
specifications is not perfect. Notably, the schema for an organizational person
does not permit an email address, which is required by Gitea. Also, none of
these attributes are really suitable for storing a username. This means that
we are going to have to abuse these attributes' meanings and store email
addresses and usernames where they do not belong. Again, this is just a
tutorial, and you should define proper schema that does use the correct
attribute types.

:::info

In the very near future, Meerkat DSA will introduce a LOT more pre-installed
schema, including the `inetOrgPerson` object class widely uses in LDAP servers.
This object class would be a great choice for this use case, if you can wait.

:::

For our purposes, we are going to abuse the `commonName` attribute to store the
user's username and the `title` attribute to store their email address.

Now we can create this troublesome organizational user by running this command:

```bash
x500 dap add op 'o=Foobar,cn=cnorris' \
  --commonName='cnorris' \
  --surname='Norris' \
  --title='cnorris@gmail.com'
```

If that command succeeded, we can now set the password for this user:

```bash
x500 dap apw 'o=Foobar,cn=cnorris'
```

And that's it for the Meerkat DSA setup. Now we can configure Gitea to search
for users under `o=Foobar`!

## Gitea Configuration

If you installed Gitea via the
[Helm chart](https://gitea.com/gitea/helm-chart/), there should already be an
admin user, whose credentials can be found in the `values.yaml` file in the
linked repository (unless you overwrote them when you ran `helm`). Log in as
this user and click on the profile picture in the top right. Select
"Site Administration" from the dropdown. Open the "Authentication Sources" tab.
Click on "Add Authentication Source."

In the Authentication Type dropdown, select "LDAP (via BindDN)." Give it a name,
and specify the hostname and port of your Meerkat DSA instance. Your Bind DN
should be `o=Foobar`. Your password should be the password you set for
`o=Foobar`. User search base should be `o=Foobar`.

Your search filter should be `(&(objectClass=organizationalPerson)(cn=%s))`.
The `%s` gets replaced with the username, so if you type in `cnorris` on the
login page, Gitea will search for an entry with object class
`organizationalPerson` and with a common name of `cnorris`.

For the other settings:

Username Attribute: `cn`
First Name Attribute: `cn`
Surname Attribute: `sn`
Email Attribute: `title`

And that's it! Save the authentication source and log in using the username
`cnorris` and the password you created in Meerkat DSA for this user. Congrats on
making it this far!
