import { TypedEmitter } from 'tiny-typed-emitter';
import type { Socket } from "node:net";
import type { TLSSocket } from "node:tls";
import type { ASN1Element, OBJECT_IDENTIFIER, INTEGER } from "asn1-ts";
import type {
    GeneralName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import type {
    InvokeId,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/InvokeId.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

export
enum AbortReason {
    // From IDM
    mistyped_pdu,
    unbound_request,
    invalid_pdu,
    resource_limitation,
    connection_failed,
    invalid_protocol,
    reason_not_specified,
    // From ACSE
    protocol_error,
    authentication_mechanism_name_not_recognized,
    authentication_mechanism_name_required,
    authentication_failure,
    authentication_required,
    // From Me
    other,
}

export
enum RejectReason {
    mistyped_pdu,
    duplicate_invoke_id_request,
    unsupported_operation_request,
    unknown_operation_request,
    mistyped_argument_request,
    resource_limitation_request,
    unknown_invoke_id_result,
    mistyped_result_request,
    unknown_invoke_id_error,
    unknown_error,
    mistyped_parameter_error,
    unsupported_idm_version,
    unsuitable_idm_version,
    invalid_idm_version,
    unrecognized_pdu,
    badly_structured_pdu,
    release_in_progress,
    other,
}

export
interface BindParameters {
    protocol_id: OBJECT_IDENTIFIER,
    parameter: ASN1Element,
    calling_ae_title?: GeneralName,
    calling_ap_invocation_identifier?: INTEGER,
    calling_ae_invocation_identifier?: INTEGER,
    called_ae_title?: GeneralName,
    called_ap_invocation_identifier?: INTEGER,
    called_ae_invocation_identifier?: INTEGER,
    implementation_information?: string,
}

export
interface BindResultParameters {
    protocol_id: OBJECT_IDENTIFIER,
    parameter: ASN1Element,
    responding_ae_title?: GeneralName,
    responding_ap_invocation_identifier?: INTEGER,
    responding_ae_invocation_identifier?: INTEGER,
}

export
interface BindErrorParameters extends BindResultParameters {

}

export
interface OperationAtom {
    invoke_id: InvokeId,
    code: Code,
    parameter: ASN1Element,
}

export
interface RequestParameters extends OperationAtom {
    linked_id?: InvokeId,
}

export
interface ResultParameters extends OperationAtom {

}

export
interface ErrorParameters extends OperationAtom {

}

export
interface RejectParameters {
    invoke_id: InvokeId,
    problem: RejectReason,
}

export
interface ROSETransportEvents {
    "bind": (params: BindParameters) => unknown;
    "bind_result": (params: BindResultParameters) => unknown;
    "bind_error": (params: BindErrorParameters) => unknown;
    "request": (params: RequestParameters) => unknown;
    "result": (params: ResultParameters) => unknown;
    "error_": (params: ErrorParameters) => unknown;
    "reject": (params: RejectParameters) => unknown;
    "unbind": (param?: ASN1Element) => unknown;
    "unbind_result": (param?: ASN1Element) => unknown;
    "unbind_error": (param?: ASN1Element) => unknown;
    "abort": (param: AbortReason) => unknown;
}

export
class ROSETransportEventEmitter extends TypedEmitter<ROSETransportEvents> {

}

export
interface ROSETransport {
    socket: Socket | TLSSocket | null;
    protocol?: OBJECT_IDENTIFIER;
    events: ROSETransportEventEmitter;
    write_bind: (params: BindParameters) => unknown;
    write_bind_result: (params: BindResultParameters) => unknown;
    write_bind_error: (params: BindErrorParameters) => unknown;
    write_request: (params: RequestParameters) => unknown;
    write_result: (params: ResultParameters) => unknown;
    write_error: (params: ErrorParameters) => unknown;
    write_reject: (params: RejectParameters) => unknown;
    write_unbind: (param?: ASN1Element) => unknown;
    write_unbind_result: (param?: ASN1Element) => unknown;
    write_unbind_error: (param?: ASN1Element) => unknown;
    write_abort: (reason: AbortReason) => unknown;
}

export
function new_rose_transport (socket?: Socket | TLSSocket): ROSETransport {
    return {
        socket: socket ?? null,
        events: new ROSETransportEventEmitter(),
        write_bind: () => {},
        write_bind_result: () => {},
        write_bind_error: () => {},
        write_request: () => {},
        write_result: () => {},
        write_error: () => {},
        write_reject: () => {},
        write_unbind: () => {},
        write_unbind_result: () => {},
        write_unbind_error: () => {},
        write_abort: () => {},
    };
}
