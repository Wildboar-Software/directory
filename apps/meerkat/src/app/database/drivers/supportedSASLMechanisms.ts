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
import { DER, _encodeUTF8String } from "@wildboar/asn1/functional";
import {
    supportedSASLMechanisms,
} from "@wildboar/x500/LdapSystemSchema";

const mechanisms: string[] = [];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return mechanisms.map((mech) => ({
        type: supportedSASLMechanisms["&id"],
        value: _encodeUTF8String(mech, DER),
    }));
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
    return (!vertex.immediateSuperior && vertex.dse.root)
        ? mechanisms.length
        : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(
        !vertex.immediateSuperior
        && vertex.dse.root
        && mechanisms.length
    );
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    /**
     * Technically, decoding this directly to a UTF-8 string is not valid. The
     * syntax for this is actually a DirectoryString. However, valid SASL
     * mechanisms only have characters A-Z, digits, and hyphens, which happen to
     * be the same across the possible encodings.
     */
    const asserted = value.value.utf8String;
    return Boolean(
        !vertex.immediateSuperior
        && vertex.dse.root
        && mechanisms.length
        && mechanisms.some((mech) => (mech.toLowerCase() === asserted.toLowerCase()))
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
