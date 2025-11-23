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
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import {
    supportedExtension,
} from "@wildboar/x500/LdapSystemSchema";
import { extensions as ldapExtensions } from "@wildboar/ldap";

const extensions = [
    ldapExtensions.modifyPassword,
    ldapExtensions.startTLS,
    ldapExtensions.dynamicRefresh,
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
