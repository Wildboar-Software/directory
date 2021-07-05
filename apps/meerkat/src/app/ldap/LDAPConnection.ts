import type { Context, Entry } from "../types";
import * as net from "net";
import * as tls from "tls";
import { BERElement, ASN1TruncationError, ObjectIdentifier } from "asn1-ts";
import { BER } from "asn1-ts/dist/node/functional";
import {
    LDAPMessage,
    _decode_LDAPMessage,
    _encode_LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    ExtendedResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_protocolError,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    AuthenticationLevel_basicLevels_level,
    AuthenticationLevel_basicLevels_level_none,
    AuthenticationLevel_basicLevels_level_simple,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import add from "./operations/add";
import bind from "./operations/bind";
import compare from "./operations/compare";
import del from "./operations/del";
import modDN from "./operations/modDN";
import modify from "./operations/modify";
import search from "./operations/search";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import decodeLDAPDN from "./decodeLDAPDN";
import findEntry from "../x500/findEntry";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";

export class LDAPConnection {

    private buffer: Buffer = Buffer.alloc(0);
    public boundEntry: Entry | undefined;
    public authLevel: AuthenticationLevel_basicLevels_level = AuthenticationLevel_basicLevels_level_none;
    private connection!: net.Socket;

    private async handleData (ctx: Context, data: Buffer): Promise<void> {
        this.buffer = Buffer.concat([
            this.buffer,
            data,
        ]);
        const el = new BERElement();
        let bytesRead = 0;
        try {
            bytesRead = el.fromBytes(this.buffer);
        } catch (e) {
            if (e instanceof ASN1TruncationError) {
                return;
            }
            // TODO: Close the connection.
            console.error("Malformed BER value.");
            return;
        }
        let message!: LDAPMessage;
        try {
            message = _decode_LDAPMessage(el);
        } catch (e) {
            console.error("Malformed LDAPMessage.");
            return;
        }

        if ("bindRequest" in message.protocolOp) {
            const req = message.protocolOp.bindRequest;
            const result = await bind(ctx, req);
            if (result.resultCode === LDAPResult_resultCode_success) {
                const dn = decodeLDAPDN(ctx, req.name);
                this.boundEntry = findEntry(ctx, ctx.database.data.dit, dn, true);
                // Currently, there is no way to achieve strong auth using LDAP.
                this.authLevel = AuthenticationLevel_basicLevels_level_simple;
            }
            const res = new LDAPMessage(
                message.messageID,
                {
                    bindResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("unbindRequest" in message.protocolOp) {
            this.boundEntry = undefined;
            this.authLevel = AuthenticationLevel_basicLevels_level_none;
        } else if ("addRequest" in message.protocolOp) {
            const req = message.protocolOp.addRequest;
            const result = await add(ctx, this, req);
            ctx.log.info(`Created entry ${Buffer.from(req.entry).toString("utf-8")}.`);
            const res = new LDAPMessage(
                message.messageID,
                {
                    addResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("compareRequest" in message.protocolOp) {
            const req = message.protocolOp.compareRequest;
            const result = await compare(ctx, this, req);
            const res = new LDAPMessage(
                message.messageID,
                {
                    compareResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("delRequest" in message.protocolOp) {
            const req = message.protocolOp.delRequest;
            const result = await del(ctx, this, req);
            const res = new LDAPMessage(
                message.messageID,
                {
                    delResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modDNRequest" in message.protocolOp) {
            const req = message.protocolOp.modDNRequest;
            const result = await modDN(ctx, this, req);
            const res = new LDAPMessage(
                message.messageID,
                {
                    modDNResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modifyRequest" in message.protocolOp) {
            const req = message.protocolOp.modifyRequest;
            const result = await modify(ctx, this, req);
            const res = new LDAPMessage(
                message.messageID,
                {
                    modifyResponse: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("searchRequest" in message.protocolOp) {
            const req = message.protocolOp.searchRequest;
            const onEntry = async (entry: SearchResultEntry): Promise<void> => {
                const entryRes = new LDAPMessage(
                    message.messageID,
                    {
                        searchResEntry: entry,
                    },
                    undefined,
                );
                this.c.write(_encode_LDAPMessage(entryRes, BER).toBytes());
            };
            const result = await search(ctx, this, req, onEntry);
            const doneRes = new LDAPMessage(
                message.messageID,
                {
                    searchResDone: result,
                },
                undefined,
            );
            this.c.write(_encode_LDAPMessage(doneRes, BER).toBytes());
        } else if ("abandonRequest" in message.protocolOp) {
            console.log(`Abandon operation ${message.messageID}`);
        } else if ("extendedReq" in message.protocolOp) {
            const req = message.protocolOp.extendedReq;
            const oid = decodeLDAPOID(req.requestName);
            if (oid.toString() === "1.3.6.1.4.1.1466.20037") { // StartTLS
                this.connection.removeAllListeners("data");
                this.buffer = Buffer.alloc(0);
                this.connection = new tls.TLSSocket(this.connection);
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        extendedResp: new ExtendedResponse(
                            LDAPResult_resultCode_success,
                            Buffer.alloc(0),
                            Buffer.from("STARTTLS initiated.", "utf-8"),
                            undefined,
                            encodeLDAPOID(new ObjectIdentifier([ 1, 3, 6, 1, 4, 1, 1466, 20037 ])),
                            undefined,
                        ),
                    },
                    undefined,
                );
                this.c.write(_encode_LDAPMessage(res, BER).toBytes());
            } else {
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        extendedResp: new ExtendedResponse(
                            LDAPResult_resultCode_protocolError,
                            Buffer.alloc(0),
                            Buffer.from("Extended operation not understood.", "utf-8"),
                            undefined,
                            undefined,
                            undefined,
                        ),
                    },
                    undefined,
                );
                this.c.write(_encode_LDAPMessage(res, BER).toBytes());
            }
        } else {
            throw new Error(JSON.stringify(message.protocolOp));
        }
        this.buffer = this.buffer.slice(bytesRead);
    }

    constructor (
        readonly ctx: Context,
        readonly c: net.Socket,
    ) {
        this.connection = c;
        this.connection.on("data", async (data: Buffer): Promise<void> => {
            this.handleData(ctx, data);
        });
    }

}

export default LDAPConnection;
