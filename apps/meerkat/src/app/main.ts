import type { ClientConnection, Context } from "@wildboar/meerkat-types";
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
} from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/Abort.ta";
import { IDMConnection } from "@wildboar/idm";
import { dap_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dap-ip.oa";
import { dsp_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dsp-ip.oa";
import { dop_ip } from "@wildboar/x500/src/lib/modules/DirectoryIDMProtocols/dop-ip.oa";
import DAPConnection from "./dap/DAPConnection";
import DSPConnection from "./dsp/DSPConnection";
import DOPConnection from "./dop/DOPConnection";
import {
    _decode_DirectoryBindArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/DirectoryBindArgument.ta";
import {
    _decode_DSABindArgument,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/DSABindArgument.ta";
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
import { differenceInMilliseconds } from "date-fns";
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

const DEFAULT_IDM_TCP_PORT: number = 4632;
const DEFAULT_LDAP_TCP_PORT: number = 1389;
const DEFAULT_LDAPS_TCP_PORT: number = 1636;

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

export default
async function main (): Promise<void> {
    const packageJSON = await import("package.json").catch(() => {});
    const versionSlug = packageJSON?.default
        ? packageJSON?.default.version
        : packageJSON?.version;

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
    await loadObjectIdentifierNames(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_oid_names"));
    loadMatchingRules(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_matching_rules"));
    loadContextTypes(ctx);
    ctx.log.debug(ctx.i18n.t("log:loaded_context_types"));

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

    const associations: Map<net.Socket, ClientConnection> = new Map();
    const idmServer = net.createServer((c) => {
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        try {
            ctx.log.info(ctx.i18n.t("log:transport_established", {
                source,
                transport: "IDM",
            }));
            const idm = new IDMConnection(c);
            idm.events.on("bind", (idmBind: IdmBind) => {
                const existingAssociation = associations.get(c);
                if (existingAssociation) {
                    ctx.log.error(ctx.i18n.t("log:double_bind_attempted", {
                        source,
                        protocol: idmBind.protocolID.toString(),
                    }))
                    idm.writeAbort(Abort_reasonNotSpecified).then(() => idm.close());
                    associations.delete(c);
                    return;
                }
                if (idmBind.protocolID.isEqualTo(dap_ip["&id"]!)) {
                    const dba = _decode_DirectoryBindArgument(idmBind.argument);
                    const conn = new DAPConnection(ctx, idm, dba);
                    if (conn.boundNameAndUID) {
                        associations.set(c, conn);
                    }
                } else if (idmBind.protocolID.isEqualTo(dsp_ip["&id"]!)) {
                    const dba = _decode_DSABindArgument(idmBind.argument);
                    const conn = new DSPConnection(ctx, idm, dba);
                    if (conn.boundNameAndUID) {
                        associations.set(c, conn);
                    }
                } else if (idmBind.protocolID.isEqualTo(dop_ip["&id"]!)) {
                    const dba = _decode_DSABindArgument(idmBind.argument);
                    const conn = new DOPConnection(ctx, idm, dba);
                    if (conn.boundNameAndUID) {
                        associations.set(c, conn);
                    }
                } else {
                    ctx.log.error(ctx.i18n.t("log:unsupported_protocol", {
                        protocol: idmBind.protocolID.toString(),
                    }));
                }
            });
            idm.events.on("unbind", () => {
                // c.end(); You don't actually have to close the TCP connection. It could be recycled.
                associations.delete(c);
            });
        } catch (e) {
            ctx.log.error(ctx.i18n.t("log:unhandled_exception", {
                e: e.message,
            }));
        }

        c.on("error", (e) => {
            ctx.log.error(ctx.i18n.t("log:socket_error", {
                source,
                e: e.message,
            }));
            c.end();
            associations.delete(c);
        });

        c.on("close", () => {
            ctx.log.info(ctx.i18n.t("log:socket_closed", {
                source,
            }));
            associations.delete(c);
        });

    });
    idmServer.on("error", (err) => {
        ctx.log.error(ctx.i18n.t("log:server_error", {
            protocol: "IDM",
            e: err.message,
        }));
    });

    const idmPort = process.env.MEERKAT_IDM_PORT
        ? Number.parseInt(process.env.MEERKAT_IDM_PORT, 10)
        : DEFAULT_IDM_TCP_PORT;

    idmServer.listen(idmPort, () => {
        ctx.log.info(ctx.i18n.t("log:listening", {
            protocol: "IDM",
            port: idmPort,
        }));
    });

    const ldapServer = net.createServer((c) => {
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        ctx.log.info(ctx.i18n.t("log:transport_established", {
            source,
            transport: "LDAP",
        }));
        const conn = new LDAPConnection(ctx, c);
        if (conn.boundNameAndUID) {
            associations.set(c, conn);
        }
        c.on("end", () => {
            associations.delete(c);
        });
    });

    const ldapPort = process.env.MEERKAT_LDAP_PORT
        ? Number.parseInt(process.env.MEERKAT_LDAP_PORT, 10)
        : DEFAULT_LDAP_TCP_PORT;

    ldapServer.listen(ldapPort, async () => {
        ctx.log.info(ctx.i18n.t("log:listening", {
            protocol: "LDAP",
            port: ldapPort,
        }));
    });

    if (process.env.MEERKAT_SERVER_TLS_CERT && process.env.MEERKAT_SERVER_TLS_KEY) {
        const ldapsServer = tls.createServer({
            cert: await fs.readFile(process.env.MEERKAT_SERVER_TLS_CERT),
            key: await fs.readFile(process.env.MEERKAT_SERVER_TLS_KEY),
        }, (c) => {
            const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
            ctx.log.info(ctx.i18n.t("log:transport_established", {
                source,
                transport: "LDAPS",
            }));
            const conn = new LDAPConnection(ctx, c);
            if (conn.boundNameAndUID) {
                associations.set(c, conn);
            }
            c.on("end", () => {
                associations.delete(c);
            });
        });
        const ldapsPort = process.env.MEERKAT_LDAPS_PORT
            ? Number.parseInt(process.env.MEERKAT_LDAPS_PORT, 10)
            : DEFAULT_LDAPS_TCP_PORT;
        ldapsServer.listen(ldapsPort, async () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "LDAPS",
                port: ldapsPort,
            }));
        });
    }

    // Web admin portal
    if (process.env.MEERKAT_WEB_ADMIN_PORT) {
        // I tried making AppModule a dynamic module that would take `ctx` as an argument, but that did not work. See:
        // See: https://github.com/nestjs/nest/issues/671
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.useStaticAssets(path.join(__dirname, 'assets', 'static'));
        app.setBaseViewsDir(path.join(__dirname, 'assets', 'views'));
        app.setViewEngine('hbs');
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            skipMissingProperties: false,
            forbidNonWhitelisted: true,
        }));
        const port = Number.parseInt(process.env.MEERKAT_WEB_ADMIN_PORT, 10);
        await app.listen(port, () => {
            ctx.log.info(ctx.i18n.t("log:listening", {
                protocol: "HTTP",
                port: port,
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
        setTimeout(() => terminate(ctx, ob.id), Math.max(differenceInMilliseconds(ob.terminated_time, now), 1000));
        ctx.log.warn(ctx.i18n.t("log:terminating_ob", {
            obid: ob.id,
            time: ob.terminated_time.toISOString(),
        }));
    });
}
