import type { OCTET_STRING, SET_OF } from "asn1-ts";

export * from "./lib/itot";
export { get_acse_ber_context } from "./lib/presentation";
export * from "./lib/acse";
export * from "./lib/presentation";
export { SessionServiceConnectionState } from "./lib/session";
export { TransportConnection } from "./lib/transport";
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
    max_tpdu_size?: number,
    abort_timeout_ms?: number;
}

export
interface WithOSINetworkingOptions {
    options?: OSINetworkingOptions;
}
