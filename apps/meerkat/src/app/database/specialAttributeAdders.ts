import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "@wildboar/meerkat-types";
import { DER } from "asn1-ts/dist/node/functional";
// import {
//     ACIItem,
//     _decode_ACIItem,
// } from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    UserPwd,
    _decode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
// import { subentry } from "@wildboar/x500/src/lib/modules/InformationFramework/subentry.oa";
// import { alias } from "@wildboar/x500/src/lib/modules/InformationFramework/alias.oa";
// import { parent } from "@wildboar/x500/src/lib/modules/InformationFramework/parent.oa";
// import { child } from "@wildboar/x500/src/lib/modules/InformationFramework/child.oa";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import {
    _encode_MasterOrShadowAccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterOrShadowAccessPoint.ta";
import {
    _decode_MasterAndShadowAccessPoints,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/MasterAndShadowAccessPoints.ta";
import directoryStringToString from "@wildboar/x500/src/lib/stringifiers/directoryStringToString";
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";
import {
    Knowledge,
    ObjectClassKind as PrismaObjectClassKind,
    AttributeUsage as PrismaAttributeUsage,
} from "@prisma/client";
import {
    ObjectClassKind_abstract,
    ObjectClassKind_auxiliary,
    ObjectClassKind_structural,
} from "@wildboar/x500/src/lib/modules/InformationFramework/ObjectClassKind.ta";
import {
    AttributeUsage_dSAOperation,
    AttributeUsage_directoryOperation,
    AttributeUsage_distributedOperation,
    AttributeUsage_userApplications,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeUsage.ta";
import rdnToJson from "../x500/rdnToJson";
// import { pwdStartTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdStartTime.oa";
// import { pwdExpiryTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryTime.oa";
// import { pwdEndTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEndTime.oa";
// import { pwdFails } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
// import { pwdFailureTime } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
// import { pwdGracesUsed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGracesUsed.oa";
// import { userPwdHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdHistory.oa";
// import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
// import { pwdModifyEntryAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdModifyEntryAllowed.oa";
// import { pwdChangeAllowed } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdChangeAllowed.oa";
// import { pwdMaxAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxAge.oa";
// import { pwdExpiryAge } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryAge.oa";
// import { pwdMinLength } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinLength.oa";
// import { pwdVocabulary } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdVocabulary.oa";
// import { pwdAlphabet } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdAlphabet.oa";
// import { pwdDictionaries } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdDictionaries.oa";
// import { pwdExpiryWarning } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdExpiryWarning.oa";
// import { pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdGraces.oa";
// import { pwdFailureDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureDuration.oa";
// import { pwdLockoutDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdLockoutDuration.oa";
// import { pwdMaxFailures } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxFailures.oa";
// import { pwdMaxTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMaxTimeInHistory.oa";
// import { pwdMinTimeInHistory } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdMinTimeInHistory.oa";
// import { pwdHistorySlots } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdHistorySlots.oa";
// import { pwdRecentlyExpiredDuration } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdRecentlyExpiredDuration.oa";
// import { pwdEncAlg } from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdEncAlg.oa";
import { dITStructureRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITStructureRules.oa";
import { nameForms } from "@wildboar/x500/src/lib/modules/SchemaAdministration/nameForms.oa";
import { dITContentRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContentRules.oa";
import { objectClasses } from "@wildboar/x500/src/lib/modules/SchemaAdministration/objectClasses.oa";
import { attributeTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/attributeTypes.oa";
import { friends } from "@wildboar/x500/src/lib/modules/SchemaAdministration/friends.oa";
import { contextTypes } from "@wildboar/x500/src/lib/modules/SchemaAdministration/contextTypes.oa";
import { dITContextUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/dITContextUse.oa";
// import { matchingRules } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRules.oa";
import { matchingRuleUse } from "@wildboar/x500/src/lib/modules/SchemaAdministration/matchingRuleUse.oa";
// import { ldapSyntaxes } from "@wildboar/x500/src/lib/modules/LdapSystemSchema/ldapSyntaxes.oa";

/* DATABASE WRITERS */

const NOOP: SpecialAttributeDatabaseEditor = async (): Promise<void> => {};

// const writeSomeACI: (scope: ACIScope) => SpecialAttributeDatabaseEditor = (scope: ACIScope) => {
//     return (
//         ctx: Readonly<Context>,
//         entry: Vertex,
//         attribute: StoredAttributeValueWithContexts,
//     ): PrismaPromise<any> => {
//         // We ignore contexts for this.
//         const aci: ACIItem = _decode_ACIItem(attribute.value);
//         return ctx.db.aCIItem.create({
//             data: {
//                 entry_id: entry.dse.id,
//                 tag: directoryStringToString(aci.identificationTag),
//                 precedence: aci.precedence,
//                 auth_level_basic_level: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.level
//                     : undefined,
//                 auth_level_basic_local_qualifier: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.localQualifier
//                     : undefined,
//                 auth_level_basic_signed: ("basicLevels" in aci.authenticationLevel)
//                     ? aci.authenticationLevel.basicLevels.signed
//                     : undefined,
//                 ber: Buffer.from(attribute.value.toBytes()),
//                 scope,
//             },
//         });
//     };
// }

// const writeEntryACI = writeSomeACI(ACIScope.ENTRY);
// const writePrescriptiveACI = writeSomeACI(ACIScope.PRESCRIPTIVE);
// const writeSubentryACI = writeSomeACI(ACIScope.SUBENTRY);

export const addObjectClass: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    // TODO: Block object class "parent" from being added directly.
    // TODO: Automatically add object class "parent" to superior if "child" is added.
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.create({
        data: {
            entry_id: vertex.dse.id,
            object_class: value.value.objectIdentifier.toString(),
        },
    }));
};

// TODO: Hierarchy

export const addAccessControlScheme: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAccessControlScheme.create({
        data: {
            entry_id: vertex.dse.id,
            accessControlScheme: value.value.objectIdentifier.toString(),
        },
    }));
};

// TODO:
// export const jid: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addAdministrativeRole: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.create({
        data: {
            entry_id: vertex.dse.id,
            administrativeRole: value.value.objectIdentifier.toString(),
        },
    }));
};

// TODO: All of these.

// export const clearance: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const DITStructureRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContentRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContextUseRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const FriendshipUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const MatchingRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const AttributeTypeDescriptionUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ObjectClassDescriptionUsage: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const ContextDescriptionUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const SearchRuleUse: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const AccessPoint: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addSubtreeSpecification: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const subtree = _decode_SubtreeSpecification(value.value);
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.create({
        data: {
            entry_id: vertex.dse.id,
            base: subtree.base
                ? subtree.base.map((rdn) => rdnToJson(rdn))
                : undefined,
            minimum: subtree.minimum,
            maximum: subtree.maximum,
            ber: Buffer.from(value.value.toBytes()),
            // specific_exclusions: // FIXME:
            // specification_filter: // FIXME:
            // specific_exclusions: subtree.specificExclusions?.map((sx) => {
            //     if ("")
            // })
        },
    }));
};

export const addNonSpecificKnowledge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.nonSpecificKnowledge.create({
        data: {
            entry_id: vertex.dse.id,
            ber: Buffer.from(value.value.toBytes()),
        },
    }));
};

export const addSpecificKnowledge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const mosaps = _decode_MasterAndShadowAccessPoints(value.value);
    pendingUpdates.otherWrites.push(
        ctx.db.accessPoint.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                knowledge_type: Knowledge.SPECIFIC,
            },
        }),
        ctx.db.accessPoint.createMany({
            data: mosaps.map((mosap) => ({
                entry_id: vertex.dse.id,
                ae_title: mosap.ae_title.rdnSequence.map(rdnToJson),
                knowledge_type: Knowledge.SPECIFIC,
                category: mosap.category,
                chainingRequired: mosap.chainingRequired,
                ber: Buffer.from(_encode_MasterOrShadowAccessPoint(mosap, DER).toBytes()),
            })),
        }),
    );
};

// export const addPwdStartTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addPwdExpiryTime: SpecialAttributeDatabaseEditor = async (
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
            pwdExpiryTime: value.value.generalizedTime,
        },
    }));
};

export const addPwdEndTime: SpecialAttributeDatabaseEditor = async (
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

// export const addPwdFails: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const addPwdFailureTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const addPwdGracesUsed: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const addUserPwdHistory: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const addUserPwdRecentlyExpired: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const addPwdModifyEntryAllowed: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdModifyEntryAllowed.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.boolean,
        },
    }));
};

export const addPwdChangeAllowed: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdChangeAllowed.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.boolean,
        },
    }));
};

export const addPwdMaxAge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxAge.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdExpiryAge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdExpiryAge.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdMinLength: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMinLength.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

// export const addPwdVocabulary: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdVo.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             value: value.value.boolean,
//         },
//     }));
// };

// export const addPwdAlphabet: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdModifyEntryAllowed.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             value: value.value.boolean,
//         },
//     }));
// };

export const addPwdDictionaries: SpecialAttributeDatabaseEditor = async (
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

export const addPwdExpiryWarning: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdExpiryWarning.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdGraces: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdGraces.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdFailureDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdFailureDuration.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdLockoutDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdLockoutDuration.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdMaxFailures: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxFailures.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdMaxTimeInHistory: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxTimeInHistory.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdMinTimeInHistory: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMinTimeInHistory.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdHistorySlots: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdHistorySlots.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

export const addPwdRecentlyExpiredDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdRecentlyExpiredDuration.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            value: value.value.integer,
        },
    }));
};

// export const addPwdEncAlg: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// NOTE: This might not be used.
export const addUserPassword: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const algid = getScryptAlgorithmIdentifier();
    const encrypted = encryptPassword(algid, value.value.octetString);
    if (!encrypted) {
        throw new Error();
    }
    pendingUpdates.otherWrites.push(ctx.db.password.upsert({
        where: {
            entry_id: vertex.dse.id,
        },
        create: {
            entry_id: vertex.dse.id,
            encrypted: Buffer.from(encrypted),
            algorithm_oid: algid.algorithm.toString(),
            algorithm_parameters_der: algid.parameters
                ? Buffer.from(algid.parameters.toBytes())
                : undefined,
        },
        update: {
            entry_id: vertex.dse.id,
            encrypted: Buffer.from(encrypted),
            algorithm_oid: algid.algorithm.toString(),
            algorithm_parameters_der: algid.parameters
                ? Buffer.from(algid.parameters.toBytes())
                : undefined,
        },
    }));
};

// NOTE: This might not be used.
export const addUserPwd: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const pwd: UserPwd = _decode_UserPwd(value.value);
    if ("clear" in pwd) {
        const algid = getScryptAlgorithmIdentifier();
        const clear = Buffer.from(pwd.clear, "utf-8");
        const encrypted = encryptPassword(algid, clear);
        if (!encrypted) {
            throw new Error();
        }
        pendingUpdates.otherWrites.push(ctx.db.password.upsert({
            where: {
                entry_id: vertex.dse.id,
            },
            create: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(encrypted),
                algorithm_oid: algid.algorithm.toString(),
                algorithm_parameters_der: algid.parameters
                    ? Buffer.from(algid.parameters.toBytes())
                    : undefined,
            },
            update: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(encrypted),
                algorithm_oid: algid.algorithm.toString(),
                algorithm_parameters_der: algid.parameters
                    ? Buffer.from(algid.parameters.toBytes())
                    : undefined,
            },
        }));
    } else if ("encrypted" in pwd) {
        pendingUpdates.otherWrites.push(ctx.db.password.upsert({
            where: {
                entry_id: vertex.dse.id,
            },
            create: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(pwd.encrypted.encryptedString),
                algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                    ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes())
                    : undefined,
            },
            update: {
                entry_id: vertex.dse.id,
                encrypted: Buffer.from(pwd.encrypted.encryptedString),
                algorithm_oid: pwd.encrypted.algorithmIdentifier.algorithm.toString(),
                algorithm_parameters_der: pwd.encrypted.algorithmIdentifier.parameters
                    ? Buffer.from(pwd.encrypted.algorithmIdentifier.parameters.toBytes())
                    : undefined,
            },
        }));
    } else {
        throw new Error();
    }
};

export const addUniqueIdentifier: SpecialAttributeDatabaseEditor = NOOP;

export const addDITStructureRules: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITStructureRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.create({
        data: {
            entry_id: vertex.dse.id,
            ruleIdentifier: decoded.ruleIdentifier,
            nameForm: decoded.nameForm.toString(),
            superiorStructureRules: decoded.superiorStructureRules
                ?.map((ssr) => ssr.toString())
                .join(" ") ?? null,
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditStructureRules) {
            vertex.dse.subentry.ditStructureRules.push(decoded);
        } else {
            vertex.dse.subentry.ditStructureRules = [ decoded ];
        }
    }
};

export const addNameForms: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = nameForms.decoderFor["&Type"]!(value.value);
    const name = decoded.name
        ? decoded.name
            .map(directoryStringToString)
            .map((str) => str.replace(/\|/g, ""))
            .join("|")
        : undefined;
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    pendingUpdates.otherWrites.push(ctx.db.nameForm.create({
        data: {
            identifier: decoded.identifier.toString(),
            name,
            description,
            obsolete: decoded.obsolete,
            namedObjectClass: decoded.information.subordinate.toString(),
            mandatoryAttributes: decoded.information.namingMandatories
                .map((oid) => oid.toString())
                .join(" "),
            optionalAttributes: decoded.information.namingOptionals
                ?.map((oid) => oid.toString())
                .join(" "),
        },
    }));
    ctx.nameForms.set(decoded.identifier.toString(), {
        id: decoded.identifier,
        name: decoded.name?.map(directoryStringToString),
        description,
        obsolete: decoded.obsolete,
        namedObjectClass: decoded.information.subordinate,
        mandatoryAttributes: decoded.information.namingMandatories,
        optionalAttributes: decoded.information.namingOptionals ?? [],
    });
};

export const addDITContentRules: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITContentRules.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contentRule.create({
        data: {
            entry_id: vertex.dse.id,
            structural_class: decoded.structuralObjectClass.toString(),
            auxiliary_classes: decoded.auxiliaries?.map((aux) => aux.toString()).join(" "),
            mandatory_attributes: decoded.mandatory?.map((attr) => attr.toString()).join(" "),
            optional_attributes: decoded.optional?.map((attr) => attr.toString()).join(" "),
            precluded_attributes: decoded.precluded?.map((attr) => attr.toString()).join(" "),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
        },
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditContentRules) {
            vertex.dse.subentry.ditContentRules.push(decoded);
        } else {
            vertex.dse.subentry.ditContentRules = [ decoded ];
        }
    }
};

export const addObjectClasses: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = objectClasses.decoderFor["&Type"]!(value.value);
    const name = decoded.name
        ? decoded.name
            .map(directoryStringToString)
            .map((str) => str.replace(/\|/g, ""))
            .join("|")
        : undefined;
    const description = decoded.description
        ? directoryStringToString(decoded.description)
        : undefined;
    pendingUpdates.otherWrites.push(ctx.db.objectClassDescription.create({
        data: {
            identifier: decoded.identifier.toString(),
            name,
            description,
            obsolete: decoded.obsolete,
            subclassOf: decoded.information.subclassOf
                ?.map((oid) => oid.toString())
                .join(" "),
            mandatories: decoded.information.mandatories?.map((attr) => attr.toString()).join(" "),
            optionals: decoded.information.optionals?.map((attr) => attr.toString()).join(" "),
            kind: (() => {
                switch (decoded.information.kind) {
                case (ObjectClassKind_abstract): return PrismaObjectClassKind.ABSTRACT;
                case (ObjectClassKind_auxiliary): return PrismaObjectClassKind.AUXILIARY
                case (ObjectClassKind_structural): return PrismaObjectClassKind.STRUCTURAL;
                default: return undefined;
                }
            })(),
            ldapDescription: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            ldapNames: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
        },
    }));
    ctx.objectClasses.set(decoded.identifier.toString(), {
        id: decoded.identifier,
        name: decoded.name?.map(directoryStringToString),
        description,
        obsolete: decoded.obsolete,
        superclasses: decoded.information.subclassOf
            ? new Set(decoded.information.subclassOf.map((oid) => oid.toString()))
            : new Set(),
        kind: decoded.information.kind ?? ObjectClassKind_structural,
        mandatoryAttributes: new Set(decoded.information.mandatories?.map((oid) => oid.toString())),
        optionalAttributes: new Set(decoded.information.optionals?.map((oid) => oid.toString())),
        ldapNames: [],
        ldapDescription: description,
    });
};

export const addAttributeTypes: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = attributeTypes.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.attributeTypeDescription.create({
        data: {
            identifier: decoded.identifier.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            derivation: decoded.information.derivation?.toString(),
            equalityMatch: decoded.information.equalityMatch?.toString(),
            orderingMatch: decoded.information.orderingMatch?.toString(),
            substringsMatch: decoded.information.substringsMatch?.toString(),
            attributeSyntax: decoded.information.attributeSyntax
                ? directoryStringToString(decoded.information.attributeSyntax)
                : undefined,
            multiValued: decoded.information.multi_valued,
            collective: decoded.information.collective,
            userModifiable: decoded.information.userModifiable,
            application: (() => {
                switch (decoded.information.application) {
                case (AttributeUsage_dSAOperation):
                    return PrismaAttributeUsage.DSA_OPERATION;
                case (AttributeUsage_directoryOperation):
                    return PrismaAttributeUsage.DIRECTORY_OPERATION;
                case (AttributeUsage_distributedOperation):
                    return PrismaAttributeUsage.DISTRIBUTED_OPERATION;
                case (AttributeUsage_userApplications):
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                default:
                    return PrismaAttributeUsage.USER_APPLICATIONS;
                }
            })(),
        },
    }));
};

export const addFriends: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = friends.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.friendship.create({
        data: {
            entry_id: vertex.dse.id,
            anchor: decoded.anchor.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            friends: decoded.friends.map((oid) => oid.toString()).join(" "),
        },
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.friendships) {
            vertex.dse.subentry.friendships.push(decoded);
        } else {
            vertex.dse.subentry.friendships = [ decoded ];
        }
    }
};

export const addContextTypes: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = contextTypes.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextDescription.create({
        data: {
            identifier: decoded.identifier.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            syntax: directoryStringToString(decoded.information.syntax),
            assertionSyntax: decoded.information.assertionSyntax
                ? directoryStringToString(decoded.information.assertionSyntax)
                : undefined,
        },
    }));
};

export const addDITContextUse: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = dITContextUse.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.contextUseRule.create({
        data: {
            entry_id: vertex.dse.id,
            attributeType: decoded.identifier.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            mandatory: decoded.information.mandatoryContexts
                ?.map((oid) => oid.toString())
                .join(" "),
            optional: decoded.information.optionalContexts
                ?.map((oid) => oid.toString())
                .join(" "),
        }
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.ditContextUse) {
            vertex.dse.subentry.ditContextUse.push(decoded);
        } else {
            vertex.dse.subentry.ditContextUse = [ decoded ];
        }
    }
};

export const addMatchingRules: SpecialAttributeDatabaseEditor = NOOP;

export const addMatchingRuleUse: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const decoded = matchingRuleUse.decoderFor["&Type"]!(value.value);
    pendingUpdates.otherWrites.push(ctx.db.matchingRuleUse.create({
        data: {
            entry_id: vertex.dse.id,
            identifier: decoded.identifier.toString(),
            name: decoded.name
                ? decoded.name
                    .map(directoryStringToString)
                    .map((str) => str.replace(/\|/g, ""))
                    .join("|")
                : null,
            description: decoded.description
                ? directoryStringToString(decoded.description)
                : undefined,
            obsolete: decoded.obsolete,
            information: decoded.information
                .map((oid) => oid.toString())
                .join(" "),
        },
    }));
    if (vertex.dse.subentry) {
        if (vertex.dse.subentry.matchingRuleUse) {
            vertex.dse.subentry.matchingRuleUse.push(decoded);
        } else {
            vertex.dse.subentry.matchingRuleUse = [ decoded ];
        }
    }
};

export const addLdapSyntaxes: SpecialAttributeDatabaseEditor = NOOP;
export const addGoverningStructureRule: SpecialAttributeDatabaseEditor = NOOP;
export const addStructuralObjectClass: SpecialAttributeDatabaseEditor = NOOP;
export const addNamingContexts: SpecialAttributeDatabaseEditor = NOOP;
export const addAltServer: SpecialAttributeDatabaseEditor = NOOP;
export const addSupportedExtension: SpecialAttributeDatabaseEditor = NOOP;
export const addSupportedControl: SpecialAttributeDatabaseEditor = NOOP;
export const addSupportedSASLMechanisms: SpecialAttributeDatabaseEditor = NOOP;
export const addSupportedLDAPVersion: SpecialAttributeDatabaseEditor = NOOP;
export const addSupportedFeatures: SpecialAttributeDatabaseEditor = NOOP;
export const addAccessControlSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addCollectiveAttributeSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addContextDefaultSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addServiceAdminSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addPwdAdminSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addSubschemaSubentryList: SpecialAttributeDatabaseEditor = NOOP;
export const addHasSubordinates: SpecialAttributeDatabaseEditor = NOOP;
export const addCollectiveExclusions: SpecialAttributeDatabaseEditor = NOOP;
