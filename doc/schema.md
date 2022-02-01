# Schema Administration

In general, schema in Meerkat DSA follows the X.500 directory schema
administration model defined in the X.500 series of specifications.

## Pre-Installed Schema

Meerkat DSA comes with schema pre-installed. At a minimum, this pre-installed
schema includes:

- All schema in the X.500 specifications.

It is highly recommended that you do not edit or re-define any of the
pre-installed schema: some of it is critical to directory operation. Meerkat
DSA may fail to work at all if some pre-installed schema elements are altered.

If you believe there is a mistake pertaining to the implementation of
pre-installed schema, please report it as a bug instead so it can be fixed
properly. Only alter the pre-installed schema if it is advised as a workaround
for a known issue.

## Viewing Schema

In X.500 directories, schema are stored and served from subschema subentries.
The schema that these subentries serve applies only to the subentry's
administrative area. (Note that the `subtreeSpecification` is ignored for
subschema subentries. There may only be one subschema subentry, and it applies
for the whole administrative area.) Within a subschema subentry, the elements of
the schema are served in attributes.

Even though these attributes are supposed to be stored in subschema subentries,
some of these subschema elements describe attribute types, context types, name
forms, matching rules, and other constructs that are universal, because they
have a single, universally-unique object identifier that identifies them. For
these schema elements, Meerkat DSA stores them independent of the subschema
subentries, but displays them in every single subschema subentry. For example,
if you define an object class in Meerkat DSA, that object class will appear in
every single subschema subentry, regardless of which subschema subentry to which
you added the value of attribute type `objectClasses`. As stated above, this
behavior applies to all schema constructs that are identified by an object
identifier; such schema elements will be referred to as "universal schema
elements" throughout this documentation.

Schema elements that are not global in nature _do_ apply to specific subentries.
These include DIT structure rules, DIT content rules, DIT context use rules,
matching rule uses, and attribute friendships.

<!-- You may also view schema in the web administration console. -->

## Root DSE Schema

The LDAP specifications require there to be a subschema subentry that applies to
the Root DSE. This is useful for informing clients about what attribute types
exist in the root DSE. In Meerkat DSA, the root DSE may not be edited, which
makes a hard-coded subschema subentry an easy and obvious solution. In Meerkat
DSA, there is a hard-coded subschema subentry having the distinguished name
`cn=subschema`. This subschema subentry only "exists" if it is queried directly.

## Editing Schema

There is yet another categorical dichotomy in schema elements: those that are
purely data, and those having a functional component. Some schema elements can
be represented purely as data, whereas others require some code to function.
For instance, to implement a matching rule, somebody has to actually write code
to perform the matching. Those subschema elements that require code are:

- Attribute types
- Context types
- Matching rules
- LDAP syntaxes

In attribute types, functions must be defined for encoded and decoding a
Basic Encoding Rules-encoded ASN.1 element representing the value into a usable
data type and back.

In context types, a function (a "context matcher") must be defined for matching
a Basic Encoding Rules-encoded ASN.1 element representing a context value with
a similarly-encoded context assertion value. Another function may need to be
defined to produce a default value for the context type.

In matching rules, a function (a "matcher") must be defined for evaluating
whether a Basic Encoding Rules-encoded ASN.1 element representing an attribute
value matches against a Basic Encoding Rules-encoded ASN.1 element representing
the matching rule's assertion syntax. This function is slightly different
depending on whether an equality matching rule, ordering matching rule, or
substrings matching rule is being defined.

In LDAP syntaxes, functions must be defined for converting to `LDAPString`s from
ASN.1 elements and vice versa, so that attribute values in LDAP can be
translated into a form that Meerkat DSA can utilize. Instead of handling LDAP
attribute values directly, Meerkat DSA translates them to the equivalent ASN.1
elements that would have been in an equivalent Directory Access Protocol (DAP)
request. When Meerkat DSA is done processing the request, the any attribute
values in the response are translated back into an LDAP-equivalent using these
functions.

For schema elements that require code, you'll have to add them via the init
script, which is detailed below.

### Editing Data-Only Schema

For schema elements that are purely data, such as name forms, they can be
defined by simply adding them to subschema subentries as the X.500
specifications would portend. Alternatively, they can be added to the database
directly. This should not be too hard to figure out, because schema elements
have their own separate tables in the database. Note that if you insert new
schema elements in the database directly, you may need to restart Meerkat DSA
for them to appear.

Using the Directory Access Protocol (DAP) to define new schema elements should
be preferred to directly inserting data into the database. Once downside of
using the DAP to modify schema elements is that you cannot delete universal
schema elements (attribute types, object classes, etc.) once they are defined.
This is intentional: its purpose is to prevent administrators from redefining
schema elements such that a given object identifier now ambiguously refers to
multiple different versions of a schema element.

The benefit of using the database directly is merely that it is simpler and
faster.

Finally, you can also use the init script to define schema elements when Meerkat
DSA starts up. However, this is not recommended, because these schema elements
will only exist while they are defined in the init script. It is strongly
advised that data-only schema elements be persisted to the database.

### Custom Attribute Types

Below is an example for implementing a custom attribute type:

```javascript
import {
  AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import { ObjectIdentifier, FALSE } from "asn1-ts";
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";

export async function init (ctx) {
  ctx.attributeTypes.set("2.5.4.3", {
    id: new ObjectIdentifier([ 2, 5, 4, 3 ]),
    name: ["commonName"],
    description: "A general-purpose name",
    equalityMatchingRule: new ObjectIdentifier([ 2, 5, 13, 2 ]),
    // orderingMatchingRule: new ObjectIdentifier(),
    // substringsMatchingRule: new ObjectIdentifier(),
    singleValued: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    collective: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    dummy: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    noUserModification: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    usage: AttributeUsage_userApplications,
    ldapSyntax: new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 15 ]), // Directory string syntax.
    ldapNames: ["cn", "commonName"],
    ldapDescription: "A general purpose name.",
    compatibleMatchingRules: new Set(),
    syntax: "UnboundedDirectoryString",
    // Keep reading for how to implement an attribute type
    // driver: {
    //   readValues
    //   addValue
    //   removeValue
    //   removeAttribute
    //   countValues
    //   isPresent
    //   hasValue
    //   getEntry
    // },
  });
}

export default init;
```

To be understood, attributes must be added to the context object's
`attributeTypes` map. The key should be--at minimum--the dot-delimited object
identifier. You should also map the same value to the ldap names as well; doing
so will mean that Meerkat DSA will be able to recognize the attribute by its
LDAP name when it receives an LDAP request.

The format of the attribute above is pretty much what you'd expect from a
reading of [ITU Recommendation X.501](https://www.itu.int/rec/T-REC-X.501/en)'s
definition of the `ATTRIBUTE` object class.

The `driver` field of the attribute info object is for implementing custom
functions for interacting with stored attribute values so that attribute values
of selected types can be stored, searched, etc. in alternative ways. For
instance, if you wanted to store attribute values of this type in their own
separate table in the database, you could define a driver that reads and writes
from this table instead of the `AttributeValue` table.

### Custom Object Classes

Object classes are pure data, and as such, there are three ways they can be
added to Meerkat DSA:

- Direct database insertion into the `ObjectClassDescription` table,
- Directory Access Protocol (DAP) addition to a subschema subentry via the
  `objectClasses` attribute, or
- Adding the object class to the `objectClasses` index of the context object in
  an init script. (This is not advised, because the object class will only
  continue to be defined so long as its definition continues to exist in the
  init script.)

### Custom Name Forms

Name forms are pure data, and as such, there are three ways they can be
added to Meerkat DSA:

- Direct database insertion into the `NameForm` table,
- Directory Access Protocol (DAP) addition to a subschema subentry via the
  `nameForms` attribute, or
- Adding the name form to the `nameForms` index of the context object in
  an init script. (This is not advised, because the object class will only
  continue to be defined so long as its definition continues to exist in the
  init script.)

### Custom Context Types

Below is an example for implementing a custom context type:

```javascript
import {
  ObjectIdentifier,
  FALSE,
} from "asn1-ts";
import {
  DER,
  _encodePrintableString,
} from "asn1-ts/dist/node/functional";

export async function init (ctx) {
  ctx.contextTypes.set("2.5.31.0", {
    id: new ObjectIdentifier([ 2, 5, 31, 0 ]),
    name: ["languageContext"],
    description: "ISO 639-2 language code",
    obsolete: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    syntax: "LanguageContextSyntax ::= PrintableString(SIZE (2..3)) -- ISO 639-2 codes only",
    // assertionSyntax: ""; // An assertion syntax, if different from the value syntax.
    defaultValue: () => _encodePrintableString("en", DER), // Defines "en" as the default value.
    absentMatch: FALSE, // FALSE === false. It's just an alias defined in the asn1-ts library.
    matcher: (assertion, value) => {
      return (assertion.printableString === value.printableString); // if "en" === "en", it's a match!
    },
    validator: (value) => {
      const len = value.printableString.length;
      if ((len < 2) || (len > 3)) {
        throw new Error();
      }
    },
  });
}

export default init;
```

### Custom LDAP Syntaxes

Below is an example for implementing a custom ldap syntax:

```javascript
import {
  ObjectIdentifier,
  FALSE,
} from "asn1-ts";
import {
  DER,
  _encodePrintableString,
} from "asn1-ts/dist/node/functional";

// countryString SYNTAX-NAME ::= {
//   LDAP-DESC         "Country String"
//   DIRECTORY SYNTAX  CountryName
//   ID                id-lsx-countryString }

export async function init (ctx) {
  ctx.ldapSyntaxes.set("1.3.6.1.4.1.1466.115.121.1.11", {
    id: new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 11 ]),
    description: "Country String",
    decoder: (bytes) => {
      const str = Buffer.from(bytes).toString("utf-8");
      return _encodePrintableString(str, DER);
    },
    encoder: (value) => {
      return Buffer.from(value.printableString, "utf-8");
    },
  });
}

export default init;
```

In a custom LDAP syntax, the decoder is a function that takes a `LDAPString`,
(which is defined in IETF RFC 4511 as an `OCTET STRING`, and which is
represented in Meerkat DSA as the native JavaScript data type `Uint8Array`), and
produces an ASN.1 element (of type `ASN1Element` from the `asn1-ts` NPM package)
that represents the encoded X.500-equivalent of that LDAP value. The encoder
function is the exact opposite, as you might have guessed.

Both the encoder and decoder are optional. If you do not define a decoder, you
will not be able to write LDAP values of that syntax (because Meerkat will not
be able to translate them to ASN.1 elements that it can work with). If you do
not define an encoder, you will not be able to read LDAP values of that syntax
(because Meerkat will not know how to convert those values into an LDAP values).

Note that, for an LDAP syntax to actually be used, an attribute type must
identify with the LDAP syntax via the `ldapSyntax` property of the custom
attribute type. If an attribute type has no associated LDAP syntax, it will
simply be invisible to LDAP. (Note that "invisible" does not mean "ignored.")

### Custom Matching Rules

Below is an example for implementing a custom matching rule:

```javascript
import {
  ObjectIdentifier,
  FALSE,
} from "asn1-ts";

// caseExactMatch MATCHING-RULE ::= {
//   SYNTAX       UnboundedDirectoryString
//   LDAP-SYNTAX  directoryString.&id
//   LDAP-NAME    {"caseExactMatch"}
//   ID           id-mr-caseExactMatch }

export async function init (ctx) {
  ctx.equalityMatchingRules.set("2.5.13.5", {
    id: new ObjectIdentifier([ 2, 5, 13, 5 ]),
    name: ["caseExactMatch"],
    description: "Matches two strings case-sensitively.",
    obsolete: FALSE,
    syntax: "UnboundedDirectoryString",
    ldapAssertionSyntax: new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 115, 121, 1, 15 ]), // Directory string syntax.
    matcher: (assertion, value) => { // EqualityMatcher
      return (assertion.utf8String === value.utf8String);
    },
  });
}

export default init;
```

For equality matching rules, ordering matching rules, and substring matching
rules, the example above applies, with one exception: the `matcher` will either
be of type `EqualityMatcher`, `OrderingMatcher`, or `SubstringsMatcher`, and
the matching rule will be indexed in the `equalityMatchingRules`,
`orderingMatchingRules`, or `substringsMatchingRules` properties, respectively.

An `EqualityMatcher` is a function that takes an assertion as an `ASN1Element`,
a value as an `ASN1Element`, and compares the two, returning `true` if they
match according to the semantics of the matching rule, and `false` if they do
not.

An `OrderingMatcher` is a function that takes an assertion as an `ASN1Element`,
a value as an `ASN1Element`, and compares the two, returning an integer
indicating which value is larger exactly as the predicate parameter of
JavaScript's `Array.sort()` is expected:

- A value greater than zero means "arrange the value before the assertion."
- A value less than zero means "arrange the assertion before the value."
- A value of zero means that the assertion and value are equal with respect to
  ordering.

A `SubstringsMatcher` is a function that takes an assertion as an `ASN1Element`,
a value as an `ASN1Element`, and a `SubstringSelection`, which is an enumerated
type defined in the `@wildboar/x500` library that indicates whether the
substring to be matches is `initial`, `final`, or `any`. In a pinch, these
values may be used instead of the enumerated type:

- "any" = 0
- "initial" = 1
- "final" = 2

The `SubstringsMatcher` determines if the asserted substring appears within the
value at the selected location (the start, end, or anywhere), and returns a
`boolean` value of `true` if the substring appears within the string where it is
sought and `false` if it does not.

## Guidance

### Prefer objects, not structured attributes

If an attribute type that you're defining is complicated enough to warrant a
`SEQUENCE` or `SET`, you should consider breaking all of its components into
individual single-valued attributes, and creating an object class that
represents that type instead. You can use children within compound entries to
represent these structs instead. The benefit of doing this is easier
extensibility, and a greater likelihood that you can define your attribute
type in terms of one of the subset of pre-defined LDAP syntaxes instead of
having to define a new LDAP syntax.

The only case where you should do something like this is when: (1) for some
reason, it would be burdensome to name these child entries, or (2) when all
fields of the structured type are required, few and fixed in number.

Instead of defining an attribute type like so:

```asn1
AccountInfo ::= {
  name    UTF8String,
  balance INTEGER,
  ...
}

account ATTRIBUTE ::= {
  WITH SYNTAX AccountInfo
  ID { 1 2 3 4 }
}
```

...define separate single-valued attributes and an object class for them:

```asn1
accountName ATTRIBUTE ::= {
  WITH SYNTAX   UTF8String
  SINGLE VALUE  TRUE
  ID            { 1 2 3 4 }
}

accountBalance ATTRIBUTE ::= {
  WITH SYNTAX   INTEGER
  SINGLE VALUE  TRUE
  ID            { 1 2 3 4 }
}

account OBJECT-CLASS ::= {
  SUBCLASS OF   {top}
  MUST CONTAIN  {accountName | accountBalance}
  ID            { 1 2 3 4 }
}
```

You may want to make the above object class auxiliary if you expect it to be
merely an aspect of some other object, such as a person or organization.

### Use MAY CONTAINS in auxiliary object classes

Auxiliary object classes can be useful for extending the schema of entries,
however, but they can also function as a sort of "tag" if they are defined
without required attributes.

Let's say you define an auxiliary object class called `married` that has an
attribute `spouseDN` that points to the entry's marital partner. You would not
want to make `spouseDN` a _required_ attribute of `married`, even though it
might theoretically make sense that somebody that is married has a spouse.

By making `spouseDN` an _optional_ attribute of the `married` auxiliary object
class, you can represent that an entry is married even if you do not know the
name of the spouse.

You can think of this like `NULL` in relational databases: you should only make
a field `NOT NULL` if you can _never_ think of a situation in which it would be
acceptable for that field to be absent (such as a lack of knowledge). Most
fields are not like this.

Also be aware that, if you define an attribute as required in an object class
and users of the directory system do not know the value for that attribute for
that entry, they may attempt to bypass such a restriction by putting in, say, a
"nullish" string like `"N/A"`, `"UNKNOWN"`, `"NULL"`, `""`, or using `0` for
a required attribute with `INTEGER` syntax. The result is that you could wind
up with garbage data in your directory because you required of users what they
could not provide.

### Do not embed entries within entries

Use compound entries, or attributes with a distinguished name syntax to point
to other entries. You should not define attributes with a syntax like this:

```asn1
biologicalChildren ATTRIBUTE ::= {
  WITH SYNTAX   SET OF Attribute
  ID            id-at-biologicalChildren
}
```
