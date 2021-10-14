import type {
    Context,
    Vertex,
    SpecialAttributeDatabaseRemover,
    PendingUpdates,
} from "@wildboar/meerkat-types";
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

const NOOP: SpecialAttributeDatabaseRemover = async (): Promise<void> => {};

export const removeObjectClass: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    // TODO: Throw, because you cannot delete all object classes.
    // Note that schema validation must occur elsewhere.
    // vertex.dse.objectClass.clear();
    // FIXME: This should only work for auxiliary classes.
};

export const removeAccessControlScheme: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAccessControlScheme.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeAdministrativeRole: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeSubtreeSpecification: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

// export const removePwdStartTime: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdStartTime.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

export const removePwdExpiryTime: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.update({
        where: {
            entry_id: vertex.dse.id,
        },
        data: {
            pwdExpiryTime: null,
        },
    }));
};

export const removePwdEndTime: SpecialAttributeDatabaseRemover = async (
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

// export const removePwdFails: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.password.update({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         data: {
//             pwdFails: null,
//         },
//     }));
// };

// export const removePwdFailureTime: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdFailureTime.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

// export const removePwdGracesUsed: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdGracesUsed.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

// export const removeUserPwdHistory: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.userPwdHistory.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

// export const removeUserPwdRecentlyExpired: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.userPwdRecentlyExpired.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

export const removePwdModifyEntryAllowed: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdModifyEntryAllowed.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdChangeAllowed: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdChangeAllowed.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdMaxAge: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxAge.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdExpiryAge: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdExpiryAge.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdMinLength: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMinLength.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

// export const removePwdVocabulary: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdVocabulary.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

// export const removePwdAlphabet: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdAlphabet.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

export const removePwdDictionaries: SpecialAttributeDatabaseRemover = async (
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

export const removePwdExpiryWarning: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdExpiryWarning.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdGraces: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdGraces.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdFailureDuration: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdFailureDuration.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdLockoutDuration: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdLockoutDuration.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdMaxFailures: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxFailures.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdMaxTimeInHistory: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMaxTimeInHistory.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdMinTimeInHistory: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdMinTimeInHistory.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdHistorySlots: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdHistorySlots.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removePwdRecentlyExpiredDuration: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.pwdRecentlyExpiredDuration.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

// export const removePwdEncAlg: SpecialAttributeDatabaseRemover = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     pendingUpdates.otherWrites.push(ctx.db.pwdEncAlg.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//     }));
// };

export const removeUserPassword: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.delete({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeUserPwd: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.delete({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeUniqueIdentifier: SpecialAttributeDatabaseRemover = NOOP;

export const removeDITStructureRules: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.dITStructureRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeNameForms: SpecialAttributeDatabaseRemover = NOOP;

export const removeDITContentRules: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.contentRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeObjectClasses: SpecialAttributeDatabaseRemover = NOOP;

export const removeAttributeTypes: SpecialAttributeDatabaseRemover = NOOP;

export const removeFriends: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.friendship.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeContextTypes: SpecialAttributeDatabaseRemover = NOOP;

export const removeDITContextUse: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.contextUseRule.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeMatchingRules: SpecialAttributeDatabaseRemover = NOOP;

export const removeMatchingRuleUse: SpecialAttributeDatabaseRemover = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.matchingRuleUse.deleteMany({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};

export const removeLdapSyntaxes: SpecialAttributeDatabaseRemover = NOOP;

export const removeGoverningStructureRule: SpecialAttributeDatabaseRemover = NOOP;
export const removeStructuralObjectClass: SpecialAttributeDatabaseRemover = NOOP;
export const removeNamingContexts: SpecialAttributeDatabaseRemover = NOOP;
export const removeAltServer: SpecialAttributeDatabaseRemover = NOOP;
export const removeSupportedExtension: SpecialAttributeDatabaseRemover = NOOP;
export const removeSupportedControl: SpecialAttributeDatabaseRemover = NOOP;
export const removeSupportedSASLMechanisms: SpecialAttributeDatabaseRemover = NOOP;
export const removeSupportedLDAPVersion: SpecialAttributeDatabaseRemover = NOOP;
export const removeSupportedFeatures: SpecialAttributeDatabaseRemover = NOOP;
