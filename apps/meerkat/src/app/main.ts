import type { ClientAssociation } from "@wildboar/meerkat-types";
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as net from "net";
import * as tls from "tls";
import * as path from "path";
import * as os from "os";
import { IdmBind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
import { rose_transport_from_idm_socket } from "./rose/idm";
import { rose_transport_from_itot_stack } from "./rose/itot";
import {
    create_itot_stack,
    ISOTransportOverTCPStack,
} from "@wildboar/osi-net";
import {
    Abort_reasonNotSpecified,
    Abort_unboundRequest,
    Abort_resourceLimitation,
    Abort_invalidProtocol,
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import {
    IDMConnection,
    warnings,
} from "@wildboar/idm";
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import DAPAssociation from "./dap/DAPConnection";
import DSPAssociation from "./dsp/DSPConnection";
import DOPAssociation from "./dop/DOPConnection";
import LDAPAssociation from "./ldap/LDAPConnection";
import loadDIT from "./init/loadDIT";
import loadAttributeTypes from "./init/loadAttributeTypes";
import loadObjectClasses from "./init/loadObjectClasses";
import loadLDAPSyntaxes from "./init/loadLDAPSyntaxes";
import loadMatchingRules from "./init/loadMatchingRules";
import loadContextTypes from "./init/loadContextTypes";
import loadObjectIdentifierNames from "./init/loadObjectIdentifierNames";
import loadNameForms from "./init/loadNameForms";
import { loadDSARelationships } from "./init/loadDSARelationships";
import ctx, { MeerkatContext } from "./ctx";
import terminate from "./dop/terminateByID";
import { differenceInMilliseconds, differenceInMinutes } from "date-fns";
import * as dns from "dns/promises";
import {
    updatesDomain,
} from "./constants";
import createDatabaseReport from "./telemetry/createDatabaseReport";
import semver from "semver";
import isDebugging from "is-debugging";
import { setTimeout as safeSetTimeout } from "safe-timers";
import { randomUUID } from "crypto";
import { flatten } from "flat";
import { getServerStatistics } from "./telemetry/getServerStatistics";
import { naddrToURI } from "@wildboar/x500/src/lib/distributed/naddrToURI";
import { getOnOCSPRequestCallback } from "./pki/getOnOCSPRequestCallback";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import { parseFormData } from "./admin/parseFormData";
import { applyXSRFCookie } from "./admin/applyXSRFCookie";
import printCode from "./utils/printCode";
import {
    id_ac_directoryAccessAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryAccessAC.va";
import {
    id_ac_directorySystemAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directorySystemAC.va";
import {
    id_ac_directoryOperationalBindingManagementAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-directoryOperationalBindingManagementAC.va";
import {
    id_ac_shadowConsumerInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAC.va";
import {
    id_ac_shadowConsumerInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowConsumerInitiatedAsynchronousAC.va";
import {
    id_ac_shadowSupplierInitiatedAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAC.va";
import {
    id_ac_shadowSupplierInitiatedAsynchronousAC,
} from "@wildboar/x500/src/lib/modules/DirectoryOSIProtocols/id-ac-shadowSupplierInitiatedAsynchronousAC.va";
import { AbortReason } from "@wildboar/rose-transport";
import { createWriteStream } from "node:fs";
import { disp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/disp-ip.oa";
import DISPAssociation from "./disp/DISPConnection";
import { id_op_binding_shadow } from "@wildboar/x500/src/lib/modules/DirectoryOperationalBindingTypes/id-op-binding-shadow.va";
import { OperationalBindingInitiator } from "@prisma/client";
import {
    _decode_ShadowingAgreementInfo,
} from "@wildboar/x500/src/lib/modules/DirectoryShadowAbstractService/ShadowingAgreementInfo.ta";
import scheduleShadowUpdates from "./disp/scheduleShadowUpdates";
import { BERElement } from "asn1-ts";
import { cacheNamingContexts } from "./dit/cacheNamingContexts";

/**
 * @summary Check for Meerkat DSA updates
 * @description
 *
 * This function checks for available Meerkat DSA updates via DNS. This checks
 * a hard-coded updates domain's DNS TXT records for information as to what
 * versions are available, then compares that to the local version of Meerkat
 * DSA to decide if there is an update available.
 *
 * @param ctx The context object
 * @param currentVersionString the current version (as a string)
 *
 * @function
 * @async
 */
async function checkForUpdates (ctx: MeerkatContext, currentVersionString: string): Promise<void> {
    const currentVersion = semver.parse(currentVersionString);
    if (!currentVersion) {
        return;
    }
    const records = await dns
        .resolveTxt(`v${currentVersion.major}.` + updatesDomain)
        .catch(() => []);
    for (const record of records) {
        const fullRecord: string = record.join(" ").trim().toLowerCase();
        const fields: Record<string, string> = Object.fromEntries(
            fullRecord
                .split(";")
                .filter((field) => !!field.length)
                .map((field) => field.split("=")),
        );
        const secureVersion = semver.parse(fields["secure"] || "");
        const latestVersion = semver.parse(fields["latest"] || "");
        const latestMajor = Number.parseInt(fields["major"], 10) || 1;
        const deprecated = fields["deprecated"];
        const insecure = fields["insecure"];
        if (insecure) {
            ctx.log.warn(ctx.i18n.t("log:major_version_insecure"));
            return;
        }
        if (deprecated) {
            ctx.log.warn(ctx.i18n.t("log:major_version_deprecated"));
            return;
        }
        if (latestMajor > currentVersion.major) {
            ctx.log.info(ctx.i18n.t("log:major_update_available"));
            return;
        }
        if (secureVersion) {
            if (semver.gt(secureVersion, currentVersion)) {
                ctx.log.warn(ctx.i18n.t("log:security_update_available", {
                    version: fields["secure"],
                }));
                return;
            }
        }
        if (latestVersion) {
            if (latestVersion.minor > currentVersion.minor) {
                ctx.log.info(ctx.i18n.t("log:minor_update_available", {
                    version: fields["latest"],
                }));
                return;
            } else if (
                (latestVersion.minor === currentVersion.minor)
                && (latestVersion.patch > currentVersion.patch)
            ) {
                ctx.log.info(ctx.i18n.t("log:patch_update_available", {
                    version: fields["latest"],
                }));
                return;
            }
        }
    }
}

/**
 * @summary Higher-order function that gets a function that checks that a chunk of data will not exceed a buffer's limit
 * @description
 *
 * This is a higher-order function that gets a function that checks that an
 * added chunk of data from the IDM socket will not overflow the configured
 * IDM buffer size. If it does, this function logs what happened, sends an IDM
 * abort notification, and closes the connection.
 *
 * @param ctx The context object
 * @param idm An IDM transport socket
 * @param source A remote host identifier
 * @returns A function that can be used to check if an additional chunk of data
 *  would exceed a buffer limit.
 *
 * @function
 */
const getIdmBufferLengthGate = (
    ctx: MeerkatContext,
    idm: IDMConnection,
    source: string,
) => (addedBytes: number) => {
    const currentBufferSize: number = (
        idm.getBufferSize()
        + addedBytes
    );
    if (currentBufferSize > ctx.config.idm.bufferSize) {
        ctx.log.warn(ctx.i18n.t("log:buffer_limit", {
            host: idm.s.remoteAddress,
            protocol: "IDM",
            source,
            size: ctx.config.idm.bufferSize.toString(),
        }));
        idm.writeAbort(Abort_resourceLimitation);
        return;
    }
};

/**
 * @summary Higher-order function that gets a function that checks if an IDM-PDU that is too large
 * @description
 *
 * This higher-order function that returns a function that checks if the length
 * of an IDM segment, combined with the current cumulative size of all other
 * IDM segments into which an IDM-PDU is fragmented, would produce an IDM-PDU
 * that would exceed the configured IDM-PDU size limit.
 *
 * @param ctx The context object
 * @param idm An IDM transport socket
 * @param source A remote host identifier
 * @returns A function that can check if an added IDM segment would produce an
 *  IDM-PDU that is too large
 *
 * @function
 */
const getIdmPduLengthGate = (
    ctx: MeerkatContext,
    idm: IDMConnection,
    source: string,
) => (addedBytes: number) => {
    const currentPduSize: number = (
        idm.getAccumulatedPDUSize()
        + addedBytes
    );
    if (currentPduSize > ctx.config.idm.maxPDUSize) {
        ctx.log.warn(ctx.i18n.t("log:pdu_limit", {
            host: idm.s.remoteAddress,
            protocol: "IDM",
            source,
            size: ctx.config.idm.maxPDUSize.toString(),
        }), {
            remoteAddress: idm.s.remoteAddress,
        });
        idm.writeAbort(Abort_resourceLimitation);
        return;
    }
    const numberOfSegments: number = (idm.getNumberOfSegmentsInPDU() + 1);
    if (numberOfSegments > ctx.config.idm.maxSegments) {
        ctx.log.warn(ctx.i18n.t("log:idm_segment_limit", {
            host: idm.s.remoteAddress,
            source,
            limit: ctx.config.idm.maxSegments,
        }), {
            remoteAddress: idm.s.remoteAddress,
        });
        idm.writeAbort(Abort_resourceLimitation);
        return;
    }
};

const PROCESS_NAME: string = "Meerkat DSA";



/**
 * @summary Attach default event listeners to an IDM connection
 * @description
 *
 * When an IDM connection is established, it must have event listeners set up
 * to actually handle IDM PDUs. Further, some of these handlers will get
 * removed after an association is bound on this IDM socket, so, if the
 * association is ever unbound, we need to re-attach these event listeners so
 * that it was as though it were a new IDM socket.
 *
 * This function is necessary, because the TCP connection can be recycled
 * between multiple binds. An analog of this need not exist for LDAP, because
 * the LDAP connection alone monopolizes binds and unbinds, unlike IDM, which
 * can be used to transport multiple protocols.
 *
 * @param ctx The context object
 * @param originalSocket The original socket (must be the original socket,
 *  because it is indexed by reference)
 * @param source A remote host identifier
 * @param idm The underlying IDM transport socket
 * @param startTimes An index of when sockets were opened
 *
 * @function
 */
function attachUnboundEventListenersToIDMConnection (
    ctx: MeerkatContext,
    originalSocket: net.Socket | tls.TLSSocket, // Even if STARTTLS is used, you must use the original socket for "bookkeeping" in the associations index.
    source: string, // Just to avoid recalculating this.
    idm: IDMConnection,
    startTimes: Map<net.Socket, Date>,
) {
    const properties = {
        remoteFamily: idm.s.remoteFamily,
        remoteAddress: idm.s.remoteAddress,
        remotePort: idm.s.remotePort,
        administratorEmail: ctx.config.administratorEmail,
    };
    idm.events.on("startTLS", () => {
        ctx.log.debug(ctx.i18n.t("log:starttls_established", {
            source,
            context: "transport",
        }), {
            remoteFamily: idm.s.remoteFamily,
            remoteAddress: idm.s.remoteAddress,
            remotePort: idm.s.remotePort,
        });
    });
    idm.events.on("socketError", (e) => {
        ctx.log.error(ctx.i18n.t("log:socket_error", {
            host: originalSocket.remoteAddress,
            source,
            e,
        }), {
            remoteFamily: idm.s.remoteFamily,
            remoteAddress: idm.s.remoteAddress,
            remotePort: idm.s.remotePort,
            stack: e?.stack,
        });
        idm.s.destroy();
        startTimes.delete(idm.s);
        ctx.associations.delete(idm.s);
    });
    /**
     * This is an extremely important operation for security.
     * Without this, nefarious users could anonymously submit:
     *
     * 1. A large IDM segment that exhausts all memory, or
     * 2. Individual segments whose combined data bytes exhausts all memory, or
     * 3. A large number of segments that exhausts all memory.
     */
    idm.events.on("socketDataLength", getIdmBufferLengthGate(ctx, idm, source));
    idm.events.on("segmentDataLength", getIdmPduLengthGate(ctx, idm, source));
    const handleWrongSequence = () => {
        idm.writeAbort(Abort_unboundRequest);
        startTimes.delete(idm.s);
        ctx.associations.delete(idm.s);
        // Note that this is logged below.
    };
    idm.events.on("request", handleWrongSequence);
    idm.events.on("bind", async (idmBind: IdmBind) => {
        idm.events.removeAllListeners("request");
        let conn!: ClientAssociation;
        if (idmBind.protocolID.isEqualTo(dap_ip["&id"]!) && ctx.config.dap.enabled) {
            const rose = rose_transport_from_idm_socket(ctx, idm);
            conn = new DAPAssociation(ctx, rose);
        } else if (idmBind.protocolID.isEqualTo(dsp_ip["&id"]!) && ctx.config.dsp.enabled) {
            const rose = rose_transport_from_idm_socket(ctx, idm);
            conn = new DSPAssociation(ctx, rose);
        } else if (idmBind.protocolID.isEqualTo(dop_ip["&id"]!) && ctx.config.dop.enabled) {
            const rose = rose_transport_from_idm_socket(ctx, idm);
            conn = new DOPAssociation(ctx, rose);
        } else if (idmBind.protocolID.isEqualTo(disp_ip["&id"]!) && ctx.config.disp.enabled) {
            const rose = rose_transport_from_idm_socket(ctx, idm);
            conn = new DISPAssociation(ctx, rose);
        } else {
            idm.writeAbort(Abort_invalidProtocol);
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            ctx.log.warn(ctx.i18n.t("log:unsupported_protocol", {
                protocol: idmBind.protocolID.toString(),
                host: originalSocket.remoteAddress,
                source,
            }), {
                remoteFamily: idm.s.remoteFamily,
                remoteAddress: idm.s.remoteAddress,
                remotePort: idm.s.remotePort,
                protocol: idmBind.protocolID.toString(),
            });
            return;
        }
        const startTime = Date.now();
        try {
            await conn.attemptBind(idmBind.argument);
            ctx.associations.set(originalSocket, conn);
            ctx.telemetry.trackRequest({
                name: "BIND",
                url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                    ?? `idm://meerkat.invalid:${ctx.config.idm.port}`,
                duration: Date.now() - startTime,
                resultCode: 200,
                success: true,
                properties,
                measurements: {
                    bytesRead: idm.socket.bytesRead,
                    bytesWritten: idm.socket.bytesWritten,
                    idmFramesReceived: idm.getFramesReceived(),
                },
            });
        } catch (e) {
            if (isDebugging) {
                console.error(e);
            }
            ctx.log.warn(ctx.i18n.t("log:bind_error", {
                host: originalSocket.remoteAddress,
                source,
                e,
            }), {
                remoteFamily: idm.s.remoteFamily,
                remoteAddress: idm.s.remoteAddress,
                remotePort: idm.s.remotePort,
                protocol: idmBind.protocolID.toString(),
            });
            idm.writeAbort(Abort_reasonNotSpecified);
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            ctx.telemetry.trackException({
                exception: e,
                properties,
                measurements: {
                    bytesRead: idm.s.bytesRead,
                    bytesWritten: idm.s.bytesWritten,
                    idmFramesReceived: idm.getFramesReceived(),
                },
            });
        }
    });
    idm.events.on("unbind", () => {
        // c.destroy(); You don't actually have to close the TCP connection. It could be recycled.
        ctx.associations.set(originalSocket, null);
        idm.events.removeAllListeners();
        // Recursive, but not really.
        attachUnboundEventListenersToIDMConnection(ctx, originalSocket, source, idm, startTimes);
    });
    idm.events.on("error_", (e) => {
        ctx.log.debug(ctx.i18n.t("log:idm_error", {
            code: printCode(e.errcode),
            source,
            bytes: Buffer.from(e.error.toBytes().subarray(0, 16)).toString("hex"),
        }), properties);
    });
    idm.events.on("reject", (r) => {
        ctx.log.debug(ctx.i18n.t("log:idm_reject", {
            code: r.reason,
            source,
        }), properties);
    });
    idm.events.on("abort", (a) => {
        ctx.log.debug(ctx.i18n.t("log:idm_abort", {
            code: a,
            source,
        }), properties);
    });
    idm.events.on("warning", (warningCode) => {
        const measurements = {
            bytesRead: idm.s.bytesRead,
            bytesWritten: idm.s.bytesWritten,
            idmFramesReceived: idm.getFramesReceived(),
        };
        switch (warningCode) {
        case (warnings.IDM_WARN_SLOW_LORIS): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_SLOW_LORIS",
                properties,
                measurements,
            });
            return;
        }
        case (warnings.IDM_WARN_BIG_INVOKE_ID): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_BIG_INVOKE_ID",
                properties,
                measurements,
            });
            return;
        }
        case (warnings.IDM_WARN_NEGATIVE_INVOKE_ID): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_NEGATIVE_INVOKE_ID",
                properties,
                measurements,
            });
            return;
        }
        case (warnings.IDM_WARN_DOUBLE_START_TLS): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_DOUBLE_START_TLS",
                properties,
                measurements,
            });
            ctx.log.warn(ctx.i18n.t("log:double_starttls", {
                host: idm.s.remoteAddress,
                source,
            }), {
                remoteAddress: idm.s.remoteAddress,
            });
            return;
        }
        case (warnings.IDM_WARN_PADDING_AFTER_PDU): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_PADDING_AFTER_PDU",
                properties,
                measurements,
            });
            return;
        }
        case (warnings.IDM_WARN_BAD_SEQUENCE): {
            ctx.telemetry.trackEvent({
                name: "IDM_WARN_BAD_SEQUENCE",
                properties,
                measurements,
            });
            ctx.log.warn(ctx.i18n.t("log:idm_bad_sequence", {
                host: idm.s.remoteAddress,
                source,
            }), {
                remoteAddress: idm.s.remoteAddress,
            });
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            return;
        }
        default: {
            return;
        }
        }
    });
}

/**
 * @summary Higher-order function that produces an IDM connection handler
 * @description
 *
 * This higher-order function gets an IDM connection handler.
 *
 * @param ctx The context object
 * @param startTimes A map of socket start times, indexed by socket reference
 * @returns An IDM connection handler
 *
 * @function
 */
function handleIDM (
    ctx: MeerkatContext,
    startTimes: Map<net.Socket, Date>,
): (socket: net.Socket | tls.TLSSocket) => void {
    return (c: net.Socket | tls.TLSSocket): void => {
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        if (ctx.config.tls.log_tls_secrets && (c instanceof tls.TLSSocket)) {
            c.on("keylog", (line) => {
                ctx.log.debug(ctx.i18n.t("log:keylog", {
                    peer: source,
                    key: line.toString("latin1"),
                }));
            });
        }
        if (ctx.config.tls.sslkeylog_file && (c instanceof tls.TLSSocket)) {
            const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
            c.on("keylog", (line) => keylogFile.write(line));
        }
        c.pause();
        ctx.associations.set(c, null); // Index this socket, noting that it has no established association.
        startTimes.set(c, new Date());
        const extraLogData = {
            remoteFamily: c.remoteFamily,
            remoteAddress: c.remoteAddress,
            remotePort: c.remotePort,
        };
        if (ctx.associations.size >= ctx.config.maxConnections) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn", {
                source,
                max: ctx.config.maxConnections,
            }), extraLogData);
            return;
        }
        if ( // Check connections-per-address, which helps prevent Slow Loris attacks.
            c.remoteAddress
            && Array.from(ctx.associations.keys())
                .filter((s) => s.remoteAddress === c.remoteAddress)
                .length > ctx.config.maxConnectionsPerAddress
        ) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn_per_addr", {
                host: c.remoteAddress,
                source,
                max: ctx.config.maxConnectionsPerAddress,
            }), extraLogData);
            return;
        }
        c.on("data", () => { // Check data throughput of socket, which helps prevent Slow Loris attacks.
            const minutesSinceStart = Math.abs(differenceInMinutes(startTimes.get(c) ?? new Date(), new Date()));
            if (
                minutesSinceStart
                && ((c.bytesRead / minutesSinceStart) < ctx.config.tcp.minimumTransferSpeedInBytesPerMinute)
            ) {
                ctx.log.warn(ctx.i18n.t("log:slow_loris", {
                    host: c.remoteAddress,
                    source,
                    bps: ctx.config.tcp.minimumTransferSpeedInBytesPerMinute.toString(),
                }), extraLogData);
                c.destroy();
                startTimes.delete(c);
                ctx.associations.delete(c);
            }
        });
        c.setNoDelay(ctx.config.tcp.noDelay);
        if (ctx.config.tcp.timeoutInSeconds) {
            c.setTimeout(ctx.config.tcp.timeoutInSeconds * 1000);
            c.on("timeout", () => {
                ctx.log.warn(ctx.i18n.t("log:tcp_timeout", {
                    source,
                    seconds: ctx.config.tcp.timeoutInSeconds,
                }), extraLogData);
                c.destroy();
            });
        }
        ctx.log.info(ctx.i18n.t("log:transport_established", {
            source,
            transport: (c instanceof tls.TLSSocket) ? "IDMS" : "IDM",
        }), extraLogData);

        c.on("error", (e) => {
            ctx.log.error(ctx.i18n.t("log:socket_error", {
                host: c.remoteAddress,
                source,
                e: e.message,
            }), {
                ...extraLogData,
                stack: e?.stack,
            });
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }), extraLogData);
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        try {
            const idm = new IDMConnection(c, {
                ...ctx.config.tls,
                rejectUnauthorized: ctx.config.tls.rejectUnauthorizedClients,
            });
            attachUnboundEventListenersToIDMConnection(ctx, c, source, idm, startTimes);
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
                host: c.remoteAddress,
                source,
            }), {
                ...extraLogData,
                stack: e?.stack,
            });
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            return;
        }
        c.resume();
    };
}

/**
 * @summary Higher-order function that produces an LDAP connection handler
 * @description
 *
 * This higher-order function gets an LDAP connection handler.
 *
 * @param ctx The context object
 * @param startTimes A map of socket start times, indexed by socket reference
 * @returns An LDAP connection handler
 *
 * @function
 */
function handleLDAP (
    ctx: MeerkatContext,
    startTimes: Map<net.Socket, Date>,
): (socket: net.Socket | tls.TLSSocket) => void {
    return (c) => {
        if (ctx.config.tls.log_tls_secrets && (c instanceof tls.TLSSocket)) {
            c.on("keylog", (line) => {
                ctx.log.debug(ctx.i18n.t("log:keylog", {
                    peer: source,
                    key: line.toString("latin1"),
                }));
            });
        }
        if (ctx.config.tls.sslkeylog_file && (c instanceof tls.TLSSocket)) {
            const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
            c.on("keylog", (line) => keylogFile.write(line));
        }
        c.pause();
        ctx.associations.set(c, null);
        startTimes.set(c, new Date());
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        const extraLogData = {
            remoteFamily: c.remoteFamily,
            remoteAddress: c.remoteAddress,
            remotePort: c.remotePort,
        };
        if (ctx.associations.size >= ctx.config.maxConnections) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn", {
                source,
                max: ctx.config.maxConnections,
            }), extraLogData);
            return;
        }
        if ( // Check connections-per-address, which helps prevent Slow Loris attacks.
            c.remoteAddress
            && Array.from(ctx.associations.keys())
                .filter((s) => s.remoteAddress === c.remoteAddress)
                .length > ctx.config.maxConnectionsPerAddress
        ) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn_per_addr", {
                host: c.remoteAddress,
                source,
                max: ctx.config.maxConnectionsPerAddress,
            }), extraLogData);
            return;
        }
        c.on("data", () => { // Check data throughput of socket, which helps prevent Slow Loris attacks.
            const minutesSinceStart = Math.abs(differenceInMinutes(startTimes.get(c) ?? new Date(), new Date()));
            if (
                minutesSinceStart
                && ((c.bytesRead / minutesSinceStart) < ctx.config.tcp.minimumTransferSpeedInBytesPerMinute)
            ) {
                ctx.log.warn(ctx.i18n.t("log:slow_loris", {
                    host: c.remoteAddress,
                    source,
                    bps: ctx.config.tcp.minimumTransferSpeedInBytesPerMinute.toString(),
                }), extraLogData);
                c.destroy();
                startTimes.delete(c);
                ctx.associations.delete(c);
            }
        });
        c.setNoDelay(ctx.config.tcp.noDelay);
        if (ctx.config.tcp.timeoutInSeconds) {
            c.setTimeout(ctx.config.tcp.timeoutInSeconds * 1000);
            c.on("timeout", () => {
                ctx.log.warn(ctx.i18n.t("log:tcp_timeout", {
                    source,
                    seconds: ctx.config.tcp.timeoutInSeconds,
                }), extraLogData);
                c.destroy();
            });
        }
        ctx.log.info(ctx.i18n.t("log:transport_established", {
            source,
            transport: (c instanceof tls.TLSSocket) ? "LDAPS" : "LDAP",
        }));

        c.on("error", (e) => {
            ctx.log.error(ctx.i18n.t("log:socket_error", {
                host: c.remoteAddress,
                source,
                e: e.message,
            }), extraLogData);
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }), extraLogData);
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        try {
            const conn = new LDAPAssociation(ctx, c);
            ctx.associations.set(c, conn);
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
                host: c.remoteAddress,
                source,
            }), {
                ...extraLogData,
                stack: e?.stack,
            });
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            return;
        }
        c.resume();
    };
}

export
function attachUnboundEventListenersToITOTConnection (
    ctx: MeerkatContext,
    originalSocket: net.Socket | tls.TLSSocket, // Even if STARTTLS is used, you must use the original socket for "bookkeeping" in the associations index.
    source: string, // Just to avoid recalculating this.
    itot: ISOTransportOverTCPStack,
    startTimes: Map<net.Socket, Date>,
): void {
    const rose = rose_transport_from_itot_stack(ctx, itot);
    const properties = {
        remoteFamily: itot.network.socket.remoteFamily,
        remoteAddress: itot.network.socket.remoteAddress,
        remotePort: itot.network.socket.remotePort,
        administratorEmail: ctx.config.administratorEmail,
    };
    const handleWrongSequence = () => {
        rose.write_abort(AbortReason.unbound_request);
        startTimes.delete(itot.network.socket);
        ctx.associations.delete(itot.network.socket);
        // Note that this is logged below.
    };
    rose.events.on("request", handleWrongSequence);
    rose.events.on("bind", async (bind) => {
        let conn!: ClientAssociation;
        if (bind.protocol_id.isEqualTo(id_ac_directoryAccessAC)) {
            conn = new DAPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_directorySystemAC)) {
            conn = new DSPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_directoryOperationalBindingManagementAC)) {
            conn = new DOPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_shadowConsumerInitiatedAC)) {
            conn = new DISPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_shadowConsumerInitiatedAsynchronousAC)) {
            conn = new DISPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_shadowSupplierInitiatedAC)) {
            conn = new DISPAssociation(ctx, rose);
        }
        else if (bind.protocol_id.isEqualTo(id_ac_shadowSupplierInitiatedAsynchronousAC)) {
            conn = new DISPAssociation(ctx, rose);
        }
        else {
            // This branch should not be taken entirely, because the ACSE layer
            // in `./rose/itot.ts` should reject unsupported protocols.
            rose.write_abort(AbortReason.invalid_protocol);
            startTimes.delete(itot.network.socket);
            ctx.associations.delete(itot.network.socket);
            ctx.log.warn(ctx.i18n.t("log:unsupported_protocol", {
                protocol: bind.protocol_id.toString(),
                host: originalSocket.remoteAddress,
                source,
            }), {
                remoteFamily: itot.network.socket.remoteFamily,
                remoteAddress: itot.network.socket.remoteAddress,
                remotePort: itot.network.socket.remotePort,
                protocol: bind.protocol_id.toString(),
            });
            return;
        }
        const startTime = Date.now();
        try {
            await conn.attemptBind(bind.parameter);
            ctx.associations.set(originalSocket, conn);
            ctx.telemetry.trackRequest({
                name: "BIND",
                url: ctx.config.myAccessPointNSAPs?.map(naddrToURI).find((uri) => !!uri)
                    ?? `itot://meerkat.invalid:${ctx.config.itot.port}`,
                duration: Date.now() - startTime,
                resultCode: 200,
                success: true,
                properties,
                measurements: {
                    bytesRead: itot.network.socket.bytesRead,
                    bytesWritten: itot.network.socket.bytesWritten,
                },
            });
        } catch (e) {
            if (isDebugging) {
                console.error(e);
            }
            ctx.log.warn(ctx.i18n.t("log:bind_error", {
                host: originalSocket.remoteAddress,
                source,
                e,
            }), {
                remoteFamily: itot.network.socket.remoteFamily,
                remoteAddress: itot.network.socket.remoteAddress,
                remotePort: itot.network.socket.remotePort,
                protocol: bind.protocol_id.toString(),
            });
            rose.write_abort(AbortReason.reason_not_specified);
            startTimes.delete(itot.network.socket);
            ctx.associations.delete(itot.network.socket);
            ctx.telemetry.trackException({
                exception: e,
                properties,
                measurements: {
                    bytesRead: itot.network.socket.bytesRead,
                    bytesWritten: itot.network.socket.bytesWritten,
                },
            });
        }
    });
    itot.network.socket.on("close", () => {
        ctx.associations.delete(originalSocket);
        ctx.associations.delete(itot.network.socket);
        if (rose.socket) {
            ctx.associations.delete(rose.socket);
        }
        rose.events.removeAllListeners();
    });
}

/**
 * @summary Higher-order function that produces an IDM connection handler
 * @description
 *
 * This higher-order function gets an IDM connection handler.
 *
 * @param ctx The context object
 * @param startTimes A map of socket start times, indexed by socket reference
 * @returns An ITOT connection handler
 *
 * @function
 */
 function handleITOT (
    ctx: MeerkatContext,
    startTimes: Map<net.Socket, Date>,
): (socket: net.Socket | tls.TLSSocket) => void {
    return (c: net.Socket | tls.TLSSocket): void => {
        if (ctx.config.tls.log_tls_secrets && (c instanceof tls.TLSSocket)) {
            c.on("keylog", (line) => {
                ctx.log.debug(ctx.i18n.t("log:keylog", {
                    peer: source,
                    key: line.toString("latin1"),
                }));
            });
        }
        if (ctx.config.tls.sslkeylog_file && (c instanceof tls.TLSSocket)) {
            const keylogFile = createWriteStream(ctx.config.tls.sslkeylog_file, { flags: "a" });
            c.on("keylog", (line) => keylogFile.write(line));
        }
        c.pause();
        ctx.associations.set(c, null); // Index this socket, noting that it has no established association.
        startTimes.set(c, new Date());
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        const extraLogData = {
            remoteFamily: c.remoteFamily,
            remoteAddress: c.remoteAddress,
            remotePort: c.remotePort,
        };
        if (ctx.associations.size >= ctx.config.maxConnections) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn", {
                source,
                max: ctx.config.maxConnections,
            }), extraLogData);
            return;
        }
        if ( // Check connections-per-address, which helps prevent Slow Loris attacks.
            c.remoteAddress
            && Array.from(ctx.associations.keys())
                .filter((s) => s.remoteAddress === c.remoteAddress)
                .length > ctx.config.maxConnectionsPerAddress
        ) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn_per_addr", {
                host: c.remoteAddress,
                source,
                max: ctx.config.maxConnectionsPerAddress,
            }), extraLogData);
            return;
        }
        c.on("data", () => { // Check data throughput of socket, which helps prevent Slow Loris attacks.
            const minutesSinceStart = Math.abs(differenceInMinutes(startTimes.get(c) ?? new Date(), new Date()));
            if (
                minutesSinceStart
                && ((c.bytesRead / minutesSinceStart) < ctx.config.tcp.minimumTransferSpeedInBytesPerMinute)
            ) {
                ctx.log.warn(ctx.i18n.t("log:slow_loris", {
                    host: c.remoteAddress,
                    source,
                    bps: ctx.config.tcp.minimumTransferSpeedInBytesPerMinute.toString(),
                }), extraLogData);
                c.destroy();
                startTimes.delete(c);
                ctx.associations.delete(c);
            }
        });
        c.setNoDelay(ctx.config.tcp.noDelay);
        if (ctx.config.tcp.timeoutInSeconds) {
            c.setTimeout(ctx.config.tcp.timeoutInSeconds * 1000);
            c.on("timeout", () => {
                ctx.log.warn(ctx.i18n.t("log:tcp_timeout", {
                    source,
                    seconds: ctx.config.tcp.timeoutInSeconds,
                }), extraLogData);
                c.destroy();
            });
        }
        ctx.log.info(ctx.i18n.t("log:transport_established", {
            source,
            transport: (c instanceof tls.TLSSocket) ? "ITOTS" : "ITOT",
        }), extraLogData);

        c.on("error", (e) => {
            ctx.log.error(ctx.i18n.t("log:socket_error", {
                host: c.remoteAddress,
                source,
                e: e.message,
            }), {
                ...extraLogData,
                stack: e?.stack,
            });
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }), extraLogData);
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        try {
            const itot = create_itot_stack(
                c,
                {
                    sessionCaller: false,
                    transportCaller: false,
                    abort_timeout_ms: ctx.config.itot.abort_timeout_ms,
                    max_nsdu_size: ctx.config.itot.max_nsdu_size,
                    max_tsdu_size: ctx.config.itot.max_tsdu_size,
                    max_tpdu_size: ctx.config.itot.max_tpdu_size,
                    max_ssdu_size: ctx.config.itot.max_ssdu_size,
                    max_presentation_contexts: ctx.config.itot.max_presentation_contexts,
                    // acse_authenticate
                },
            );
            attachUnboundEventListenersToITOTConnection(ctx, c, source, itot, startTimes);
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
                host: c.remoteAddress,
                source,
            }), {
                ...extraLogData,
                stack: e?.stack,
            });
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            return;
        }
        c.resume();
    };
}


/**
 * @summary The entry point of the server
 * @description
 *
 * This is the entry point of the server. This function prepares Meerkat DSA's
 * internal index of schema objects, checks for updates, cleans up from the
 * last run, runs an init script, starts up network sockets, and terminates any
 * expired operational bindings.
 *
 * @function
 * @async
 */
export default
async function main (): Promise<void> {
    await ctx.telemetry.init();

    process.on("uncaughtException", (e) => {
        console.error("UNCAUGHT_EXCEPTION");
        console.error(e);
        console.error("This is a bug. Please report it to https://github.com/Wildboar-Software/directory/issues.");
        process.exit(11);
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.error("UNHANDLED_REJECTION");
        console.error("PROMISE: ", promise);
        console.error("REASON: ", reason);
        console.error("This is a bug. Please report it to https://github.com/Wildboar-Software/directory/issues.");
        process.exit(13);
    });

    const packageJSON = await import("../../package.json").catch(() => {});
    const versionSlug = packageJSON?.default
        ? packageJSON?.default.version
        : packageJSON?.version;
    ctx.dsa.version = versionSlug ?? ctx.dsa.version;
    const preconnectTimestamp = Date.now();
    await ctx.db.$connect();
    ctx.telemetry.trackAvailability({
        name: "db",
        duration: Date.now() - preconnectTimestamp,
        success: true,
        id: randomUUID(),
        message: "Database connected.",
        runLocation: __filename,
        properties: {
            administratorEmail: ctx.config.administratorEmail,
        },
    });

    if (ctx.dsa.version) {
        ctx.log.info(ctx.i18n.t("log:starting_meerkat_version", {
            version: ctx.dsa.version,
        }));
    } else {
        ctx.log.info(ctx.i18n.t("log:starting_meerkat"));
    }
    process.title = PROCESS_NAME;
    ctx.log.info(ctx.i18n.t("log:process_info", {
        name: PROCESS_NAME,
        pid: process.pid,
        ppid: process.ppid,
        cwd: process.cwd(),
    }));

    ctx.db.enqueuedListResult.deleteMany().then().catch();
    ctx.db.enqueuedSearchResult.deleteMany().then().catch();

    const signingCertPath = ctx.config.signing.certPath;

    if (signingCertPath && signingCertPath.length === 0) {
        ctx.log.warn(ctx.i18n.t("log:cert_chain_no_certificates", {
            envvar: process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE,
        }));
        process.exit(1);
    }

    if (!signingCertPath || !ctx.config.signing?.key) {
        ctx.log.warn(ctx.i18n.t("log:no_dsa_keypair"));
    } else {
        const dsaCert = signingCertPath[signingCertPath.length - 1];
        // Yes, this is where the DSA's AE-Title is set.
        ctx.dsa.accessPoint.ae_title.rdnSequence = [
            ...dsaCert.toBeSigned.subject.rdnSequence,
        ];
    }

    await loadDIT(ctx);
    // The ordering of these is important.
    // Loading LDAP syntaxes before attribute types allows us to use the names instead of OIDs.
    await loadObjectClasses(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_object_classes"));
    loadLDAPSyntaxes(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_ldap_syntaxes"));
    await loadAttributeTypes(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_attribute_types"));
    loadMatchingRules(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_matching_rules"));
    await loadContextTypes(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_context_types"));
    await loadNameForms(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_name_forms"));
    await loadObjectIdentifierNames(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_oid_names"));
    await loadDSARelationships(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_dsa_relationships"));

    if (process.env.MEERKAT_INIT_JS) {
        const importPath = (os.platform() === "win32")
            ? (() => {
                const parsed = path.parse(path.join(process.cwd()));
                if (path.isAbsolute(process.env.MEERKAT_INIT_JS)) {
                    return process.env.MEERKAT_INIT_JS
                        .replace(parsed.root, "/")
                        .replace(/\\/g, "/");
                }
                return path.posix.join(
                    process.cwd()
                        .replace(parsed.root, "/")
                        .replace(/\\/g, "/"),
                    process.env.MEERKAT_INIT_JS,
                );
            })()
            : path.isAbsolute(process.env.MEERKAT_INIT_JS)
                ? process.env.MEERKAT_INIT_JS
                : path.join(process.cwd(), process.env.MEERKAT_INIT_JS);
        const mod = await import(/* webpackIgnore: true */ importPath);
        if (("default" in mod) && (typeof mod.default === "function")) {
            await mod.default(ctx);
        } else if (("init" in mod) && (typeof mod.init === "function")) {
            await mod.init(ctx);
        } else {
            ctx.log.warn(ctx.i18n.t("log:invalid_init_js"));
        }
    }

    const tlsOptions: tls.TlsOptions = {
        ...ctx.config.tls,
        rejectUnauthorized: ctx.config.tls.rejectUnauthorizedClients,
        enableTrace: isDebugging,
    };
    const onOCSPRequestCallback = getOnOCSPRequestCallback(ctx, ctx.config.tls);

    const startTimes: Map<net.Socket, Date> = new Map();
    // const blocklist: net.BlockList = new net.BlockList();
    if (ctx.config.idm.port) {
        const idmServer = net.createServer(handleIDM(ctx, startTimes));
        idmServer.on("error", (err) => {
            ctx.log.error(ctx.i18n.t("log:server_error", {
                protocol: "IDM",
                e: err?.message,
            }));
        });
        idmServer.listen(ctx.config.idm.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "IDM",
                port: ctx.config.idm.port,
            }));
        });
    }
    if (
        ctx.config.idms.port
        && (
            (ctx.config.tls.cert && ctx.config.tls.key)
            || ctx.config.tls.pfx
        )
    ) {
        const idmsServer = tls.createServer(tlsOptions, handleIDM(ctx, startTimes));
        idmsServer.on("error", (err) => {
            ctx.log.error(ctx.i18n.t("log:server_error", {
                protocol: "IDMS",
                e: err?.message,
            }));
        });
        idmsServer.on("OCSPRequest", onOCSPRequestCallback);
        idmsServer.listen(ctx.config.idms.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "IDMS",
                port: ctx.config.idms.port,
            }));
        });
    }
    if (ctx.config.ldap.port) {
        const ldapServer = net.createServer(handleLDAP(ctx, startTimes));
        ldapServer.listen(ctx.config.ldap.port, async () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "LDAP",
                port: ctx.config.ldap.port,
            }));
        });
    }
    if (
        ctx.config.ldaps.port
        && (
            (ctx.config.tls.cert && ctx.config.tls.key)
            || ctx.config.tls.pfx
        )
    ) {
        const ldapsServer = tls.createServer(tlsOptions, handleLDAP(ctx, startTimes));
        ldapsServer.on("OCSPRequest", onOCSPRequestCallback);
        ldapsServer.listen(ctx.config.ldaps.port, async () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "LDAPS",
                port: ctx.config.ldaps.port,
            }));
        });
    }

    if (ctx.config.itot.port) {
        const itotServer = net.createServer(handleITOT(ctx, startTimes));
        itotServer.on("error", (err) => {
            ctx.log.error(ctx.i18n.t("log:server_error", {
                protocol: "ITOT",
                e: err?.message,
            }));
        });
        itotServer.listen(ctx.config.itot.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "ITOT",
                port: ctx.config.itot.port,
            }));
        });
    }

    if (ctx.config.itots.port) {
        tls
        const itotsServer = tls.createServer(tlsOptions, handleITOT(ctx, startTimes));
        itotsServer.on("OCSPRequest", onOCSPRequestCallback);
        itotsServer.on("error", (err) => {
            ctx.log.error(ctx.i18n.t("log:server_error", {
                protocol: "ITOTS",
                e: err?.message,
            }));
        });
        itotsServer.listen(ctx.config.itots.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "ITOTS",
                port: ctx.config.itots.port,
            }));
        });
    }

    // Web admin portal
    if (ctx.config.webAdmin.port) {
        // I tried making AppModule a dynamic module that would take `ctx` as an argument, but that did not work. See:
        // See: https://github.com/nestjs/nest/issues/671
        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            logger: isDebugging ? undefined : false,
            httpsOptions: ctx.config.webAdmin.useTLS
                ? {
                    ca: ctx.config.tls.ca,
                    cert: ctx.config.tls.cert,
                    key: ctx.config.tls.key,
                    pfx: ctx.config.tls.pfx,
                    ciphers: ctx.config.tls.ciphers,
                    honorCipherOrder: ctx.config.tls.honorCipherOrder,
                    crl: ctx.config.tls.crl,
                    passphrase: ctx.config.tls.passphrase,
                    rejectUnauthorized: ctx.config.tls.rejectUnauthorizedClients,
                    requestCert: ctx.config.tls.requestCert,
                }
                : undefined,
        });
        app.useStaticAssets(path.join(__dirname, "assets", "static"));
        app.setBaseViewsDir(path.join(__dirname, "assets", "views"));
        app.setViewEngine("hbs");
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            skipMissingProperties: false,
            forbidNonWhitelisted: true,
        }));
        app.use(cookieParser()); // Needed by csurf.
        app.use(parseFormData);
        app.use(csurf({
            cookie: {
                sameSite: "strict",
                httpOnly: true,
            },
        }));
        app.use(applyXSRFCookie);
        await app.listen(ctx.config.webAdmin.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: ctx.config.webAdmin.useTLS ? "HTTPS" : "HTTP",
                port: ctx.config.webAdmin.port,
            }));
        });
    }

    if (ctx.config.sentinelDomain) {
        setInterval(async () => {
            const records = await dns.resolveTxt(ctx.config.sentinelDomain!)
                .catch(() => []);
            for (const record of records) {
                const fullRecord: string = record.join(" ").trim().toLowerCase();
                switch (fullRecord) {
                case ("meerkat:kill"): {
                    ctx.log.error(ctx.i18n.t("log:killed_by_sentinel"));
                    process.exit(503);
                    break;
                }
                case ("meerkat:hibernate"): {
                    ctx.log.error(ctx.i18n.t("log:hibernated_by_sentinel"));
                    ctx.dsa.sentinelTriggeredHibernation = new Date();
                    break;
                }
                default: {
                    continue;
                }
                }
            }
        }, 300000);
    }

    ctx.log.info(ctx.i18n.t("log:docs"));

    if (versionSlug) {
        checkForUpdates(ctx, versionSlug).catch();
    }

    if (ctx.config.bulkInsertMode) {
        ctx.log.warn(ctx.i18n.t("log:bulk_insert_mode"));
    }

    cacheNamingContexts(ctx); // INTENTIONAL_NO_AWAIT

    setInterval(() => {
        const dbReportPromise = createDatabaseReport(ctx);
        dbReportPromise.catch();
        dbReportPromise.then((report) => {
            ctx.telemetry.trackEvent({
                name: "dbreport",
                properties: {
                    ...flatten({
                        server: getServerStatistics(ctx),
                    }),
                    ...report,
                    administratorEmail: ctx.config.administratorEmail,
                },
            });
        }).catch(); // This handles the new promise returned by .then().
    }, 604_800_000); // Weekly

    /**
     * This section handles the delayed termination of operational bindings that
     * were not terminated before the DSA shut down.
     */
    const now = new Date();
    const obsToExpire = await ctx.db.operationalBinding.findMany({
        where: {
            terminated_time: {
                gte: new Date(),
            },
        },
    });
    obsToExpire.forEach((ob) => {
        if (!ob.terminated_time) {
            return;
        }
        safeSetTimeout(() => terminate(ctx, ob.id), Math.max(differenceInMilliseconds(ob.terminated_time, now), 1000));
        ctx.log.warn(ctx.i18n.t("log:terminating_ob", {
            obid: ob.id,
            time: ob.terminated_time.toISOString(),
        }));
    });

    // This is done here to handle concurrency.
    setInterval(async () => {
        let job = ctx.jobQueue.shift();
        while (job) {
            await job();
            job = ctx.jobQueue.shift();
        }
    }, 5000);

    const periodic_sobs_to_update = await ctx.db.operationalBinding.findMany({
        where: {
            /**
             * This is a hack for getting the latest version: we are selecting
             * operational bindings that have no next version.
             */
            next_version: {
                none: {},
            },
            binding_type: id_op_binding_shadow.toString(),
            periodic_updateInterval: {
                gt: 0,
            },
            accepted: true,
            terminated_time: null,
            validity_start: {
                lte: now,
            },
            OR: [
                {
                    validity_end: null,
                },
                {
                    validity_end: {
                        gte: now,
                    },
                },
            ],
        },
        select: {
            id: true,
            binding_identifier: true,
            agreement_ber: true,
            periodic_updateInterval: true,
            periodic_beginTime: true,
            periodic_windowSize: true,
            requested_time: true,
            responded_time: true,
            initiator: true,
            outbound: true,
        },
    });
    for (const sob of periodic_sobs_to_update) {
        const el = new BERElement();
        el.fromBytes(sob.agreement_ber);
        const agreement = _decode_ShadowingAgreementInfo(el);
        const ob_time: Date = sob.responded_time
            ? new Date(Math.max(sob.requested_time.valueOf(), sob.responded_time.valueOf()))
            : sob.requested_time;
        const iAmSupplier: boolean = (
            // The initiator was the supplier and this DSA was the initiator...
            ((sob.initiator === OperationalBindingInitiator.ROLE_A) && (sob.outbound))
            // ...or, the initiator was the consumer, and this DSA was NOT the initiator.
            || ((sob.initiator === OperationalBindingInitiator.ROLE_B) && (!sob.outbound))
        );
        scheduleShadowUpdates(ctx, agreement, sob.id, sob.binding_identifier, ob_time, iAmSupplier);
    }
}
