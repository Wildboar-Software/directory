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
    userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import {
    UserPwd_encrypted,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd-encrypted.ta";
import readEntryPassword from "../readEntryPassword";
import setEntryPassword from "../setEntryPassword";
import { validateAlgorithmParameters } from "../../authn/validateAlgorithmParameters";

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
    if ("clear" in pwd) {
        return [
            {
                type: userPwd["&id"],
                value: userPwd.encoderFor["&Type"]!({
                    clear: "",
                }, DER),
            },
        ];
    }
    else if ("encrypted" in pwd) {
        return [
            {
                type: userPwd["&id"],
                value: userPwd.encoderFor["&Type"]!({
                    encrypted: new UserPwd_encrypted(
                        pwd.encrypted.algorithmIdentifier,
                        ctx.config.revealUserPwdEncryptedValues
                            ? pwd.encrypted.encryptedString
                            : new Uint8Array(),
                    ),
                }, DER),
            },
        ];
    } else {
        return [];
    }
};

// Overwrites any existing password.
export
const addValue: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = userPwd.decoderFor["&Type"]!(value.value);
    if (("encrypted" in decoded) && !validateAlgorithmParameters(decoded.encrypted.algorithmIdentifier)) {
        // The algorithm parameters are unacceptable. This is to prevent
        // denial of service by chosen algorithm attacks.
        throw new Error("9e441c6c-5399-4b42-9558-9de30598fedb");
    }
    pendingUpdates.otherWrites.push(...await setEntryPassword(ctx, undefined, vertex, decoded));
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
