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
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { dITContentRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { attributeTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/attributeTypes.oa";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
import { matchingRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRules.oa";
import { matchingRuleUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRuleUse.oa";
import { ldapSyntaxes } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/ldapSyntaxes.oa";
import {
    DITStructureRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITStructureRuleDescription.ta";
import {
    NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
import {
    DITContentRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContentRuleDescription.ta";
import {
    MatchingRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleDescription.ta";
import {
    ObjectClassDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassDescription.ta";
import {
    ObjectClassInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ObjectClassInformation.ta";
import {
    AttributeTypeDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeDescription.ta";
import {
    AttributeTypeInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/AttributeTypeInformation.ta";
import {
    MatchingRuleUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";
import {
    ContextDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextDescription.ta";
import {
    ContextInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextInformation.ta";
import {
    FriendsDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";
import {
    DITContextUseDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
import {
    DITContextUseInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";
import {
    LdapSyntaxDescription,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/LdapSyntaxDescription.ta";

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

export const readDITStructureRules: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const results = await ctx.db.dITStructureRule.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    return results
        .map((result) => new DITStructureRuleDescription(
            result.ruleIdentifier,
            ObjectIdentifier.fromString(result.nameForm),
            result.superiorStructureRules
                ? result.superiorStructureRules
                    .split(" ")
                    .map((ssr) => Number.parseInt(ssr))
                : undefined,
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
        ))
        .map((value) => ({
            id: dITStructureRules["&id"],
            value: dITStructureRules.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readNameForms: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(ctx.nameForms.values())
        .map((nf) => new NameFormDescription(
            nf.namedObjectClass,
            nf.name?.map((name) => ({
                uTF8String: name,
            })),
            nf.description
                ? {
                    uTF8String: nf.description,
                }
                : undefined,
            nf.obsolete,
            new NameFormInformation(
                nf.namedObjectClass,
                Array.from(nf.mandatoryAttributes).map(ObjectIdentifier.fromString),
                nf.optionalAttributes
                    ? Array.from(nf.optionalAttributes).map(ObjectIdentifier.fromString)
                    : undefined,
            ),
        ))
        .map((value) => ({
            id: nameForms["&id"],
            value: nameForms.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readDITContentRules: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const results = await ctx.db.contentRule.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    return results
        .map((result) => new DITContentRuleDescription(
            ObjectIdentifier.fromString(result.structural_class),
            result.auxiliary_classes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.mandatory_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.optional_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.precluded_attributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString),
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
        ))
        .map((value) => ({
            id: dITContentRules["&id"],
            value: dITContentRules.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readObjectClasses: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(ctx.objectClasses.values())
        .map((oc) => new ObjectClassDescription(
            oc.id,
            oc.name?.map((name) => ({
                uTF8String: name,
            })),
            oc.description
                ? {
                    uTF8String: oc.description,
                }
                : undefined,
            oc.obsolete,
            new ObjectClassInformation(
                Array.from(oc.superclasses)
                    .map(ObjectIdentifier.fromString),
                oc.kind,
                Array.from(oc.mandatoryAttributes)
                    .map(ObjectIdentifier.fromString),
                Array.from(oc.optionalAttributes)
                    .map(ObjectIdentifier.fromString),
            ),
        ))
        .map((value) => ({
            id: objectClasses["&id"],
            value: objectClasses.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readAttributeTypes: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(ctx.attributes.values())
        .map((attr) => new AttributeTypeDescription(
            attr.id,
            attr.name?.map((name) => ({
                uTF8String: name,
            })),
            attr.description
                ? {
                    uTF8String: attr.description,
                }
                : undefined,
            attr.obsolete,
            new AttributeTypeInformation(
                attr.parent,
                undefined, // FIXME: Matching rule functions need to be replaced with full matching rules.
                undefined,
                undefined,
                undefined, // FIXME: attribute syntax needs to be added to attribute type
                !attr.singleValued,
                attr.collective,
                !attr.noUserModification,
                attr.usage,
            ),
        ))
        .map((value) => ({
            id: attributeTypes["&id"],
            value: attributeTypes.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readFriends: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const results = await ctx.db.friendship.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    return results
        .map((result) => new FriendsDescription(
            ObjectIdentifier.fromString(result.anchor),
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
            result.friends
                .split(" ")
                .map(ObjectIdentifier.fromString),
        ))
        .map((value) => ({
            id: friends["&id"],
            value: friends.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readContextTypes: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    // FIXME: contextTypes
    return [];
};

export const readDITContextUse: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const results = await ctx.db.contextUseRule.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    return results
        .map((result) => new DITContextUseDescription(
            ObjectIdentifier.fromString(result.attributeType),
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
            new DITContextUseInformation(
                result.mandatory
                    ?.split(" ")
                    .map(ObjectIdentifier.fromString),
                result.optional
                    ?.split(" ")
                    .map(ObjectIdentifier.fromString),
            ),
        ))
        .map((value) => ({
            id: dITContextUse["&id"],
            value: dITContextUse.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readMatchingRules: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    // FIXME: Pending changes to how matching rules are indexed in memory.
    return [];
};

export const readMatchingRuleUse: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const results = await ctx.db.matchingRuleUse.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    return results
        .map((result) => new MatchingRuleUseDescription(
            ObjectIdentifier.fromString(result.identifier),
            result.name
                ?.split("|")
                .map((name) => ({
                    uTF8String: name,
                })),
            result.description
                ? {
                    uTF8String: result.description,
                }
                : undefined,
            result.obsolete,
            result.information
                .split(" ")
                .map(ObjectIdentifier.fromString),
        ))
        .map((value) => ({
            id: matchingRuleUse["&id"],
            value: matchingRuleUse.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readLdapSyntaxes: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    return Array.from(ctx.ldapSyntaxes.values())
        .map((syntax) => new LdapSyntaxDescription(
            syntax.id,
            syntax.description
                ? {
                    uTF8String: syntax.description,
                }
                : undefined,
        ))
        .map((value) => ({
            id: ldapSyntaxes["&id"],
            value: ldapSyntaxes.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};
