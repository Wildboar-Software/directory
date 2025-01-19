import { Vertex, ClientAssociation, OperationStatistics } from "@wildboar/meerkat-types";
import * as errors from "@wildboar/meerkat-types";
import type { MeerkatContext } from "../ctx";
import * as net from "net";
import * as tls from "tls";
import {
    BERElement,
    ASN1TruncationError,
    DERElement,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
    FALSE,
} from "asn1-ts";
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
    LDAPResult_resultCode_invalidCredentials,
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
    modifyPassword,
    whoAmI,
    startTLS,
    cancel,
    dynamicRefresh,
} from "@wildboar/ldap/src/lib/extensions";
import encodeLDAPDN from "./encodeLDAPDN";
import createNoticeOfDisconnection from "./createNoticeOfDisconnection";
import { differenceInMilliseconds } from "date-fns";
import * as crypto from "crypto";
import sleep from "../utils/sleep";
import getRootSubschema from "./getRootSubschema";
import anyPasswordsExist from "../authz/anyPasswordsExist";
import {
    AuthenticationLevel_basicLevels_level_none as none,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/AuthenticationLevel-basicLevels-level.ta";
import { EventEmitter } from "events";
import { flatten } from "flat";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import getCommonResultsStatistics from "../telemetry/getCommonResultsStatistics";
import isDebugging from "is-debugging";
import { strict as assert } from "assert";
import { stringifyDN } from "../x500/stringifyDN";
import {
    SearchRequest_scope,
    SearchRequest_scope_baseObject,
    SearchRequest_scope_singleLevel,
    SearchRequest_scope_wholeSubtree,
} from "@wildboar/ldap/src/lib/modules/Lightweight-Directory-Access-Protocol-V3/SearchRequest-scope.ta";
import decodeLDAPDN from "./decodeLDAPDN";
import {
    stringifyFilter,
} from "@wildboar/ldap/src/lib/stringifiers/Filter";
import {
    SecurityErrorData,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityErrorData.ta";
import {
    SecurityProblem_insufficientAccessRights,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SecurityProblem.ta";
import { createSecurityParameters } from "../x500/createSecurityParameters";
import { compareCode } from "@wildboar/x500";
import {
    administerPassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/administerPassword.oa";
import {
    changePassword,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/changePassword.oa";
import { list, modifyEntry, search } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import {
    securityError,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/securityError.oa";
import {
    PwdResponseValue_error_changeAfterReset,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/PwdResponseValue-error.ta";
import { createWriteStream } from "node:fs";

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

function scopeToString (scope: SearchRequest_scope): string {
    return {
        [SearchRequest_scope_baseObject]: "base",
        [SearchRequest_scope_singleLevel]: "oneLevel",
        [SearchRequest_scope_wholeSubtree]: "subtree",
    }[scope] ?? "UNKNOWN";
}

async function handleRequest (
    ctx: MeerkatContext,
    assn: LDAPAssociation,
    message: LDAPMessage,
    stats: OperationStatistics,
): Promise<void> {
    ctx.log.debug(ctx.i18n.t("log:received_ldap_request", {
        mid: message.messageID,
        type: Object.keys(message.protocolOp)[0],
        cid: assn.id,
    }), {
        remoteFamily: assn.socket.remoteFamily,
        remoteAddress: assn.socket.remoteAddress,
        remotePort: assn.socket.remotePort,
        association_id: assn.id,
    });
    if ("searchRequest" in message.protocolOp) {
        const sr = message.protocolOp.searchRequest;
        ctx.log.debug(ctx.i18n.t("log:ldap_search", {
            mid: message.messageID,
            cid: assn.id,
            scope: scopeToString(sr.scope),
            base: stringifyDN(ctx, decodeLDAPDN(ctx, sr.baseObject)).slice(0, 128),
            filter: stringifyFilter(sr.filter).slice(0, 128),
            sel: sr.attributes.map((attr) => Buffer.from(
                attr.buffer,
                attr.byteOffset,
                attr.byteLength,
            ).toString("utf-8")).join(", "),
            typesOnly: sr.typesOnly ? "TRUE": "FALSE",
            deref: sr.derefAliases,
            size: sr.sizeLimit,
            time: sr.timeLimit,
        }), {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
        });
    }
    // let toWriteBuffer: Buffer = Buffer.alloc(0);
    // let resultsBuffered: number = 0;
    const onEntry = (searchResEntry: SearchResultEntry): void => {
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
        assn.socket.write(_encode_LDAPMessage(resultMessage, BER).toBytes());
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
        const permittedToSeeSchema: boolean = (
            (
                ("basicLevels" in assn.authLevel)
                && (assn.authLevel.basicLevels.level > none)
            )
            || !(await anyPasswordsExist(ctx))
        );
        const entry = new SearchResultEntry(
            Buffer.from("cn=subschema", "utf-8"),
            getRootSubschema(ctx, permittedToSeeSchema),
        );
        onEntry(entry);
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
        assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        return;
    }
    const dapRequest = ldapRequestToDAPRequest(ctx, assn, message);
    if (!dapRequest) {
        // Not all requests--such as abandon--warrant a response.
        return;
    }
    if (assn.pwdReset) {
        const operation_can_be_used_to_change_password: boolean = (
            compareCode(dapRequest.opCode!, administerPassword["&operationCode"]!)
            || compareCode(dapRequest.opCode!, changePassword["&operationCode"]!)
            || compareCode(dapRequest.opCode!, modifyEntry["&operationCode"]!)
            // Search and list are included, because a lot of DUAs will probably
            // automatically do these operations, and become unusable if they
            // don't work.
            || compareCode(dapRequest.opCode!, search["&operationCode"]!)
            || compareCode(dapRequest.opCode!, list["&operationCode"]!)
        );
        if (!operation_can_be_used_to_change_password) {
            throw new errors.SecurityError(
                ctx.i18n.t("err:pwd_must_change"),
                new SecurityErrorData(
                    SecurityProblem_insufficientAccessRights,
                    undefined,
                    undefined,
                    [],
                    createSecurityParameters(
                        ctx,
                        FALSE,
                        assn.boundNameAndUID?.dn,
                        undefined,
                        securityError["&errorCode"],
                    ),
                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                ),
                FALSE,
            );
        }
    }
    if ("present" in dapRequest.invokeId) {
        assn.messageIDToInvokeID.set(Number(message.messageID), Number(dapRequest.invokeId.present));
        assn.invokeIDToMessageID.set(Number(dapRequest.invokeId.present), Number(message.messageID));
        const now = new Date();
        assn.invocations.set(Number(dapRequest.invokeId.present), {
            invokeId: Number(dapRequest.invokeId.present),
            operationCode: dapRequest.opCode,
            startTime: now,
            events: new EventEmitter(),
        });
    }
    const result = await OperationDispatcher.dispatchDAPRequest(
        ctx,
        assn,
        { ...dapRequest },
    );
    stats.request = result.request ?? stats.request;
    stats.outcome = result.outcome ?? stats.outcome;
    const unprotectedResult = getOptionallyProtectedValue(result.result);
    const ldapResult = dapReplyToLDAPResult(ctx, assn, {
        invokeId: dapRequest.invokeId,
        opCode: dapRequest.opCode,
        result: unprotectedResult.result,
    }, message, onEntry);
    assn.socket.write(_encode_LDAPMessage(ldapResult, BER).toBytes());
}

async function handleRequestAndErrors (
    ctx: MeerkatContext,
    assn: LDAPAssociation,
    message: LDAPMessage,
): Promise<void> {
    if (assn.status !== Status.BOUND) {
        const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
        assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        assn.socket.destroy();
        return;
    }
    const stats: OperationStatistics = {
        type: "op",
        inbound: true,
        server: getServerStatistics(ctx),
        connection: getConnectionStatistics(assn),
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
    const startTime = Date.now();
    try {
        await handleRequest(ctx, assn, message, stats);
        ctx.telemetry.trackRequest({
            name: Object.keys(message.protocolOp)[0],
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: 200,
            success: true,
            properties: {
                ...flatten<any, object>(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
            },
        });
    } catch (e) {
        ctx.telemetry.trackRequest({
            name: Object.keys(message.protocolOp)[0],
            url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
            duration: Date.now() - startTime,
            resultCode: (e instanceof errors.DirectoryError || e instanceof errors.TransportError)
                ? 400
                : 500,
            success: false,
            properties: {
                ...flatten<any, object>(stats),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
            },
        });
        const logInfo = {
            remoteFamily: assn.socket.remoteFamily,
            remoteAddress: assn.socket.remoteAddress,
            remotePort: assn.socket.remotePort,
            association_id: assn.id,
            messageID: message.messageID.toString(),
        };
        ctx.log.info(`${assn.id}#${message.messageID}: ${e.constructor?.name ?? "?"}: ${e.message ?? e.msg ?? e.m}`, logInfo);
        if (isDebugging || (ctx.log.level === "debug")) {
            console.error(e);
        }
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
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("compareRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { compareResponse: result }, undefined);
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("delRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { delResponse: result }, undefined);
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modDNRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { modDNResponse: result }, undefined);
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("modifyRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { modifyResponse: result }, undefined);
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
        } else if ("searchRequest" in message.protocolOp) {
            const res = new LDAPMessage(message.messageID, { searchResDone: result }, undefined);
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
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
                assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            } else if (oid.isEqualTo(dynamicRefresh)) {
                /* "In case of an error, the responseTtl field will have the
                value 0" */
                const value = BERElement.fromSequence([
                    new DERElement(
                        ASN1TagClass.universal,
                        ASN1Construction.primitive,
                        ASN1UniversalType.integer,
                        0,
                    ),
                ]);
                const res = new LDAPMessage(
                    message.messageID,
                    {
                        extendedResp: new ExtendedResponse(
                            result.resultCode,
                            result.matchedDN,
                            result.diagnosticMessage,
                            result.referral,
                            message.protocolOp.extendedReq.requestName,
                            value.toBytes(),
                        ),
                    },
                    undefined,
                );
                assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
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
            assn.socket.write(_encode_LDAPMessage(res, BER).toBytes());
            assn.socket.destroy();
            return;
        }
        ctx.telemetry.trackException({
            exception: e,
            properties: {
                ...flatten<any, object>(stats),
                ...flatten<any, object>(getCommonResultsStatistics(e.data)),
                administratorEmail: ctx.config.administratorEmail,
            },
            measurements: {
                bytesRead: assn.socket.bytesRead,
                bytesWritten: assn.socket.bytesWritten,
            },
        });
    } finally {
        const invokeID = assn.messageIDToInvokeID.get(Number(message.messageID));
        if (invokeID) {
            assn.invokeIDToMessageID.delete(invokeID);
            assn.invocations.delete(invokeID);
        }
        assn.messageIDToInvokeID.delete(Number(message.messageID));
    }
}

/**
 * @summary A Lightweight Directory Access Protocol (LDAP) association.
 * @description
 *
 * A Lightweight Directory Access Protocol (LDAP) association.
 *
 * @kind class
 */
export
class LDAPAssociation extends ClientAssociation {

    /**
     * @summary The association status
     * @description
     *
     * The association status
     *
     * @public
     * @property
     */
    public status: Status = Status.UNBOUND;

    /**
     * @summary The internal buffer of received and unprocessed data
     * @description
     *
     * The internal buffer of received and unprocessed data
     *
     * @public
     * @property
     */
    private buffer: Buffer = Buffer.alloc(0);

    /**
     * @summary Attempt a bind
     * @description
     *
     * Not implemented for `LDAPAssociation`.
     *
     * @public
     * @function
     * @async
     */
    public async attemptBind (): Promise<void> {
        return;
    }

    private reset (): void {
        for (const invocation of this.invocations.values()) {
            invocation.abandonTime = new Date();
            this.invocations.clear();
        }
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
        this.ctx.db.enqueuedSearchResult.deleteMany({
            where: {
                connection_uuid: this.id,
            },
        }).then().catch(() => {});
        this.ctx.db.enqueuedListResult.deleteMany({
            where: {
                connection_uuid: this.id,
            },
        }).then().catch(() => {});
    }

    /**
     * @summary Handle a raw chunk of data from the TCP or TLS socket
     * @description
     *
     * Handle a raw chunk of data from the TCP or TLS socket.
     *
     * I _think_ this function MUST NOT be `async`, or this function could run
     * multiple times out-of-sync, mutating `this.buffer` indeterminately.
     *
     * @param ctx The context object
     * @param data The new chunk of data to process
     *
     * @private
     * @function
     */
    private handleData (ctx: MeerkatContext, data: Buffer): void {
        const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
        const telemetryProperties = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            protocol: "LDAP",
            administratorEmail: ctx.config.administratorEmail,
        };
        const extraLogData = {
            remoteFamily: this.socket.remoteFamily,
            remoteAddress: this.socket.remoteAddress,
            remotePort: this.socket.remotePort,
            association_id: this.id,
            usingTLS: (this.socket instanceof tls.TLSSocket),
        };
        // #region Pre-flight check if the message will fit in the buffer, if possible.
        if ((this.buffer.length + data.length) > ctx.config.ldap.bufferSize) {
            ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
                host: this.socket.remoteAddress,
                protocol: "LDAP",
                source,
                size: ctx.config.ldap.bufferSize.toString(),
            }), extraLogData);
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
                    host: this.socket.remoteAddress,
                    protocol: "LDAP",
                    source,
                    size: ctx.config.ldap.bufferSize.toString(),
                }), extraLogData);
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
                lengthBytes.set(data.subarray(2, 2 + numberOfLengthOctets), 4 - numberOfLengthOctets);
                const length = lengthBytes.readUInt32BE();
                if (length > ctx.config.ldap.bufferSize) {
                    const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                    ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
                        host: this.socket.remoteAddress,
                        protocol: "LDAP",
                        source,
                        size: ctx.config.ldap.bufferSize.toString(),
                    }), extraLogData);
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
                    host: this.socket.remoteAddress,
                    source,
                    hexbyte: this.buffer[0].toString(16).padStart(2, "0"),
                }), extraLogData);
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
                ctx.telemetry.trackException({
                    exception: e,
                    properties: telemetryProperties,
                });
                ctx.log.error(ctx.i18n.t("log:encoding_error", {
                    host: this.socket.remoteAddress,
                    uuid: this.id,
                }), extraLogData);
                const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                this.socket.destroy();
                return;
            }
            let message!: LDAPMessage;
            try {
                message = _decode_LDAPMessage(el);
            } catch (e) {
                if (e instanceof ASN1TruncationError) { // This can happen here with indefinite-length messages.
                    return;
                }
                ctx.telemetry.trackException({
                    exception: e,
                    properties: telemetryProperties,
                });
                ctx.log.error(ctx.i18n.t("log:malformed_ldapmessage", {
                    host: this.socket.remoteAddress,
                    uuid: this.id,
                }), extraLogData);
                const res = createNoticeOfDisconnection(LDAPResult_resultCode_protocolError, "");
                this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                this.socket.destroy();
                return;
            }

            if ((message.messageID > 2147483647) || (message.messageID < 0)) {
                const source: string = `${this.socket.remoteFamily}:${this.socket.remoteAddress}:${this.socket.remotePort}`;
                ctx.log.warn(ctx.i18n.t("log:unusual_message_id", {
                    host: this.socket.remoteAddress,
                    source,
                }), extraLogData);
                this.socket.destroy();
                return;
            }

            if ("bindRequest" in message.protocolOp) {
                if (this.status !== Status.UNBOUND) {
                    this.reset();
                }
                this.status = Status.BIND_IN_PROGRESS;
                const req = message.protocolOp.bindRequest;
                const startBindTime = new Date();
                bind(ctx, this.socket, req)
                    .then(async (outcome) => {
                        const logInfo = {
                            host: source,
                            remoteFamily: this.socket.remoteFamily,
                            remoteAddress: this.socket.remoteAddress,
                            remotePort: this.socket.remotePort,
                            association_id: this.id,
                        };
                        const endBindTime = new Date();
                        const bindTime: number = Math.abs(differenceInMilliseconds(startBindTime, endBindTime));
                        const totalTimeInMilliseconds: number = ctx.config.bindMinSleepInMilliseconds
                            + crypto.randomInt(ctx.config.bindSleepRangeInMilliseconds);
                        const sleepTime: number = Math.abs(totalTimeInMilliseconds - bindTime);
                        await sleep(sleepTime);
                        if (outcome.result.resultCode === LDAPResult_resultCode_success) {
                            this.boundNameAndUID = outcome.boundNameAndUID;
                            this.boundEntry = outcome.boundVertex;
                            this.authLevel = outcome.authLevel;
                            this.status = Status.BOUND;
                            this.pwdReset = (outcome.pwdResponse?.error === PwdResponseValue_error_changeAfterReset);
                            this.clearances = outcome.clearances;
                            const remoteHostIdentifier = `${this.socket.remoteFamily}://${this.socket.remoteAddress}/${this.socket.remotePort}`;
                            if (
                                ("basicLevels" in outcome.authLevel)
                                && (outcome.authLevel.basicLevels.level === AuthenticationLevel_basicLevels_level_none)
                            ) {
                                assert(!ctx.config.forbidAnonymousBind, "Somehow a user bound anonymously when anonymous binds are forbidden.");
                                ctx.log.info(ctx.i18n.t("log:connection_bound_anon", {
                                    source: remoteHostIdentifier,
                                    protocol: "LDAP",
                                    aid: this.id,
                                }), extraLogData);
                            } else {
                                ctx.log.info(ctx.i18n.t("log:connection_bound_auth", {
                                    context: ctx.config.log.boundDN ? "with_dn" : undefined,
                                    source: remoteHostIdentifier,
                                    protocol: "LDAP",
                                    aid: this.id,
                                    dn: this.boundNameAndUID?.dn
                                        ? stringifyDN(ctx, this.boundNameAndUID.dn).slice(0, 512)
                                        : "",
                                }), extraLogData);
                            }
                        } else {
                            if (outcome.result.resultCode === LDAPResult_resultCode_invalidCredentials) {
                                ctx.log.warn(ctx.i18n.t("err:invalid_credentials", logInfo), logInfo);
                            }
                            this.status = Status.UNBOUND;
                        }
                        const res = new LDAPMessage(
                            message.messageID,
                            {
                                bindResponse: outcome.result,
                            },
                            undefined,
                        );
                        this.socket.write(_encode_LDAPMessage(res, BER).toBytes());
                    })
                    .catch((e) => {
                        ctx.log.error(e.message, extraLogData);
                        if (isDebugging) {
                            console.error(e);
                        }
                        ctx.telemetry.trackException({
                            exception: e,
                            properties: telemetryProperties,
                        });
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
                this.buffer = this.buffer.subarray(bytesRead);
                break;
            } else if ("unbindRequest" in message.protocolOp) {
                this.reset();
            } else if (
                ("extendedReq" in message.protocolOp)
                && !decodeLDAPOID(message.protocolOp.extendedReq.requestName).isEqualTo(modifyPassword)
                && !decodeLDAPOID(message.protocolOp.extendedReq.requestName).isEqualTo(cancel)
            ) {
                const req = message.protocolOp.extendedReq;
                const oid = decodeLDAPOID(req.requestName);
                if (oid.isEqualTo(startTLS)) {
                    if (this.socket instanceof tls.TLSSocket) {
                        ctx.log.warn(ctx.i18n.t("log:double_starttls", {
                            host: this.socket.remoteAddress,
                            source,
                        }), extraLogData);
                        ctx.telemetry.trackEvent({
                            name: "IDM_WARN_DOUBLE_START_TLS",
                            properties: telemetryProperties,
                        });
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
                        if (ctx.config.tls.log_tls_secrets) {
                            this.socket.on("keylog", (line) => {
                                ctx.log.debug(ctx.i18n.t("log:keylog", {
                                    peer: source,
                                    key: line.toString("latin1"),
                                }));
                            });
                        }
                        if (ctx.config.tls.sslkeylog_file) {
                            const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
                            this.socket.on("keylog", (line) => keylogFile.write(line));
                        }
                        ctx.log.debug(ctx.i18n.t("log:starttls_established", {
                            context: "association",
                            cid: this.id,
                        }), extraLogData);
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
                    const dn = this.boundNameAndUID
                        ? Buffer.from(encodeLDAPDN(ctx, this.boundNameAndUID.dn)).toString("utf-8")
                        : undefined;
                    const res = new LDAPMessage(
                        message.messageID,
                        {
                            extendedResp: new ExtendedResponse(
                                LDAPResult_resultCode_success,
                                Buffer.alloc(0),
                                Buffer.from(successMessage, "utf-8"),
                                undefined,
                                undefined,
                                dn
                                    ? Buffer.from(`dn:${dn}`, "utf-8")
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
                // INTENTIONAL_NO_AWAIT
                // If you await this, it will cause a race condition.
                // Specifically, this.buffer will be indeterminate.
                handleRequestAndErrors(ctx, this, message);
            }
            this.buffer = this.buffer.subarray(bytesRead);
        }
    }

    /**
     * @constructor
     * @param ctx The context object
     * @param tcp The underlying TCP socket
     * @param starttlsOptions TLS options
     */
    constructor (
        readonly ctx: MeerkatContext,
        readonly tcp: net.Socket,
        readonly starttlsOptions?: tls.TLSSocketOptions,
    ) {
        super();
        this.socket = tcp;
        this.socket.on("close", this.reset.bind(this));
        this.socket.on("data", (data: Buffer): void => this.handleData(ctx, data));
    }

}

export default LDAPAssociation;
