import type { Context } from "../types";
import * as net from "net";
import { BERElement, ASN1TruncationError } from "asn1-ts";
import { BER } from "asn1-ts/dist/node/functional";
import {
    LDAPMessage,
    _decode_LDAPMessage,
    _encode_LDAPMessage,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    SearchResultDone,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultDone.ta";
import {
    LDAPResult,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    SearchResultEntry,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    PartialAttribute,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import {
    BindResponse,
} from "@wildboar/x500/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindResponse.ta";

/**
 * How this will work:
 * convert DN to string
 * findEntry
 * for each attribute, look up the spec.
 * If an LDAP syntax is present, convert that type to LDAP output
 */
export class LDAPConnection {

    private buffer: Buffer = Buffer.alloc(0);

    constructor (
        readonly ctx: Context,
        readonly c: net.Socket,
    ) {
        c.on("data", (data: Buffer): void => {
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

            console.log(message.protocolOp);
            if ("bindRequest" in message.protocolOp) {
                const req = message.protocolOp.bindRequest;
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        bindResponse: new BindResponse(
                            0, // Success
                            Buffer.from("cn=Jonathan Wilbur", "utf-8"),
                            Buffer.from("Success", "utf-8"),
                            undefined,
                            undefined,
                        ),
                    },
                    undefined,
                );
                this.c.write(_encode_LDAPMessage(res, BER).toBytes());
            } else if ("searchRequest" in message.protocolOp) {
                const req = message.protocolOp.searchRequest;
                if (req.baseObject.length === 0) {
                    const rootDSERes = new LDAPMessage(
                        message.messageID,
                        {
                            searchResEntry: new SearchResultEntry(
                                Buffer.from("cn=Jonathan Wilbur", "utf-8"),
                                [
                                    new PartialAttribute(
                                        Buffer.from("supportedLDAPVersion", "utf-8"),
                                        [
                                            Buffer.from([ 0x03 ]),
                                        ],
                                    ),
                                ],
                            ),
                        },
                        undefined,
                    );
                    this.c.write(_encode_LDAPMessage(rootDSERes, BER).toBytes());
                    const doneRes = new LDAPMessage(
                        message.messageID,
                        {
                            searchResDone: new LDAPResult(
                                0, // Success
                                Buffer.from("cn=Jonathan Wilbur", "utf-8"),
                                Buffer.from("Success", "utf-8"),
                                undefined,
                            ),
                        },
                        undefined,
                    );
                    this.c.write(_encode_LDAPMessage(doneRes, BER).toBytes());
                } else {
                    const entryRes = new LDAPMessage(
                        message.messageID,
                        {
                            searchResEntry: new SearchResultEntry(
                                Buffer.from("cn=Jonathan Wilbur", "utf-8"),
                                [
                                    new PartialAttribute(
                                        Buffer.from("cn", "utf-8"),
                                        [
                                            Buffer.from("Jonathan Wilbur", "utf-8"),
                                        ],
                                    ),
                                    new PartialAttribute(
                                        Buffer.from("gn", "utf-8"),
                                        [
                                            Buffer.from("Jonathan", "utf-8"),
                                        ],
                                    ),
                                    new PartialAttribute(
                                        Buffer.from("sn", "utf-8"),
                                        [
                                            Buffer.from("Wilbur", "utf-8"),
                                        ],
                                    ),
                                ],
                            ),
                        },
                        undefined,
                    );
                    this.c.write(_encode_LDAPMessage(entryRes, BER).toBytes());
                    const doneRes = new LDAPMessage(
                        message.messageID,
                        {
                            searchResDone: new LDAPResult(
                                0, // Success
                                Buffer.from("cn=Jonathan Wilbur", "utf-8"),
                                Buffer.from("Success", "utf-8"),
                                undefined,
                            ),
                        },
                        undefined,
                    );
                    this.c.write(_encode_LDAPMessage(doneRes, BER).toBytes());
                }
            } else if ("abandonRequest" in message.protocolOp) {
                console.log(`Abandon operation ${message.messageID}`);
            } else {
                throw new Error(JSON.stringify(message.protocolOp));
            }
            this.buffer = this.buffer.slice(bytesRead);
        });
    }

}

export default LDAPConnection;
