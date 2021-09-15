import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as net from "net";
import * as tls from "tls";
import * as fs from "fs";
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
import loadDIT from "./database/loadDIT";
import loadAttributeTypes from "./x500/loadAttributeTypes";
import loadObjectClasses from "./x500/loadObjectClasses";
import loadLDAPSyntaxes from "./x500/loadLDAPSyntaxes";
import ctx from "./ctx";
import terminate from "./dop/terminateByID";
import { differenceInMilliseconds } from "date-fns";

const DEFAULT_IDM_TCP_PORT: number = 4632;
const DEFAULT_LDAP_TCP_PORT: number = 1389;
const DEFAULT_LDAPS_TCP_PORT: number = 1636;
const DEFAULT_WEB_ADMIN_PORT: number = 18080;

export default
async function main (): Promise<void> {
    await loadDIT(ctx);
    // The ordering of these is important.
    // Loading LDAP syntaxes before attribute types allows us to use the names instead of OIDs.
    await loadObjectClasses(ctx);
    ctx.log.debug("Loaded object classes.");
    loadLDAPSyntaxes(ctx);
    ctx.log.debug("Loaded LDAP syntaxes.");
    await loadAttributeTypes(ctx);
    ctx.log.debug("Loaded attribute types.");

    const nameForms = await ctx.db.nameForm.findMany();
    for (const nameForm of nameForms) {
        ctx.nameForms.set(nameForm.oid, {
            id: ObjectIdentifier.fromString(nameForm.oid),
            name: [ nameForm.name ],
            description: nameForm.description ?? undefined,
            obsolete: nameForm.obsolete,
            namedObjectClass: ObjectIdentifier.fromString(nameForm.namedObjectClass),
            mandatoryAttributes: new Set(nameForm.mandatoryAttributes.split(" ")),
            optionalAttributes: new Set(nameForm.optionalAttributes.split(" ")),
        });
    }

    const friendships = await ctx.db.friendship.findMany();
    for (const friendship of friendships) {
        ctx.friendships.set(friendship.anchor, {
            anchor: ObjectIdentifier.fromString(friendship.anchor),
            friends: new Set(friendship.friends.split(" ")),
        });
    }

    const idmServer = net.createServer((c) => {
        try {
            ctx.log.info("IDM client connected.");
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
                    console.log(`Unsupported protocol: ${idmBind.protocolID.toString()}.`);
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
        // throw err;
        ctx.log.error("IDM server error: ", err);
    });

    const idmPort = process.env.IDM_PORT
        ? Number.parseInt(process.env.IDM_PORT, 10)
        : DEFAULT_IDM_TCP_PORT;

    idmServer.listen(idmPort, () => {
        console.log(`IDM server listening on port ${idmPort}`);
    });

    const ldapServer = net.createServer((c) => {
        console.log("LDAP client connected.");
        new LDAPConnection(ctx, c);
    });

    const ldapPort = process.env.LDAP_PORT
        ? Number.parseInt(process.env.LDAP_PORT, 10)
        : DEFAULT_LDAP_TCP_PORT;

    ldapServer.listen(ldapPort, async () => {
        console.log(`LDAP server listening on port ${ldapPort}`);
    });

    if (process.env.SERVER_TLS_CERT && process.env.SERVER_TLS_KEY) {
        const ldapsServer = tls.createServer({
            cert: fs.readFileSync(process.env.SERVER_TLS_CERT),
            key: fs.readFileSync(process.env.SERVER_TLS_KEY),
        }, (c) => {
            console.log("LDAPS client connected.");
            new LDAPConnection(ctx, c);
        });
        const ldapsPort = process.env.LDAPS_PORT
            ? Number.parseInt(process.env.LDAPS_PORT, 10)
            : DEFAULT_LDAPS_TCP_PORT;
        ldapsServer.listen(ldapsPort, async () => {
            console.log(`LDAPS server listening on port ${ldapsPort}`);
        });
    }

    // Web admin portal
    {
        // I tried making AppModule a dynamic module that would take `ctx` as an argument, but that did not work. See:
        // See: https://github.com/nestjs/nest/issues/671
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        app.useStaticAssets(path.join(__dirname, 'assets', 'static'));
        app.setBaseViewsDir(path.join(__dirname, 'assets', 'views'));
        app.setViewEngine('hbs');
        // const globalPrefix = 'api';
        // app.setGlobalPrefix(globalPrefix);
        app.useGlobalPipes(new ValidationPipe({
            transform: true,
            skipMissingProperties: false,
            forbidNonWhitelisted: true,
        }));
        const swaggerConfig = new DocumentBuilder()
            .setTitle("Web Admin")
            .setDescription('HTTP-based REST API for Meerkat DSA')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('documentation', app, document);
        const port = process.env.WEB_ADMIN_PORT
            ? Number.parseInt(process.env.WEB_ADMIN_PORT, 10)
            : DEFAULT_WEB_ADMIN_PORT;
        await app.listen(port, () => {
            Logger.log('Listening at http://localhost:' + port);
        });
    }

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
