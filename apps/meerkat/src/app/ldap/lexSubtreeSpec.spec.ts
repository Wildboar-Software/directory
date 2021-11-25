import type { Context } from "@wildboar/meerkat-types";
import {
    ASN1Element,
    ObjectIdentifier,
    DERElement,
    ASN1TagClass,
    ASN1UniversalType,
    ASN1Construction,
    OBJECT_IDENTIFIER,
} from "asn1-ts";
import { getSubtreeSpecLexer } from "./lexSubtreeSpec";
import * as decoders from "@wildboar/ldap/src/lib/syntaxDecoders";
import * as encoders from "@wildboar/ldap/src/lib/syntaxEncoders";
import type {
    SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    AttributeTypeAndValue,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeTypeAndValue.ta";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";

const ctx: Context = {
    attributeTypes: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 4, 3, 6 ]),
                ldapSyntax: new ObjectIdentifier([ 2, 4, 3, 6 ]),
                equalityMatchingRule: new ObjectIdentifier([ 1, 1, 1, 1 ]),
            };
        },
    },
    ldapSyntaxes: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 4, 3, 6 ]),
                decoder: decoders.directoryString,
                encoder: encoders.directoryString,
            };
        },
    },
    equalityMatchingRules: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 1, 1, 1, 1 ]),
                matcher: (assertion: ASN1Element, value: ASN1Element): boolean => {
                    return (assertion.utf8String === value.utf8String);
                },
            };
        },
    }
} as Context;

function utf8 (str: string): DERElement {
    return new DERElement(
        ASN1TagClass.universal,
        ASN1Construction.primitive,
        ASN1UniversalType.utf8String,
        str,
    );
}

// I made all of these "as const" so you could hover over them and see their values. You're welcome.
const ss00 = '{  }' as const;
const ss01 = '{ base "C=US" }' as const;
const ss02 = '{ base "2.4.3.6=""Bob""" }' as const;
const ss03 = '{ base "C=US", }' as const;
const ss04 = '{ base "C=US", minimum 3 }' as const;
const ss05 = '{ base "C=US", minimum 3, maximum 4 }' as const;
const ss06 = '{ base "C=US", maximum 4 }' as const;
const ss07 = '{ base "C=US", specificExclusions { } }' as const;
const ss08 = '{ base "C=US", specificExclusions {} }' as const;
const ss09 = '{ base "C=US", specificExclusions { chopBefore:"C=US" } }' as const;
const ss10 = '{ base "C=US", specificExclusions { chopAfter:"C=US" } }' as const;
const ss11 = '{ specificExclusions { chopBefore:"C=US", chopAfter:"C=DE", chopAfter:"C=FR" } }' as const;
const ss12 = '{ base "" }' as const;
const ss13 = '{ base "", }' as const;
const ss14 = '{ base """CN=US" }' as const;
const ss15 = '{ specificationFilter item:1.2.3.4 }' as const;
const ss16 = '{ specificationFilter and:{ item:1.2.3.4 } }' as const;
const ss17 = '{ specificationFilter or:{ item:1.2.3.4 } }' as const;
const ss18 = '{ specificationFilter not:item:1.2.3.4 }' as const;
const ss19 = '{ specificationFilter and:{ item:1.2.3.4, or:{ not:item:1.2.4.5, and:{ not:item:1.2.3.3, } } } }' as const;
const ss20 = '{ specificationFilter and:{ item:1.2.3.4, or:{ not:item:1.2.4.5, and:{ not:item:1.2.3.3,}}}}' as const;
const ss21 = '{ base "C=minimum 3" }' as const;
const ss22 = '{ base "C=""minimum\\, maximum 3""" }' as const;
const ss23 = '{ base "C=""minimum\\, \\""maximum 3""" }' as const;
const ss24 = '{ base "C={ chopBefore" }' as const;
const ss25 = '{ base "C={ chopAfter:""C=DE"" }" }' as const;
const ss26 = '{ base "C={ chopAfter:""C=DE"" }" }' as const;
const ss27 = '{ specificExclusions { chopAfter:"C=chopBefore:""C=US""" } }' as const;

type TestCase = [
    string,
    null | SubtreeSpecification["base"],
    null | SubtreeSpecification["specificExclusions"],
    null | SubtreeSpecification["minimum"],
    null | SubtreeSpecification["maximum"],
    null | SubtreeSpecification["specificationFilter"],
];

const testCases: TestCase[] = [
    [
        ss00,
        null, null, null, null, null
    ],
    [
        ss01,
        null, null, null, null, null
    ],
    [
        ss02,
        [ [ new AttributeTypeAndValue(new ObjectIdentifier([ 2, 4, 3, 6 ]), utf8('"Bob"')) ] ],
        null,
        null,
        null,
        null,
    ],
    [
        ss03,
        null, null, null, null, null
    ],
    [
        ss04,
        null, null, 3, null, null
    ],
    [
        ss05,
        null, null, 3, 4, null
    ],
    [
        ss06,
        null, null, null, 4, null
    ],
    [
        ss07,
        null, [], null, null, null
    ],
    [
        ss08,
        null, [], null, null, null
    ],
    [
        ss09,
        null, null, null, null, null
    ],
    [
        ss10,
        null, null, null, null, null
    ],
    [
        ss11,
        null,
        [
            {
                chopBefore: [[ new AttributeTypeAndValue(
                    new ObjectIdentifier([ 2, 4, 3, 6 ]),
                    utf8("US"),
                ) ]],
            },
            {
                chopAfter: [[ new AttributeTypeAndValue(
                    new ObjectIdentifier([ 2, 4, 3, 6 ]),
                    utf8("DE"),
                ) ]],
            },
            {
                chopAfter: [[ new AttributeTypeAndValue(
                    new ObjectIdentifier([ 2, 4, 3, 6 ]),
                    utf8("FR"),
                ) ]],
            },
        ],
        null, null, null
    ],
    [
        ss12,
        [], null, null, null, null
    ],
    [
        ss13,
        [], null, null, null, null
    ],
    [
        ss14,
        null, null, null, null, null
    ],
    [
        ss15,
        null, null, null, null, { item: new ObjectIdentifier([ 1, 2, 3, 4 ]) }
    ],
    [
        ss16,
        null, null, null, null, { and: [ { item: new ObjectIdentifier([ 1, 2, 3, 4 ]) } ]}
    ],
    [
        ss17,
        null, null, null, null, { or: [ { item: new ObjectIdentifier([ 1, 2, 3, 4 ]) } ]}
    ],
    [
        ss18,
        null, null, null, null, { not: { item: new ObjectIdentifier([ 1, 2, 3, 4 ]) } }
    ],
    [
        ss19,
        null, null, null, null, null
    ],
    [
        ss20,
        null, null, null, null, null
    ],
    [
        ss21,
        null, null, null, null, null
    ],
    [
        ss22,
        null, null, null, null, null
    ],
    [
        ss23,
        null, null, null, null, null
    ],
    [
        ss24,
        null, null, null, null, null
    ],
    [
        ss25,
        null, null, null, null, null
    ],
    [
        ss26,
        null, null, null, null, null
    ],
    [
        ss27,
        null,
        [
            {
                chopAfter: [[ new AttributeTypeAndValue(
                    new ObjectIdentifier([ 2, 4, 3, 6 ]),
                    utf8('chopBefore:"C=US"'),
                ) ]],
            },
        ],
        null,
        null,
        null,
    ],
];

const parser = getSubtreeSpecLexer(ctx);
const equalityMatcher = (attr: OBJECT_IDENTIFIER) => ctx.equalityMatchingRules.get(attr.toString())?.matcher;

describe("The subtreeSpec parser", () => {
    test.each(testCases)("Passes test case %s", (input, base, spex, min, max, filter) => {
        const ss = parser(input);
        if (base) {
            expect(ss.base?.length).toBe(base.length);
            if (ss.base?.length) {
                expect(compareDistinguishedName(ss.base, base, equalityMatcher)).toBeTruthy();
            }
        }
        if (spex) {
            expect(ss.specificExclusions?.length).toBe(spex.length || undefined);
            if (spex.length) {
                for (let i = 0; i < spex.length; i++) {
                    expect(Object.keys(ss.specificExclusions?.[i] ?? {})[0]).toBe(Object.keys(spex[i])[0]);
                    if (
                        ss.specificExclusions?.[i]
                        && spex[i]
                    ) {
                        const a = ss.specificExclusions[i];
                        const b = spex[i];
                        if (("chopBefore" in a) && ("chopBefore" in b)) {
                            expect(compareDistinguishedName(a.chopBefore, b.chopBefore, equalityMatcher)).toBeTruthy();
                        } else if (("chopAfter" in a) && ("chopAfter" in b)) {
                            expect(compareDistinguishedName(a.chopAfter, b.chopAfter, equalityMatcher)).toBeTruthy();
                        } else {
                            expect(false).toBeTruthy();
                        }
                    }
                }
            }
        }
        if (min !== null) {
            expect(ss.minimum).toBe(min);
        }
        if (max !== null) {
            expect(ss.maximum).toBe(max);
        }
        if (filter) {
            expect(Object.keys(ss.specificationFilter ?? {})[0]).toBe(Object.keys(filter)[0]);
        }
    });
});
