import type { Context, BindReturn } from "@wildboar/meerkat-types";
import type {
    BindRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindRequest.ta";
import type { Socket } from "net";
import { TLSSocket } from "tls";
import {
    BindResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindResponse.ta";
import findEntry from "../x500/findEntry";
import decodeLDAPDN from "./decodeLDAPDN";
import encodeLDAPDN from "./encodeLDAPDN";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_invalidCredentials,
    LDAPResult_resultCode_authMethodNotSupported,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import * as crypto from "crypto";
import attemptPassword from "../authn/attemptPassword";
import readEntryPassword from "../database/readEntryPassword";
import sleep from "../utils/sleep";
import type { AuthenticationLevel } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel.ta";
import { AuthenticationLevel_basicLevels } from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";

export
interface LDAPBindReturn extends BindReturn {
    result: BindResponse;
}

const INVALID_CREDENTIALS_MESSAGE: string = "Invalid credentials or no such object.";

function invalidCredentialsError (name: Uint8Array): BindResponse {
    return new BindResponse(
        LDAPResult_resultCode_invalidCredentials,
        name,
        Buffer.from(INVALID_CREDENTIALS_MESSAGE, "utf-8"),
        undefined,
        undefined,
    );
}

function simpleSuccess (successMessage: string, name: Uint8Array): BindResponse {
    return new BindResponse(
        LDAPResult_resultCode_success,
        name,
        Buffer.from(successMessage, "utf-8"),
        undefined,
        undefined,
    );
}

function notAuthed (localQualifierPoints?: number): AuthenticationLevel {
    return {
        basicLevels: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_none,
            localQualifierPoints,
            undefined,
        ),
    };
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
    socket: Socket | TLSSocket,
    req: BindRequest,
): Promise<LDAPBindReturn> {
    const version = req.version;
    if (version !== 3) {
        return {
            failedAuthentication: false,
            authLevel: notAuthed(),
            result: new BindResponse(
                LDAPResult_resultCode_protocolError,
                req.name,
                Buffer.from(`Protocol version ${version} not supported.`, "utf-8"),
                undefined,
                undefined,
            ),
        };
    }
    // Wait a random amount of time to prevent timing attacks.
    sleep(crypto.randomInt(3000) + 1000); // TODO: Make configurable.
    const successMessage = ctx.i18n.t("main:success");
    const dn = decodeLDAPDN(ctx, req.name);
    const entry = await findEntry(ctx, ctx.dit.root, dn, true);
    if (!entry) {
        return {
            failedAuthentication: true,
            authLevel: notAuthed(),
            result: invalidCredentialsError(req.name),
        };
    }
    const encodedDN = encodeLDAPDN(ctx, getDistinguishedName(entry));
    const pwd = await readEntryPassword(ctx, entry);
    const tlsProtocol: string | null = ("getProtocol" in socket)
        ? socket.getProtocol()
        : null;
    const localQualifierPoints: number = (
        0
        + ((socket instanceof TLSSocket) ? ctx.config.localQualifierPointsFor.usingTLS : 0)
        + ((tlsProtocol === "SSLv3") ? ctx.config.localQualifierPointsFor.usingSSLv3 : 0)
        + ((tlsProtocol === "TLSv1") ? ctx.config.localQualifierPointsFor.usingTLSv1_0 : 0)
        + ((tlsProtocol === "TLSv1.1") ? ctx.config.localQualifierPointsFor.usingTLSv1_1 : 0)
        + ((tlsProtocol === "TLSv1.2") ? ctx.config.localQualifierPointsFor.usingTLSv1_2 : 0)
        + ((tlsProtocol === "TLSv1.3") ? ctx.config.localQualifierPointsFor.usingTLSv1_3 : 0)
    );
    const ret = {
        boundNameAndUID: new NameAndOptionalUID(
            decodeLDAPDN(ctx, req.name),
            entry.dse.uniqueIdentifier?.[0], // We just use the first one, whatever that is.
        ),
        boundVertex: entry,
    };
    const invalidCredentials: LDAPBindReturn = {
        ...ret,
        failedAuthentication: true,
        authLevel: notAuthed(localQualifierPoints),
        result: invalidCredentialsError(req.name),
    };
    if ("simple" in req.authentication) {
        const suppliedPassword = Buffer.from(req.authentication.simple);
        if (suppliedPassword.length === 0) {
            return {
                ...ret,
                failedAuthentication: false,
                authLevel: {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        localQualifierPoints,
                        undefined,
                    ),
                },
                result: simpleSuccess(successMessage, encodedDN),
            };
        }
        // const attrs = await readEntry(ctx, entry);
        // const pwd = await readEntryPassword(ctx, entry);
            // attrs.find((attr) => (attr.id.toString() === USER_PWD_OID));
        if (!pwd) {
            return invalidCredentials;
        }
        const authenticated = await attemptPassword(ctx, entry, {
            unprotected: suppliedPassword,
        });
        if (authenticated) {
            return {
                ...ret,
                failedAuthentication: false,
                authLevel: {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_simple,
                        localQualifierPoints,
                        undefined,
                    ),
                },
                result: simpleSuccess(successMessage, encodedDN),
            };
        } else {
            return invalidCredentials;
        }
    } else if ("sasl" in req.authentication) {
        const sasl = req.authentication.sasl;
        const saslMechanism: string = Buffer.from(sasl.mechanism).toString("utf-8").trim().toUpperCase();
        switch (saslMechanism) {
            case ("PLAIN"): {
                const rawCreds = sasl.credentials;
                if (!rawCreds || rawCreds.length < 2) {
                    return invalidCredentials;
                }
                const creds = Buffer.from(rawCreds).toString("utf-8").split("\x00");
                if (creds.length !== 3) {
                    return invalidCredentials;
                }
                const [ , , passwd ] = creds; // We ignore the authzid and authcid.
                if (!pwd) {
                    return invalidCredentials;
                }
                const authenticated = await attemptPassword(ctx, entry, {
                    unprotected: Buffer.from(passwd),
                });
                if (authenticated) {
                    return {
                        ...ret,
                        failedAuthentication: false,
                        authLevel: {
                            basicLevels: new AuthenticationLevel_basicLevels(
                                AuthenticationLevel_basicLevels_level_simple,
                                localQualifierPoints,
                                undefined,
                            ),
                        },
                        result: simpleSuccess(successMessage, encodedDN),
                    };
                } else {
                    return invalidCredentials;
                }
            }
            default: {
                return {
                    ...ret,
                    failedAuthentication: false,
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
                    result: new BindResponse(
                        LDAPResult_resultCode_authMethodNotSupported,
                        req.name,
                        Buffer.from(`SASL Mechanism ${saslMechanism} not supported.`, "utf-8"),
                        undefined,
                        undefined,
                    ),
                };
            }
        }
    } else {
        return {
            ...ret,
            failedAuthentication: false,
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    localQualifierPoints,
                    undefined,
                ),
            },
            result: new BindResponse(
                LDAPResult_resultCode_authMethodNotSupported,
                req.name,
                Buffer.from("Only simple or SASL authentication permitted.", "utf-8"),
                undefined,
                undefined,
            ),
        };
    }
}

export default bind;
