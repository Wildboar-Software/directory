import type { OCTET_STRING, SET_OF } from "asn1-ts";
import {
    AARQ_apdu,
} from "@wildboar/acse/src/lib/modules/ACSE-1/AARQ-apdu.ta";

export * from "./lib/itot";
export { get_acse_ber_context } from "./lib/presentation";
export * from "./lib/acse";
export * from "./lib/presentation";
export type { SessionServiceConnectionState } from "./lib/session";
export type { TransportConnection } from "./lib/transport";
export { ITOTSocket } from "./lib/tpkt";

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
