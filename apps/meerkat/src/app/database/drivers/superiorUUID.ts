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
import { DER } from "@wildboar/asn1/functional";
import { _decode_UUID, _encode_UUID } from "@wildboar/x500/SelectedAttributeTypes";
import {
    superiorUUID,
} from "@wildboar/parity-schema/src/lib/modules/OpenLDAP/superiorUUID.oa.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const sup = vertex.immediateSuperior?.dse.entryUUID;
    if (!sup) {
        return [];
    }
    const uuid = Buffer.from(sup.replace(/-/g, ""), "hex");
    if (uuid.length !== 16) {
        return [];
    }
    return [
        {
            type: superiorUUID["&id"],
            value: _encode_UUID(uuid, DER),
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
    ctx: Context,
    vertex: Vertex,
): Promise<number> => {
    const sup = vertex.immediateSuperior?.dse.entryUUID;
    return sup ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Context,
    vertex: Vertex,
): Promise<boolean> => {
    return !!vertex.immediateSuperior?.dse.entryUUID;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const sup = vertex.immediateSuperior?.dse.entryUUID;
    if (!sup) {
        return false;
    }
    const uuid = Buffer.from(sup.replace(/-/g, ""), "hex");
    if (uuid.length !== 16) {
        return false;
    }
    const asserted = _decode_UUID(value.value);
    if (asserted.length !== 16) {
        return false;
    }
    return !Buffer.compare(asserted, uuid);
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
