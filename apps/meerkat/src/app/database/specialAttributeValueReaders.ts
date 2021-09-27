import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseReader,
} from "../types";
import { ASN1UniversalType, BERElement, DERElement, ObjectIdentifier } from "asn1-ts";
import {
    DER,
    _encodeObjectIdentifier,
    _encodeBitString,
    _encodeGeneralizedTime,
    _encodeInteger,
    _encodeBoolean,
    _encodeUTF8String,
} from "asn1-ts/dist/node/functional";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import {
    UserPwd,
    _encode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";

// Information objects
import { objectClass } from "@wildboar/x500/src/lib/modules/InformationFramework/objectClass.oa";
import { administrativeRole } from "@wildboar/x500/src/lib/modules/InformationFramework/administrativeRole.oa";
import { subtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/subtreeSpecification.oa";
import { accessControlScheme } from "@wildboar/x500/src/lib/modules/BasicAccessControl/accessControlScheme.oa";
import { pwdStartTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
import { pwdExpiryTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";
import { pwdEndTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
import { pwdFails } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import { pwdFailureTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { pwdGracesUsed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { uniqueIdentifier } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/uniqueIdentifier.oa";
import { createTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/createTimestamp.oa";
import { modifyTimestamp } from "@wildboar/x500/src/lib/modules/InformationFramework/modifyTimestamp.oa";
import { creatorsName } from "@wildboar/x500/src/lib/modules/InformationFramework/creatorsName.oa";
import { modifiersName } from "@wildboar/x500/src/lib/modules/InformationFramework/modifiersName.oa";

export const readObjectClass: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(vertex.dse.objectClass)
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            id: objectClass["&id"]!,
            value,
            contexts: new Map(),
        }));
};

export const readAdministrativeRole: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.admPoint?.administrativeRole) {
        return [];
    }
    return Array.from(vertex.dse.admPoint.administrativeRole)
        .map(ObjectIdentifier.fromString)
        .map((oid) => _encodeObjectIdentifier(oid, DER))
        .map((value): Value => ({
            id: administrativeRole["&id"]!,
            value,
            contexts: new Map(),
        }));
}

export const readAccessControlScheme: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.admPoint?.accessControlScheme) {
        return [];
    }
    return [
        {
            id: accessControlScheme["&id"],
            value: _encodeObjectIdentifier(vertex.dse.admPoint.accessControlScheme, DER),
            contexts: new Map(),
        },
    ];
}

export const readSubtreeSpecification: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const entities = await ctx.db.subtreeSpecification.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            ber: true,
        },
    });
    return entities
        .map((entity): Value => {
            const value = new BERElement();
            value.fromBytes(entity.ber);
            return {
                id: subtreeSpecification["&id"],
                value,
                contexts: new Map(),
            };
        });
}

export const readPwdStartTime: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdStartTime["&id"],
            value: _encodeGeneralizedTime(value.pwdStartTime, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdExpiryTime: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value?.pwdExpiryTime) {
        return [];
    }
    return [
        {
            id: pwdExpiryTime["&id"],
            value: _encodeGeneralizedTime(value.pwdExpiryTime, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdEndTime: SpecialAttributeDatabaseReader = async (
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
            id: pwdEndTime["&id"],
            value: _encodeGeneralizedTime(value.pwdEndTime, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdFails: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdFails["&id"],
            value: _encodeInteger(value.pwdFails, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdFailureTime: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value?.pwdFailureTime) {
        return [];
    }
    return [
        {
            id: pwdStartTime["&id"],
            value: _encodeGeneralizedTime(value.pwdFailureTime, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdGracesUsed: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value?.pwdGracesUsed) {
        return [];
    }
    return [
        {
            id: pwdGracesUsed["&id"],
            value: _encodeInteger(value.pwdGracesUsed, DER),
            contexts: new Map(),
        },
    ];
};

// export const readUserPwdHistory: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.password.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value) {
//         return [];
//     }
//     return [
//         {
//             id: pwdStartTime["&id"],
//             value: _encodeGeneralizedTime(value.pwdStartTime, DER),
//             contexts: new Map(),
//         },
//     ];
// };

// export const readUserPwdRecentlyExpired: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.password.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value) {
//         return [];
//     }
//     return [
//         {
//             id: pwdStartTime["&id"],
//             value: _encodeGeneralizedTime(value.pwdStartTime, DER),
//             contexts: new Map(),
//         },
//     ];
// };

export const readPwdModifyEntryAllowed: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdModifyEntryAllowed.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdModifyEntryAllowed["&id"],
            value: _encodeBoolean(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdChangeAllowed: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdChangeAllowed.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdChangeAllowed["&id"],
            value: _encodeBoolean(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdMaxAge: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdMaxAge.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdMaxAge["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdExpiryAge: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdExpiryAge.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdExpiryAge["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdMinLength: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdMinLength.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdMinLength["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

// export const readPwdVocabulary: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.pwd.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value) {
//         return [];
//     }
//     return [
//         {
//             id: pwdMinLength["&id"],
//             value: _encodeInteger(value.value, DER),
//             contexts: new Map(),
//         },
//     ];
// };

// export const readPwdAlphabet: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {
//     const value = await ctx.db.pwdMinLength.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     });
//     if (!value) {
//         return [];
//     }
//     return [
//         {
//             id: pwdMinLength["&id"],
//             value: _encodeInteger(value.value, DER),
//             contexts: new Map(),
//         },
//     ];
// };

export const readPwdDictionaries: SpecialAttributeDatabaseReader = async (
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
        id: pwdDictionaries["&id"],
        value: _encodeUTF8String(value.value, DER),
        contexts: new Map(),
    }));
};

export const readPwdExpiryWarning: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdExpiryWarning.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdExpiryWarning["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdGraces: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdGraces.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdGraces["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdFailureDuration: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdFailureDuration.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdFailureDuration["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdLockoutDuration: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdLockoutDuration.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdLockoutDuration["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdMaxFailures: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdMaxFailures.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdMaxFailures["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdMaxTimeInHistory: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdMaxTimeInHistory.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdMaxTimeInHistory["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdMinTimeInHistory: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdMinTimeInHistory.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdMinTimeInHistory["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdHistorySlots: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdHistorySlots.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdHistorySlots["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

export const readPwdRecentlyExpiredDuration: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const value = await ctx.db.pwdRecentlyExpiredDuration.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!value) {
        return [];
    }
    return [
        {
            id: pwdRecentlyExpiredDuration["&id"],
            value: _encodeInteger(value.value, DER),
            contexts: new Map(),
        },
    ];
};

// export const readPwdEncAlg: SpecialAttributeDatabaseReader = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
// ): Promise<Value[]> => {

// };

/**
 * Accidentally returning a password to a user--even a properly hashed password
 * --can be devastating in terms of security. (Even hashed passwords can
 * sometimes be cracked.) There is almost no good use case for exposing even the
 * ability for a password to be exposed, even to administrators. The risks far
 * outweigh the rewards. For this reason, this reader just returns an empty
 * password if the `userPassword` attribute is present, and nothing if it is
 * not present.
 *
 * In Meerkat DSA, passwords are a one-way street: they may only be written,
 * never read.
 *
 * @param ctx
 * @param vertex
 * @returns
 */
export const readUserPassword: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const hasPassword = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {},
    });
    if (hasPassword) {
        const emptyValue = new DERElement();
        emptyValue.tagNumber = ASN1UniversalType.octetString;
        return [
            {
                id: userPassword["&id"],
                value: emptyValue,
                contexts: new Map(),
            },
        ];
    } else {
        return [];
    }
};

/**
 * Accidentally returning a password to a user--even a properly hashed password
 * --can be devastating in terms of security. (Even hashed passwords can
 * sometimes be cracked.) There is almost no good use case for exposing even the
 * ability for a password to be exposed, even to administrators. The risks far
 * outweigh the rewards. For this reason, this reader just returns an empty
 * password if the `userPwd` attribute is present, and nothing if it is
 * not present.
 *
 * In Meerkat DSA, passwords are a one-way street: they may only be written,
 * never read.
 *
 * @param ctx
 * @param vertex
 * @returns
 */
export const readUserPwd: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const hasPassword = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {},
    });
    if (hasPassword) {
        const pwd: UserPwd = {
            clear: "",
        };
        return [
            {
                id: userPassword["&id"],
                value: _encode_UserPwd(pwd, DER),
                contexts: new Map(),
            },
        ];
    } else {
        return [];
    }
};

export const readUniqueIdentifier: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.dse.uniqueIdentifier) {
        return [
            {
                id: uniqueIdentifier["&id"],
                value: _encodeBitString(vertex.dse.uniqueIdentifier, DER),
                contexts: new Map(),
            },
        ];
    } else {
        return [];
    }
};

export const readCreateTimestamp: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return [
        {
            id: createTimestamp["&id"],
            value: _encodeGeneralizedTime(vertex.dse.createdTimestamp, DER),
            contexts: new Map(),
        },
    ];
};

export const readModifyTimestamp: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return [
        {
            id: modifyTimestamp["&id"],
            value: _encodeGeneralizedTime(vertex.dse.modifyTimestamp, DER),
            contexts: new Map(),
        },
    ];
};

export const readCreatorsName: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.creatorsName) {
        return [];
    }
    return [
        {
            id: creatorsName["&id"],
            value: _encode_DistinguishedName(vertex.dse.creatorsName.rdnSequence, DER),
            contexts: new Map(),
        },
    ];
};

export const readModifiersName: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.modifiersName) {
        return [];
    }
    return [
        {
            id: modifiersName["&id"],
            value: _encode_DistinguishedName(vertex.dse.modifiersName.rdnSequence, DER),
            contexts: new Map(),
        },
    ];
};
