import type {
    Context,
    Vertex,
    Value,
    SpecialAttributeDatabaseEditor,
    PendingUpdates,
} from "../types";
import {
    _decode_SubtreeSpecification,
} from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
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

export const removeObjectClass: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    // Note that schema validation must occur elsewhere.
    vertex.dse.objectClass.delete(value.value.objectIdentifier.toString());
    pendingUpdates.otherWrites.push(ctx.db.entryObjectClass.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            object_class: value.value.objectIdentifier.toString(),
        },
    }));
};

export const removeAccessControlScheme: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.entryAccessControlScheme.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            accessControlScheme: value.value.objectIdentifier.toString(),
        },
    }));
};

export const removeAdministrativeRole: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    if (!vertex.dse.admPoint) {
        return;
    }
    vertex.dse.admPoint.administrativeRole.delete(value.value.objectIdentifier.toString());
    pendingUpdates.otherWrites.push(ctx.db.entryAdministrativeRole.deleteMany({
        where: {
            entry_id: vertex.dse.id,
            administrativeRole: value.value.objectIdentifier.toString(),
        },
    }));
};

export const removeSubtreeSpecification: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const subtree = _decode_SubtreeSpecification(value.value);
    pendingUpdates.otherWrites.push(ctx.db.subtreeSpecification.deleteMany({
        where: {
            entry_id: vertex.dse.id,
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

// export const removePwdStartTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

export const removePwdExpiryTime: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const password = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            pwdExpiryTime: true,
        },
    });
    if (!password) {
        return; // TODO: Should this throw an error?
    }
    if (password.pwdExpiryTime?.valueOf() === value.value.generalizedTime.valueOf()) {
        pendingUpdates.otherWrites.push(ctx.db.password.updateMany({
            where: {
                entry_id: vertex.dse.id,
            },
            data: {
                pwdExpiryTime: null,
            },
        }));
    }
};

export const removePwdEndTime: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    const password = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            pwdEndTime: true,
        },
    });
    if (!password) {
        return; // TODO: Should this throw an error?
    }
    if (password.pwdEndTime?.valueOf() === value.value.generalizedTime.valueOf()) {
        pendingUpdates.otherWrites.push(ctx.db.password.updateMany({
            where: {
                entry_id: vertex.dse.id,
            },
            data: {
                pwdEndTime: null,
            },
        }));
    }
};

// export const removePwdFails: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const removePwdFailureTime: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const removePwdGracesUsed: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const removeUserPwdHistory: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {

// };

// export const removeUserPwdRecentlyExpired: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     const password = await ctx.db.password.findUnique({
//         where: {
//             entry_id: vertex.dse.id,
//         },
//         select: {
//             pwdEndTime: true,
//         },
//     });
//     if (!password) {
//         return; // TODO: Should this throw an error?
//     }
//     if (password.pwdEndTime?.valueOf() === value.value.generalizedTime.valueOf()) {
//         pendingUpdates.otherWrites.push(ctx.db.password.updateMany({
//             where: {
//                 entry_id: vertex.dse.id,
//             },
//             data: {
//                 pwdEndTime: null,
//             },
//         }));
//     }
// };

export const removePwdModifyEntryAllowed: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdModifyEntryAllowed.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.boolean,
            },
        }),
    );
};

export const removePwdChangeAllowed: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdChangeAllowed.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.boolean,
            },
        }),
    );
};

export const removePwdMaxAge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdMaxAge.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdExpiryAge: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdExpiryAge.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdMinLength: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdMinLength.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

// export const removePwdVocabulary: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     await ctx.db.pwdVocabulary.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//             value: value.value.utf8String,
//         },
//     });
// };

// export const removePwdAlphabet: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     await ctx.db.pwdAlphabet.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//             value: value,
//         },
//     });
// };

export const removePwdDictionaries: SpecialAttributeDatabaseEditor = async (
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

export const removePwdExpiryWarning: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdExpiryWarning.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdGraces: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdGraces.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdFailureDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdFailureDuration.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdLockoutDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdLockoutDuration.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdMaxFailures: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdMaxFailures.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdMaxTimeInHistory: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdMaxTimeInHistory.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdMinTimeInHistory: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdMinTimeInHistory.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdHistorySlots: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdHistorySlots.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

export const removePwdRecentlyExpiredDuration: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(
        ctx.db.pwdRecentlyExpiredDuration.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                value: value.value.integer,
            },
        }),
    );
};

// export const removePwdEncAlg: SpecialAttributeDatabaseEditor = async (
//     ctx: Readonly<Context>,
//     vertex: Vertex,
//     value: Value,
//     pendingUpdates: PendingUpdates,
// ): Promise<void> => {
//     await ctx.db.pwdEncAlg.deleteMany({
//         where: {
//             entry_id: vertex.dse.id,
//             value: value,
//         },
//     });
// };

export const removeUserPassword: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.delete({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};


export const removeUserPwd: SpecialAttributeDatabaseEditor = async (
    ctx: Readonly<Context>,
    vertex: Vertex,
    value: Value,
    pendingUpdates: PendingUpdates,
): Promise<void> => {
    pendingUpdates.otherWrites.push(ctx.db.password.delete({
        where: {
            entry_id: vertex.dse.id,
        },
    }));
};
