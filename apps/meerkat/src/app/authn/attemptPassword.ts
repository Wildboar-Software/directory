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
import { DERElement, ObjectIdentifier } from "asn1-ts";

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
        await ctx.db.password.update({
            where: {
                entry_id: vertex.dse.id,
            },
            data: {
                pwdFails: 0,
            },
        });
    } else {
        await ctx.db.password.update({
            where: {
                entry_id: vertex.dse.id,
            },
            data: {
                pwdFailureTime: new Date(),
                pwdFails: password.pwdFails + 1,
            },
        });
    }

    return passwordIsCorrect;
}

export default attemptPassword;
