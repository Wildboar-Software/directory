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
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import { id_opcode_abandon } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-abandon.va";
import { id_opcode_administerPassword } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-administerPassword.va";
import { id_opcode_addEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-addEntry.va";
import { id_opcode_changePassword } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-changePassword.va";
import { id_opcode_compare } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-compare.va";
import { id_opcode_modifyDN } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyDN.va";
import { id_opcode_modifyEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-modifyEntry.va";
import { id_opcode_list } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-list.va";
import { id_opcode_read } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-read.va";
import { id_opcode_removeEntry } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-removeEntry.va";
import { id_opcode_search } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/id-opcode-search.va";
import {
    _decode_AbandonArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonArgument.ta";
import {
    _decode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    _decode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import abandon from "./operations/abandon";
import addEntry from "./operations/addEntry";
import removeEntry from "./operations/removeEntry";
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
} from "./errors";
import {
    _encode_Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { BERElement } from "asn1-ts";
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

const BER = () => new BERElement();
const opcode_abandon: number = (id_opcode_abandon as { local: number}).local;
const opcode_administerPassword: number = (id_opcode_administerPassword as { local: number}).local;
const opcode_addEntry: number = (id_opcode_addEntry as { local: number}).local;
const opcode_changePassword: number = (id_opcode_changePassword as { local: number}).local;
const opcode_compare: number = (id_opcode_compare as { local: number}).local;
const opcode_modifyDN: number = (id_opcode_modifyDN as { local: number}).local;
const opcode_modifyEntry: number = (id_opcode_modifyEntry as { local: number}).local;
const opcode_list: number = (id_opcode_list as { local: number}).local;
const opcode_read: number = (id_opcode_read as { local: number}).local;
const opcode_removeEntry: number = (id_opcode_removeEntry as { local: number}).local;
const opcode_search: number = (id_opcode_search as { local: number}).local;

async function handleRequest (
    ctx: Context,
    dap: DAPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new Error();
    }
    switch (request.opcode.local) {
    case (opcode_abandon): {
        const arg = _decode_AbandonArgument(request.argument);
        const data = ("signed" in arg)
            ? arg.signed.toBeSigned
            : arg.unsigned;
        const res = await abandon(ctx, dap, data);
        break;
    }
    case (opcode_addEntry): {
        const arg = _decode_AddEntryArgument(request.argument);
        const data = ("signed" in arg)
            ? arg.signed.toBeSigned
            : arg.unsigned;
        const res = await addEntry(ctx, data);
        break;
    }
    case (opcode_modifyEntry): {
        const arg = _decode_RemoveEntryArgument(request.argument);
        const data = ("signed" in arg)
            ? arg.signed.toBeSigned
            : arg.unsigned;
        const res = await removeEntry(ctx, data);
        break;
    }
    default: {
        throw new UnknownOperationError();
    }
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
class DAPConnection {
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
        console.log("DAP connection established.");
        const bindResult = new DirectoryBindResult(
          undefined,
          undefined,
          undefined,
        );
        // Check bind credentials.
        idm.writeBindResult(dap_ip["&id"], _encode_DirectoryBindResult(bindResult, BER));
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
