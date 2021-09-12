import { Context, ClientConnection, PagedResultsRequestState } from "../types";
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
    AbandonError,
    AbandonFailedError,
    AttributeError,
    NameError,
    ReferralError,
    SecurityError,
    ServiceError,
    UpdateError,
    UnknownOperationError,
} from "../errors";
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
    IdmReject_reason_unknownOperationRequest,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import { Abort_reasonNotSpecified } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
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
    directoryBind,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBind.oa";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";

async function handleRequest (
    ctx: Context,
    dap: DAPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new Error();
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
    if ("error" in result) {
        await dap.idm.writeError(
            request.invokeID,
            _encode_Code(result.errcode!, BER),
            result.error,
        );
    } else {
        await dap.idm.writeResult(request.invokeID, result.opCode, result.result!);
    }
}

async function handleRequestAndErrors (
    ctx: Context,
    dap: DAPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    const now = new Date();
    dap.invocations.set(request.invokeID, {
        invokeId: request.invokeID,
        operationCode: request.opcode,
        startTime: new Date(),
    });
    try {
        await handleRequest(ctx, dap, request);
    } catch (e) {
        console.error(e);
        if (e instanceof AbandonError) {
            const code = _encode_Code(AbandonError.errcode, BER);
            const data = _encode_AbandonedData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AbandonFailedError) {
            const code = _encode_Code(AbandonFailedError.errcode, BER);
            const data = _encode_AbandonFailedData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AttributeError) {
            const code = _encode_Code(AttributeError.errcode, BER);
            const data = _encode_AttributeErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof NameError) {
            const code = _encode_Code(NameError.errcode, BER);
            const data = _encode_NameErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ReferralError) {
            const code = _encode_Code(ReferralError.errcode, BER);
            const data = _encode_ReferralData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof SecurityError) {
            const code = _encode_Code(SecurityError.errcode, BER);
            const data = _encode_SecurityErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ServiceError) {
            const code = _encode_Code(ServiceError.errcode, BER);
            const data = _encode_ServiceErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UpdateError) {
            const code = _encode_Code(UpdateError.errcode, BER);
            const data = _encode_UpdateErrorData(e.data, BER);
            await dap.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UnknownOperationError) {
            await dap.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else {
            await dap.idm.writeAbort(Abort_reasonNotSpecified);
        }
    } finally {
        dap.invocations.set(request.invokeID, {
            invokeId: request.invokeID,
            operationCode: request.opcode,
            startTime: now,
            resultTime: new Date(),
        });
    }
}


export default
class DAPConnection extends ClientConnection {
    public readonly pagedResultsRequests: Map<string, PagedResultsRequestState> = new Map([]);

    private async handleRequest (request: Request): Promise<void> {
        await handleRequestAndErrors(this.ctx, this, request);
    }

    private async handleUnbind (): Promise<void> {
        try {
            this.idm.close();
        } catch (e) {
            this.ctx.log.warn(`${DAPConnection.name} ${this.id}: Error in closing IDM connection: ${e}`);
        } finally {
            this.ctx.log.info(`${DAPConnection.name} ${this.id}: Unbound.`);
        }
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
        readonly bind: DirectoryBindArgument,
    ) {
        super();
        const remoteHostIdentifier = `${idm.s.remoteFamily}://${idm.s.remoteAddress}/${idm.s.remotePort}`;
        doBind(ctx, idm.s, bind)
            .then((outcome) => {
                this.boundEntry = undefined;
                this.boundNameAndUID = undefined;
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
                    const error = directoryBind.encoderFor["&ParameterType"]!(err, BER);
                    idm
                        .writeBindError(dap_ip["&id"]!, error)
                        .then(() => {
                            this.handleUnbind()
                                .then(() => {
                                    ctx.log.info(`${DAPConnection.name} ${this.id}: Disconnected ${remoteHostIdentifier} due to authentication failure.`);
                                })
                                .catch((e) => {
                                    ctx.log.error(`${DAPConnection.name} ${this.id}: Error disconnecting from ${remoteHostIdentifier}: `, e);
                                });
                        })
                        .catch((e) => {
                            ctx.log.error(`${DAPConnection.name} ${this.id}: Error writing bind error: ${remoteHostIdentifier}: `, e);
                        });
                    ctx.log.info(`${DAPConnection.name} ${this.id}: Invalid credentials from ${remoteHostIdentifier}.`);
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
                    ctx.log.info(`${DAPConnection.name} ${this.id}: Anonymous DAP connection bound from ${remoteHostIdentifier}.`);
                } else {
                    ctx.log.info(`${DAPConnection.name} ${this.id}: Authenticated DAP connection bound from ${remoteHostIdentifier}.`);
                }
            })
            .catch((e) => {
                ctx.log.error(`${DAPConnection.name} ${this.id}: Error during DAP bind operation from ${remoteHostIdentifier}: `, e);
            });

        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
