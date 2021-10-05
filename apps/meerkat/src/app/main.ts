import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as net from "net";
import * as tls from "tls";
import * as fs from "fs/promises";
import * as path from "path";
import { ObjectIdentifier } from "asn1-ts";
import { IdmBind } from "@wildboar/x500/src/lib/modules/IDMProtocolSpecification/IdmBind.ta";
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

const DEFAULT_IDM_TCP_PORT: number = 4632;
const DEFAULT_LDAP_TCP_PORT: number = 1389;
const DEFAULT_LDAPS_TCP_PORT: number = 1636;

export default
async function main (): Promise<void> {
    const packageJSON = await import("package.json")
        .catch(() => undefined);
    const versionSlug = packageJSON?.default.version.replace(/\./g, "-");

    await loadDIT(ctx);
    // The ordering of these is important.
    // Loading LDAP syntaxes before attribute types allows us to use the names instead of OIDs.
    await loadObjectClasses(ctx);
    ctx.log.debug("Loaded object classes.");
    loadLDAPSyntaxes(ctx);
    ctx.log.debug("Loaded LDAP syntaxes.");
    await loadAttributeTypes(ctx);
    ctx.log.debug("Loaded attribute types.");
    await loadObjectIdentifierNames(ctx);
    ctx.log.debug("Loaded object identifier names.");
    loadMatchingRules(ctx);
    ctx.log.debug("Loaded matching rules.");
    loadContextTypes(ctx);
    ctx.log.debug("Loaded context types.");

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

    const idmServer = net.createServer((c) => {
        try {
            const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
            ctx.log.info(`IDM client connected from ${source}.`);
            const idm = new IDMConnection(c); // eslint-disable-line

            idm.events.on("bind", (idmBind: IdmBind) => {
                if (idmBind.protocolID.isEqualTo(dap_ip["&id"]!)) {
                    const dba = _decode_DirectoryBindArgument(idmBind.argument);
                    new DAPConnection(ctx, idm, dba); // eslint-disable-line
                } else if (idmBind.protocolID.isEqualTo(dsp_ip["&id"]!)) {
                    const dba = _decode_DSABindArgument(idmBind.argument);
                    new DSPConnection(ctx, idm, dba);
                } else if (idmBind.protocolID.isEqualTo(dop_ip["&id"]!)) {
                    const dba = _decode_DirectoryBindArgument(idmBind.argument); // FIXME:
                    new DOPConnection(ctx, idm, dba);
                } else {
                    ctx.log.error(`Unsupported protocol: ${idmBind.protocolID.toString()}.`);
                }
            });

            idm.events.on("unbind", () => {
                c.end();
            });

        } catch (e) {
            ctx.log.error("Unhandled exception: ", e);
        }

        c.on("error", (e) => {
            ctx.log.error("Connection error: ", e);
            c.end();
        });

        c.on("close", () => {
            ctx.log.info("Socket closed.");
        });

    });
    idmServer.on("error", (err) => {
        ctx.log.error(`IDM server error: ${err}`);
    });

    const idmPort = process.env.MEERKAT_IDM_PORT
        ? Number.parseInt(process.env.MEERKAT_IDM_PORT, 10)
        : DEFAULT_IDM_TCP_PORT;

    idmServer.listen(idmPort, () => {
        ctx.log.info(`IDM server listening on port ${idmPort}.`);
    });

    const ldapServer = net.createServer((c) => {
        const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
        ctx.log.info(`LDAP client connected from ${source}.`);
        new LDAPConnection(ctx, c);
    });

    const ldapPort = process.env.MEERKAT_LDAP_PORT
        ? Number.parseInt(process.env.MEERKAT_LDAP_PORT, 10)
        : DEFAULT_LDAP_TCP_PORT;

    ldapServer.listen(ldapPort, async () => {
        ctx.log.info(`LDAP server listening on port ${ldapPort}.`);
    });

    if (process.env.MEERKAT_SERVER_TLS_CERT && process.env.MEERKAT_SERVER_TLS_KEY) {
        const ldapsServer = tls.createServer({
            cert: await fs.readFile(process.env.MEERKAT_SERVER_TLS_CERT),
            key: await fs.readFile(process.env.MEERKAT_SERVER_TLS_KEY),
        }, (c) => {
            const source: string = `${c.remoteFamily}:${c.remoteAddress}:${c.remotePort}`;
            ctx.log.info(`LDAPS client connected from ${source}.`);
            new LDAPConnection(ctx, c);
        });
        const ldapsPort = process.env.MEERKAT_LDAPS_PORT
            ? Number.parseInt(process.env.MEERKAT_LDAPS_PORT, 10)
            : DEFAULT_LDAPS_TCP_PORT;
        ldapsServer.listen(ldapsPort, async () => {
            ctx.log.info(`LDAPS server listening on port ${ldapsPort}`);
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
        // const swaggerConfig = new DocumentBuilder()
        //     .setTitle("Web Admin")
        //     .setDescription('HTTP-based REST API for Meerkat DSA')
        //     .setVersion('1.0')
        //     .build();
        // const document = SwaggerModule.createDocument(app, swaggerConfig);
        // SwaggerModule.setup('documentation', app, document);
        const port = Number.parseInt(process.env.MEERKAT_WEB_ADMIN_PORT, 10);
        await app.listen(port, () => {
            ctx.log.info('Listening at http://localhost:' + port);
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
                    ctx.log.error("Killed by sentinel.");
                    process.exit(503);
                    break;
                }
                case ("meerkat:hibernate"): {
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

    { // Updates checking.
        const records = await dns.resolveTxt(updatesDomain)
            .catch(() => []);
        for (const record of records) {
            const fullRecord: string = record.join(" ").trim().toLowerCase();
            if (fullRecord === versionSlug) {
                ctx.log.info("An update is available for Meerkat DSA.");
            }
        }
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
        ctx.log.warn(`Terminating operational binding ${ob.id} at ${ob.terminated_time.toISOString()}.`);
    });
}
