import { DSABindError, BindReturn } from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type { Socket } from "net";
import { TLSSocket } from "tls";
import {
    DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
import dnToVertex from "../dit/dnToVertex";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import attemptPassword from "../authn/attemptPassword";
import getDistinguishedName from "../x500/getDistinguishedName";
import {
    SecurityProblem_unsupportedAuthenticationMethod,
    SecurityProblem_inappropriateAuthentication,
    SecurityProblem_invalidCredentials,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import versions from "../versions";
import { attemptStrongAuth } from "../authn/attemptStrongAuth";
import {
    PwdResponseValue_error_passwordExpired,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue-error.ta";
import stringifyDN from "../x500/stringifyDN";
import { read_unique_id } from "../database/utils";

/**
 * @summary X.500 Directory System Protocol (DSP) bind operation
 * @description
 *
 * ## Technical Details
 *
 * This function waits a random amount of time to prevent timing attacks.
 *
 * Anonymous authentication shall always succeed, even if bound entry does not
 * actually exist. This is so anonymous authentication cannot be used to
 * enumerate directory entries.
 *
 * @param ctx The context object
 * @param socket The underlying TCP or TLS socket
 * @param arg The DSABindArgument
 * @returns `null` if the authentication failed.
 *
 * @function
 * @async
 */
export
async function bind (
    ctx: MeerkatContext,
    socket: Socket | TLSSocket,
    arg: DSABindArgument,
    signErrors: boolean,
): Promise<BindReturn> {
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

    const source: string = `${socket.remoteFamily}:${socket.remoteAddress}:${socket.remotePort}`;
    const logInfo = {
        host: source,
        remoteFamily: socket.remoteFamily,
        remoteAddress: socket.remoteAddress,
        remotePort: socket.remotePort,
    };
    const anonymousBindErrorData = new DirectoryBindErrorData(
        versions,
        {
            securityError: SecurityProblem_inappropriateAuthentication,
        },
        // No security parameters will be provided for failed auth attempts.
    );
    if (!arg.credentials) {
        if (ctx.config.forbidAnonymousBind) {
            ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
            throw new DSABindError(
                ctx.i18n.t("err:anon_bind_disabled"),
                anonymousBindErrorData,
                signErrors,
            );
        }
        return {
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_none,
                    localQualifierPoints,
                    undefined,
                ),
            },
        };
    }
    const invalidCredentialsData = new DirectoryBindErrorData(
        versions,
        {
            securityError: SecurityProblem_invalidCredentials,
        },
        // No security parameters will be provided for failed auth attempts.
    );
    if ("simple" in arg.credentials) {
        ctx.log.debug(ctx.i18n.t("log:dsa_bind_with_simple_creds", { source }), logInfo);
        // TODO: Refactor out of here to de-duplicate from `apps/meerkat/src/app/dap/bind.ts`
        const foundEntry = await dnToVertex(ctx, ctx.dit.root, arg.credentials.simple.name);
        if (!arg.credentials.simple.password) {
            if (ctx.config.forbidAnonymousBind) {
                ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
                throw new DSABindError(
                    ctx.i18n.t("err:anon_bind_disabled"),
                    anonymousBindErrorData,
                    signErrors,
                );
            }
            const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
            return {
                boundVertex: foundEntry,
                boundNameAndUID: new NameAndOptionalUID(
                    arg.credentials.simple.name,
                    unique_id,
                ),
                authLevel: {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        localQualifierPoints,
                        undefined,
                    ),
                },
            };
        }
        if (!foundEntry) {
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new DSABindError(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
            );
        }
        if (arg.credentials.simple.validity) {
            const now = new Date();
            const minimumTime = arg.credentials.simple.validity.time1
                ? ("utc" in arg.credentials.simple.validity.time1)
                    ? arg.credentials.simple.validity.time1.utc
                    : arg.credentials.simple.validity.time1.gt
                : undefined;
            const maximumTime = arg.credentials.simple.validity.time2
                ? ("utc" in arg.credentials.simple.validity.time2)
                    ? arg.credentials.simple.validity.time2.utc
                    : arg.credentials.simple.validity.time2.gt
                : undefined;
            if (minimumTime && (minimumTime.valueOf() > (now.valueOf() + 5000))) { // 5 seconds of tolerance.
                ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
                throw new DSABindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
            if (maximumTime && (maximumTime.valueOf() < (now.valueOf() - 5000))) { // 5 seconds of tolerance.
                ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
                throw new DSABindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
        }
        const {
            authorized,
            pwdResponse,
            unbind,
        } = await attemptPassword(ctx, foundEntry, arg.credentials.simple);
        if (!authorized) {
            if (pwdResponse?.error === PwdResponseValue_error_passwordExpired) {
                ctx.log.warn(ctx.i18n.t("log:dsa_bind_pwd_end", {
                    ...logInfo,
                    dsa: stringifyDN(ctx, arg.credentials.simple.name).slice(0, 500),
                }), logInfo);
                throw new DSABindError(
                    ctx.i18n.t("err:pwd_end"),
                    invalidCredentialsData,
                    signErrors,
                    unbind,
                );
            }
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new DSABindError(
                ctx.i18n.t("err:invalid_credentials"),
                invalidCredentialsData,
                signErrors,
                unbind,
            );
        }
        const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
        return {
            boundVertex: foundEntry,
            boundNameAndUID: new NameAndOptionalUID(
                getDistinguishedName(foundEntry),
                unique_id, // We just use the first unique identifier.
            ),
            authLevel: {
                basicLevels: new AuthenticationLevel_basicLevels(
                    AuthenticationLevel_basicLevels_level_simple,
                    localQualifierPoints,
                    undefined,
                ),
            },
        };
    } else if ("strong" in arg.credentials) {
        ctx.log.debug(ctx.i18n.t("log:dsa_bind_with_strong_creds", { source }), logInfo);
        return attemptStrongAuth(
            ctx,
            DSABindError,
            arg.credentials.strong,
            signErrors,
            localQualifierPoints,
            source,
            socket,
        );
    } else {
        throw new DSABindError(
            ctx.i18n.t("err:unsupported_auth_method"),
            new DirectoryBindErrorData(
                versions,
                {
                    securityError: SecurityProblem_unsupportedAuthenticationMethod,
                },
                // No security parameters will be provided for failed auth attempts.
            ),
            signErrors,
        );
    }
}

export default bind;
