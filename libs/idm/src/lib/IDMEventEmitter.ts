import type { IdmBind } from "@wildboar/x500/IDMProtocolSpecification";
import type { IdmBindResult } from "@wildboar/x500/IDMProtocolSpecification";
import type { IdmBindError } from "@wildboar/x500/IDMProtocolSpecification";
import type { Request } from "@wildboar/x500/IDMProtocolSpecification";
import type { IdmResult } from "@wildboar/x500/IDMProtocolSpecification";
import type { Error as IdmError } from "@wildboar/x500/IDMProtocolSpecification";
import type { IdmReject } from "@wildboar/x500/IDMProtocolSpecification";
import type { Unbind } from "@wildboar/x500/IDMProtocolSpecification";
import type { Abort } from "@wildboar/x500/IDMProtocolSpecification";
import type { StartTLS } from "@wildboar/x500/IDMProtocolSpecification";
import type { TLSResponse } from "@wildboar/x500/IDMProtocolSpecification";
import type { ResultOrError } from "@wildboar/x500";
import type { EventEmitter } from "node:events";
import type { TLSSocket } from "tls";

export
interface EventMap {
    bind: IdmBind;
    bindResult: IdmBindResult;
    bindError: IdmBindError;
    request: Request;
    result: IdmResult;
    error_: IdmError;
    reject: IdmReject;
    unbind: Unbind;
    abort: Abort;
    startTLS: StartTLS;
    tLSResponse: TLSResponse;
    socketError: Error;
    socketDataLength: number;
    segmentDataLength: number;
    warning: number;
    tls: void;
    tlsSocket: TLSSocket;
    [other: number]: ResultOrError; // The opcode is the event type.
};

export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export
interface Emitter<T extends EventMap> {
    on <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    on (eventName: string, fn: EventReceiver<ResultOrError>): void;
    once <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    once (eventName: string, fn: EventReceiver<ResultOrError>): void;
    off <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    emit <K extends EventKey<T>> (eventName: K, params: T[K]): void;
    emit (eventName: string, params: ResultOrError): void;
}

export
type IDMEventEmitter = Emitter<EventMap> & EventEmitter;

export default IDMEventEmitter;
