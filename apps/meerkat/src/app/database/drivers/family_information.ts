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
import {
    parent,
} from "@wildboar/x500/InformationFramework";

const PARENT: string = parent["&id"].toString();

/**
 * ITU Recommendation X.511 (2016), Section 7.7.2 states that the
 * `family-information` attribute "cannot directly be selected by
 * entryInformationSelection (any attempt to do so shall be ignored)"
 *
 * @returns
 */
export
const readValues: SpecialAttributeDatabaseReader = async (): Promise<Value[]> => {
    return [];
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
    return vertex.dse.objectClass.has(PARENT) ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return vertex.dse.objectClass.has(PARENT);
};

export
const hasValue: SpecialAttributeValueDetector = async (): Promise<boolean> => {
    return false;
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
