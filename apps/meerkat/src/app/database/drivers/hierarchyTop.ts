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
import {
    hierarchyTop,
} from "@wildboar/x500/InformationFramework";
import NOOP from "./NOOP";
import { DER } from "@wildboar/asn1/functional";
import { compareDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";


export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.hierarchy?.top === undefined) {
        return [];
    }
    return [
        {
            type: hierarchyTop["&id"],
            value: hierarchyTop.encoderFor["&Type"]!(vertex.dse.hierarchy.top, DER),
        },
    ];
};

/**
 * The X.500 does not state that hierarchyTop is `NO USER MODIFICATION`. I think
 * this is actually a mistake, because X.501 (2016), Section 14.10 states that:
 *
 * > This attribute value [hierarchyTop] shall be supplied and maintained by the
 * > directory.
 *
 * ...which is what the specification says for the other hierarchical attribute
 * types that are `NO USER MODIFICATION`.
 */
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
    return (vertex.dse.hierarchy?.top) ? 1 : 0;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return Boolean(vertex.dse.hierarchy?.top);
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (!vertex.dse.hierarchy?.top) {
        return false;
    }
    return compareDistinguishedName(
        vertex.dse.hierarchy.top,
        hierarchyTop.decoderFor["&Type"]!(value.value),
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
