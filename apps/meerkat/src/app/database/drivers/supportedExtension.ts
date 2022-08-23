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
import { DER, _encodeObjectIdentifier } from "asn1-ts/dist/node/functional";
import {
    supportedExtension,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedExtension.oa";
import {
    modifyPassword,
    startTLS,
    dynamicRefresh,
} from "@wildboar/ldap/src/lib/extensions";

const extensions = [
    modifyPassword,
    startTLS,
    dynamicRefresh,
];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return extensions
        .map((extension) => ({
            type: supportedExtension["&id"],
            value: _encodeObjectIdentifier(extension, DER),
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
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return 0;
    }
    return extensions.length;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(
        !vertex.immediateSuperior
        && vertex.dse.root
        && extensions.length
    );
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const asserted = value.value.objectIdentifier;
    return Boolean(
        !vertex.immediateSuperior
        && vertex.dse.root
        && extensions.some((extension) => extension.isEqualTo(asserted))
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
