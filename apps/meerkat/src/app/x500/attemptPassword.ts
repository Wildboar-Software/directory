import type {
    UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import * as crypto from "crypto";
import encryptPassword from "./encryptPassword";

export
function attemptPassword (attemptedPassword: Uint8Array, storedPassword: UserPwd): boolean | undefined {
    if ("clear" in storedPassword) {
        const storedClearPassword = Buffer.from(storedPassword.clear, "utf-8");
        return (
            (storedClearPassword.length === attemptedPassword.length)
            && crypto.timingSafeEqual(storedClearPassword, attemptedPassword)
        );
    } else if ("encrypted" in storedPassword) {
        const encryptedAttemptedPassword = encryptPassword(
            storedPassword.encrypted.algorithmIdentifier,
            attemptedPassword,
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
}

export default attemptPassword;
