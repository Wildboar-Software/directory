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
import type { Chained } from "@wildboar/x500/src/lib/types/Chained";
import type { ChainedRequest } from "@wildboar/x500/src/lib/types/ChainedRequest";
import type { ChainedResultOrError } from "@wildboar/x500/src/lib/types/ChainedResultOrError";
import type { ResultOrError } from "@wildboar/x500/src/lib/types/ResultOrError";
import { DERElement, OBJECT_IDENTIFIER } from "asn1-ts";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as net from "net";
import type Connection from "./Connection";
import { EventEmitter } from "stream";
import { IDMConnection } from "@wildboar/idm";
import * as url from "url";
import * as crypto from "crypto";
import { Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 } from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    chainedRead,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

const DER = () => new DERElement();

export
async function connect (
    ctx: Context,
    targetSystem: AccessPoint,
    protocolID: OBJECT_IDENTIFIER,
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
                            protocolID,
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
                        idm.write(encoded.toBytes(), 0);
                    });
                }
                const ret: Connection = {
                    writeOperation: async (req: ChainedRequest): Promise<ChainedResultOrError> => {
                        const invokeID: number = crypto.randomInt(2147483648);
                        const param: Chained = {
                            unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                                req.chaining,
                                req.argument!,
                            ),
                        };
                        const encodedParam = chainedRead.encoderFor["&ArgumentType"]!(param, DER);
                        const pdu: IDM_PDU = {
                            request: new Request(invokeID, req.opCode, encodedParam),
                        };
                        const encoded = _encode_IDM_PDU(pdu, DER);
                        return new Promise((resolve) => {
                            idm.events.on(invokeID.toString(), (roe: ResultOrError) => {
                                if ("error" in roe) {
                                    resolve(roe);
                                } else {
                                    const result = chainedRead.decoderFor["&ResultType"]!(roe.result!);
                                    // TODO: Verify signature.
                                    const resultData = getOptionallyProtectedValue(result);
                                    resolve({
                                        invokeId: {
                                            present: invokeID,
                                        },
                                        opCode: req.opCode,
                                        chaining: resultData.chainedResult,
                                        result: resultData.result,
                                    });
                                }
                            });
                            idm.write(encoded.toBytes(), 0);
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
                            writeOperation: async (req: ChainedRequest): Promise<ChainedResultOrError> => {
                                const invokeID: number = crypto.randomInt(4294967296);
                                const param: Chained = {
                                    unsigned: new Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(
                                        req.chaining,
                                        req.argument!,
                                    ),
                                };
                                const encodedParam = chainedRead.encoderFor["&ArgumentType"]!(param, DER);
                                const pdu: IDM_PDU = {
                                    request: new Request(invokeID, req.opCode, encodedParam),
                                };
                                const encoded = _encode_IDM_PDU(pdu, () => new DERElement());
                                return new Promise((resolve) => {
                                    idm.events.on(invokeID.toString(), (roe: ResultOrError) => {
                                        if ("error" in roe) {
                                            resolve(roe);
                                        } else {
                                            const result = chainedRead.decoderFor["&ResultType"]!(roe.result!);
                                            // TODO: Verify signature.
                                            const resultData = getOptionallyProtectedValue(result);
                                            resolve({
                                                invokeId: {
                                                    present: invokeID,
                                                },
                                                opCode: req.opCode,
                                                chaining: resultData.chainedResult,
                                                result: resultData.result,
                                            });
                                        }
                                    });
                                    idm.write(encoded.toBytes(), 0);
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
