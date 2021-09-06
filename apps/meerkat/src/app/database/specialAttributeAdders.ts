import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "../types";
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
import encryptPassword from "../x500/encryptPassword";
import getScryptAlgorithmIdentifier from "../x500/getScryptAlgorithmIdentifier";
import { Knowledge } from "@prisma/client";
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

/* DATABASE WRITERS */

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
    const newOIDs = [
        ...Array.from(vertex.dse.objectClass),
        value.value.objectIdentifier.toString(),
    ];
    pendingUpdates.entryUpdate.objectClass = newOIDs.join(" ");
};

// TODO:
// export const commonName: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: StoredAttributeValueWithContexts,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.entryUpdate.commonName = value.ds
// };

// TODO: Hierarchy

export const addAccessControlScheme: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.entryUpdate.accessControlScheme = value.value.objectIdentifier.toString();
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
    pendingUpdates.entryUpdate.administrativeRole = [
        ...Array.from(vertex.dse.admPoint?.administrativeRole ?? []),
        value.value.objectIdentifier.toString(),
    ].join(" ");
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
    const pwd = _decode_UserPwd(value.value);
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
