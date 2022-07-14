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
import {
    IDMConnection,
    IDMStatus,
} from "@wildboar/idm";
import versions from "./versions";
import {
    DSABindArgument,
    _decode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    _encode_DSABindResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindResult.ta";
import OperationDispatcher from "../distributed/OperationDispatcher";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
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
import {
    IdmReject_reason_duplicateInvokeIDRequest,
    IdmReject_reason_unsupportedOperationRequest,
    IdmReject_reason_unknownOperationRequest,
    IdmReject_reason_mistypedPDU,
    IdmReject_reason_mistypedArgumentRequest,
    IdmReject_reason_resourceLimitationRequest,
    IdmReject_reason_unknownError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import {
    Abort_unboundRequest,
    Abort_invalidProtocol,
    Abort_reasonNotSpecified,
    Abort_invalidPDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
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
import encodeLDAPDN from "../ldap/encodeLDAPDN";
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
    _encode_DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1 as _encode_DBE_Param,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";

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
    request: Request,
    stats: OperationStatistics,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new MistypedPDUError();
    }
    const result = await OperationDispatcher.dispatchDSPRequest(
        ctx,
        assn,
        {
            invokeId: {
                present: request.invokeID,
            },
            opCode: request.opcode,
            argument: request.argument,
        },
    );
    stats.request = result.request ?? stats.request;
    stats.outcome = result.outcome ?? stats.outcome;
    const encodedResult = chainedRead.encoderFor["&ResultType"]!(result.result, DER);
    assn.idm.writeResult(request.invokeID, result.opCode, encodedResult);
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
    request: Request,
): Promise<void> {
    if ((request.invokeID < 0) || (request.invokeID > Number.MAX_SAFE_INTEGER)) {
        ctx.log.warn(ctx.i18n.t("log:unusual_invoke_id", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
        });
        assn.idm.writeAbort(Abort_invalidPDU);
        return;
    }
    if (assn.invocations.has(Number(request.invokeID))) {
        ctx.log.warn(ctx.i18n.t("log:dup_invoke_id", {
            host: assn.socket.remoteAddress,
            iid: request.invokeID.toString(),
            cid: assn.id,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId({ present: request.invokeID }),
        });
        assn.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        return;
    }
    if (assn.invocations.size >= ctx.config.maxConcurrentOperationsPerConnection) {
        ctx.log.warn(ctx.i18n.t("log:max_concurrent_op", {
            host: assn.socket.remoteAddress,
            cid: assn.id,
            iid: request.invokeID.toString(),
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            invokeID: printInvokeId({ present: request.invokeID }),
        });
        assn.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        return;
    }
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
            invokeId: Number(request.invokeID),
            operationCode: codeToString(request.opcode),
        },
    };
    const info: OperationInvocationInfo = {
        invokeId: Number(request.invokeID),
        operationCode: request.opcode,
        startTime: new Date(),
        events: new EventEmitter(),
    };
    assn.invocations.set(Number(request.invokeID), info);
    try {
        await handleRequest(ctx, assn, request, stats);
        ctx.telemetry.trackRequest({
            name: codeToString(request.opcode),
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
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } catch (e) {
        ctx.telemetry.trackRequest({
            name: codeToString(request.opcode),
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
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
        if (isDebugging) {
            console.error(e);
        } else {
            ctx.log.error(e.message, {
                remoteFamily: assn.socket.remoteFamily,
                remoteAddress: assn.socket.remoteAddress,
                remotePort: assn.socket.remotePort,
                association_id: assn.id,
            });
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
                assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownError);
            } else {
                stats.outcome.error.code = codeToString(e.errcode);
                assn.idm.writeError(
                    request.invokeID,
                    _encode_Code(e.errcode, DER),
                    e.error,
                );
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.ServiceError) {
            const code = _encode_Code(errors.ServiceError.errcode, BER);
            const signError: boolean = (e.shouldBeSigned && assn.authorizedForSignedErrors);
            const param: typeof serviceError["&ParameterType"] = signError
                ? signDirectoryError(ctx, e.data, _encode_ServiceErrorData)
                : {
                    unsigned: e.data,
                };
            const payload = serviceError.encoderFor["&ParameterType"]!(param, DER);
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeError(request.invokeID, code, payload);
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
            assn.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        } else if (e instanceof errors.UnsupportedOperationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unsupportedOperationRequest);
        } else if (e instanceof errors.UnknownOperationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else if (e instanceof errors.MistypedPDUError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_mistypedPDU);
        } else if (e instanceof errors.MistypedArgumentError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_mistypedArgumentRequest);
        } else if (e instanceof errors.ResourceLimitationError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        } else if (e instanceof errors.UnknownError) {
            assn.idm.writeReject(request.invokeID, IdmReject_reason_unknownError);
        } else if (e instanceof errors.UnboundRequestError) {
            assn.idm.writeAbort(Abort_unboundRequest);
        } else if (e instanceof errors.InvalidProtocolError) {
            assn.idm.writeAbort(Abort_invalidProtocol);
        } else if (e instanceof errors.ReasonNotSpecifiedError) {
            assn.idm.writeAbort(Abort_reasonNotSpecified);
        } else {
            assn.idm.writeAbort(Abort_reasonNotSpecified);
        }
        ctx.telemetry.trackException({
            exception: e,
            properties: {
                ...flatten(stats),
                ...flatten(getCommonResultsStatistics(e.data)),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
                idmFramesReceived: assn.idm.getFramesReceived(),
            },
        });
    } finally {
        assn.invocations.delete(Number(request.invokeID));
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
    public readonly prebindRequests: Request[] = [];

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
        const idm = this.idm;
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
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
            outcome = await doBind(ctx, this.idm.socket, arg_, signErrors);
        } catch (e) {
            if (e instanceof DSABindError) {
                ctx.log.warn(e.message);
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
                idm.writeBindError(dsp_ip["&id"]!, error);
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
                        idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            } else {
                ctx.log.warn(e?.message);
                idm.writeAbort(Abort_reasonNotSpecified);
                ctx.telemetry.trackException({
                    exception: e,
                    properties: telemetryProperties,
                    measurements: {
                        bytesRead: this.socket.bytesRead,
                        bytesWritten: this.socket.bytesWritten,
                        idmFramesReceived: this.idm.getFramesReceived(),
                    },
                });
            }
            return;
        }
        this.reset();
        this.boundEntry = outcome.boundVertex;
        this.boundNameAndUID = outcome.boundNameAndUID;
        this.authLevel = outcome.authLevel;
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
                source: remoteHostIdentifier,
                protocol: "DSP",
                aid: this.id,
                dn: this.boundNameAndUID?.dn
                    ? encodeLDAPDN(ctx, this.boundNameAndUID.dn)
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
        ) {
            this.authorizedForSignedResults = true;
        }
        if (
            ("basicLevels" in this.authLevel)
            && !compareAuthenticationLevel( // Returns true if a > b.
                ctx.config.signing.signedErrorsMinAuthRequired,
                this.authLevel.basicLevels,
            )
        ) {
            this.authorizedForSignedErrors = true;
        }
        const bindResult = new DSABindArgument(
            undefined, // TODO: Supply return credentials. NOTE that the specification says that this must be the same CHOICE that the user supplied.
            versions,
        );
        idm.writeBindResult(dsp_ip["&id"]!, _encode_DSABindResult(bindResult, BER));
        idm.events.removeAllListeners("request");
        idm.events.on("request", this.handleRequest.bind(this));
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
    private handleRequest (request: Request): void {
        handleRequestAndErrors(this.ctx, this, request);
    }

    private reset (): void {
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
        if (this.idm.remoteStatus !== IDMStatus.BOUND) {
            return; // We don't want users to be able to spam unbinds.
        }
        this.reset();
        this.ctx.telemetry.trackRequest({
            name: "UNBIND",
            url: this.ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${this.ctx.config.idm.port}`,
            duration: 1,
            resultCode: 200,
            success: true,
            properties: {
                remoteFamily: this.idm.s.remoteFamily,
                remoteAddress: this.idm.s.remoteAddress,
                remotePort: this.idm.s.remotePort,
                administratorEmail: this.ctx.config.administratorEmail,
                association_id: this.id,
            },
            measurements: {
                bytesRead: this.idm.socket.bytesRead,
                bytesWritten: this.idm.socket.bytesWritten,
                idmFramesReceived: this.idm.getFramesReceived(),
            },
        });
        this.ctx.log.warn(this.ctx.i18n.t("log:connection_unbound", {
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
     * @param idm The underlying IDM transport socket
     */
    constructor (
        readonly ctx: MeerkatContext,
        readonly idm: IDMConnection,
    ) {
        super();
        this.socket = idm.s;
        assert(ctx.config.dsp.enabled, "User somehow bound via DSP when it was disabled.");
        this.socket.on("close", () => {
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
        });
        idm.events.on("unbind", this.handleUnbind.bind(this));
        idm.events.removeAllListeners("request");
        idm.events.on("request", (request: Request) => {
            if (this.prebindRequests.length >= ctx.config.maxPreBindRequests) {
                ctx.log.warn(ctx.i18n.t("log:too_many_prebind_requests", {
                    host: this.socket.remoteAddress,
                    cid: this.id,
                }), {
                    remoteFamily: this.socket.remoteFamily,
                    remoteAddress: this.socket.remoteAddress,
                    remotePort: this.socket.remotePort,
                    association_id: this.id,
                });
                idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
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
        ) {
            this.authorizedForSignedErrors = true;
        }
    }
}
