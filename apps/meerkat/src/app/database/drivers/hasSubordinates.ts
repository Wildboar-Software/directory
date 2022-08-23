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
import { DER, _encodeBoolean } from "asn1-ts/dist/node/functional";
import {
    hasSubordinates,
} from "@wildboar/x500/src/lib/modules/InformationFramework/hasSubordinates.oa";
import { entryExistsFilter } from "../../database/entryExistsFilter";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.subordinates) {
        return [
            {
                type: hasSubordinates["&id"],
                value: _encodeBoolean((vertex.subordinates.length > 0), DER),
            },
        ];
    } else {
        const subordinates = await ctx.db.entry.count({
            where: {
                immediate_superior_id: vertex.dse.id,
                ...entryExistsFilter,
            },
        });
        return [
            {
                type: hasSubordinates["&id"],
                value: _encodeBoolean((subordinates > 0), DER),
            },
        ];
    }
};

export
const addValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeValue: SpecialAttributeDatabaseEditor = NOOP;

export
const removeAttribute: SpecialAttributeDatabaseRemover = NOOP;

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
    if (vertex.subordinates) {
        return (vertex.subordinates.length === value.value.integer);
    } else {
        return ((await ctx.db.entry.count({
            where: {
                immediate_superior_id: vertex.dse.id,
            },
        })) === value.value.integer);
    }
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
