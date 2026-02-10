import { Buffer } from "node:buffer";
import process from "node:process";
import type { Context, Connection } from "../types.js";
import * as fs from "node:fs";
import * as readline from "readline";
import MutableWriteable from "../utils/MutableWriteable.js";
import connect from "./connect.js";
import {
    IdmBindError,
} from "@wildboar/x500/IDMProtocolSpecification";
import type {
    ConfigDSA,
    ConfigContext,
    ConfigAccessPoint,
    ConfigStrongCredentials,
} from "@wildboar/x500-cli-config";
import { dap_ip } from "@wildboar/x500/DirectoryIDMProtocols";
import { OBJECT_IDENTIFIER, BERElement } from "@wildboar/asn1";
import { KeyObject, createPrivateKey } from "node:crypto";
import { CertificatePair, CertificationPath } from "@wildboar/x500/AuthenticationFramework";
import { PEMObject } from "@wildboar/pem";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import type {
    PkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    _decode_AttributeCertificate,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    ACPathData,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import destringifyDN from "../utils/destringifyDN.js";

/**
 * @summary Produce a `PkiPath` from a PEM-encoded X.509 certificate chain.
 * @description
 *
 * In a `PkiPath`, the certificates are ordered by descending authority, but in
 * a PEM chain, they are ordered by ascending authority.
 *
 * @param data The file contents, which must contain at least one PEM-encoded
 *  X.509 certificate.
 * @returns A `PkiPath` (A sequence of `Certificate`)
 *
 * @function
 */
export
function decodePkiPathFromPEM (data: string): PkiPath {
    const pemObjects: PEMObject[] = PEMObject.parse(data);
    return pemObjects
        .map((obj) => {
            const el = new BERElement();
            el.fromBytes(obj.data);
            return el;
        })
        .map(_decode_Certificate)
        .reverse();
}

const mutedOut = new MutableWriteable();

function parseKey (data: Buffer): KeyObject | null {
    return createPrivateKey({
        key: Buffer.from(data),
        format: "pem",
    });
}

function parseAttrCertPath (data: string): AttributeCertificationPath {
    const pems = PEMObject.parse(data);
    if (pems[0].label !== "ATTRIBUTE CERTIFICATE") {
        throw new Error("43d627bd-aec9-4006-b8ff-a89df6d40e34");
    }
    const userCert = (() => {
        const el = new BERElement();
        el.fromBytes(pems[0].data);
        return _decode_AttributeCertificate(el);
    })();
    const path: ACPathData[] = [];
    let pkc: Certificate | undefined;
    for (const pem of pems.slice(1)) {
        const el = new BERElement();
        el.fromBytes(pem.data); // TODO: Check for extra bytes, just to make sure everything is valid.
        if (pem.label === "ATTRIBUTE CERTIFICATE") {
            const acert = _decode_AttributeCertificate(el);
            path.push(new ACPathData(
                pkc,
                acert,
            ));
            pkc = undefined;
        } else if (pem.label === "CERTIFICATE") {
            pkc = _decode_Certificate(el);
        } else {
            throw new Error("b5c3d7f6-0757-46e6-aa48-e3e7e2a8fa3b");
        }
    }
    if (pkc) {
        throw new Error("edf32265-7bd1-405f-bd8f-408836b0b6d9");
    }
    return new AttributeCertificationPath(
        userCert,
        path.length ? path : undefined,
    );
}

export
async function createConnection (
    ctx: Context,
    argv: Record<string, any>,
    protocol: OBJECT_IDENTIFIER = dap_ip["&id"]!,
): Promise<Connection> {
    const currentContext: ConfigContext | undefined = ctx.config?.contexts
        .find((c) => c.name === ctx.config?.["current-context"]);
    const dsa: ConfigDSA | undefined = ctx.config?.dsas.find((d) => d.name === currentContext?.context?.dsa);
    const credentials = ctx.config?.credentials.find((c) => c.name === currentContext?.context.credential);

    const passwordFromConfig = (credentials?.credential.password ?? {}) as Record<string, string>;
    let password: Buffer | undefined = ("unprotected" in passwordFromConfig)
        ? Buffer.from(passwordFromConfig.unprotected, "utf8")
        : undefined;
    if (argv.password !== undefined) {
        password = Buffer.from(argv.password as string);
    } else if (argv.passwordFile?.length) {
        password = fs.readFileSync(argv.passwordFile as string);
    } else if (argv.promptPassword) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: mutedOut,
            terminal: true,
        });
        await new Promise<void>((resolve) => {
            rl.question("New Password: ", (answer: string): void => {
                password = Buffer.from(answer, "utf-8");
                rl.close();
                resolve();
            });
        });
        mutedOut.muted = true;
    }

    let key: KeyObject | undefined | null;
    let certPath: CertificationPath | undefined;
    let attrCertPath: AttributeCertificationPath | undefined;
    if (credentials?.credential.type && (credentials.credential.type === "strong")) {
        const strong_creds: ConfigStrongCredentials = credentials.credential;
        if (strong_creds.keyPath?.length && strong_creds.certPath?.length) {
            key = parseKey(fs.readFileSync(strong_creds.keyPath));
            const certs = decodePkiPathFromPEM(fs.readFileSync(strong_creds.certPath, { encoding: "utf-8" }));
            if (certs.length) {
                certPath = new CertificationPath(
                    certs[certs.length - 1],
                    [ ...certs.slice(0, -1) ]
                        .reverse()
                        .map((cert) => new CertificatePair(cert, undefined)),
                );
            }
        }
        if (strong_creds.attrCertPath?.length) {
            attrCertPath = parseAttrCertPath(fs.readFileSync(strong_creds.attrCertPath, { encoding: "utf-8" }));
        }
    }

    const accessPoints: ConfigAccessPoint[] = (typeof argv.accessPoint === "string")
        ? [
            {
                urls: [
                    argv.accessPoint,
                ],
            },
        ]
        : dsa?.accessPoints ?? [];

    if (accessPoints.length === 0) {
        ctx.log.error("No access points defined. Please either use the --accessPoint argument or add access points in your directory configuration file.");
    }

    const called_ae_title = dsa?.aeTitle
        ? destringifyDN(ctx, dsa.aeTitle)
        : undefined;

    for (const accessPoint of accessPoints) {
        const bindDN = argv.bindDN
            ?? credentials?.credential.name
            ?? "";
        try {
            // TODO: Iterate over URLs.
            const connection = await connect(
                ctx,
                dsa!,
                accessPoint.urls[0],
                bindDN,
                password,
                protocol,
                certPath,
                key,
                called_ae_title,
                attrCertPath,
            );
            if (!connection) {
                ctx.log.warn(`Could not create connection to this access point: ${accessPoint.url}.`);
                continue;
            }
            connection.called_ae_title = called_ae_title;
            connection.signingKey = key;
            connection.certPath = certPath;
            connection.attrCertPath = attrCertPath;
            ctx.log.debug("Connected.");
            return connection;
        } catch (e) {
            if (e instanceof IdmBindError) {
                ctx.log.error("Authentication error.");
                process.exit(3);
            } else {
                ctx.log.warn(`Could not create connection to this access point: ${accessPoint.url}.`);
                continue;
            }
        }
    }

    if (dsa?.name) {
        ctx.log.error(`No connection could be established to DSA ${dsa.name}.`);
    } else {
        ctx.log.error("No connection could be established to the DSA.");
    }
    process.exit(4);
}

export default createConnection;
