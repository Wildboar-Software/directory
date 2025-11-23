import type { Context, BindReturn } from "@wildboar/meerkat-types";
import type {
    BindRequest,
} from "@wildboar/ldap";
import type { Socket } from "net";
import { TLSSocket } from "tls";
import {
    BindResponse,
} from "@wildboar/ldap";
import dnToVertex from "../dit/dnToVertex.js";
import decodeLDAPDN from "./decodeLDAPDN.js";
import encodeLDAPDN from "./encodeLDAPDN.js";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_invalidCredentials,
    LDAPResult_resultCode_authMethodNotSupported,
} from "@wildboar/ldap";
import attemptPassword from "../authn/attemptPassword.js";
import readEntryPassword from "../database/readEntryPassword.js";
import type { AuthenticationLevel } from "@wildboar/x500/BasicAccessControl";
import { AuthenticationLevel_basicLevels } from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/BasicAccessControl";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/SelectedAttributeTypes";
import {
    PwdResponseValue_error_passwordExpired,
} from "@wildboar/x500/DirectoryAbstractService";
import { SimpleCredentials } from "@wildboar/x500/DirectoryAbstractService";
import { read_unique_id, read_clearance } from "../database/utils.js";

export
interface LDAPBindReturn extends BindReturn {
    result: BindResponse;
}

function invalidCredentialsError (invalidCredsMessage: string, name: Uint8Array): BindResponse {
    return new BindResponse(
        LDAPResult_resultCode_invalidCredentials,
        name,
        Buffer.from(invalidCredsMessage, "utf-8"),
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
 * @summary The bind operation defined in IETF RFC 4511
 * @description
 *
 * The bind operation defined in IETF RFC 4511
 *
 * The `userPassword` attribute described in ITU Recommendation X.520 is
 * problematic because it is not single-valued and has no concept of encryption.
 * This implementation prefers the `userPwd` attribute defined in ITU
 * Recommendation X.520, which is both single-valued and has a concept of
 * encryption.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4511#section-4.2
 *
 * @param ctx The context object
 * @param socket The TCP or TLS socket from whence the request originated
 * @param req The `BindRequest` argument
 * @returns an `LDAPBindReturn`
 *
 * @function
 * @async
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
            authLevel: notAuthed(),
            clearances: [],
            result: new BindResponse(
                LDAPResult_resultCode_protocolError,
                req.name,
                Buffer.from(`Protocol version ${version} not supported.`, "utf-8"),
                undefined,
                undefined,
            ),
        };
    }
    const source: string = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
    const successMessage = ctx.i18n.t("main:success");
    const dn = decodeLDAPDN(ctx, req.name);
    const entry = await dnToVertex(ctx, ctx.dit.root, dn);
    const invalidCredentialsMessage: string = ctx.i18n.t("err:invalid_credentials");
    if (!entry) {
        return {
            authLevel: notAuthed(),
            clearances: [],
            result: invalidCredentialsError(invalidCredentialsMessage, req.name),
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
    const unique_id = entry && await read_unique_id(ctx, entry);
    const clearances = entry && await read_clearance(ctx, entry);
    const ret = {
        boundNameAndUID: new NameAndOptionalUID(
            decodeLDAPDN(ctx, req.name),
            unique_id, // We just use the first one, whatever that is.
        ),
        boundVertex: entry,
        clearances,
    };
    const invalidCredentials: LDAPBindReturn = {
        ...ret,
        authLevel: notAuthed(localQualifierPoints),
        clearances: [],
        result: invalidCredentialsError(invalidCredentialsMessage, req.name),
    };
    const logInfo = {
        host: source,
        remoteFamily: socket.remoteFamily,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    };
    if ("simple" in req.authentication) {
        const suppliedPassword = Buffer.from(req.authentication.simple);
        if (suppliedPassword.length === 0) {
            if (ctx.config.forbidAnonymousBind) {
                ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
                const anonBindDisabledMessage: string = ctx.i18n.t("log:anon_bind_disabled");
                return {
                    ...ret,
                    authLevel: {
                        basicLevels: new AuthenticationLevel_basicLevels(
                            AuthenticationLevel_basicLevels_level_none,
                            localQualifierPoints,
                            undefined,
                        ),
                    },
                    clearances: [],
                    result: new BindResponse(
                        LDAPResult_resultCode_authMethodNotSupported,
                        req.name,
                        Buffer.from(anonBindDisabledMessage, "utf-8"),
                        undefined,
                        undefined,
                    ),
                };
            }
            return {
                ...ret,
                authLevel: {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        localQualifierPoints,
                        undefined,
                    ),
                },
                clearances: [],
                result: simpleSuccess(successMessage, encodedDN),
            };
        }
        // const attrs = await readEntry(ctx, entry);
        // const pwd = await readEntryPassword(ctx, entry);
            // attrs.find((attr) => (attr.id.toString() === USER_PWD_OID));
        if (!pwd) {
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            return invalidCredentials;
        }
        const {
            authorized,
            pwdResponse,
        } = await attemptPassword(ctx, entry, new SimpleCredentials(
            dn,
            undefined,
            {
                unprotected: suppliedPassword,
            },
        ));
        if (authorized) {
            return {
                ...ret,
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
            if (pwdResponse?.error === PwdResponseValue_error_passwordExpired) {
                ctx.log.info(ctx.i18n.t("log:dua_bind_pwd_end", logInfo), logInfo);
            } else {
                ctx.log.warn(invalidCredentialsMessage);
            }
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
                const authenticated = await attemptPassword(ctx, entry, new SimpleCredentials(
                    dn,
                    undefined,
                    {
                        unprotected: Buffer.from(passwd),
                    },
                ));
                if (authenticated) {
                    return {
                        ...ret,
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
                    ctx.log.warn(invalidCredentialsMessage);
                    return invalidCredentials;
                }
            }
            default: {
                ctx.log.warn(ctx.i18n.t("err:unsupported_auth_method"));
                return {
                    ...ret,
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
                        Buffer.from(`SASL Mechanism ${saslMechanism} not supported.`, "utf-8"), // FIXME: i18n
                        undefined,
                        undefined,
                    ),
                };
            }
        }
    } else {
        ctx.log.warn(ctx.i18n.t("err:unsupported_auth_method"));
        return {
            ...ret,
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
                Buffer.from("Only simple or SASL authentication permitted.", "utf-8"), // FIXME: i18n
                undefined,
                undefined,
            ),
        };
    }
}

export default bind;
