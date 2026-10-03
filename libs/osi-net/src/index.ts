import type { OCTET_STRING, SET_OF } from "@wildboar/asn1";
import {
    AARQ_apdu,
} from "@wildboar/acse";

export * from "./lib/itot.js";
export { get_acse_ber_context } from "./lib/presentation.js";
export * from "./lib/acse.js";
export * from "./lib/presentation.js";
export type { SessionServiceConnectionState } from "./lib/session.js";
export type { TransportConnection } from "./lib/transport.js";
export { ITOTSocket } from "./lib/tpkt.js";

export
interface PresentationAddress {
    pSelector?: OCTET_STRING;
    sSelector?: OCTET_STRING;
    tSelector?: OCTET_STRING;
    nAddresses?: SET_OF<OCTET_STRING>;
}

export
interface OSINetworkingOptions {
    remoteAddress?: PresentationAddress;
    localAddress?: PresentationAddress;
    sessionCaller?: boolean;
    transportCaller?: boolean;
    max_nsdu_size?: number;
    max_tsdu_size?: number;
    max_tpdu_size?: number;
    max_ssdu_size?: number;
    abort_timeout_ms?: number;
    max_presentation_contexts?: number;
    acse_authenticate?: (aarq: AARQ_apdu) => boolean,
}

export
interface WithOSINetworkingOptions {
    options?: OSINetworkingOptions;
}
