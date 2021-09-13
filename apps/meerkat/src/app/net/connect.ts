import type { Context } from "../types";
import * as errors from "../errors";
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
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as net from "net";
import type Connection from "./Connection";
import type { WriteOperationOptions } from "./Connection";
import { EventEmitter } from "stream";
import { IDMConnection } from "@wildboar/idm";
import * as url from "url";
import * as crypto from "crypto";
import { Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1 } from "@wildboar/x500/src/lib/modules/DistributedOperations/Chained-ArgumentType-OPTIONALLY-PROTECTED-Parameter1.ta";
import {
    chainedRead,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    serviceError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/serviceError.oa";
import {
    ServiceErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceErrorData.ta";
import {
    ServiceProblem_timeLimitExceeded,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ServiceProblem.ta";
import createSecurityParameters from "../x500/createSecurityParameters";
import { addMilliseconds, differenceInMilliseconds } from "date-fns";
import { DER } from "asn1-ts/dist/node/functional";

const DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS: number = 15 * 1000;
const DEFAULT_OPERATION_TIMEOUT_IN_SECONDS: number = 3600 * 1000;
const MAX_INVOKE_ID: number = 2147483648;

export
interface ConnectOptions {
    timeLimitInMilliseconds?: number;
    credentials?: DSACredentials,
}

export
async function connect (
    ctx: Context,
    targetSystem: AccessPoint,
    protocolID: OBJECT_IDENTIFIER,
    options?: ConnectOptions,
): Promise<Connection | undefined> {
    const connectionTimeout: number = (options?.timeLimitInMilliseconds ?? DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS);
    const startTime = new Date();
    const timeoutTime = addMilliseconds(startTime, connectionTimeout);
    for (const naddr of targetSystem.address.nAddresses) {
        if ((new Date()) > timeoutTime) {
            return undefined;
        }
        let connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
        if (
            (naddr[0] === 0x54)
            && (naddr[1] === 0x00)
            && (naddr[2] === 0x72)
            && (naddr[3] === 0x87)
            && (naddr[4] === 0x22)
        ) {
            let idm: IDMConnection;
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
                    timeout: connectionTimeRemaining,
                });
                // Credit to: https://github.com/nodejs/node/issues/5757#issuecomment-305969057
                socket.once("connect", () => socket.setTimeout(0));
                idm = new IDMConnection(socket);
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
                                options?.credentials,
                                undefined, // v1
                            ), DER),
                        ),
                    };
                    const encoded = _encode_IDM_PDU(pdu, DER);
                    connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
                    await Promise.race([
                        await new Promise((resolve, reject) => {
                            idm.events.once("bindError", (err) => {
                                reject(err.error);
                            });
                            idm.events.once("bindResult", (result) => {
                                resolve(result);
                            });
                            idm.write(encoded.toBytes(), 0);
                        }),
                        new Promise<void>((resolve, reject) => setTimeout(
                            () => reject(),
                            connectionTimeRemaining,
                        )),
                    ]);
                }
            } catch {
                continue;
            }
            const ret: Connection = {
                writeOperation: async (req: ChainedRequest, options?: WriteOperationOptions): Promise<ChainedResultOrError> => {
                    const invokeID: number = crypto.randomInt(MAX_INVOKE_ID);
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
                    return Promise.race<ChainedResultOrError>([
                        new Promise<ChainedResultOrError>((resolve) => {
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
                        }),
                        new Promise<never>((resolve, reject) => setTimeout(
                            () => {
                                const err = new errors.ServiceError(
                                    `DSA-initiated invocation ${invokeID.toString()} timed out.`,
                                    new ServiceErrorData(
                                        ServiceProblem_timeLimitExceeded,
                                        [],
                                        createSecurityParameters(
                                            ctx,
                                            targetSystem.ae_title.rdnSequence,
                                            undefined,
                                            serviceError["&errorCode"],
                                        ),
                                        ctx.dsa.accessPoint.ae_title.rdnSequence,
                                        undefined,
                                        undefined,
                                    ),
                                );
                                reject(err);
                            },
                            (options?.timeLimitInMilliseconds ?? DEFAULT_OPERATION_TIMEOUT_IN_SECONDS),
                        )),
                    ]);
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
        } else if (naddr[0] === 0xFF) { // It is a long address
            const [ idi, uriString ] = uriFromNSAP(naddr);
            if (idi === 1) {  // It is a non-OSI (IDM, LDAP, etc.)
                const uri = new url.URL(uriString);
                if (uri.protocol.toLowerCase() === "idm") {
                    let idm: IDMConnection;
                    if (!uri.port) {
                        continue;
                    }
                    try {
                        const socket = net.createConnection({
                            host: uri.hostname,
                            port: Number.parseInt(uri.port),
                            timeout: connectionTimeRemaining,
                        });
                        // Credit to: https://github.com/nodejs/node/issues/5757#issuecomment-305969057
                        socket.once("connect", () => socket.setTimeout(0));
                        idm = new IDMConnection(socket);
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
                                        options?.credentials,
                                        undefined, // v1
                                    ), DER),
                                ),
                            };
                            const encoded = _encode_IDM_PDU(pdu, DER);
                            connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
                            await Promise.race([
                                await new Promise((resolve, reject) => {
                                    idm.events.once("bindError", (err) => {
                                        reject(err.error);
                                    });
                                    idm.events.once("bindResult", (result) => {
                                        resolve(result);
                                    });
                                    idm.write(encoded.toBytes(), 0);
                                }),
                                new Promise<void>((resolve, reject) => setTimeout(
                                    () => reject(),
                                    connectionTimeRemaining,
                                )),
                            ]);
                        }
                    } catch {
                        continue;
                    }
                    const ret: Connection = {
                        writeOperation: async (req: ChainedRequest, options?: WriteOperationOptions): Promise<ChainedResultOrError> => {
                            const invokeID: number = crypto.randomInt(MAX_INVOKE_ID);
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
                            return Promise.race<ChainedResultOrError>([
                                new Promise<ChainedResultOrError>((resolve) => {
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
                                }),
                                new Promise<never>((resolve, reject) => setTimeout(
                                    () => {
                                        const err = new errors.ServiceError(
                                            `DSA-initiated invocation ${invokeID.toString()} timed out.`,
                                            new ServiceErrorData(
                                                ServiceProblem_timeLimitExceeded,
                                                [],
                                                createSecurityParameters(
                                                    ctx,
                                                    targetSystem.ae_title.rdnSequence,
                                                    undefined,
                                                    serviceError["&errorCode"],
                                                ),
                                                ctx.dsa.accessPoint.ae_title.rdnSequence,
                                                undefined,
                                                undefined,
                                            ),
                                        );
                                        reject(err);
                                    },
                                    (options?.timeLimitInMilliseconds ?? DEFAULT_OPERATION_TIMEOUT_IN_SECONDS),
                                )),
                            ]);
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
                } // No other address types are supported.
            }
        }
    }
    return undefined;
}

export default connect;
