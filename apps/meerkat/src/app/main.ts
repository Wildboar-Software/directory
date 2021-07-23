import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as net from "net";
import * as tls from "tls";
import * as fs from "fs";
import * as path from "path";
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
import LDAPConnection from "./ldap/LDAPConnection";
import loadDIT from "./database/loadDIT";
import { strict as assert } from "assert";
import initDIT from "./database/initDIT";
import loadAttributeTypes from "./x500/loadAttributeTypes";
import loadObjectClasses from "./x500/loadObjectClasses";
import loadLDAPSyntaxes from "./x500/loadLDAPSyntaxes";
import ctx from "./ctx";

const DEFAULT_IDM_TCP_PORT: number = 4632;
const DEFAULT_LDAP_TCP_PORT: number = 1389;
const DEFAULT_LDAPS_TCP_PORT: number = 1636;
const DEFAULT_WEB_ADMIN_PORT: number = 18080;

export default
async function main (): Promise<void> {
    ctx.log.info(`Loading DIT with UUID ${ctx.dit.uuid} into memory. This could take a while.`);
    let dit = await loadDIT(ctx);
    if (!dit) {
        const ditsCount: number = await ctx.db.dIT.count();
        if (ditsCount === 0) {
            await initDIT(ctx, "Default DIT");
            dit = await loadDIT(ctx);
        } else {
            throw new Error(`DIT with UUID ${ctx.dit.uuid} not found.`);
        }
    }
    assert(dit);
    ctx.log.info(`DIT with UUID ${ctx.dit.uuid} loaded into memory.`);

    // The ordering of these is important.
    // Loading LDAP syntaxes before attribute types allows us to use the names instead of OIDs.
    loadObjectClasses(ctx);
    ctx.log.debug("Loaded object classes.");
    loadLDAPSyntaxes(ctx);
    ctx.log.debug("Loaded LDAP syntaxes.");
    loadAttributeTypes(ctx);
    ctx.log.debug("Loaded attribute types.");

    const idmServer = net.createServer((c) => {
        console.log("IDM client connected.");
        const idm = new IDMConnection(c); // eslint-disable-line
        // let dap: DAPConnection | undefined;

        idm.events.on("bind", (idmBind: IdmBind) => {
            if (idmBind.protocolID.isEqualTo(dap_ip["&id"]!)) {
                const dba = _decode_DirectoryBindArgument(idmBind.argument);
                new DAPConnection(ctx, idm, dba); // eslint-disable-line
            } else if (idmBind.protocolID.isEqualTo(dsp_ip["&id"]!)) {
                const dba = _decode_DirectoryBindArgument(idmBind.argument); // FIXME:
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

        // idm.events.on("unbind", () => {
        //     dap = undefined;
        // });
    });
    idmServer.on("error", (err) => {
        throw err;
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
}
