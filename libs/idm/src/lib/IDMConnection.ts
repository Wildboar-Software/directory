import * as net from "net";
import * as tls from "tls";
import IDMVersion from "./IDMVersion";
import IDMSegment from "./IDMSegment";
import { BERElement, ASN1Element, INTEGER, OBJECT_IDENTIFIER } from "asn1-ts";
import {
    IDM_PDU,
    _decode_IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import { Error as IDMError } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Error.ta";
import { IdmReject } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject.ta";
import { IdmResult } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmResult.ta";
import { Request } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import { Unbind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Unbind.ta";
import {
    Abort,
    Abort_invalidPDU,
    Abort_unboundRequest,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import type { IdmReject_reason } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmReject-reason.ta";
import type { GeneralName } from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import { EventEmitter } from "events";
import type IDMEventEmitter from "./IDMEventEmitter";
import { BER } from "asn1-ts/dist/node/functional";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
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
import {
    IDM_WARN_PADDING_AFTER_PDU,
    IDM_WARN_DOUBLE_START_TLS,
    IDM_WARN_MULTI_BIND,
    IDM_WARN_BAD_SEQUENCE,
    IDM_WARN_NEGATIVE_INVOKE_ID,
    IDM_WARN_VERSION_CHANGE,
} from "./warnings";
import IDMStatus from "./IDMStatus";

// NOTE: It does not seem to clearly state what the code for version 2 is.

const IDM_V1_FRAME_SIZE: number = 6;
const IDM_V2_FRAME_SIZE: number = 8;

export default
class IDMConnection {
    private buffer: Buffer = Buffer.allocUnsafe(0);
    private version: IDMVersion | undefined = undefined;
    private currentSegments: IDMSegment[] = [];
    public readonly events: IDMEventEmitter = new EventEmitter();
    public socket!: net.Socket;
    public localStatus: IDMStatus = IDMStatus.UNBOUND;
    public remoteStatus: IDMStatus = IDMStatus.UNBOUND;
    private startTLSRequested: boolean = false;
    private framesReceived: number = 0;

    private resetState (): void {
        this.buffer = Buffer.allocUnsafe(0);
        this.version = IDMVersion.v1;
        this.currentSegments = [];
    }

    public getFramesReceived (): number {
        return this.framesReceived;
    }

    public getBufferSize (): number {
        return this.buffer.length;
    }

    public getAccumulatedPDUSize (): number {
        // Yes, I know you can do this with .reduce(), but this is more performant.
        let sum: number = 0;
        for (const segment of this.currentSegments) {
            sum += segment.length;
        }
        return sum;
    }

    public getNumberOfSegmentsInPDU (): number {
        return this.currentSegments.length;
    }

    public protectedByTLS (): boolean {
        return (this.socket instanceof tls.TLSSocket);
    }

    private chompFrame (): void {
        if (this.buffer.length === 0) {
            return;
        }
        if (![ IDMVersion.v1, IDMVersion.v2 ].includes(this.buffer[0])) {
            this.events.emit("socketError", new Error(`Unsupported IDM version ${this.buffer[0]}`));
            this.writeAbort(Abort_invalidPDU);
            return;
        }
        if (this.version === undefined) { // The version is not established.
            this.version = this.buffer[0];
        } else if (this.version !== this.buffer[0]) {
            // Technically, this is not really permitted, but we can tolerate
            // this, as long as the encodings didn't change.
            this.events.emit("warning", IDM_WARN_VERSION_CHANGE);
        }
        if (
            (this.buffer[0] === IDMVersion.v2)
            && (this.buffer.length >= IDM_V2_FRAME_SIZE)
        ) {
            const length = this.buffer.readUInt32BE(4);
            this.events.emit("segmentDataLength", length);
            if (this.buffer.length >= (IDM_V2_FRAME_SIZE + length)) {
                const currentSegment: IDMSegment = {
                    version: IDMVersion.v2,
                    encoding: this.buffer.readUInt16BE(2),
                    final: (this.buffer[1] === 1),
                    length,
                    data: this.buffer.slice(
                        IDM_V2_FRAME_SIZE,
                        (IDM_V2_FRAME_SIZE + length),
                    ),
                };
                this.currentSegments.push(currentSegment);
                if (currentSegment.final) {
                    const pduBytes = Buffer.concat(this.currentSegments.map((s) => s.data));
                    const el = new BERElement();
                    const readBytes = el.fromBytes(pduBytes);
                    if (readBytes !== pduBytes.length) {
                        this.events.emit("warning", IDM_WARN_PADDING_AFTER_PDU);
                    }
                    const pdu = _decode_IDM_PDU(el);
                    this.handlePDU(pdu);
                    this.currentSegments = [];
                }
                this.buffer = this.buffer.slice(IDM_V2_FRAME_SIZE + length);
                this.framesReceived++;
                setImmediate(this.chompFrame.bind(this));
            }
        }
        else if (
            (this.buffer[0] === IDMVersion.v1)
            && (this.buffer.length >= IDM_V1_FRAME_SIZE)
        ) {
            const length = this.buffer.readUInt32BE(2);
            this.events.emit("segmentDataLength", length);
            if (this.buffer.length >= (IDM_V1_FRAME_SIZE + length)) {
                const currentSegment: IDMSegment = {
                    version: IDMVersion.v1,
                    encoding: 0,
                    final: (this.buffer[1] === 1),
                    length,
                    data: this.buffer.slice(
                        IDM_V1_FRAME_SIZE,
                        (IDM_V1_FRAME_SIZE + length),
                    ),
                };
                this.currentSegments.push(currentSegment);
                if (currentSegment.final) {
                    const pduBytes = Buffer.concat(this.currentSegments.map((s) => s.data));
                    const el = new BERElement();
                    const readBytes = el.fromBytes(pduBytes);
                    if (readBytes !== pduBytes.length) {
                        this.events.emit("warning", IDM_WARN_PADDING_AFTER_PDU);
                    }
                    const pdu = _decode_IDM_PDU(el);
                    this.handlePDU(pdu);
                    this.currentSegments = [];
                }
                this.buffer = this.buffer.slice(IDM_V1_FRAME_SIZE + length);
                this.framesReceived++;
                setImmediate(this.chompFrame.bind(this));
            }
        }
    }

    private handleData (data: Buffer): void {
        try {
            this.events.emit("socketDataLength", data.length);
            this.buffer = Buffer.concat([ this.buffer, data ]);
            this.chompFrame();
        } catch (e) {
            this.events.emit("socketError", e);
        }
    };

    public close (): void {
        this.buffer = Buffer.alloc(0);
        this.socket.destroy();
    }

    private async handlePDU (pdu: IDM_PDU): Promise<void> {
        if ("bind" in pdu) {
            if (this.remoteStatus !== IDMStatus.UNBOUND) {
                this.events.emit("warning", IDM_WARN_MULTI_BIND);
            }
            this.remoteStatus = IDMStatus.BIND_IN_PROGRESS;
            this.events.emit("bind", pdu.bind);
        } else if ("bindResult" in pdu) {
            if (this.localStatus !== IDMStatus.BIND_IN_PROGRESS) {
                this.events.emit("warning", IDM_WARN_BAD_SEQUENCE);
            }
            this.localStatus = IDMStatus.BOUND;
            this.events.emit("bindResult", pdu.bindResult);
        } else if ("bindError" in pdu) {
            if (this.localStatus !== IDMStatus.BIND_IN_PROGRESS) {
                this.events.emit("warning", IDM_WARN_BAD_SEQUENCE);
            }
            this.localStatus = IDMStatus.UNBOUND;
            this.events.emit("bindError", pdu.bindError);
        } else if ("request" in pdu) {
            // Requests can come in before the bind response
            if (this.remoteStatus === IDMStatus.UNBOUND) {
                this.events.emit("warning", IDM_WARN_BAD_SEQUENCE);
                this.writeAbort(Abort_unboundRequest);
                return;
            }
            if (pdu.request.invokeID < 0) {
                this.events.emit("warning", IDM_WARN_NEGATIVE_INVOKE_ID);
                this.writeAbort(Abort_invalidPDU);
                return;
            }
            this.events.emit("request", pdu.request);
        } else if ("result" in pdu) {
            if (pdu.result.invokeID < 0) {
                this.events.emit("warning", IDM_WARN_NEGATIVE_INVOKE_ID);
                this.writeAbort(Abort_invalidPDU);
                return;
            }
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
            if (this.remoteStatus !== IDMStatus.BOUND) {
                this.events.emit("warning", IDM_WARN_BAD_SEQUENCE);
            }
            this.remoteStatus = IDMStatus.UNBOUND;
            this.events.emit("unbind", pdu.unbind);
        } else if ("abort" in pdu) {
            this.localStatus = IDMStatus.UNBOUND;
            this.events.emit("abort", pdu.abort);
            this.close();
        } else if ("startTLS" in pdu) {
            this.events.emit("startTLS", pdu.startTLS);
            if ((!this.starttlsOptions?.key || !this.starttlsOptions.cert) && !this.starttlsOptions?.pfx) {
                // TLS is not configured.
                try {
                    this.writeTLSResponse(TLSResponse_protocolError);
                } catch (e) {
                    this.events.emit("socketError", e);
                }
                return;
            }
            if (this.socket instanceof tls.TLSSocket) {
                // TLS is already in use.
                this.events.emit("warning", IDM_WARN_DOUBLE_START_TLS);
                try {
                    this.writeTLSResponse(TLSResponse_operationsError);
                } catch (e) {
                    this.events.emit("socketError", e);
                }
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
                try {
                    this.writeTLSResponse(TLSResponse_unavailable);
                } catch (e) {
                    this.close();
                }
            }
        } else if ("tLSResponse" in pdu) {
            this.events.emit("tLSResponse", pdu.tLSResponse);
            if ((this.socket instanceof tls.TLSSocket) || !this.startTLSRequested) {
                // TLS is already in use or was not requested.
                this.events.emit("warning", IDM_WARN_DOUBLE_START_TLS);
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

    public write (data: Uint8Array, final: boolean = true): void {
        const header = ((): Buffer => {
            switch (this.version ?? IDMVersion.v1) {
            case (IDMVersion.v1): {
                const VERSION_V1_BYTE: number = 0x01;
                const FINAL_BYTE: number = final
                    ? 0x01
                    : 0x00;
                const ret = Buffer.alloc(IDM_V1_FRAME_SIZE);
                ret.writeUInt8(VERSION_V1_BYTE, 0);
                ret.writeUInt8(FINAL_BYTE, 1);
                ret.writeUInt32BE(data.length, 2);
                return ret;
            }
            case (IDMVersion.v2): {
                const VERSION_V2_BYTE: number = 0x02;
                const FINAL_BYTE: number = final
                    ? 0x01
                    : 0x00;
                const ret = Buffer.alloc(IDM_V2_FRAME_SIZE);
                ret.writeUInt8(VERSION_V2_BYTE, 0);
                ret.writeUInt8(FINAL_BYTE, 1);
                ret.writeUInt16BE(0x0000, 2); // Only BER is supported
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

    public writeBind (
        protocolID: OBJECT_IDENTIFIER,
        argument: ASN1Element,
        callingAETitle?: GeneralName,
        calledAETitle?: GeneralName,
    ): void {
        this.localStatus = IDMStatus.BIND_IN_PROGRESS;
        const bind = new IdmBind(protocolID, callingAETitle, calledAETitle, argument);
        const idm: IDM_PDU = {
            bind,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeBindResult (
        protocolID: OBJECT_IDENTIFIER,
        result: ASN1Element,
        respondingAETitle?: GeneralName,
    ): void {
        this.remoteStatus = IDMStatus.BOUND;
        const bindResult = new IdmBindResult(protocolID, respondingAETitle, result);
        const idm: IDM_PDU = {
            bindResult,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeBindError (
        protocolID: OBJECT_IDENTIFIER,
        error: ASN1Element,
        respondingAETitle?: GeneralName,
    ): void {
        this.remoteStatus = IDMStatus.UNBOUND;
        const bindError = new IdmBindError(
            protocolID,
            respondingAETitle,
            undefined, // aETitleError
            error,
        );
        const idm: IDM_PDU = {
            bindError,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeRequest (invokeID: INTEGER, opcode: Code, argument: ASN1Element): void {
        const request = new Request(invokeID, opcode, argument);
        const idm: IDM_PDU = {
            request,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeResult (invokeID: INTEGER, opcode: Code, resultValue: ASN1Element): void {
        const result = new IdmResult(invokeID, opcode, resultValue);
        const idm: IDM_PDU = {
            result,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeError (invokeId: INTEGER, errcode: ASN1Element, data: ASN1Element): void {
        const error = new IDMError(invokeId, errcode, data);
        const idm: IDM_PDU = {
            error,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeReject (invokeID: INTEGER, reason: IdmReject_reason): void {
        const reject = new IdmReject(invokeID, reason);
        const idm: IDM_PDU = {
            reject,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeUnbind (): void {
        this.localStatus = IDMStatus.UNBOUND;
        const unbind: Unbind = null;
        const idm: IDM_PDU = {
            unbind,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeAbort (abort: Abort): void {
        try {
            const idm: IDM_PDU = {
                abort,
            };
            this.write(_encode_IDM_PDU(idm, BER).toBytes());
            this.close();
        } catch {
            //
        }
    }

    public writeStartTLS (): void {
        this.startTLSRequested = true;
        const idm: IDM_PDU = {
            startTLS: null,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    public writeTLSResponse (tLSResponse: TLSResponse): void {
        const idm: IDM_PDU = {
            tLSResponse,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    constructor (
        readonly s: net.Socket,
        readonly starttlsOptions?: tls.TLSSocketOptions,
    ) {
        this.socket = s;
        this.socket.on("data", (data: Buffer) => this.handleData(data));
    }
}
