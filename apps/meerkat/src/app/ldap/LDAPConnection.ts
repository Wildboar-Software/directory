import { Context, Vertex, ClientConnection, OperationStatistics } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
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
    LDAPResult,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    BindResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/BindResponse.ta";
import {
    SearchResultEntry,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchResultEntry.ta";
import {
    ExtendedResponse,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/ExtendedResponse.ta";
import {
    LDAPResult_resultCode_success,
    LDAPResult_resultCode_protocolError,
    LDAPResult_resultCode_other,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import { startTLS } from "@wildboar/ldap/src/lib/extensions";
import bind from "./bind";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import ldapRequestToDAPRequest from "../distributed/ldapRequestToDAPRequest";
import dapReplyToLDAPResult from "../distributed/dapReplyToLDAPResult";
import OperationDispatcher from "../distributed/OperationDispatcher";
import dapErrorToLDAPResult from "../distributed/dapErrorToLDAPResult";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import codeToString from "../x500/codeToString";
import getServerStatistics from "../telemetry/getServerStatistics";
import getConnectionStatistics from "../telemetry/getConnectionStatistics";
import {
    SearchRequest_scope_baseObject,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import {
    PartialAttribute,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/PartialAttribute.ta";
import { modifyPassword } from "@wildboar/ldap/src/lib/extensions";

function isRootSubschemaDN (dn: Uint8Array): boolean {
    const dnstr = Buffer.from(dn).toString("utf-8").toLowerCase();
    return [ // Different ways of representing the same DN.
        "2.5.4.3=subschema",
        "cn=subschema",
        "cn=#0C09737562736368656d61",
        "2.5.4.3=#0C09737562736368656d61",
    ].includes(dnstr);
}

/**
 * NOTE: The subschemaSubentry in the Root DSE only points to the subschema
 * subentry that provides schema for the Root DSE. It is not used for other
 * directory entries. For this reason, we don't even need to read anything from
 * the database. And, in fact, it also appears that just returning an empty
 * attribute from the subschema subentry makes Apache Directory Studio stop
 * fussing!
 */
const rootSubschemaPseudoVertexAttributes: PartialAttribute[] = [
    new PartialAttribute(
        Buffer.from("attributeTypes", "utf-8"),
        [ // TODO: Fill in these attribute types.
            // Buffer.from("( 1.3.6.1.4.1.1466.101.120.6 NAME 'altServer' SYNTAX 1.3.6.1.4.1.1466.115.121.1.26 USAGE dSAOperation )", "utf-8"),
            // Buffer.from("( 1.3.6.1.4.1.1466.101.120.5 NAME 'namingContexts' SYNTAX 1.3.6.1.4.1.1466.115.121.1.12 USAGE dSAOperation )", "utf-8"),
            // Buffer.from("( 1.3.6.1.4.1.1466.101.120.13 NAME 'supportedControl' SYNTAX 1.3.6.1.4.1.1466.115.121.1.38 USAGE dSAOperation )", "utf-8"),
            // Buffer.from("", "utf-8"),
            // Buffer.from("", "utf-8"),
            // Buffer.from("", "utf-8"),
            // Buffer.from("", "utf-8"),
            // TODO: namingContexts: naming contexts;
            // TODO: supportedControl: recognized LDAP controls;
            // TODO: supportedExtension: recognized LDAP extended operations;
            // TODO: supportedFeatures: recognized LDAP features;
            // TODO: supportedLDAPVersion: LDAP versions supported; and
            // TODO: supportedSASLMechanisms
        ],
    ),
];

async function handleRequest (
    ctx: Context,
    conn: LDAPConnection,
    message: LDAPMessage,
    stats: OperationStatistics,
): Promise<void> {
    // let toWriteBuffer: Buffer = Buffer.alloc(0);
    // let resultsBuffered: number = 0;
    const onEntry = async (searchResEntry: SearchResultEntry): Promise<void> => {
        const resultMessage = new LDAPMessage(
            message.messageID,
            {
                searchResEntry,
            },
            undefined,
        );
        // resultsBuffered++;
        // toWriteBuffer = Buffer.concat([
        //     toWriteBuffer,
        //     _encode_LDAPMessage(resultMessage, BER).toBytes(),
        // ]);
        // if (resultsBuffered >= 100) {
        //     conn.socket.write(toWriteBuffer);
        //     toWriteBuffer = Buffer.alloc(0);
        // }
        conn.socket.write(_encode_LDAPMessage(resultMessage, BER).toBytes());
    };
    if (
        ("searchRequest" in message.protocolOp)
        && (message.protocolOp.searchRequest.scope === SearchRequest_scope_baseObject)
        && isRootSubschemaDN(message.protocolOp.searchRequest.baseObject)
    ) {
        const entry = new SearchResultEntry(
            message.protocolOp.searchRequest.baseObject,
            rootSubschemaPseudoVertexAttributes,
        );
        await onEntry(entry);
        const res = new LDAPMessage(
            message.messageID,
            {
                searchResDone: new LDAPResult(
                    LDAPResult_resultCode_success,
                    message.protocolOp.searchRequest.baseObject,
                    Buffer.from("Success", "utf-8"),
                    undefined,
                ),
            },
            undefined,
        );
        conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        return;
    }
    const dapRequest = ldapRequestToDAPRequest(ctx, conn, message);
    if (!dapRequest) {
        return;
    }
    if ("present" in dapRequest.invokeId) {
        conn.messageIDToInvokeID.set(message.messageID, dapRequest.invokeId.present);
        conn.invokeIDToMessageID.set(dapRequest.invokeId.present, message.messageID);
    }
    const result = await OperationDispatcher.dispatchDAPRequest(
        ctx,
        conn,
        {
            invokeId: dapRequest.invokeId,
            opCode: dapRequest.opCode,
            argument: dapRequest.argument,
        },
    );
    const unprotectedResult = getOptionallyProtectedValue(result.result);
    const ldapResult = await dapReplyToLDAPResult(ctx, {
        invokeId: dapRequest.invokeId, // TODO: I think this is unnecessary.
        opCode: dapRequest.opCode,
        result: unprotectedResult.result,
    }, message.messageID, onEntry);
    conn.socket.write(_encode_LDAPMessage(ldapResult, BER).toBytes());
    stats.request = result.request ?? stats.request;
    stats.outcome = result.outcome ?? stats.outcome;
    ctx.statistics.operations.push(stats);
}

async function handleRequestAndErrors (
    ctx: Context,
    conn: LDAPConnection,
    message: LDAPMessage,
): Promise<void> {
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(),
        connection: getConnectionStatistics(conn),
        bind: {
            protocol: "ldap",
        },
        request: {
            operationCode: Object.keys(message.protocolOp)[0],
        },
    };
    // const now = new Date();
    // dap.invocations.set(request.invokeID, {
    //     invokeId: request.invokeID,
    //     operationCode: request.opcode,
    //     startTime: new Date(),
    // });
    try {
        await handleRequest(ctx, conn, message, stats);
    } catch (e) {
        ctx.log.error(e.message);
        if (!stats.outcome) {
            stats.outcome = {};
        }
        if (!stats.outcome.error) {
            stats.outcome.error = {};
        }
        if (e instanceof Error) {
            stats.outcome.error.stack = e.stack;
        }
        if (e instanceof errors.DirectoryError) {
            stats.outcome.error.code = codeToString(e.getErrCode());
        }
        const result: LDAPResult | undefined = dapErrorToLDAPResult(e);
        if (!result) {
            return; // No response is returned for abandoned operations in LDAP.
        }
        if ("addRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { addResponse: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("compareRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { compareResponse: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("delRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { delResponse: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modDNRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { modDNResponse: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modifyRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { modifyResponse: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("searchRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { searchResDone: result }, undefined);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("extendedReq" in message.protocolOp) {
            const oid = decodeLDAPOID(message.protocolOp.extendedReq.requestName);
            if (oid.isEqualTo(modifyPassword)) {
                const emptySeq = BERElement.fromSequence([]);
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        extendedResp: new ExtendedResponse(
                            result.resultCode,
                            result.matchedDN,
                            result.diagnosticMessage,
                            result.referral,
                            message.protocolOp.extendedReq.requestName,
                            emptySeq.toBytes(),
                        ),
                    },
                    undefined,
                );
                conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            } else {
                return;
            }
        } else {
            return; // FIXME: Return some other error.
        }
    } finally {
        const invokeID = conn.messageIDToInvokeID.get(message.messageID);
        if (invokeID) {
            conn.invokeIDToMessageID.delete(invokeID);
        }
        conn.messageIDToInvokeID.delete(message.messageID);
        // dap.invocations.set(request.invokeID, {
        //     invokeId: request.invokeID,
        //     operationCode: request.opcode,
        //     startTime: now,
        //     resultTime: new Date(),
        // });
        for (const opstat of ctx.statistics.operations) {
            ctx.telemetry.sendEvent(opstat);
        }
    }
}

export
class LDAPConnection extends ClientConnection {

    private buffer: Buffer = Buffer.alloc(0);
    public boundEntry: Vertex | undefined;

    private handleData (ctx: Context, data: Buffer): void {
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
                if (e instanceof ASN1TruncationError) {
                    return;
                }
                // TODO: Close the connection.
                return;
            }
            let message!: LDAPMessage;
            try {
                message = _decode_LDAPMessage(el);
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:malformed_ldapmessage"));
                return;
            }

            if ("bindRequest" in message.protocolOp) {
                const req = message.protocolOp.bindRequest;
                bind(ctx, this.socket, req)
                    .then(async (bindReturn) => {
                        if (bindReturn.result.resultCode === LDAPResult_resultCode_success) {
                            this.boundEntry = bindReturn.boundVertex;
                            this.authLevel = bindReturn.authLevel;
                        }
                        const res = new LDAPMessage(
                            message.messageID,
                            {
                                bindResponse: bindReturn.result,
                            },
                            undefined,
                        );
                        this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    })
                    .catch((e) => {
                        ctx.log.error(e.message);
                        if ("stack" in e) {
                            ctx.log.error(e.stack);
                        }
                        const res = new LDAPMessage(
                            message.messageID,
                            {
                                bindResponse: new BindResponse(
                                    LDAPResult_resultCode_other,
                                    new Uint8Array(),
                                    Buffer.alloc(0),
                                    undefined,
                                    undefined,
                                ),
                            },
                            undefined,
                        );
                        this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    });
            } else if ("unbindRequest" in message.protocolOp) {
                this.boundEntry = undefined;
                this.authLevel = {
                    basicLevels: new AuthenticationLevel_basicLevels(
                        AuthenticationLevel_basicLevels_level_none,
                        0,
                        false,
                    ),
                };
            } else if (
                ("extendedReq" in message.protocolOp)
                && !decodeLDAPOID(message.protocolOp.extendedReq.requestName).isEqualTo(modifyPassword)
            ) {
                const req = message.protocolOp.extendedReq;
                const oid = decodeLDAPOID(req.requestName);
                if (oid.isEqualTo(startTLS)) {
                    this.socket.removeAllListeners("data");
                    this.buffer = Buffer.alloc(0);
                    this.socket = new tls.TLSSocket(this.socket);
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
                    this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
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
                    this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                }
            } else {
                // Intentional NO_AWAIT
                // If you await this, it will cause a race condition.
                // Specifically, this.buffer will be indeterminate.
                handleRequestAndErrors(ctx, this, message);
            }
            this.buffer = this.buffer.slice(bytesRead);
        }
    }

    constructor (
        readonly ctx: Context,
        readonly tcp: net.Socket,
    ) {
        super();
        this.socket = tcp;
        this.socket.on("data", (data: Buffer): void => {
            this.handleData(ctx, data);
        });
    }

}

export default LDAPConnection;
