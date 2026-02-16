import { DSABindError, BindReturn } from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import type { Socket } from "node:net";
import { TLSSocket } from "node:tls";
import {
    DSABindArgument,
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";
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
import attemptSPKMAuth from "./attemptSPKMAuth.js";
import attemptExternalAuth from "./attemptExternalAuth.js";
import { attemptSimpleAuth } from "./attemptSimpleAuth.js";

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
            clearances: [],
        };
    }
    if ("simple" in arg.credentials) {
        ctx.log.debug(ctx.i18n.t("log:dsa_bind_with_simple_creds", { source }), logInfo);
        return attemptSimpleAuth(
            ctx,
            DSABindError,
            arg.credentials.simple,
            signErrors,
            localQualifierPoints,
            source,
            logInfo,
        );
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
    } else if ("externalProcedure" in arg.credentials) {
        return attemptExternalAuth(
            ctx,
            DSABindError,
            socket,
            arg.credentials.externalProcedure,
            signErrors,
        );
    } else if ("spkm" in arg.credentials) {
        return attemptSPKMAuth(
            ctx,
            DSABindError,
            arg.credentials.spkm,
            localQualifierPoints,
            signErrors,
            source,
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
