import { Buffer } from "node:buffer";
import type { Context } from "../types/index.js";
import {
    getObjectClassesDecoder,
    utmCoords,
    getUIIFormDecoder,
    epcForm,
} from "./syntaxDecoders.js";
import { ObjectIdentifier } from "@wildboar/asn1";
import {
    ObjectClassDescription,
    _decode_ObjectClassDescription,
} from "@wildboar/x500/SchemaAdministration";
import {
    ObjectClassInformation,
} from "@wildboar/x500/SchemaAdministration";
import {
    ObjectClassKind_abstract,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_UtmCoordinates,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_EpcFormat,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    _decode_UiiFormat,
} from "@wildboar/x500/SelectedAttributeTypes";
import { strict as assert } from "node:assert";

const ctx: Context = {
    objectClasses: {
        get: (key: string) => {
            return {
                id: ObjectIdentifier.fromParts([ 2, 3, 4, 5 ]),
            };
        },
    },
    attributeTypes: {
        get: (key: string) => {
            return {
                id: ObjectIdentifier.fromParts([ 2, 4, 3, 10 ]),
            };
        },
    },
    nameToObjectIdentifier: {
        get: (key: string) => {
            if (key === "commonname") {
                return ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]);
            }
        },
    }
} as Context;

const oc1 = "( 2.5.4.3 NAME 'person' DESC 'just a big boi' OBSOLETE SUP ( 1.2.3.4 $ top ) ABSTRACT )";
const oc1desc = new ObjectClassDescription(
    ObjectIdentifier.fromParts([ 2, 5, 4, 3 ]),
    [
        {
            uTF8String: "person",
        },
    ],
    {
        uTF8String: "just a big boi",
    },
    true,
    new ObjectClassInformation(
        [
            ObjectIdentifier.fromParts([ 1, 2, 3, 4 ]),
            ObjectIdentifier.fromParts([ 2, 3, 4, 5 ]),
        ],
        ObjectClassKind_abstract,
        undefined,
        undefined,
    ),
);

describe("getObjectClassesDecoder", () => {

    test.each([
        [ oc1, oc1desc ]
    ])("works on test $#", (oc, desc) => {
        const decoder = getObjectClassesDecoder(ctx);
        const value = decoder(Buffer.from(oc, "utf-8"));
        const decoded = _decode_ObjectClassDescription(value);
        expect(decoded).toEqual(desc);
    });

});

describe("utmCoords decoder", () => {

    test("works", () => {
        const str = `{ zone "ASDF", easting "288484", northing "569363" }`;
        const value = utmCoords(Buffer.from(str, "utf-8"));
        const decoded = _decode_UtmCoordinates(value);
        expect(decoded.zone).toEqual("ASDF");
        expect(decoded.easting).toEqual("288484");
        expect(decoded.northing).toEqual("569363");
    });

});

describe("utmCoords decoder", () => {

    test("works", () => {
        const str = `{ zone "ASDF", easting "288484", northing "569363" }`;
        const value = utmCoords(Buffer.from(str, "utf-8"));
        const decoded = _decode_UtmCoordinates(value);
        expect(decoded.zone).toEqual("ASDF");
        expect(decoded.easting).toEqual("288484");
        expect(decoded.northing).toEqual("569363");
    });

});

// UiiFormat ::= SEQUENCE {
//     baseObject  URI  OPTIONAL,
//     subset      ENUMERATED {
//         baseObject   (0),
//         oneLevel     (1),
//         wholeSubtree (2) } DEFAULT baseObject,
//     next        CHOICE {
//         length      INTEGER,
//         filter      UiiFilter } }

// UiiFilter ::= CHOICE {
//     item  [0]  UiiItem,
//     and   [1]  SET OF UiiFilter,
//     or    [2]  SET OF UiiFilter,
//     not   [3]  UiiFilter }

// UiiItem ::= SEQUENCE {
//     type   ATTRIBUTE.&id,
//     length INTEGER OPTIONAL }

describe("getUIIFormDecoder", () => {

    test("works with a simple input", () => {
        const decoder = getUIIFormDecoder(ctx);
        const str = `{ baseObject "https://google.com", subset oneLevel, next length:3 }`;
        const value = decoder(Buffer.from(str, "utf-8"));
        const decoded = _decode_UiiFormat(value);
        expect(decoded.baseObject).toEqual("https://google.com");
        expect(decoded.subset).toEqual(1);
        assert("length" in decoded.next);
        expect(decoded.next.length).toBe(3);
    });

    test("works with a filter input", () => {
        const decoder = getUIIFormDecoder(ctx);
        const str = `{ baseObject "https://google.com", next filter:or:{ and:{ item:{ type commonName }, item: { type 2.5.4.4, length 5 }}, not:item:{ type commonName, length 15 } } }`;
        const value = decoder(Buffer.from(str, "utf-8"));
        const decoded = _decode_UiiFormat(value);
        expect(decoded.baseObject).toEqual("https://google.com");
        // expect(decoded.subset).toBeUndefined(); defaults to 0, which is fine and correct.
        assert("filter" in decoded.next);
        assert("or" in decoded.next.filter);
        expect(decoded.next.filter.or).toHaveLength(2);
        assert("and" in decoded.next.filter.or[0]);
        assert("not" in decoded.next.filter.or[1]);
        expect(decoded.next.filter.or[0].and).toHaveLength(2);
        assert("item" in decoded.next.filter.or[0].and[0]);
        assert("item" in decoded.next.filter.or[0].and[1]);
        assert("item" in decoded.next.filter.or[1].not);
        const item1 = decoded.next.filter.or[0].and[0].item;
        const item2 = decoded.next.filter.or[0].and[1].item;
        const item3 = decoded.next.filter.or[1].not.item;
        expect(item1.type_.toString()).toBe("2.5.4.3");
        expect(item1.length).toBeUndefined();
        expect(item2.type_.toString()).toBe("2.5.4.4");
        expect(item2.length).toBe(5);
        expect(item3.type_.toString()).toBe("2.5.4.3");
        expect(item3.length).toBe(15);
    });

});

// EpcFormat ::= SEQUENCE {
//     fields          SEQUENCE SIZE (1..MAX) OF SEQUENCE {
//       bits            INTEGER,
//       charField       CHOICE {
//         characters  [0] INTEGER,
//         maxValue    [1] INTEGER },
//       result          ENUMERATED {
//         numericPad     (0),
//         numeric        (1),
//         alpha7bits     (2) } DEFAULT numericPad },
//     digitShift  [0] INTEGER                        OPTIONAL,
//     checkCalc   [1] INTEGER                        OPTIONAL,
//     urnPrefix       UTF8String                     OPTIONAL }
describe("epcForm decoder", () => {

    test("works", () => {
        const fields_str = `{ { bits 15, charField maxValue:5, result alpha7bits }, { bits 2, charField characters:3 } }`
        const str = `{ fields ${fields_str}, digitShift 2, checkCalc 5, urnPrefix "arcvoodle" }`;
        const value = epcForm(Buffer.from(str, "utf-8"));
        const decoded = _decode_EpcFormat(value);
        expect(decoded.fields).toHaveLength(2);
        expect(decoded.fields[0].bits).toBe(15);
        assert("maxValue" in decoded.fields[0].charField);
        expect(decoded.fields[0].charField.maxValue).toBe(5);
        expect(decoded.fields[0].result).toBe(2);
        expect(decoded.fields[1].bits).toBe(2);
        assert("characters" in decoded.fields[1].charField);
        expect(decoded.fields[1].charField.characters).toBe(3);
        expect(decoded.fields[1].result).toBe(0);
    });

});
