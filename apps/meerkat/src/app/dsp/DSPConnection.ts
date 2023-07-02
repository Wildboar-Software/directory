import {
    ClientAssociation,
    OperationStatistics,
    OperationInvocationInfo,
    MistypedPDUError,
    DSABindError,
    BindReturn,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import { ASN1Element } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import versions from "../versions";
import {
    DSABindArgument,
    _decode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    _encode_DSABindResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindResult.ta";
import OperationDispatcher from "../distributed/OperationDispatcher";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import {
    _encode_Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { BER } from "asn1-ts/dist/node/functional";
import { _encode_AbandonedData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonedData.ta";
import { _encode_AbandonFailedData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonFailedData.ta";
import { _encode_AttributeErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AttributeErrorData.ta";
import { _encode_NameErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/NameErrorData.ta";
import { _encode_ReferralData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReferralData.ta";
import { _encode_SecurityErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import { _encode_ServiceErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import { _encode_UpdateErrorData } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/UpdateErrorData.ta";
import { bind as doBind } from "../authn/dsaBind";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import getServerStatistics from "../telemetry/getServerStatistics";
import getConnectionStatistics from "../telemetry/getConnectionStatistics";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getContinuationReferenceStatistics from "../telemetry/getContinuationReferenceStatistics";
import { chainedRead } from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import { EventEmitter } from "events";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import isDebugging from "is-debugging";
import { strict as assert } from "assert";
import { flatten } from "flat";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import getCommonResultsStatistics from "../telemetry/getCommonResultsStatistics";
import { printInvokeId } from "../utils/printInvokeId";
import {
    getStatisticsFromSecurityParameters,
} from "../telemetry/getStatisticsFromSecurityParameters";
import { signDirectoryError } from "../pki/signDirectoryError";
import {
    abandoned,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandoned.oa";
import {
    abandonFailed,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/abandonFailed.oa";
import {
    attributeError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/attributeError.oa";
import {
    nameError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/nameError.oa";
import {
    referral,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/referral.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    updateError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/updateError.oa";
import {
    compareAuthenticationLevel,
} from "@wildboar/x500/src/lib/comparators/compareAuthenticationLevel";
import {
    Versions_v2,
    _encode_DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as _encode_DBE_Param,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import { stringifyDN } from "../x500/stringifyDN";
import printCode from "../utils/printCode";
import {
    ROSETransport,
    RejectReason,
    AbortReason,
    RequestParameters,
} from "@wildboar/rose-transport";
import { compareCode } from "@wildboar/x500";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";

/**
 * @summary The handles a request, but not errors
 * @description
 *
 * This function handles a request, but allows the errors to be thrown.
 *
 * @param ctx The context object
 * @param assn The client association
 * @param request The request
 * @param stats The statistics object
 *
 * @function
 * @async
 */
async function handleRequest (
    ctx: MeerkatContext,
    assn: DSPAssociation, // eslint-disable-line
    request: RequestParameters,
    stats: OperationStatistics,
): Promise<void> {
    if (!("local" in request.code)) {
        throw new MistypedPDUError();
    }
    const result = await OperationDispatcher.dispatchDSPRequest(
        ctx,
        assn,
        {
            invokeId: request.invoke_id,
            opCode: request.code,
            argument: request.parameter,
        },
    );
    stats.request = result.request ?? stats.request;
    stats.outcome = result.outcome ?? stats.outcome;
    const encodedResult = chainedRead.encoderFor["&ResultType"]!(result.result, DER);
    assn.rose.write_result({
        invoke_id: request.invoke_id,
        code: result.opCode,
        parameter: encodedResult,
    });
}

/**
 * @summary Process a request
 * @description
 *
 * Handles a request as well as any errors that might be thrown in the process.
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
    assn: DSPAssociation, // eslint-disable-line
    request: RequestParameters,
): Promise<void> {
    const logInfo = {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
        invokeID: printInvokeId(request.invoke_id),
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
        protocol: "DSP",
        iid: request.invoke_id.present.toString(),
        op: printCode(request.code),
        cid: assn.id,
    }), logInfo);
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(ctx),
        connection: getConnectionStatistics(assn),
        // idm?: IDMTransportStatistics;
        bind: {
            protocol: dsp_ip["&id"]!.toString(),
        },
        request: {
            invokeId: invoke_id,
            operationCode: codeToString(request.code),
        },
    };
    const info: OperationInvocationInfo = {
        invokeId: invoke_id,
        operationCode: request.code,
        startTime: new Date(),
        events: new EventEmitter(),
    };
    assn.invocations.set(invoke_id, info);
    const isSensitiveOperation: boolean = (
        compareCode(request.code, administerPassword["&operationCode"]!)
        || compareCode(request.code, changePassword["&operationCode"]!)
    );
    try {
        await handleRequest(ctx, assn, request, stats);
        !isSensitiveOperation && ctx.telemetry.trackRequest({
            name: codeToString(request.code),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - info.startTime.valueOf(),
            resultCode: 200,
            success: true,
            properties: {
                ...flatten(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } catch (e) {
        !isSensitiveOperation && ctx.telemetry.trackRequest({
            name: codeToString(request.code),
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - info.startTime.valueOf(),
            resultCode: (e instanceof errors.DirectoryError || e instanceof errors.TransportError)
                ? 400
                : 500,
            success: false,
            properties: {
                ...flatten(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
        ctx.log.info(`${assn.id}#${invoke_id}: ${e?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
        if (isDebugging || (ctx.log.level === "debug")) {
            console.error(e);
        }
        if (!stats.outcome) {
            stats.outcome = {};
        }
        if (!stats.outcome.error) {
            stats.outcome.error = {};
        }
        if (e instanceof Error) {
            stats.outcome.error.stack = e.stack;
        }
        if (e instanceof errors.DirectoryError) {
            stats.outcome.error.code = codeToString(e.getErrCode());
        }
        if (e instanceof errors.ChainedError) {
            if (!e.errcode || !e.error) {
                assn.rose.write_reject({
                    invoke_id: request.invoke_id,
                    problem: RejectReason.unknown_error,
                });
            } else {
                stats.outcome.error.code = codeToString(e.errcode);
                assn.rose.write_error({
                    invoke_id: request.invoke_id,
                    code: _encode_Code(e.errcode, BER),
                    parameter: e.error,
                });
            }
        } else if (e instanceof errors.AbandonError) {
            const code = _encode_Code(errors.AbandonError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof abandoned["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_AbandonedData)
                : {
                    unsigned: e.data,
                };
            const payload = abandoned.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.pagingAbandoned = (e.data.problem === 0);
        } else if (e instanceof errors.AbandonFailedError) {
            const code = _encode_Code(errors.AbandonFailedError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof abandonFailed["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_AbandonFailedData)
                : {
                    unsigned: e.data,
                };
            const payload = abandonFailed.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.AttributeError) {
            const code = _encode_Code(errors.AttributeError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof attributeError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_AttributeErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = attributeError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.attributeProblems = e.data.problems.map((ap) => ({
                type: ap.type_.toString(),
                problem: Number(ap.problem),
            }));
        } else if (e instanceof errors.NameError) {
            const code = _encode_Code(errors.NameError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof nameError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_NameErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = nameError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.matchedNameLength = e.data.matched.rdnSequence.length;
        } else if (e instanceof errors.ReferralError) {
            const code = _encode_Code(errors.ReferralError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof referral["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_ReferralData)
                : {
                    unsigned: e.data,
                };
            const payload = referral.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.candidate = getContinuationReferenceStatistics(e.data.candidate);
        } else if (e instanceof errors.SecurityError) {
            const code = _encode_Code(errors.SecurityError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
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
        } else if (e instanceof errors.ServiceError) {
            const code = _encode_Code(errors.ServiceError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof serviceError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_ServiceErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = serviceError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.UpdateError) {
            const code = _encode_Code(errors.UpdateError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof updateError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_UpdateErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = updateError.encoderFor["&ParameterType"]!(param, DER);
            assn.rose.write_error({
                invoke_id: request.invoke_id,
                code,
                parameter: payload,
            });
            stats.outcome.error.problem = Number(e.data.problem);
            stats.outcome.error.attributeInfo = e.data.attributeInfo?.map((ai) => {
                if ("attributeType" in ai) {
                    return ai.attributeType.toString();
                } else if ("attribute" in ai) {
                    return ai.attribute.type_.toString();
                } else {
                    return null;
                }
            }).filter((ainfo): ainfo is string => !!ainfo);
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
        } else if (e instanceof errors.UnknownOperationError) {
            assn.rose.write_reject({
                invoke_id: request.invoke_id,
                problem: RejectReason.unknown_operation_request,
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
        !isSensitiveOperation && ctx.telemetry.trackException({
            exception: e,
            properties: {
                ...flatten(stats),
                ...flatten(getCommonResultsStatistics(e.data)),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                // idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } finally {
        assn.invocations.delete(invoke_id);
    }
}

/**
 * @summary A Directory System Protocol (DSP) association.
 * @description
 *
 * A Directory SystemProtocol (DSP) association.
 *
 * @kind class
 */
export default
class DSPAssociation extends ClientAssociation {

    /**
     * This exists because ITU Recommendation X.519 states that requests may
     * be sent before the bind is complete, as long as they are sent after the
     * bind request. This means that we need to enqueue requests, then execute
     * them once the bind is complete, if it completes. This array stores the
     * requests that have come in before the association was bound.
     */
    public readonly prebindRequests: RequestParameters[] = [];

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
            protocol: dsp_ip["&id"]!.toString(),
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
            outcome = await doBind(ctx, this.rose.socket!, arg_, signErrors);
        } catch (e) {
            const logInfo = {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                association_id: this.id,
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
                    protocol_id: dsp_ip["&id"]!, // FIXME:
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
                ctx.log.warn(`${this.id}: ${e.constructor?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
                if (isDebugging) {
                    console.error(e);
                }
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
                protocol: "DSP",
                aid: this.id,
            }), extraLogData);
        } else {
            ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                context: ctx.config.log.boundDN ? "with_dn" : undefined,
                source: remoteHostIdentifier,
                protocol: "DSP",
                aid: this.id,
                dn: this.boundNameAndUID?.dn
                    ? stringifyDN(ctx, this.boundNameAndUID.dn).slice(0, 512)
                    : "",
            }), extraLogData);
        }
        // TODO: Copied from DAP and DOP. This could be refactored.
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
            undefined, // TODO: Supply return credentials. NOTE that the specification says that this must be the same CHOICE that the user supplied.
            versions,
        );
        this.rose.write_bind_result({
            protocol_id: dsp_ip["&id"]!,
            parameter: _encode_DSABindResult(bindResult, BER),
        });
        this.rose.events.removeAllListeners("request");
        this.rose.events.on("request", this.handleRequest.bind(this));
        for (const req of this.prebindRequests) {
            // We process these requests serially, just because there could be
            // many of them backed up prior to binding.
            await handleRequestAndErrors(this.ctx, this, req).catch();
        }
    }

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
        handleRequestAndErrors(this.ctx, this, request);
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
        }).then().catch();
        this.ctx.db.enqueuedSearchResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        }).then().catch();
    }

    /**
     * @summary Handle the unbind notification
     * @description
     *
     * This function handles the unbind notification from a client.
     *
     * This implementation wipes out enqueued search and list results saved in
     * the database.
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
            ctype: DSPAssociation.name,
            cid: this.id,
            protocol: "DSP",
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
        assert(ctx.config.dsp.enabled, "User somehow bound via DSP when it was disabled.");
        this.socket.on("close", this.reset.bind(this));
        const logInfo = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
        };
        rose.events.prependListener("unbind", this.handleUnbind.bind(this));
        rose.events.removeAllListeners("request");
        rose.events.on("request", (request) => {
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
