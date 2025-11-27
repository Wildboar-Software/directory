import {
    ClientAssociation,
    OperationStatistics,
    SecurityError,
    UnknownOperationError,
    MistypedPDUError,
    DSABindError,
    BindReturn,
} from "../types/index.js";
import * as errors from "../types/index.js";
import type { MeerkatContext } from "../ctx.js";
import { ASN1Element } from "@wildboar/asn1";
import { DER } from "@wildboar/asn1/functional";
import {
    DSABindArgument,
    _decode_DSABindArgument,
} from "@wildboar/x500/DistributedOperations";
import {
    _encode_DSABindResult,
} from "@wildboar/x500/DistributedOperations";
import { disp_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import {
    _encode_Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import {
    SecurityErrorData,
    _encode_SecurityErrorData,
} from "@wildboar/x500/DirectoryAbstractService";
import versions from "../versions.js";
import { bind as doBind } from "../authn/dsaBind.js";
import {
    directoryBindError,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    SecurityProblem_inappropriateAuthentication,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/BasicAccessControl";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep.js";
import createSecurityParameters from "../x500/createSecurityParameters.js";
import {
    securityError,
} from "@wildboar/x500/DirectoryAbstractService";
import getServerStatistics from "../telemetry/getServerStatistics.js";
import getConnectionStatistics from "../telemetry/getConnectionStatistics.js";
import { codeToString } from "@wildboar/x500";
import { strict as assert } from "assert";
import { flatten } from "flat";
import { naddrToURI } from "@wildboar/x500";
import { printInvokeId } from "../utils/printInvokeId.js";
import {
    getStatisticsFromSecurityParameters,
} from "../telemetry/getStatisticsFromSecurityParameters.js";
import { signDirectoryError } from "../pki/signDirectoryError.js";
import { compareAuthenticationLevel } from "@wildboar/x500";
import {
    _encode_DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as _encode_DBE_Param,
} from "@wildboar/x500/DirectoryAbstractService";
import stringifyDN from "../x500/stringifyDN.js";
import { AuthenticationLevel_basicLevels } from "@wildboar/x500/BasicAccessControl";
import { isArgumentSigned } from "../x500/isArgumentSigned.js";
import {
    Versions_v2,
} from "@wildboar/x500/DirectoryAbstractService";
import printCode from "../utils/printCode.js";
import {
    ROSETransport,
    RejectReason,
    AbortReason,
    RequestParameters,
} from "@wildboar/rose-transport";
import updateShadow from "./operations/updateShadow.js";
import requestShadowUpdate from "./operations/requestShadowUpdate.js";
import coordinateShadowUpdate from "./operations/coordinateShadowUpdate.js";
import {
    _decode_UpdateShadowArgument,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _encode_UpdateShadowResult,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _decode_RequestShadowUpdateArgument,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _encode_RequestShadowUpdateResult,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _decode_CoordinateShadowUpdateArgument,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import {
    _encode_CoordinateShadowUpdateResult,
} from "@wildboar/x500/DirectoryShadowAbstractService";
import { _encode_ShadowErrorData } from "@wildboar/x500/DirectoryShadowAbstractService";
import { shadowError } from "@wildboar/x500/DirectoryShadowAbstractService";
import _ from "lodash";

// id-opcode-requestShadowUpdate     Code ::= local:1
// id-opcode-updateShadow            Code ::= local:2
// id-opcode-coordinateShadowUpdate  Code ::= local:3
/**
 * @summary The handles a request, but not errors
 * @description
 *
 * This function handles a request, but allows the errors to be thrown.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The request
 *
 * @function
 * @async
 */
async function handleRequest (
    ctx: MeerkatContext,
    assn: DISPAssociation, // eslint-disable-line
    request: RequestParameters,
): Promise<void> {
    if (!("local" in request.code)) {
        throw new MistypedPDUError();
    }
    if (!("present" in request.invoke_id)) {
        throw new MistypedPDUError();
    }
    switch (request.code.local) {
    case (1): { // requestShadowUpdate
        const arg = _decode_RequestShadowUpdateArgument(request.parameter);
        const result = await requestShadowUpdate(ctx, assn, arg, request.invoke_id);
        assn.rose.write_result({
            invoke_id: request.invoke_id,
            code: request.code,
            parameter: _encode_RequestShadowUpdateResult(result, DER),
        });
        break;
    }
    case (2): { // updateShadow
        const arg = _decode_UpdateShadowArgument(request.parameter);
        const result = await updateShadow(ctx, assn, arg, request.invoke_id);
        assn.rose.write_result({
            invoke_id: request.invoke_id,
            code: request.code,
            parameter: _encode_UpdateShadowResult(result, DER),
        });
        break;
    }
    case (3): { // coordinateShadowUpdate
        const arg = _decode_CoordinateShadowUpdateArgument(request.parameter);
        const result = await coordinateShadowUpdate(ctx, assn, arg, request.invoke_id);
        assn.rose.write_result({
            invoke_id: request.invoke_id,
            code: request.code,
            parameter: _encode_CoordinateShadowUpdateResult(result, DER),
        });
        break;
    }
    default: {
        throw new UnknownOperationError();
    }
    }
}

function authLevelToDiagnosticString (a: AuthenticationLevel_basicLevels): string {
    return `${a.level}:${a.localQualifier ?? "ABSENT"}:${a.signed ?? "ABSENT"}`;
}

/**
 * @summary Process a request
 * @description
 *
 * Handles a request as well as any errors that might be thrown in the process.
 *
 * You will notice that this implementation does not keep track of invocations,
 * because there is no abandon operation defined for the DISP.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The request
 *
 * @function
 * @async
 */
async function handleRequestAndErrors (
    ctx: MeerkatContext,
    assn: DISPAssociation, // eslint-disable-line
    request: RequestParameters,
): Promise<void> {
    if (!("local" in request.code)) {
        assn.rose.write_reject({
            invoke_id: request.invoke_id,
            problem: RejectReason.mistyped_pdu,
        });
        return;
    }
    const opcode = Number(request.code.local);
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId(request.invoke_id),
        opcode,
        problem: undefined,
    };
    if (!("present" in request.invoke_id)) {
        ctx.log.warn(ctx.i18n.t("log:unusual_invoke_id", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
        }), logInfo);
        assn.rose.write_abort(AbortReason.invalid_pdu);
        return;
    }
    const invoke_id = Number(request.invoke_id.present);
    if ((invoke_id < 0) || (invoke_id > Number.MAX_SAFE_INTEGER)) {
        ctx.log.warn(ctx.i18n.t("log:unusual_invoke_id", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
        }), logInfo);
        assn.rose.write_abort(AbortReason.invalid_pdu);
        return;
    }
    if (assn.invocations.has(invoke_id)) {
        ctx.log.warn(ctx.i18n.t("log:dup_invoke_id", {
            host: assn.socket.remoteAddress,
            iid: invoke_id.toString(),
            cid: assn.id,
        }), logInfo);
        assn.rose.write_reject({
            invoke_id: request.invoke_id,
            problem: RejectReason.duplicate_invoke_id_request,
        });
        return;
    }
    if (assn.invocations.size >= ctx.config.maxConcurrentOperationsPerConnection) {
        ctx.log.warn(ctx.i18n.t("log:max_concurrent_op", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
            iid: invoke_id.toString(),
        }), logInfo);
        assn.rose.write_reject({
            invoke_id: request.invoke_id,
            problem: RejectReason.resource_limitation_request,
        });
        return;
    }
    ctx.log.debug(ctx.i18n.t("log:received_request", {
        protocol: "DISP",
        iid: request.invoke_id.present.toString(),
        op: printCode(request.code),
        cid: assn.id,
    }), logInfo);
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(ctx),
        connection: getConnectionStatistics(assn),
        bind: {
            protocol: disp_ip["&id"]!.toString(),
        },
        request: {
            invokeId: invoke_id,
            operationCode: codeToString(request.code),
        },
    };
    const startTime = Date.now();
    try {
        if (
            !("basicLevels" in assn.authLevel)
            || compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.shadowing.minAuthRequired,
                new AuthenticationLevel_basicLevels(
                    assn.authLevel.basicLevels.level,
                    assn.authLevel.basicLevels.localQualifier,
                    isArgumentSigned(request.code, request.parameter),
                ),
            )
        ) {
            const had: string = ("basicLevels" in assn.authLevel)
                ? authLevelToDiagnosticString(new AuthenticationLevel_basicLevels(
                    assn.authLevel.basicLevels.level,
                    assn.authLevel.basicLevels.localQualifier,
                    isArgumentSigned(request.code, request.parameter),
                ))
                : "EXTERNAL";
            throw new SecurityError(
                ctx.i18n.t("err:not_authorized_ob", {
                    required: authLevelToDiagnosticString(ctx.config.ob.minAuthRequired),
                    had,
                }),
                new SecurityErrorData(
                    SecurityProblem_inappropriateAuthentication,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        true,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                    false,
                    undefined,
                ),
                /**
                 * It is difficult to extract the errorProtection from DOP
                 * arguments, because security parameters has a different tag
                 * based on the arguments.
                 */
                false,
            );
        }
        await handleRequest(ctx, assn, request);
        ctx.telemetry.trackRequest({
            name: codeToString(request.code),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: 200,
            success: true,
            properties: {
                ...flatten<any, object>(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } catch (e) {
        ctx.telemetry.trackRequest({
            name: codeToString(request.code),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: (e instanceof errors.DirectoryError || e instanceof errors.TransportError)
                ? 400
                : 500,
            success: false,
            properties: {
                ...flatten<any, object>(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
        if (typeof e === "object" && e !== null) {
            logInfo.problem = e.data?.problem;
            Object.assign(logInfo, _.omit(e, "data"));
        }
        ctx.log.error(`${assn.id}#${invoke_id}: ${e?.name ?? "?"}: ${e?.message ?? e?.msg ?? e?.m}`, logInfo);
        if (!stats.outcome) {
            stats.outcome = {};
        }
        if (!stats.outcome.error) {
            stats.outcome.error = {};
        }
        if (e instanceof Error) {
            stats.outcome.error.stack = e.stack;
        }
        if (e instanceof errors.ShadowError) {
            const code = _encode_Code(errors.ShadowError.errcode, DER);
            // DISP associations are ALWAYS authorized to receive signed responses.
            const signError: boolean = e.shouldBeSigned;
            const param: typeof shadowError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_ShadowErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = shadowError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof SecurityError) {
            const code = _encode_Code(errors.SecurityError.errcode, DER);
            // DISP associations are ALWAYS authorized to receive signed responses.
            const signError: boolean = e.shouldBeSigned;
            const param: typeof securityError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_SecurityErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = securityError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.problem = Number(e.data.problem);
            if (e.unbind) {
                assn.rose.write_unbind();
                assn.reset();
                assn.socket.destroy();
            }
        }
        else if (e instanceof errors.ChainedError) {
            if (!e.errcode || !e.error) {
                assn.rose.write_reject({
                    invoke_id: request.invoke_id,
                    problem: RejectReason.unknown_error,
                });
            } else {
                stats.outcome.error.code = codeToString(e.errcode);
                assn.rose.write_error({
                    invoke_id: request.invoke_id,
                    code: _encode_Code(e.errcode, DER),
                    parameter: e.error,
                });
            }
        }
        else if (e instanceof errors.ChainedReject) {
            stats.outcome.error.problem = e.reason;
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: e.reason,
            });
        }
        else if (e instanceof errors.ChainedAbort) {
            assn.rose.write_abort(e.reason);
        } else if (e instanceof UnknownOperationError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.unknown_operation_request,
            });
        } else if (e instanceof errors.DuplicateInvokeIdError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.duplicate_invoke_id_request,
            });
        } else if (e instanceof errors.UnsupportedOperationError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.unsupported_operation_request,
            });
        } else if (e instanceof errors.MistypedPDUError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.mistyped_pdu,
            });
        } else if (e instanceof errors.MistypedArgumentError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.mistyped_argument_request,
            });
        } else if (e instanceof errors.ResourceLimitationError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.resource_limitation_request,
            });
        } else if (e instanceof errors.UnknownError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.unknown_error,
            });
        } else if (e instanceof errors.UnboundRequestError) {
            assn.rose.write_abort(AbortReason.unbound_request);
        } else if (e instanceof errors.InvalidProtocolError) {
            assn.rose.write_abort(AbortReason.invalid_protocol);
        } else if (e instanceof errors.ReasonNotSpecifiedError) {
            assn.rose.write_abort(AbortReason.reason_not_specified);
        } else {
            assn.rose.write_abort(AbortReason.reason_not_specified);
        }
        ctx.telemetry.trackException({
            exception: e,
            properties: {
                ...flatten<any, object>(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    }
}

/**
 * @summary A Directory Information Shadowing Protocol (DISP) association.
 * @description
 *
 * A Directory Information Shadowing Protocol (DISP) association.
 *
 * @kind class
 */
export default
class DISPAssociation extends ClientAssociation {

    /**
     * This exists because ITU Recommendation X.519 states that requests may
     * be sent before the bind is complete, as long as they are sent after the
     * bind request. This means that we need to enqueue requests, then execute
     * them once the bind is complete, if it completes. This array stores the
     * requests that have come in before the association was bound.
     */
    public readonly prebindRequests: RequestParameters[] = [];
    public bind: DSABindArgument | undefined;

    /**
     * @summary Attempt a bind
     * @description
     *
     * Attempt a bind
     *
     * @param arg The encoded bind argument
     * @public
     * @function
     * @async
     */
    public async attemptBind (arg: ASN1Element): Promise<void> {
        const arg_ = _decode_DSABindArgument(arg);
        const ctx = this.ctx;
        const remoteHostIdentifier = `${this.socket.remoteFamily}://${this.socket.remoteAddress}/${this.socket.remotePort}`;
        const telemetryProperties = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            protocol: disp_ip["&id"]!.toString(),
            administratorEmail: ctx.config.administratorEmail,
        };
        const extraLogData = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        };
        /**
         * ITU Recommendation X.518 (2019), Section 11.1.4 states that:
         *
         * > If the Bind request was using strong authentication or if SPKM
         * > credentials were supplied, then the Bind responder may sign the
         * > error parameters.
         */
        const signErrors: boolean = !!(
            this.authorizedForSignedErrors
            && arg_.credentials
            && (
                ("strong" in arg_.credentials)
                || ("spkm" in arg_.credentials)
            )
        );
        const startBindTime = new Date();
        let outcome!: BindReturn;
        try {
            outcome = await doBind(ctx, this.socket, arg_, signErrors);
        } catch (e) {
            const logInfo = {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                association_id: this.id,
                problem: undefined,
            };
            if (e instanceof DSABindError) {
                ctx.log.warn(e.message, logInfo);
                const endBindTime = new Date();
                const bindTime: number = Math.abs(differenceInMilliseconds(startBindTime, endBindTime));
                const totalTimeInMilliseconds: number = this.ctx.config.bindMinSleepInMilliseconds
                    + crypto.randomInt(ctx.config.bindSleepRangeInMilliseconds);
                const sleepTime: number = Math.abs(totalTimeInMilliseconds - bindTime);
                await sleep(sleepTime);
                const err: typeof directoryBindError["&ParameterType"] = {
                    unsigned: e.data,
                };
                const payload = signErrors
                    ? signDirectoryError(ctx, e.data, _encode_DBE_Param)
                    : err;
                const error = directoryBindError.encoderFor["&ParameterType"]!(payload, DER);
                this.rose.write_bind_error({
                    protocol_id: this.rose.protocol ?? disp_ip["&id"]!,
                    parameter: error,
                });
                if (e.unbind) {
                    this.rose.write_unbind();
                    this.reset();
                    this.socket.destroy();
                }
                const serviceProblem = ("serviceError" in e.data.error)
                    ? e.data.error.serviceError
                    : undefined;
                const securityProblem = ("serviceError" in e.data.error)
                    ? e.data.error.serviceError
                    : undefined;
                ctx.telemetry.trackException({
                    exception: e,
                    properties: {
                        ...telemetryProperties,
                        serviceProblem,
                        securityProblem,
                        ...(e.data.securityParameters
                            ? getStatisticsFromSecurityParameters(e.data.securityParameters)
                            : {}),
                    },
                    measurements: {
                        bytesRead: this.socket.bytesRead,
                        bytesWritten: this.socket.bytesWritten,
                        // idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            } else {
                if (typeof e === "object" && e !== null) {
                    logInfo.problem = e.data?.problem;
                    Object.assign(logInfo, _.omit(e, "data"));
                }
                ctx.log.warn(`${this.id}: ${e.constructor?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
                this.rose.write_abort(AbortReason.reason_not_specified);
                ctx.telemetry.trackException({
                    exception: e,
                    properties: telemetryProperties,
                    measurements: {
                        bytesRead: this.socket.bytesRead,
                        bytesWritten: this.socket.bytesWritten,
                        // idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            }
            return;
        }
        this.reset();
        this.bind = arg_;
        this.boundEntry = outcome.boundVertex;
        this.boundNameAndUID = outcome.boundNameAndUID;
        this.authLevel = outcome.authLevel;
        this.protocolVersion = arg_.versions?.[Versions_v2] ? 2 : 1;
        if (
            ("basicLevels" in outcome.authLevel)
            && (outcome.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
        ) {
            assert(!ctx.config.forbidAnonymousBind, "Somehow a DSA bound anonymously when anonymous binds are forbidden.");
            ctx.log.info(ctx.i18n.t("log:connection_bound_anon", {
                source: remoteHostIdentifier,
                protocol: "DISP",
                aid: this.id,
            }), extraLogData);
        } else {
            ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                context: ctx.config.log.boundDN ? "with_dn" : undefined,
                source: remoteHostIdentifier,
                protocol: "DISP",
                aid: this.id,
                dn: this.boundNameAndUID?.dn
                    ? stringifyDN(ctx, this.boundNameAndUID.dn).slice(0, 512)
                    : "",
            }), extraLogData);
        }
        if (
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.minAuthRequired,
                this.authLevel.basicLevels,
            )
            && ((this.protocolVersion ?? 1) > 1)
        ) {
            this.authorizedForSignedResults = true;
        }
        if (
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.signedErrorsMinAuthRequired,
                this.authLevel.basicLevels,
            )
            && ((this.protocolVersion ?? 1) > 1)
        ) {
            this.authorizedForSignedErrors = true;
        }
        const bindResult = new DSABindArgument(
            outcome.reverseCredentials,
            versions,
        );
        this.rose.write_bind_result({
            protocol_id: this.rose.protocol ?? disp_ip["&id"]!,
            parameter: _encode_DSABindResult(bindResult, DER),
        });
        this.rose.events.removeAllListeners("request");
        this.rose.events.on("request", this.handleRequest.bind(this));
        for (const req of this.prebindRequests) {
            // We process these requests serially, just because there could be
            // many of them backed up prior to binding.
            await handleRequestAndErrors(this.ctx, this, req)
                .catch((e) => console.error(e)); // This should never really happen.
        }
    }

    // FIXME: Check use of Number() to index outstanding operations.

    /**
     * @summary Handle a request
     * @description
     *
     * Handle a request
     *
     * @param request The request
     * @private
     * @function
     */
    private handleRequest (request: RequestParameters): void {
        handleRequestAndErrors(this.ctx, this, request); // INTENTIONAL_NO_AWAIT
    }

    public reset (): void {
        for (const invocation of this.invocations.values()) {
            invocation.abandonTime = new Date();
            this.invocations.clear();
        }
        this.ctx.db.enqueuedListResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        }).catch(() => {});
        this.ctx.db.enqueuedSearchResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        }).catch(() => {});
    }

    /**
     * @summary Handle the unbind notification
     * @description
     *
     * This function handles the unbind notification from a client.
     *
     * @private
     * @function
     * @async
     */
    private async handleUnbind (): Promise<void> {
        if (!this.rose.is_bound) {
            return; // We don't want users to be able to spam unbinds.
        }
        this.rose.write_unbind_result();
        this.reset();
        this.ctx.telemetry.trackRequest({
            name: "UNBIND",
            url: this.ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${this.ctx.config.idm.port}`,
            duration: 1,
            resultCode: 200,
            success: true,
            properties: {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                administratorEmail: this.ctx.config.administratorEmail,
                association_id: this.id,
            },
            measurements: {
                bytesRead: this.socket.bytesRead,
                bytesWritten: this.socket.bytesWritten,
                // idmFramesReceived: this.idm.getFramesReceived(),
            },
        });
        this.ctx.log.info(this.ctx.i18n.t("log:connection_unbound", {
            ctype: DISPAssociation.name,
            cid: this.id,
            protocol: "DISP",
        }), {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        });
    }

    /**
     * @constructor
     * @param ctx The context object
     * @param rose The underlying ROSE transport
     */
    constructor (
        readonly ctx: MeerkatContext,
        readonly rose: ROSETransport,
    ) {
        super();
        this.socket = rose.socket!;
        assert(ctx.config.disp.enabled, "User somehow bound via DISP when it was disabled.");
        const logInfo = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        };
        this.socket.on("close", this.reset.bind(this));
        this.rose.events.prependListener("unbind", this.handleUnbind.bind(this));
        this.rose.events.removeAllListeners("request");
        this.rose.events.on("request", (request) => {
            if (this.prebindRequests.length >= ctx.config.maxPreBindRequests) {
                ctx.log.warn(ctx.i18n.t("log:too_many_prebind_requests", {
                    host: this.socket.remoteAddress,
                    cid: this.id,
                }), logInfo);
                rose.write_reject({
                    invoke_id: request.invoke_id,
                    problem: RejectReason.resource_limitation_request,
                });
                return;
            }
            this.prebindRequests.push(request);
        });
        if ( // This allows bind errors to be signed.
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.signedErrorsMinAuthRequired,
                this.authLevel.basicLevels,
            )
            && ((this.protocolVersion ?? 1) > 1)
        ) {
            this.authorizedForSignedErrors = true;
        }
    }
}
