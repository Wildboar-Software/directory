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
import { DER } from "@wildboar/asn1/functional";
import {
    administratorsAddress,
} from "@wildboar/parity-schema/src/lib/modules/OpenDJCoreSchema/administratorsAddress.oa.js";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (
        !vertex.dse.root
        || !ctx.config.administratorEmail
        || !ctx.config.administratorEmailPublic
    ) {
        return [];
    }
    return [
        {
            type: administratorsAddress["&id"],
            value: administratorsAddress.encoderFor["&Type"]!(ctx.config.administratorEmail, DER),
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
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    if (
        !vertex.dse.root
        || !ctx.config.administratorEmail
        || !ctx.config.administratorEmailPublic
    ) {
        return 0;
    }
    return 1;
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    if (
        !vertex.dse.root
        || !ctx.config.administratorEmail
        || !ctx.config.administratorEmailPublic
    ) {
        return false;
    }
    return true;
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    if (
        !vertex.dse.root
        || !ctx.config.administratorEmail
        || !ctx.config.administratorEmailPublic
    ) {
        return false;
    }
    return (value.value.ia5String === ctx.config.administratorEmail);
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
