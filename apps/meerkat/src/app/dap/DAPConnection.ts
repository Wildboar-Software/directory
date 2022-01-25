import {
    Context,
    ClientConnection,
    PagedResultsRequestState,
    OperationStatistics,
    OperationInvocationInfo,
    MistypedPDUError,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { IDMConnection } from "@wildboar/idm";
import versions from "./versions";
import type {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    DirectoryBindResult,
    _encode_DirectoryBindResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindResult.ta";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
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
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import OperationDispatcher from "../distributed/OperationDispatcher";
import { bind as doBind } from "./bind";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import getServerStatistics from "../telemetry/getServerStatistics";
import getConnectionStatistics from "../telemetry/getConnectionStatistics";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getContinuationReferenceStatistics from "../telemetry/getContinuationReferenceStatistics";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import { EventEmitter } from "events";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import {
    addEntry,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import isDebugging from "is-debugging";

async function handleRequest (
    ctx: Context,
    dap: DAPConnection, // eslint-disable-line
    request: Request,
    stats: OperationStatistics,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new MistypedPDUError();
    }
    const result = await OperationDispatcher.dispatchDAPRequest(
        ctx,
        dap,
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
    const unprotectedResult = getOptionallyProtectedValue(result.result);
    await dap.idm.writeResult(request.invokeID, result.opCode, unprotectedResult.result);
    ctx.statistics.operations.push(stats);
}

async function handleRequestAndErrors (
    ctx: Context,
    dap: DAPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if ((request.invokeID < 0) || (request.invokeID > Number.MAX_SAFE_INTEGER)) {
        ctx.log.warn(ctx.i18n.t("log:unusual_invoke_id", {
            cid: dap.id,
        }));
        dap.idm.writeAbort(Abort_invalidPDU);
        return;
    }
    if (dap.invocations.has(Number(request.invokeID))) {
        await dap.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        return;
    }
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(),
        connection: getConnectionStatistics(dap),
        // idm?: IDMTransportStatistics;
        bind: {
            protocol: dap_ip["&id"]!.toString(),
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
    dap.invocations.set(Number(request.invokeID), info);
    try {
        await handleRequest(ctx, dap, request, stats);
    } catch (e) {
        if (isDebugging) {
            console.error(e);
        } else {
            ctx.log.error(e.message);
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
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.pagingAbandoned = (e.data.problem === 0);
        } else if (e instanceof errors.AbandonFailedError) {
            const code = _encode_Code(errors.AbandonFailedError.errcode, BER);
            const data = _encode_AbandonFailedData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.AttributeError) {
            const code = _encode_Code(errors.AttributeError.errcode, BER);
            const data = _encode_AttributeErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.attributeProblems = e.data.problems.map((ap) => ({
                type: ap.type_.toString(),
                problem: Number(ap.problem),
            }));
        } else if (e instanceof errors.NameError) {
            const code = _encode_Code(errors.NameError.errcode, BER);
            const data = _encode_NameErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.matchedNameLength = e.data.matched.rdnSequence.length;
        } else if (e instanceof errors.ReferralError) {
            const code = _encode_Code(errors.ReferralError.errcode, BER);
            const data = _encode_ReferralData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.candidate = getContinuationReferenceStatistics(e.data.candidate);
        } else if (e instanceof errors.SecurityError) {
            const code = _encode_Code(errors.SecurityError.errcode, BER);
            const data = _encode_SecurityErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.ServiceError) {
            const code = _encode_Code(errors.ServiceError.errcode, BER);
            const data = _encode_ServiceErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
            stats.outcome.error.problem = Number(e.data.problem);
        } else if (e instanceof errors.UpdateError) {
            const code = _encode_Code(errors.UpdateError.errcode, BER);
            const data = _encode_UpdateErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
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
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest);
        } else if (e instanceof errors.UnsupportedOperationError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_unsupportedOperationRequest);
        } else if (e instanceof errors.UnknownOperationError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else if (e instanceof errors.MistypedPDUError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_mistypedPDU);
        } else if (e instanceof errors.MistypedArgumentError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_mistypedArgumentRequest);
        } else if (e instanceof errors.ResourceLimitationError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest);
        } else if (e instanceof errors.UnknownError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_unknownError);
        } else if (e instanceof errors.UnboundRequestError) {
            await dap.idm.writeAbort(Abort_unboundRequest).then(() => dap.idm.events.emit("unbind", null));
        } else if (e instanceof errors.InvalidProtocolError) {
            await dap.idm.writeAbort(Abort_invalidProtocol).then(() => dap.idm.events.emit("unbind", null));
        } else if (e instanceof errors.ReasonNotSpecifiedError) {
            await dap.idm.writeAbort(Abort_reasonNotSpecified).then(() => dap.idm.events.emit("unbind", null));
        } else {
            ctx.telemetry.sendEvent({
                ...stats,
                unusualError: e,
            });
            await dap.idm.writeAbort(Abort_reasonNotSpecified).then(() => dap.idm.events.emit("unbind", null));
        }
    } finally {
        dap.invocations.delete(Number(request.invokeID));
        if (
            compareCode(request.opcode, administerPassword["&operationCode"]!)
            || compareCode(request.opcode, changePassword["&operationCode"]!)
            || (
                compareCode(request.opcode, addEntry["&operationCode"]!)
                && ctx.config.bulkInsertMode
            )
        ) {
            // We do not send telemetry data on administerPassword or
            // changePassword operations, or when bulk insert mode is used and
            // the operation is `addEntry`.
            ctx.statistics.operations.length = 0;
        } else {
            for (const opstat of ctx.statistics.operations) {
                ctx.telemetry.sendEvent(opstat);
            }
        }
    }
}

export default
class DAPConnection extends ClientConnection {
    public readonly pagedResultsRequests: Map<string, PagedResultsRequestState> = new Map([]);

    private async handleRequest (request: Request): Promise<void> {
        await handleRequestAndErrors(this.ctx, this, request);
    }

    private async handleUnbind (): Promise<void> {
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
            ctype: DAPConnection.name,
            cid: this.id,
            protocol: "DAP",
        }));
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
        readonly bind: DirectoryBindArgument,
    ) {
        super();
        this.socket = idm.s;
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
        const startBindTime = new Date();
        doBind(ctx, idm.s, bind)
            .then(async (outcome) => {
                if (outcome.failedAuthentication) {
                    const endBindTime = new Date();
                    const bindTime: number = Math.abs(differenceInMilliseconds(startBindTime, endBindTime));
                    const totalTimeInMilliseconds: number = ctx.config.bindMinSleepInMilliseconds
                        + crypto.randomInt(ctx.config.bindSleepRangeInMilliseconds);
                    const sleepTime: number = Math.abs(totalTimeInMilliseconds - bindTime);
                    await sleep(sleepTime);
                }
                this.boundEntry = outcome.boundVertex;
                this.boundNameAndUID = outcome.boundNameAndUID;
                this.authLevel = outcome.authLevel;
                if (outcome.failedAuthentication) {
                    const err: typeof directoryBindError["&ParameterType"] = {
                        unsigned: new DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1(
                            versions,
                            {
                                securityError: SecurityProblem_noInformation,
                            },
                            undefined, // Failed authentication will not yield any security parameters.
                        ),
                    };
                    const error = directoryBindError.encoderFor["&ParameterType"]!(err, BER);
                    idm
                        .writeBindError(dap_ip["&id"]!, error)
                        .then(() => {
                            this.handleUnbind()
                                .then(() => {
                                    ctx.log.info(ctx.i18n.t("log:disconnected_auth_failure", {
                                        ctype: DAPConnection.name,
                                        cid: this.id,
                                        source: remoteHostIdentifier,
                                    }));
                                })
                                .catch((e) => {
                                    ctx.log.info(ctx.i18n.t("log:error_unbinding", {
                                        ctype: DAPConnection.name,
                                        cid: this.id,
                                        e: e.message,
                                    }));
                                });
                        })
                        .catch((e) => {
                            ctx.log.info(ctx.i18n.t("log:error_writing_bind_error", {
                                ctype: DAPConnection.name,
                                cid: this.id,
                                e: e.message,
                            }));
                        });
                    ctx.log.info(ctx.i18n.t("log:auth_failure", {
                        ctype: DAPConnection.name,
                        cid: this.id,
                        source: remoteHostIdentifier,
                    }));
                    return;
                }
                const bindResult = new DirectoryBindResult(
                    undefined,
                    versions,
                    undefined,
                );
                idm.writeBindResult(dap_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
                if (
                    ("basicLevels" in outcome.authLevel)
                    && (outcome.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
                ) {
                    ctx.log.info(ctx.i18n.t("log:connection_bound_anon", {
                        source: remoteHostIdentifier,
                        protocol: "DAP",
                    }));
                } else {
                    ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                        source: remoteHostIdentifier,
                        protocol: "DAP",
                        dn: this.boundNameAndUID?.dn
                            ? encodeLDAPDN(ctx, this.boundNameAndUID.dn)
                            : "",
                    }));
                }
            })
            .catch((e) => {
                ctx.log.error(ctx.i18n.t("log:bind_error", {
                    ctype: DAPConnection.name,
                    cid: this.id,
                    source: remoteHostIdentifier,
                    e: e.message,
                }));
            });

        idm.events.removeAllListeners("request");
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
