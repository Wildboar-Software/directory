import type {
    Context,
    Vertex,
    Value,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "../../types/index.js";
import NOOP from "./NOOP.js";
import {
    TRUE_BIT,
    FALSE_BIT,
} from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    dseType,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import { compareBitStrings } from "@wildboar/x500";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.shadow) { // Shadow has sDSEType
        return [];
    }
    return [
        {
            type: dseType["&id"],
            value: dseType.encoderFor["&Type"]!(
                new Uint8ClampedArray([
                    vertex.dse.root ? TRUE_BIT : FALSE_BIT, // root
                    vertex.dse.glue ? TRUE_BIT : FALSE_BIT, // glue
                    vertex.dse.cp ? TRUE_BIT : FALSE_BIT, // cp
                    vertex.dse.entry ? TRUE_BIT : FALSE_BIT, // entry
                    vertex.dse.alias ? TRUE_BIT : FALSE_BIT, // alias
                    vertex.dse.subr ? TRUE_BIT : FALSE_BIT, // subr
                    vertex.dse.nssr ? TRUE_BIT : FALSE_BIT, // nssr
                    vertex.dse.supr ? TRUE_BIT : FALSE_BIT, // supr
                    vertex.dse.xr ? TRUE_BIT : FALSE_BIT, // xr
                    vertex.dse.admPoint ? TRUE_BIT : FALSE_BIT, // admPoint
                    vertex.dse.subentry ? TRUE_BIT : FALSE_BIT, // subentry
                    vertex.dse.shadow ? TRUE_BIT : FALSE_BIT, // shadow
                    vertex.dse.immSupr ? TRUE_BIT : FALSE_BIT, // immSupr
                    vertex.dse.rhob ? TRUE_BIT : FALSE_BIT, // rhob
                    vertex.dse.sa ? TRUE_BIT : FALSE_BIT, // sa
                    vertex.dse.dsSubentry ? TRUE_BIT : FALSE_BIT, // dsSubentry
                    vertex.dse.familyMember ? TRUE_BIT : FALSE_BIT, // familyMember
                    vertex.dse.ditBridge ? TRUE_BIT : FALSE_BIT, // ditBridge
                ]),
                DER,
            ),
        }
    ];
};

export
const addValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (vertex.dse.shadow) {
        return 0;
    }
    return 1;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (vertex.dse.shadow) {
        return false;
    }
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const present = new Uint8ClampedArray([
        vertex.dse.root ? TRUE_BIT : FALSE_BIT, // root
        vertex.dse.glue ? TRUE_BIT : FALSE_BIT, // glue
        vertex.dse.cp ? TRUE_BIT : FALSE_BIT, // cp
        vertex.dse.entry ? TRUE_BIT : FALSE_BIT, // entry
        vertex.dse.alias ? TRUE_BIT : FALSE_BIT, // alias
        vertex.dse.subr ? TRUE_BIT : FALSE_BIT, // subr
        vertex.dse.nssr ? TRUE_BIT : FALSE_BIT, // nssr
        vertex.dse.supr ? TRUE_BIT : FALSE_BIT, // supr
        vertex.dse.xr ? TRUE_BIT : FALSE_BIT, // xr
        vertex.dse.admPoint ? TRUE_BIT : FALSE_BIT, // admPoint
        vertex.dse.subentry ? TRUE_BIT : FALSE_BIT, // subentry
        vertex.dse.shadow ? TRUE_BIT : FALSE_BIT, // shadow
        vertex.dse.immSupr ? TRUE_BIT : FALSE_BIT, // immSupr
        vertex.dse.rhob ? TRUE_BIT : FALSE_BIT, // rhob
        vertex.dse.sa ? TRUE_BIT : FALSE_BIT, // sa
        vertex.dse.dsSubentry ? TRUE_BIT : FALSE_BIT, // dsSubentry
        vertex.dse.familyMember ? TRUE_BIT : FALSE_BIT, // familyMember
        vertex.dse.ditBridge ? TRUE_BIT : FALSE_BIT, // ditBridge
    ]);
    return compareBitStrings(value.value.bitString, present);
};

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    hasValue,
};

export default driver;
