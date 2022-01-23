import * as net from "net";
import * as tls from "tls";
import { strict as assert } from "assert";
import IDMVersion from "./IDMVersion";
import IDMSegmentField from "./IDMSegmentField";
import IDMSegment from "./IDMSegment";
import { BERElement, ASN1Element, INTEGER, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    Request,
    IdmResult,
    IDM_PDU,
    _decode_IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import { Error as IDMError } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Error.ta";
import { IdmReject } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject.ta";
import {
    Abort,
    Abort_invalidPDU,
    Abort_reasonNotSpecified,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import type { IdmReject_reason } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import type { GeneralName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import { EventEmitter } from "events";
import type IDMEventEmitter from "./IDMEventEmitter";
import { BER } from "asn1-ts/dist/node/functional";
import {
    IdmBindResult,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindResult.ta";
import {
    IdmBindError,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBindError.ta";
import {
    TLSResponse,
    TLSResponse_success,
    TLSResponse_operationsError,
    TLSResponse_protocolError,
    TLSResponse_unavailable,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/TLSResponse.ta";
import type {
    Code,
} from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";

// NOTE: It does not seem to clearly state what the code for version 2 is.
// TODO: Check for reused invoke IDs.

export default
class IDMConnection {
    // Buffer
    private nextExpectedField = IDMSegmentField.version;
    private awaitingBytes: number = 1;
    private buffer: Buffer = Buffer.allocUnsafe(0);
    private bufferIndex: number = 0;

    // IDM Segments
    private version: IDMVersion | undefined = IDMVersion.v1;
    private currentSegments: IDMSegment[] = [];
    private currentSegment: Partial<IDMSegment> = {};

    // IDM Packet
    // private bindInformation: IdmBind | undefined = undefined;

    // Event emitter
    public readonly events: IDMEventEmitter = new EventEmitter();
    private socket!: net.Socket;
    private startTLSRequested: boolean = false;

    private resetState (): void {
        this.nextExpectedField = IDMSegmentField.version;
        this.awaitingBytes = 1;
        this.buffer = Buffer.allocUnsafe(0);
        this.bufferIndex = 0;
        this.version = IDMVersion.v1;
        this.currentSegments = [];
        this.currentSegment = {};
    }

    public getNumberOfEnqueuedBytes (): number {
        return this.buffer.length;
    }

    public protectedByTLS (): boolean {
        return (this.socket instanceof tls.TLSSocket);
    }

    private handleData (data: Buffer): void {
        this.buffer = Buffer.concat([ this.buffer, data ]);
        while ((this.bufferIndex + this.awaitingBytes) <= this.buffer.length) {
            switch (this.nextExpectedField) {
            case (IDMSegmentField.version): {
                const indicatedVersion = this.buffer.readUInt8(this.bufferIndex);
                if (indicatedVersion === 1) {
                    this.version = IDMVersion.v1;
                    this.currentSegment.version = IDMVersion.v1;
                } else if (indicatedVersion === 2) {
                    this.version = IDMVersion.v2;
                    this.currentSegment.version = IDMVersion.v2;
                } else {
                    this.writeAbort(Abort_invalidPDU).then(() => this.socket.destroy());
                    return;
                }
                this.nextExpectedField = IDMSegmentField.final;
                this.bufferIndex++;
                break;
            }
            case (IDMSegmentField.final): {
                this.currentSegment.final = Boolean(this.buffer.readUInt8(this.bufferIndex));
                if (this.version === undefined) {
                    // Invalid parser state.
                    this.writeAbort(Abort_reasonNotSpecified).then(() => this.socket.destroy());
                } else if (this.version === IDMVersion.v1) {
                    this.nextExpectedField = IDMSegmentField.length;
                    this.awaitingBytes = 4;
                } else if (this.version === IDMVersion.v2) {
                    this.nextExpectedField = IDMSegmentField.encoding;
                    this.awaitingBytes = 2;
                } else {
                    this.writeAbort(Abort_invalidPDU).then(() => this.socket.destroy());
                }
                this.bufferIndex++;
                break;
            }
            case (IDMSegmentField.encoding): {
                this.currentSegment.encoding = this.buffer.readUInt16BE(this.bufferIndex); // REVIEW:
                this.bufferIndex += 2;
                this.nextExpectedField = IDMSegmentField.length;
                this.awaitingBytes = 4;
                break;
            }
            case (IDMSegmentField.length): {
                this.currentSegment.length = this.buffer.readUInt32BE(this.bufferIndex); // REVIEW:
                this.awaitingBytes = this.currentSegment.length;
                this.bufferIndex += 4;
                this.nextExpectedField = IDMSegmentField.data;
                /**
                 * The significance of this event is that it can be used
                 * to abort an IDM connection if an inbound segment is
                 * going to have an unacceptable size.
                 */
                this.events.emit("length", this.awaitingBytes);
                break;
            }
            case (IDMSegmentField.data): {
                assert(this.currentSegment.length !== undefined, "Invalid parser state.");
                this.currentSegment.data = this.buffer.slice(
                    this.bufferIndex,
                    (this.bufferIndex + this.currentSegment.length),
                );
                this.currentSegments.push(this.currentSegment as IDMSegment);
                if (this.currentSegment.final) {
                    const pduBytes = Buffer.concat(this.currentSegments.map((s) => s.data));
                    const ber = new BERElement();
                    ber.fromBytes(pduBytes);
                    this.handlePDU(_decode_IDM_PDU(ber));
                    this.currentSegments = [];
                }
                this.buffer = this.buffer.slice(this.bufferIndex + this.currentSegment.length);
                this.bufferIndex = 0;
                this.currentSegment = {};
                this.nextExpectedField = IDMSegmentField.version;
                this.awaitingBytes = 1;
                break;
            }
            default: {
                this.writeAbort(Abort_invalidPDU).then(() => this.socket.destroy());
                return;
            }
            }
        }
    };

    constructor (
        readonly s: net.Socket,
        readonly starttlsOptions?: tls.TLSSocketOptions,
    ) {
        this.socket = s;
        this.socket.on("data", (data: Buffer) => this.handleData(data));
    }

    public close (): void {
        this.buffer = Buffer.alloc(0);
        this.socket.destroy();
    }

    private async handlePDU (pdu: IDM_PDU): Promise<void> {
        if ("bind" in pdu) {
            this.events.emit("bind", pdu.bind);
        } else if ("bindResult" in pdu) {
            this.events.emit("bindResult", pdu.bindResult);
        } else if ("bindError" in pdu) {
            this.events.emit("bindError", pdu.bindError);
        } else if ("request" in pdu) {
            this.events.emit("request", pdu.request);
        } else if ("result" in pdu) {
            this.events.emit(pdu.result.invokeID.toString(), {
                invokeId: {
                    present: pdu.result.invokeID,
                },
                opCode: pdu.result.opcode,
                result: pdu.result.result,
            });
            this.events.emit("result", pdu.result);
        } else if ("error" in pdu) {
            this.events.emit(pdu.error.invokeID.toString(), {
                invokeId: {
                    present: pdu.error.invokeID,
                },
                errcode: pdu.error.errcode,
                error: pdu.error.error,
            });
            this.events.emit("error_", pdu.error);
        } else if ("reject" in pdu) {
            this.events.emit("reject", pdu.reject);
        } else if ("unbind" in pdu) {
            this.events.emit("unbind", pdu.unbind);
        } else if ("abort" in pdu) {
            this.events.emit("abort", pdu.abort);
        } else if ("startTLS" in pdu) {
            this.events.emit("startTLS", pdu.startTLS);
            if ((!this.starttlsOptions?.key || !this.starttlsOptions.cert) && !this.starttlsOptions?.pfx) {
                // TLS is not configured.
                this.writeTLSResponse(TLSResponse_protocolError)
                    .catch((e) => this.events.emit("socketError", e));
                return;
            }
            if (this.socket instanceof tls.TLSSocket) {
                // TLS is already in use.
                this.writeTLSResponse(TLSResponse_operationsError)
                    .catch((e) => this.events.emit("socketError", e));
                return;
            }
            this.resetState();
            const plainSocket = this.socket;
            plainSocket.removeAllListeners("data");
            try {
                const encryptedSocket = new tls.TLSSocket(plainSocket, {
                    ...(this.starttlsOptions ?? {}),
                    isServer: true,
                });
                // NOTE: secureConnect is not emitted when the TLSSocket() constructor is used.
                encryptedSocket.on("data", (data: Buffer) => this.handleData(data));
                encryptedSocket.on("error", (e) => this.events.emit("socketError", e));
                this.writeTLSResponse(TLSResponse_success);
                this.socket = encryptedSocket;
            } catch (e) {
                this.writeTLSResponse(TLSResponse_unavailable)
                    .catch((e) => this.events.emit("socketError", e));
            }
        } else if ("tLSResponse" in pdu) {
            this.events.emit("tLSResponse", pdu.tLSResponse);
            if ((this.socket instanceof tls.TLSSocket) || !this.startTLSRequested) {
                // TLS is already in use or was not requested.
                return;
            }
            if (pdu.tLSResponse === TLSResponse_success) { // Success
                this.socket.removeAllListeners("data");
                this.socket.removeAllListeners("error");
                const encryptedSocket = tls.connect({
                    ...(this.starttlsOptions ?? {}),
                    socket: this.socket,
                });
                encryptedSocket.on("secureConnect", () => {
                    encryptedSocket.on("error", (e) => this.events.emit("socketError", e));
                    encryptedSocket.on("data", (data: Buffer) => this.handleData(data));
                    this.socket = encryptedSocket;
                });
            }
        } else {
            this.writeAbort(Abort_invalidPDU);
        }
    }

    public write (data: Uint8Array, encodings: number): void {
        const header = ((): Buffer => {
            switch (this.version) {
            case (IDMVersion.v1): {
                const VERSION_V1_BYTE: number = 0x01;
                const FINAL_BYTE: number = 0x01; // FIXME: Support larger responses.
                const ret = Buffer.alloc(6);
                ret.writeUInt8(VERSION_V1_BYTE, 0);
                ret.writeUInt8(FINAL_BYTE, 1);
                ret.writeUInt32BE(data.length, 2);
                return ret;
            }
            case (IDMVersion.v2): {
                const VERSION_V2_BYTE: number = 0x02;
                const FINAL_BYTE: number = 0x01; // FIXME: Support larger responses.
                const ret = Buffer.alloc(7);
                ret.writeUInt8(VERSION_V2_BYTE, 0);
                ret.writeUInt8(FINAL_BYTE, 1);
                ret.writeUInt16BE(encodings, 2);
                ret.writeUInt32BE(data.length, 4);
                return ret;
            }
            default: {
                throw new Error();
            }
            }
        })();
        this.socket.cork();
        this.socket.write(header);
        this.socket.write(data);
        this.socket.uncork();
        // Instead of doing this, which requires an unnecessary heap allocation:
        // this.socket.write(Buffer.concat([
        //     header,
        //     data,
        // ]));
    }

    public async writeBindResult (
        protocolID: OBJECT_IDENTIFIER,
        result: ASN1Element,
        respondingAETitle?: GeneralName,
    ): Promise<void> {
        const bindResult = new IdmBindResult(protocolID, respondingAETitle, result);
        const idm: IDM_PDU = {
            bindResult,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeBindError (
        protocolID: OBJECT_IDENTIFIER,
        error: ASN1Element,
        respondingAETitle?: GeneralName,
    ): Promise<void> {
        const bindError = new IdmBindError(
            protocolID,
            respondingAETitle,
            undefined, // aETitleError
            error,
        );
        const idm: IDM_PDU = {
            bindError,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeError (invokeId: INTEGER, errcode: ASN1Element, data: ASN1Element): Promise<void> {
        const error = new IDMError(invokeId, errcode, data);
        const idm: IDM_PDU = {
            error,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeReject (invokeID: INTEGER, reason: IdmReject_reason): Promise<void> {
        const reject = new IdmReject(invokeID, reason);
        const idm: IDM_PDU = {
            reject,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeAbort (abort: Abort): Promise<void> {
        const idm: IDM_PDU = {
            abort,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeStartTLS (): Promise<void> {
        this.startTLSRequested = true;
        const idm: IDM_PDU = {
            startTLS: null,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeTLSResponse (tLSResponse: TLSResponse): Promise<void> {
        const idm: IDM_PDU = {
            tLSResponse,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeRequest (invokeID: INTEGER, opcode: Code, argument: ASN1Element): Promise<void> {
        const request = new Request(invokeID, opcode, argument);
        const idm: IDM_PDU = {
            request,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }

    public async writeResult (invokeID: INTEGER, opcode: Code, resultValue: ASN1Element): Promise<void> {
        const result = new IdmResult(invokeID, opcode, resultValue);
        const idm: IDM_PDU = {
            result,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes(), 0);
    }
}
