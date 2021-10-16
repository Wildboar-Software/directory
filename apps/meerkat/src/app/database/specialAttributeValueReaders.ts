import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseReader,
} from "@wildboar/meerkat-types";
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
// import { pwdFailureTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { pwdGracesUsed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
// import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
// import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
// import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
// import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
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
// import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
// import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
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
import { governingStructureRule } from "@wildboar/x500/src/lib/modules/SchemaAdministration/governingStructureRule.oa";
import { structuralObjectClass } from "@wildboar/x500/src/lib/modules/SchemaAdministration/structuralObjectClass.oa";
import { subschemaSubentryList } from "@wildboar/x500/src/lib/modules/InformationFramework/subschemaSubentryList.oa";
import {
    id_oa_accessControlSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-accessControlSubentryList.va";
import {
    id_oa_collectiveAttributeSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-collectiveAttributeSubentryList.va";
import {
    id_oa_contextDefaultSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-contextDefaultSubentryList.va";
import {
    id_oa_serviceAdminSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-serviceAdminSubentryList.va";
import {
    id_oa_pwdAdminSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-pwdAdminSubentryList.va";
import {
    id_oa_subschemaSubentryList,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-subschemaSubentryList.va";
import {
    id_oa_hasSubordinates,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-hasSubordinates.va";
import {
    id_oa_collectiveExclusions,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-oa-collectiveExclusions.va";
import {
    accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import {
    collectiveAttributeSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/collectiveAttributeSubentry.oa";
import {
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import {
    serviceAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/serviceAdminSubentry.oa";
import {
    pwdAdminSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/pwdAdminSubentry.oa";

// contextAssertionDefaults
// searchRules
// subschemaTimestamp
// pwdAttribute
// hierarchyLevel
// hierarchyBelow
// hierarchyParent
// hierarchyTop

import {
    NameFormDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormDescription.ta";
import {
    NameFormInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/NameFormInformation.ta";
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
// import {
//     MatchingRuleUseDescription,
// } from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleUseDescription.ta";
import {
    MatchingRuleDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/MatchingRuleDescription.ta";
import {
    ContextDescription,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextDescription.ta";
import {
    ContextInformation,
} from "@wildboar/x500/src/lib/modules/SchemaAdministration/ContextInformation.ta";
// import {
//     FriendsDescription,
// } from "@wildboar/x500/src/lib/modules/SchemaAdministration/FriendsDescription.ta";
// import {
//     DITContextUseDescription,
// } from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseDescription.ta";
// import {
//     DITContextUseInformation,
// } from "@wildboar/x500/src/lib/modules/SchemaAdministration/DITContextUseInformation.ta";
import {
    LdapSyntaxDescription,
} from "@wildboar/x500/src/lib/modules/LdapSystemSchema/LdapSyntaxDescription.ta";
import { namingContexts } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/namingContexts.oa";
// import { altServer } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/altServer.oa";
// import { supportedExtension } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedExtension.oa";
// import { supportedControl } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedControl.oa";
// import { supportedSASLMechanisms } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedSASLMechanisms.oa";
import { supportedLDAPVersion } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedLDAPVersion.oa";
import { supportedFeatures } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/supportedFeatures.oa";
import readDITContentRuleDescriptions from "./readers/readDITContentRuleDescriptions";
import readDITContextUseDescriptions from "./readers/readDITContextUseDescriptions";
import readDITStructureRuleDescriptions from "./readers/readDITStructureRuleDescriptions";
import readFriendsDescriptions from "./readers/readFriendsDescriptions";
import readMatchingRuleUseDescriptions from "./readers/readMatchingRuleUseDescriptions";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    id_op_binding_hierarchical,
} from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-hierarchical.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    HierarchicalAgreement,
    _decode_HierarchicalAgreement,
} from "@wildboar/x500/src/lib/modules/HierarchicalOperationalBindings/HierarchicalAgreement.ta";
import { subschema } from "@wildboar/x500/src/lib/modules/SchemaAdministration/subschema.oa";
import { AttributeTypeAndValue } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AttributeTypeAndValue.ta";

const SUBSCHEMA: string = subschema["&id"].toString();
const accessControlSubentryOID: string = accessControlSubentry["&id"].toString();
const collectiveAttributeSubentryOID: string = collectiveAttributeSubentry["&id"].toString();
const contextAssertionSubentryOID: string = contextAssertionSubentry["&id"].toString();
const serviceAdminSubentryOID: string = serviceAdminSubentry["&id"].toString();
const pwdAdminSubentryOID: string = pwdAdminSubentry["&id"].toString();

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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITStructureRuleDescriptions(ctx, vertex.dse.id))
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
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
                nf.mandatoryAttributes,
                nf.optionalAttributes,
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITContentRuleDescriptions(ctx, vertex.dse.id))
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.objectClasses.entries())
        .filter(([ k ]) => (k.indexOf(".") === -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.attributes.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
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
                attr.equalityMatchingRule,
                attr.orderingMatchingRule,
                attr.substringsMatchingRule,
                attr.syntax
                    ? {
                        uTF8String: attr.syntax,
                    }
                    : undefined,
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readFriendsDescriptions(ctx, vertex.dse.id))
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.contextTypes.values())
        .map((info) => new ContextDescription(
            info.id,
            info.name?.map((name) => ({
                uTF8String: name,
            })),
            info.description
                ? {
                    uTF8String: info.description,
                }
                : undefined,
            info.obsolete,
            new ContextInformation(
                {
                    uTF8String: info.syntax,
                },
                info.assertionSyntax
                    ? {
                        uTF8String: info.assertionSyntax,
                    }
                    : undefined,
            ),
        ))
        .map((value) => ({
            id: contextTypes["&id"],
            value: contextTypes.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readDITContextUse: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readDITContextUseDescriptions(ctx, vertex.dse.id))
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return [
        ...Array.from(ctx.equalityMatchingRules.entries()),
        ...Array.from(ctx.orderingMatchingRules.entries()),
        ...Array.from(ctx.substringsMatchingRules.entries()),
    ]
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
        .map((mr) => new MatchingRuleDescription(
            mr.id,
            mr.name?.map((name) => ({
                uTF8String: name,
            })),
            mr.description
                ? {
                    uTF8String: mr.description,
                }
                : undefined,
            mr.obsolete,
            mr.syntax
                ? {
                    uTF8String: mr.syntax,
                }
                : undefined,
        ))
        .map((value) => ({
            id: matchingRules["&id"],
            value: matchingRules.encoderFor["&Type"]!(value, DER),
            contexts: new Map(),
        }));
};

export const readMatchingRuleUse: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return (await readMatchingRuleUseDescriptions(ctx, vertex.dse.id))
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
    if (!vertex.dse.subentry || !vertex.dse.objectClass.has(SUBSCHEMA)) {
        return [];
    }
    return Array.from(ctx.ldapSyntaxes.entries())
        .filter(([ k ]) => (k.indexOf(".") > -1)) // Dedupes entries by only using OIDs, not descriptors.
        .map(([ , v ]) => v)
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

export const readGoverningStructureRule: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.governingStructureRule) {
        return [];
    }
    return [
        {
            id: governingStructureRule["&id"],
            value: governingStructureRule.encoderFor["&Type"]!(vertex.dse.governingStructureRule, DER),
            contexts: new Map(),
        },
    ];
};

export const readStructuralObjectClass: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (!vertex.dse.structuralObjectClass) {
        return [];
    }
    return [
        {
            id: structuralObjectClass["&id"],
            value: _encodeObjectIdentifier(vertex.dse.structuralObjectClass, DER),
            contexts: new Map(),
        },
    ];
};

export const readNamingContexts: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    const now = new Date();
    const obs = await ctx.db.operationalBinding.findMany({
        where: {
            binding_type: id_op_binding_hierarchical.toString(),
            validity_start: {
                gte: now,
            },
            validity_end: {
                lte: now,
            },
            accepted: true,
            OR: [
                { // Local DSA initiated role B (meaning local DSA is subordinate.)
                    initiator: OperationalBindingInitiator.ROLE_B,
                    outbound: true,
                },
                { // Remote DSA initiated role A (meaning local DSA is subordinate again.)
                    initiator: OperationalBindingInitiator.ROLE_A,
                    outbound: false,
                },
            ],
        },
        select: {
            agreement_ber: true,
        },
    });
    return [
        ...obs.map((ob): Value => {
            const argreementElement = new BERElement();
            argreementElement.fromBytes(ob.agreement_ber);
            const agreement: HierarchicalAgreement = _decode_HierarchicalAgreement(argreementElement);
            return {
                id: namingContexts["&id"],
                value: namingContexts.encoderFor["&Type"]!([ ...agreement.immediateSuperior, agreement.rdn ], DER),
                contexts: new Map(),
            };
        }),
    ];
};

export const readAltServer: SpecialAttributeDatabaseReader = async (): Promise<Value[]> => {
    return [];
};

export const readSupportedExtension: SpecialAttributeDatabaseReader = async (): Promise<Value[]> => {
    return [];
};

export const readSupportedControl: SpecialAttributeDatabaseReader = async (): Promise<Value[]> => {
    return [];
};

export const readSupportedSASLMechanisms: SpecialAttributeDatabaseReader = async (): Promise<Value[]> => {
    return [];
};

export const readSupportedLDAPVersion: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return [
        {
            id: supportedLDAPVersion["&id"],
            value: supportedLDAPVersion.encoderFor["&Type"]!(3, DER),
            contexts: new Map(),
        },
    ];
};

export const readSupportedFeatures: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    if (vertex.immediateSuperior || !vertex.dse.root) {
        return [];
    }
    return [
        { // LDAP Increment.
            id: supportedFeatures["&id"],
            value: _encodeObjectIdentifier(new ObjectIdentifier([ 1, 3, 6, 1, 1, 14 ]), DER),
            contexts: new Map(),
        },
    ];
};

export const readSubschemaSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    if (!vertex.immediateSuperior && vertex.dse.root) {
        return [
            { // Special "virtual entry" containing the subschema.
                id: subschemaSubentryList["&id"],
                value: _encode_DistinguishedName([
                    [
                        new AttributeTypeAndValue(
                            new ObjectIdentifier([ 2, 5, 4, 3 ]), // CN
                            _encodeUTF8String("subschema", DER),
                        ),
                    ],
                ], DER),
                contexts: new Map(),
            },
        ];
    }
    const subschema = relevantSubentries?.find((sub) => sub.dse.objectClass.has(SUBSCHEMA));
    if (!subschema) {
        return [];
    }
    return [
        {
            id: id_oa_subschemaSubentryList,
            value: _encode_DistinguishedName(getDistinguishedName(subschema), DER),
            contexts: new Map(),
        },
    ];
};


export const readAccessControlSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.objectClass.has(accessControlSubentryOID))
        .map(getDistinguishedName)
        .map((dn) => ({
            id: id_oa_accessControlSubentryList,
            value: _encode_DistinguishedName(dn, DER),
            contexts: new Map(),
        })) ?? [];
};

export const readCollectiveAttributeSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.objectClass.has(collectiveAttributeSubentryOID))
        .map(getDistinguishedName)
        .map((dn) => ({
            id: id_oa_collectiveAttributeSubentryList,
            value: _encode_DistinguishedName(dn, DER),
            contexts: new Map(),
        })) ?? [];
};

export const readContextDefaultSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.objectClass.has(contextAssertionSubentryOID))
        .map(getDistinguishedName)
        .map((dn) => ({
            id: id_oa_contextDefaultSubentryList,
            value: _encode_DistinguishedName(dn, DER),
            contexts: new Map(),
        })) ?? [];
};

export const readServiceAdminSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.objectClass.has(serviceAdminSubentryOID))
        .map(getDistinguishedName)
        .map((dn) => ({
            id: id_oa_serviceAdminSubentryList,
            value: _encode_DistinguishedName(dn, DER),
            contexts: new Map(),
        })) ?? [];
};

export const readPwdAdminSubentryList: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    relevantSubentries?: Vertex[],
): Promise<Value[]> => {
    return relevantSubentries
        ?.filter((sub) => sub.dse.objectClass.has(pwdAdminSubentryOID))
        .map(getDistinguishedName)
        .map((dn) => ({
            id: id_oa_pwdAdminSubentryList,
            value: _encode_DistinguishedName(dn, DER),
            contexts: new Map(),
        })) ?? [];
};

export const readHasSubordinates: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const sub = await ctx.db.entry.findFirst({
        where: {
            immediate_superior_id: vertex.dse.id,
        },
        select: {},
    });
    return [
        {
            id: id_oa_hasSubordinates,
            value: _encodeBoolean(Boolean(sub), DER),
            contexts: new Map(),
        },
    ];
};

export const readCollectiveExclusions: SpecialAttributeDatabaseReader = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
): Promise<Value[]> => {
    const cexs = await ctx.db.entryCollectiveExclusion.findMany({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            collectiveExclusion: true,
        },
    });
    return cexs.map((cex) => ({
        id: id_oa_collectiveExclusions,
        value: _encodeObjectIdentifier(ObjectIdentifier.fromString(cex.collectiveExclusion), DER),
        contexts: new Map(),
    }));
};
