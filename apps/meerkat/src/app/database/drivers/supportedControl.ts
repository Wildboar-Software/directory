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
    supportedControl,
} from "@wildboar/x500/LdapSystemSchema";
import {
    controls as ldapControls,
} from "@wildboar/ldap";

const controls = [
    ldapControls.simpledPagedResults,
    ldapControls.sortRequest,
    ldapControls.sortResponse,
    ldapControls.postread,
    ldapControls.subentries,
    ldapControls.managedDSAIT,
    ldapControls.dontUseCopy,
];

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return controls.map((oid) => ({
        type: supportedControl["&id"],
        value: _encodeObjectIdentifier(oid, DER),
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
    return controls.length;
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
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return false;
    }
    const asserted = value.value.objectIdentifier;
    return controls.some((control) => control.isEqualTo(asserted));
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
