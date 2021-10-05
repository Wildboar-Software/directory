import * as net from "net";
import * as tls from "tls";
import { BER } from "asn1-ts/dist/node/functional";
import { BERElement, ObjectIdentifier } from "asn1-ts";
import {
    LDAPMessage,
    _decode_LDAPMessage,
    _encode_LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import { EventEmitter } from "events";
import type LDAPSocketOptions from "./LDAPSocketOptions";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import { startTLS } from "@wildboar/ldap/src/lib/extensions";
import {
    ExtendedResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
import {
    LDAPResult_resultCode_success,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";

export
class LDAPSocket extends EventEmitter {

    public socket!: net.Socket | tls.TLSSocket;
    private buffer: Buffer = Buffer.alloc(0);
    private asn1Errors: number = 0;

    public startTLS (socket: tls.TLSSocket): void {
        if (this.socket instanceof tls.TLSSocket) {
            throw new Error();
        }
        this.socket.removeAllListeners("data");
        this.socket = socket;
        this.buffer = Buffer.alloc(0);
    }

    private handleData (data: Buffer): void {
        this.buffer = Buffer.concat([
            this.buffer,
            data,
        ]);
        while (this.buffer.length > 0) {
            const el = new BERElement();
            let bytesRead = 0;
            try {
                bytesRead = el.fromBytes(this.buffer);
            } catch (e) {
                this.asn1Errors++;
                if (
                    this.options?.asn1ErrorBudget
                    && (this.asn1Errors > this.options.asn1ErrorBudget)
                ) {
                    this.socket.end();
                }
                return;
            }
            let message!: LDAPMessage;
            try {
                message = _decode_LDAPMessage(el);
            } catch (e) {
                this.emit("malformed", el);
                return;
            }
            this.emit("message", message);
            this.emit(message.messageID.toString(), message);
            this.buffer = this.buffer.slice(bytesRead);
            if (this.buffer.length === 0) {
                this.emit("drain");
            }
            if ("extendedReq" in message.protocolOp) {
                // TODO: Error if already using TLS.
                const req = message.protocolOp.extendedReq;
                const oid = decodeLDAPOID(req.requestName);
                if (!oid.isEqualTo(startTLS)) {
                    return;
                }
                this.startTLS(new tls.TLSSocket(this.socket, this.options));
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        extendedResp: new ExtendedResponse(
                            LDAPResult_resultCode_success,
                            Buffer.alloc(0),
                            // No diagnostic text to avoid any information disclosure.
                            Buffer.alloc(0),
                            undefined,
                            encodeLDAPOID(new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 20037 ])),
                            undefined,
                        ),
                    },
                    undefined,
                );
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            }
        }
    }

    public writeMessage (message: LDAPMessage): number {
        const bytes = _encode_LDAPMessage(message, BER).toBytes();
        this.socket.write(bytes);
        return bytes.length;
    }

    public close (): void {
        this.socket.end();
    }

    constructor (
        socket: net.Socket | tls.TLSSocket,
        readonly options?: LDAPSocketOptions,
    ) {
        super();
        this.socket = socket;
        this.socket.on("connect", () => this.emit("connect"));
        this.socket.on("close", () => this.emit("close"));
        this.socket.on("error", (e) => this.emit("error", e));
        this.socket.on("timeout", () => this.emit("timeout"));
        this.socket.on("data", (data: Buffer): void => this.handleData(data));
    }

}

export default LDAPSocket;
