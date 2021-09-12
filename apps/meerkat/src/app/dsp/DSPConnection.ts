import { Context, ClientConnection } from "../types";
import { IDMConnection } from "@wildboar/idm";
import versions from "./versions";
import {
    DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import {
    _encode_DSABindResult,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindResult.ta";
import OperationDispatcher from "../distributed/OperationDispatcher";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
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
import { bind as doBind } from "./bind";
import {
    dSABind,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/dSABind.oa";
import {
    directoryBindError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/directoryBindError.oa";
import {
    DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindError-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    SecurityProblem_noInformation,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";

async function handleRequest (
    ctx: Context,
    dsp: DSPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new Error();
    }
    const result = await OperationDispatcher.dispatchDSPRequest(
        ctx,
        dsp,
        {
            invokeId: {
                present: request.invokeID,
            },
            opCode: request.opcode,
            argument: request.argument,
        },
    );
    if ("error" in result) {
        await dsp.idm.writeError(
            request.invokeID,
            _encode_Code(result.errcode!, BER),
            result.error,
        );
    } else {
        await dsp.idm.writeResult(request.invokeID, result.opCode, result.result!);
    }
}

async function handleRequestAndErrors (
    ctx: Context,
    dsp: DSPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    const now = new Date();
    dsp.invocations.set(request.invokeID, {
        invokeId: request.invokeID,
        operationCode: request.opcode,
        startTime: new Date(),
    });
    try {
        await handleRequest(ctx, dsp, request);
    } catch (e) {
        console.error(e);
        if (e instanceof AbandonError) {
            const code = _encode_Code(AbandonError.errcode, BER);
            const data = _encode_AbandonedData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AbandonFailedError) {
            const code = _encode_Code(AbandonFailedError.errcode, BER);
            const data = _encode_AbandonFailedData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AttributeError) {
            const code = _encode_Code(AttributeError.errcode, BER);
            const data = _encode_AttributeErrorData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof NameError) {
            const code = _encode_Code(NameError.errcode, BER);
            const data = _encode_NameErrorData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ReferralError) {
            const code = _encode_Code(ReferralError.errcode, BER);
            const data = _encode_ReferralData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof SecurityError) {
            const code = _encode_Code(SecurityError.errcode, BER);
            const data = _encode_SecurityErrorData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ServiceError) {
            const code = _encode_Code(ServiceError.errcode, BER);
            const data = _encode_ServiceErrorData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UpdateError) {
            const code = _encode_Code(UpdateError.errcode, BER);
            const data = _encode_UpdateErrorData(e.data, BER);
            await dsp.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UnknownOperationError) {
            await dsp.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else {
            await dsp.idm.writeAbort(Abort_reasonNotSpecified);
        }
    } finally {
        dsp.invocations.set(request.invokeID, {
            invokeId: request.invokeID,
            operationCode: request.opcode,
            startTime: now,
            resultTime: new Date(),
        });
    }
}

export default
class DSPConnection extends ClientConnection {

    private async handleRequest (request: Request): Promise<void> {
        await handleRequestAndErrors(this.ctx, this, request);
    }

    private async handleUnbind (): Promise<void> {
        try {
            this.idm.close();
        } catch (e) {
            this.ctx.log.warn(`${DSPConnection.name} ${this.id}: Error in closing IDM connection: ${e}`);
        } finally {
            this.ctx.log.info(`${DSPConnection.name} ${this.id}: Unbound.`);
        }
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
        readonly bind: DSABindArgument,
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
                    const error = dSABind.encoderFor["&ParameterType"]!(err, BER);
                    idm
                        .writeBindError(dsp_ip["&id"]!, error)
                        .then(() => {
                            this.handleUnbind()
                                .then(() => {
                                    ctx.log.info(`${DSPConnection.name} ${this.id}: Disconnected ${remoteHostIdentifier} due to authentication failure.`);
                                })
                                .catch((e) => {
                                    ctx.log.error(`${DSPConnection.name} ${this.id}: Error disconnecting from ${remoteHostIdentifier}: `, e);
                                });
                        })
                        .catch((e) => {
                            ctx.log.error(`${DSPConnection.name} ${this.id}: Error writing bind error: ${remoteHostIdentifier}: `, e);
                        });
                    ctx.log.info(`${DSPConnection.name} ${this.id}: Invalid credentials from ${remoteHostIdentifier}.`);
                    return;
                }
                const bindResult = new DSABindArgument( // DSABindResult === DSABindArgument
                    undefined,
                    versions,
                );
                idm.writeBindResult(dsp_ip["&id"]!, _encode_DSABindResult(bindResult, BER));
                if (
                    ("basicLevels" in outcome.authLevel)
                    && (outcome.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
                ) {
                    ctx.log.info(`${DSPConnection.name} ${this.id}: Anonymous DSP connection bound from ${remoteHostIdentifier}.`);
                } else {
                    ctx.log.info(`${DSPConnection.name} ${this.id}: Authenticated DSP connection bound from ${remoteHostIdentifier}.`);
                }
            })
            .catch((e) => {
                ctx.log.error(`${DSPConnection.name} ${this.id}: Error during DSP bind operation from ${remoteHostIdentifier}: `, e);
            });

        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
