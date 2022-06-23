import type { Socket, Server } from "net";
import { EventEmitter } from "events";
import { strict as assert } from "assert";

const N_CONNECT_REQUEST = "N-CONNECT.REQUEST";
const N_CONNECT_INDICATION = "N-CONNECT.INDICATION";
const N_CONNECT_RESPONSE = "N-CONNECT.RESPONSE";
const N_CONNECT_CONFIRMATION = "N-CONNECT.CONFIRMATION";
const N_DATA_REQUEST = "N-DATA.REQUEST";
const N_DATA_INDICATION = "N-DATA.INDICATION";
const N_DISCONNECT_REQUEST= "N-DISCONNECT.REQUEST";
const N_DISCONNECT_INDICATION = "N-DISCONNECT.INDICATION";

export
interface N_CONNECT_REQUEST_PARAMETERS {
    // According to IETF RFC 1006, Section 5, these should be the IPv4 addresses as 4 octets.
    calling_address?: Buffer;
    called_address?: Buffer;
    // responding_address?: any;

    // Always supported, according to IETF RFC 1006, Section 5.
    // expedited_data_option: boolean;

    // Ignored, according to IETF RFC 1006, Section 5.
    // quality_of_service: boolean;
    // ts_user_data: Buffer; // Not to exceed 32 octets, and not available in class 0.
}


export
interface N_CONNECT_INDICATION_PARAMETERS {
    readonly socket: Socket;

    // According to IETF RFC 1006, Section 5, these should be the IPv4 addresses as 4 octets.
    calling_address?: Buffer;
    called_address?: Buffer;
    // responding_address?: any;

    // Always supported, according to IETF RFC 1006, Section 5.
    // expedited_data_option: boolean;

    // Ignored, according to IETF RFC 1006, Section 5.
    // quality_of_service: boolean;
    // ts_user_data: Buffer; // Not to exceed 32 octets, and not available in class 0.
}

export
interface EventMap {
    "N-CONNECT.REQUEST": N_CONNECT_REQUEST_PARAMETERS;
    "N-CONNECT.INDICATION": N_CONNECT_INDICATION_PARAMETERS;
    "N-CONNECT.RESPONSE": Record<string, unknown>;
    "N-CONNECT.CONFIRMATION": Record<string, unknown>;
    "N-DATA.REQUEST": Record<string, unknown>;
    "N-DATA.INDICATION": Record<string, unknown>;
    "N-DISCONNECT.REQUEST": Record<string, unknown>;
    "N-DISCONNECT.INDICATION": Record<string, unknown>;
    "TPKT": Record<string, unknown>;
    "TSDU": Buffer;
};

export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;

export
interface Emitter<T extends EventMap> {
    on <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    once <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    off <K extends EventKey<T>> (eventName: K, fn: EventReceiver<T[K]>): void;
    emit <K extends EventKey<T>> (eventName: K, params: T[K]): void;
}

export
type ITOTEventEmitter = Emitter<EventMap> & EventEmitter;

// ITU X.214, Section 11.
export
enum ISOTransportPhase {
    establishment,
    data_transfer,
    release,
}

// ITU X.224, Section 13.2
export
enum COTP_TPDU_ParserState {
    length_indicator,
    header,
    data,
}

export
class ITOTSocket extends EventEmitter {

    private _phase: ISOTransportPhase = ISOTransportPhase.establishment;

    public getPhase (): ISOTransportPhase {
        return this._phase;
    }

    private buffer: Buffer = Buffer.alloc(0);
    private tsdus: Buffer[] = [];

    constructor (
        readonly socket: Socket | Server,
    ) {
        super();
        // socket.on("close");
        // socket.on("connection", (c: Socket) => {
        //     // this.emit(N_CONNECT_INDICATION, {}); // FIXME: Parameters?
        //     // c.write(); // N-CONNECT.RESPONSE
        // });
        // socket.on("connect", () => this.emit(N_CONNECT_CONFIRMATION, {})); // FIXME: Parameters?
        socket.on("data", (tcpDataChunk: Buffer): void => {
            // Decode TPKT
            // Read TPDU from TPKT
            this.buffer = Buffer.concat([this.buffer, tcpDataChunk]);

            let i = 0;
            while (i < this.buffer.length) {
                if (this.buffer.length < i + 4) {
                    return;
                }
                const length = this.buffer.readUint16BE(i + 2);
                if (this.buffer.length < (i + 4 + length)) {
                    return;
                }
                const li = this.buffer[i + 5];
                if (li === undefined) {
                    return;
                }
                if ((this.buffer.length + 1) < li) {
                    return;
                }
                const code = this.buffer[i + 6];
                // const wholePacket = this.buffer.slice()
                switch (code & 0b1111_0000) {
                    case (0b1110_0000): { // CR
                        const data = this.buffer.slice((i + 5 + li), (i + 4 + length));
                        break;
                    }
                    case (0b1101_0000): { // CC
                        const data = this.buffer.slice((i + 5 + li), (i + 4 + length));
                        break;
                    }
                    case (0b1111_0000): { // DT
                        // const roa = !!(code & 0b0000_0001);
                        const eot = !!(this.buffer[i + 5 + 2] & 0b1000_0000);
                        const tsdu = this.buffer.slice((i + 5 + li), (i + 4 + length));
                        this.tsdus.push(tsdu);
                        if (eot) {
                            const completeTSDU = Buffer.concat(this.tsdus);
                            this.emit("TSDU", completeTSDU);
                        }
                        break;
                    }
                    case (0b1000_0000): { // DR
                        break;
                    }
                    case (0b0111_0000): { // ER
                        break;
                    }
                    default: {
                        // TODO: Handle unrecognized packet.
                        break;
                    }
                }
                i += li + 1;
            }

            switch (this._phase) {
                case (ISOTransportPhase.establishment): {
                    break;
                }
                case (ISOTransportPhase.data_transfer): {
                    break;
                }
                case (ISOTransportPhase.release): {
                    break;
                }
                default: {
                    assert(false, "9ded974a-6bfa-4b3f-bdce-c7d396049ba5: Invalid ITOT socket state.");
                }
            }
        });
        // socket.on("drain");
        // socket.on("end");
        // socket.on("error");
        // socket.on("lookup");
        // socket.on("ready");
        // socket.on("timeout");
    }
}
