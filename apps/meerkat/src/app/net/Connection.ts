import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";

// type ErrorOrResult = [ Error, undefined ] | [ undefined, IdmResult ];

type EventMap = {
    "connect": undefined,
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
interface WriteOperationOptions {
    timeLimitInMilliseconds?: number;
    signErrors?: boolean;
}

/**
 * @summary An established connection that Meerkat DSA has to another DSA.
 * @description
 *
 * An established connection that Meerkat DSA has to another DSA.
 *
 * @interface
 */
export
interface Connection {
    writeOperation: (req: Omit<Request, "invokeId">, options?: WriteOperationOptions) => Promise<ResultOrError>;
    close: () => Promise<void>;
    events: ConnectionEventEmitter;
}

export default Connection;
