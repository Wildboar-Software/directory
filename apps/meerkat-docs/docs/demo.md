# Demo

[Wildboar Software](https://wildboarsoftware.com/) hosts a demo environment of
Meerkat DSA instances, that are bound together by operational bindings. You can
connect to any of these access points via Directory Access Protocol over
Internet Directly-Mapped (IDM) transport:

- `idm://dsa01.root.mkdemo.wildboar.software:4632`
- `idm://dsa01.gb.mkdemo.wildboar.software:4632`
- `idm://dsa01.ru.mkdemo.wildboar.software:4632`
- `idm://dsa01.moscow.mkdemo.wildboar.software:4632`

Note that the above host names do not mean that these instances are hosted in
the countries indicated by their names. Rather, these merely identify the
naming contexts that each of these DSAs serve. You can access any one of these
DSAs and they should be able to chain operations to each other. These DSAs also
expose LDAP endpoints at the following URLs respectively:

- `ldap://dsa01.root.mkdemo.wildboar.software:389`
- `ldap://dsa01.gb.mkdemo.wildboar.software:389`
- `ldap://dsa01.ru.mkdemo.wildboar.software:389`
- `ldap://dsa01.moscow.mkdemo.wildboar.software:389`

Finally, you can connect to the web administration console, which will only
show you the DSEs residing in any given DSA. These sits can be accessed via
web browser:

- `http://webadm01.root.mkdemo.wildboar.software:18080`
- `http://webadm01.gb.mkdemo.wildboar.software:18080`
- `http://webadm01.ru.mkdemo.wildboar.software:18080`
- `http://webadm01.moscow.mkdemo.wildboar.software:18080`

## Credentials

You may log in as the administrator account with these credentials:

Bind DN: `cn=admin`

Password: `asdf`

## Demo DIT Overview

Currently, the first level contains just four entries:

- `C=US`
- `C=GB`
- `C=RU`
- `CN=admin`

`C=US,ST=FL,L=HIL,L=Tampa,L=Westchase` contains approximately 1000 entries. This
includes dynamic objects that expire and disappear from the directory. This is
also true of `C=GB,L=Yorkshire and the Humber`.

`C=US,CN=Directory Engineers` is a group with multiple members (multiple
`member` attribute values). All of these members come from
`C=US,ST=FL,L=HIL,L=Tampa,L=Westchase`.

`C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software` is an organization. Beneath it is
one or more `organizationalRole` entries and one or more `cRLDistributionPoint`
entries. `C=US,ST=FL,L=HIL,L=Tampa,O=Wildboar Software,CN=Code Peasants` is an
`organizationalRole` that contains multiple members from
`C=US,ST=FL,L=HIL,L=Tampa,L=Westchase`.

The `L=Westchase` contains an assortment of people entries, some of which have
passwords and a multitude of auxiliary object classes.

`C=GB,CN=Prince Harry` is a compound entry.

`C=RU,dmdName=Sputnik DMD` contains a handful of entries of object class `dSA`.

## Quipu DSA

Quipu DSA, the X.500 directory in the
[ISO Development Environment](https://en.wikipedia.org/wiki/ISO_Development_Environment),
is now a part of the demo environment. It is accessible at:

`itot://quipu.mkdemo.wildboar.software:17003`

As the URL implies, it is only accessible via ISO Transport Over TCP (ITOT).
Note that Quipu is a version 1 DSA, so it will not support many features, such
as contexts and hierarchy selection.

There are no credentials for this DSA. There is hardly any data in it, but it
might be nice for testing ITOT clients. List operations under the Root DSE have
been confirmed to work.

## Permissions

You may read and write all you want to these DSAs. They exist specifically so
you can try them out. Do not get attached to any data stored in them, however;
they are deleted and recreated regularly.

## Hacking Challenge

For so long as this documentation is kept online, you are permitted by Wildboar
Software to attempt to hack the hosts named above (exclusively), subject to
these rules:

1. You may not use these hosts to take over the Kubernetes cluster or other
   infrastructure on which they run, or anything else at all. The boundaries for
   hacking are strictly these hosts.
   - However, if you discover a vulnerability where you believe this is
     possible, please let us know!
2. You may not hack in such a way that inserts, saves, stores, or transmits
   anything vulgar, illegal, violent, disrespectful, etc. Keep it clean, please.
3. If you discover a vulnerability that is not already known by Wildboar
   Software, you MUST disclose it to Wildboar Software.

These will not be formal rules, per se, but please:

1. Do not attempt password cracking or brute-force attacks. Meerkat DSA will be
   slow if you have dozens of clients all simultaneously flooding it with
   requests. We already know about this. We are primarily interested in
   information disclosures and data corruption.
2. Let Jonathan M. Wilbur know you are attempting to hack Meerkat DSA via
   [email](mailto:jonathan.wilbur@wildboarsoftware.com).

If these rules are abused often enough, the demo environment will be removed, so
play nice!
