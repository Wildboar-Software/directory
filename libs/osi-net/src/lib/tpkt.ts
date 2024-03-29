import { Socket } from 'net';
import { TypedEmitter } from 'tiny-typed-emitter';

export const TPKT_VERSION: number = 3;
export const MAX_UINT32: number = Math.pow(2, 32);

export interface NetworkLayerOutgoingEvents {
    NSDU: (tsdu: Buffer) => unknown;
}

export class NetworkLayerOutgoingEventEmitter extends TypedEmitter<NetworkLayerOutgoingEvents> {}

// ITU X.214, Section 11.
export enum ISOTransportPhase {
    establishment,
    data_transfer,
    release,
}

export class ITOTSocket extends NetworkLayerOutgoingEventEmitter {
    private _phase: ISOTransportPhase = ISOTransportPhase.establishment;
    public max_nsdu_size: number = MAX_UINT32;

    public getPhase(): ISOTransportPhase {
        return this._phase;
    }

    private buffer: Buffer = Buffer.alloc(0);

    constructor(readonly socket: Socket) {
        super();
    }

    public receiveData(data: Buffer): void {
        this.buffer = Buffer.concat([this.buffer, data]);
        let i = 0;
        const nsdus: Buffer[] = [];
        while (i < this.buffer.length) {
            if (this.buffer.length < i + 4) {
                break;
            }
            const length = this.buffer.readUint16BE(i + 2);
            if (length > this.max_nsdu_size) {
                this.socket.end();
                return;
            }
            if (this.buffer.length < i + length) {
                break;
            }
            const nsdu = this.buffer.subarray(i + 4, i + length);
            nsdus.push(nsdu);
            i += length;
        }
        this.buffer = this.buffer.subarray(i);
        nsdus.forEach((nsdu) => this.emit('NSDU', nsdu));
    }

    public writeNSDU(nsdu: Buffer): void {
        const tpkt_header = Buffer.from([TPKT_VERSION, 0, 0, 0]);
        tpkt_header.writeUint16BE(nsdu.length + 4, 2);
        this.socket.cork();
        this.socket.write(tpkt_header);
        this.socket.write(nsdu);
        this.socket.uncork();
    }
}
