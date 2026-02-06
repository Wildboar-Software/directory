# OSI Remote Operation Service Element (ROSE) Transport Library

This library primarily contains types for a Remote Operation Service Element
(ROSE) abstraction that is logically separated from the underlying transport mechanism.
ROSE is basically RPC for Open Systems Interconnection (OSI) protocols. It has
concepts of requests, responses, and errors, just like you would expect an RPC
protocol to have.

This library was implemented specifically to abstract away whether
ISO Transport Over TCP (ITOT) or Internet Directly-Mapped (IDM) transports were
used to transport ROSE protocol data units.

## Usage

These is too much to this library to document in this README, but here are the
types at the heart of it all:

```typescript

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
```

`AsyncROSEClient` is a higher-level API. It should be used instead of the
low-level API in almost all cases.

If you need more documentation than this, see the JSDoc for each type.
