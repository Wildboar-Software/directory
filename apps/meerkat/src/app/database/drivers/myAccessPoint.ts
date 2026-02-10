import { Buffer } from "node:buffer";
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
import { DER } from "@wildboar/asn1/functional";
import {
    myAccessPoint,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    _encode_AccessPoint,
} from "@wildboar/x500/DistributedOperations";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return [
        {
            type: myAccessPoint["&id"],
            value: myAccessPoint.encoderFor["&Type"]!(ctx.dsa.accessPoint, DER),
        },
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
    return (vertex.immediateSuperior || !vertex.dse.root) ? 0 : 1;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !(vertex.immediateSuperior || !vertex.dse.root);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.root) {
        return false;
    }
    const encoded = _encode_AccessPoint(ctx.dsa.accessPoint, DER);
    return !Buffer.compare(encoded.toBytes(), value.value.toBytes());
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
