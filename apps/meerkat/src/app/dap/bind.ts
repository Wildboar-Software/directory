import {
    BindReturn,
    DirectoryBindError,
} from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import type { Socket } from "net";
import { TLSSocket } from "tls";
import {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    NameAndOptionalUID,
} from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/NameAndOptionalUID.ta";
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
import dnToVertex from "../dit/dnToVertex";
import { attemptStrongAuth } from "../authn/attemptStrongAuth";
import {
    PwdResponseValue_error_passwordExpired,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue-error.ta";
import { read_unique_id } from "../database/utils";
import { OperationDispatcher } from "../distributed/OperationDispatcher";
import type {
    CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    CompareArgumentData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgumentData.ta";
import {
    AttributeValueAssertion,
} from "@wildboar/x500/src/lib/modules/InformationFramework/AttributeValueAssertion.ta";
import { userPwd } from "@wildboar/x500/src/lib/collections/attributes";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    _decode_CompareResult,
    _encode_CompareResultData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import { UserPwd } from "@wildboar/x500/src/lib/modules/PasswordPolicy/UserPwd.ta";
import { DER } from "asn1-ts/dist/node/functional";
import {
    ServiceControls,
    ServiceControls_priority_high,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceControls.ta";
import { pwdResponseValue } from "@wildboar/x500/src/lib/modules/SelectedAttributeTypes/pwdResponseValue.oa";
import {
    PwdResponseValue,
    _decode_PwdResponseValue,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue.ta";
import { verifySIGNED } from "../pki/verifySIGNED";
import {
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ResultType-OPTIONALLY-PROTECTED-Parameter1.ta";
import { strict as assert } from "assert";

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
        const foundEntry = await dnToVertex(ctx, ctx.dit.root, arg.credentials.simple.name);
        if (!arg.credentials.simple.password) {
            if (ctx.config.forbidAnonymousBind) {
                ctx.log.warn(ctx.i18n.t("log:anon_bind_disabled", logInfo), logInfo);
                throw new DirectoryBindError(
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
                throw new DirectoryBindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
            if (maximumTime && (maximumTime.valueOf() < (now.valueOf() - 5000))) { // 5 seconds of tolerance.
                ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
                throw new DirectoryBindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
        }
        if (!foundEntry) {
            let assertable_pwd: UserPwd | undefined;
            if (arg.credentials.simple.password) {
                if ("unprotected" in arg.credentials.simple.password) {
                    assertable_pwd = {
                        clear: Buffer.from(arg.credentials.simple.password.unprotected).toString("utf-8"),
                    };
                } else if ("userPwd" in arg.credentials.simple.password) {
                    assertable_pwd = arg.credentials.simple.password.userPwd;
                }
            }
            if (!assertable_pwd || (ctx.config.authn.remotePaswordCompareTimeLimit === 0)) {
                ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
                throw new DirectoryBindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
            assert(ctx.config.authn.remotePaswordCompareTimeLimit > 0);
            ctx.log.debug(ctx.i18n.t("log:checking_remote_pwd", { source }), logInfo);
            /**
             * The X.511 Remote Password Checking Procedure as describe in
             * [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
             * Section 10.2.7.
             *
             * This variation does not query the remote DSA for the pwdAttribute.
             * That would be very hard to fit into how Meerkat DSA works without
             * a lot of complicated changes, and since userPwd is the
             * standardized password attribute, no X.500 directories should be
             * using anything else anyway.
             */
            const compareArg: CompareArgument = {
                unsigned: new CompareArgumentData(
                    {
                        rdnSequence: arg.credentials.simple.name,
                    },
                    new AttributeValueAssertion(
                        userPwd["&id"],
                        userPwd.encoderFor["&Type"]!(assertable_pwd, DER),
                    ),
                    undefined,
                    new ServiceControls(
                        undefined, // default options are fine
                        ServiceControls_priority_high, // High priority to minimize latency and make oracles less possible.
                        ctx.config.authn.remotePaswordCompareTimeLimit,
                    ),
                ),
            };
            let matched: boolean = false;
            let pwd_resp: PwdResponseValue | undefined;
            try {
                // TODO: Is it necessary to call this? Couldn't you just immediately call the NRCR procedure?
                const outcome = await OperationDispatcher.dispatchLocalCompareRequest(ctx, compareArg);
                const dspResultData = getOptionallyProtectedValue(outcome.result);
                const dspCertPath = dspResultData.chainedResult.securityParameters?.certification_path;
                if (("signed" in outcome.result) && dspCertPath) {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        dspCertPath,
                        {
                            absent: null,
                        },
                        false,
                        outcome.result.signed,
                        _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
                        false,
                    );
                }
                const result = _decode_CompareResult(dspResultData.result);
                const dapResultData = getOptionallyProtectedValue(result);
                matched = dapResultData.matched;
                const pwdResponseVal = dapResultData.notification
                    ?.find((a) => a.type_.isEqualTo(pwdResponseValue["&id"]))
                    ?.values[0];
                pwd_resp = pwdResponseVal && _decode_PwdResponseValue!(pwdResponseVal);
                // We only check the DAP signature if a match is reported, since
                // it is more computationally expensive to verify the signature.
                const dapCertPath = dapResultData.securityParameters?.certification_path;
                if (matched && dapCertPath && ("signed" in result)) {
                    await verifySIGNED(
                        ctx,
                        undefined,
                        dapCertPath,
                        {
                            absent: null,
                        },
                        false,
                        result.signed,
                        _encode_CompareResultData,
                        false,
                    );
                }
            } catch (e) {
                ctx.log.info(ctx.i18n.t("log:error_checking_remote_pwd", { source, e }), logInfo);
                matched = false;
                // Intentional fall through to the !matched case.
            }
            if (!matched) {
                throw new DirectoryBindError(
                    ctx.i18n.t("err:invalid_credentials"),
                    invalidCredentialsData,
                    signErrors,
                );
            }
            const unique_id = foundEntry && await read_unique_id(ctx, foundEntry);
            return {
                boundVertex: foundEntry,
                boundNameAndUID: new NameAndOptionalUID(
                    arg.credentials.simple.name,
                    unique_id, // We just use the first unique identifier.
                ),
                authLevel: {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_simple,
                        localQualifierPoints,
                        undefined,
                    ),
                },
                pwdResponse: pwd_resp
                    ? new PwdResponseValue(
                        pwd_resp.warning,
                        pwd_resp.error,
                    )
                    : undefined,
            };
        }
        const {
            authorized,
            pwdResponse,
            unbind,
        } = await attemptPassword(ctx, foundEntry, arg.credentials.simple);
        if (!authorized) {
            if (pwdResponse?.error === PwdResponseValue_error_passwordExpired) {
                ctx.log.info(ctx.i18n.t("log:dua_bind_pwd_end", {
                    ...logInfo,
                }), logInfo);
                throw new DirectoryBindError(
                    ctx.i18n.t("err:pwd_end"),
                    invalidCredentialsData,
                    signErrors,
                    unbind,
                );
            }
            ctx.log.warn(ctx.i18n.t("log:invalid_credentials", logInfo), logInfo);
            throw new DirectoryBindError(
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
            pwdResponse,
        };
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
