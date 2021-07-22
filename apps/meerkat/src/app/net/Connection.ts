import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type { ASN1Element } from "asn1-ts";

// type ErrorOrResult = [ Error, undefined ] | [ undefined, IdmResult ];

type EventMap = {
    "connect": undefined,
    "response": [ Code, ASN1Element ],
    "close": undefined,
    "end"?: undefined,
    "timeout"?: undefined,
    "error"?: Error,
};

type EventKey<T extends EventMap> = string & keyof T;
type EventReceiver<T> = (params: T) => void;

// export default
interface Emitter<T extends EventMap> {
    on <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    off <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    emit <K extends EventKey<T>> (eventName: K, params: T[K]): void;
}

type ConnectionEventEmitter = Emitter<EventMap>;

export
interface Connection {
    writeOperation: (code: Code, parameters: ASN1Element) => Promise<ASN1Element>;
    close: () => Promise<void>;
    events: ConnectionEventEmitter;
}

export default Connection;
