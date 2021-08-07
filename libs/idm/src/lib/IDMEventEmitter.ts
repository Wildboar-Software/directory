import type { IdmBind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import type { IdmBindResult } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindResult.ta";
import type { IdmBindError } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";
import type { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import type { IdmResult } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmResult.ta";
import type { Error } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Error.ta";
import type { IdmReject } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject.ta";
import type { Unbind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Unbind.ta";
import type { Abort } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import type { StartTLS } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/StartTLS.ta";
import type { TLSResponse } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/TLSResponse.ta";
// import type { ASN1Element } from "asn1-ts";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError"

interface EventMap {
    bind: IdmBind;
    bindResult: IdmBindResult;
    bindError: IdmBindError;
    request: Request;
    result: IdmResult;
    error_: Error;
    reject: IdmReject;
    unbind: Unbind;
    abort: Abort;
    startTLS: StartTLS;
    tLSResponse: TLSResponse;
    [other: number]: ResultOrError; // The opcode is the event type.
};

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

// export default
interface Emitter<T extends EventMap> {
    on <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    on (eventName: string, fn: EventReceiver<ResultOrError>): void;
    once <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    once (eventName: string, fn: EventReceiver<ResultOrError>): void;
    off <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    emit <K extends EventKey<T>> (eventName: K, params: T[K]): void;
    emit (eventName: string, params: ResultOrError): void;
}

type IDMEventEmitter = Emitter<EventMap>;

export default IDMEventEmitter;
