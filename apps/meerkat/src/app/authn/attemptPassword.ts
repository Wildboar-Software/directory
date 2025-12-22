import type { Context, Vertex, Value } from "../types/index.js";
import {
    UserPwd, _encode_UserPwd,
} from "@wildboar/x500/PasswordPolicy";
import * as crypto from "crypto";
import encryptPassword from "./encryptPassword.js";
import type {
    SimpleCredentials,
} from "@wildboar/x500/DirectoryAbstractService";
import { compareAlgorithmIdentifier } from "@wildboar/x500";
import { UserPwd_encrypted } from "@wildboar/x500/PasswordPolicy";
import { AlgorithmIdentifier } from "@wildboar/pki-stub";
import {
    DERElement,
    ObjectIdentifier,
    ASN1TagClass,
    ASN1UniversalType,
    packBits,
    GeneralizedTime,
    ASN1Element,
} from "@wildboar/asn1";
import {
    pwdFails,
} from "@wildboar/x500/PasswordPolicy";
import {
    pwdFailureTime,
} from "@wildboar/x500/PasswordPolicy";
import { DER, _encodeInteger, _encodeGeneralizedTime, _decodeGeneralizedTime, _decodeInteger, _encodeBitString, _encodeOctetString } from "@wildboar/asn1/functional";
import { userPwdRecentlyExpired } from "@wildboar/x500/PasswordPolicy";
import { strict as assert } from "node:assert";
import { getAdministrativePoints } from "../dit/getAdministrativePoints.js";
import { getRelevantSubentries } from "../dit/getRelevantSubentries.js";
import { getDistinguishedName } from "../x500/getDistinguishedName.js";
import {
    pwdEndTime,
    pwdExpiryTime,
    pwdGracesUsed,
    pwdLockoutDuration,
    pwdMaxFailures,
    pwdRecentlyExpiredDuration,
    pwdStartTime,
} from "@wildboar/x500/PasswordPolicy";
import { PwdResponseValue } from "@wildboar/x500/DirectoryAbstractService";
import {
    PwdResponseValue_error_changeAfterReset,
    PwdResponseValue_error_passwordExpired,
} from "@wildboar/x500/DirectoryAbstractService";
import { removeAttribute } from "../database/entry/removeAttribute.js";
import { addValues } from "../database/entry/addValues.js";
import { pwdGraceUseTime } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdGraceUseTime.oa.js";
import { pwdLastSuccess } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLastSuccess.oa.js";
import { subSeconds, differenceInSeconds, addSeconds } from "date-fns";
import { userPwd } from "@wildboar/x500/PasswordPolicy";
import { userPassword } from "@wildboar/x500/AuthenticationFramework";
import { id_oa_pwdGraces } from "@wildboar/x500/PasswordPolicy";
import { pwdExpireWarning } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdExpireWarning.oa.js";
import { pwdLockout } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdLockout.oa.js";
import { pwdAccountLockedTime } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdAccountLockedTime.oa.js";
import { pwdReset } from "@wildboar/parity-schema/src/lib/modules/LDAPPasswordPolicy/pwdReset.oa.js";
import { groupByOID } from "../utils/groupByOID.js";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import {
    SimpleCredentials_validity_time1,
} from "@wildboar/x500/DirectoryAbstractService";
import { SimpleCredentials_validity_time2 } from "@wildboar/x500/DirectoryAbstractService";
import { digestOIDToNodeHash } from "../pki/digestOIDToNodeHash.js";
import { attributeValueFromDB, DBAttributeValue } from "../database/attributeValueFromDB.js";
import type { AttributeValueUncheckedCreateInput } from "../generated/models/AttributeValue.js";
import type { Prisma } from "../generated/client.js";
import { PrismaPromise } from "@prisma/client/runtime/client";

const START_TIME_OID: string = pwdStartTime["&id"].toString();
const EXPIRY_TIME_OID: string = pwdExpiryTime["&id"].toString();
const LOCKED_TIME_OID: string = pwdAccountLockedTime["&id"].toString();
// const GRACE_USE_TIME_OID: string = pwdGraceUseTime["&id"].toString();
// const FAIL_TIME_OID: string = pwdFailureTime["&id"].toString();
// const SUCCESS_TIME_OID: string = pwdLastSuccess["&id"].toString();
const END_TIME_OID: string = pwdEndTime["&id"].toString();

const ID_EXPIRE_WARNING: string = pwdExpireWarning["&id"].toString();
const ID_GRACES: string = id_oa_pwdGraces.toString();
const ID_LOCKOUT_DURATION: string = pwdLockoutDuration["&id"].toString();
const ID_MAX_FAILURES: string = pwdMaxFailures["&id"].toString();
const ID_RECENTLY_EXPIRED_DURATION: string = pwdRecentlyExpiredDuration["&id"].toString();

function decodeGeneralizedTime (row?: DBAttributeValue): GeneralizedTime | undefined {
    if (!row) {
        return undefined;
    }
    const el = attributeValueFromDB(row);
    return _decodeGeneralizedTime(el);
}

function decodeInt (row?: DBAttributeValue): number | undefined {
    if (!row) {
        return undefined;
    }
    const el = attributeValueFromDB(row);
    return Number(_decodeInteger(el));
}

async function compareUserPwd (a: UserPwd, b: UserPwd): Promise<boolean | undefined> {
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
    const newly_encrypted = await encryptPassword(alg, Buffer.from(not_encrypted.clear, "utf-8"));
    if (!newly_encrypted) {
        return undefined; // Algorithm not understood.
    }
    return (
        (newly_encrypted.length === already_encrypted.encrypted.encryptedString.length)
        && crypto.timingSafeEqual(newly_encrypted, already_encrypted.encrypted.encryptedString)
    );
}

type ValidityTime =
    | SimpleCredentials_validity_time1
    | SimpleCredentials_validity_time2;

function getTimeFromValidity (v?: ValidityTime): Date | undefined {
    if (!v) {
        return undefined;
    }
    if ("utc" in v) {
        return v.utc;
    } else if ("gt" in v) {
        return v.gt;
    } else {
        return undefined;
    }
}

async function assertSimpleCreds (asserted_creds: SimpleCredentials, correct_pw: UserPwd): Promise<boolean | undefined> {
    const asserted_pw = asserted_creds.password;
    if (!asserted_pw) {
        return undefined;
    }
    if ("userPwd" in asserted_pw) {
        return compareUserPwd(asserted_pw.userPwd, correct_pw);
    }
    else if ("unprotected" in asserted_pw) {
        const a: UserPwd = {
            clear: Buffer.from(asserted_pw.unprotected).toString("utf8"),
        };
        return compareUserPwd(a, correct_pw);
    }
    else if ("protected_" in asserted_pw) {
        const v = asserted_creds.validity;
        if (!v || !v.time1) {
            // If there's no validity supplied, or no time1, we assume the protected
            // password is just hashed directly, so we convert it to a UserPwd
            // and give that a shot.
            const a: UserPwd = {
                encrypted: new UserPwd_encrypted(
                    asserted_pw.protected_.algorithmIdentifier,
                    packBits(asserted_pw.protected_.hashValue),
                ),
            };
            return compareUserPwd(a, correct_pw);
        }
        // Otherwise, we assume it is encoded according to ITU Recommendation
        // X.511 (2019), Annex E.
        const time1 = getTimeFromValidity(v.time1);
        if (!time1) {
            return undefined;
        }
        const now = new Date();
        if (now > time1) {
            return false;
        }
        const hash_name = digestOIDToNodeHash.get(asserted_pw.protected_.algorithmIdentifier.algorithm.toString());
        if (!hash_name) {
            return undefined;
        }
        // X511-AnnexE-Hashable1 ::= SEQUENCE {
        //     name        DistinguishedName,
        //     time1       GeneralizedTime,
        //     random1     BIT STRING,
        //     password    OCTET STRING }
        // Meerkats-Actual-Hashable1 ::= SEQUENCE {
        //     name        DistinguishedName,
        //     time1       GeneralizedTime,
        //     random1     BIT STRING OPTIONAL,
        //     password    UserPwd }
        const components1: ASN1Element[] = [
            _encode_DistinguishedName(asserted_creds.name, DER),
            _encodeGeneralizedTime(time1, DER),
        ];
        if (v.random1) {
            components1.push(_encodeBitString(v.random1, DER));
        }
        components1.push(_encode_UserPwd(correct_pw, DER));
        const hashable1 = DERElement.fromSequence(components1).toBytes();
        const hasher1 = crypto.createHash(hash_name);
        hasher1.update(hashable1);
        const f1 = hasher1.digest();
        const asserted_hash = packBits(asserted_pw.protected_.hashValue);
        if (!v.time2) {
            // If there is no time2 defined, we assume that the user used
            // Protected1, so now we are ready to compare hashes.
            return (
                (f1.length === asserted_hash.length)
                && crypto.timingSafeEqual(f1, asserted_hash)
            );
        }

        const time2 = getTimeFromValidity(v.time2);
        if (!time2) {
            return undefined;
        }

        // X511-AnnexE-Hashable2 ::= SEQUENCE {
        //     f1          OCTET STRING, -- hashed octet string from above
        //     time2       GeneralizedTime,
        //     random2     BIT STRING }
        // Meerkats-Actual-Hashable2 ::= SEQUENCE {
        //     f1          OCTET STRING, -- hashed octet string from above
        //     time2       GeneralizedTime,
        //     random2     BIT STRING OPTIONAL }
        const components2: ASN1Element[] = [
            _encodeOctetString(f1, DER),
            _encodeGeneralizedTime(time2, DER),
        ];
        if (v.random2) {
            components2.push(_encodeBitString(v.random2, DER));
        }

        const hashable2 = DERElement.fromSequence(components1).toBytes();
        const hasher2 = crypto.createHash(hash_name);
        hasher2.update(hashable2);
        const f2 = hasher2.digest();
        return (
            (f2.length === asserted_hash.length)
            && crypto.timingSafeEqual(f2, asserted_hash)
        );
    } else {
        return undefined;
    }
}

export
interface AttemptPasswordReturn {
    authorized: boolean | undefined;
    pwdResponse?: PwdResponseValue;
    unbind?: boolean;
}

/* TODO: When this is re-written, it should return an enum instead.
- Valid
- Invalid
- Expired
- Ended
- Blocked
*/
/**
 * @summary Attempts a password for a bind operation.
 * @description
 *
 * Attempts a password as a part of a bind operation. This function updates the
 * failed attempts count, failure timestamp, and other operational attributes.
 *
 * This function also does not disclose whether an account is locked for
 * security reasons: if it is disclosed when the credentials are invalid, it
 * risks discovery of entry names, and if the credentials are valid, nefarious
 * users could repeatedly guess passwords until they get a "blocked" error to
 * discover what the correct password was prior to the lock.
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
    attemptedCreds: SimpleCredentials,
): Promise<AttemptPasswordReturn> {
    const password1 = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
        select: {
            algorithm_oid: true,
            algorithm_parameters_der: true,
            encrypted: true,
        },
    });

    const entry_value_rows = await ctx.db.attributeValue.findMany({
        where: {
            entry_id: vertex.dse.id,
            type_oid: {
                in: [
                    userPwdRecentlyExpired["&id"].toBytes(),
                    pwdFails["&id"].toBytes(),
                    pwdGracesUsed["&id"].toBytes(),
                    pwdLockout["&id"].toBytes(),
                    pwdReset["&id"].toBytes(),

                    // GeneralizedTime syntaxes
                    pwdStartTime["&id"].toBytes(),
                    pwdExpiryTime["&id"].toBytes(),
                    pwdAccountLockedTime["&id"].toBytes(),
                    pwdEndTime["&id"].toBytes(),

                ],
            },
        },
        select: {
            type_oid: true,
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    });
    const entry_attrs = groupByOID(entry_value_rows, (r) => ObjectIdentifier.fromBytes(r.type_oid).toString());
    const start_time = decodeGeneralizedTime(entry_attrs[START_TIME_OID]?.[0]);
    const expiry_time = decodeGeneralizedTime(entry_attrs[EXPIRY_TIME_OID]?.[0]);
    const locked_time = decodeGeneralizedTime(entry_attrs[LOCKED_TIME_OID]?.[0]);
    const end_time = decodeGeneralizedTime(entry_attrs[END_TIME_OID]?.[0]);

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

    const subentry_value_rows = await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: relevantSubentries.map((s) => s.dse.id),
            },
            type_oid: {
                in: [
                    pwdExpireWarning["&id"].toBytes(),
                    id_oa_pwdGraces.toBytes(),
                    pwdLockoutDuration["&id"].toBytes(),
                    pwdMaxFailures["&id"].toBytes(),
                    pwdRecentlyExpiredDuration["&id"].toBytes(),
                ],
            },
        },
        select: {
            type_oid: true,
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    });

    const subentry_attrs = groupByOID(subentry_value_rows, (r) => ObjectIdentifier.fromBytes(r.type_oid).toString());
    const warning_time: number = subentry_attrs[ID_EXPIRE_WARNING]
        ?.map((row) => decodeInt(row)).sort().pop() // Highest warning time
        ?? 0;
    const graces = subentry_attrs[ID_GRACES]
        ?.map((row) => decodeInt(row)).sort()[0] // Lowest number of graces.
        ?? 0;
    // TODO: Cautiously check for overflow.
    const lockout_duration = subentry_attrs[ID_LOCKOUT_DURATION]
        ?.map((row) => decodeInt(row)).sort().pop() // Highest lockout duration
        ?? Number.MAX_SAFE_INTEGER; // Default is infinity, but this is effectively close enough.
    const max_failures = subentry_attrs[ID_MAX_FAILURES]
        ?.map((row) => decodeInt(row)).sort()[0] // Lowest number of max failures.
        ?? Number.MAX_SAFE_INTEGER; // Default is no maximum on failures, but this is close enough.
    const recently_expired_duration = subentry_attrs[ID_RECENTLY_EXPIRED_DURATION]
        ?.map((row) => decodeInt(row)).sort()[0] // Lowest recently expired duration.
        ?? 0;

    const now = new Date();
    const lockedOut: boolean = (entry_attrs[pwdLockout["&id"].toString()]?.[0]?.content_octets[0] ?? 0) > 0;
    if (lockedOut) {
        const lockout_end_time = locked_time && addSeconds(locked_time, lockout_duration);
        if (lockout_end_time && (now < lockout_end_time)) {
            return {
                authorized: false,
                unbind: true,
            };
        }
        // If the lockout has expired, we delete it, and continue.
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                type_oid: {
                    in: [
                        pwdLockout["&id"].toBytes(),
                        pwdAccountLockedTime["&id"].toBytes(),
                    ],
                },
            }
        })
            .then() // INTENTIONAL_NO_AWAIT
            .catch((e) => ctx.log.error(ctx.i18n.t("log:failed_to_delete_pwd_lockout", { e }))); // If we fail, we just let it fail.
    }
    const passwordRecentlyExpiredValue = entry_attrs[userPwdRecentlyExpired["&id"].toString()]?.[0];
    const password2 = passwordRecentlyExpiredValue
        ? (() => {
            const el = attributeValueFromDB(passwordRecentlyExpiredValue);
            return userPwdRecentlyExpired.decoderFor["&Type"]!(el);
        })()
        : undefined;
    if (!password1 && !password2) {
        return { authorized: undefined };
    }
    const fails: number = decodeInt(entry_attrs[pwdFails["&id"].toString()]?.[0]) ?? 0;

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

    let passwordIsCorrect: boolean = false;
    let expiredPasswordUsed: boolean = false;
    for (const valid_pwd of [ userPwd1, userPwd2 ]) {
        if (!valid_pwd) {
            continue;
        }
        if ((await assertSimpleCreds(attemptedCreds, valid_pwd)) === true) {
            passwordIsCorrect = true;
            if (valid_pwd === userPwd2) {
                expiredPasswordUsed = true;
            }
            break;
        }
    }
    const nowElement = _encodeGeneralizedTime(new Date(), DER) as DERElement;
    if (!passwordIsCorrect) {
        const newFailsEl = _encodeInteger(fails + 1, DER) as DERElement;
        const new_attrs: AttributeValueUncheckedCreateInput[] = [
            {
                entry_id: vertex.dse.id,
                type_oid: pwdFails["&id"].toBytes(),
                operational: true,
                tag_class: ASN1TagClass.universal,
                constructed: false,
                tag_number: ASN1UniversalType.integer,
                content_octets: newFailsEl.value,
                jer: fails + 1,
            },
            {
                entry_id: vertex.dse.id,
                type_oid: pwdFailureTime["&id"].toBytes(),
                operational: true,
                tag_class: nowElement.tagClass,
                constructed: false,
                tag_number: nowElement.tagNumber,
                content_octets: nowElement.value,
                jer: nowElement.toJSON() as string,
            },
        ];

        if (fails + 1 > max_failures) {
            new_attrs.push({
                entry_id: vertex.dse.id,
                type_oid: pwdLockout["&id"].toBytes(),
                operational: false,
                tag_class: ASN1TagClass.universal,
                constructed: false,
                tag_number: ASN1UniversalType.boolean,
                content_octets: Buffer.from([ 0xFF ]),
                jer: true,
            });
            new_attrs.push({
                entry_id: vertex.dse.id,
                type_oid: pwdAccountLockedTime["&id"].toBytes(),
                operational: true,
                tag_class: nowElement.tagClass,
                constructed: false,
                tag_number: nowElement.tagNumber,
                content_octets: nowElement.value,
                jer: nowElement.toJSON() as string,
            });
        }

        const dbPromises: PrismaPromise<any>[] = [
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type_oid: {
                        in: [
                            pwdFails["&id"].toBytes(),
                            pwdFailureTime["&id"].toBytes(),
                        ],
                    },
                },
            }),
            ctx.db.attributeValue.createMany({
                data: new_attrs,
            }),
        ];
        await ctx.db.$transaction(dbPromises);
        return {
            authorized: false,
            unbind: true,
        };
    }

    if (start_time && (start_time > now)) {
        return { authorized: false };
    }
    /**
     * IMPORTANT: It is critical that we wait for the user to have supplied
     * the correct password before we can return a passwordExpired error.
     * InvalidCredentials MUST be returned to the user if they guess the
     * credentials incorrectly, otherwise, these two errors could be used
     * to oracle for user accounts that are expired.
     */
    if (end_time && (end_time <= now)) {
        // This should result in a directoryBindError with securityproblem.passwordExpired.
        return {
            authorized: false,
            pwdResponse: new PwdResponseValue(
                undefined,
                PwdResponseValue_error_passwordExpired,
            ),
        };
    }

    if (expiry_time && (expiry_time <= now)) {
        const gracesUsed: number = decodeInt(entry_attrs[pwdGracesUsed["&id"].toString()]?.[0]) ?? 0;
        const expiredPasswordExpirationTime = addSeconds(expiry_time, recently_expired_duration);
        if ((expiredPasswordExpirationTime > now) && expiredPasswordUsed) {
            return {
                authorized: false,
                pwdResponse: new PwdResponseValue(
                    {
                        graceRemaining: (graces - gracesUsed),
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
            authorized: (gracesUsed <= graces),
            pwdResponse: new PwdResponseValue(
                {
                    graceRemaining: (graces - (gracesUsed + 1)),
                },
                PwdResponseValue_error_passwordExpired,
            ),
        };
    }
    const zeroFailsEl = _encodeInteger(0, DER) as DERElement;
    await ctx.db.$transaction([
        ctx.db.attributeValue.deleteMany({
            where: {
                entry_id: vertex.dse.id,
                type_oid: {
                    in: [
                        pwdFails["&id"].toBytes(),
                        pwdLastSuccess["&id"].toBytes(),
                    ],
                },
            },
        }),
        ctx.db.attributeValue.createMany({
            data: [
                {
                    entry_id: vertex.dse.id,
                    type_oid: pwdFails["&id"].toBytes(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.integer,
                    content_octets: zeroFailsEl.value,
                    jer: 0,
                },
                {
                    entry_id: vertex.dse.id,
                    type_oid: pwdLastSuccess["&id"].toBytes(),
                    operational: true,
                    tag_class: ASN1TagClass.universal,
                    constructed: false,
                    tag_number: ASN1UniversalType.generalizedTime,
                    content_octets: nowElement.value,
                    jer: now.toISOString(),
                },
            ],
        }),
    ]);

    const expirationWarningStart: Date | null = expiry_time
        ? subSeconds(expiry_time, warning_time)
        : null;

    const password_must_be_reset: boolean = (entry_attrs[pwdReset["&id"].toString()]?.[0]?.content_octets[0] ?? 0) > 0;

    const returnPwdResponse = (
        (expirationWarningStart && (expirationWarningStart <= now))
        || password_must_be_reset
    );
    return {
        authorized: true,
        /**
         * We don't want to display this if it is empty, because WireShark does
         * not recognize the [2] tag, so it fails to display the bind result if
         * this is present.
         */
        pwdResponse: returnPwdResponse
            ? new PwdResponseValue(
                (expirationWarningStart && (expirationWarningStart <= now))
                    ? {
                        timeLeft: Math.abs(differenceInSeconds(now, expiry_time!)),
                    }
                    : undefined,
                password_must_be_reset
                    ? PwdResponseValue_error_changeAfterReset
                    : undefined,
            )
            : undefined,
    };
}

export default attemptPassword;
