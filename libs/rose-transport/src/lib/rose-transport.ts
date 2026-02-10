import { TypedEmitter } from 'tiny-typed-emitter';
import type { Socket } from "node:net";
import { TLSSocket } from "node:tls";
import type { ASN1Element, OBJECT_IDENTIFIER, INTEGER } from "@wildboar/asn1";
import type {
    GeneralName,
} from "@wildboar/x500/CertificateExtensions";
import type {
    InvokeId,
} from "@wildboar/x500/CommonProtocolSpecification";
import type {
    Code,
} from "@wildboar/x500/CommonProtocolSpecification";
import type { Name } from "@wildboar/x500/InformationFramework";

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

const abortReasonToStringMap = new Map([
    [ AbortReason.mistyped_pdu, "mistyped-pdu" ],
    [ AbortReason.unbound_request, "unbound-request" ],
    [ AbortReason.invalid_pdu, "invalid-pdu" ],
    [ AbortReason.resource_limitation, "resource-limitation" ],
    [ AbortReason.connection_failed, "connection-failed" ],
    [ AbortReason.invalid_protocol, "invalid-protocol" ],
    [ AbortReason.reason_not_specified, "reason-not-specified" ],
    [ AbortReason.protocol_error, "protocol-error" ],
    [ AbortReason.authentication_mechanism_name_not_recognized, "authentication-mechanism-name-not-recognized" ],
    [ AbortReason.authentication_mechanism_name_required, "authentication-mechanism-name-required" ],
    [ AbortReason.authentication_failure, "authentication-failure" ],
    [ AbortReason.authentication_required, "authentication-required" ],
    [ AbortReason.other, "other" ],
]);

export
function abortReasonToString(reason: AbortReason): string {
    return abortReasonToStringMap.get(reason) ?? "other";
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

const rejectReasonToStringMap = new Map([
    [ RejectReason.mistyped_pdu, "mistyped-pdu" ],
    [ RejectReason.duplicate_invoke_id_request, "duplicate-invoke-id-request" ],
    [ RejectReason.unsupported_operation_request, "unsupported-operation-request" ],
    [ RejectReason.unknown_operation_request, "unknown-operation-request" ],
    [ RejectReason.mistyped_argument_request, "mistyped-argument-request" ],
    [ RejectReason.resource_limitation_request, "resource-limitation-request" ],
    [ RejectReason.unknown_invoke_id_result, "unknown-invoke-id-result" ],
    [ RejectReason.mistyped_result_request, "mistyped-result-request" ],
    [ RejectReason.unknown_invoke_id_error, "unknown-invoke-id-error" ],
    [ RejectReason.unknown_error, "unknown-error" ],
    [ RejectReason.mistyped_parameter_error, "mistyped-parameter-error" ],
    [ RejectReason.unsupported_idm_version, "unsupported-idm-version" ],
    [ RejectReason.unsuitable_idm_version, "unsuitable-idm-version" ],
    [ RejectReason.invalid_idm_version, "invalid-idm-version" ],
    [ RejectReason.unrecognized_pdu, "unrecognized-pdu" ],
    [ RejectReason.badly_structured_pdu, "badly-structured-pdu" ],
    [ RejectReason.release_in_progress, "release-in-progress" ],
    [ RejectReason.other, "other" ],
]);

export
function rejectReasonToString(reason: RejectReason): string {
    return rejectReasonToStringMap.get(reason) ?? "other";
}

export
interface Timeboxed {
    /**
     * The time in milliseconds before timeout.
     */
    timeout?: number;
}

export
interface BindParameters <ParameterType = ASN1Element> extends Timeboxed {
    protocol_id: OBJECT_IDENTIFIER,
    parameter: ParameterType,
    calling_ae_title?: GeneralName,
    calling_ap_invocation_identifier?: INTEGER,
    calling_ae_invocation_identifier?: INTEGER,
    called_ae_title?: GeneralName,
    called_ap_invocation_identifier?: INTEGER,
    called_ae_invocation_identifier?: INTEGER,
    implementation_information?: string,
}

export
interface BindResultParameters <ParameterType = ASN1Element> {
    protocol_id: OBJECT_IDENTIFIER,
    parameter: ParameterType,
    responding_ae_title?: GeneralName,
    responding_ap_invocation_identifier?: INTEGER,
    responding_ae_invocation_identifier?: INTEGER,
}

export
interface BindErrorParameters <ParameterType = ASN1Element>
    extends BindResultParameters<ParameterType> {
        code?: Code;
}

export
interface OperationAtom <ParameterType = ASN1Element> extends Timeboxed {
    invoke_id: InvokeId,
    code: Code,
    parameter: ParameterType,
}

export
interface RequestParameters <ParameterType = ASN1Element> extends OperationAtom<ParameterType> {
    linked_id?: InvokeId,
}

export
interface ResultParameters <ParameterType = ASN1Element> extends OperationAtom<ParameterType> {

}

export
interface ErrorParameters <ParameterType = ASN1Element> extends OperationAtom<ParameterType> {

}

export
interface RejectParameters {
    invoke_id: InvokeId,
    problem: RejectReason,
}

export
interface UnbindParameters extends Timeboxed {
    parameter?: ASN1Element;
    disconnectSocket?: boolean;
}

export
interface StartTLSParameters extends Timeboxed {

}

export
interface TLSResponseParameters {
    code: number;
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
    "unbind": (params?: UnbindParameters) => unknown;
    "unbind_result": (param?: ASN1Element) => unknown;
    "unbind_error": (param?: ASN1Element) => unknown;
    "abort": (param: AbortReason) => unknown;
    "start_tls": (params: StartTLSParameters) => unknown;
    "start_tls_response": (params: TLSResponseParameters) => unknown; // Code is taken from IDM's `TLSResponse`.
    "tls_socket": (socket: TLSSocket) => unknown;
    "tls": () => unknown;
}

export
class ROSETransportEventEmitter extends TypedEmitter<ROSETransportEvents> {

}

export
interface ROSEInvocationEvents {
    [invoke_id: string]: (outcome: OperationOutcome) => unknown;
}

export
class ROSEInvocationEventEmitter extends TypedEmitter<ROSEInvocationEvents> {

}

export
type UniversalOutcome =
    | {
        abort: AbortReason;
    }
    | {
        timeout: true;
    }
    | {
        other: Record<string, unknown>;
    }
    ;

export
type BindOutcome <BindResultType = ASN1Element>
 =
    | {
        result: BindResultParameters<BindResultType>;
    }
    | {
        error: BindErrorParameters;
    }
    | UniversalOutcome
    ;

export
type OperationOutcome <ResultType = ASN1Element> =
    | {
        result: ResultParameters<ResultType>;
    }
    | {
        error: ErrorParameters;
    }
    | {
        reject: RejectParameters;
    }
    | UniversalOutcome
    ;

export
type UnbindOutcome =
    | {
        result: ASN1Element | null,
    }
    | {
        error: ASN1Element | null,
    }
    | UniversalOutcome
    ;

export
type StartTLSOutcome =
    | {
        response: number;
    }
    | {
        not_supported_locally: null;
    }
    | {
        already_in_use: null;
    }
    | UniversalOutcome
    ;

export
interface ROSETransportOptions {
    operation_timeout_ms?: number;
};

export
interface AsyncROSEClient <BindArgumentType = ASN1Element, BindResultType = ASN1Element> {
    // Async/Await Client API
    bind: (params: BindParameters<BindArgumentType>) => Promise<BindOutcome<BindResultType>>;
    request: (params: RequestParameters) => Promise<OperationOutcome>;
    unbind: (param?: UnbindParameters) => Promise<UnbindOutcome>;
    startTLS?: (params?: StartTLSParameters) => Promise<StartTLSOutcome>;
    peer_ae_title?: Name;
}

export
interface ROSETransport extends AsyncROSEClient {
    socket: Socket | TLSSocket | null;
    protocol?: OBJECT_IDENTIFIER;
    events: ROSETransportEventEmitter;
    invocation_events: ROSEInvocationEventEmitter;
    is_bound: boolean;
    options?: ROSETransportOptions;

    // Low-Level API
    write_bind: (params: BindParameters) => unknown;
    write_bind_result: (params: BindResultParameters) => unknown;
    write_bind_error: (params: BindErrorParameters) => unknown;
    write_request: (params: RequestParameters) => unknown;
    write_result: (params: ResultParameters) => unknown;
    write_error: (params: ErrorParameters) => unknown;
    write_reject: (params: RejectParameters) => unknown;
    write_unbind: (params?: UnbindParameters) => unknown;
    write_unbind_result: (param?: ASN1Element) => unknown;
    write_unbind_error: (param?: ASN1Element) => unknown;
    write_abort: (reason: AbortReason) => unknown;

    write_start_tls?: (params?: StartTLSParameters) => unknown;
    write_tls_response?: (params?: TLSResponseParameters) => unknown;
}

export
function new_rose_transport (socket?: Socket | TLSSocket): ROSETransport {
    const rose: ROSETransport = {
        socket: socket ?? null,
        events: new ROSETransportEventEmitter(),
        invocation_events: new ROSEInvocationEventEmitter(),
        is_bound: false,
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
        bind: (params) => new Promise((resolve) => {
            const done = (): void => {
                rose.events.off("bind_result", result_handler);
                rose.events.off("bind_error", error_handler);
                rose.events.off("abort", abort_handler);
                rose.socket?.off("timeout", timeout_function);
                rose.socket?.off("end", end_function);
                if (timeout_handle) {
                    clearTimeout(timeout_handle);
                    timeout_handle = undefined;
                }
            };
            const result_handler = (result: BindResultParameters) => (done(), resolve({ result }));
            const error_handler = (error: BindErrorParameters) => (done(), resolve({ error }));
            const abort_handler = (reason: AbortReason) => (done(), resolve({ abort: reason }));
            let timeout_handle: NodeJS.Timeout | undefined;
            rose.events.once("bind_result", result_handler);
            rose.events.once("bind_error", error_handler);
            rose.events.once("abort", abort_handler);
            const timeout_in_ms: number | undefined = params.timeout ?? rose.options?.operation_timeout_ms;
            const timeout_function = () => (done(), resolve({ timeout: true }));
            const end_function = () => (done(), resolve({ other: { message: "Socket closed." } }));
            if (Number.isSafeInteger(timeout_in_ms) && (timeout_in_ms! > 0)) {
                timeout_handle = setTimeout(
                    timeout_function,
                    timeout_in_ms,
                );
            }
            rose.socket?.once("timeout", timeout_function);
            rose.socket?.once("end", end_function);
            rose.write_bind(params);
        }),
        request: async (params) => new Promise((resolve) => {
            if (!("present" in params.invoke_id)) {
                resolve({ other: { "problem": "No invoke ID." } });
                return;
            }
            const iid = params.invoke_id.present.toString();
            const done = (): void => {
                rose.invocation_events.off(iid, outcome_handler);
                rose.events.off("abort", abort_handler);
                rose.socket?.off("timeout", timeout_function);
                rose.socket?.off("end", end_function);
                if (timeout_handle) {
                    clearTimeout(timeout_handle);
                    timeout_handle = undefined;
                }
            };
            const outcome_handler = (outcome: OperationOutcome) => (done(), resolve(outcome));
            const abort_handler = (reason: AbortReason) => (done(), resolve({ abort: reason }));
            let timeout_handle: NodeJS.Timeout | undefined;
            rose.invocation_events.once(iid, outcome_handler);
            rose.events.once("abort", abort_handler);
            const timeout_in_ms: number | undefined = params.timeout ?? rose.options?.operation_timeout_ms;
            const timeout_function = () => (done(), resolve({ timeout: true }));
            const end_function = () => (done(), resolve({ other: { message: "Socket closed." } }));
            if (Number.isSafeInteger(timeout_in_ms) && (timeout_in_ms! > 0)) {
                timeout_handle = setTimeout(
                    timeout_function,
                    timeout_in_ms,
                );
            }
            if (
                (timeout_in_ms !== undefined)
                && Number.isSafeInteger(timeout_in_ms)
                && rose.socket?.timeout
                && (timeout_in_ms > rose.socket.timeout)
            ) {
                rose.socket.setTimeout(timeout_in_ms + 2000);
                rose.socket.setKeepAlive(true, timeout_in_ms / 2);
            }
            rose.socket?.once("timeout", timeout_function);
            rose.socket?.once("end", end_function);
            rose.write_request(params);
        }),
        unbind: async (params) => new Promise((resolve) => {
            const done = (): void => {
                rose.events.off("unbind_result", result_handler);
                rose.events.off("unbind_error", error_handler);
                rose.events.off("abort", abort_handler);
                rose.socket?.off("timeout", timeout_function);
                rose.socket?.off("end", end_function);
                if (timeout_handle) {
                    clearTimeout(timeout_handle);
                    timeout_handle = undefined;
                }
            };
            const result_handler = (result?: ASN1Element) => (done(), resolve({ result: result ?? null }));
            const error_handler = (error?: ASN1Element) => (done(), resolve({ error: error ?? null }));
            const abort_handler = (reason: AbortReason) => (done(), resolve({ abort: reason }));
            let timeout_handle: NodeJS.Timeout | undefined;
            rose.events.once("unbind_result", result_handler);
            rose.events.once("unbind_error", error_handler);
            rose.events.once("abort", abort_handler);
            const timeout_in_ms: number | undefined = params?.timeout ?? rose.options?.operation_timeout_ms;
            const timeout_function = () => (done(), resolve({ timeout: true }));
            const end_function = () => (done(), resolve({ other: { message: "Socket closed." } }));
            if (Number.isSafeInteger(timeout_in_ms) && (timeout_in_ms! > 0)) {
                timeout_handle = setTimeout(
                    timeout_function,
                    timeout_in_ms,
                );
            }
            rose.socket?.once("timeout", timeout_function);
            rose.socket?.once("end", end_function);
            rose.socket?.once("close", end_function);
            rose.write_unbind(params);
            if (params?.disconnectSocket) {
                rose.socket?.end();
            }
        }),
        startTLS: async (params): Promise<StartTLSOutcome> => new Promise((resolve) => {
            if (!rose.write_start_tls) {
                resolve({ not_supported_locally: null });
                return;
            }
            if (rose.socket instanceof TLSSocket) {
                resolve({ already_in_use: null });
                return;
            }
            const done = (): void => {
                rose.events.off("start_tls_response", response_handler);
                rose.events.off("abort", abort_handler);
                rose.socket?.off("timeout", timeout_function);
                rose.socket?.off("end", end_function);
                if (timeout_handle) {
                    clearTimeout(timeout_handle);
                    timeout_handle = undefined;
                }
            };
            let timeout_handle: NodeJS.Timeout | undefined;
            const response_handler = (params: TLSResponseParameters) => (done(), resolve({ response: params.code }));
            const abort_handler = (reason: AbortReason) => (done(), resolve({ abort: reason }));
            const timeout_in_ms: number | undefined = params?.timeout ?? rose.options?.operation_timeout_ms;
            const timeout_function = () => (done(), resolve({ timeout: true }));
            const end_function = () => (done(), resolve({ other: { message: "Socket closed." } }));
            if (Number.isSafeInteger(timeout_in_ms) && (timeout_in_ms! > 0)) {
                timeout_handle = setTimeout(
                    timeout_function,
                    timeout_in_ms,
                );
            }
            rose.events.once("start_tls_response", response_handler);
            rose.events.once("abort", abort_handler);
            rose.socket?.once("timeout", timeout_function);
            rose.socket?.once("end", end_function);
            rose.write_start_tls();
        }),
    };
    rose.events.on("result", (result) => {
        if (!("present" in result.invoke_id)) {
            return;
        }
        rose.invocation_events.emit(result.invoke_id.present.toString(), { result });
    });
    rose.events.on("error_", (error) => {
        if (!("present" in error.invoke_id)) {
            return;
        }
        rose.invocation_events.emit(error.invoke_id.present.toString(), { error });
    });
    rose.events.on("reject", (reject) => {
        if (!("present" in reject.invoke_id)) {
            return;
        }
        rose.invocation_events.emit(reject.invoke_id.present.toString(), { reject });
    });
    return rose;
}
