import { IDMConnection } from "@wildboar/idm";
import {
    ROSETransport,
    new_rose_transport,
    RejectReason,
    AbortReason,
} from "@wildboar/rose-transport";
import {
    IdmReject_reason,
    IdmReject_reason_mistypedPDU,
    IdmReject_reason_duplicateInvokeIDRequest,
    IdmReject_reason_unsupportedOperationRequest,
    IdmReject_reason_unknownOperationRequest,
    IdmReject_reason_mistypedArgumentRequest,
    IdmReject_reason_resourceLimitationRequest,
    IdmReject_reason_unknownInvokeIDResult,
    IdmReject_reason_mistypedResultRequest,
    IdmReject_reason_unknownInvokeIDError,
    IdmReject_reason_unknownError,
    IdmReject_reason_mistypedParameterError,
    IdmReject_reason_unsupportedIdmVersion,
    IdmReject_reason_unsuitableIdmVersion,
    IdmReject_reason_invalidIdmVersion,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import {
    Abort,
    Abort_mistypedPDU,
    Abort_unboundRequest,
    Abort_invalidPDU,
    Abort_resourceLimitation,
    Abort_connectionFailed,
    Abort_invalidProtocol,
    Abort_reasonNotSpecified,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import {
    _encode_Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { BER } from "asn1-ts/dist/node/functional";

const idm_reject_to_rose_reject: Map<IdmReject_reason, RejectReason> = new Map([
    [ IdmReject_reason_mistypedPDU, RejectReason.mistyped_pdu ],
    [ IdmReject_reason_duplicateInvokeIDRequest, RejectReason.duplicate_invoke_id_request ],
    [ IdmReject_reason_unsupportedOperationRequest, RejectReason.unsupported_operation_request ],
    [ IdmReject_reason_unknownOperationRequest, RejectReason.unknown_operation_request ],
    [ IdmReject_reason_mistypedArgumentRequest, RejectReason.mistyped_argument_request ],
    [ IdmReject_reason_resourceLimitationRequest, RejectReason.resource_limitation_request ],
    [ IdmReject_reason_unknownInvokeIDResult, RejectReason.unknown_invoke_id_result ],
    [ IdmReject_reason_mistypedResultRequest, RejectReason.mistyped_result_request ],
    [ IdmReject_reason_unknownInvokeIDError, RejectReason.unknown_invoke_id_error ],
    [ IdmReject_reason_unknownError, RejectReason.unknown_error ],
    [ IdmReject_reason_mistypedParameterError, RejectReason.mistyped_parameter_error ],
    [ IdmReject_reason_unsupportedIdmVersion, RejectReason.unsupported_idm_version ],
    [ IdmReject_reason_unsuitableIdmVersion, RejectReason.unsuitable_idm_version ],
    [ IdmReject_reason_invalidIdmVersion, RejectReason.invalid_idm_version ],
]);

const rose_reject_to_idm_reject: Map<RejectReason, IdmReject_reason> = new Map([
    [ RejectReason.mistyped_pdu, IdmReject_reason_mistypedPDU ],
    [ RejectReason.duplicate_invoke_id_request, IdmReject_reason_duplicateInvokeIDRequest ],
    [ RejectReason.unsupported_operation_request, IdmReject_reason_unsupportedOperationRequest ],
    [ RejectReason.unknown_operation_request, IdmReject_reason_unknownOperationRequest ],
    [ RejectReason.mistyped_argument_request, IdmReject_reason_mistypedArgumentRequest ],
    [ RejectReason.resource_limitation_request, IdmReject_reason_resourceLimitationRequest ],
    [ RejectReason.unknown_invoke_id_result, IdmReject_reason_unknownInvokeIDResult ],
    [ RejectReason.mistyped_result_request, IdmReject_reason_mistypedResultRequest ],
    [ RejectReason.unknown_invoke_id_error, IdmReject_reason_unknownInvokeIDError ],
    [ RejectReason.unknown_error, IdmReject_reason_unknownError ],
    [ RejectReason.mistyped_parameter_error, IdmReject_reason_mistypedParameterError ],
    [ RejectReason.unsupported_idm_version, IdmReject_reason_unsupportedIdmVersion ],
    [ RejectReason.unsuitable_idm_version, IdmReject_reason_unsuitableIdmVersion ],
    [ RejectReason.invalid_idm_version, IdmReject_reason_invalidIdmVersion ],
]);

const idm_abort_to_rose_abort: Map<Abort, AbortReason> = new Map([
    [ Abort_mistypedPDU, AbortReason.mistyped_pdu ],
    [ Abort_unboundRequest, AbortReason.unbound_request ],
    [ Abort_invalidPDU, AbortReason.invalid_pdu ],
    [ Abort_resourceLimitation, AbortReason.resource_limitation ],
    [ Abort_connectionFailed, AbortReason.connection_failed ],
    [ Abort_invalidProtocol, AbortReason.invalid_protocol ],
    [ Abort_reasonNotSpecified, AbortReason.reason_not_specified ],
]);

const rose_abort_to_idm_abort: Map<Abort, AbortReason> = new Map([
    [ AbortReason.mistyped_pdu, Abort_mistypedPDU ],
    [ AbortReason.unbound_request, Abort_unboundRequest ],
    [ AbortReason.invalid_pdu, Abort_invalidPDU ],
    [ AbortReason.resource_limitation, Abort_resourceLimitation ],
    [ AbortReason.connection_failed, Abort_connectionFailed ],
    [ AbortReason.invalid_protocol, Abort_invalidProtocol ],
    [ AbortReason.reason_not_specified, Abort_reasonNotSpecified ],
]);

export
function rose_transport_from_idm_socket (idm: IDMConnection): ROSETransport {
    const rose = new_rose_transport(idm.socket);
    idm.events.on("bind", (params) => {
        rose.events.emit("bind", {
            protocol_id: params.protocolID,
            parameter: params.argument,
            called_ae_title: params.calledAETitle,
            calling_ae_title: params.callingAETitle,
        });
    });
    idm.events.on("bindResult", (params) => {
        rose.events.emit("bind_result", {
            protocol_id: params.protocolID,
            responding_ae_title: params.respondingAETitle,
            parameter: params.result,
        });
    });
    idm.events.on("bindError", (params) => {
        rose.events.emit("bind_error", {
            protocol_id: params.protocolID,
            responding_ae_title: params.respondingAETitle,
            parameter: params.error,
        });
    });
    idm.events.on("request", (params) => {
        rose.events.emit("request", {
            invoke_id: {
                present: params.invokeID,
            },
            code: params.opcode,
            parameter: params.argument,
        });
    });
    idm.events.on("result", (params) => {
        rose.events.emit("result", {
            invoke_id: {
                present: params.invokeID,
            },
            code: params.opcode,
            parameter: params.result,
        });
    });
    idm.events.on("error_", (params) => {
        rose.events.emit("error_", {
            invoke_id: {
                present: params.invokeID,
            },
            code: params.errcode,
            parameter: params.error,
        });
    });
    idm.events.on("reject", (params) => {
        rose.events.emit("reject", {
            invoke_id: {
                present: params.invokeID,
            },
            problem: idm_reject_to_rose_reject.get(params.reason)
                ?? RejectReason.other,
        });
    });
    idm.events.on("unbind", () => rose.events.emit("unbind"));
    idm.events.on("abort", (params) => rose.events
        .emit("abort", (idm_abort_to_rose_abort.get(params) ?? AbortReason.other)));

    rose.write_bind = (params) => {
        idm.writeBind(
            params.protocol_id,
            params.parameter,
            params.calling_ae_title,
            params.called_ae_title,
        );
    };

    rose.write_bind_result = (params) => {
        rose.is_bound = true;
        idm.writeBindResult(
            params.protocol_id,
            params.parameter,
            params.responding_ae_title,
        );
    };

    rose.write_bind_error = (params) => {
        rose.is_bound = false;
        idm.writeBindError(
            params.protocol_id,
            params.parameter,
            params.responding_ae_title,
        );
    };

    rose.write_request = (params) => {
        if (!("present" in params.invoke_id)) {
            return;
        }
        idm.writeRequest(
            params.invoke_id.present,
            params.code,
            params.parameter,
        );
    };

    rose.write_result = (params) => {
        if (!("present" in params.invoke_id)) {
            return;
        }
        idm.writeResult(
            params.invoke_id.present,
            params.code,
            params.parameter,
        );
    };

    rose.write_error = (params) => {
        if (!("present" in params.invoke_id)) {
            return;
        }
        idm.writeError(
            params.invoke_id.present,
            _encode_Code(params.code, BER),
            params.parameter,
        );
    };

    rose.write_reject = (params) => {
        if (!("present" in params.invoke_id)) {
            return;
        }
        idm.writeReject(
            params.invoke_id.present,
            rose_reject_to_idm_reject.get(params.problem)
                ?? IdmReject_reason_unknownError,
        );
    };

    rose.write_unbind = () => {
        rose.is_bound = false;
        idm.writeUnbind();
    };

    rose.write_unbind_result = () => {};

    rose.write_unbind_error = () => {};

    rose.write_abort = (params) => {
        rose.is_bound = false;
        idm.writeAbort(
            rose_abort_to_idm_abort.get(params) ?? Abort_reasonNotSpecified,
        );
    };

    return rose;
}
