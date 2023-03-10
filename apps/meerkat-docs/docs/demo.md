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
Each of these has attribute values that have contexts.

`C=US,O=Government` has a hierarchical group that does not correspond to the DIT
structure exactly, and `C=US,O=Government,CN=Joseph R. Biden` and
`C=US,O=Government,CN=Kamala Harris` are both compound entries, allowing you to
test the intersection of compound entries and hierarchical groups.

`C=US,ST=FL,L=MAR,L=Ocala` is a service administrative area as well as an access
control inner area. Users one level beneath this DN may perform searches that
are permitted by search rules that provide the following services:

- White Pages, allowing users to search for a person's name and get their
  phone number and address.
- Yellow Pages, allowing users to search for organizations based on their
  business category.
- Grey Pages, allowing users to identify what person or service owns a given
  phone number. ("Reverse phonebook" or "caller ID.")

These search rules are defined at the bottom of the ASN.1 module at the
[bottom of this page](#ocala-search-rules).

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

## Demo Integration App

[The same repository](https://github.com/Wildboar-Software/directory) where
Meerkat DSA itself is hosted also contains a
[demo integration app](https://github.com/Wildboar-Software/directory/tree/master/apps/x500-auth-ts-example-express).
It is just a simple ExpressJS application that uses the
[X.500 authentication TypeScript library](https://github.com/Wildboar-Software/directory/tree/master/libs/x500-auth-ts)
(also hosted in the same repository), which in turn, uses the
[X.500 Client TypeScript Library](https://github.com/Wildboar-Software/directory/tree/master/libs/x500-client-ts).

## Ocala Search Rules

See the bottom of this module for the value assignments
`ocalaWhitePages`, `ocalaYellowPages`, and `ocalaGreyPages`. These search rules
are present in `C=US,ST=FL,L=MAR,L=Ocala` in the demo DIT.

```asn1
WildboarSearchServices { 1 1 } -- This is not a real OID. It's just for syntactic correctness.
DEFINITIONS ::=
BEGIN

--  EXPORTS All

IMPORTS

    -- from Rec. ITU-T X.520 | ISO/IEC 9594-6

    surname, givenName, commonName, initials, generationQualifier, localityName,
    stateOrProvinceName, businessCategory, telephoneNumber, postalAddress,
    physicalDeliveryOfficeName, postalCode, postOfficeBox, streetAddress,
    organizationName, description
        FROM SelectedAttributeTypes
        {joint-iso-itu-t ds(5) module(1) selectedAttributeTypes(5) 9} WITH SUCCESSORS

    REQUEST-ATTRIBUTE, RESULT-ATTRIBUTE, SEARCH-RULE, AllowedSubset
        FROM ServiceAdministration
        {joint-iso-itu-t ds(5) module(1) serviceAdministration(33) 9} WITH SUCCESSORS

;

-- Grey pages, sometimes called a "reverse telephone directory"
-- Information on government agencies is often printed on blue pages or green pages.
-- Blue pages are not really implementable with the X.500 schema.
id-wildboar         OBJECT IDENTIFIER ::= { 1 3 6 1 4 1 56490 }
id-serviceTypes     OBJECT IDENTIFIER ::= { id-wildboar 59 }
id-svc-whitePages   OBJECT IDENTIFIER ::= { id-serviceTypes 1 } -- Name to telephone
id-svc-yellowPages  OBJECT IDENTIFIER ::= { id-serviceTypes 2 } -- Businesses by category
id-svc-greyPages    OBJECT IDENTIFIER ::= { id-serviceTypes 3 } -- Telephone to name
id-svc-bluePages    OBJECT IDENTIFIER ::= { id-serviceTypes 4 } -- Government agencies

simpleSearchBy{ATTRIBUTE:attr} REQUEST-ATTRIBUTE ::= {
    ATTRIBUTE TYPE      attr.&id
}

simpleSearchFor{ATTRIBUTE:attr} RESULT-ATTRIBUTE ::= {
    ATTRIBUTE TYPE      attr.&id,
}

searchBySurname                 REQUEST-ATTRIBUTE ::= simpleSearchBy{surname}
searchByGivenName               REQUEST-ATTRIBUTE ::= simpleSearchBy{givenName}
searchByCommonName              REQUEST-ATTRIBUTE ::= simpleSearchBy{commonName}
searchByInitials                REQUEST-ATTRIBUTE ::= simpleSearchBy{initials}
searchByGenerationQualifier     REQUEST-ATTRIBUTE ::= simpleSearchBy{generationQualifier}
searchByLocalityName            REQUEST-ATTRIBUTE ::= simpleSearchBy{localityName}
searchByStateOrProvinceName     REQUEST-ATTRIBUTE ::= simpleSearchBy{stateOrProvinceName}
searchByBusinessCategory        REQUEST-ATTRIBUTE ::= simpleSearchBy{businessCategory}
searchByTelephoneNumber         REQUEST-ATTRIBUTE ::= simpleSearchBy{telephoneNumber}

searchForTelephoneNumber                RESULT-ATTRIBUTE ::= simpleSearchFor{telephoneNumber}
searchForPostalAddress                  RESULT-ATTRIBUTE ::= simpleSearchFor{postalAddress}
searchForPhysicalDeliveryOfficeName     RESULT-ATTRIBUTE ::= simpleSearchFor{physicalDeliveryOfficeName}
searchForPostalCode                     RESULT-ATTRIBUTE ::= simpleSearchFor{postalCode}
searchForPostOfficeBox                  RESULT-ATTRIBUTE ::= simpleSearchFor{postOfficeBox}
searchForStreetAddress                  RESULT-ATTRIBUTE ::= simpleSearchFor{streetAddress}
searchForStateOrProvinceName            RESULT-ATTRIBUTE ::= simpleSearchFor{stateOrProvinceName}
searchForSurname                        RESULT-ATTRIBUTE ::= simpleSearchFor{surname}
searchForGivenName                      RESULT-ATTRIBUTE ::= simpleSearchFor{givenName}
searchForCommonName                     RESULT-ATTRIBUTE ::= simpleSearchFor{commonName}
searchForInitials                       RESULT-ATTRIBUTE ::= simpleSearchFor{initials}
searchForGenerationQualifier            RESULT-ATTRIBUTE ::= simpleSearchFor{generationQualifier}
searchForLocalityName                   RESULT-ATTRIBUTE ::= simpleSearchFor{localityName}
searchForBusinessCategory               RESULT-ATTRIBUTE ::= simpleSearchFor{businessCategory}
searchForOrganizationName               RESULT-ATTRIBUTE ::= simpleSearchFor{organizationName}
searchForDescription                    RESULT-ATTRIBUTE ::= simpleSearchFor{description}

PersonNameRequestAttributes REQUEST-ATTRIBUTE ::= {
    searchByCommonName
    | searchBySurname
    | searchByGivenName
    | searchByInitials
    | searchByGenerationQualifier
}

PersonNameResultAttributes RESULT-ATTRIBUTE ::= {
    searchForCommonName
    | searchForSurname
    | searchForGivenName
    | searchForInitials
    | searchForGenerationQualifier
}

AddressResultAttributes RESULT-ATTRIBUTE ::= {
    searchForPostalAddress
    | searchForPhysicalDeliveryOfficeName
    | searchForPostalCode
    | searchForPostOfficeBox
    | searchForStreetAddress
    | searchForLocalityName
    | searchForStateOrProvinceName
}

whitePages {
    OBJECT IDENTIFIER:dmdId,
    INTEGER:id,
    AllowedSubset:subsets,
    INTEGER:defaultEntryLimit,
    INTEGER:maxEntryLimit
} SEARCH-RULE ::= {
    DMD ID                  dmdId
    SERVICE-TYPE            id-svc-whitePages
    INPUT ATTRIBUTES        {
        PersonNameRequestAttributes
        | searchByLocalityName
        | searchByStateOrProvinceName
    }
    OUTPUT ATTRIBUTES       {
        PersonNameResultAttributes
        | AddressResultAttributes
        | searchForTelephoneNumber
    }
    ALLOWED SUBSET          subsets
    IMPOSED SUBSET          oneLevel
    ENTRY LIMIT             {
        default             defaultEntryLimit,
        max                 maxEntryLimit
    }
}

yellowPages {
    OBJECT IDENTIFIER:dmdId,
    INTEGER:id,
    AllowedSubset:subsets,
    INTEGER:defaultEntryLimit,
    INTEGER:maxEntryLimit
} SEARCH-RULE ::= {
    DMD ID                  dmdId
    SERVICE-TYPE            id-svc-yellowPages
    INPUT ATTRIBUTES        {
        searchByLocalityName
        | searchByStateOrProvinceName
        | searchByBusinessCategory
    }
    OUTPUT ATTRIBUTES       {
        searchForOrganizationName
        | searchForCommonName
        | searchForDescription
        | searchForBusinessCategory
        | searchForTelephoneNumber
        AddressResultAttributes
    }
    ALLOWED SUBSET          subsets
    IMPOSED SUBSET          oneLevel
    ENTRY LIMIT             {
        default             defaultEntryLimit,
        max                 maxEntryLimit
    }
}

greyPages {
    OBJECT IDENTIFIER:dmdId,
    INTEGER:id,
    AllowedSubset:subsets,
    INTEGER:defaultEntryLimit,
    INTEGER:maxEntryLimit
} SEARCH-RULE ::= {
    DMD ID                  dmdId
    SERVICE-TYPE            id-svc-greyPages
    INPUT ATTRIBUTES        {searchByTelephoneNumber}
    COMBINATION             attribute:telephoneNumber.&id
    OUTPUT ATTRIBUTES       {
        PersonNameResultAttributes
        | AddressResultAttributes
        | searchForTelephoneNumber
        | searchForOrganizationName
        | searchForBusinessCategory
        | searchForDescription
    }
    ALLOWED SUBSET          subsets
    ENTRY LIMIT             {
        default             defaultEntryLimit,
        max                 maxEntryLimit
    }
}

-- Search Services for C=US,ST=FL,L=MAR,L=Ocala

ocalaWhitePages     SEARCH-RULE ::= whitePages  {id-wildboar, 1, '010'B, 10, 50}
ocalaYellowPages    SEARCH-RULE ::= yellowPages {id-wildboar, 2, '010'B, 50, 100}
ocalaGreyPages      SEARCH-RULE ::= greyPages   {id-wildboar, 3, '010'B, 5, 10}

END
```