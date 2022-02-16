import type { Context, Vertex } from "@wildboar/meerkat-types";
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
    BERElement,
} from "asn1-ts";
import {
    pwdFails,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFails.oa";
import {
    pwdFailureTime,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/pwdFailureTime.oa";
import { DER, _encodeInteger, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";

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
): Promise<boolean | undefined> {
    const password = await ctx.db.password.findUnique({
        where: {
            entry_id: vertex.dse.id,
        },
    });
    if (!password) {
        return undefined;
    }
    const failsRow = await ctx.db.attributeValue.findFirst({
        where: {
            entry_id: vertex.dse.id,
            type: pwdFails["&id"].toString(),
        },
        select: {
            ber: true,
        },
    });
    const fails = failsRow
        ? (() => {
            const el = new BERElement();
            el.fromBytes(failsRow.ber);
            return Number(el.integer);
        })()
        : 0;
    const userPwd: UserPwd = {
        encrypted: new UserPwd_encrypted(
            new AlgorithmIdentifier(
                ObjectIdentifier.fromString(password.algorithm_oid),
                password.algorithm_parameters_der
                    ? ((): DERElement => {
                        const el = new DERElement();
                        el.fromBytes(password.algorithm_parameters_der);
                        return el;
                    })()
                    : undefined,
            ),
            password.encrypted,
        ),
    };
    let passwordIsCorrect: boolean = false;
    if ("unprotected" in attemptedPassword) {
        const attemptedClearPassword = attemptedPassword.unprotected;
        const encryptedAttemptedPassword = encryptPassword(
            userPwd.encrypted.algorithmIdentifier,
            attemptedClearPassword,
        );
        if (!encryptedAttemptedPassword) {
            return undefined;
        }
        passwordIsCorrect = (
            (userPwd.encrypted.encryptedString.length === encryptedAttemptedPassword.length)
            && crypto.timingSafeEqual(userPwd.encrypted.encryptedString, encryptedAttemptedPassword)
        );
    } else if ("protected_" in attemptedPassword) {
        const encryptedAttemptedPassword = attemptedPassword.protected_.hashValue;
        const storedAlgID = userPwd.encrypted.algorithmIdentifier;
        const attemptedAlgID = attemptedPassword.protected_.algorithmIdentifier;
        passwordIsCorrect = (
            compareAlgorithmIdentifier(storedAlgID, attemptedAlgID)
            && (userPwd.encrypted.encryptedString.length === encryptedAttemptedPassword.length)
            && crypto.timingSafeEqual(userPwd.encrypted.encryptedString, encryptedAttemptedPassword)
        );
    } else if ("userPwd" in attemptedPassword) {
        // This code was copied from @wildboar/x500/src/lib/matching/equality/userPwdMatch.ts.
        const a = attemptedPassword.userPwd;
        const v = userPwd;
        if ("encrypted" in a) {
            passwordIsCorrect = (
                (a.encrypted.encryptedString.length === v.encrypted.encryptedString.length)
                && crypto.timingSafeEqual(userPwd.encrypted.encryptedString, v.encrypted.encryptedString)
                && compareAlgorithmIdentifier(a.encrypted.algorithmIdentifier, v.encrypted.algorithmIdentifier)
            );
        } else if ("clear" in a) {
            const alg = v.encrypted.algorithmIdentifier;
            const result = encryptPassword(alg, Buffer.from(a.clear, "utf-8"));
            if (!result) {
                return undefined; // Algorithm not understood.
            }
            passwordIsCorrect = (
                (result.length === v.encrypted.encryptedString.length)
                && crypto.timingSafeEqual(result, v.encrypted.encryptedString)
            );
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }

    if (passwordIsCorrect) {
        await ctx.db.$transaction([
            ctx.db.attributeValue.deleteMany({
                where: {
                    entry_id: vertex.dse.id,
                    type: pwdFails["&id"].toString(),
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
                    ber: Buffer.from(_encodeInteger(0, DER).toBytes()),
                    jer: 0,
                },
            }),
        ]);
    } else {
        const nowElement = _encodeGeneralizedTime(new Date(), DER);
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
    }

    return passwordIsCorrect;
}

export default attemptPassword;
