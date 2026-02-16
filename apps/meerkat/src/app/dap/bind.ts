import {
    BindReturn,
    DirectoryBindError,
} from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import type { Socket } from "node:net";
import { TLSSocket } from "node:tls";
import type {
    DirectoryBindArgument,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AuthenticationLevel_basicLevels,
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/BasicAccessControl";
import {
    _decode_CompareResult,
    _encode_CompareResultData,
    _decode_PwdResponseValue,
    SecurityProblem_unsupportedAuthenticationMethod,
    SecurityProblem_inappropriateAuthentication,
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as DirectoryBindErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../versions.js";
import { attemptStrongAuth } from "../authn/attemptStrongAuth.js";
import {
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
import { attemptSPKMAuth } from "../authn/attemptSPKMAuth.js";
import attemptExternalAuth from "../authn/attemptExternalAuth.js";
import { attemptSimpleAuth } from "../authn/attemptSimpleAuth.js";

const anonymousBindErrorData = new DirectoryBindErrorData(
    versions,
    {
        securityError: SecurityProblem_inappropriateAuthentication,
    },
    // No security parameters will be provided for failed auth attempts.
);

/**
 * @summary X.500 Directory Access Protocol (DSP) bind operation
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
 * @param arg The DirectoryBindArgument
 * @returns `null` if the authentication failed.
 *
 * @function
 * @async
 */
export
async function bind (
    ctx: MeerkatContext,
    socket: Socket | TLSSocket,
    arg: DirectoryBindArgument,
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
    if (!arg.credentials) {
        if (ctx.config.forbidAnonymousBind) {
            ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
            throw new DirectoryBindError(
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
            clearances: [],
        };
    }
    if ("simple" in arg.credentials) {
        return attemptSimpleAuth(
            ctx,
            DirectoryBindError,
            arg.credentials.simple,
            signErrors,
            localQualifierPoints,
            source,
            logInfo,
        );
    } else if ("strong" in arg.credentials) {
        return attemptStrongAuth(
            ctx,
            DirectoryBindError,
            arg.credentials.strong,
            signErrors,
            localQualifierPoints,
            source,
            socket,
        );
    } else if ("externalProcedure" in arg.credentials) {
        return attemptExternalAuth(
            ctx,
            DirectoryBindError,
            socket,
            arg.credentials.externalProcedure,
            signErrors,
        );
    } else if ("spkm" in arg.credentials) {
        return attemptSPKMAuth(
            ctx,
            DirectoryBindError,
            arg.credentials.spkm,
            localQualifierPoints,
            signErrors,
            source,
        );
    } else {
        throw new DirectoryBindError(
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
