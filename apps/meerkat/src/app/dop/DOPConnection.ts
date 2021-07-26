import { Context } from "../types";
import { IDMConnection } from "@wildboar/idm";
import type {
    DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    DirectoryBindResult,
    _encode_DirectoryBindResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindResult.ta";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
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
import type {
    PagedResultsRequest_newRequest,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PagedResultsRequest-newRequest.ta";
import {
    Versions_v1,
    Versions_v2,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Versions.ta";
import { v4 as uuid } from "uuid";
import establishOperationalBinding from "./operations/establishOperationalBinding";
import terminateOperationalBinding from "./operations/terminateOperationalBinding";
import {
    _decode_EstablishOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingArgument.ta";
import {
    _encode_EstablishOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/EstablishOperationalBindingResult.ta";
import {
    _decode_TerminateOperationalBindingArgument,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingArgument.ta";
import {
    _encode_TerminateOperationalBindingResult,
} from "@wildboar/x500/src/lib/modules/OperationalBindingManagement/TerminateOperationalBindingResult.ta";

const BER = () => new BERElement();

async function handleRequest (
    ctx: Context,
    dop: DOPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new Error();
    }
    switch (request.opcode.local) {
    case (100): { // establish
        const arg = _decode_EstablishOperationalBindingArgument(request.argument);
        const result = await establishOperationalBinding(ctx, arg);
        await dop.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_EstablishOperationalBindingResult(result, BER),
        );
        break;
    }
    case (101): { // terminate
        const arg = _decode_TerminateOperationalBindingArgument(request.argument);
        const result = await terminateOperationalBinding(ctx, this, arg);
        await dop.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_TerminateOperationalBindingResult(result, BER),
        );
        break;
    }
    default: {
        throw new UnknownOperationError();
    }
    }
}

async function handleRequestAndErrors (
    ctx: Context,
    dop: DOPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    try {
        await handleRequest(ctx, dop, request);
    } catch (e) {
        console.error(e);
        if (e instanceof AbandonError) {
            const code = _encode_Code(AbandonError.errcode, BER);
            const data = _encode_AbandonedData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AbandonFailedError) {
            const code = _encode_Code(AbandonFailedError.errcode, BER);
            const data = _encode_AbandonFailedData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof AttributeError) {
            const code = _encode_Code(AttributeError.errcode, BER);
            const data = _encode_AttributeErrorData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof NameError) {
            const code = _encode_Code(NameError.errcode, BER);
            const data = _encode_NameErrorData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ReferralError) {
            const code = _encode_Code(ReferralError.errcode, BER);
            const data = _encode_ReferralData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof SecurityError) {
            const code = _encode_Code(SecurityError.errcode, BER);
            const data = _encode_SecurityErrorData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof ServiceError) {
            const code = _encode_Code(ServiceError.errcode, BER);
            const data = _encode_ServiceErrorData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UpdateError) {
            const code = _encode_Code(UpdateError.errcode, BER);
            const data = _encode_UpdateErrorData(e.data, BER);
            await dop.idm.writeError(request.invokeID, code, data);
        } else if (e instanceof UnknownOperationError) {
            await dop.idm.writeReject(request.invokeID, IdmReject_reason_unknownOperationRequest);
        } else {
            await dop.idm.writeAbort(Abort_reasonNotSpecified);
        }
    }
}


export default
class DOPConnection {
    public readonly id = uuid();
    public readonly pagedResultsRequests: Map<string, [ request: PagedResultsRequest_newRequest, pageIndex: number ]> = new Map([]);
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
        this.ctx.log.info("Unbound.");
    }

    constructor (
        readonly ctx: Context,
        readonly idm: IDMConnection,
        readonly bind: DirectoryBindArgument,
    ) {
        console.log("DOP connection established.");
        const bindResult = new DirectoryBindResult(
            undefined,
            undefined,
            undefined,
        );
        // Check bind credentials.
        idm.writeBindResult(dop_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
