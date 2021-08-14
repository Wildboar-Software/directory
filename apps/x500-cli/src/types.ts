import type { ASN1Element, OBJECT_IDENTIFIER } from "asn1-ts";
import type LDAPSyntaxDecoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxDecoder";
import type LDAPSyntaxEncoder from "@wildboar/ldap/src/lib/types/LDAPSyntaxEncoder";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import type { Request } from "@wildboar/x500/src/lib/types/Request";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";

export
type UUID = string;

export
type IndexableOID = string;

export
type LDAPName = string;

export
type Value = ASN1Element;

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
    writeOperation: (req: Omit<Request, "invokeId">) => Promise<ResultOrError>;
    close: () => Promise<void>;
    events: ConnectionEventEmitter;
}

export
interface AttributeInfo {
    id: OBJECT_IDENTIFIER;
    ldapSyntax?: OBJECT_IDENTIFIER;
    ldapNames?: LDAPName[];
    ldapDescription?: string;
}

export
interface LDAPSyntaxInfo {
    id: OBJECT_IDENTIFIER;
    description?: string;
    decoder?: LDAPSyntaxDecoder;
    encoder?: LDAPSyntaxEncoder;
}

export
interface Context {
    log: typeof console;
    attributes: Map<IndexableOID, AttributeInfo>;
    ldapSyntaxes: Map<IndexableOID, LDAPSyntaxInfo>;
}

export default Context;
