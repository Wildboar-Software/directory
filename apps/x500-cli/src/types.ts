import type { ASN1Element, OBJECT_IDENTIFIER } from "@wildboar/asn1";
import type { LDAPSyntaxDecoder } from "@wildboar/ldap";
import type { LDAPSyntaxEncoder } from "@wildboar/ldap";
import type { Code } from "@wildboar/x500/CommonProtocolSpecification";
import type { Request } from "@wildboar/x500";
import type { ResultOrError } from "@wildboar/x500";
import type { X500ClientConfig } from "@wildboar/x500-cli-config";
import type { Logger } from "winston";
import { KeyObject } from "crypto";
import { CertificationPath } from "@wildboar/x500/AuthenticationFramework";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    DistinguishedName,
} from "@wildboar/x500/InformationFramework";

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
    signingKey?: KeyObject | null;
    certPath?: CertificationPath | null;
    attrCertPath?: AttributeCertificationPath | null;
    called_ae_title?: DistinguishedName;
}

export type ValuePrinter = (ctx: Context, value: ASN1Element) => string | undefined;

export
interface AttributeInfo {
    id: OBJECT_IDENTIFIER;
    name?: string;
    ldapSyntax?: OBJECT_IDENTIFIER;
    ldapNames?: LDAPName[];
    ldapDescription?: string;
    valuePrinter?: ValuePrinter;
    parent?: OBJECT_IDENTIFIER;
}

export
interface LDAPSyntaxInfo {
    id: OBJECT_IDENTIFIER;
    description?: string;
    decoder?: LDAPSyntaxDecoder;
    encoder?: LDAPSyntaxEncoder;
}

export
interface Named {
    readonly name: string;
}

export
interface Metadata extends Named {
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
}

export
interface ConfigAccessPoint {
    readonly url: string;
    readonly category?: "master" | "shadow";
    readonly "disable-start-tls"?: boolean;
    readonly "insecure-skip-tls-verify"?: boolean;
    readonly "certificate-authority"?: string;
}

export
interface ConfigDSA extends Named {
    accessPoints: ConfigAccessPoint[];
}

export
interface ConfigCredentials extends Named {
}

export
interface Config {
    readonly apiVersion: string;
    readonly kind: "X500ClientConfig";
    readonly metadata: Metadata;
    readonly "current-context"?: string;
    readonly preferences?: Record<string, string>;
    readonly dsas: ConfigDSA[];
}

export
interface ContextTypeInfo {
    id: OBJECT_IDENTIFIER;
    name?: string;
    // description?: string;
    // obsolete?: boolean;
    syntax?: string;
    // assertionSyntax?: string;
    // defaultValue?: () => ASN1Element;
    // absentMatch: boolean; // Defaults to TRUE
    valuePrinter?: ValuePrinter;
}

export
interface ObjectClassInfo {
    id: OBJECT_IDENTIFIER;
    name?: string;
}

export
interface Context {
    log: Logger;
    attributes: Map<IndexableOID, AttributeInfo>;
    objectClasses: Map<IndexableOID, ObjectClassInfo>;
    ldapSyntaxes: Map<IndexableOID, LDAPSyntaxInfo>;
    contextTypes: Map<IndexableOID, ContextTypeInfo>;
    config?: X500ClientConfig | null;
}

export
interface SchemaObjectArgs {
    name?: string[];
    description?: string;
    obsolete?: boolean;
}

export default Context;
