import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "../../types/index.js";
import { DER } from "@wildboar/asn1/functional";
import {
    modifiersName,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import rdnToJson from "../../x500/rdnToJson.js";
import { DbNull } from "../../generated/internal/prismaNamespace.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.modifiersName) {
        return [];
    }
    return [
        {
            type: modifiersName["&id"],
            value: _encode_DistinguishedName(vertex.dse.modifiersName.rdnSequence, DER),
        },
    ];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.entryUpdate.modifiersName = _decode_DistinguishedName(value.value).map(rdnToJson);
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.entryUpdate.modifiersName = DbNull;
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    pendingUpdates.entryUpdate.modifiersName = DbNull;
};

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
    if (!vertex.dse.modifiersName) {
        return false;
    }
    const dn = _decode_DistinguishedName(value.value);
    return compareDistinguishedName(
        dn,
        vertex.dse.modifiersName.rdnSequence,
        getNamingMatcherGetter(ctx),
    );
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
