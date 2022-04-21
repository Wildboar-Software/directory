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
    IDM_WARN_BAD_SEQUENCE,
    IDM_WARN_NEGATIVE_INVOKE_ID,
    IDM_WARN_VERSION_CHANGE,
    IDM_WARN_BIG_INVOKE_ID,
} from "./warnings";
import IDMStatus from "./IDMStatus";

// NOTE: It does not seem to clearly state what the code for version 2 is.

const IDM_V1_FRAME_SIZE: number = 6;
const IDM_V2_FRAME_SIZE: number = 8;

/**
 * @summary An Internet Directly-Mapped (IDM) protocol socket
 * @description
 *
 * An Internet Directly-Mapped (IDM) protocol socket.
 *
 * @class
 */
export default
class IDMConnection {

    /** The internal buffer of bytes received on the TCP socket */
    private buffer: Buffer = Buffer.allocUnsafe(0);

    /** The established version of the IDM protocol used by this socket */
    private version: IDMVersion | undefined = undefined;

    /** The IDM segments of the current IDM PDU */
    private currentSegments: IDMSegment[] = [];

    /** A channel for IDM socket-related events */
    public readonly events: IDMEventEmitter = new EventEmitter();

    /** The underlying TCP socket */
    public socket!: net.Socket;

    /** The status of this side of the IDM connection */
    public localStatus: IDMStatus = IDMStatus.UNBOUND;

    /** The inferred status of the other side of the IDM connection */
    public remoteStatus: IDMStatus = IDMStatus.UNBOUND;

    /** Whether StartTLS was already requested */
    private startTLSRequested: boolean = false;

    /** The count of how many IDM frames have been received */
    private framesReceived: number = 0;

    /**
     * @summary Reset the state of the IDM socket
     * @description
     *
     * Resets the state of the IDM socket.
     *
     * @private
     * @function
     */
    private resetState (): void {
        this.buffer = Buffer.allocUnsafe(0);
        this.version = IDMVersion.v1;
        this.currentSegments = [];
    }

    /**
     * @summary Gets the number of frames received
     * @description
     *
     * Gets the number of frames received.
     *
     * @public
     * @function
     */
    public getFramesReceived (): number {
        return this.framesReceived;
    }

    /**
     * @summary Gets the current size of the buffer
     * @description
     *
     * Gets the current size of the buffer.
     *
     * @public
     * @function
     */
    public getBufferSize (): number {
        return this.buffer.length;
    }

    /**
     * @summary Gets the current size in bytes of the incoming IDM PDU
     * @description
     *
     * Gets the current size in bytes of the incoming IDM PDU.
     *
     * @public
     * @function
     */
    public getAccumulatedPDUSize (): number {
        // Yes, I know you can do this with .reduce(), but this is more performant.
        let sum: number = 0;
        for (const segment of this.currentSegments) {
            sum += segment.length;
        }
        return sum;
    }

    /**
     * @summary Gets the number of IDM segments in the incoming IDM PDU
     * @description
     *
     * Gets the number of IDM segments in the incoming IDM PDU.
     *
     * @returns The number of IDM segments in the incoming IDM PDU.
     *
     * @public
     * @function
     */
    public getNumberOfSegmentsInPDU (): number {
        return this.currentSegments.length;
    }

    /**
     * @summary Indicates whether this IDM socket is protected by TLS
     * @description
     *
     * Indicates whether this IDM socket is protected by TLS.
     *
     * @returns A `boolean` indicating whether this IDM socket is protected by TLS.
     *
     * @public
     * @function
     */
    public protectedByTLS (): boolean {
        return (this.socket instanceof tls.TLSSocket);
    }

    /**
     * @summary Read an IDM segment from the current buffer
     * @description
     *
     * "Chomps" the first IDM segment that can be read from the current buffer,
     * and shifts the read bytes out of the buffer.
     *
     * @private
     * @function
     */
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

    /**
     * @summary Handle a chunk of received bytes from the underlying TCP socket
     * @description
     *
     * Handles a chunk of received bytes from the underlying TCP socket.
     *
     * @param data The chunk of bytes received from the underlying TCP socket
     *
     * @private
     * @function
     */
    private handleData (data: Buffer): void {
        try {
            this.events.emit("socketDataLength", data.length);
            this.buffer = Buffer.concat([ this.buffer, data ]);
            this.chompFrame();
        } catch (e) {
            this.events.emit("socketError", e);
        }
    };

    /**
     * @summary Close this IDM socket and the underlying TCP socket
     * @description
     *
     * Closes this IDM socket and the underlying TCP socket.
     *
     * @public
     * @function
     */
    public close (): void {
        this.buffer = Buffer.alloc(0);
        this.socket.destroy();
    }

    /**
     * @summary Handle a received IDM PDU
     * @description
     *
     * Handles a received IDM PDU.
     *
     * @param pdu The IDM PDU to be handled
     *
     * @async
     * @private
     * @function
     */
    private async handlePDU (pdu: IDM_PDU): Promise<void> {
        if ("bind" in pdu) {
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
            if (pdu.request.invokeID > Number.MAX_SAFE_INTEGER) {
                this.events.emit("warning", IDM_WARN_BIG_INVOKE_ID);
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
                try {
                    const encryptedSocket = tls.connect({
                        ...(this.starttlsOptions ?? {}),
                        socket: this.socket,
                    });
                    encryptedSocket.on("error", (e) => this.events.emit("socketError", e));
                    encryptedSocket.on("secureConnect", () => {
                        encryptedSocket.on("data", (data: Buffer) => this.handleData(data));
                        this.socket = encryptedSocket;
                        this.events.emit("tls");
                    });
                } catch (e) {
                    this.socket.emit("socketError", e);
                }
            }
        } else {
            this.writeAbort(Abort_invalidPDU);
        }
    }

    /**
     * @summary Write raw data into IDM segments
     * @description
     *
     * Writes raw data into IDM segments
     *
     * @param data The raw bytes of the PDU to be written into an IDM segment
     * @param final Whether the IDM segment is the final segment
     *
     * @public
     * @function
     */
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

    /**
     * @summary Write an IDM bind PDU
     * @description
     *
     * Write an IDM bind PDU
     *
     * @param protocolID The object identifier of the protocol
     * @param argument The bind argument
     * @param callingAETitle The calling application entity (AE) title
     * @param calledAETitle The called application entity (AE) title
     *
     * @public
     * @function
     */
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

    /**
     * @summary Write an IDM bind result
     * @description
     *
     * Write an IDM bind result PDU
     *
     * @param protocolID The object identifier of the protocol
     * @param result The bind result parameter
     * @param respondingAETitle The responding application entity (AE) title
     *
     * @public
     * @function
     */
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

    /**
     * @summary Write an IDM bind error
     * @description
     *
     * Write an IDM bind error PDU
     *
     * @param protocolID The object identifier of the protocol
     * @param result The bind result parameter
     * @param respondingAETitle The responding application entity (AE) title
     *
     * @public
     * @function
     */
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

    /**
     * @summary Write an IDM request
     * @description
     *
     * Write an IDM request PDU
     *
     * @param invokeID The invoke ID of the request
     * @param opcode The opcode of the request
     * @param argument The request argument
     *
     * @public
     * @function
     */
    public writeRequest (invokeID: INTEGER, opcode: Code, argument: ASN1Element): void {
        const request = new Request(invokeID, opcode, argument);
        const idm: IDM_PDU = {
            request,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM result
     * @description
     *
     * Write an IDM result PDU
     *
     * @param invokeID The invoke ID of the result
     * @param opcode The opcode of the result
     * @param resultValue The result parameter
     *
     * @public
     * @function
     */
    public writeResult (invokeID: INTEGER, opcode: Code, resultValue: ASN1Element): void {
        const result = new IdmResult(invokeID, opcode, resultValue);
        const idm: IDM_PDU = {
            result,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM error
     * @description
     *
     * Write an IDM error PDU
     *
     * @param invokeID The invoke ID of the request that produced the error
     * @param errcode The error code
     * @param data The error parameter
     *
     * @public
     * @function
     */
    public writeError (invokeId: INTEGER, errcode: ASN1Element, data: ASN1Element): void {
        const error = new IDMError(invokeId, errcode, data);
        const idm: IDM_PDU = {
            error,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM reject
     * @description
     *
     * Write an IDM reject PDU
     *
     * @param invokeID The invoke ID of the request that produced the reject
     * @param reason The reject reason
     *
     * @public
     * @function
     */
    public writeReject (invokeID: INTEGER, reason: IdmReject_reason): void {
        const reject = new IdmReject(invokeID, reason);
        const idm: IDM_PDU = {
            reject,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM unbind
     * @description
     *
     * Write an IDM unbind PDU
     *
     * @public
     * @function
     */
    public writeUnbind (): void {
        this.localStatus = IDMStatus.UNBOUND;
        const unbind: Unbind = null;
        const idm: IDM_PDU = {
            unbind,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM abort
     * @description
     *
     * Write an IDM abort PDU
     *
     * @param abort The abort reason
     *
     * @public
     * @function
     */
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

    /**
     * @summary Write an IDM StartTLS PDU
     * @description
     *
     * Write an IDM StartTLS PDU
     *
     * @public
     * @function
     */
    public writeStartTLS (): void {
        this.startTLSRequested = true;
        const idm: IDM_PDU = {
            startTLS: null,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @summary Write an IDM TLS response
     * @description
     *
     * Write an IDM TLSResponse PDU
     *
     * @public
     * @function
     */
    public writeTLSResponse (tLSResponse: TLSResponse): void {
        const idm: IDM_PDU = {
            tLSResponse,
        };
        this.write(_encode_IDM_PDU(idm, BER).toBytes());
    }

    /**
     * @param s The original TCP socket
     * @param starttlsOptions Options to use if the socket changes to using TLS
     */
    constructor (
        readonly s: net.Socket,
        readonly starttlsOptions?: tls.TLSSocketOptions,
    ) {
        this.socket = s;
        this.socket.on("data", (data: Buffer) => this.handleData(data));
        this.socket.on("error", (e) => this.events.emit("socketError", e));
    }

}
