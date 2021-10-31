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
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    pwdFailureTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            pwdFailureTime: true,
        },
    });
    if (!value?.pwdFailureTime) {
        return [];
    }
    return [
        {
            type: pwdFailureTime["&id"],
            value: _encodeGeneralizedTime(value.pwdFailureTime, DER),
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
    return ctx.db.password.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<boolean> => {
    return !!(await ctx.db.password.findFirst({
        where: {
            entry_id: vertex.dse.id,
            pwdFailureTime: {
                not: null,
            },
        },
        select: {
            id: true,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    return !!(await ctx.db.password.findFirst({
        where: {
            entry_id: vertex.dse.id,
            pwdFailureTime: value.value.generalizedTime,
        },
        select: {
            id: true,
        },
    }));
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
