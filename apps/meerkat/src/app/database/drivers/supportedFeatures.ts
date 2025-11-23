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
import NOOP from "./NOOP.js";
import { DER, _encodeObjectIdentifier } from "@wildboar/asn1/functional";
import {
    supportedFeatures,
} from "@wildboar/x500/LdapSystemSchema";
import { features as ldapFeatures } from "@wildboar/ldap";

const features = [
    ldapFeatures.modifyIncrement,
    ldapFeatures.trueFalseFilters,
    ldapFeatures.allOpAttrs,
    ldapFeatures.ocadLists,
];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return features
        .map((feature) => ({
            type: supportedFeatures["&id"],
            value: _encodeObjectIdentifier(feature, DER),
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
    return features.length;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(!vertex.immediateSuperior && vertex.dse.root);
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
        && features.some((feature) => feature.isEqualTo(asserted))
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
