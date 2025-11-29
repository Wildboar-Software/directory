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
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import {
    structuralObjectClass,
} from "@wildboar/x500/SchemaAdministration";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.structuralObjectClass) {
        return [];
    }
    return [
        {
            type: structuralObjectClass["&id"],
            value: _encodeObjectIdentifier(vertex.dse.structuralObjectClass, DER),
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
const countValues: SpecialAttributeCounter = async (): Promise<number> => {
    return 1;
};

export
const isPresent: SpecialAttributeDetector = async (): Promise<boolean> => {
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return Boolean(vertex.dse.structuralObjectClass?.isEqualTo(value.value.objectIdentifier));
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
