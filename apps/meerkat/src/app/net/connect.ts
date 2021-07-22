import type { Context } from "../types";
import type {
    AccessPoint,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/AccessPoint.ta";
import {
    IDM_PDU,
    _encode_IDM_PDU,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IDM-PDU.ta";
import {
    IdmBind,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import {
    Request,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Request.ta";
import {
    DSABindArgument,
    _encode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
import type {
    DSACredentials,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSACredentials.ta";
import type { Code } from "@wildboar/x500/src/lib/modules/CommonProtocolSpecification/Code.ta";
import { ASN1Element, DERElement } from "asn1-ts";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as net from "net";
import type Connection from "./Connection";
import { EventEmitter } from "stream";
import { IDMConnection } from "@wildboar/idm";
import * as url from "url";
import * as crypto from "crypto";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";

const DER = () => new DERElement();

export
async function connect (
    ctx: Context,
    targetSystem: AccessPoint,
    credentials?: DSACredentials,
): Promise<Connection | undefined> {
    for (const naddr of targetSystem.address.nAddresses) {
        if (
            (naddr[0] === 0x54)
            && (naddr[1] === 0x00)
            && (naddr[2] === 0x72)
            && (naddr[3] === 0x87)
            && (naddr[4] === 0x22)
        ) {
            try {
                const [ type, ipv4, port ] = ipv4FromNSAP(naddr);
                if (!port) {
                    continue;
                }
                if (type !== 0x10) {
                    continue; // Only IDM addresses are currently supported.
                }
                const socket = net.createConnection({
                    host: ipv4.join("."),
                    port,
                });
                const idm = new IDMConnection(socket);
                { // Bind
                    const pdu: IDM_PDU = {
                        bind: new IdmBind(
                            dop_ip["&id"]!,
                            {
                                directoryName: ctx.dsa.accessPoint.ae_title,
                            },
                            {
                                directoryName: targetSystem.ae_title,
                            },
                            _encode_DSABindArgument(new DSABindArgument(
                                credentials,
                                undefined, // v1
                            ), DER),
                        ),
                    };
                    const encoded = _encode_IDM_PDU(pdu, DER);
                    await new Promise((resolve, reject) => {
                        idm.events.once("bindError", (err) => {
                            reject(err.error);
                        });
                        idm.events.once("bindResult", (result) => {
                            resolve(result);
                        });
                        socket.write(encoded.toBytes());
                    });
                }
                const ret: Connection = {
                    writeOperation: async (code: Code, parameters: ASN1Element): Promise<ASN1Element> => {
                        const invokeID: number = crypto.randomInt(4294967295);
                        const pdu: IDM_PDU = {
                            request: new Request(invokeID, code, parameters),
                        };
                        const encoded = _encode_IDM_PDU(pdu, DER);
                        return new Promise((resolve, reject) => {
                            idm.events.on(invokeID.toString(), ([ error, result ]) => {
                                if (error) {
                                    reject([ error.errcode, error.error ]);
                                } else {
                                    resolve(result!.result);
                                }
                            });
                            socket.write(encoded.toBytes());
                        });
                    },
                    close: async (): Promise<void> => {
                        idm.close();
                    },
                    events: new EventEmitter(),
                };
                const HANDLE_ERROR = () => {
                    ret.events.emit("error", undefined);
                };
                idm.events.on("error_", HANDLE_ERROR);
                idm.events.on("reject", HANDLE_ERROR);
                idm.events.on("abort", HANDLE_ERROR);
                return ret;
            } catch {
                continue;
            }
        } else if (naddr[0] === 0xFF) { // It is a long address
            const [ idi, uriString ] = uriFromNSAP(naddr);
            if (idi === 1) {  // It is a non-OSI (IDM, LDAP, etc.)
                const uri = new url.URL(uriString);
                if (uri.protocol.toLowerCase() === "idm") {
                    try {
                        if (!uri.port) {
                            continue;
                        }
                        const socket = net.createConnection({
                            host: uri.hostname,
                            port: Number.parseInt(uri.port),
                        });
                        const idm = new IDMConnection(socket);
                        const ret: Connection = {
                            writeOperation: async (code: Code, parameters: ASN1Element): Promise<ASN1Element> => {
                                const invokeID: number = crypto.randomInt(4294967296);
                                const pdu: IDM_PDU = {
                                    request: new Request(invokeID, code, parameters),
                                };
                                const encoded = _encode_IDM_PDU(pdu, () => new DERElement());
                                return new Promise((resolve, reject) => {
                                    idm.events.on(invokeID.toString(), ([ error, result ]) => {
                                        if (error) {
                                            reject([ error.errcode, error.error ]);
                                        } else {
                                            resolve(result!.result);
                                        }
                                    });
                                    socket.write(encoded.toBytes());
                                });
                            },
                            close: async (): Promise<void> => {
                                idm.close();
                            },
                            events: new EventEmitter(),
                        };
                        const HANDLE_ERROR = () => {
                            ret.events.emit("error", undefined);
                        };
                        idm.events.on("bindResult", () => {
                            ret.events.emit("connect", undefined);
                        });
                        idm.events.on("bindError", () => {
                            ret.events.emit("error", undefined);
                        });
                        idm.events.on("result", (result) => {
                            ret.events.emit("response", [ result.opcode, result.result ]);
                        });
                        idm.events.on("error_", HANDLE_ERROR);
                        idm.events.on("reject", HANDLE_ERROR);
                        idm.events.on("abort", HANDLE_ERROR);
                        return ret;
                    } catch {
                        continue;
                    }
                } // No other address types are supported.
            }
        }
    }
    return undefined;
}

export default connect;
