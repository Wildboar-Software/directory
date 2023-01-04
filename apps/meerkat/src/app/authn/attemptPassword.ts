import type { Context, Vertex, Value } from "@wildboar/meerkat-types";
import type {
    UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import * as crypto from "crypto";
import encryptPassword from "./encryptPassword";
import type {
    SimpleCredentials_password,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials-password.ta";
import compareAlgorithmIdentifier from "@wildboar/x500/src/lib/comparators/compareAlgorithmIdentifier";
import { UserPwd_encrypted } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd-encrypted.ta";
import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import {
    DERElement,
    ObjectIdentifier,
    ASN1TagClass,
    ASN1UniversalType,
    packBits,
} from "asn1-ts";
import {
    pwdFails,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import {
    pwdFailureTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { DER, _encodeInteger, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import readValuesOfType from "../utils/readValuesOfType";
import { userPwdRecentlyExpired } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwdRecentlyExpired.oa";
import { strict as assert } from "node:assert";
import { getAdministrativePoints } from "../dit/getAdministrativePoints";
import { getRelevantSubentries } from "../dit/getRelevantSubentries";
import { getDistinguishedName } from "../x500/getDistinguishedName";
import { pwdEndTime, pwdExpiryTime, pwdGracesUsed, pwdRecentlyExpiredDuration, pwdStartTime } from "@wildboar/x500/src/lib/collections/attributes";
import { PwdResponseValue } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue.ta";
import {
    PwdResponseValue_error_passwordExpired,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue-error.ta";
import { removeAttribute } from "../database/entry/removeAttribute";
import { addValues } from "../database/entry/addValues";
import { pwdGraceUseTime } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceUseTime.oa";
import { pwdLastSuccess } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLastSuccess.oa";
import { subSeconds, differenceInSeconds, addSeconds } from "date-fns";
import { userPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/userPwd.oa";
import { userPassword } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/userPassword.oa";
import { id_oa_pwdGraces } from "@wildboar/x500/src/lib/modules/PasswordPolicy/id-oa-pwdGraces.va";
import { pwdExpireWarning } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdExpireWarning.oa";


function compareUserPwd (a: UserPwd, b: UserPwd): boolean | undefined {
    if ("clear" in a && "clear" in b) {
        return a.clear === b.clear;
    }
    if (("encrypted" in a) && ("encrypted" in b)) {
        return (
            (a.encrypted.encryptedString.length === b.encrypted.encryptedString.length)
            && crypto.timingSafeEqual(a.encrypted.encryptedString, b.encrypted.encryptedString)
            && compareAlgorithmIdentifier(a.encrypted.algorithmIdentifier, b.encrypted.algorithmIdentifier)
        );
    }
    if (("tagNumber" in a) || ("tagNumber" in b)) {
        // There is some unrecognized alternative in use.
        return undefined;
    }
    const [ already_encrypted, not_encrypted ] = ("encrypted" in a)
        ? [ a, b ]
        : [ b, a ];
    assert("encrypted" in already_encrypted);
    assert("clear" in not_encrypted);

    const alg = already_encrypted.encrypted.algorithmIdentifier;
    const newly_encrypted = encryptPassword(alg, Buffer.from(not_encrypted.clear, "utf-8"));
    if (!newly_encrypted) {
        return undefined; // Algorithm not understood.
    }
    return (
        (newly_encrypted.length === already_encrypted.encrypted.encryptedString.length)
        && crypto.timingSafeEqual(newly_encrypted, already_encrypted.encrypted.encryptedString)
    );
}

function simpleCredsToUserPwd (creds: SimpleCredentials_password): UserPwd | undefined {
    if ("unprotected" in creds) {
        return {
            clear: Buffer.from(creds.unprotected.buffer).toString("utf-8"),
        };
    } else if ("protected_" in creds) {
        return {
            encrypted: new UserPwd_encrypted(
                creds.protected_.algorithmIdentifier,
                packBits(creds.protected_.hashValue),
            ),
        }
    } else if ("userPwd" in creds) {
        return creds.userPwd;
    } else {
        return undefined;
    }
}

export
interface AttemptPasswordReturn {
    authorized: boolean | undefined;
    pwdResponse?: PwdResponseValue;
}

/* TODO: When this is re-written, it should return an enum instead.
- Valid
- Invalid
- Expired
- Ended
*/
/**
 * @summary Attempts a password for a bind operation.
 * @description
 *
 * Attempts a password as a part of a bind operation. This function updates the
 * failed attempts count, failure timestamp, and other operational attributes.
 *
 * @param ctx The context object
 * @param vertex The entry which is attempting to be bound
 * @param attemptedPassword The attempted password
 * @returns A boolean indicating whether the password passed or failed, or
 *  `undefined` if this cannot be determined.
 *
 * @function
 * @async
 */
export
async function attemptPassword (
    ctx: Context,
    vertex: Vertex,
    attemptedPassword: SimpleCredentials_password,
): Promise<AttemptPasswordReturn> {
    const password1 = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });

    const passwordRecentlyExpiredValue: Value | undefined
        = (await readValuesOfType(ctx, vertex, userPwdRecentlyExpired["&id"]))[0];
    const password2 = passwordRecentlyExpiredValue
        ? userPwdRecentlyExpired.decoderFor["&Type"]!(passwordRecentlyExpiredValue.value)
        : undefined;
    if (!password1 && !password2) {
        return { authorized: undefined };
    }
    const failsValue: Value | undefined = (await readValuesOfType(ctx, vertex, pwdFails["&id"]))[0];
    const fails: number = failsValue ? Number(failsValue.value.integer) : 0;

    const userPwd1: UserPwd | undefined = password1
        ? {
            encrypted: new UserPwd_encrypted(
                new AlgorithmIdentifier(
                    ObjectIdentifier.fromString(password1.algorithm_oid),
                    password1.algorithm_parameters_der
                        ? ((): DERElement => {
                            const el = new DERElement();
                            el.fromBytes(password1.algorithm_parameters_der);
                            return el;
                        })()
                        : undefined,
                ),
                password1.encrypted,
            ),
        }
        : undefined;
    const userPwd2: UserPwd | undefined = password2;

    const asserted_pwd = simpleCredsToUserPwd(attemptedPassword);
    if (!asserted_pwd) {
        return { authorized: undefined };
    }
    let passwordIsCorrect: boolean = false;
    let expiredPasswordUsed: boolean = false;
    for (const valid_pwd of [ userPwd1, userPwd2 ]) {
        if (!valid_pwd) {
            continue;
        }
        if (compareUserPwd(asserted_pwd, valid_pwd) === true) {
            passwordIsCorrect = true;
            if (valid_pwd === userPwd2) {
                expiredPasswordUsed = true;
            }
            break;
        }
    }
    const nowElement = _encodeGeneralizedTime(new Date(), DER);

    if (!passwordIsCorrect) {
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type: {
                        in: [
                            pwdFails["&id"].toString(),
                            pwdFailureTime["&id"].toString(),
                        ],
                    },
                },
            }),
            ctx.db.attributeValue.create({
                data: {
                    entry_id: vertex.dse.id,
                    type: pwdFails["&id"].toString(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.integer,
                    ber: Buffer.from(_encodeInteger(fails + 1, DER).toBytes()),
                    jer: 0,
                },
            }),
            ctx.db.attributeValue.create({
                data: {
                    entry_id: vertex.dse.id,
                    type: pwdFailureTime["&id"].toString(),
                    operational: true,
                    tag_class: nowElement.tagClass,
                    constructed: false,
                    tag_number: nowElement.tagNumber,
                    ber: Buffer.from(nowElement.toBytes()),
                    jer: nowElement.toJSON() as string,
                },
            }),
        ]);
        return { authorized: false };
    }

    const now = new Date();
    const startTimeValue: Value | undefined = (await readValuesOfType(ctx, vertex, pwdStartTime["&id"]))[0];
    const startTime: Date | undefined = startTimeValue ? startTimeValue.value.generalizedTime : undefined;
    const endTimeValue: Value | undefined = (await readValuesOfType(ctx, vertex, pwdEndTime["&id"]))[0];
    const endTime: Date | undefined = endTimeValue ? endTimeValue.value.generalizedTime : undefined;
    const expiryTimeValue: Value | undefined = (await readValuesOfType(ctx, vertex, pwdExpiryTime["&id"]))[0];
    const expiryTime: Date | undefined = expiryTimeValue ? expiryTimeValue.value.generalizedTime : undefined;
    if (startTime && (startTime > now)) {
        return { authorized: false };
    }
    /**
     * IMPORTANT: It is critical that we wait for the user to have supplied
     * the correct password before we can return a passwordExpired error.
     * InvalidCredentials MUST be returned to the user if they guess the
     * credentials incorrectly, otherwise, these two errors could be used
     * to oracle for user accounts that are expired.
     */
    if (endTime && (endTime <= now)) {
        // Actually, I don't think anything needs to be done here. Even the
        // compare operation will use `attemptPassword()`.
        // await ctx.db.password.delete({
        //     where: {
        //         entry_id: vertex.dse.id,
        //     },
        // });
        // await ctx.db.attributeValue.deleteMany({
        //     where: {
        //         entry_id: vertex.dse.id,
        //         type: userPwdRecentlyExpired["&id"].toString(),
        //     },
        // });

        // This should result in a directoryBindError with securityproblem.passwordExpired.
        return {
            authorized: false,
            pwdResponse: new PwdResponseValue(
                undefined,
                PwdResponseValue_error_passwordExpired,
            ),
        };
    }

    const targetDN = getDistinguishedName(vertex);
    const admPoints = getAdministrativePoints(vertex);
    const relevantSubentries: Vertex[] = (await Promise.all(
        admPoints.map((ap) => getRelevantSubentries(ctx, vertex, targetDN, ap)),
    ))
        .flat()
        .filter((sub) => (
            !sub.dse.subentry?.pwdAttribute
            || sub.dse.subentry.pwdAttribute.isEqualTo(userPwd["&id"])
            || sub.dse.subentry.pwdAttribute.isEqualTo(userPassword["&id"])
        ));

    if (expiryTime && (expiryTime <= now)) {
        const pwdGraces: number | undefined = (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: {
                    in: relevantSubentries.map((s) => s.dse.id),
                },
                type: id_oa_pwdGraces.toString(),
                operational: true,
            },
            select: {
                jer: true,
            },
        }))
            .map(({ jer }) => jer as number)
            // Do not reduce with initialValue = 0! Use undefined, then default to 0.
            .reduce((acc, curr) => Math.min(Number(acc ?? 10_000_000), Number(curr)), undefined)
            ?? 0;
        const gracesUsedValue: Value | undefined = (await readValuesOfType(ctx, vertex, pwdGracesUsed["&id"]))[0];
        const gracesUsed: number = gracesUsedValue ? Number(gracesUsedValue.value.integer) : 0;
        const expired_pwd_duration: number | undefined = (await ctx.db.attributeValue.findMany({
            where: {
                entry_id: {
                    in: relevantSubentries.map((s) => s.dse.id),
                },
                type: pwdRecentlyExpiredDuration["&id"].toString(),
                operational: true,
            },
            select: {
                jer: true,
            },
        }))
            .map(({ jer }) => jer as number)
            // Do not reduce with initialValue = 0! Use undefined, then default to 0.
            .reduce((acc, curr) => Math.min(Number(acc ?? 10_000_000), Number(curr)), undefined)
            ?? 0;

        const expiredPasswordExpirationTime = addSeconds(expiryTime, expired_pwd_duration);
        if ((expiredPasswordExpirationTime > now) && expiredPasswordUsed) {
            return {
                authorized: false,
                pwdResponse: new PwdResponseValue(
                    {
                        graceRemaining: (pwdGraces - gracesUsed),
                    },
                    PwdResponseValue_error_passwordExpired,
                ),
            };
        }

        const newPwdGracesUsedValue: Value = {
            type: pwdGracesUsed["&id"],
            value: _encodeInteger(gracesUsed + 1, DER),
        };
        const newPwdGracesUsedTimeValue: Value = {
            type: pwdGraceUseTime["&id"],
            value: _encodeGeneralizedTime(now, DER),
        };

        await ctx.db.$transaction([
            ...(await removeAttribute(ctx, vertex, pwdGracesUsed["&id"])),
            ...(await addValues(ctx, vertex, [newPwdGracesUsedValue], undefined, false, false)),
        ]);
        await ctx.db.$transaction(
            await addValues(ctx, vertex, [newPwdGracesUsedTimeValue], undefined, false, false),
        );

        return {
            authorized: (gracesUsed <= pwdGraces),
            pwdResponse: new PwdResponseValue(
                {
                    graceRemaining: (pwdGraces - (gracesUsed + 1)),
                },
                PwdResponseValue_error_passwordExpired,
            ),
        };
    }
    // TODO: If password has expired, return error. Make assn changePassword only.
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                type: {
                    in: [
                        pwdFails["&id"].toString(),
                        pwdLastSuccess["&id"].toString(),
                    ],
                },
            },
        }),
        ctx.db.attributeValue.createMany({
            data: [
                {
                    entry_id: vertex.dse.id,
                    type: pwdFails["&id"].toString(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.integer,
                    ber: Buffer.from(_encodeInteger(0, DER).toBytes().buffer),
                    jer: 0,
                },
                {
                    entry_id: vertex.dse.id,
                    type: pwdLastSuccess["&id"].toString(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.generalizedTime,
                    ber: Buffer.from(nowElement.toBytes().buffer),
                    jer: now.toISOString(),
                },
            ],
        }),
    ]);

    // TODO: Combine this with the above queries so all three attributes can be
    // be fetched with a single DB query.
    const expirationWarning: number = (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: relevantSubentries.map((s) => s.dse.id),
            },
            type: pwdExpireWarning["&id"].toString(),
            operational: true,
        },
        select: {
            jer: true,
        },
    }))
        .map(({ jer }) => jer as number)
        // Do not reduce with initialValue = 0! Use undefined, then default to 0.
        .reduce((acc, curr) => Math.max(Number(acc), Number(curr)), 0);

    const expirationWarningStart: Date | null = expiryTime
        ? subSeconds(expiryTime, expirationWarning)
        : null;

    return {
        authorized: true,
        pwdResponse: (expirationWarningStart && (expirationWarningStart <= now))
            ? new PwdResponseValue(
                {
                    timeLeft: Math.abs(differenceInSeconds(now, expiryTime!)),
                },
            )
            : undefined,
    };
}

export default attemptPassword;
