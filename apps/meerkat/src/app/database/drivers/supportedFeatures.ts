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
    supportedFeatures,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedFeatures.oa";
import {
    modifyIncrement,
    trueFalseFilters,
    allOpAttrs,
    ocadLists,
} from "@wildboar/ldap/src/lib/feature";

const features = [
    modifyIncrement,
    trueFalseFilters,
    allOpAttrs,
    ocadLists,
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
