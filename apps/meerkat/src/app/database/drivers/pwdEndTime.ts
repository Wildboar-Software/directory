import type {
    Context,
    Vertex,
    Value,
    PendingUpdates,
    AttributeTypeDatabaseDriver,
    SpecialAttributeDatabaseReader,
    SpecialAttributeDatabaseEditor,
    SpecialAttributeDatabaseRemover,
    SpecialAttributeCounter,
    SpecialAttributeDetector,
    SpecialAttributeValueDetector,
} from "@wildboar/meerkat-types";
import { DER, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import {
    pwdEndTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
import { addSeconds, subSeconds } from "date-fns";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdEndTime.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            value: true,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            type: pwdEndTime["&id"],
            value: _encodeGeneralizedTime(value.value, DER),
        },
    ];
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdEndTime.upsert({
        where: {
            entry_id: vertex.dse.id,
        },
        create: {
            entry_id: vertex.dse.id,
            value: value.value.generalizedTime,
        },
        update: {
            entry_id: vertex.dse.id,
            value: value.value.generalizedTime,
        },
    }));
};

export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const sought = value.value.generalizedTime;
    const start = subSeconds(sought, 1);
    const end = addSeconds(sought, 1);
    pendingUpdates.otherWrites.push(ctx.db.pwdEndTime.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            AND: [
                {
                    value: {
                        gte: start,
                    },
                },
                {
                    value: {
                        lte: end,
                    },
                },
            ],
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdEndTime.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<number> => {
    return ctx.db.pwdEndTime.count({
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
    return !!(await ctx.db.pwdEndTime.count({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const hasValue: SpecialAttributeValueDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
): Promise<boolean> => {
    const sought = value.value.generalizedTime;
    const start = subSeconds(sought, 1);
    const end = addSeconds(sought, 1);
    return !!(await ctx.db.pwdEndTime.count({
        where: {
            entry_id: vertex.dse.id,
            AND: [
                {
                    value: {
                        gte: start,
                    },
                },
                {
                    value: {
                        lte: end,
                    },
                },
            ],
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
