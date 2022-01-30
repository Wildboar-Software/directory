import type { ClientAssociation, Context } from "@wildboar/meerkat-types";
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as net from "net";
import * as tls from "tls";
import * as fs from "fs/promises";
import * as path from "path";
import * as os from "os";
import { ObjectIdentifier } from "asn1-ts";
import { IdmBind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
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
import DAPConnection from "./dap/DAPConnection";
import DSPConnection from "./dsp/DSPConnection";
import DOPConnection from "./dop/DOPConnection";
import LDAPConnection from "./ldap/LDAPConnection";
import loadDIT from "./init/loadDIT";
import loadAttributeTypes from "./init/loadAttributeTypes";
import loadObjectClasses from "./init/loadObjectClasses";
import loadLDAPSyntaxes from "./init/loadLDAPSyntaxes";
import loadMatchingRules from "./init/loadMatchingRules";
import loadContextTypes from "./init/loadContextTypes";
import loadObjectIdentifierNames from "./init/loadObjectIdentifierNames";
import ctx from "./ctx";
import terminate from "./dop/terminateByID";
import { differenceInMilliseconds, differenceInMinutes } from "date-fns";
import * as dns from "dns/promises";
import axios from "axios";
import {
    emailSignupEndpoint,
    updatesDomain,
} from "./constants";
import createDatabaseReport from "./telemetry/createDatabaseReport";
import semver from "semver";
import { createPrivateKey } from "crypto";
import decodePkiPathFromPEM from "./utils/decodePkiPathFromPEM";
import isDebugging from "is-debugging";
import { setTimeout as safeSetTimeout } from "safe-timers";


async function checkForUpdates (ctx: Context, currentVersionString: string): Promise<void> {
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

const getIdmBufferLengthGate = (ctx: Context, idm: IDMConnection, source: string) => (addedBytes: number) => {
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

const getIdmPduLengthGate = (ctx: Context, idm: IDMConnection, source: string) => (addedBytes: number) => {
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
        }));
        idm.writeAbort(Abort_resourceLimitation);
        return;
    }
    const numberOfSegments: number = (idm.getNumberOfSegmentsInPDU() + 1);
    if (numberOfSegments > ctx.config.idm.maxSegments) {
        ctx.log.warn(ctx.i18n.t("log:idm_segment_limit", {
            host: idm.s.remoteAddress,
            source,
            limit: ctx.config.idm.maxSegments,
        }));
        idm.writeAbort(Abort_resourceLimitation);
        return;
    }
};

const PROCESS_NAME: string = "Meerkat DSA";

// This function is necessary, because the TCP connection can be recycled
// between multiple binds. An analog of this need not exist for LDAP, because
// the LDAP connection alone monopolizes binds and unbinds, unlike IDM, which
// can be used to transport multiple protocols.
function attachUnboundEventListenersToIDMConnection (
    ctx: Context,
    originalSocket: net.Socket | tls.TLSSocket, // Even if STARTTLS is used, you must use the original socket for "bookkeeping" in the associations index.
    source: string, // Just to avoid recalculating this.
    idm: IDMConnection,
    startTimes: Map<net.Socket, Date>,
) {
    idm.events.on("startTLS", () => {
        ctx.log.debug(ctx.i18n.t("log:starttls_established", {
            source,
            context: "transport",
        }));
    });
    idm.events.on("socketError", (e) => {
        ctx.log.error(ctx.i18n.t("log:socket_error", {
            host: originalSocket.remoteAddress,
            source,
            e,
        }));
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
    };
    idm.events.on("request", handleWrongSequence);
    idm.events.on("bind", async (idmBind: IdmBind) => {
        let conn!: ClientAssociation;
        if (idmBind.protocolID.isEqualTo(dap_ip["&id"]!) && ctx.config.dap.enabled) {
            conn = new DAPConnection(ctx, idm);
        } else if (idmBind.protocolID.isEqualTo(dsp_ip["&id"]!) && ctx.config.dsp.enabled) {
            conn = new DSPConnection(ctx, idm);
        } else if (idmBind.protocolID.isEqualTo(dop_ip["&id"]!) && ctx.config.dop.enabled) {
            conn = new DOPConnection(ctx, idm);
        } else {
            ctx.log.warn(ctx.i18n.t("log:unsupported_protocol", {
                protocol: idmBind.protocolID.toString(),
                host: originalSocket.remoteAddress,
                source,
            }));
            idm.writeAbort(Abort_invalidProtocol);
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            return;
        }
        try {
            await conn.attemptBind(idmBind.argument);
            ctx.associations.set(originalSocket, conn);
        } catch (e) {
            idm.writeAbort(Abort_reasonNotSpecified);
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            // TODO: Log the error.
        }
    });
    idm.events.on("unbind", () => {
        // c.destroy(); You don't actually have to close the TCP connection. It could be recycled.
        ctx.associations.set(originalSocket, null);
        idm.events.removeAllListeners();
        // Recursive, but not really.
        attachUnboundEventListenersToIDMConnection(ctx, originalSocket, source, idm, startTimes);
    });
    idm.events.on("warning", (warningCode) => {
        switch (warningCode) {
        case (warnings.IDM_WARN_SLOW_LORIS): {
            return;
        }
        case (warnings.IDM_WARN_BIG_INVOKE_ID): {
            return;
        }
        case (warnings.IDM_WARN_NEGATIVE_INVOKE_ID): {
            return;
        }
        case (warnings.IDM_WARN_DOUBLE_START_TLS): {
            ctx.log.warn(ctx.i18n.t("log:double_starttls", {
                host: idm.s.remoteAddress,
                source,
            }));
            return;
        }
        case (warnings.IDM_WARN_PADDING_AFTER_PDU): {
            return;
        }
        case (warnings.IDM_WARN_MULTI_BIND): {
            // This is almost always nefarious activity. A malicious user may
            // attempt to circumvent the rate-limiting of bind requests by
            // issuing multiple bind requests back-to-back.
            // Meerkat DSA will require remote hosts to wait for a bind response
            // before attempting another bind.
            ctx.log.warn(ctx.i18n.t("log:double_bind_attempted", {
                source,
                host: idm.s.remoteAddress,
            }));
            idm.writeAbort(Abort_reasonNotSpecified);
            startTimes.delete(idm.s);
            ctx.associations.delete(idm.s);
            return;
        }
        case (warnings.IDM_WARN_BAD_SEQUENCE): {
            ctx.log.warn(ctx.i18n.t("log:idm_bad_sequence", {
                host: idm.s.remoteAddress,
                source,
            }));
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

function handleIDM (
    ctx: Context,
    startTimes: Map<net.Socket, Date>,
): (socket: net.Socket | tls.TLSSocket) => void {
    return (c: net.Socket | tls.TLSSocket): void => {
        c.pause();
        ctx.associations.set(c, null); // Index this socket, noting that it has no established association.
        startTimes.set(c, new Date());
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        if (ctx.associations.size >= ctx.config.maxConnections) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn", {
                source,
                max: ctx.config.maxConnections,
            }));
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
            }));
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
                }));
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
                }));
                c.destroy();
            });
        }
        ctx.log.info(ctx.i18n.t("log:transport_established", {
            source,
            transport: (c instanceof tls.TLSSocket) ? "IDMS" : "IDM",
        }));

        c.on("error", (e) => {
            ctx.log.error(ctx.i18n.t("log:socket_error", {
                host: originalSocket.remoteAddress,
                source,
                e: e.message,
            }));
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }));
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        try {
            const idm = new IDMConnection(c, ctx.config.tls);
            attachUnboundEventListenersToIDMConnection(ctx, c, source, idm, startTimes);
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
                host: c.remoteAddress,
                source,
            }));
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            return;
        }
        c.resume();
    };
}

function handleLDAP (
    ctx: Context,
    startTimes: Map<net.Socket, Date>,
): (socket: net.Socket | tls.TLSSocket) => void {
    return (c) => {
        c.pause();
        ctx.associations.set(c, null);
        startTimes.set(c, new Date());
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        if (ctx.associations.size >= ctx.config.maxConnections) {
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            ctx.log.warn(ctx.i18n.t("log:tcp_max_conn", {
                source,
                max: ctx.config.maxConnections,
            }));
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
            }));
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
                }));
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
                }));
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
            }));
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }));
            startTimes.delete(c);
            ctx.associations.delete(c);
        });

        try {
            const conn = new LDAPConnection(ctx, c);
            c.on("end", () => {
                ctx.db.enqueuedSearchResult.deleteMany({
                    where: {
                        connection_uuid: conn.id,
                    },
                }).then().catch();
                ctx.db.enqueuedListResult.deleteMany({
                    where: {
                        connection_uuid: conn.id,
                    },
                }).then().catch();
                ctx.associations.delete(c);
            });
            ctx.associations.set(c, conn);
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
                host: c.remoteAddress,
                source,
            }));
            c.destroy();
            startTimes.delete(c);
            ctx.associations.delete(c);
            return;
        }
        c.resume();
    };
}

export default
async function main (): Promise<void> {
    const packageJSON = await import("package.json").catch(() => {});
    const versionSlug = packageJSON?.default
        ? packageJSON?.default.version
        : packageJSON?.version;

    if (versionSlug) {
        ctx.log.info(ctx.i18n.t("log:starting_meerkat_version", {
            version: versionSlug,
        }));
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

    if (
        process.env.MEERKAT_SIGNING_CERT_CHAIN
        && process.env.MEERKAT_SIGNING_KEY
    ) {
        const chainFile = await fs.readFile(process.env.MEERKAT_SIGNING_CERT_CHAIN, { encoding: "utf-8" });
        const keyFile = await fs.readFile(process.env.MEERKAT_SIGNING_KEY, { encoding: "utf-8" });
        const pkiPath = decodePkiPathFromPEM(chainFile);
        const dsaCert = pkiPath[pkiPath.length - 1];
        if (!dsaCert) {
            ctx.log.error(ctx.i18n.t("err:cert_chain_no_certificates", {
                envvar: process.env.MEERKAT_SIGNING_CERT_CHAIN,
            }));
            process.exit(1);
        }
        ctx.dsa.signing = {
            key: createPrivateKey({
                key: keyFile,
                format: "pem",
            }),
            certPath: pkiPath,
        };
        ctx.dsa.accessPoint.ae_title.rdnSequence.push(...dsaCert.toBeSigned.subject.rdnSequence);
    } else {
        ctx.log.warn(ctx.i18n.t("log:no_dsa_keypair"));
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
    loadContextTypes(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_context_types"));
    await loadObjectIdentifierNames(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_oid_names"));

    const nameForms = await ctx.db.nameForm.findMany();
    for (const nameForm of nameForms) {
        ctx.nameForms.set(nameForm.identifier, {
            id: ObjectIdentifier.fromString(nameForm.identifier),
            name: nameForm.name
                ? [ nameForm.name ]
                : undefined,
            description: nameForm.description ?? undefined,
            obsolete: nameForm.obsolete,
            namedObjectClass: ObjectIdentifier.fromString(nameForm.namedObjectClass),
            mandatoryAttributes: nameForm.mandatoryAttributes
                .split(" ")
                .map(ObjectIdentifier.fromString),
            optionalAttributes: nameForm.optionalAttributes
                ?.split(" ")
                .map(ObjectIdentifier.fromString) ?? [],
        });
    }

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
        enableTrace: isDebugging,
    };

    const startTimes: Map<net.Socket, Date> = new Map();
    // const blocklist: net.BlockList = new net.BlockList();
    if (ctx.config.idm.port) {
        const idmServer = net.createServer(handleIDM(ctx, startTimes));
        idmServer.on("error", (err) => {
            ctx.log.error(ctx.i18n.t("log:server_error", {
                protocol: "IDM",
                e: err.message,
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
                e: err.message,
            }));
        });
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
        ldapsServer.listen(ctx.config.ldaps.port, async () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "LDAPS",
                port: ctx.config.ldaps.port,
            }));
        });
    }

    // Web admin portal
    if (ctx.config.webAdmin.port) {
        // I tried making AppModule a dynamic module that would take `ctx` as an argument, but that did not work. See:
        // See: https://github.com/nestjs/nest/issues/671
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.useStaticAssets(path.join(__dirname, "assets", "static"));
        app.setBaseViewsDir(path.join(__dirname, "assets", "views"));
        app.setViewEngine("hbs");
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            skipMissingProperties: false,
            forbidNonWhitelisted: true,
        }));
        await app.listen(ctx.config.webAdmin.port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "HTTP",
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

    if (ctx.config.administratorEmail) {
        try {
            await axios.post(emailSignupEndpoint, {
                administratorEmailAddress: ctx.config.administratorEmail,
            }).catch();
        } catch {} // eslint-disable-line
    }

    if (versionSlug) {
        checkForUpdates(ctx, versionSlug).catch();
    }

    if (ctx.config.bulkInsertMode) {
        ctx.log.warn(ctx.i18n.t("log:bulk_insert_mode"));
    }

    setInterval(() => {
        createDatabaseReport(ctx)
            .then(ctx.telemetry.sendEvent)
            .catch();
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
}
