import type { Context } from "../types";
import { ObjectIdentifier } from "asn1-ts";
import { getSubtreeSpecLexer } from "./lexSubtreeSpec";
import * as decoders from "@wildboar/ldap/src/lib/syntaxDecoders";
import * as encoders from "@wildboar/ldap/src/lib/syntaxEncoders";

const ctx: Context = {
    attributes: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 4, 3, 6 ]),
                ldapSyntax: new ObjectIdentifier([ 2, 4, 3, 6 ]),
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
} as Context;

interface Expectation {
    base?: string;
    spex?: string[];
    minimum?: number;
    maximum?: number;
    filter?: string;
}

const ss00 = '{  }';
const ss01 = '{ base "C=US" }';
const ss02 = '{ base "1.2.3.4=""Bob""" }';
const ss03 = '{ base "C=US", }';
const ss04 = '{ base "C=US", minimum 3 }';
const ss05 = '{ base "C=US", minimum 3, maximum 4 }';
const ss06 = '{ base "C=US", maximum 4 }';
const ss07 = '{ base "C=US", specificExclusions { } }';
const ss08 = '{ base "C=US", specificExclusions {} }';
const ss09 = '{ base "C=US", specificExclusions { chopBefore:"C=US" } }';
const ss10 = '{ base "C=US", specificExclusions { chopAfter:"C=US" } }';
const ss11 = '{ specificExclusions { chopBefore:"C=US", chopAfter:"C=DE", chopAfter:"C=FR" } }';
const ss12 = '{ base "" }';
const ss13 = '{ base "", }';
const ss14 = '{ base """CN=US" }';
const ss15 = '{ specificationFilter item:1.2.3.4 }';
const ss16 = '{ specificationFilter and:{ item:1.2.3.4 } }';
const ss17 = '{ specificationFilter or:{ item:1.2.3.4 } }';
const ss18 = '{ specificationFilter not:item:1.2.3.4 }';
const ss19 = '{ specificationFilter and:{ item:1.2.3.4, or:{ not:item:1.2.4.5, and:{ not:item:1.2.3.3, } } } }';
const ss20 = '{ specificationFilter and:{ item:1.2.3.4, or:{ not:item:1.2.4.5, and:{ not:item:1.2.3.3,}}}}';
const ss21 = '{ base "C=minimum 3" }';
const ss22 = '{ base "C=""minimum\\, maximum 3""" }';
const ss23 = '{ base "C=""minimum\\, \\""maximum 3""" }';
const ss24 = '{ base "C={ chopBefore" }';
const ss25 = '{ base "C={ chopAfter:""C=DE"" }" }';
const ss26 = '{ base "C={ chopAfter:""C=DE"" }" }';
const ss27 = '{ specificExclusions { chopAfter:"C=chopBefore:""C=US""" } }';

const testCases: [ string, Expectation | null ][] = [
    [ ss00, null ],
    [ ss01, null ],
    [ ss02, null ],
    [ ss03, null ],
    [ ss04, null ],
    [ ss05, null ],
    [ ss06, null ],
    [ ss07, null ],
    [ ss08, null ],
    [ ss09, null ],
    [ ss10, null ],
    [ ss11, null ],
    [ ss12, null ],
    [ ss13, null ],
    [ ss14, null ],
    [ ss15, null ],
    [ ss16, null ],
    [ ss17, null ],
    [ ss18, null ],
    [ ss19, null ],
    [ ss20, null ],
    [ ss21, null ],
    [ ss22, null ],
    [ ss23, null ],
    [ ss24, null ],
    [ ss25, null ],
    [ ss26, null ],
    [ ss27, null ],
];

const parser = getSubtreeSpecLexer(ctx);

describe("The subtreeSpec parser", () => {
    test.each(testCases)("Passes test case %s", (input, expectation) => {
        if (expectation) {
            expect(parser(input)).toEqual(expectation);
        } else {
            expect(() => parser(input)).not.toThrow();
        }
    });
});
