import {
    Context,
    ClientAssociation,
    PagedResultsRequestState,
    OperationStatistics,
    OperationInvocationInfo,
    MistypedPDUError,
    BindReturn,
    DirectoryBindError,
} from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import { IDMConnection } from "@wildboar/idm";
import versions from "./versions";
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
import OperationDispatcher from "../distributed/OperationDispatcher";
import { bind as doBind } from "./bind";
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
import printCode from "../utils/printCode";
import { ASN1Element } from "asn1-ts";
import {
    _decode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import { strict as assert } from "assert";

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
        // TODO: Log this.
        ctx.log.warn(ctx.i18n.t("log:dup_invoke_id", {
            iid: request.invokeID.toString(),
            cid: dap.id,
        }));
        dap.idm.writeReject(request.invokeID, IdmReject_reason_duplicateInvokeIDRequest).catch();
        return;
    }
    if (dap.invocations.size >= ctx.config.maxConcurrentOperationsPerConnection) {
        ctx.log.warn(ctx.i18n.t("log:max_concurrent_op", {
            cid: dap.id,
            iid: request.invokeID.toString(),
        }));
        dap.idm.writeReject(request.invokeID, IdmReject_reason_resourceLimitationRequest).catch();
        return;
    }
    // TODO: Check max concurrent operations.
    ctx.log.debug(ctx.i18n.t("log:received_request", {
        protocol: "DAP",
        iid: request.invokeID.toString(),
        op: printCode(request.opcode),
        cid: dap.id,
    }));
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
        if (!(
            compareCode(request.opcode, administerPassword["&operationCode"]!)
            || compareCode(request.opcode, changePassword["&operationCode"]!)
            || (
                compareCode(request.opcode, addEntry["&operationCode"]!)
                && ctx.config.bulkInsertMode
            )
        )) {
            ctx.telemetry.sendEvent(stats);
        }
    }
}

export default
class DAPConnection extends ClientAssociation {
    public readonly pagedResultsRequests: Map<string, PagedResultsRequestState> = new Map([]);

    public async attemptBind (arg: ASN1Element): Promise<void> {
        const arg_ = _decode_DirectoryBindArgument(arg);
        const ctx = this.ctx;
        const idm = this.idm;
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
        const startBindTime = new Date();
        let outcome!: BindReturn;
        try {
            outcome = await doBind(ctx, this.idm.socket, arg_);
        } catch (e) {
            if (e instanceof DirectoryBindError) {
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
                await idm.writeBindError(dap_ip["&id"]!, error);
                return;
            } else {
                ctx.log.warn(e?.message);
                await idm.writeAbort(Abort_reasonNotSpecified);
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
            assert(!ctx.config.forbidAnonymousBind, "Somehow a user bound anonymously when anonymous binds are forbidden.");
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
        const bindResult = new DirectoryBindResult(
            undefined, // TODO: Supply return credentials. NOTE that the specification says that this must be the same CHOICE that the user supplied.
            versions,
            undefined,
        );
        await idm.writeBindResult(dap_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
        idm.events.removeAllListeners("request");
        idm.events.on("request", this.handleRequest.bind(this));
    }

    private handleRequest (request: Request): void {
        handleRequestAndErrors(this.ctx, this, request).catch();
    }

    private async handleUnbind (): Promise<void> {
        if (!this.isBound()) {
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
            ctype: DAPConnection.name,
            cid: this.id,
            protocol: "DAP",
        }));
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
    ) {
        super();
        this.socket = idm.s;
        assert(ctx.config.dap.enabled, "User somehow bound via DAP when it was disabled.");
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
