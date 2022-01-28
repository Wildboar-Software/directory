import { Context, Vertex, ClientAssociation, OperationStatistics } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import * as net from "net";
import * as tls from "tls";
import { BERElement, ASN1TruncationError } from "asn1-ts";
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
    LDAPResult_resultCode_operationsError,
    LDAPResult_resultCode_other,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/LDAPResult.ta";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels.ta";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import bind from "./bind";
import decodeLDAPOID from "@wildboar/ldap/src/lib/decodeLDAPOID";
import encodeLDAPOID from "@wildboar/ldap/src/lib/encodeLDAPOID";
import ldapRequestToDAPRequest from "../distributed/ldapRequestToDAPRequest";
import dapReplyToLDAPResult from "../distributed/dapReplyToLDAPResult";
import OperationDispatcher from "../distributed/OperationDispatcher";
import dapErrorToLDAPResult from "../distributed/dapErrorToLDAPResult";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import codeToString from "@wildboar/x500/src/lib/stringifiers/codeToString";
import getServerStatistics from "../telemetry/getServerStatistics";
import getConnectionStatistics from "../telemetry/getConnectionStatistics";
import {
    SearchRequest_scope_baseObject,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import {
    modifyPassword,
    whoAmI,
    startTLS,
    cancel,
} from "@wildboar/ldap/src/lib/extensions";
import encodeLDAPDN from "./encodeLDAPDN";
import createNoticeOfDisconnection from "./createNoticeOfDisconnection";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import getRootSubschema from "./getRootSubschema";
import anyPasswordsExist from "../authz/anyPasswordsExist";

const UNIVERSAL_SEQUENCE_TAG: number = 0x30;

enum Status {
    UNBOUND = 1,
    BIND_IN_PROGRESS = 2,
    BOUND = 3,
}

function isRootSubschemaDN (dn: Uint8Array): boolean {
    const dnstr = Buffer.from(dn).toString("utf-8").toLowerCase();
    return [ // Different ways of representing the same DN.
        "cn=subschema",
        "2.5.4.3=subschema",
        "cn=#0C09737562736368656d61",
        "2.5.4.3=#0C09737562736368656d61",
    ].includes(dnstr);
}

async function handleRequest (
    ctx: Context,
    conn: LDAPConnection,
    message: LDAPMessage,
    stats: OperationStatistics,
): Promise<void> {
    ctx.log.debug(ctx.i18n.t("log:received_ldap_request", {
        mid: message.messageID,
        type: Object.keys(message.protocolOp)[0],
        cid: conn.id,
    }));
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
        const successMessage = ctx.i18n.t("main:success");
        /**
         * We allow users to see schema at the Root DSE level if they are
         * authenticated or if there are no passwords in the database. This is
         * to preserve the privacy of directory schema despite the fact that
         * no access controls can be applied to the Root DSE. If these
         * conditions are not met, the user will only see a small selection of
         * schema.
         */
        const permittedToSeeSchema: boolean = Boolean(conn.boundEntry || !(await anyPasswordsExist(ctx)));
        const entry = new SearchResultEntry(
            Buffer.from("cn=subschema", "utf-8"),
            getRootSubschema(ctx, permittedToSeeSchema),
        );
        await onEntry(entry);
        const res = new LDAPMessage(
            message.messageID,
            {
                searchResDone: new LDAPResult(
                    LDAPResult_resultCode_success,
                    Buffer.alloc(0),
                    Buffer.from(successMessage, "utf-8"),
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
        conn.messageIDToInvokeID.set(Number(message.messageID), Number(dapRequest.invokeId.present));
        conn.invokeIDToMessageID.set(Number(dapRequest.invokeId.present), Number(message.messageID));
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
        invokeId: dapRequest.invokeId,
        opCode: dapRequest.opCode,
        result: unprotectedResult.result,
    }, message, onEntry);
    conn.socket.write(_encode_LDAPMessage(ldapResult, BER).toBytes());
    stats.request = result.request ?? stats.request;
    stats.outcome = result.outcome ?? stats.outcome;
}

async function handleRequestAndErrors (
    ctx: Context,
    conn: LDAPConnection,
    message: LDAPMessage,
): Promise<void> {
    if (conn.status !== Status.BOUND) {
        const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
        conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        conn.socket.destroy();
        return;
    }
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
    const cancelOp: boolean = (
        ("extendedReq" in message.protocolOp)
        && decodeLDAPOID(message.protocolOp.extendedReq.requestName).isEqualTo(cancel)
    );
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
        const result: LDAPResult | undefined = dapErrorToLDAPResult(ctx, e, cancelOp);
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
            const errorMessage: string = ctx.i18n.t("err:unrecognized_ldap_op");
            /**
             * IETF RFC 4511, Section 4.1.1 states that:
             *
             * > In other cases where the client or server cannot parse an LDAP
             * > PDU, it SHOULD abruptly terminate the LDAP session.
             *
             * An LDAP server is supposed to send a notice of disconnection, as
             * detailed in IETF RFC 4511, Section 4.4.1.
             */
            const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, errorMessage);
            conn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            conn.socket.destroy();
            return;
        }
    } finally {
        const invokeID = conn.messageIDToInvokeID.get(Number(message.messageID));
        if (invokeID) {
            conn.invokeIDToMessageID.delete(invokeID);
        }
        conn.messageIDToInvokeID.delete(Number(message.messageID));
        // ctx.log.debug(`Finished operation ${invokeID} / ${message.messageID}.`);
        // dap.invocations.set(request.invokeID, {
        //     invokeId: request.invokeID,
        //     operationCode: request.opcode,
        //     startTime: now,
        //     resultTime: new Date(),
        // });
        ctx.telemetry.sendEvent(stats);
    }
}

export
class LDAPConnection extends ClientAssociation {

    public status: Status = Status.UNBOUND;
    private buffer: Buffer = Buffer.alloc(0);
    public boundEntry: Vertex | undefined;

    // Not used.
    public async attemptBind (): Promise<void> {
        return;
    }

    // I _think_ this function MUST NOT be async, or this function could run
    // multiple times out-of-sync, mutating `this.buffer` indeterminately.
    private handleData (ctx: Context, data: Buffer): void {
        const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
        // #region Pre-flight check if the message will fit in the buffer, if possible.
        if ((this.buffer.length + data.length) > ctx.config.ldap.bufferSize) {
            ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
                protocol: "LDAP",
                source,
                size: ctx.config.ldap.bufferSize.toString(),
            }));
            /**
             * IETF RFC 4511, Section 4.1.1 states that:
             *
             * > In other cases where the client or server cannot parse an LDAP
             * > PDU, it SHOULD abruptly terminate the LDAP session.
             *
             * An LDAP server is supposed to send a notice of disconnection, as
             * detailed in IETF RFC 4511, Section 4.4.1.
             */
            const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
            this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            this.socket.destroy();
            return;
        }

        const lengthOctet: number | undefined = (this.buffer.length >= 2)
            ? this.buffer[1]
            : (data.length >= 2)
                ? data[1]
                : undefined;
        const longDefiniteLengthUsed: boolean = !!(
            (lengthOctet !== undefined)
            && (lengthOctet & 0b1000_0000)
            && (data[1] & 0b0111_1111)
        );
        if (longDefiniteLengthUsed) {
            const numberOfLengthOctets: number = (lengthOctet! & 0b0111_1111);
            // If the client is using more than four bytes to encode the length, they're probably messing with us.
            if (numberOfLengthOctets > 4) {
                const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
                    protocol: "LDAP",
                    source,
                    size: ctx.config.ldap.bufferSize.toString(),
                }));
                /**
                 * IETF RFC 4511, Section 4.1.1 states that:
                 *
                 * > In other cases where the client or server cannot parse an LDAP
                 * > PDU, it SHOULD abruptly terminate the LDAP session.
                 *
                 * An LDAP server is supposed to send a notice of disconnection, as
                 * detailed in IETF RFC 4511, Section 4.4.1.
                 */
                const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                this.socket.destroy();
                return;
            }
            if ((numberOfLengthOctets + 2) >= data.length) { // If we have all length bytes.
                const lengthBytes = Buffer.alloc(4);
                lengthBytes.set(data.slice(2, 2 + numberOfLengthOctets), 4 - numberOfLengthOctets);
                const length = lengthBytes.readUInt32BE();
                if (length > ctx.config.ldap.bufferSize) {
                    const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                    ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
                        protocol: "LDAP",
                        source,
                        size: ctx.config.ldap.bufferSize.toString(),
                    }));
                    /**
                     * IETF RFC 4511, Section 4.1.1 states that:
                     *
                     * > In other cases where the client or server cannot parse an LDAP
                     * > PDU, it SHOULD abruptly terminate the LDAP session.
                     *
                     * An LDAP server is supposed to send a notice of disconnection, as
                     * detailed in IETF RFC 4511, Section 4.4.1.
                     */
                    const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                    this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    this.socket.destroy();
                    return;
                }
            }
        }
        // #endregion

        this.buffer = Buffer.concat([
            this.buffer,
            data,
        ]);

        while (this.buffer.length > 0) {
            if (this.buffer[0] !== UNIVERSAL_SEQUENCE_TAG) {
                const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                ctx.log.warn(ctx.i18n.t("log:non_ldap_data", {
                    source,
                    hexbyte: this.buffer[0].toString(16).padStart(2, "0"),
                }));
                // We don't send a disconnection notice, because the traffic did not appear to be LDAP at all.
                this.socket.destroy();
                return;
            }
            const el = new BERElement();
            let bytesRead = 0;
            try {
                bytesRead = el.fromBytes(this.buffer);
            } catch (e) {
                if (e instanceof ASN1TruncationError) {
                    return;
                }
                ctx.log.error(ctx.i18n.t("log:encoding_error", {
                    uuid: this.id,
                }));
                const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                this.socket.destroy();
                return;
            }
            let message!: LDAPMessage;
            try {
                message = _decode_LDAPMessage(el);
            } catch (e) {
                ctx.log.error(ctx.i18n.t("log:malformed_ldapmessage", {
                    uuid: this.id,
                }));
                const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                this.socket.destroy();
                return;
            }

            if ((message.messageID > 2147483647) || (message.messageID < 0)) {
                const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                ctx.log.warn(ctx.i18n.t("log:unusual_message_id", {
                    source,
                }));
                this.socket.destroy();
                return;
            }

            if ("bindRequest" in message.protocolOp) {
                if (this.status !== Status.UNBOUND) {
                    ctx.log.error(ctx.i18n.t("log:double_bind_attempted", { source }));
                    const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                    this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    this.socket.destroy();
                    return;
                }
                this.status = Status.BIND_IN_PROGRESS;
                const req = message.protocolOp.bindRequest;
                const startBindTime = new Date();
                bind(ctx, this.socket, req)
                    .then(async (bindReturn) => {
                        const endBindTime = new Date();
                        const bindTime: number = Math.abs(differenceInMilliseconds(startBindTime, endBindTime));
                        const totalTimeInMilliseconds: number = ctx.config.bindMinSleepInMilliseconds
                            + crypto.randomInt(ctx.config.bindSleepRangeInMilliseconds);
                        const sleepTime: number = Math.abs(totalTimeInMilliseconds - bindTime);
                        await sleep(sleepTime);
                        if (bindReturn.result.resultCode === LDAPResult_resultCode_success) {
                            this.boundEntry = bindReturn.boundVertex;
                            this.authLevel = bindReturn.authLevel;
                            this.status = Status.BOUND;
                        } else {
                            this.status = Status.UNBOUND;
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
                    })
                    .finally(() => {
                        if (this.status === Status.BIND_IN_PROGRESS) {
                            this.status = Status.UNBOUND;
                        }
                        this.handleData(ctx, Buffer.alloc(0));
                    });
                /**
                 * When we bind, we slice the buffer, which we would normally
                 * do at the end of an iteration of this `while` loop, and then
                 * we break out of the `while` loop to avoid processing more
                 * messages until the bind returns with a response. When bind
                 * finishes, it will call `handleData` again with an empty
                 * buffer (a pseudo-packet) to continue processing enqueued
                 * messages.
                 */
                this.buffer = this.buffer.slice(bytesRead);
                break;
            } else if ("unbindRequest" in message.protocolOp) {
                this.status = Status.UNBOUND;
                this.boundEntry = undefined;
                this.boundNameAndUID = undefined;
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
                && !decodeLDAPOID(message.protocolOp.extendedReq.requestName).isEqualTo(cancel)
            ) {
                const req = message.protocolOp.extendedReq;
                const oid = decodeLDAPOID(req.requestName);
                if (oid.isEqualTo(startTLS)) {
                    if (this.socket instanceof tls.TLSSocket) {
                        // TODO: Log this, because this is sketchy.
                        const errorMessage: string = ctx.i18n.t("err:tls_already_in_use");
                        const res = new LDAPMessage(
                            message.messageID,
                            {
                                extendedResp: new ExtendedResponse(
                                    LDAPResult_resultCode_operationsError,
                                    Buffer.alloc(0),
                                    Buffer.from(errorMessage, "utf-8"),
                                    undefined,
                                    encodeLDAPOID(startTLS),
                                    undefined,
                                ),
                            },
                            undefined,
                        );
                        this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    } else {
                        this.socket.removeAllListeners("data");
                        this.buffer = Buffer.alloc(0);
                        this.socket = new tls.TLSSocket(this.socket, {
                            ...(this.starttlsOptions ?? {}),
                            isServer: true,
                        });
                        ctx.log.debug(ctx.i18n.t("log:starttls_established", {
                            context: "association",
                            cid: this.id,
                        }));
                        const successMessage = ctx.i18n.t("main:starttls_established");
                        const res = new LDAPMessage(
                            message.messageID,
                            {
                                extendedResp: new ExtendedResponse(
                                    LDAPResult_resultCode_success,
                                    Buffer.alloc(0),
                                    Buffer.from(successMessage, "utf-8"),
                                    undefined,
                                    encodeLDAPOID(startTLS),
                                    undefined,
                                ),
                            },
                            undefined,
                        );
                        this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    }
                } else if (oid.isEqualTo(whoAmI)) {
                    const successMessage = ctx.i18n.t("main:success");
                    const res = new LDAPMessage(
                        message.messageID,
                        {
                            extendedResp: new ExtendedResponse(
                                LDAPResult_resultCode_success,
                                Buffer.alloc(0),
                                Buffer.from(successMessage, "utf-8"),
                                undefined,
                                undefined,
                                this.boundNameAndUID
                                    ? Buffer.from(`dn:${encodeLDAPDN(ctx, this.boundNameAndUID.dn)}`, "utf-8")
                                    : Buffer.alloc(0), // Anonymous.
                            ),
                        },
                        undefined,
                    );
                    this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                } else {
                    const errorMessage = ctx.i18n.t("err:unrecognized_ext_op");
                    const res = new LDAPMessage(
                        message.messageID,
                        {
                            extendedResp: new ExtendedResponse(
                                LDAPResult_resultCode_protocolError,
                                Buffer.alloc(0),
                                Buffer.from(errorMessage, "utf-8"),
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
        readonly starttlsOptions?: tls.TLSSocketOptions,
    ) {
        super();
        this.socket = tcp;
        this.socket.on("data", (data: Buffer): void => this.handleData(ctx, data));
    }

}

export default LDAPConnection;
