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

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value?.pwdEndTime) {
        return [];
    }
    return [
        {
            type: pwdEndTime["&id"],
            value: _encodeGeneralizedTime(value.pwdEndTime, DER),
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
    pendingUpdates.otherWrites.push(ctx.db.password.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            pwdEndTime: value.value.generalizedTime,
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
    const password = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            pwdEndTime: true,
        },
    });
    if (!password) {
        return; // TODO: Should this throw an error?
    }
    if (password.pwdEndTime?.valueOf() === value.value.generalizedTime.valueOf()) {
        pendingUpdates.otherWrites.push(ctx.db.password.updateMany({
            where: {
                entry_id: vertex.dse.id,
            },
            data: {
                pwdEndTime: null,
            },
        }));
    }
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            pwdEndTime: null,
        },
    }));
};

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
        },
        select: {
            id: true,
        },
    }));
};

// export
// const hasValue: SpecialAttributeValueDetector = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
// ): Promise<boolean> => {
//     return !!(await ctx.db.password.findFirst({
//         where: {
//             entry_id: vertex.dse.id,
//             value:
//         },
//         select: {
//             id: true,
//         },
//     }));
// };

export
const driver: AttributeTypeDatabaseDriver = {
    readValues,
    addValue,
    removeValue,
    removeAttribute,
    countValues,
    isPresent,
    // hasValue,
};

export default driver;
