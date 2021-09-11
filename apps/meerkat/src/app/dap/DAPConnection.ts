import { Context, ClientConnection, PagedResultsRequestState } from "../types";
import { IDMConnection } from "@wildboar/idm";
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
import { BERElement, TRUE_BIT } from "asn1-ts";
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
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
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

const BER = () => new BERElement();

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
    }
}


export default
class DAPConnection extends ClientConnection {
    public readonly pagedResultsRequests: Map<string, PagedResultsRequestState> = new Map([]);
    public get v1 (): boolean {
        return (this.bind.versions?.[Versions_v1] === TRUE_BIT);
    }
    public get v2 (): boolean {
        return (this.bind.versions?.[Versions_v2] === TRUE_BIT);
    }

    private async handleRequest (request: Request): Promise<void> {
        await handleRequestAndErrors(this.ctx, this, request);
    }

    private async handleUnbind (): Promise<void> {
        try {
            this.idm.close();
        } catch (e) {
            this.ctx.log.warn(`Error in closing IDM connection. ${e}`);
        } finally {
            this.ctx.log.info("Unbound.");
        }
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
        readonly bind: DirectoryBindArgument,
    ) {
        super();
        if (bind.credentials) {
            doBind(ctx, bind.credentials)
                .then((outcome) => {
                    if (!outcome) {
                        const err: typeof directoryBindError["&ParameterType"] = {
                            unsigned: new DirectoryBindError_OPTIONALLY_PROTECTED_Parameter1(
                                undefined,
                                {
                                    securityError: SecurityProblem_noInformation,
                                },
                                undefined,
                            ),
                        };
                        const error = directoryBindError.encoderFor["&ParameterType"]!(err, BER);
                        idm
                            .writeBindError(dap_ip["&id"]!, error)
                            .then(() => {
                                this.handleUnbind()
                                    .then(() => {
                                        ctx.log.info("Disconnected client due to authentication failure.");
                                    })
                                    .catch((e) => {
                                        ctx.log.error("Error disconnecting from client: ", e);
                                    });
                            })
                            .catch((e) => {
                                ctx.log.error("Error writing bind error: ", e);
                            });
                        ctx.log.info("Invalid credentials.");
                        return;
                    }
                    const bindResult = new DirectoryBindResult(
                        undefined,
                        undefined,
                        undefined,
                    );
                    idm.writeBindResult(dap_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
                    ctx.log.info("Authenticated DAP connection bound.");
                })
                .catch((e) => {
                    ctx.log.error("Error during bind operation: ", e);
                });
        } else {
            const bindResult = new DirectoryBindResult(
                undefined,
                undefined,
                undefined,
            );
            idm.writeBindResult(dap_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
            ctx.log.info("Anonymous DAP connection bound.");
        }
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
