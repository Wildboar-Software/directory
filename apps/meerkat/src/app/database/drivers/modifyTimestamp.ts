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
} from "@wildboar/meerkat-types";
import NOOP from "./NOOP";
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    modifyTimestamp,
} from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return [
        {
            type: modifyTimestamp["&id"],
            value: _encodeGeneralizedTime(vertex.dse.modifyTimestamp, DER),
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
    return vertex.dse.modifyTimestamp ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.modifyTimestamp);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return (vertex.dse.modifyTimestamp.valueOf() === value.value.generalizedTime.valueOf());
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
