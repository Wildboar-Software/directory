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
import { DER } from "asn1-ts/dist/node/functional";
import {
    userPassword,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import readEntryPassword from "../readEntryPassword";
import setEntryPassword from "../setEntryPassword";

// Returns an empty password, so the user can at least see if one exists or not.
export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const pwd = await readEntryPassword(ctx, vertex);
    if (!pwd) {
        return [];
    }
    return [
        {
            type: userPassword["&id"],
            value: userPassword.encoderFor["&Type"]!(new Uint8Array(), DER),
        },
    ];
};

// Overwrites any existing password.
export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = userPassword.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(...await setEntryPassword(ctx, undefined, vertex, {
        clear: Buffer.from(decoded).toString("utf-8"),
    }));
};

// Remove all values. Don't do it conditionally, because that would reveal a match.
export
const removeValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.deleteMany({
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

// Always return false to avoid revealing if a certain password is in use.
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
