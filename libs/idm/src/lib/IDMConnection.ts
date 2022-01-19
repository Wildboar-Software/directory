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
import type { Abort } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
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

    public getNumberOfEnqueuedBytes (): number {
        return this.buffer.length;
    }

    constructor (
        readonly s: net.Socket,
    ) {
        this.socket = s;
        this.socket.on("data", (data: Buffer) => {
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
                        throw new Error(`Unrecognized IDM protocol version ${indicatedVersion}.`);
                    }
                    this.nextExpectedField = IDMSegmentField.final;
                    this.bufferIndex++;
                    break;
                }
                case (IDMSegmentField.final): {
                    this.currentSegment.final = Boolean(this.buffer.readUInt8(this.bufferIndex));
                    if (this.version === undefined) {
                        throw new Error("Invalid parser state.");
                    } else if (this.version === IDMVersion.v1) {
                        this.nextExpectedField = IDMSegmentField.length;
                        this.awaitingBytes = 4;
                    } else if (this.version === IDMVersion.v2) {
                        this.nextExpectedField = IDMSegmentField.encoding;
                        this.awaitingBytes = 2;
                    } else {
                        throw new Error();
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
                    throw new Error(`Unrecognized IDM segment field ${this.nextExpectedField}`);
                }
                }
            }
        });
    }

    public close (): void {
        this.buffer = Buffer.alloc(0);
        this.socket.end();
    }

    private handlePDU (pdu: IDM_PDU): void {
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
        } else if ("tLSResponse" in pdu) {
            this.events.emit("tLSResponse", pdu.tLSResponse);
            if (pdu.tLSResponse === 0) { // Success
                this.socket = new tls.TLSSocket(this.socket);
            }
        } else {
            // console.log("Unrecognized IDM PDU.");
        }
    }

    public write (data: Uint8Array, encodings: number): void {
        const header = ((): Buffer => {
            switch (this.version) {
            case (IDMVersion.v1): {
                const VERSION_V1_BYTE: number = 0x01;
                const FINAL_BYTE: number = 0x01; // FIXME: Support larger responses.
                const ret = Buffer.alloc(6);
                ret.writeInt8(VERSION_V1_BYTE, 0);
                ret.writeInt8(FINAL_BYTE, 1);
                ret.writeInt32BE(data.length, 2);
                return ret;
            }
            case (IDMVersion.v2): {
                const VERSION_V2_BYTE: number = 0x02;
                const FINAL_BYTE: number = 0x01; // FIXME: Support larger responses.
                const ret = Buffer.alloc(7);
                ret.writeInt8(VERSION_V2_BYTE, 0);
                ret.writeInt8(FINAL_BYTE, 1);
                ret.writeInt16BE(encodings, 2);
                ret.writeInt32BE(data.length, 4);
                return ret;
            }
            default: {
                throw new Error();
            }
            }
        })();
        this.socket.write(Buffer.concat([
            header,
            data,
        ]));
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
