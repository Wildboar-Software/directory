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
import { DER, _encodeUTF8String } from "asn1-ts/dist/node/functional";
import {
    pwdDictionaries,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";

export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const values = await ctx.db.pwdDictionaries.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!values.length) {
        return [];
    }
    return values.map((value) => ({
        type: pwdDictionaries["&id"],
        value: _encodeUTF8String(value.value, DER),
    }));
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdDictionaries.createMany({
        data: {
            entry_id: vertex.dse.id,
            value: value.value.utf8String,
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
    pendingUpdates.otherWrites.push(
        ctx.db.pwdDictionaries.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.utf8String,
            },
        }),
    );
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdDictionaries.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const countValues: SpecialAttributeCounter = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<number> => {
    return ctx.db.pwdDictionaries.count({
        where: {
            entry_id: vertex.dse.id,
        },
    });
};

export
const isPresent: SpecialAttributeDetector = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<boolean> => {
    return !!(await ctx.db.pwdDictionaries.count({
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
    return !!(await ctx.db.pwdDictionaries.count({
        where: {
            entry_id: vertex.dse.id,
            value: value.value.utf8String,
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
