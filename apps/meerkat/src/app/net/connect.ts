import type { Context, OperationStatistics } from "../types";
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
import type { OBJECT_IDENTIFIER, INTEGER, ASN1Element } from "asn1-ts";
import { ipv4FromNSAP } from "@wildboar/x500/src/lib/distributed/ipv4";
import { uriFromNSAP } from "@wildboar/x500/src/lib/distributed/uri";
import * as net from "net";
import * as tls from "tls";
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
import getServerStatistics from "../telemetry/getServerStatistics";
import codeToString from "../x500/codeToString";
import { LDAPSocket } from "@wildboar/ldap-socket";
import {
    LDAPMessage,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPMessage.ta";
import {
    LDAPResult_resultCode_success,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult-resultCode.ta";
import {
    BindRequest,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindRequest.ta";
import {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    SearchResultReference,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultReference.ta";
import encodeLDAPDN from "../ldap/encodeLDAPDN";
import { strict as assert } from "assert";
import dapRequestToLDAPRequest from "../distributed/dapRequestToLDAPRequest";
import {
    ldapResponseToAddEntryResult,
    ldapResponseToCompareResult,
    ldapResponseToListResult,
    ldapResponseToModifyDNResult,
    ldapResponseToModifyEntryResult,
    ldapResponseToReadResult,
    ldapResponseToRemoveEntryResult,
    ldapResponseToSearchResult,
} from "../distributed/ldapResultToDAPReply";
import compareCode from "@wildboar/x500/src/lib/utils/compareCode";
import { addEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/addEntry.oa";
import { compare } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/compare.oa";
import { list } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/list.oa";
import { modifyDN } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyDN.oa";
import { modifyEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/modifyEntry.oa";
import { read } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/read.oa";
import { removeEntry } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/removeEntry.oa";
import { search } from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/search.oa";
import emptyChainingResults from "../x500/emptyChainingResults";
import {
    EntryInformationSelection_infoTypes_attributeTypesOnly as typesOnly,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/EntryInformationSelection-infoTypes.ta";

const DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS: number = 15 * 1000;
const DEFAULT_OPERATION_TIMEOUT_IN_SECONDS: number = 3600 * 1000;
const MAX_INVOKE_ID: number = 2147483648;
const LDAP_VERSION_3: INTEGER = 3;

export
interface ConnectOptions {
    timeLimitInMilliseconds?: number;
    credentials?: DSACredentials,
    tlsOptional?: boolean;
}

function getIDMOperationWriter (
    ctx: Context,
    idm: IDMConnection,
    targetSystem: AccessPoint,
): Connection["writeOperation"] {
    return async function (req: ChainedRequest, options?: WriteOperationOptions): Promise<ChainedResultOrError> {
        const opstat: OperationStatistics = {
            type: "op",
            inbound: false,
            server: getServerStatistics(),
            connection: {
                remoteAddress: idm.s.remoteAddress,
                remoteFamily: idm.s.remoteFamily,
                remotePort: idm.s.remotePort,
                transport: "IDMv2",
            },
            request: {
                operationCode: codeToString(req.opCode),
            },
            outcome: {},
        };
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
        const ret = await Promise.race<ChainedResultOrError>([
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
        if ("error" in ret) {
            opstat.outcome!.error = {
                code: ret.errcode
                    ? codeToString(ret.errcode)
                    : undefined,
            };
        } else {
            opstat.outcome!.result = {
                sizeInBytes: ret.result?.value.length,
            };
        }
        ctx.telemetry.sendEvent(opstat);
        return ret;
    };
}

function getLDAPOperationWriter (
    ctx: Context,
    socket: LDAPSocket,
): Connection["writeOperation"] {
    return async (
        req: Omit<ChainedRequest, "invokeId">,
        options?: WriteOperationOptions,
    ): Promise<ChainedResultOrError> => {
        const connectionTimeout: number = (
            options?.timeLimitInMilliseconds
            ?? DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS
        );
        const invokeId = {
            present: 1, // This does not matter. It's just for type safety at this point.
        };
        const ldapRequest = dapRequestToLDAPRequest(ctx, {
            ...req,
            invokeId,
        });
        const result: ASN1Element = await Promise.race<ASN1Element>([
            new Promise<ASN1Element>((resolve, reject) => {
                const searchResults: SearchResultEntry[] = [];
                const searchRefs: SearchResultReference[] = [];
                // This listener cannot be .once(), because a message ID may be used multiple times
                // to return results for a search request.
                socket.on(ldapRequest.messageID.toString(), (message: LDAPMessage) => {
                    if (compareCode(req.opCode, addEntry["&operationCode"]!)) {
                        if (!("addResponse" in message.protocolOp)) {
                            reject(new Error());
                            return;
                        }
                        const result = ldapResponseToAddEntryResult(message.protocolOp.addResponse);
                        resolve(addEntry.encoderFor["&ResultType"]!(result, DER));
                        return;
                    }
                    else if (compareCode(req.opCode, compare["&operationCode"]!)) {
                        if (!("compareResponse" in message.protocolOp)) {
                            reject(new Error());
                            return;
                        }
                        const result = ldapResponseToCompareResult(ctx, message.protocolOp.compareResponse);
                        resolve(compare.encoderFor["&ResultType"]!(result, DER));
                        return;
                    }
                    else if (compareCode(req.opCode, list["&operationCode"]!)) {
                        if ("searchResEntry" in message.protocolOp) {
                            searchResults.push(message.protocolOp.searchResEntry);
                        } else if ("searchResRef" in message.protocolOp) {
                            searchRefs.push(message.protocolOp.searchResRef);
                        } else if ("searchResDone" in message.protocolOp) {
                            const result = ldapResponseToListResult(
                                ctx,
                                message.protocolOp.searchResDone,
                                searchResults,
                                searchRefs,
                            );
                            resolve(list.encoderFor["&ResultType"]!(result, DER));
                            return;
                        } else {
                            reject(new Error());
                            return;
                        }
                    }
                    else if (compareCode(req.opCode, modifyDN["&operationCode"]!)) {
                        if (!("modDNResponse" in message.protocolOp)) {
                            reject(new Error());
                            return;
                        }
                        const result = ldapResponseToModifyDNResult(message.protocolOp.modDNResponse);
                        resolve(modifyDN.encoderFor["&ResultType"]!(result, DER));
                        return;
                    }
                    else if (compareCode(req.opCode, modifyEntry["&operationCode"]!)) {
                        if (!("modifyResponse" in message.protocolOp)) {
                            reject(new Error());
                            return;
                        }
                        const result = ldapResponseToModifyEntryResult(message.protocolOp.modifyResponse);
                        resolve(modifyEntry.encoderFor["&ResultType"]!(result, DER));
                        return;
                    }
                    else if (compareCode(req.opCode, read["&operationCode"]!)) {
                        if ("searchResEntry" in message.protocolOp) {
                            searchResults.push(message.protocolOp.searchResEntry);
                        } else if ("searchResRef" in message.protocolOp) {
                            searchRefs.push(message.protocolOp.searchResRef);
                        } else if ("searchResDone" in message.protocolOp) {
                            if (searchResults.length !== 1) {
                                reject(new Error());
                                return;
                            }
                            const result = ldapResponseToReadResult(
                                ctx,
                                searchResults[0],
                                message.protocolOp.searchResDone,
                            );
                            resolve(read.encoderFor["&ResultType"]!(result, DER));
                            return;
                        } else {
                            reject(new Error());
                            return;
                        }
                    }
                    else if (compareCode(req.opCode, removeEntry["&operationCode"]!)) {
                        if (!("delResponse" in message.protocolOp)) {
                            reject(new Error());
                            return;
                        }
                        const result = ldapResponseToRemoveEntryResult(message.protocolOp.delResponse);
                        resolve(removeEntry.encoderFor["&ResultType"]!(result, DER));
                        return;
                    }
                    else if (compareCode(req.opCode, search["&operationCode"]!)) {
                        const arg = search.decoderFor["&ArgumentType"]!(req.argument!);
                        const data = getOptionallyProtectedValue(arg);
                        if ("searchResEntry" in message.protocolOp) {
                            searchResults.push(message.protocolOp.searchResEntry);
                        } else if ("searchResRef" in message.protocolOp) {
                            searchRefs.push(message.protocolOp.searchResRef);
                        } else if ("searchResDone" in message.protocolOp) {
                            const result = ldapResponseToSearchResult(
                                ctx,
                                (data.selection?.infoTypes === typesOnly),
                                message.protocolOp.searchResDone,
                                searchResults,
                                searchRefs,
                            );
                            resolve(search.encoderFor["&ResultType"]!(result, DER));
                            return;
                        } else {
                            reject(new Error());
                            return;
                        }
                    } else {
                        reject(new Error());
                        return;
                    }
                });
                socket.writeMessage(ldapRequest);
            }),
            new Promise<ASN1Element>((_, reject) => setTimeout(reject, connectionTimeout)),
        ]);
        return {
            invokeId,
            opCode: req.opCode,
            result,
            chaining: emptyChainingResults(),
        };
    }
}

function *createBindRequests (
    ctx: Context,
    credentials?: DSACredentials,
): IterableIterator<BindRequest> {
    if (credentials && ("simple" in credentials)) {
        if (!credentials.simple.password) {
            yield new BindRequest(
                LDAP_VERSION_3,
                encodeLDAPDN(ctx, credentials.simple.name),
                {
                    simple: new Uint8Array(),
                },
            );
        } else if ("unprotected" in credentials.simple.password) {
            yield new BindRequest(
                LDAP_VERSION_3,
                encodeLDAPDN(ctx, credentials.simple.name),
                {
                    simple: credentials.simple.password.unprotected,
                },
            );
        } else if (
            ("userPwd" in credentials.simple.password)
            && ("clear" in credentials.simple.password.userPwd)
        ) {
            yield new BindRequest(
                LDAP_VERSION_3,
                encodeLDAPDN(ctx, credentials.simple.name),
                {
                    simple: Buffer.from(credentials.simple.password.userPwd.clear, "utf-8"),
                },
            );
        }
    }
    return new BindRequest(
        LDAP_VERSION_3,
        new Uint8Array(),
        {
            simple: new Uint8Array(),
        },
    );
}

async function connectToLDAP (
    ctx: Context,
    uri: url.URL,
    options?: ConnectOptions,
): Promise<Connection | null> {
    const connectionTimeout: number = (options?.timeLimitInMilliseconds ?? DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS);
    const startTime = new Date();
    const timeoutTime = addMilliseconds(startTime, connectionTimeout);
    let connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
    let ldapConn!: LDAPSocket;
    if (!uri.port) {
        return null;
    }
    try {
        const socket = net.createConnection({
            host: uri.hostname,
            port: Number.parseInt(uri.port),
            timeout: connectionTimeRemaining,
        });
        ldapConn = new LDAPSocket(socket);
        await Promise.race<void>([
            new Promise<void>((resolve, reject) => {
                ldapConn.on("connect", resolve);
                ldapConn.on("error", reject);
                ldapConn.on("timeout", reject);
                ldapConn.on("close", reject);
            }),
            new Promise<void>((_, reject) => setTimeout(reject, connectionTimeRemaining)),
        ]);
        // By now, a TCP socket is established.
        let messageID: number = 0;
        for (const bindRequest of createBindRequests(ctx, options?.credentials)) {
            messageID++;
            connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
            try { // Bind
                await Promise.race<void>([
                    new Promise<void>((resolve, reject) => {
                        ldapConn.once(messageID.toString(), (message: LDAPMessage) => {
                            assert(message.messageID === messageID);
                            if (
                                !("bindResponse" in message.protocolOp)
                                || (message.protocolOp.bindResponse.resultCode !== LDAPResult_resultCode_success)
                            ) {
                                reject();
                                return;
                            }
                            resolve();
                        });
                        const req = new LDAPMessage(
                            messageID,
                            {
                                bindRequest,
                            },
                            undefined,
                        );
                        ldapConn.writeMessage(req);
                    }),
                    new Promise<void>((_, reject) => setTimeout(reject, connectionTimeRemaining)),
                ]);
            } catch {
                continue;
            }
            messageID++;
            connectionTimeRemaining = differenceInMilliseconds(timeoutTime, new Date());
            try { // STARTTLS
                const req = new LDAPMessage(
                    messageID,
                    {
                        bindRequest,
                    },
                    undefined,
                );
                await Promise.race<void>([
                    new Promise<void>((resolve, reject) => {
                        ldapConn.once(messageID.toString(), (message: LDAPMessage) => {
                            assert(message.messageID === messageID);
                            if (
                                !("extendedResp" in message.protocolOp)
                                || (message.protocolOp.extendedResp.resultCode !== LDAPResult_resultCode_success)
                            ) {
                                reject();
                                return;
                            } else {
                                const tlsSocket = new tls.TLSSocket(socket);
                                ldapConn.startTLS(tlsSocket);
                                tlsSocket.on("secureConnect", resolve);
                            }
                        });
                        ldapConn.writeMessage(req);
                    }),
                    new Promise<void>((_, reject) => setTimeout(reject, connectionTimeRemaining)),
                ]);
            } catch {
                if (!options?.tlsOptional) {
                    continue;
                }
            }
            // If we made it here, one of our authentication attempts worked, and STARTTLS worked or wasn't required.
            const ret: Connection = {
                writeOperation: getLDAPOperationWriter(ctx, ldapConn),
                close: async (): Promise<void> => {
                    ldapConn.close();
                },
                events: new EventEmitter(),
            };
            return ret;
        }
    } catch {
        return null;
    }
    return null;
}

// TODO: connectToLDAPS() (once connectToLDAP() has been tested)

export
async function connect (
    ctx: Context,
    targetSystem: AccessPoint,
    protocolID: OBJECT_IDENTIFIER,
    options?: ConnectOptions,
): Promise<Connection | null> {
    const connectionTimeout: number = (options?.timeLimitInMilliseconds ?? DEFAULT_CONNECTION_TIMEOUT_IN_SECONDS);
    const startTime = new Date();
    const timeoutTime = addMilliseconds(startTime, connectionTimeout);
    for (const naddr of targetSystem.address.nAddresses) {
        if ((new Date()) > timeoutTime) {
            return null;
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
                        new Promise<void>((_, reject) => setTimeout(reject, connectionTimeRemaining)),
                    ]);
                }
            } catch {
                continue;
            }
            const ret: Connection = {
                writeOperation: getIDMOperationWriter(ctx, idm, targetSystem),
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
                if (uri.protocol.toLowerCase() === "idm") { // TODO: Handle IDMS
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
                        writeOperation: getIDMOperationWriter(ctx, idm, targetSystem),
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
                } else if (uri.protocol.toLowerCase() === "ldap") {
                    return connectToLDAP(ctx, uri, options);
                } if (uri.protocol.toLowerCase() === "ldaps") {
                    return null; // TODO: Support LDAPS
                }
                // No other address types are supported.
            }
        }
    }
    return null;
}

export default connect;
