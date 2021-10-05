import type {
    UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import * as crypto from "crypto";
import encryptPassword from "./encryptPassword";
import type {
    SimpleCredentials_password,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SimpleCredentials-password.ta";
import compareAlgorithmIdentifier from "@wildboar/x500/src/lib/comparators/compareAlgorithmIdentifier";
import compareUint8Arrays from "@wildboar/x500/src/lib/comparators/compareUint8Arrays";

export
function attemptPassword (
    attemptedPassword: SimpleCredentials_password,
    storedPassword: UserPwd,
): boolean | undefined {
    if ("unprotected" in attemptedPassword) {
        const attemptedClearPassword = attemptedPassword.unprotected;
        if ("clear" in storedPassword) {
            const storedClearPassword = Buffer.from(storedPassword.clear, "utf-8");
            return (
                (storedClearPassword.length === attemptedClearPassword.length)
                && crypto.timingSafeEqual(storedClearPassword, attemptedClearPassword)
            );
        } else if ("encrypted" in storedPassword) {
            const encryptedAttemptedPassword = encryptPassword(
                storedPassword.encrypted.algorithmIdentifier,
                attemptedClearPassword,
            );
            if (!encryptedAttemptedPassword) {
                return undefined;
            }
            return (
                (storedPassword.encrypted.encryptedString.length === encryptedAttemptedPassword.length)
                && crypto.timingSafeEqual(storedPassword.encrypted.encryptedString, encryptedAttemptedPassword)
            );
        } else {
            return undefined;
        }
    } else if ("protected_" in attemptedPassword) {
        const encryptedAttemptedPassword = attemptedPassword.protected_.hashValue;
        if ("clear" in storedPassword) {
            const storedClearPassword = Buffer.from(storedPassword.clear, "utf-8");
            const encryptedStoredPassword = encryptPassword(
                attemptedPassword.protected_.algorithmIdentifier,
                storedClearPassword,
            );
            if (!encryptedStoredPassword) {
                return undefined;
            }
            return (
                (encryptedStoredPassword.length === encryptedAttemptedPassword.length)
                && crypto.timingSafeEqual(encryptedStoredPassword, encryptedAttemptedPassword)
            );
        } else if ("encrypted" in storedPassword) {
            const storedAlgID = storedPassword.encrypted.algorithmIdentifier;
            const attemptedAlgID = attemptedPassword.protected_.algorithmIdentifier;
            return (
                compareAlgorithmIdentifier(storedAlgID, attemptedAlgID)
                && (storedPassword.encrypted.encryptedString.length === encryptedAttemptedPassword.length)
                && crypto.timingSafeEqual(storedPassword.encrypted.encryptedString, encryptedAttemptedPassword)
            );
        } else {
            return undefined;
        }
    } else if ("userPwd" in attemptedPassword) {
        // This code was copied from @wildboar/x500/src/lib/matching/equality/userPwdMatch.ts.
        const a = attemptedPassword.userPwd;
        const v = storedPassword;
        if (("clear" in a) && ("clear" in v)) {
            return (a.clear === v.clear);
        } else if (("encrypted" in a) && ("encrypted" in v)) {
            return (
                compareUint8Arrays(a.encrypted.encryptedString, v.encrypted.encryptedString)
                && compareAlgorithmIdentifier(a.encrypted.algorithmIdentifier, v.encrypted.algorithmIdentifier)
            );
        } else if (("encrypted" in a) && ("clear" in v)) {
            const alg = a.encrypted.algorithmIdentifier;
            const result = encryptPassword(alg, Buffer.from(v.clear, "utf-8"));
            if (!result) {
                return false; // Algorithm not understood.
            }
            return compareUint8Arrays(result, a.encrypted.encryptedString);
        } else if (("clear" in a) && ("encrypted" in v)) {
            const alg = v.encrypted.algorithmIdentifier;
            const result = encryptPassword(alg, Buffer.from(a.clear, "utf-8"));
            if (!result) {
                return false; // Algorithm not understood.
            }
            return compareUint8Arrays(result, v.encrypted.encryptedString);
        } else {
            return false;
        }
    } else {
        return undefined;
    }

}

export default attemptPassword;
