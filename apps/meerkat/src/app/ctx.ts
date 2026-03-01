import process from "node:process";
import { Buffer } from "node:buffer";
import {
    Context,
    SigningInfo,
    Vertex,
    RemoteCRLCheckiness,
    Configuration,
    OBAutoAcceptSetting,
    OB_AUTO_ACCEPT_ALL,
    OB_AUTO_ACCEPT_NONE,
    OB_AUTO_ACCEPT_MYISSUER,
    OB_AUTO_ACCEPT_MYROOTCA,
    OB_AUTO_ACCEPT_SELF,
} from "./types/index.js";
import { DER } from "@wildboar/asn1/functional";
import {
    AccessPoint,
} from "@wildboar/x500/DistributedOperations";
import {
    PresentationAddress,
} from "@wildboar/x500/SelectedAttributeTypes";
import { EventEmitter } from "node:events";
import {
    configure as configureLogging,
    getConsoleSink,
    getLogger,
    jsonLinesFormatter,
    LogLevel as LogtapeLogLevel,
    getTextFormatter,
    getAnsiColorFormatter,
} from "@logtape/logtape";
import { getRotatingFileSink } from "@logtape/file";
import { getSyslogSink } from "@logtape/syslog";
import i18n from "i18next";
import { uriToNSAP } from "@wildboar/x500";
import { URL } from "node:url";
import {
    DEFAULT_IDM_BUFFER_SIZE,
    DEFAULT_LDAP_BUFFER_SIZE,
    DEFAULT_REMOTE_CRL_CACHE_TTL,
} from "./constants.js";
import type { SecureVersion } from "node:tls";
import * as fs from "node:fs";
import { PEMObject } from "@wildboar/pem";
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
    id_stc_build_aa_path,
} from "@wildboar/scvp";
import {
    id_ct_contentInfo,
    id_ct_authData,
    id_signedData,
    id_digestedData,
    ContentInfo,
    _decode_ContentInfo,
    _encode_ContentInfo,
    _decode_AuthenticatedData,
    _decode_SignedData,
    EncapsulatedContentInfo,
    _decode_DigestedData,
} from "@wildboar/cms";
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
import { KeyObject, createPrivateKey, randomUUID } from "node:crypto";
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
import { rootCertificates } from "node:tls";
import { strict as assert } from "node:assert";
import { createPublicKey } from "node:crypto";
import { id_simpleSecurityPolicy, simple_rbac_acdf } from "./authz/rbacACDF.js";
import { subjectKeyIdentifier } from "@wildboar/x500/CertificateExtensions";
import { subjectAltName } from "@wildboar/x500/CertificateExtensions";
import { Name } from "@wildboar/x500/InformationFramework";
import { _encode_SubjectPublicKeyInfo } from "@wildboar/pki-stub";
import { id_tls_client_auth, tls_client_auth } from "./authn/external/tls_client_auth.js";
import { PrismaClient } from './generated/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { readFileSync } from "node:fs";
import decodeLDAPDN from "./ldap/decodeLDAPDN.js";

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL ?? ":memory:",
}, {
    // Recommended choice here: https://www.prisma.io/docs/orm/overview/databases/sqlite#3-configure-timestamp-format-for-backward-compatibility
    timestampFormat: 'iso8601',
});
const db = new PrismaClient({
    adapter,
    // log: ["query"], // Uncomment to log queries
});

function parseLogLevel(s: string | null | undefined): LogtapeLogLevel {
    if (!s) {
        return "info";
    }
    return ({
        trace: "trace",
        tracing: "trace",
        debug: "debug",
        debugging: "debug",
        dbug: "debug",
        info: "info",
        notice: "info",
        warning: "warning",
        warn: "warning",
        error: "error",
        err: "error",
        fatal: "fatal",
        lethal: "fatal",
        emerg: "fatal",
    } as const)[s.trim().toLowerCase()] ?? "debug";
}

/**
 * Meerkat DSA once used Microsoft Azure's ApplicationInsights.
 * (The last three words above are probably Trademarked.)
 * These functions are now tombstones for its functionality.
 */
export
interface MeerkatTelemetryClient {
    init: () => Promise<void>;
    trackAvailability: (...args: any[]) => any;
    trackEvent: (...args: any[]) => any;
    trackMetric: (...args: any[]) => any;
    trackRequest: (...args: any[]) => any;
    trackException: (...args: any[]) => any;
    trackDependency: (...args: any[]) => any;
    trackTrace: (...args: any[]) => any;
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
        const bytes_read = el.fromBytes(pem.data);
        if (bytes_read !== pem.data.length) {
            throw new Error("Malformed attribute certificate DER: trailing data.");
        }
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

const talFileContents: Buffer | undefined = process.env.MEERKAT_TRUST_ANCHORS_FILE
    ? fs.readFileSync(process.env.MEERKAT_TRUST_ANCHORS_FILE)
    : undefined;
const trustAnchorList: TrustAnchorList = talFileContents
    ? [
        ...parseTrustAnchorListFile(talFileContents),
        ...signingCACerts.map((certificate) => ({ certificate })),
    ]
    : signingCACerts.map((certificate) => ({ certificate }));

const clearanceAuthoritiesFileContents: Buffer | undefined = process.env.MEERKAT_CLEARANCE_AUTHORITIES
    ? fs.readFileSync(process.env.MEERKAT_CLEARANCE_AUTHORITIES)
    : undefined;
const clearanceAuthorities: TrustAnchorList = clearanceAuthoritiesFileContents
    ? [
        ...parseTrustAnchorListFile(clearanceAuthoritiesFileContents),
        ...signingCACerts.map((certificate) => ({ certificate })),
    ]
    : signingCACerts.map((certificate) => ({ certificate }));

const labellingAuthoritiesFileContents: Buffer | undefined = process.env.MEERKAT_LABELLING_AUTHORITIES
    ? fs.readFileSync(process.env.MEERKAT_LABELLING_AUTHORITIES)
    : undefined;
const labellingAuthorities: TrustAnchorList = labellingAuthoritiesFileContents
    ? [
        ...parseTrustAnchorListFile(labellingAuthoritiesFileContents),
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
            const bytes_read = el.fromBytes(pem.data);
            if (bytes_read !== pem.data.length) {
                throw new Error("Malformed certificate DER: trailing data.");
            }
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

const isSystemdService: boolean = !!process.env.INVOCATION_ID;

const isSystemdSyslogPrefix: boolean = (
    isSystemdService
    && (process.env.MEERKAT_LOG_SYSTEMD_LEVEL_PREFIX === "1")
);

/* If Meerkat DSA is running in a Systemd service, we do not print the
timestamp in log messages, because Journald automatically includes its own
timestamps; otherwise, timestamps defaults to on unless explicitly disabled. */
const logTimestamp: boolean = isSystemdService
    ? (process.env.MEERKAT_LOG_TIMESTAMP === "1")
    : (process.env.MEERKAT_LOG_TIMESTAMP !== "0");

const DEFAULT_LOG_FILE_BUFFER_SIZE = 8192;
const logFileBufferSize: number = (() => {
    const raw = process.env.MEERKAT_LOG_FILE_BUFFER_SIZE;
    if (raw === undefined || raw === "") return DEFAULT_LOG_FILE_BUFFER_SIZE;
    const n = Number.parseInt(raw, 10);
    return (Number.isNaN(n) || n < 1) ? DEFAULT_LOG_FILE_BUFFER_SIZE : n;
})();

const syslogLevels = new Map([
    ["T", "<7>"],
    ["D", "<7>"],
    ["I", "<6>"],
    ["W", "<4>"],
    ["E", "<3>"],
    ["F", "<1>"],
]);

function parseOBAutoAccept(env_var?: string): OBAutoAcceptSetting {
    const normalized = env_var?.trim().toLowerCase() ?? "0";
    const ret = ({
        [0]: OB_AUTO_ACCEPT_NONE,
        [1]: OB_AUTO_ACCEPT_ALL,
        "none": OB_AUTO_ACCEPT_NONE,
        "all": OB_AUTO_ACCEPT_ALL,
        "self": OB_AUTO_ACCEPT_SELF,
        "myissuer": OB_AUTO_ACCEPT_MYISSUER,
        "myrootca": OB_AUTO_ACCEPT_MYROOTCA
    })[normalized] ?? -1;
    if (ret === -1) {
        throw new Error(`Invalid setting for MEERKAT_OB_AUTO_ACCEPT: ${env_var}`);
    }
    return ret;
}

const config: Configuration = {
    vendorName: process.env.MEERKAT_VENDOR_NAME?.length
        ? process.env.MEERKAT_VENDOR_NAME
        : undefined,
    vendorVersion: process.env.MEERKAT_VENDOR_VERSION?.length
        ? process.env.MEERKAT_VENDOR_VERSION
        : undefined,
    requireMutualAuth: (process.env.MEERKAT_MUTUAL_AUTH_OPTIONAL !== "1"),
    xr: {
        requestCrossReferences: (process.env.MEERKAT_REQUEST_CROSS_REFERENCES === "1"),
        returnCrossReferences: (process.env.MEERKAT_RETURN_CROSS_REFERENCES === "1"),
        signingRequiredToTrust: (process.env.MEERKAT_SIGNING_REQUIRED_TO_TRUST_XR !== "0"),
        upsertConcurrency: (() => {
            const val = Number.parseInt(
                process.env.MEERKAT_XR_UPSERT_CONCURRENCY ?? "5",
                10,
            );
            return (Number.isNaN(val) || val < 1) ? 5 : val;
        })(),
    },
    principledServiceAdministration: (process.env.MEERKAT_PRINCIPLED_SERVICE_ADMIN === "1"),
    revealUserPwdEncryptedValues: (process.env.MEERKAT_REVEAL_USER_PWD === "1"),
    maxRelaxationsOrTightenings: process.env.MEERKAT_MAX_RELAXATIONS
        ? Number.parseInt(process.env.MEERKAT_MAX_RELAXATIONS, 10)
        : 3,
    attributeCertificateDuration: process.env.MEERKAT_ATTR_CERT_DURATION
        ? Number.parseInt(process.env.MEERKAT_ATTR_CERT_DURATION, 10)
        : 3600,
    authn: {
        lookupPkiPathForUncertifiedStrongAuth: (process.env.MEERKAT_LOOKUP_UNCERT_STRONG_AUTH === "1"),
        attributeCertificationPath,
        remotePaswordCompareTimeLimit: process.env.MEERKAT_REMOTE_PWD_TIME_LIMIT
            ? Number.parseInt(process.env.MEERKAT_REMOTE_PWD_TIME_LIMIT, 10)
            : 0, // 0 disables this procedure.
        remotePasswordLocalScopeOnly: (process.env.MEERKAT_REMOTE_PWD_LOCAL_SCOPE === "1"),
        fetchRemoteAuthorizationAttributes: (process.env.MEERKAT_FETCH_REMOTE_AUTHZ_ATTRS !== "0"),
        automaticallyTrustForIBRA: process.env.MEERKAT_TRUST_FOR_IBRA?.toUpperCase(),
    },
    rbac: {
        getClearancesFromDSAIT: (process.env.MEERKAT_GET_CLEARANCES_FROM_DSAIT !== "0"),
        getClearancesFromAttributeCertificates: (process.env.MEERKAT_GET_CLEARANCES_FROM_ATTR_CERTS !== "0"),
        getClearancesFromPublicKeyCert: (process.env.MEERKAT_GET_CLEARANCES_FROM_PKC !== "0"),
        clearanceAuthorities,
        labellingAuthorities,
    },
    log: {
        boundDN: (process.env.MEERKAT_LOG_BOUND_DN === "1"),
        fileBufferSize: logFileBufferSize,
        options: {
            sinks: {
                ...(process.env.MEERKAT_NO_CONSOLE === "1")
                    ? {}
                    : {
                        safe: getConsoleSink(),
                        console: getConsoleSink({ formatter: process.env.MEERKAT_LOG_JSON === "1"
                            ? jsonLinesFormatter
                            : ((((process.env.MEERKAT_NO_COLOR ?? process.env.NO_COLOR) === "1") || isSystemdService)
                                ? getTextFormatter({
                                    timestamp: logTimestamp ? "rfc3339" : "none",
                                    level: isSystemdSyslogPrefix ? "L" : undefined,
                                    format: isSystemdSyslogPrefix
                                        ? (values) => {
                                            const syslogLevel = syslogLevels.get(values.level) ?? "<6>";
                                            return `${syslogLevel}${values.message}`;
                                        }
                                        : undefined,
                                })
                                : getAnsiColorFormatter({
                                    // I cannot choose "none" here.
                                    // Issue reported here: https://github.com/dahlia/logtape/issues/120
                                    // This should still work.
                                    timestamp: logTimestamp ? "rfc3339" : "none" as "date",
                                }))
                        })
                    },
                ...process.env.MEERKAT_LOG_FILE
                    ? {
                        file: getRotatingFileSink(process.env.MEERKAT_LOG_FILE, {
                            maxFiles: Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_FILES ?? "5", 10),
                            maxSize: Number.parseInt(process.env.MEERKAT_LOG_FILE_MAX_SIZE ?? "1000000", 10),
                            // Intentionally always JSON
                            formatter: jsonLinesFormatter,
                            bufferSize: logFileBufferSize,
                            flushInterval: 5000, // TODO: Make this configurable
                        })
                    }
                    : {},
                ...process.env.MEERKAT_LOG_SYSLOG === "1"
                    ? {
                        syslog: getSyslogSink({
                            includeStructuredData: true,
                            appName: process.env.MEERKAT_LOG_SYSLOG_APP_NAME ?? "meerkat",
                            hostname: process.env.MEERKAT_LOG_SYSLOG_HOST,
                            port: process.env.MEERKAT_LOG_SYSLOG_PORT
                                ? Number.parseInt(process.env.MEERKAT_LOG_SYSLOG_PORT, 10)
                                : undefined,
                            protocol: process.env.MEERKAT_LOG_SYSLOG_TCP === "1"
                                ? "tcp"
                                : "udp",
                            timeout: process.env.MEERKAT_LOG_SYSLOG_TIMEOUT
                                ? Number.parseInt(process.env.MEERKAT_LOG_SYSLOG_TIMEOUT, 10)
                                : undefined,
                            secure: process.env.MEERKAT_LOG_SYSLOG_TLS === "1",
                            tlsOptions: {
                                rejectUnauthorized: process.env.MEERKAT_LOG_SYSLOG_REJECT_UNAUTH === "1",
                                ca: process.env.MEERKAT_LOG_SYSLOG_CA
                                    ? readFileSync(process.env.MEERKAT_LOG_SYSLOG_CA, { encoding: "utf-8" })
                                    : undefined,
                            },
                        }),
                    }
                    : {},
            },
            loggers: [
                { category: ["logtape", "meta"], lowestLevel: "warning", sinks: ["safe"] },
                {
                    category: ["meerkat"],
                    lowestLevel: parseLogLevel(process.env.MEERKAT_LOG_LEVEL),
                    sinks: [
                        ...(process.env.MEERKAT_NO_CONSOLE === "1")
                            ? []
                            : ["console"],
                        ...process.env.MEERKAT_LOG_FILE
                            ? ["file"]
                            : [],
                    ],
                },
            ]
        },
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
    maxUsedInvokeIDs: (() => {
        const raw = process.env.MEERKAT_MAX_USED_INVOKE_IDS;
        if (raw === undefined || raw === "") return 10000;
        const n = Number.parseInt(raw, 10);
        return Number.isNaN(n) || n < 0 ? 10000 : n;
    })(),
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
        requestCert: (
            (process.env.MEERKAT_TLS_REJECT_UNAUTHORIZED_CLIENTS === "1")
            || (process.env.MEERKAT_TLS_REQUEST_CERT === "1")
        ),
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
        onlyFollowSignedReferrals: (process.env.MEERKAT_ONLY_FOLLOW_SIGNED_REFERRALS !== "0"),
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
        strongCredentialsTimeToLiveInSeconds: process.env.MEERKAT_CHAINING_STRONG_CREDS_TTL
            ? Number.parseInt(process.env.MEERKAT_CHAINING_STRONG_CREDS_TTL, 10)
            : 60,
        followReferralTTL: (() => {
            const raw = process.env.MEERKAT_FOLLOW_REFERRAL_TTL;
            if (raw === undefined) return 0;
            const n = Number.parseInt(raw, 10);
            return Number.isNaN(n) ? 0 : Math.max(0, n);
        })(),
    },
    ob: {
        minAuthRequired: parseAuthLevel(
            process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_OB ?? "1",
            process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_OB ?? "128",
            process.env.MEERKAT_SIGNING_REQUIRED_FOR_OB,
        ),
        autoAccept: parseOBAutoAccept(process.env.MEERKAT_OB_AUTO_ACCEPT),
    },
    shadowing: {
        minAuthRequired: parseAuthLevel(
            process.env.MEERKAT_MIN_AUTH_LEVEL_FOR_DISP ?? "1",
            process.env.MEERKAT_MIN_AUTH_LOCAL_QUALIFIER_FOR_DISP ?? "128",
            process.env.MEERKAT_SIGNING_REQUIRED_FOR_DISP,
        ),
        replicateEverythingFrom: process.env.MEERKAT_REPLICATE_EVERYTHING_FROM
            ? URL.parse(process.env.MEERKAT_REPLICATE_EVERYTHING_FROM)
            : undefined,
        replicateEverythingFromAETitle: undefined,
        lastUpdateDisputeThreshold: Number.parseInt(process.env.MEERKAT_LAST_UPDATE_DISPUTE_THRESHOLD ?? "60", 10),
        secondaryReplicaUpdateConcurrency: process.env.MEERKAT_SHADOW_SECONDARY_REPLICA_UPDATE_CONCURRENCY
            ? Number.parseInt(process.env.MEERKAT_SHADOW_SECONDARY_REPLICA_UPDATE_CONCURRENCY, 10)
            : 2,
        totalRefreshDeletionPageSize: process.env.MEERKAT_SHADOW_TOTAL_REFRESH_DELETION_PAGE_SIZE
            ? Number.parseInt(process.env.MEERKAT_SHADOW_TOTAL_REFRESH_DELETION_PAGE_SIZE, 10)
            : 100,
        totalRefreshVertexConcurrency: process.env.MEERKAT_SHADOW_TOTAL_REFRESH_VERTEX_CONCURRENCY
            ? Number.parseInt(process.env.MEERKAT_SHADOW_TOTAL_REFRESH_VERTEX_CONCURRENCY, 10)
            : 4,
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
    disp: {
        enabled: (process.env.MEERKAT_ENABLE_DISP === "1"),
    },
};

await configureLogging(config.log.options);

const ctx: MeerkatContext = {
    /* It seems like I have to do this. For some reason, the types do not
    align with the Javascript of this package: if I get a type error, the
    running program works, but if I fix the type error, the program will crash
    with a type error. I HATE Javascript. */
    i18n: i18n as unknown as i18n.i18n,
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
    },
    otherDSAs: {
        byStringDN: new Map(),
    },
    associations: new Map(),
    dit: {
        root,
    },
    log: getLogger("meerkat"),
    db,
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
    systemProposedRelaxations: new Map(),
    systemProposedTightenings: new Map(),
    pendingShadowingUpdateCycles: new Map(),
    shadowUpdateCycles: new Map(),
    updatingShadow: new Set(),
    labellingAuthorities: new Map(),
    rbacPolicies: new Map([ [id_simpleSecurityPolicy.toString(), simple_rbac_acdf] ]),
    alreadyAssertedAttributeCertificates: new Set(),
    externalProcedureAuthFunctions: new Map([ [id_tls_client_auth.toString(), tls_client_auth] ]),
    recentlyAddedCrossReferences: new Map(),
};

for (const la of labellingAuthorities) {
    if (("certificate" in la) || ("tbsCert" in la)) {
        const tbs = ("certificate" in la)
            ? la.certificate.toBeSigned
            : la.tbsCert;
        const ski_ext = tbs.extensions
            ?.find((ext) => ext.extnId.isEqualTo(subjectKeyIdentifier["&id"]!));
        if (!ski_ext) {
            continue;
        }
        const ski_el = new DERElement();
        ski_el.fromBytes(ski_ext.extnValue);
        const ski = subjectKeyIdentifier.decoderFor["&ExtnType"]!(ski_el);

        const issuerNames: Name[] = [ tbs.issuer ];
        const san_ext = tbs.extensions
            ?.find((ext) => ext.extnId.isEqualTo(subjectAltName["&id"]!));
        if (san_ext) {
            const san_el = new DERElement();
            san_el.fromBytes(san_ext.extnValue);
            const sans = subjectAltName.decoderFor["&ExtnType"]!(san_el);
            for (const san of sans) {
                if ("directoryName" in san) {
                    issuerNames.push(san.directoryName);
                }
            }
        }

        const spkiBytes = _encode_SubjectPublicKeyInfo(tbs.subjectPublicKeyInfo, DER).toBytes();
        const publicKey = createPublicKey({
            key: Buffer.from(spkiBytes),
            format: "der",
            type: "spki",
        });

        ctx.labellingAuthorities.set(Buffer.from(ski).toString("base64"), {
            authorized: true,
            issuerNames,
            publicKey,
        });
    }
    else {
        const anchor = la.taInfo;
        const issuerNames: Name[] = [];
        if (anchor.certPath?.certificate) {
            issuerNames.push(anchor.certPath.certificate.toBeSigned.issuer);
        }
        const exts = [
            ...anchor.exts ?? [],
            ...anchor.certPath?.certificate?.toBeSigned.extensions ?? [],
        ];
        const san_ext = exts
            ?.find((ext) => ext.extnId.isEqualTo(subjectAltName["&id"]!));
        if (san_ext) {
            const san_el = new DERElement();
            san_el.fromBytes(san_ext.extnValue);
            const sans = subjectAltName.decoderFor["&ExtnType"]!(san_el);
            for (const san of sans) {
                if ("directoryName" in san) {
                    issuerNames.push(san.directoryName);
                }
            }
        }
        const spkiBytes = _encode_SubjectPublicKeyInfo(anchor.pubKey, DER).toBytes();
        const publicKey = createPublicKey({
            key: Buffer.from(spkiBytes),
            format: "der",
            type: "spki",
        });
        ctx.labellingAuthorities.set(Buffer.from(anchor.keyId).toString("base64"), {
            authorized: true,
            issuerNames,
            publicKey,
        });
    }
}

if (process.env.MEERKAT_REPLICATE_EVERYTHING_FROM_AE_TITLE) {
    ctx.config.shadowing.replicateEverythingFromAETitle = {
        rdnSequence: decodeLDAPDN(ctx, process.env.MEERKAT_REPLICATE_EVERYTHING_FROM_AE_TITLE).reverse(),
    };
}

export default ctx;
