import {
    Context,
    SigningInfo,
    Vertex,
    LogLevel,
    RemoteCRLCheckiness,
    Configuration,
} from "@wildboar/meerkat-types";
import { DER } from "@wildboar/asn1/functional";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import { EventEmitter } from "node:events";
import winston from "winston";
import isDebugging from "is-debugging";
import i18n from "i18next";
import {
    uriToNSAP,
} from "@wildboar/x500/src/lib/distributed/uri";
import * as path from "path";
import { URL } from "url";
import {
    DEFAULT_IDM_BUFFER_SIZE,
    DEFAULT_LDAP_BUFFER_SIZE,
    DEFAULT_REMOTE_CRL_CACHE_TTL,
} from "./constants.js";
import type { SecureVersion } from "tls";
import * as fs from "fs";
import { PEMObject } from "pem-ts";
import { BERElement, DERElement, ObjectIdentifier } from "@wildboar/asn1";
import {
    CertificateList,
    _decode_CertificateList,
} from "@wildboar/x500/AuthenticationFramework";
import {
    TrustAnchorList,
    _decode_TrustAnchorList,
} from "@wildboar/tal";
import {
    id_ct_trustAnchorList,
} from "@wildboar/tal";
import {
    id_stc_build_valid_pkc_path,
} from "@wildboar/scvp/src/lib/modules/SCVP-2009/id-stc-build-valid-pkc-path.va";
import {
    id_stc_build_aa_path,
} from "@wildboar/scvp/src/lib/modules/SCVP-2009/id-stc-build-aa-path.va";
import {
    id_ct_contentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-ct-contentInfo.va";
import {
    id_ct_authData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-ct-authData.va";
import {
    id_signedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-signedData.va";
import {
    id_digestedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-digestedData.va";
import {
    ContentInfo,
    _decode_ContentInfo,
    _encode_ContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/ContentInfo.ta";
import {
    _decode_AuthenticatedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/AuthenticatedData.ta";
import {
    _decode_SignedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/SignedData.ta";
import type {
    EncapsulatedContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EncapsulatedContentInfo.ta";
import {
    _decode_DigestedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/DigestedData.ta";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import {
    _decode_AttributeCertificate,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    ACPathData,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { KeyObject, createPrivateKey, randomUUID } from "crypto";
import {
    AuthenticationLevel_basicLevels,
} from "@wildboar/x500/BasicAccessControl";
import {
    AuthenticationLevel_basicLevels_level_none,
} from "@wildboar/x500/BasicAccessControl";
import { decodePkiPathFromPEM } from "./utils/decodePkiPathFromPEM.js";
import type {
    PkiPath,
} from "@wildboar/pki-stub";
import { rootCertificates } from "tls";
import { strict as assert } from "assert";
import * as x500at from "@wildboar/x500/src/lib/collections/attributes";
import { attributeFromInformationObject } from "./init/attributeFromInformationObject.js";
import { loadMatchingRules } from "./init/loadMatchingRules.js";

export
interface MeerkatTelemetryClient {
    init: () => Promise<void>;
    trackAvailability: () => void;
    trackEvent: () => void;
    trackMetric: () => void;
    trackRequest: () => void;
    trackException: () => void;
    trackDependency: () => void;
    trackTrace: () => void;
}

export
interface MeerkatContext extends Context {
    telemetry: MeerkatTelemetryClient;
}

function unencapsulateContentInfo (
    encap: EncapsulatedContentInfo,
): ContentInfo | null {
    const innerContent = new BERElement();
    if (!encap.eContent) {
        return null;
    }
    innerContent.fromBytes(encap.eContent);
    const innerCinfo = new ContentInfo(
        encap.eContentType,
        innerContent,
    );
    return innerCinfo;
}

function parseTrustAnchorListBlob (blob: Uint8Array): TrustAnchorList {
    const el = new BERElement();
    el.fromBytes(blob);
    const cinfo = _decode_ContentInfo(el);
    if (cinfo.contentType.isEqualTo(id_ct_trustAnchorList)) {
        const tal = _decode_TrustAnchorList(cinfo.content);
        return tal;
    }
    else if (cinfo.contentType.isEqualTo(id_ct_contentInfo)) {
        return parseTrustAnchorListBlob(Buffer.from(cinfo.content.toBytes()));
    }
    else if (cinfo.contentType.isEqualTo(id_ct_authData)) {
        const adata = _decode_AuthenticatedData(cinfo.content);
        const innerCinfo = unencapsulateContentInfo(adata.encapContentInfo);
        if (!innerCinfo) {
            return [];
        }
        return parseTrustAnchorListBlob(_encode_ContentInfo(innerCinfo, DER).toBytes());
    }
    else if (cinfo.contentType.isEqualTo(id_signedData)) {
        const sdata = _decode_SignedData(cinfo.content);
        const innerCinfo = unencapsulateContentInfo(sdata.encapContentInfo);
        if (!innerCinfo) {
            return [];
        }
        return parseTrustAnchorListBlob(_encode_ContentInfo(innerCinfo, DER).toBytes());
    }
    else if (cinfo.contentType.isEqualTo(id_digestedData)) {
        const ddata = _decode_DigestedData(cinfo.content);
        const innerCinfo = unencapsulateContentInfo(ddata.encapContentInfo);
        if (!innerCinfo) {
            return [];
        }
        return parseTrustAnchorListBlob(_encode_ContentInfo(innerCinfo, DER).toBytes());
    }
    else {
        /**
         * Any other content type will be ignored, either because it is
         * unrecognized, or because it contains encrypted data. Maybe in the
         * future, Meerkat DSA will support some sort of decryption key via an
         * environment variable, but there is little reason to support this now.
         */
        return [];
    }
}

const TRUST_ANCHOR_LIST_PEM_LABEL: string = "TRUST ANCHOR LIST";

// FIXME: Unit testing
function parseTrustAnchorListFile (data: Buffer): TrustAnchorList {
    const pemEncoded: boolean = (data
        .indexOf(`-----BEGIN ${TRUST_ANCHOR_LIST_PEM_LABEL}-----`) > -1);
    if (pemEncoded) {
        const pems = PEMObject.parse(data.toString("utf8"));
        const tals = pems
            .filter((p) => (p.label === TRUST_ANCHOR_LIST_PEM_LABEL))
            .map((p) => parseTrustAnchorListBlob(p.data));
        return tals.flat();
    } else {
        return parseTrustAnchorListBlob(data);
    }
}

function parseCerts (data: string): Certificate[] {
    return PEMObject.parse(data).map((p) => {
        const el = new BERElement();
        el.fromBytes(p.data);
        return _decode_Certificate(el);
    });
}

function parseCRLs (data: string): CertificateList[] {
    return PEMObject.parse(data).map((p) => {
        const el = new BERElement();
        el.fromBytes(p.data);
        return _decode_CertificateList(el);
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
    for (const pem of pems) {
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
        path,
    );
}

function parseKey (data: Buffer): KeyObject | null {
    return createPrivateKey({
        key: Buffer.from(data),
        format: "pem",
    });
}

function parseAuthLevel (
    levelStr: string | undefined,
    lqStr: string | undefined,
    signedStr: string | undefined,
): AuthenticationLevel_basicLevels {
    return new AuthenticationLevel_basicLevels(
        levelStr
            ? Number.parseInt(levelStr, 10)
            : AuthenticationLevel_basicLevels_level_none,
        lqStr
            ? Number.parseInt(lqStr, 10)
            : undefined,
        (signedStr === "1"),
    );
}

const myNSAPs: Uint8Array[] = process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
    ? process.env.MEERKAT_MY_ACCESS_POINT_NSAPS
        .split(/\s+/g)
        .map((url) => uriToNSAP(url, (url.startsWith("itot://"))))
    : [];

const rootID = randomUUID();
const root: Vertex = {
    subordinates: [],
    dse: {
        id: 1,
        materializedPath: "",
        uuid: rootID,
        rdn: [],
        objectClass: new Set(),
        createTimestamp: new Date(),
        modifyTimestamp: new Date(),
    },
};
const bulkInsertMode: boolean = (process.env.MEERKAT_BULK_INSERT_MODE === "1");
const logNoColor: boolean = (
    (process.env.MEERKAT_NO_COLOR === "1")
    || !!(process.env.NO_COLOR) // See: https://no-color.org/
);
const logNoTimestamp: boolean = (process.env.MEERKAT_NO_TIMESTAMP === "1");
const logLevel: string = (process.env.MEERKAT_LOG_LEVEL || "info");
const logJson: boolean = (process.env.MEERKAT_LOG_JSON === "1");
const logNoConsole: boolean = (process.env.MEERKAT_NO_CONSOLE === "1");
// const logToWindows: boolean = (process.env.MEERKAT_LOG_WINDOWS === "1");
// const logToSyslog: boolean = (process.env.MEERKAT_LOG_SYSLOG === "1");
const logToFile: string | undefined = (() => {
    if (!process.env.MEERKAT_LOG_FILE?.length) {
        return undefined;
    }
    try {
        path.parse(process.env.MEERKAT_LOG_FILE);
        return process.env.MEERKAT_LOG_FILE;
    } catch {
        console.error(`INVALID MEERKAT_LOG_FILE PATH ${process.env.MEERKAT_LOG_FILE}`);
        process.exit(1);
    }
})();
const logFileMaxSize: number = Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_SIZE || "1000000");
const logFileMaxFiles: number = Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_FILES || "100");
const logFileZip: boolean = (process.env.MEERKAT_LOG_ZIP === "1");
const logFilesTailable: boolean = (process.env.MEERKAT_LOG_TAILABLE === "1");
const logToHTTP: winston.transports.HttpTransportOptions | undefined = (() => {
    if (!process.env.MEERKAT_LOG_HTTP?.length) {
        return undefined;
    }
    try {
        const url = new URL(process.env.MEERKAT_LOG_HTTP);
        const ssl: boolean = (url.protocol.toLowerCase() === "https:");
        const port = Number.parseInt(url.port);
        return {
            ssl,
            host: url.host,
            port: Number.isSafeInteger(port) && (port > 0)
                ? port
                : (ssl ? 443 : 80),
            auth: url.username?.length
                ? {
                    username: url.username,
                    password: url.password,
                }
                : undefined,
            path: url.pathname,
        };
    } catch {
        console.error(`INVALID MEERKAT_LOG_HTTP URL ${process.env.MEERKAT_LOG_HTTP}`);
        process.exit(1);
    }
})();

const winstonLogFormats: winston.Logform.Format[] = [];
if (!logNoColor) {
    winstonLogFormats.push(winston.format.colorize());
}
if (!logNoTimestamp) {
    winstonLogFormats.push(winston.format.timestamp());
}
if (logJson) {
    winstonLogFormats.push(winston.format.json());
} else {
    winstonLogFormats.push(winston.format.align());
    winstonLogFormats.push(winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`));
}

const winstonTransports: winston.transport[] = [];
if (!logNoConsole) {
    winstonTransports.push(new winston.transports.Console());
}
if (logToFile) {
    winstonTransports.push(new winston.transports.File({
        filename: logToFile,
        maxsize: logFileMaxSize,
        maxFiles: logFileMaxFiles,
        zippedArchive: logFileZip,
        tailable: logFilesTailable,
    }));
}
if (logToHTTP) {
    winstonTransports.push(new winston.transports.Http(logToHTTP));
}

const tlsCAFileContents: string | undefined = process.env.MEERKAT_TLS_CA_FILE
    ? fs.readFileSync(process.env.MEERKAT_TLS_CA_FILE, { encoding: "utf-8" })
    : undefined;

const tlsCRLFileContents: string | undefined = process.env.MEERKAT_TLS_CRL_FILE
    ? fs.readFileSync(process.env.MEERKAT_TLS_CRL_FILE, { encoding: "utf-8" })
    : undefined;

const signingCAFileContents: string | undefined = process.env.MEERKAT_SIGNING_CA_FILE
    ? fs.readFileSync(process.env.MEERKAT_SIGNING_CA_FILE, { encoding: "utf-8" })
    : undefined;

const signingCRLFileContents: string | undefined = process.env.MEERKAT_SIGNING_CRL_FILE
    ? fs.readFileSync(process.env.MEERKAT_SIGNING_CRL_FILE, { encoding: "utf-8" })
    : undefined;

const signingCertFileContents: string | undefined = process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE
    ? fs.readFileSync(process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE, { encoding: "utf-8" })
    : undefined;

const signingKeyFileContents: Buffer | undefined = process.env.MEERKAT_SIGNING_KEY_FILE
    ? fs.readFileSync(process.env.MEERKAT_SIGNING_KEY_FILE)
    : undefined;

const talFileContents: Buffer | undefined = process.env.MEERKAT_TRUST_ANCHORS_FILE
    ? fs.readFileSync(process.env.MEERKAT_TRUST_ANCHORS_FILE)
    : undefined;

const attrCertPathFileContents: string | undefined = process.env.MEERKAT_ATTR_CERT_CHAIN_FILE
    ? fs.readFileSync(process.env.MEERKAT_ATTR_CERT_CHAIN_FILE, { encoding: "utf-8" })
    : undefined;

const signingCACerts: Certificate[] = signingCAFileContents
    ? parseCerts(signingCAFileContents)
    : [];

const signingCRLs: CertificateList[] = signingCRLFileContents
    ? parseCRLs(signingCRLFileContents)
    : [];

const signingCertChain: PkiPath | undefined = signingCertFileContents
    ? decodePkiPathFromPEM(signingCertFileContents)
    : undefined;

const signingKey: KeyObject | null = signingKeyFileContents
    ? parseKey(signingKeyFileContents)
    : null;

const trustAnchorList: TrustAnchorList = talFileContents
    ? [
        ...parseTrustAnchorListFile(talFileContents),
        ...signingCACerts.map((certificate) => ({ certificate })),
    ]
    : signingCACerts.map((certificate) => ({ certificate }));

/**
 * If the trust anchor list is unpopulated, use the default root certificates.
 */
if (trustAnchorList.length === 0) {
    trustAnchorList.push(...rootCertificates
        .map((str) => {
            const pems = PEMObject.parse(str);
            const pem = pems[0];
            assert(pem);
            const el = new BERElement();
            el.fromBytes(pem.data);
            const certificate = _decode_Certificate(el);
            return { certificate };
        }));
}

const decodedCRLs: CertificateList[] = tlsCRLFileContents
    ? PEMObject.parse(tlsCRLFileContents)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_CertificateList(el);
        })
    : [];

const attributeCertificationPath = attrCertPathFileContents
    ? parseAttrCertPath(attrCertPathFileContents)
    : undefined;

const signingAuthLevel = parseAuthLevel(
    process.env.MEERKAT_SIGNING_MIN_AUTH_LEVEL,
    process.env.MEERKAT_SIGNING_MIN_AUTH_LOCAL_QUALIFIER,
    process.env.MEERKAT_SIGNING_AUTH_SIGNED,
);

const signingErrorsAuthLevel = (
    process.env.MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL
    || process.env.MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER
    || process.env.MEERKAT_SIGNING_ERRORS_AUTH_SIGNED
)
    ? parseAuthLevel(
        process.env.MEERKAT_SIGNING_ERRORS_MIN_AUTH_LEVEL,
        process.env.MEERKAT_SIGNING_ERRORS_MIN_AUTH_LOCAL_QUALIFIER,
        process.env.MEERKAT_SIGNING_ERRORS_AUTH_SIGNED,
    )
    : signingAuthLevel;

const bindOverrides: SigningInfo["bindOverrides"] = {
    remoteCRLCheckiness: process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_CHECKINESS
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_CHECKINESS, 10)
        : undefined,
    remoteCRLSupportedProtocols: process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_SUPPORTED_PROTOCOLS
        ? new Set(
            process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_SUPPORTED_PROTOCOLS
                .split(",")
                .map((p) => p.trim()),
        )
        : undefined,
    tolerateUnavailableRemoteCRL: process.env.MEERKAT_SIGNING_BIND_TOLERATE_UNAVAILABLE_REMOTE_CRL
        ? (process.env.MEERKAT_SIGNING_BIND_TOLERATE_UNAVAILABLE_REMOTE_CRL === "1")
        : undefined,
    remoteCRLCacheTimeToLiveInSeconds: process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_CACHE_TTL
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_CACHE_TTL, 10)
        : undefined,
    ocspCheckiness: process.env.MEERKAT_SIGNING_BIND_OCSP_CHECKINESS
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_OCSP_CHECKINESS, 10)
        : undefined, // Do not check OCSP
    ocspUnknownIsFailure: process.env.MEERKAT_SIGNING_BIND_OCSP_UNKNOWN_IS_FAILURE
        ? (process.env.MEERKAT_SIGNING_BIND_OCSP_UNKNOWN_IS_FAILURE === "1")
        : undefined,
    ocspSignRequests: process.env.MEERKAT_SIGNING_BIND_OCSP_SIGN_REQUESTS
        ? (process.env.MEERKAT_SIGNING_BIND_OCSP_SIGN_REQUESTS === "1")
        : undefined,
    acceptableCertificatePolicies: process.env.MEERKAT_SIGNING_BIND_ACCEPTABLE_CERT_POLICIES
        ? process.env.MEERKAT_SIGNING_BIND_ACCEPTABLE_CERT_POLICIES
            .split(",")
            .map((oid) => ObjectIdentifier.fromString(oid.trim()))
        : undefined,
    maxOCSPRequestsPerCertificate: process.env.MEERKAT_SIGNING_BIND_OCSP_MAX_REQUESTS_PER_CERT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_OCSP_MAX_REQUESTS_PER_CERT, 10)
        : undefined,
    ocspTimeout: process.env.MEERKAT_SIGNING_BIND_OCSP_TIMEOUT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_OCSP_TIMEOUT, 10)
        : undefined,
    distributionPointAttemptsPerCertificate: process.env.MEERKAT_SIGNING_BIND_CRL_DP_ATTEMPTS_PER_CERT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_CRL_DP_ATTEMPTS_PER_CERT)
        : undefined,
    endpointsToAttemptPerDistributionPoint: process.env.MEERKAT_SIGNING_BIND_MAX_ENDPOINTS_PER_CRL_DP
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_MAX_ENDPOINTS_PER_CRL_DP, 10)
        : undefined,
    remoteCRLTimeout: process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_TIMEOUT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_TIMEOUT, 10)
        : undefined,
    ocspReplayWindow: process.env.MEERKAT_SIGNING_BIND_OCSP_REPLAY_WINDOW
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_OCSP_REPLAY_WINDOW, 10)
        : undefined,
    ocspResponseSizeLimit: process.env.MEERKAT_SIGNING_BIND_OCSP_RESPONSE_SIZE_LIMIT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_OCSP_RESPONSE_SIZE_LIMIT, 10)
        : undefined,
    remoteCRLFetchSizeLimit: process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_SIZE_LIMIT
        ? Number.parseInt(process.env.MEERKAT_SIGNING_BIND_REMOTE_CRL_SIZE_LIMIT, 10)
        : undefined,
};

const config: Configuration = {
    maxRelaxationsOrTightenings: 3,
    attributeCertificateDuration: 60,
    disp: {
        enabled: false,
    },
    principledServiceAdministration: false,
    rbac: {
        clearanceAuthorities: [],
        getClearancesFromAttributeCertificates: true,
        getClearancesFromDSAIT: true,
        getClearancesFromPublicKeyCert: true,
        labellingAuthorities: [],
    },
    requireMutualAuth: false,
    shadowing: {
        minAuthRequired: new AuthenticationLevel_basicLevels(
            AuthenticationLevel_basicLevels_level_none,
            undefined,
            undefined,
        ),
    },
    xr: {
        requestCrossReferences: true,
        returnCrossReferences: true,
        signingRequiredToTrust: false,
    },
    vendorName: process.env.MEERKAT_VENDOR_NAME?.length
        ? process.env.MEERKAT_VENDOR_NAME
        : undefined,
    vendorVersion: process.env.MEERKAT_VENDOR_VERSION?.length
        ? process.env.MEERKAT_VENDOR_VERSION
        : undefined,
    revealUserPwdEncryptedValues: (process.env.MEERKAT_REVEAL_USER_PWD === "1"),
    authn: {
        lookupPkiPathForUncertifiedStrongAuth: (process.env.MEERKAT_LOOKUP_UNCERT_STRONG_AUTH === "1"),
        attributeCertificationPath,
        remotePaswordCompareTimeLimit: process.env.MEERKAT_REMOTE_PWD_TIME_LIMIT
            ? Number.parseInt(process.env.MEERKAT_REMOTE_PWD_TIME_LIMIT, 10)
            : 0, // 0 disables this procedure.
        automaticallyTrustForIBRA: process.env.MEERKAT_TRUST_FOR_IBRA?.toUpperCase(),
    },
    log: {
        boundDN: (process.env.MEERKAT_LOG_BOUND_DN === "1"),
        level: logLevel as LogLevel,
        console: !logNoConsole,
        color: !logNoColor,
        timestamp: !logNoTimestamp,
        json: logJson,
        file: logToFile
            ? {
                path: logToFile,
                maxSize: logFileMaxSize,
                maxFiles: logFileMaxFiles,
                zip: logFileZip,
                tailable: logFilesTailable,
            }
            : undefined,
        http: logToHTTP
            ? {
                url: process.env.MEERKAT_LOG_HTTP!,
            }
            : undefined,
    },
    maxConnections: process.env.MEERKAT_MAX_CONNECTIONS
        ? Number.parseInt(process.env.MEERKAT_MAX_CONNECTIONS)
        : 250,
    maxConnectionsPerAddress: process.env.MEERKAT_MAX_CONNECTIONS_PER_ADDRESS
        ? Number.parseInt(process.env.MEERKAT_MAX_CONNECTIONS_PER_ADDRESS)
        : Infinity,
    maxConcurrentOperationsPerConnection: process.env.MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION
        ? Number.parseInt(process.env.MEERKAT_MAX_CONCURRENT_OPERATIONS_PER_CONNECTION)
        : Infinity,
    mostRecentVertexTTL: process.env.MEERKAT_MRU_VERTEX_TTL
        ? Number.parseInt(process.env.MEERKAT_MRU_VERTEX_TTL, 10)
        : 300,
    tcp: {
        noDelay: (process.env.MEERKAT_TCP_NO_DELAY === "1"),
        timeoutInSeconds: process.env.MEERKAT_TCP_TIMEOUT_IN_SECONDS
            ? Number.parseInt(process.env.MEERKAT_TCP_TIMEOUT_IN_SECONDS)
            : 0, // 0 means do not timeout.
        minimumTransferSpeedInBytesPerMinute: process.env.MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE
            ? Number.parseInt(process.env.MEERKAT_MIN_TRANSFER_SPEED_BYTES_PER_MINUTE)
            : 1000, // A sensible default, since AX.25 radio typically transmits 150 bytes/second.
    },
    signing: {
        disableAllSignatureVerification: (process.env.MEERKAT_SIGNING_DISABLE_VERIFICATION === "1"),
        key: signingKey ?? undefined,
        certPath: signingCertChain,
        minAuthRequired: signingAuthLevel,
        signedErrorsMinAuthRequired: signingErrorsAuthLevel,
        permittedSignatureAlgorithms: process.env.MEERKAT_SIGNING_PERMITTED_ALGORITHMS
            ? new Set(
                process.env.MEERKAT_SIGNING_PERMITTED_ALGORITHMS
                    .split(",")
                    .map((oid) => oid.trim()),
            )
            : undefined,
        trustAnchorList,
        certificateRevocationLists: signingCRLs,
        remoteCRLCheckiness: process.env.MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS
            ? Number.parseInt(process.env.MEERKAT_SIGNING_REMOTE_CRL_CHECKINESS, 10)
            : RemoteCRLCheckiness.never,
        remoteCRLSupportedProtocols: process.env.MEERKAT_SIGNING_REMOTE_CRL_SUPPORTED_PROTOCOLS
            ? new Set(
                process.env.MEERKAT_SIGNING_REMOTE_CRL_SUPPORTED_PROTOCOLS
                    .split(",")
                    .map((p) => p.trim()),
            )
            : undefined,
        remoteCRLFetchSizeLimit: process.env.MEERKAT_SIGNING_REMOTE_CRL_SIZE_LIMIT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_REMOTE_CRL_SIZE_LIMIT, 10)
            : 1_000_000, // 1MB would be a pretty large CRL!
        tolerateUnavailableRemoteCRL: (process.env.MEERKAT_SIGNING_TOLERATE_UNAVAILABLE_REMOTE_CRL === "1"),
        remoteCRLCacheTimeToLiveInSeconds: Number.parseInt(
            process.env.MEERKAT_SIGNING_REMOTE_CRL_CACHE_TTL
            ?? DEFAULT_REMOTE_CRL_CACHE_TTL.toString(), 10),
        ocspCheckiness: process.env.MEERKAT_SIGNING_OCSP_CHECKINESS
            ? Number.parseInt(process.env.MEERKAT_SIGNING_OCSP_CHECKINESS, 10)
            : -1, // Do not check OCSP
        ocspUnknownIsFailure: (process.env.MEERKAT_SIGNING_OCSP_UNKNOWN_IS_FAILURE === "1"),
        ocspSignRequests: (process.env.MEERKAT_SIGNING_OCSP_SIGN_REQUESTS === "1"),
        ocspTimeout: process.env.MEERKAT_SIGNING_OCSP_TIMEOUT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_OCSP_TIMEOUT, 10)
            : 5,
        ocspReplayWindow: process.env.MEERKAT_SIGNING_OCSP_REPLAY_WINDOW
            ? Number.parseInt(process.env.MEERKAT_SIGNING_OCSP_REPLAY_WINDOW, 10)
            : 15,
        ocspResponseSizeLimit: process.env.MEERKAT_SIGNING_OCSP_RESPONSE_SIZE_LIMIT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_OCSP_RESPONSE_SIZE_LIMIT, 10)
            : 10_000,
        maxOCSPRequestsPerCertificate: process.env.MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_OCSP_MAX_REQUESTS_PER_CERT, 10)
            : 3,
        revokedCertificateSerialNumbers: new Set(
            signingCRLs
                .flatMap((crl) => crl.toBeSigned.revokedCertificates
                    ?.map((rc) => Buffer.from(rc.serialNumber).toString("base64")) ?? []),
        ),
        acceptableCertificatePolicies: process.env.MEERKAT_SIGNING_ACCEPTABLE_CERT_POLICIES
            ? process.env.MEERKAT_SIGNING_ACCEPTABLE_CERT_POLICIES
                .split(",")
                .map((oid) => ObjectIdentifier.fromString(oid.trim()))
            : undefined,
        distributionPointAttemptsPerCertificate: process.env.MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_CRL_DP_ATTEMPTS_PER_CERT)
            : 3,
        endpointsToAttemptPerDistributionPoint: process.env.MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP
            ? Number.parseInt(process.env.MEERKAT_SIGNING_MAX_ENDPOINTS_PER_CRL_DP, 10)
            : 3,
        remoteCRLTimeout: process.env.MEERKAT_SIGNING_REMOTE_CRL_TIMEOUT
            ? Number.parseInt(process.env.MEERKAT_SIGNING_REMOTE_CRL_TIMEOUT, 10)
            : 5,
        bindOverrides,
    },
    tls: {
        enableTrace: (process.env.MEERKAT_TLS_ENABLE_TRACE === "1"),
        answerOCSPRequests: (process.env.MEERKAT_TLS_ANSWER_OCSP_REQUESTS === "1"),
        rejectUnauthorizedClients: (process.env.MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS === "1"),
        rejectUnauthorizedServers: (process.env.MEERKAT_TLS_REJECT_UNAUTHORIZED_SERVERS !== "0"),
        handshakeTimeout: process.env.MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS
            ? Number.parseInt(process.env.MEERKAT_TLS_HANDSHAKE_TIMEOUT_IN_SECONDS) * 1000
            : 30000,
        sessionTimeout: process.env.MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS
            ? Number.parseInt(process.env.MEERKAT_TLS_SESSION_TIMEOUT_IN_SECONDS) * 1000
            : undefined,
        /**
         * This MUST NOT be set here, because whether to `rejectUnauthorized`
         * will be based on whether this DSA is acting as a server or client.
         */
        // rejectUnauthorized: (process.env.THIS_WAS_A_BUG === "1"),
        requestCert: (process.env.MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS === "1"),
        cert: process.env.MEERKAT_TLS_CERT_FILE
            ? fs.readFileSync(process.env.MEERKAT_TLS_CERT_FILE, { encoding: "utf-8" })
            : undefined,
        key: process.env.MEERKAT_TLS_KEY_FILE
            ? fs.readFileSync(process.env.MEERKAT_TLS_KEY_FILE, { encoding: "utf-8" })
            : undefined,
        ca: tlsCAFileContents,
        crl: tlsCRLFileContents,
        pfx: process.env.MEERKAT_TLS_PFX_FILE
            ? fs.readFileSync(process.env.MEERKAT_TLS_PFX_FILE)
            : undefined,
        sigalgs: process.env.MEERKAT_TLS_SIG_ALGS,
        ciphers: process.env.MEERKAT_TLS_CIPHERS,
        clientCertEngine: process.env.MEERKAT_CLIENT_CERT_ENGINE,
        dhparam: process.env.MEERKAT_TLS_DH_PARAM_FILE
            ? fs.readFileSync(process.env.MEERKAT_TLS_DH_PARAM_FILE)
            : undefined,
        ecdhCurve: process.env.MEERKAT_ECDH_CURVES,
        honorCipherOrder: (process.env.MEERKAT_HONOR_CIPHER_ORDER === "1"),
        minVersion: process.env.MEERKAT_TLS_MIN_VERSION as SecureVersion | undefined,
        maxVersion: process.env.MEERKAT_TLS_MAX_VERSION as SecureVersion | undefined,
        passphrase: process.env.MEERKAT_TLS_KEY_PASSPHRASE,
        privateKeyEngine: process.env.MEERKAT_PRIVATE_KEY_ENGINE,
        // ticketKeys?: Buffer | undefined;
        // pskCallback?(socket: TLSSocket, identity: string): DataView | NodeJS.TypedArray | null;
        // pskIdentityHint: process.env.MEERKAT_PSK_IDENTITY_HINT
        certificateRevocationLists: tlsCRLFileContents
            ? PEMObject.parse(tlsCRLFileContents)
                .map((p) => {
                    const el = new DERElement();
                    el.fromBytes(p.data);
                    return _decode_CertificateList(el);
                })
            : [],
        revokedCertificateSerialNumbers: new Set(
            decodedCRLs
                .flatMap((crl) => crl.toBeSigned.revokedCertificates
                    ?.map((rc) => rc.serialNumber.toString()) ?? []),
        ),
        trustAnchorList: tlsCAFileContents
            ? (() => {
                const pems = PEMObject.parse(tlsCAFileContents);
                return pems.map((p) => {
                    const el = new BERElement();
                    el.fromBytes(p.data);
                    return {
                        certificate: _decode_Certificate(el),
                    };
                });
            })()
            : [],
        ocspCheckiness: process.env.MEERKAT_TLS_OCSP_CHECKINESS
            ? Number.parseInt(process.env.MEERKAT_TLS_OCSP_CHECKINESS, 10)
            : 0, // By default, do not check OCSP.
        ocspSignRequests: (process.env.MEERKAT_TLS_OCSP_SIGN_REQUESTS === "1"),
        ocspUnknownIsFailure: (process.env.MEERKAT_TLS_OCSP_UNKNOWN_IS_FAILURE === "1"),
        ocspTimeout: process.env.MEERKAT_TLS_OCSP_TIMEOUT
            ? Number.parseInt(process.env.MEERKAT_TLS_OCSP_TIMEOUT, 10)
            : 5,
        ocspReplayWindow: process.env.MEERKAT_TLS_OCSP_REPLAY_WINDOW
            ? Number.parseInt(process.env.MEERKAT_TLS_OCSP_REPLAY_WINDOW, 10)
            : 15,
        maxOCSPRequestsPerCertificate: process.env.MEERKAT_TLS_OCSP_MAX_REQUESTS_PER_CERT
            ? Number.parseInt(process.env.MEERKAT_TLS_OCSP_MAX_REQUESTS_PER_CERT, 10)
            : 3,
        requestOCSP: (process.env.MEERKAT_TLS_REQUEST_OCSP === "1"),
        ocspResponseSizeLimit: process.env.MEERKAT_TLS_OCSP_RESPONSE_SIZE_LIMIT
            ? Number.parseInt(process.env.MEERKAT_TLS_OCSP_RESPONSE_SIZE_LIMIT, 10)
            : 10_000,
        log_tls_secrets: (process.env.MEERKAT_LOG_TLS_SECRETS === "1"),
        sslkeylog_file: process.env.MEERKAT_SSLKEYLOG_FILE,
    },
    scvp: (process.env.MEERKAT_SCVP_URL && process.env.MEERKAT_SCVP_VALIDATION_POLICY_REF_ID)
        ? {
            url: new URL(process.env.MEERKAT_SCVP_URL),
            discloseAETitle: (process.env.MEERKAT_SCVP_DISCLOSE_AE_TITLE === "1"),
            requestorText: process.env.MEERKAT_SCVP_REQUESTOR_TEXT,
            publicKeyCertificateChecks: process.env.MEERKAT_SCVP_PUBLIC_KEY_CERT_CHECKS
                ? process.env.MEERKAT_SCVP_PUBLIC_KEY_CERT_CHECKS
                    .split(",")
                    .map((oid) => ObjectIdentifier.fromString(oid.trim()))
                : [id_stc_build_valid_pkc_path], // A sensible default.
            attributeCertificateChecks: process.env.MEERKAT_SCVP_ATTR_CERT_CHECKS
                ? process.env.MEERKAT_SCVP_ATTR_CERT_CHECKS
                    .split(",")
                    .map((oid) => ObjectIdentifier.fromString(oid.trim()))
                : [id_stc_build_aa_path], // A sensible default.
            publicKeyCertificateWantBacks: process.env.MEERKAT_SCVP_PUBLIC_KEY_CERT_WANT_BACKS
                ? process.env.MEERKAT_SCVP_PUBLIC_KEY_CERT_WANT_BACKS
                    .split(",")
                    .map((oid) => ObjectIdentifier.fromString(oid.trim()))
                : [],
            attributeCertificateWantBacks: process.env.MEERKAT_SCVP_ATTR_CERT_WANT_BACKS
                ? process.env.MEERKAT_SCVP_ATTR_CERT_WANT_BACKS
                    .split(",")
                    .map((oid) => ObjectIdentifier.fromString(oid.trim()))
                : [],
            validationPolicyRefId: ObjectIdentifier.fromString(process.env.MEERKAT_SCVP_VALIDATION_POLICY_REF_ID),
            validationAlgorithmId: process.env.MEERKAT_SCVP_VALIDATION_ALGORITHM_ID
                ? ObjectIdentifier.fromString(process.env.MEERKAT_SCVP_VALIDATION_ALGORITHM_ID)
                : undefined,
            inhibitPolicyMapping: (process.env.MEERKAT_SCVP_INHIBIT_POLICY_MAPPING === "1"),
            requireExplicitPolicy: (process.env.MEERKAT_SCVP_REQUIRE_EXPLICIT_POLICY === "1"),
            inhibitAnyPolicy: (process.env.MEERKAT_SCVP_INHIBIT_ANY_POLICY === "1"),
            fullRequestInResponse: (process.env.MEERKAT_SCVP_FULL_REQUEST_IN_RESPONSE === "1"),
            responseValidationPolicyByRef: (process.env.MEERKAT_SCVP_RESPONSE_VALIDATION_POLICY_BY_REF === "1"),
            protectResponse: (process.env.MEERKAT_SCVP_PROTECT_RESPONSE === "1"),
            cachedResponse: (process.env.MEERKAT_SCVP_CACHED_RESPONSE === "1"),
            signatureAlgorithm: process.env.MEERKAT_SCVP_SIGNATURE_ALGORITHM
                ? ObjectIdentifier.fromString(process.env.MEERKAT_SCVP_SIGNATURE_ALGORITHM.trim())
                : undefined,
            hashAlgorithm: process.env.MEERKAT_SCVP_HASH_ALGORITHM
                ? ObjectIdentifier.fromString(process.env.MEERKAT_SCVP_HASH_ALGORITHM.trim())
                : undefined,
        }
        : undefined,
    idm: {
        port: process.env.MEERKAT_IDM_PORT
            ? Number.parseInt(process.env.MEERKAT_IDM_PORT, 10)
            : undefined,
        bufferSize: process.env.MEERKAT_IDM_BUFFER_SIZE
            ? Number.parseInt(process.env.MEERKAT_IDM_BUFFER_SIZE, 10)
            : DEFAULT_IDM_BUFFER_SIZE,
        maxPDUSize: process.env.MEERKAT_MAX_IDM_PDU_SIZE
            ? Number.parseInt(process.env.MEERKAT_MAX_IDM_PDU_SIZE, 10)
            : DEFAULT_IDM_BUFFER_SIZE,
        maxSegments: process.env.MEERKAT_MAX_IDM_SEGMENTS
            ? Number.parseInt(process.env.MEERKAT_MAX_IDM_SEGMENTS, 10)
            : 10,
    },
    // FIXME: All of the secure protocols should not be enabled if there is no
    // TLS key or cert.
    idms: {
        port: process.env.MEERKAT_IDMS_PORT
            ? Number.parseInt(process.env.MEERKAT_IDMS_PORT, 10)
            : undefined,
    },
    itot: {
        port: process.env.MEERKAT_ITOT_PORT
            ? Number.parseInt(process.env.MEERKAT_ITOT_PORT, 10)
            : undefined,
        abort_timeout_ms: process.env.MEERKAT_ITOT_ABORT_TIMEOUT_IN_SECONDS
            ? (Number.parseInt(process.env.MEERKAT_ITOT_ABORT_TIMEOUT_IN_SECONDS, 10) * 1000)
            : 3000,
        max_nsdu_size: process.env.MEERKAT_ITOT_MAX_NSDU_SIZE
            ? Number.parseInt(process.env.MEERKAT_ITOT_MAX_NSDU_SIZE, 10)
            : 10_000_000,
        max_tpdu_size: process.env.MEERKAT_ITOT_MAX_TPDU_SIZE
            ? Number.parseInt(process.env.MEERKAT_ITOT_MAX_TPDU_SIZE, 10)
            : 65500,
        max_tsdu_size: process.env.MEERKAT_ITOT_MAX_TSDU_SIZE
            ? Number.parseInt(process.env.MEERKAT_ITOT_MAX_TSDU_SIZE, 10)
            : 10_000_000,
        max_ssdu_size: process.env.MEERKAT_ITOT_MAX_SSDU_SIZE
            ? Number.parseInt(process.env.MEERKAT_ITOT_MAX_SSDU_SIZE, 10)
            : 10_000_000,
        max_presentation_contexts: process.env.MEERKAT_ITOT_MAX_PRESENTATION_CONTEXTS
            ? Number.parseInt(process.env.MEERKAT_ITOT_MAX_PRESENTATION_CONTEXTS, 10)
            : 10,
        acse_password: process.env.MEERKAT_ITOT_ACSE_PASSWORD,
    },
    itots: {
        port: process.env.MEERKAT_ITOTS_PORT
            ? Number.parseInt(process.env.MEERKAT_ITOTS_PORT, 10)
            : undefined,
    },
    ldap: {
        port: process.env.MEERKAT_LDAP_PORT
            ? Number.parseInt(process.env.MEERKAT_LDAP_PORT, 10)
            : undefined,
        bufferSize: process.env.MEERKAT_LDAP_BUFFER_SIZE
            ? Number.parseInt(process.env.MEERKAT_LDAP_BUFFER_SIZE, 10)
            : DEFAULT_LDAP_BUFFER_SIZE,
    },
    ldaps: {
        port: process.env.MEERKAT_LDAPS_PORT
            ? Number.parseInt(process.env.MEERKAT_LDAPS_PORT, 10)
            : undefined,
    },
    webAdmin: {
        port: process.env.MEERKAT_WEB_ADMIN_PORT
            ? Number.parseInt(process.env.MEERKAT_WEB_ADMIN_PORT, 10)
            : undefined,
        auth: (
            process.env.MEERKAT_WEB_ADMIN_AUTH_USERNAME
            && process.env.MEERKAT_WEB_ADMIN_AUTH_PASSWORD
        )
            ? {
                username: process.env.MEERKAT_WEB_ADMIN_AUTH_USERNAME,
                password: process.env.MEERKAT_WEB_ADMIN_AUTH_PASSWORD,
                realm: process.env.MEERKAT_WEB_ADMIN_AUTH_REALM
                    ?.replaceAll(/[\t\v\f\\"]/g, "")
                    .replaceAll(/\r?\n/g, ""),
            }
            : undefined,
        useTLS: !!(
            (process.env.MEERKAT_WEB_ADMIN_USE_TLS !== "0")
            && process.env.MEERKAT_TLS_CERT_FILE
            && process.env.MEERKAT_TLS_KEY_FILE
        ),
    },
    localQualifierPointsFor: {
        usingStartTLS: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_STARTTLS, 10)
            : 0,
        usingTLS: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS, 10)
            : 0,
        usingSSLv3: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_SSL3, 10)
            : 0,
        usingTLSv1_0: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_0, 10)
            : 0,
        usingTLSv1_1: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_1, 10)
            : 0,
        usingTLSv1_2: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_2, 10)
            : 0,
        usingTLSv1_3: process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3
            ? Number.parseInt(process.env.MEERKAT_LOCAL_QUALIFIER_POINTS_FOR_USING_TLS_1_3, 10)
            : 0,
    },
    chaining: {
        minAuthRequired: parseAuthLevel(
            process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_CHAINING ?? "1",
            process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_CHAINING,
            process.env.MEERKAT_SIGNING_REQUIRED_FOR_CHAINING,
        ),
        tlsOptional: (process.env.MEERKAT_CHAINING_TLS_OPTIONAL === "1"),
        prohibited: process.env.MEERKAT_PROHIBIT_CHAINING
            ? (process.env.MEERKAT_PROHIBIT_CHAINING === "1")
            : false,
        lcrParallelism: process.env.MEERKAT_LCR_PARALLELISM
            ? Number.parseInt(process.env.MEERKAT_LCR_PARALLELISM, 10)
            : 0,
        scrParallelism: process.env.MEERKAT_SCR_PARALLELISM
            ? Number.parseInt(process.env.MEERKAT_SCR_PARALLELISM, 10)
            : 0,
        signChainedRequests: (process.env.MEERKAT_CHAINING_SIGN_REQUESTS !== "0"),
        checkSignaturesOnResponses: (process.env.MEERKAT_CHAINING_CHECK_SIG !== "0"),
        itot: (process.env.MEERKAT_ITOT_CHAINING !== "0"),
    },
    ob: {
        minAuthRequired: parseAuthLevel(
            process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_OB ?? "1",
            process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB ?? "128",
            process.env.MEERKAT_SIGNING_REQUIRED_FOR_OB,
        ),
        autoAccept: (process.env.MEERKAT_OB_AUTO_ACCEPT === "1"),
    },
    sentinelDomain: process.env.MEERKAT_SENTINEL_DOMAIN,
    administratorEmail: process.env.MEERKAT_ADMINISTRATOR_EMAIL,
    administratorEmailPublic: (process.env.MEERKAT_ADMINISTRATOR_EMAIL_PUBLIC === "1"),
    bulkInsertMode,
    bindMinSleepInMilliseconds: Number.parseInt(process.env.MEERKAT_BIND_MIN_SLEEP_MS ?? "") || 1000,
    bindSleepRangeInMilliseconds: Number.parseInt(process.env.MEERKAT_BIND_SLEEP_RANGE_MS ?? "") || 1000,
    myAccessPointNSAPs: myNSAPs,
    useDatabaseWhenThereAreXSubordinates: process.env.MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES
        ? Number.parseInt(process.env.MEERKAT_USE_DATABASE_WHEN_THERE_ARE_X_SUBORDINATES)
        : 1000,
    entriesPerSubordinatesPage: process.env.MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE
        ? Number.parseInt(process.env.MEERKAT_ENTRIES_PER_SUBORDINATES_PAGE)
        : 100,
    transcodeValuesToDER: ( // Currently does not do anything.
        !process.env.MEERKAT_TRANSCODE_VALUES_TO_DER
        || (process.env.MEERKAT_TRANSCODE_VALUES_TO_DER === "1")
    ),
    transcodeDistinguishedValuesToDER: ( // Currently does not do anything.
        !process.env.MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER
        || (process.env.MEERKAT_TRANSCODE_DISTINGUISHED_VALUES_TO_DER === "1")
    ),
    openTopLevel: (process.env.MEERKAT_OPEN_TOP_LEVEL === "1"),
    forbidAnonymousBind: (process.env.MEERKAT_FORBID_ANONYMOUS_BIND === "1"),
    maxPreBindRequests: process.env.MEERKAT_MAX_PRE_BIND_REQUESTS
        ? Number.parseInt(process.env.MEERKAT_MAX_PRE_BIND_REQUESTS, 10)
        : 0,
    defaultEntryTTL: process.env.MEERKAT_DEFAULT_ENTRY_TTL
        ? Number.parseInt(process.env.MEERKAT_DEFAULT_ENTRY_TTL, 10)
        : 60, // One minute.
    dap: {
        enabled: (process.env.MEERKAT_ENABLE_DAP !== "0"),
    },
    dsp: {
        enabled: (
            (process.env.MEERKAT_ENABLE_DSP === "1")
            || (process.env.MEERKAT_DANGEROUSLY_ENABLE_DSP === "1")
        ),
    },
    dop: {
        enabled: (
            (process.env.MEERKAT_ENABLE_DOP === "1")
            || (process.env.MEERKAT_DANGEROUSLY_ENABLE_DOP === "1")
        ),
    },
};

const ctx: MeerkatContext = {
    alreadyAssertedAttributeCertificates: new Set(),
    externalProcedureAuthFunctions: new Map(),
    labellingAuthorities: new Map(),
    pendingShadowingUpdateCycles: new Map(),
    rbacPolicies: new Map(),
    shadowUpdateCycles: new Map(),
    updatingShadow: new Set(),
    systemProposedRelaxations: new Map(),
    systemProposedTightenings: new Map(),
    i18n,
    config,
    dsa: {
        // This may get overwritten, since `npm_package_version` is not always defined.
        version: process.env.npm_package_version,
        accessPoint: new AccessPoint(
            {
                rdnSequence: [], // To be set later.
            },
            new PresentationAddress(
                undefined,
                undefined,
                undefined,
                myNSAPs,
            ),
            undefined,
        ),
        hibernatingSince: undefined,
        namingContexts: [],
        sentinelTriggeredHibernation: undefined,
    },
    otherDSAs: {
        byStringDN: new Map(),
    },
    associations: new Map(),
    dit: {
        root,
    },
    log: winston.createLogger({
        level: isDebugging
            ? "debug"
            : logLevel,
        format: winston.format.combine(...winstonLogFormats),
        transports: winstonTransports,
        defaultMeta: {
            app: "meerkat",
        },
    }),
    db: 0 as never,
    telemetry: {
        init: async (): Promise<void> => {},
        trackAvailability: () => {},
        trackDependency: () => {},
        trackException: () => {},
        trackRequest: () => {},
        trackMetric: () => {},
        trackEvent: () => {},
        trackTrace: () => {},
    },
    objectIdentifierToName: new Map(),
    nameToObjectIdentifier: new Map(),
    objectClasses: new Map(),
    attributeTypes: new Map(),
    equalityMatchingRules: new Map(),
    orderingMatchingRules: new Map(),
    substringsMatchingRules: new Map(),
    approxMatchingRules: new Map(),
    contextTypes: new Map(),
    matchingRulesSuitableForNaming: new Set(),
    ldapSyntaxes: new Map(),
    ldapSyntaxToASN1Syntax: new Map(),
    operationalBindingControlEvents: new EventEmitter(),
    collectiveAttributes: new Set(),
    nameForms: new Map(),
    usedInvokeIDs: new Set(),
    duplicatedLDAPNames: new Set(),
    // doneModifyingOperationalBinding: new EventEmitter(),
    jobQueue: [],
};

// export default ctx;

let cached_ctx: Context | undefined;

export function getMockCtx (): Context {
    if (cached_ctx) {
        return cached_ctx;
    }
    loadMatchingRules(ctx);
    Object.entries(x500at)
        .map(([ name, spec ]) => attributeFromInformationObject(spec, name))
        .forEach((attr) => {
            ctx.attributeTypes.set(attr.id.toString(), attr);
            attr.ldapNames?.forEach((ldapName: string): void => {
                ctx.attributeTypes.set(ldapName.trim(), attr);
                ctx.attributeTypes.set(ldapName.trim().toLowerCase(), attr);
                if (!attr.ldapSyntax) {
                    return;
                }
                const oidSyntax = ctx.ldapSyntaxes.get(attr.ldapSyntax.toString());
                if (!oidSyntax) {
                    return;
                }
                ctx.ldapSyntaxes.set(ldapName, oidSyntax);
            });
        });
    cached_ctx = ctx;
    return cached_ctx;
}

// This is just put here to prevent `Your test suite must contain at least one test.`
describe.skip("1 + 1", () => {
    it("equals 2", () => {
        expect(true).toBeTruthy();
    });
});
