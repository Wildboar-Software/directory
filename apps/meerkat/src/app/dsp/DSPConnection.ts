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
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
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
import chainedAbandon from "./operations/chainedAbandon";
import chainedAdministerPassword from "./operations/chainedAdministerPassword";
import chainedAddEntry from "./operations/chainedAddEntry";
import chainedChangePassword from "./operations/chainedChangePassword";
import chainedCompare from "./operations/chainedCompare";
import chainedModifyDN from "./operations/chainedModifyDN";
import chainedModifyEntry from "./operations/chainedModifyEntry";
import chainedList from "./operations/chainedList";
import chainedRead from "./operations/chainedRead";
import chainedRemoveEntry from "./operations/chainedRemoveEntry";
import chainedSearch from "./operations/chainedSearch";
import {
    chainedAbandon as chainedAbandonOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAbandon.oa";
import {
    chainedAddEntry as chainedAddEntryOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAddEntry.oa";
import {
    chainedChangePassword as chainedChangePasswordOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedChangePassword.oa";
import {
    chainedCompare as chainedCompareOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedCompare.oa";
import {
    chainedLdapTransport as chainedLdapTransportOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedLdapTransport.oa";
import {
    chainedLinkedLDAP as chainedLinkedLDAPOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedLinkedLDAP.oa";
import {
    chainedList as chainedListOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedList.oa";
import {
    chainedModifyDN as chainedModifyDNOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedModifyDN.oa";
import {
    chainedModifyEntry as chainedModifyEntryOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedModifyEntry.oa";
import {
    chainedRead as chainedReadOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import {
    chainedRemoveEntry as chainedRemoveEntryOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRemoveEntry.oa";
import {
    chainedSearch as chainedSearchOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedSearch.oa";
import {
    chainedAdministerPassword as chainedAdministerPasswordOperation,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedAdministerPassword.oa";
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
    dap: DSPConnection, // eslint-disable-line
    request: Request,
): Promise<void> {
    if (!("local" in request.opcode)) {
        throw new Error();
    }
    switch (request.opcode.local) {
    case (opcode_abandon): {
        const arg = _decode_AbandonArgument(request.argument);
        const res = await chainedAbandon(ctx, arg);
        break;
    }
    case (opcode_administerPassword): {
        const arg = chainedAdministerPasswordOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedAdministerPassword(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedAdministerPasswordOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_addEntry): {
        const arg = chainedAddEntryOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedAddEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedAddEntryOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_changePassword): {
        const arg = chainedChangePasswordOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedChangePassword(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedChangePasswordOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_compare): {
        const arg = chainedCompareOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedCompare(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedCompareOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_modifyDN): {
        const arg = chainedModifyDNOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedModifyDN(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedModifyDNOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_modifyEntry): {
        const arg = chainedModifyEntryOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedModifyEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedModifyEntryOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_list): {
        const arg = chainedListOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedList(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedListOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_read): {
        const arg = chainedReadOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedRead(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedReadOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_removeEntry): {
        const arg = chainedRemoveEntryOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedRemoveEntry(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedRemoveEntryOperation.encoderFor["&ResultType"]!(res, BER),
        );
        break;
    }
    case (opcode_search): {
        const arg = chainedSearchOperation.decoderFor["&ArgumentType"]!(request.argument);
        const res = await chainedSearch(ctx, arg);
        await dap.idm.writeResult(
            request.invokeID,
            request.opcode,
            chainedSearchOperation.encoderFor["&ResultType"]!(res, BER),
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
    dap: DSPConnection, // eslint-disable-line
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
class DSPConnection {
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
        console.log("DAP connection established.");
        const bindResult = new DirectoryBindResult(
            undefined,
            undefined,
            undefined,
        );
        // Check bind credentials.
        idm.writeBindResult(dsp_ip["&id"]!, _encode_DirectoryBindResult(bindResult, BER));
        idm.events.on("request", this.handleRequest.bind(this));
        idm.events.on("unbind", this.handleUnbind.bind(this));
    }
}
