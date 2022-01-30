import {
    Context,
    ClientAssociation,
    OperationStatistics,
    OperationInvocationInfo,
    MistypedPDUError,
    DSABindError,
    BindReturn,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
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

async function handleRequest (
    ctx: Context,
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

async function handleRequestAndErrors (
    ctx: Context,
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
        });
        assn.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        return;
    }
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(),
        connection: getConnectionStatistics(assn),
        // idm?: IDMTransportStatistics;
        bind: {
            protocol: dsp_ip["&id"]!.toString(),
        },
        request: {
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
    } catch (e) {
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
        if (e instanceof errors.AbandonError) {
            const code = _encode_Code(errors.AbandonError.errcode, BER);
            const data = _encode_AbandonedData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.pagingAbandoned = (e.data.problem === 0);
        } else if (e instanceof errors.AbandonFailedError) {
            const code = _encode_Code(errors.AbandonFailedError.errcode, BER);
            const data = _encode_AbandonFailedData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.AttributeError) {
            const code = _encode_Code(errors.AttributeError.errcode, BER);
            const data = _encode_AttributeErrorData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.attributeProblems = e.data.problems.map((ap) => ({
                type: ap.type_.toString(),
                problem: Number(ap.problem),
            }));
        } else if (e instanceof errors.NameError) {
            const code = _encode_Code(errors.NameError.errcode, BER);
            const data = _encode_NameErrorData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.matchedNameLength = e.data.matched.rdnSequence.length;
        } else if (e instanceof errors.ReferralError) {
            const code = _encode_Code(errors.ReferralError.errcode, BER);
            const data = _encode_ReferralData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.candidate = getContinuationReferenceStatistics(e.data.candidate);
        } else if (e instanceof errors.SecurityError) {
            const code = _encode_Code(errors.SecurityError.errcode, BER);
            const data = _encode_SecurityErrorData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.ServiceError) {
            const code = _encode_Code(errors.ServiceError.errcode, BER);
            const data = _encode_ServiceErrorData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.UpdateError) {
            const code = _encode_Code(errors.UpdateError.errcode, BER);
            const data = _encode_UpdateErrorData(e.data, BER);
            assn.idm.writeError(request.invokeID, code, data);
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
            ctx.telemetry.sendEvent({
                ...stats,
                unusualError: e,
            });
            assn.idm.writeAbort(Abort_reasonNotSpecified);
        }
    } finally {
        assn.invocations.delete(Number(request.invokeID));
        ctx.telemetry.sendEvent(stats);
    }
}

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

    public async attemptBind (arg: ASN1Element): Promise<void> {
        const arg_ = _decode_DSABindArgument(arg);
        const ctx = this.ctx;
        const idm = this.idm;
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
        const startBindTime = new Date();
        let outcome!: BindReturn;
        try {
            outcome = await doBind(ctx, this.idm.socket, arg_);
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
                const error = directoryBindError.encoderFor["&ParameterType"]!(err, BER);
                idm.writeBindError(dsp_ip["&id"]!, error);
                return;
            } else {
                ctx.log.warn(e?.message);
                idm.writeAbort(Abort_reasonNotSpecified);
                return;
            }
        }
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
            }), {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                association_id: this.id,
            });
        } else {
            ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                source: remoteHostIdentifier,
                protocol: "DSP",
                dn: this.boundNameAndUID?.dn
                    ? encodeLDAPDN(ctx, this.boundNameAndUID.dn)
                    : "",
            }), {
                remoteFamily: this.socket.remoteFamily,
                remoteAddress: this.socket.remoteAddress,
                remotePort: this.socket.remotePort,
                association_id: this.id,
            });
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

    private async handleRequest (request: Request): Promise<void> {
        await handleRequestAndErrors(this.ctx, this, request);
    }

    private async handleUnbind (): Promise<void> {
        if (this.idm.remoteStatus !== IDMStatus.BOUND) {
            return; // We don't want users to be able to spam unbinds.
        }
        this.ctx.db.enqueuedListResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
            },
        });
        this.ctx.db.enqueuedSearchResult.deleteMany({ // INTENTIONAL_NO_AWAIT
            where: {
                connection_uuid: this.id,
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

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
    ) {
        super();
        this.socket = idm.s;
        assert(ctx.config.dsp.enabled, "User somehow bound via DSP when it was disabled.");
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
    }
}
