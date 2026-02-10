import { Buffer } from "node:buffer";
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
    PendingUpdates,
} from "../../types/index.js";
import {
    DERElement,
    BERElement,
} from "@wildboar/asn1";
import { DER, _encodeGeneralizedTime } from "@wildboar/asn1/functional";
import {
    userPwdHistory,
} from "@wildboar/x500/PasswordPolicy";
import { subSeconds } from "date-fns";
import {
    UserPwd,
    UserPwd_encrypted,
    _decode_UserPwd,
    _encode_UserPwd,
} from "@wildboar/x500/PasswordPolicy";
import { PwdHistory } from "@wildboar/x500/InformationFramework";

/**
 * NOTE: This implementation does NOT honor the `pwdMaxTimeInHistory` attribute.
 * It just returns all passwords in the history. It would be a performance
 * disaster to observe the `pwdMaxTimeInHistory` value every time this attribute
 * is read.
 *
 * @param ctx
 * @param vertex
 * @returns
 */
export
const readValues: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return (await ctx.db.passwordHistory.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            time: true,
            password: true,
        },
    }))
        .map((row) => {
            const passwordElement = new BERElement();
            passwordElement.fromBytes(row.password);
            const pwd = _decode_UserPwd(passwordElement);
            const redacted: UserPwd = ("encrypted" in pwd)
                ? {
                    encrypted: new UserPwd_encrypted(
                        pwd.encrypted.algorithmIdentifier,
                        new Uint8Array(),
                    ),
                }
                : {
                    clear: "",
                };
            return {
                type: userPwdHistory["&id"],
                value: DERElement.fromSequence([
                    _encodeGeneralizedTime(row.time, DER),
                    ctx.config.revealUserPwdEncryptedValues
                        ? passwordElement
                        : _encode_UserPwd(redacted, DER),
                ]),
            };
        });
};

export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.shadow) {
        return;
    }
    const hist: PwdHistory = userPwdHistory.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.passwordHistory.create({
        data: {
            entry_id: vertex.dse.id,
            password: Buffer.from(hist.password.toBytes()),
            time: hist.time,
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
    const hist: PwdHistory = userPwdHistory.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.passwordHistory.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            password: Buffer.from(hist.password.toBytes()),
        },
    }));
};

export
const removeAttribute: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.passwordHistory.deleteMany({
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
    return ctx.db.passwordHistory.count({
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
    return !!(await ctx.db.passwordHistory.findFirst({
        where: {
            entry_id: vertex.dse.id,
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
    const seq = value.value.sequence;
    if (seq.length < 2) {
        return false;
    }
    return !!(await ctx.db.passwordHistory.findFirst({
        where: {
            entry_id: vertex.dse.id,
            password: seq[1].toBytes(),
            time: {
                gte: subSeconds(seq[0].generalizedTime, 30),
            },
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
