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
    _decode_AdministerPasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordArgument.ta";
import {
    _decode_AddEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryArgument.ta";
import {
    _decode_ChangePasswordArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordArgument.ta";
import {
    _decode_CompareArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareArgument.ta";
import {
    _decode_ModifyDNArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNArgument.ta";
import {
    _decode_ModifyEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryArgument.ta";
import {
    _decode_ListArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListArgument.ta";
import {
    _decode_ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    _decode_RemoveEntryArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryArgument.ta";
import {
    _decode_SearchArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgument.ta";
import abandon from "./operations/abandon";
import administerPassword from "./operations/administerPassword";
import addEntry from "./operations/addEntry";
import changePassword from "./operations/changePassword";
import compare from "./operations/compare";
import modifyDN from "./operations/modifyDN";
import modifyEntry from "./operations/modifyEntry";
import list from "./operations/list";
import read from "./operations/read";
import removeEntry from "./operations/removeEntry";
import search from "./operations/search";
import {
    _encode_AbandonResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AbandonResult.ta";
import {
    _encode_AdministerPasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AdministerPasswordResult.ta";
import {
    _encode_AddEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/AddEntryResult.ta";
import {
    _encode_ChangePasswordResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ChangePasswordResult.ta";
import {
    _encode_CompareResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/CompareResult.ta";
import {
    _encode_ModifyDNResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyDNResult.ta";
import {
    _encode_ModifyEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ModifyEntryResult.ta";
import {
    _encode_ListResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ListResult.ta";
import {
    _encode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import {
    _encode_RemoveEntryResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/RemoveEntryResult.ta";
import {
    _encode_SearchResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchResult.ta";
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
        const res = await abandon(ctx, arg);

        break;
    }
    case (opcode_administerPassword): {
        const arg = _decode_AdministerPasswordArgument(request.argument);
        const res = await administerPassword(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_AdministerPasswordResult(res, BER),
        );
        break;
    }
    case (opcode_addEntry): {
        const arg = _decode_AddEntryArgument(request.argument);
        const res = await addEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_AddEntryResult(res, BER),
        );
        break;
    }
    case (opcode_changePassword): {
        const arg = _decode_ChangePasswordArgument(request.argument);
        const res = await changePassword(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ChangePasswordResult(res, BER),
        );
        break;
    }
    case (opcode_compare): {
        const arg = _decode_CompareArgument(request.argument);
        const res = await compare(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_CompareResult(res, BER),
        );
        break;
    }
    case (opcode_modifyDN): {
        const arg = _decode_ModifyDNArgument(request.argument);
        const res = await modifyDN(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ModifyDNResult(res, BER),
        );
        break;
    }
    case (opcode_modifyEntry): {
        const arg = _decode_ModifyEntryArgument(request.argument);
        const res = await modifyEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ModifyEntryResult(res, BER),
        );
        break;
    }
    case (opcode_list): {
        const arg = _decode_ListArgument(request.argument);
        const res = await list(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ListResult(res, BER),
        );
        break;
    }
    case (opcode_read): {
        const arg = _decode_ReadArgument(request.argument);
        const res = await read(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_ReadResult(res, BER),
        );
        break;
    }
    case (opcode_removeEntry): {
        const arg = _decode_RemoveEntryArgument(request.argument);
        const res = await removeEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_RemoveEntryResult(res, BER),
        );
        break;
    }
    case (opcode_search): {
        const arg = _decode_SearchArgument(request.argument);
        const res = await search(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            _encode_SearchResult(res, BER),
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
        idm.writeBindResult(dap_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
