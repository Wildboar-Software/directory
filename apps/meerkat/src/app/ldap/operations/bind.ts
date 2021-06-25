import type { Context } from "../../types";
import type {
    BindRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindRequest.ta";
import {
    BindResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindResponse.ta";
import readEntry from "../../database/readEntry";
import findEntry from "../../x500/findEntry";
import decodeLDAPDN from "../decodeLDAPDN";
import encodeLDAPDN from "../encodeLDAPDN";
import getDistinguishedName from "../../x500/getDistinguishedName";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_invalidCredentials,
    LDAPResult_resultCode_authMethodNotSupported,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    id_at_userPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/id-at-userPwd.va";
import {
    UserPwd,
    _decode_UserPwd,
} from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import * as crypto from "crypto";
import attemptPassword from "../../x500/attemptPassword";

const USER_PWD_OID: string = id_at_userPwd.toString();
const INVALID_CREDENTIALS_MESSAGE: string = "Invalid credentials or no such object.";

function sleep (ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function invalidCredentialsError (name: Uint8Array): BindResponse {
    return new BindResponse(
        LDAPResult_resultCode_invalidCredentials,
        name,
        Buffer.from(INVALID_CREDENTIALS_MESSAGE, "utf-8"),
        undefined,
        undefined,
    );
}

function simpleSuccess (name: Uint8Array): BindResponse {
    return new BindResponse(
        LDAPResult_resultCode_success,
        name,
        Buffer.from("Success", "utf-8"),
        undefined,
        undefined,
    );
}

/**
 * The `userPassword` attribute described in ITU Recommendation X.520 is
 * problematic because it is not single-valued and has no concept of encryption.
 * This implementation prefers the `userPwd` attribute defined in ITU
 * Recommendation X.520, which is both single-valued and has a concept of
 * encryption.
 *
 * @param ctx
 * @param req
 * @returns
 */
export
async function bind (
    ctx: Context,
    req: BindRequest,
): Promise<BindResponse> {
    const version = req.version;
    if (version !== 3) {
        return new BindResponse(
            LDAPResult_resultCode_protocolError,
            req.name,
            Buffer.from(`Protocol version ${version} not supported.`, "utf-8"),
            undefined,
            undefined,
        );
    }
    // Wait a random amount of time to prevent timing attacks.
    sleep(crypto.randomInt(10000) + 10000);
    const dn = decodeLDAPDN(ctx, req.name);
    const entry = findEntry(ctx, ctx.database.data.dit, dn, true);
    if (!entry) {
        return invalidCredentialsError(req.name);
    }
    const encodedDN = encodeLDAPDN(ctx, getDistinguishedName(entry));
    if ("simple" in req.authentication) {
        const suppliedPassword = Buffer.from(req.authentication.simple);
        if (dn.length === 0) { // Provides Root DSE (super-administrator) authentication.
            const rootDSEPassword = Buffer.from(process.env.ROOT_DSE_PASSWORD ?? "", "utf-8");
            if (
                (suppliedPassword.length === rootDSEPassword.length)
                && crypto.timingSafeEqual(suppliedPassword, rootDSEPassword)
            ) {
                return simpleSuccess(encodedDN);
            } else {
                return invalidCredentialsError(req.name);
            }
        }
        const attrs = await readEntry(ctx, entry);
        const userPwdAttribute = attrs.find((attr) => (attr.id.toString() === USER_PWD_OID));
        if (!userPwdAttribute) {
            return invalidCredentialsError(req.name);
        }
        const pwd: UserPwd = _decode_UserPwd(userPwdAttribute.value);
        const authenticated = attemptPassword(suppliedPassword, pwd);
        if (authenticated) {
            return simpleSuccess(encodedDN);
        } else {
            return invalidCredentialsError(req.name);
        }
    } else if ("sasl" in req.authentication) {
        const sasl = req.authentication.sasl;
        const saslMechanism: string = Buffer.from(sasl.mechanism).toString("utf-8").trim().toUpperCase();
        switch (saslMechanism) {
            case ("PLAIN"): {
                const rawCreds = sasl.credentials;
                if (!rawCreds || rawCreds.length < 2) {
                    return invalidCredentialsError(req.name);
                }
                const creds = Buffer.from(rawCreds).toString("utf-8").split("\x00");
                if (creds.length !== 3) {
                    return invalidCredentialsError(req.name);
                }
                const [ , , passwd ] = creds; // We ignore the authzid and authcid.
                const attrs = await readEntry(ctx, entry);
                const userPwdAttribute = attrs.find((attr) => (attr.id.toString() === USER_PWD_OID));
                if (!userPwdAttribute) {
                    return invalidCredentialsError(req.name);
                }
                const pwd: UserPwd = _decode_UserPwd(userPwdAttribute.value);
                const authenticated = attemptPassword(Buffer.from(passwd), pwd);
                if (authenticated) {
                    return simpleSuccess(encodedDN);
                } else {
                    return invalidCredentialsError(req.name);
                }
            }
            default: {
                return new BindResponse(
                    LDAPResult_resultCode_authMethodNotSupported,
                    req.name,
                    Buffer.from(`SASL Mechanism ${saslMechanism} not supported.`, "utf-8"),
                    undefined,
                    undefined,
                );
            }
        }
    } else {
        return new BindResponse(
            LDAPResult_resultCode_authMethodNotSupported,
            req.name,
            Buffer.from("Only simple or SASL authentication permitted.", "utf-8"),
            undefined,
            undefined,
        );
    }
}

export default bind;
