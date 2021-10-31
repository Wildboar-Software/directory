import type { Context } from "@wildboar/meerkat-types";
import {
    getObjectClassesDecoder,
} from "./syntaxDecoders";
import { ObjectIdentifier } from "asn1-ts";
import {
    ObjectClassDescription,
    _decode_ObjectClassDescription,
    _encode_ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    ObjectClassInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassInformation.ta";
import {
    ObjectClassKind,
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";

const ctx: Context = {
    objectClasses: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 3, 4, 5 ]),
            };
        },
    },
    attributes: {
        get: (key: string) => {
            return {
                id: new ObjectIdentifier([ 2, 4, 3, 10 ]),
            };
        },
    },
} as Context;

const oc1 = "( 2.5.4.3 NAME 'person' DESC 'just a big boi' OBSOLETE SUP ( 1.2.3.4 $ top ) ABSTRACT )";
const oc1desc = new ObjectClassDescription(
    new ObjectIdentifier([ 2, 5, 4, 3 ]),
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
            new ObjectIdentifier([ 1, 2, 3, 4 ]),
            new ObjectIdentifier([ 2, 3, 4, 5 ]),
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
