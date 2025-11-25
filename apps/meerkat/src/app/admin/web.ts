import type { Request, Response, NextFunction } from "express";
import { MeerkatContext, default as ctx } from "../ctx.js";
import * as fs from "fs/promises";
import * as path from "path";
import flat from "flat";
import { getServerStatistics } from "../telemetry/getServerStatistics.js";
import sleep from "../utils/sleep.js";
import stringifyDN from "../x500/stringifyDN.js";
import { rdnFromJson } from "../x500/rdnFromJson.js";
import { stringifyRelativeDistinguishedName as rdnToString } from "@wildboar/ldap";
import { type StringEncoderGetter } from "@wildboar/ldap";
import { type StringEncoder } from "@wildboar/ldap";
import { OBJECT_IDENTIFIER, ASN1Element, ASN1TagClass, ASN1UniversalType, BIT_STRING, TRUE_BIT, packBits, DERElement } from "@wildboar/asn1";
import type {
    RelativeDistinguishedName
} from "@wildboar/x500/InformationFramework";
import getRDNFromEntryId from "../database/getRDNFromEntryId.js";
import getDNFromEntryId from "../database/getDNFromEntryId.js";
import { id_ar_autonomousArea } from "@wildboar/x500/InformationFramework";
import { id_ar_accessControlSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_accessControlInnerArea } from "@wildboar/x500/InformationFramework";
import { id_ar_subschemaAdminSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_collectiveAttributeSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_collectiveAttributeInnerArea } from "@wildboar/x500/InformationFramework";
import { id_ar_contextDefaultSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_serviceSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_ar_pwdAdminSpecificArea } from "@wildboar/x500/InformationFramework";
import { id_sc_accessControlSubentry } from "@wildboar/x500/InformationFramework";
import { id_sc_collectiveAttributeSubentry } from "@wildboar/x500/InformationFramework";
import { id_sc_contextAssertionSubentry } from "@wildboar/x500/InformationFramework";
import { id_sc_serviceAdminSubentry } from "@wildboar/x500/InformationFramework";
import { id_sc_pwdAdminSubentry } from "@wildboar/x500/InformationFramework";
import { id_oc_parent } from "@wildboar/x500/InformationFramework";
import { id_oc_child } from "@wildboar/x500/InformationFramework";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry.js";
import readValues from "../database/entry/readValues.js";
import deleteEntry from "../database/deleteEntry.js";
import escape from "escape-html";
import type { DistinguishedName } from "@wildboar/pki-stub";
import dnToVertex from "../dit/dnToVertex.js";
import {
    EntryInformationSelection,
} from "@wildboar/x500/DirectoryAbstractService";
import {
    distinguishedNameMatch,
} from "@wildboar/x500/InformationFramework";
import {
    _decode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import readSubordinates from "../dit/readSubordinates.js";
import { subschema } from "@wildboar/x500/SchemaAdministration";
import { getLDAPSyntax } from "../x500/getLDAPSyntax.js";
import { entryDN } from "@wildboar/parity-schema/src/lib/modules/RFC5020EntryDN/entryDN.oa.js";
import { dseType } from "@wildboar/x500/DSAOperationalAttributeTypes";
import {
    DSEType_admPoint,
    DSEType_alias,
    DSEType_cp,
    DSEType_ditBridge,
    DSEType_dsSubentry,
    DSEType_entry,
    DSEType_familyMember,
    DSEType_glue,
    DSEType_immSupr,
    DSEType_nssr,
    DSEType_rhob,
    DSEType_root,
    DSEType_sa,
    DSEType_shadow,
    DSEType_subentry,
    DSEType_subr,
    DSEType_supr,
    DSEType_xr,
} from "@wildboar/x500/DSAOperationalAttributeTypes";
import { getRDN } from "@wildboar/x500";
import { Context, Vertex, RemoteCRLCheckiness } from "@wildboar/meerkat-types";
import type { Entry } from "@prisma/client";
import { DER } from "@wildboar/asn1/functional";
import { stringifyGN } from "../x500/stringifyGN.js";
import { getDateFromTime } from "@wildboar/x500";
import {
    Certificate,
    _decode_Certificate,
    _encode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import { groupByOID } from "../utils/groupByOID.js";
import {
    subjectDirectoryAttributes,
} from "@wildboar/x500/CertificateExtensions";
import {
    subjectKeyIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    keyUsage,
} from "@wildboar/x500/CertificateExtensions";
import {
    privateKeyUsagePeriod,
} from "@wildboar/x500/CertificateExtensions";
import {
    subjectAltName,
} from "@wildboar/x500/CertificateExtensions";
import {
    issuerAltName,
} from "@wildboar/x500/CertificateExtensions";
import {
    basicConstraints,
} from "@wildboar/x500/CertificateExtensions";
import {
    nameConstraints,
} from "@wildboar/x500/CertificateExtensions";
import {
    cRLDistributionPoints,
} from "@wildboar/x500/CertificateExtensions";
import {
    certificatePolicies,
} from "@wildboar/x500/CertificateExtensions";
import {
    policyMappings,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorityKeyIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    policyConstraints,
} from "@wildboar/x500/CertificateExtensions";
import {
    extKeyUsage,
} from "@wildboar/x500/CertificateExtensions";
import {
    inhibitAnyPolicy,
} from "@wildboar/x500/CertificateExtensions";
import {
    subjectAltPublicKeyInfo,
} from "@wildboar/x500/CertificateExtensions";
import {
    altSignatureAlgorithm,
} from "@wildboar/x500/CertificateExtensions";
import {
    altSignatureValue,
} from "@wildboar/x500/CertificateExtensions";
import {
    associatedInformation,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorizationValidation,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorityInfoAccess,
} from "@wildboar/x500/PkiPmiExternalDataTypes";
import {
    subjectInfoAccess,
} from "@wildboar/x500/PkiPmiExternalDataTypes";
import type {
    GeneralSubtree,
} from "@wildboar/x500/CertificateExtensions";
import type {
    AttributesSyntax,
} from "@wildboar/x500/CertificateExtensions";
import {
    _encode_SubjectPublicKeyInfo,
} from "@wildboar/x500/AuthenticationFramework";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import type {
    CertificateList,
} from "@wildboar/x500/AuthenticationFramework";
import { createHash, KeyObject, createPrivateKey } from "node:crypto";
import {
    cRLNumber,
} from "@wildboar/x500/CertificateExtensions";
import {
    statusReferrals,
} from "@wildboar/x500/CertificateExtensions";
import {
    cRLStreamIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    orderedList,
} from "@wildboar/x500/CertificateExtensions";
import {
    deltaInfo,
} from "@wildboar/x500/CertificateExtensions";
import {
    toBeRevoked,
} from "@wildboar/x500/CertificateExtensions";
import {
    revokedGroups,
} from "@wildboar/x500/CertificateExtensions";
import {
    expiredCertsOnCRL,
} from "@wildboar/x500/CertificateExtensions";
// import {
//     reasonCode,
// } from "@wildboar/x500/CertificateExtensions";
// import {
//     holdInstructionCode,
// } from "@wildboar/x500/CertificateExtensions";
// import {
//     invalidityDate,
// } from "@wildboar/x500/CertificateExtensions";
import type {
    TrustAnchorChoice,
} from "@wildboar/tal";
import type {
    TrustAnchorInfo,
} from "@wildboar/tal";
import type {
    TBSCertificate,
} from "@wildboar/x500/AuthenticationFramework";
import {
    TrustAnchorList,
    _encode_TrustAnchorList,
} from "@wildboar/tal";
import {
    id_ct_trustAnchorList,
} from "@wildboar/tal";
import {
    ContentInfo,
    _encode_ContentInfo,
    EncapsulatedContentInfo,
} from "@wildboar/cms";
import { PEMObject } from "@wildboar/pem";
import { createCMSSignedData } from "../pki/createCMSSignedData.js";
import { PkiPath } from "@wildboar/pki-stub";
import { id_data } from "@wildboar/cms";
import {
    CertificationRequest,
    _encode_CertificationRequest,
    CertificationRequestInfo,
    _encode_CertificationRequestInfo,
    CertificationRequestInfo_version_v1,
} from "@wildboar/pkcs/PKCS-10";
import { generateSIGNED } from "../pki/generateSIGNED.js";
import {
    _encode_PkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import { verifyAnyCertPath } from "../pki/verifyAnyCertPath.js";
import {
    VerifyCertPathResult,
    VCPReturnCode,
    VCP_RETURN_OK,
    VCP_RETURN_INVALID_SIG,
    VCP_RETURN_OCSP_REVOKED,
    VCP_RETURN_OCSP_OTHER,
    VCP_RETURN_CRL_REVOKED,
    VCP_RETURN_CRL_UNREACHABLE,
    VCP_RETURN_MALFORMED,
    VCP_RETURN_BAD_KEY_USAGE,
    VCP_RETURN_BAD_EXT_KEY_USAGE,
    VCP_RETURN_UNKNOWN_CRIT_EXT,
    VCP_RETURN_DUPLICATE_EXT,
    VCP_RETURN_AKI_SKI_MISMATCH,
    VCP_RETURN_PKU_PERIOD,
    VCP_RETURN_BASIC_CONSTRAINTS_CA,
    VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN,
    VCP_RETURN_INVALID_EXT_CRIT,
    VCP_RETURN_UNTRUSTED_ANCHOR,
    VCP_RETURN_INVALID_TIME,
    VCP_RETURN_ISSUER_SUBJECT_MISMATCH,
    VCP_RETURN_NAME_NOT_PERMITTED,
    VCP_RETURN_NAME_EXCLUDED,
    VCP_RETURN_PROHIBITED_SIG_ALG,
} from "../pki/verifyCertPath.js";
import {
    CertificatePair,
    CertificationPath,
} from "@wildboar/x500/AuthenticationFramework";
import { crlCache } from "../pki/crlCurl.js";
import { AttributeCertificate } from "@wildboar/pki-stub";
import * as os from "node:os";
import { fileURLToPath } from "node:url";
import { timingSafeEqual, randomInt } from "crypto";

const flatten = flat.flatten;

async function unauthorized (
    ctx: Context,
    req: Request,
    res: Response,
    invalidCredentials: boolean = false,
): Promise<void> {
    if (res.socket && invalidCredentials) {
        const host = `${res.socket.remoteFamily}://${res.socket.remoteAddress}/${res.socket.remotePort}`;
        const logInfo = {
            host,
            method: req.method,
            path: req.path,
        };
        ctx.log.warn(ctx.i18n.t("log:auth_failure_web_admin", logInfo), logInfo);
    }
    /**
     * Wait 1 - 3 seconds before responding to mitigate timing attacks.
     */
    await sleep(randomInt(1000, 3000));
    if (ctx.config.webAdmin.auth?.realm) {
        const realm = ctx.config.webAdmin.auth.realm;
        // `realm` was already escaped at start-time.
        res.setHeader("WWW-Authenticate", `Basic realm="${realm}", charset="UTF-8"`);
    } else {
        res.setHeader("WWW-Authenticate", "Basic charset=\"UTF-8\"");
    }
    res.sendStatus(401);
}

async function basicAuthMiddleware(req: MeerkatReq, res: Response, next: NextFunction): Promise<void> {
    if (!req.ctx.config.webAdmin.auth) {
        next();
        return;
    }
    const authzHeader = req.headers["authorization"];
    if (!authzHeader || !authzHeader.startsWith("Basic ")) {
        await unauthorized(req.ctx, req, res);
        return;
    }
    const base64Creds: string = authzHeader.slice("Basic ".length).trim();
    const decoded = Buffer.from(base64Creds, "base64").toString("utf-8");
    const indexOfFirstColon: number = decoded.indexOf(":");
    if (indexOfFirstColon < 0) {
        await unauthorized(req.ctx, req, res);
        return;
    }
    const suppliedUsername = decoded.slice(0, indexOfFirstColon);
    const suppliedPassword = decoded.slice(indexOfFirstColon + 1);
    const expectedUsernameBuf = Buffer.from(req.ctx.config.webAdmin.auth.username);
    const expectedPasswordBuf = Buffer.from(req.ctx.config.webAdmin.auth.password);
    // NOTE: The realm is not used.
    const usernameBuf = Buffer.from(suppliedUsername);
    const passwordBuf = Buffer.from(suppliedPassword);

    /**
     * NOTE: We convert the username and password strings to `Buffer`s first
     * because the `.length` of a string is UTF-16 code units, but the
     * length of a buffer is bytes; therefore, two strings having a similar
     * number of characters may not have the same buffer length when
     * converted to bytes.
     *
     * This matters because `crypto.timingSafeEqual()` expects the buffers
     * to be of the same length before it is called, so we have to compare
     * the two correctly.
     */
    const validCredentials: boolean = (
        (usernameBuf.length === expectedUsernameBuf.length)
        && (passwordBuf.length === expectedPasswordBuf.length)
        && timingSafeEqual(usernameBuf, expectedUsernameBuf)
        && timingSafeEqual(passwordBuf, expectedPasswordBuf)
    );
    if (!validCredentials) {
        await unauthorized(req.ctx, req, res, true);
        return;
    }
    next();
}

function canFail (cb: () => string): string {
    try {
        return cb();
    } catch {
        return "ERROR";
    }
}

function errorHandlingMiddleware (req: MeerkatReq, _: Response, next: NextFunction): void {
    try {
        next();
    } catch (e) {
        req.ctx.log.error(`${e}`);
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const conformancePath = path.join(__dirname, "assets", "static", "conformance.md");
const ROBOTS: string = `User-agent: *\r\nDisallow: /\r\n`;
const SECURITY_TXT: string = [
    "Contact: mailto:jonathan.wilbur@wildboarsoftware.com",
    "Expires: 2025-12-19T18:28:00.000Z",
    "Preferred-Languages: en",
].join("\r\n");

const selectAllInfo = new EntryInformationSelection(
    {
        allUserAttributes: null,
    },
    undefined,
    {
        allOperationalAttributes: null,
    },
    {
        allContexts: null,
    },
    true,
    undefined,
);

const autonomousArea: string = id_ar_autonomousArea.toString();
const accessControlSpecificArea: string = id_ar_accessControlSpecificArea.toString();
const accessControlInnerArea: string = id_ar_accessControlInnerArea.toString();
const subschemaAdminSpecificArea: string = id_ar_subschemaAdminSpecificArea.toString();
const collectiveAttributeSpecificArea: string = id_ar_collectiveAttributeSpecificArea.toString();
const collectiveAttributeInnerArea: string = id_ar_collectiveAttributeInnerArea.toString();
const contextDefaultSpecificArea: string = id_ar_contextDefaultSpecificArea.toString();
const serviceSpecificArea: string = id_ar_serviceSpecificArea.toString();
const pwdAdminSpecificArea: string = id_ar_pwdAdminSpecificArea.toString();

const accessControlSubentry: string = id_sc_accessControlSubentry.toString();
const collectiveAttributeSubentry: string = id_sc_collectiveAttributeSubentry.toString();
const contextAssertionSubentry: string = id_sc_contextAssertionSubentry.toString();
const serviceAdminSubentry: string = id_sc_serviceAdminSubentry.toString();
const pwdAdminSubentry: string = id_sc_pwdAdminSubentry.toString();
const subschemaSubentry: string = subschema["&id"].toString();

const parent: string = id_oc_parent.toString();
const child: string = id_oc_child.toString();

function encodeRDN (ctx: Context, rdn: RelativeDistinguishedName): string {
    const stringEncoderGetter: StringEncoderGetter = (syntax: OBJECT_IDENTIFIER): StringEncoder | undefined => {
        const attrSpec = ctx.attributeTypes.get(syntax.toString());
        if (!attrSpec) {
            return undefined;
        }
        const ldapSyntax = getLDAPSyntax(ctx, attrSpec.id);
        if (!ldapSyntax?.encoder) {
            return undefined;
        }
        const encoder = ldapSyntax.encoder;
        return (value: ASN1Element): string => {
            return Buffer.from(encoder(value)).toString("utf-8");
        };
    };

    const typeNameGetter = (type: OBJECT_IDENTIFIER): string | undefined => {
        const attrSpec = ctx.attributeTypes.get(type.toString());
        if (!attrSpec?.ldapNames || (attrSpec.ldapNames.length === 0)) {
            return undefined;
        }
        return attrSpec.ldapNames[0];
    };
    return rdnToString(
        rdn.map((atav) => [ atav.type_, atav.value ]),
        stringEncoderGetter,
        typeNameGetter,
    );
}

const CYAN: string = "#00FFFF";
const BLUE: string = "#0088FF";
const GREEN: string = "#00FF00";
const YELLOW: string = "#FFFF00";
const ORANGE: string = "#FFAA00";
const MAGENTA: string = "#FF00FF";
const GREY: string = "#AAAAAA";
const WHITE: string = "#FFFFFF";

function printFlags (vertex: Vertex): string {
    const ret: string[] = [];
    const dse = vertex.dse;
    if (dse.root) {
        ret.push(`<span style="color: ${GREY};">root</span>`);
    }
    if (dse.glue) {
        ret.push(`<span style="color: ${GREY};">glue</span>`);
    }
    if (dse.cp) {
        ret.push(`<span style="color: ${GREEN};">cp</span>`);
    }
    if (dse.entry) {
        ret.push(`<span style="color: ${WHITE};">entry</span>`);
    }
    if (dse.alias) {
        ret.push(`<span style="color: ${CYAN};">alias</span>`);
    }
    if (dse.subr) {
        ret.push(`<span style="color: ${BLUE};">subr</span>`);
    }
    if (dse.nssr) {
        ret.push(`<span style="color: ${BLUE};">nssr</span>`);
    }
    if (dse.supr) {
        ret.push(`<span style="color: ${BLUE};">supr</span>`);
    }
    if (dse.xr) {
        ret.push(`<span style="color: ${BLUE};">xr</span>`);
    }
    if (dse.admPoint) {
        ret.push(`<span style="color: ${YELLOW};">admPoint</span>`);
        const ar = dse.admPoint.administrativeRole;
        if (ar.has(autonomousArea)) {
            ret.push(`<span style="color: ${GREY};">AA</span>`);
        }
        if (ar.has(accessControlSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">ACSA</span>`);
        }
        if (ar.has(accessControlInnerArea)) {
            ret.push(`<span style="color: ${GREY};">ACIA</span>`);
        }
        if (ar.has(subschemaAdminSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">SASA</span>`);
        }
        if (ar.has(collectiveAttributeSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">CASA</span>`);
        }
        if (ar.has(collectiveAttributeInnerArea)) {
            ret.push(`<span style="color: ${GREY};">CAIA</span>`);
        }
        if (ar.has(contextDefaultSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">CDSA</span>`);
        }
        if (ar.has(serviceSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">SSA</span>`);
        }
        if (ar.has(pwdAdminSpecificArea)) {
            ret.push(`<span style="color: ${GREY};">PASA</span>`);
        }
    }
    if (dse.subentry) {
        ret.push(`<span style="color: ${MAGENTA};">subentry</span>`);
    }
    if (dse.shadow) {
        ret.push(`<span style="color: ${GREY};">shadow</span>`);
    }
    if (dse.immSupr) {
        ret.push(`<span style="color: ${BLUE};">immSupr</span>`);
    }
    if (dse.rhob) {
        ret.push(`<span style="color: ${BLUE};">rhob</span>`);
    }
    if (dse.sa) {
        ret.push(`<span style="color: ${BLUE};">sa</span>`);
    }
    if (dse.dsSubentry) {
        ret.push(`<span style="color: ${MAGENTA};">dsSubentry</span>`);
    }
    if (dse.familyMember) {
        ret.push(`<span style="color: ${ORANGE};">familyMember</span>`);
    }
    if (dse.ditBridge) {
        ret.push(`<span style="color: ${BLUE};">ditBridge</span>`);
    }
    if (dse.objectClass.has(accessControlSubentry)) {
        ret.push(`<span style="color: ${GREY};">access-control</span>`);
    }
    if (dse.objectClass.has(collectiveAttributeSubentry)) {
        ret.push(`<span style="color: ${GREY};">coll-attrs</span>`);
    }
    if (dse.objectClass.has(contextAssertionSubentry)) {
        ret.push(`<span style="color: ${GREY};">context-assert</span>`);
    }
    if (dse.objectClass.has(serviceAdminSubentry)) {
        ret.push(`<span style="color: ${GREY};">service-admin</span>`);
    }
    if (dse.objectClass.has(pwdAdminSubentry)) {
        ret.push(`<span style="color: ${GREY};">pwd-admin</span>`);
    }
    if (dse.objectClass.has(subschemaSubentry)) {
        ret.push(`<span style="color: ${GREY};">schema-admin</span>`);
    }
    if (dse.objectClass.has(parent)) {
        ret.push(`<span style="color: ${ORANGE};">parent</span>`);
    }
    if (dse.objectClass.has(child)) {
        ret.push(`<span style="color: ${ORANGE};">child</span>`);
    }
    return `(${ret.join(" &amp; ")})`;
}

function convertDSEToHTML (ctx: Context, vertex: Vertex): [ string, string, string ] {
    const stringifiedRDN = (vertex.dse.rdn.length === 0)
        ? "(Empty RDN)"
        : escape(encodeRDN(ctx, vertex.dse.rdn));
    return [ vertex.dse.uuid, stringifiedRDN, printFlags(vertex) ];
}

function hexEncode (value: ASN1Element): string {
    return `#${Buffer.from(value.toBytes()).toString("hex")}`;
}

function defaultEncoder (value: ASN1Element): string {
    if (
        (value.tagClass !== ASN1TagClass.universal)
        || (value.tagNumber === ASN1UniversalType.sequence)
        || (value.tagNumber === ASN1UniversalType.set)
    ) {
        return hexEncode(value);
    }
    return value.toString();
}

function printDseType (bits: BIT_STRING): string[] {
    const ret: string[] = [];
    if (bits[DSEType_admPoint] === TRUE_BIT) {
        ret.push("admPoint");
    }
    if (bits[DSEType_alias] === TRUE_BIT) {
        ret.push("alias");
    }
    if (bits[DSEType_cp] === TRUE_BIT) {
        ret.push("cp");
    }
    if (bits[DSEType_ditBridge] === TRUE_BIT) {
        ret.push("ditBridge");
    }
    if (bits[DSEType_dsSubentry] === TRUE_BIT) {
        ret.push("dsSubentry");
    }
    if (bits[DSEType_entry] === TRUE_BIT) {
        ret.push("entry");
    }
    if (bits[DSEType_familyMember] === TRUE_BIT) {
        ret.push("familyMember");
    }
    if (bits[DSEType_glue] === TRUE_BIT) {
        ret.push("glue");
    }
    if (bits[DSEType_immSupr] === TRUE_BIT) {
        ret.push("immSupr");
    }
    if (bits[DSEType_nssr] === TRUE_BIT) {
        ret.push("nssr");
    }
    if (bits[DSEType_rhob] === TRUE_BIT) {
        ret.push("rhob");
    }
    if (bits[DSEType_root] === TRUE_BIT) {
        ret.push("root");
    }
    if (bits[DSEType_sa] === TRUE_BIT) {
        ret.push("sa");
    }
    if (bits[DSEType_shadow] === TRUE_BIT) {
        ret.push("shadow");
    }
    if (bits[DSEType_subentry] === TRUE_BIT) {
        ret.push("subentry");
    }
    if (bits[DSEType_subr] === TRUE_BIT) {
        ret.push("subr");
    }
    if (bits[DSEType_supr] === TRUE_BIT) {
        ret.push("supr");
    }
    if (bits[DSEType_xr] === TRUE_BIT) {
        ret.push("xr");
    }
    return ret;
}

// TODO: Dedupe
function breakIntoLines (str: string, lineLength: number): string[] {
    const lines: string[] = [];
    for (let i = 0; i < str.length; i = i + lineLength) {
        lines.push(str.slice(i, i + lineLength));
    }
    return lines;
}


interface TableValue {
    key: string;
    value: string;
}

interface TableValueWithOdd extends TableValue {
    odd: boolean;
}

interface KeyValueTable {
    values: TableValueWithOdd[];
}

const vcpReturnCodeToString: Map<VCPReturnCode, string> = new Map([
    [ VCP_RETURN_OK, "Valid" ],
    [ VCP_RETURN_INVALID_SIG, "Invalid signature" ],
    [ VCP_RETURN_OCSP_REVOKED, "Revoked, according to OCSP" ],
    [ VCP_RETURN_OCSP_OTHER, "Could not obtain OCSP status" ],
    [ VCP_RETURN_CRL_REVOKED, "Revoked, according to a CRL" ],
    [ VCP_RETURN_CRL_UNREACHABLE, "Could not obtain remote CRL" ],
    [ VCP_RETURN_MALFORMED, "Invalid certificate syntax" ],
    [ VCP_RETURN_BAD_KEY_USAGE, "Key usage not permitted" ],
    [ VCP_RETURN_BAD_EXT_KEY_USAGE, "Key usage not permitted" ],
    [ VCP_RETURN_UNKNOWN_CRIT_EXT, "Unrecognized critical extension (Meerkat DSA cannot validate this certificate chain.)" ],
    [ VCP_RETURN_DUPLICATE_EXT, "Duplicate extension" ],
    [ VCP_RETURN_AKI_SKI_MISMATCH, "Mismatch between Authority Key Identifier and Subject Key Identifier" ],
    [ VCP_RETURN_PKU_PERIOD, "Invalid, according to the Private Key Usage Period extension" ],
    [ VCP_RETURN_BASIC_CONSTRAINTS_CA, "A certificate was signed by a non-authority." ],
    [ VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN, "A certificate violated path length constraints." ],
    [ VCP_RETURN_INVALID_EXT_CRIT, "An extension was critical when it should never be, or non-critical when it should always be" ],
    [ VCP_RETURN_UNTRUSTED_ANCHOR, "The trust anchor in the certification path is untrusted by Meerkat DSA (check your configuration)" ],
    [ VCP_RETURN_INVALID_TIME, "A certificate has either expired or has yet to become valid" ],
    [ VCP_RETURN_ISSUER_SUBJECT_MISMATCH, "The issuer of one certificate does not match the subject of another it supposedly signed" ],
    [ VCP_RETURN_NAME_NOT_PERMITTED, "A certificate was signed by an authority that did not have explicit permission to sign for subjects within that namespace (a name constraints violation)" ],
    [ VCP_RETURN_NAME_EXCLUDED, "A certificate was signed by an authority that was expressly forbidden to sign for subjects within that namespace (a name constraints violation)" ],
    [ VCP_RETURN_PROHIBITED_SIG_ALG, "Use of a prohibited signature algorithm" ],
]);

function printBitString (bits: BIT_STRING) {
    let str: string = "";
    for (const bit of bits) {
        str += bit.toString();
    }
    return str;
}

function printSubtree (ctx: Context, subtree: GeneralSubtree) {
    return `From ${subtree.minimum ?? 0} to ${subtree.maximum ?? Infinity}: ${stringifyGN(ctx, subtree.base)}`;
}

function printAttributes (attrs: AttributesSyntax, keyName: string): TableValue[] {
    const values: TableValue[] = [];
    for (const attr of attrs) {
        for (const value of attr.values) {
            values.push({
                key: `${keyName} Attribute Value (Type ${attr.type_.toString()})`,
                value: value.toString(),
            });
        }
        for (const vwc of attr.valuesWithContext ?? []) {
            values.push({
                key: `${keyName} Attribute Value (With Contexts) (Type ${attr.type_.toString()})`,
                value: vwc.value.toString(),
            });
        }
    }
    return values;
}

function renderTBSCert (ctx: Context, tbs: TBSCertificate): KeyValueTable {
    const values: TableValue[] = [];
    values.push({
        key: "Version",
        value: (tbs.version !== undefined)
            ? (Number(tbs.version) + 1).toString()
            : "1",
    });
    values.push({
        key: "Serial Number",
        value: Buffer.from(tbs.serialNumber).toString("hex"),
    });
    values.push({
        key: "Signature Algorithm Identifier (Signed)",
        value: tbs.signature.algorithm.toString(),
    });

    if (tbs.signature.parameters) {
        values.push({
            key: "Signature Algorithm Parameter (Signed)",
            value: tbs.signature.parameters.toString(),
        });
    }

    values.push({
        key: "Issuer Name",
        value: stringifyDN(ctx, tbs.issuer.rdnSequence),
    });
    values.push({
        key: "Validity Start",
        value: getDateFromTime(tbs.validity.notBefore).toISOString(),
    });
    values.push({
        key: "Validity End",
        value: getDateFromTime(tbs.validity.notAfter).toISOString(),
    });
    values.push({
        key: "Subject Name",
        value: stringifyDN(ctx, tbs.subject.rdnSequence),
    });
    values.push({
        key: "Subject Public Key Algorithm",
        value: tbs.subjectPublicKeyInfo.algorithm.algorithm.toString(),
    });
    if (tbs.issuerUniqueIdentifier) {
        values.push({
            key: "Issuer Unique Identifier",
            value: printBitString(tbs.issuerUniqueIdentifier),
        });
    }
    if (tbs.subjectUniqueIdentifier) {
        values.push({
            key: "Subject Unique Identifier",
            value: printBitString(tbs.subjectUniqueIdentifier),
        });
    }
    values.push({
        key: "Number of Extensions",
        value: (tbs.extensions?.length ?? 0).toString(),
    });
    const extsGroupedByOID = groupByOID(tbs.extensions ?? [], (ext) => ext.extnId);
    const subjectDirectoryAttributesExt = extsGroupedByOID[subjectDirectoryAttributes["&id"]!.toString()]?.[0];
    if (subjectDirectoryAttributesExt) {
        const decoded = subjectDirectoryAttributes.decoderFor["&ExtnType"]!(subjectDirectoryAttributesExt.valueElement());
        values.push(...printAttributes(decoded, "Subject Directory"));
    }
    const subjectKeyIdentifierExt = extsGroupedByOID[subjectKeyIdentifier["&id"]!.toString()]?.[0];
    if (subjectKeyIdentifierExt) {
        const decoded = subjectKeyIdentifier.decoderFor["&ExtnType"]!(subjectKeyIdentifierExt.valueElement());
        values.push({
            key: "Subject Key Identifier",
            value: Buffer.from(decoded).toString("hex"),
        });
    }
    const keyUsageExt = extsGroupedByOID[keyUsage["&id"]!.toString()]?.[0];
    if (keyUsageExt) {
        const decoded = keyUsage.decoderFor["&ExtnType"]!(keyUsageExt.valueElement());
        values.push({
            key: "Key Usage",
            value: printBitString(decoded),
        });
    }
    const privateKeyUsagePeriodExt = extsGroupedByOID[privateKeyUsagePeriod["&id"]!.toString()]?.[0];
    if (privateKeyUsagePeriodExt) {
        const decoded = privateKeyUsagePeriod.decoderFor["&ExtnType"]!(privateKeyUsagePeriodExt.valueElement());
        if (decoded.notBefore) {
            values.push({
                key: "Private Key Usage Period Start",
                value: decoded.notBefore.toISOString(),
            });
        }
        if (decoded.notAfter) {
            values.push({
                key: "Private Key Usage Period End",
                value: decoded.notAfter.toISOString(),
            });
        }
    }
    const subjectAltNameExt = extsGroupedByOID[subjectAltName["&id"]!.toString()]?.[0];
    if (subjectAltNameExt) {
        const decoded = subjectAltName.decoderFor["&ExtnType"]!(subjectAltNameExt.valueElement());
        for (const gn of decoded) {
            values.push({
                key: "Subject Alternative Name",
                value: stringifyGN(ctx, gn),
            });
        }
    }
    const issuerAltNameExt = extsGroupedByOID[issuerAltName["&id"]!.toString()]?.[0];
    if (issuerAltNameExt) {
        const decoded = issuerAltName.decoderFor["&ExtnType"]!(issuerAltNameExt.valueElement());
        for (const gn of decoded) {
            values.push({
                key: "Issuer Alternative Name",
                value: stringifyGN(ctx, gn),
            });
        }
    }
    const basicConstraintsExt = extsGroupedByOID[basicConstraints["&id"]!.toString()]?.[0];
    if (basicConstraintsExt) {
        const decoded = basicConstraints.decoderFor["&ExtnType"]!(basicConstraintsExt.valueElement());
        values.push({
            key: "Basic Constraints: CA",
            value: decoded.cA ? "TRUE" : "FALSE",
        });
        if (decoded.pathLenConstraint !== undefined) {
            values.push({
                key: "Basic Constraints: Path Length Constraint",
                value: decoded.pathLenConstraint.toString(),
            });
        }
    }
    const nameConstraintsExt = extsGroupedByOID[nameConstraints["&id"]!.toString()]?.[0];
    if (nameConstraintsExt) {
        const decoded = nameConstraints.decoderFor["&ExtnType"]!(nameConstraintsExt.valueElement());
        for (const subtree of decoded.permittedSubtrees ?? []) {
            values.push({
                key: "Name Constraint: Permitted Subtree",
                value: printSubtree(ctx, subtree),
            });
        }
        for (const subtree of decoded.excludedSubtrees ?? []) {
            values.push({
                key: "Name Constraint: Excluded Subtree",
                value: printSubtree(ctx, subtree),
            });
        }
    }
    const cRLDistributionPointsExt = extsGroupedByOID[cRLDistributionPoints["&id"]!.toString()]?.[0];
    if (cRLDistributionPointsExt) {
        const decoded = cRLDistributionPoints.decoderFor["&ExtnType"]!(cRLDistributionPointsExt.valueElement());
        for (const crldp of decoded) {
            const lines: string[] = []
            if (crldp.reasons) {
                lines.push(`For reasons ${printBitString(crldp.reasons)}`);
            }
            for (const issuerName of crldp.cRLIssuer ?? []) {
                lines.push(`Issuer Name: ${issuerName}`);
            }
            if (crldp.distributionPoint) {
                if ("fullName" in crldp.distributionPoint) {
                    for (const fullName of crldp.distributionPoint.fullName) {
                        lines.push(`Full Name: ${stringifyGN(ctx, fullName)}`);
                    }
                } else if ("nameRelativeToCRLIssuer" in crldp.distributionPoint) {
                    const relativeName = crldp.distributionPoint.nameRelativeToCRLIssuer;
                    lines.push(`Name Relative to CRL Issuer: ${stringifyDN(ctx, [relativeName])}`)
                }
            }
            values.push({
                key: "CRL Distribution Point",
                value: lines.join("\r\n"),
            });
        }
    }
    const certificatePoliciesExt = extsGroupedByOID[certificatePolicies["&id"]!.toString()]?.[0];
    if (certificatePoliciesExt) {
        const decoded = certificatePolicies.decoderFor["&ExtnType"]!(certificatePoliciesExt.valueElement());
        for (const cp of decoded) {
            const policyId = cp.policyIdentifier.toString();
            values.push({
                key: "Certificate Policy",
                value: cp.policyQualifiers?.length
                    ? `${policyId} (with qualifiers ${cp.policyQualifiers.map((q) => q.policyQualifierId.toString())})`
                    : policyId,
            });
        }
    }
    const policyMappingsExt = extsGroupedByOID[policyMappings["&id"]!.toString()]?.[0];
    if (policyMappingsExt) {
        const decoded = policyMappings.decoderFor["&ExtnType"]!(policyMappingsExt.valueElement());
        for (const pm of decoded) {
            const idp = pm.issuerDomainPolicy.toString();
            const sdp = pm.subjectDomainPolicy.toString();
            values.push({
                key: "Policy Mappings",
                value: `${idp} => ${sdp}.`,
            });
        }
    }
    const authorityKeyIdentifierExt = extsGroupedByOID[authorityKeyIdentifier["&id"]!.toString()]?.[0];
    if (authorityKeyIdentifierExt) {
        const decoded = authorityKeyIdentifier.decoderFor["&ExtnType"]!(authorityKeyIdentifierExt.valueElement());
        for (const authorityName of decoded.authorityCertIssuer ?? []) {
            values.push({
                key: "Authority Certificate Issuer Name",
                value: stringifyGN(ctx, authorityName),
            });
        }
        if (decoded.authorityCertSerialNumber) {
            values.push({
                key: "Authority Certificate Serial Number",
                value: Buffer.from(decoded.authorityCertSerialNumber).toString("hex"),
            });
        }
        if (decoded.keyIdentifier) {
            values.push({
                key: "Authority Key Identifier",
                value: Buffer.from(decoded.keyIdentifier).toString("hex"),
            });
        }
    }
    const policyConstraintsExt = extsGroupedByOID[policyConstraints["&id"]!.toString()]?.[0];
    if (policyConstraintsExt) {
        const decoded = policyConstraints.decoderFor["&ExtnType"]!(policyConstraintsExt.valueElement());
        if (decoded.inhibitPolicyMapping) {
            values.push({
                key: "Policy Constraint: Inhibit Policy Mapping",
                value: decoded.inhibitPolicyMapping.toString(),
            });
        }
        if (decoded.requireExplicitPolicy) {
            values.push({
                key: "Policy Constraint: Require Explicit Policy",
                value: decoded.requireExplicitPolicy.toString(),
            });
        }
    }
    const extKeyUsageExt = extsGroupedByOID[extKeyUsage["&id"]!.toString()]?.[0];
    if (extKeyUsageExt) {
        const decoded = extKeyUsage.decoderFor["&ExtnType"]!(extKeyUsageExt.valueElement());
        for (const oid of decoded) {
            values.push({
                key: "Extended Key Usage",
                value: oid.toString(),
            });
        }
    }
    const inhibitAnyPolicyExt = extsGroupedByOID[inhibitAnyPolicy["&id"]!.toString()]?.[0];
    if (inhibitAnyPolicyExt) {
        const decoded = inhibitAnyPolicy.decoderFor["&ExtnType"]!(inhibitAnyPolicyExt.valueElement());
        values.push({
            key: "inhibitAnyPolicy",
            value: decoded.toString(),
        });
    }
    const subjectAltPublicKeyInfoExt = extsGroupedByOID[subjectAltPublicKeyInfo["&id"]!.toString()]?.[0];
    if (subjectAltPublicKeyInfoExt) {
        const decoded = subjectAltPublicKeyInfo.decoderFor["&ExtnType"]!(subjectAltPublicKeyInfoExt.valueElement());
        values.push({
            key: "Subject Alternative Public Key Algorithm",
            value: decoded.algorithm.algorithm.toString(),
        });
    }
    const altSignatureAlgorithmExt = extsGroupedByOID[altSignatureAlgorithm["&id"]!.toString()]?.[0];
    if (altSignatureAlgorithmExt) {
        const decoded = altSignatureAlgorithm.decoderFor["&ExtnType"]!(altSignatureAlgorithmExt.valueElement());
        values.push({
            key: "Alternative Signature Algorithm",
            value: decoded.algorithm.toString(),
        });
    }
    const altSignatureValueExt = extsGroupedByOID[altSignatureValue["&id"]!.toString()]?.[0];
    if (altSignatureValueExt) {
        const decoded = altSignatureValue.decoderFor["&ExtnType"]!(altSignatureValueExt.valueElement());
        values.push({
            key: "Alternative Signature Value",
            value: printBitString(decoded),
        });
    }
    const associatedInformationExt = extsGroupedByOID[associatedInformation["&id"]!.toString()]?.[0];
    if (associatedInformationExt) {
        const decoded = associatedInformation.decoderFor["&ExtnType"]!(associatedInformationExt.valueElement());
        values.push(...printAttributes(decoded, "Associated Information"));
    }
    const authorizationValidationExt = extsGroupedByOID[authorizationValidation["&id"]!.toString()]?.[0];
    if (authorizationValidationExt) {
        const decoded = authorizationValidation.decoderFor["&ExtnType"]!(authorizationValidationExt.valueElement());
        const issuerDNStr = stringifyDN(ctx, decoded.issuer.rdnSequence);
        values.push({
            key: "Authorization Validation List",
            value: decoded.serialNumber
                ? `Serial Number: ${Buffer.from(decoded.serialNumber)}, Issued by: ${issuerDNStr}`
                : issuerDNStr,
        });
    }
    const authorityInfoAccessExt = extsGroupedByOID[authorityInfoAccess["&id"]!.toString()]?.[0];
    if (authorityInfoAccessExt) {
        const decoded = authorityInfoAccess.decoderFor["&ExtnType"]!(authorityInfoAccessExt.valueElement());
        for (const aia of decoded) {
            values.push({
                key: "Authority Info Access",
                value: `Access method ${aia.accessMethod.toString()}: ${stringifyGN(ctx, aia.accessLocation)}`,
            });
        }
    }
    const subjectInfoAccessExt = extsGroupedByOID[subjectInfoAccess["&id"]!.toString()]?.[0];
    if (subjectInfoAccessExt) {
        const decoded = subjectInfoAccess.decoderFor["&ExtnType"]!(subjectInfoAccessExt.valueElement());
        for (const sia of decoded) {
            values.push({
                key: "Subject Info Access",
                value: `Access method ${sia.accessMethod.toString()}: ${stringifyGN(ctx, sia.accessLocation)}`,
            });
        }
    }

    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function renderCert (ctx: Context, cert: Certificate): KeyValueTable {
    const values: TableValue[] = [];
    values.push(...renderTBSCert(ctx, cert.toBeSigned).values);
    values.push({
        key: "Signature Algorithm",
        value: cert.algorithmIdentifier.algorithm.toString(),
    });

    if (cert.algorithmIdentifier.parameters) {
        values.push({
            key: "Signature Algorithm Parameter",
            value: cert.algorithmIdentifier.parameters.toString(),
        });
    }

    const sigValueBytes = packBits(cert.signature);
    values.push({
        key: "Signature Value (In Bytes)",
        value: breakIntoLines(Buffer.from(sigValueBytes).toString("hex"), 60).join("\r\n"),
    });

    if (cert.altAlgorithmIdentifier) {
        values.push({
            key: "Alternative Signature Algorithm Identifier",
            value: cert.altAlgorithmIdentifier.algorithm.toString(),
        });
        if (cert.altAlgorithmIdentifier.parameters) {
            values.push({
                key: "Alternative Signature Algorithm Parameters",
                value: cert.altAlgorithmIdentifier.parameters.toString(),
            });
        }
    }

    if (cert.altSignature) {
        const signatureBytes = packBits(cert.altSignature);
        values.push({
            key: "Alternative Signature Value (In Bytes)",
            value: breakIntoLines(Buffer.from(signatureBytes).toString("hex"), 60).join("\r\n"),
        });
    }

    const dnBytes = _encode_DistinguishedName(cert.toBeSigned.issuer.rdnSequence, DER).toBytes();
    const certBytes = cert.originalDER
        ?? _encode_Certificate(cert, DER).toBytes();
    const spkiElement = _encode_SubjectPublicKeyInfo(cert.toBeSigned.subjectPublicKeyInfo, DER);
    const spkiBytes = spkiElement.value; // Not calculated over tag and length.
    const dnHasher = createHash("sha256");
    const spkiHasher = createHash("sha256");
    const certHasher = createHash("sha256");
    dnHasher.update(dnBytes);
    spkiHasher.update(spkiBytes);
    certHasher.update(certBytes);
    const dnHash = dnHasher.digest();
    const spkiHash = spkiHasher.digest();
    const certHash = certHasher.digest();

    // (Used by SCVP)
    values.push({
        key: "Certificate Hash (SHA-256)",
        value: certHash.toString("hex"),
    });

    // (Used by OCSP)
    values.push({
        key: "Issuer Name Hash (SHA-256)",
        value: dnHash.toString("hex"),
    });

    // (Used by OCSP)
    values.push({
        key: "Public Key Hash (SHA-256)",
        value: spkiHash.toString("hex"),
    });

    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function renderCRL (ctx: Context, crl: CertificateList): KeyValueTable {
    const values: TableValue[] = [];
    values.push({
        key: "Version",
        value: (crl.toBeSigned.version !== undefined)
            ? (Number(crl.toBeSigned.version) + 1).toString()
            : "1",
    });
    values.push({
        key: "Signature Algorithm Identifier (Signed)",
        value: crl.toBeSigned.signature.algorithm.toString(),
    });
    if (crl.toBeSigned.signature.parameters) {
        values.push({
            key: "Signature Algorithm Parameter (Signed)",
            value: crl.toBeSigned.signature.parameters.toString(),
        });
    }
    values.push({
        key: "Issuer Name",
        value: stringifyDN(ctx, crl.toBeSigned.issuer.rdnSequence),
    });
    values.push({
        key: "This Update Time",
        value: getDateFromTime(crl.toBeSigned.thisUpdate).toISOString(),
    });
    if (crl.toBeSigned.nextUpdate) {
        values.push({
            key: "Next Update Time",
            value: getDateFromTime(crl.toBeSigned.nextUpdate).toISOString(),
        });
    }
    values.push({
        key: "Number of Extensions",
        value: (crl.toBeSigned.crlExtensions?.length ?? 0).toString(),
    });
    const extensions = crl.toBeSigned.crlExtensions ?? [];
    const extsGroupedByOID = groupByOID(extensions, (ext) => ext.extnId);
    const cRLNumberExt = extsGroupedByOID[cRLNumber["&id"]!.toString()]?.[0];
    if (cRLNumberExt) {
        const decoded = cRLNumber.decoderFor["&ExtnType"]!(cRLNumberExt.valueElement());
        values.push({
            key: "cRLNumber",
            value: decoded.toString(),
        });
    }
    const statusReferralsExt = extsGroupedByOID[statusReferrals["&id"]!.toString()]?.[0];
    if (statusReferralsExt) {
        const decoded = statusReferrals.decoderFor["&ExtnType"]!(statusReferralsExt.valueElement());
        for (const sr of decoded) {
            if (!("cRLReferral" in sr)) {
                values.push({
                    key: "Status Referral",
                    value: "<Unrecognized Status Referral Type>",
                });
                continue;
            }
            const ref = sr.cRLReferral;
            const lines: string[] = [];
            if (ref.issuer) {
                lines.push(`Issuer: ${stringifyGN(ctx, ref.issuer)}`);
            }
            if (ref.location) {
                lines.push(`Location: ${stringifyGN(ctx, ref.location)}`);
            }
            if (ref.deltaRefInfo) {
                const dri = stringifyGN(ctx, ref.deltaRefInfo.deltaLocation);
                const line = `Delta Ref Info: ${dri}`;
                if (ref.deltaRefInfo.lastDelta) {
                    lines.push(line + ` (last delta ${ref.deltaRefInfo.lastDelta.toISOString()})`);
                } else {
                    lines.push(line);
                }
            }
            // Yeah, how about F that.
            // if (ref.cRLScope) {

            // }
            if (ref.lastUpdate) {
                lines.push(`Last Update: ${ref.lastUpdate.toISOString()}`);
            }
            if (ref.lastChangedCRL) {
                lines.push(`Last Update: ${ref.lastChangedCRL.toISOString()}`);
            }
            values.push({
                key: "Status Referral",
                value: lines.join("\r\n"),
            });
        }

    }
    const cRLStreamIdentifierExt = extsGroupedByOID[cRLStreamIdentifier["&id"]!.toString()]?.[0];
    if (cRLStreamIdentifierExt) {
        const decoded = cRLStreamIdentifier.decoderFor["&ExtnType"]!(cRLStreamIdentifierExt.valueElement());
        values.push({
            key: "CRL Stream Identifier",
            value: decoded.toString(),
        });
    }
    const orderedListExt = extsGroupedByOID[orderedList["&id"]!.toString()]?.[0];
    if (orderedListExt) {
        const decoded = orderedList.decoderFor["&ExtnType"]!(orderedListExt.valueElement());
        values.push({
            key: "Ordered List",
            value: decoded.toString(),
        });
    }
    const deltaInfoExt = extsGroupedByOID[deltaInfo["&id"]!.toString()]?.[0];
    if (deltaInfoExt) {
        const decoded = deltaInfo.decoderFor["&ExtnType"]!(deltaInfoExt.valueElement());
        const dl = stringifyGN(ctx, decoded.deltaLocation);
        if (decoded.nextDelta) {
            values.push({
                key: "Delta Info",
                value: `${dl} (next delta ${decoded.nextDelta.toISOString()})`,
            });
        } else {
            values.push({
                key: "Delta Info",
                value: dl,
            });
        }
    }
    const toBeRevokedExt = extsGroupedByOID[toBeRevoked["&id"]!.toString()]?.[0];
    if (toBeRevokedExt) {
        const decoded = toBeRevoked.decoderFor["&ExtnType"]!(toBeRevokedExt.valueElement());
        for (const tbr of decoded) {
            const lines: string[] = [];
            if (tbr.certificateIssuer) {
                lines.push(`Issuer: ${stringifyGN(ctx, tbr.certificateIssuer)}`);
            }
            if (tbr.reasonInfo) {
                lines.push(`Reason Code: ${tbr.reasonInfo.reasonCode}`);
                if (tbr.reasonInfo.holdInstructionCode) {
                    lines.push(`Hold Instruction Code: ${tbr.reasonInfo.holdInstructionCode.toString()}`);
                }
            }
            lines.push(`Revocation Time: ${tbr.revocationTime.toISOString()}`);
            if ("serialNumbers" in tbr.certificateGroup) {
                for (const sn of tbr.certificateGroup.serialNumbers) {
                    lines.push(`Serial Number: ${Buffer.from(sn).toString("hex")}`);
                }
            } else if ("serialNumberRange" in tbr.certificateGroup) {
                const start = tbr.certificateGroup.serialNumberRange.startingNumber;
                const end = tbr.certificateGroup.serialNumberRange.endingNumber;
                lines.push(`Serial Number Range: ${start.toString(16)} - ${end.toString(16)}`);
            } else if ("nameSubtree" in tbr.certificateGroup) {
                const gn = tbr.certificateGroup.nameSubtree;
                lines.push(`Name Subtree: ${stringifyGN(ctx, gn)}`);
            } else {
                lines.push("<Unrecognized certificate group alternative>");
            }
            values.push({
                key: "To Be Revoked Group",
                value: lines.join("\r\n"),
            });
        }
    }
    const revokedGroupsExt = extsGroupedByOID[revokedGroups["&id"]!.toString()]?.[0];
    if (revokedGroupsExt) {
        const decoded = revokedGroups.decoderFor["&ExtnType"]!(revokedGroupsExt.valueElement());
        for (const rg of decoded) {
            const lines: string[] = [];
            if (rg.certificateIssuer) {
                lines.push(`Issuer: ${stringifyGN(ctx, rg.certificateIssuer)}`);
            }
            if (rg.reasonInfo) {
                lines.push(`Reason Code: ${rg.reasonInfo.reasonCode}`);
                if (rg.reasonInfo.holdInstructionCode) {
                    lines.push(`Hold Instruction Code: ${rg.reasonInfo.holdInstructionCode.toString()}`);
                }
            }
            if (rg.invalidityDate) {
                lines.push(`Revocation Time: ${rg.invalidityDate.toISOString()}`);
            }
            if ("serialNumberRange" in rg.revokedcertificateGroup) {
                const start = rg.revokedcertificateGroup.serialNumberRange.startingNumber;
                const end = rg.revokedcertificateGroup.serialNumberRange.endingNumber;
                const mod = rg.revokedcertificateGroup.serialNumberRange.modulus;
                if (start) {
                    lines.push(`Serial Number Range Start: ${Buffer.from(start).toString("hex")}`);
                }
                if (end) {
                    lines.push(`Serial Number Range End: ${Buffer.from(end).toString("hex")}`);
                }
                if (mod) {
                    lines.push(`Serial Number Range Modulus: ${Buffer.from(mod).toString("hex")}`);
                }
            } else if ("nameSubtree" in rg.revokedcertificateGroup) {
                const gn = rg.revokedcertificateGroup.nameSubtree;
                lines.push(`Name Subtree: ${stringifyGN(ctx, gn)}`);
            } else {
                lines.push("<Unrecognized certificate group alternative>");
            }
            values.push({
                key: "Revoked Group",
                value: lines.join("\r\n"),
            });
        }
    }
    const expiredCertsOnCRLExt = extsGroupedByOID[expiredCertsOnCRL["&id"]!.toString()]?.[0];
    if (expiredCertsOnCRLExt) {
        const decoded = expiredCertsOnCRL.decoderFor["&ExtnType"]!(expiredCertsOnCRLExt.valueElement());
        values.push({
            key: "Expired Certs on CRL",
            value: decoded.toISOString(),
        });
    }

    for (const rc of crl.toBeSigned.revokedCertificates ?? []) {
        const serialNumber = Buffer.from(rc.serialNumber).toString("hex");
        const revocationDate = getDateFromTime(rc.revocationDate).toISOString();
        values.push({
            key: "Revoked Certificate",
            value: `Certificate ${serialNumber} revoked at ${revocationDate}.`,
        });
    }

    values.push({
        key: "Signature Algorithm",
        value: crl.algorithmIdentifier.algorithm.toString(),
    });

    if (crl.algorithmIdentifier.parameters) {
        values.push({
            key: "Signature Algorithm Parameter",
            value: crl.algorithmIdentifier.parameters.toString(),
        });
    }

    const sigValueBytes = packBits(crl.signature);
    values.push({
        key: "Signature Value (In Bytes)",
        value: breakIntoLines(Buffer.from(sigValueBytes).toString("hex"), 60).join("\r\n"),
    });

    if (crl.altAlgorithmIdentifier) {
        values.push({
            key: "Alternative Signature Algorithm Identifier",
            value: crl.altAlgorithmIdentifier.algorithm.toString(),
        });
        if (crl.altAlgorithmIdentifier.parameters) {
            values.push({
                key: "Alternative Signature Algorithm Parameters",
                value: crl.altAlgorithmIdentifier.parameters.toString(),
            });
        }
    }

    if (crl.altSignature) {
        const signatureBytes = packBits(crl.altSignature);
        values.push({
            key: "Alternative Signature Value (In Bytes)",
            value: breakIntoLines(Buffer.from(signatureBytes).toString("hex"), 60).join("\r\n"),
        });
    }

    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function renderTrustAnchorInfo (ctx: Context, tai: TrustAnchorInfo): KeyValueTable {
    const values: TableValue[] = [];

    // * TrustAnchorInfo ::= SEQUENCE {
    // *     version   TrustAnchorInfoVersion DEFAULT v1,
    // *     pubKey    SubjectPublicKeyInfo,
    // *     keyId     KeyIdentifier,
    // *     taTitle   TrustAnchorTitle OPTIONAL,
    // *     certPath  CertPathControls OPTIONAL,
    // *     exts      [1] EXPLICIT Extensions {{...}}   OPTIONAL,
    // *     taTitleLangTag   [2] UTF8String OPTIONAL }

    values.push({
        key: "Version",
        value: (tai.version ?? 1).toString(),
    });

    values.push({
        key: "Subject Public Key Algorithm Identifier",
        value: tai.pubKey.algorithm.algorithm.toString(),
    });

    if (tai.pubKey.algorithm.parameters) {
        values.push({
            key: "Subject Public Key Algorithm Parameters",
            value: tai.pubKey.algorithm.parameters.toString(),
        });
    }

    values.push({
        key: "Key Identifier",
        value: Buffer.from(tai.keyId).toString("hex"),
    });

    if (tai.taTitle) {
        values.push({
            key: "Trust Anchor Title",
            value: tai.taTitle,
        });
    }

    if (tai.certPath) {
        values.push({
            key: "Trust Anchor Name",
            value: stringifyDN(ctx, tai.certPath.taName.rdnSequence),
        });
        if (tai.certPath.certificate) {
            const certValues = renderCert(ctx, tai.certPath.certificate);
            values.push(...certValues.values);
        }
        if (tai.certPath.policySet) {
            for (const pol of tai.certPath.policySet) {
                const oid = pol.policyIdentifier.toString();
                if (pol.policyQualifiers?.length) {
                    const quals = pol.policyQualifiers.map((q) => q.policyQualifierId.toString());
                    values.push({
                        key: "Policy Identifier",
                        value: `${oid} (with qualifiers: ${quals.join(", ")})`,
                    });
                    continue;
                }
                values.push({
                    key: "Policy Identifier",
                    value: oid,
                });
            }
        }
        if (tai.certPath.policyFlags) {
            values.push({
                key: "Policy Flags",
                value: printBitString(tai.certPath.policyFlags),
            });
        }
        if (tai.certPath.nameConstr) {
            const nc = tai.certPath.nameConstr;
            for (const subtree of nc.permittedSubtrees ?? []) {
                values.push({
                    key: "Name Constraint: Permitted Subtree",
                    value: printSubtree(ctx, subtree),
                });
            }
            for (const subtree of nc.excludedSubtrees ?? []) {
                values.push({
                    key: "Name Constraint: Excluded Subtree",
                    value: printSubtree(ctx, subtree),
                });
            }
        }
        if (tai.certPath.pathLenConstraint) {
            values.push({
                key: "Path Length Constraint",
                value: tai.certPath.pathLenConstraint.toString(),
            });
        }
    }

    if (tai.taTitleLangTag) {
        values.push({
            key: "Trust Anchor Title Language",
            value: tai.taTitleLangTag,
        });
    }

    const extensions = tai.exts ?? [];
    values.push({
        key: "Number of Extensions",
        value: extensions.length.toString(),
    });

    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function renderTrustAnchor (ctx: Context, ta: TrustAnchorChoice): KeyValueTable {
    const values: TableValue[] = [];

    if ("certificate" in ta) {
        const certValues = renderCert(ctx, ta.certificate);
        values.push(...certValues.values);
    } else if ("tbsCert" in ta) {
        const tbsValues = renderTBSCert(ctx, ta.tbsCert);
        values.push(...tbsValues.values);
    } else if ("taInfo" in ta) {
        const taValues = renderTrustAnchorInfo(ctx, ta.taInfo);
        values.push(...taValues.values);
    }

    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function renderAttributeCert (
    ctx: Context,
    cert: AttributeCertificate,
): KeyValueTable {
    const values: TableValue[] = [];
    const tbs = cert.toBeSigned;
    values.push({
        key: "Version",
        value: (tbs.version !== undefined)
            ? (Number(tbs.version) + 1).toString()
            : "1",
    });

    if (tbs.holder.baseCertificateID) {
        for (const issuerName of tbs.holder.baseCertificateID.issuer) {
            values.push({
                key: "Holder's Issuer's Name",
                value: stringifyGN(ctx, issuerName),
            });
        }
        values.push({
            key: "Holder's Serial Number",
            value: Buffer.from(tbs.holder.baseCertificateID.serial).toString("hex"),
        });
        if (tbs.holder.baseCertificateID.issuerUID) {
            values.push({
                key: "Holder's Issuer's UID",
                value: printBitString(tbs.holder.baseCertificateID.issuerUID),
            });
        }
    }
    if (tbs.holder.entityName) {
        for (const holderName of tbs.holder.entityName) {
            values.push({
                key: "Holder's Name",
                value: stringifyGN(ctx, holderName),
            });
        }
    }
    if (tbs.holder.objectDigestInfo) {
        values.push({
            key: "Holder's Object Digest Type",
            value: tbs.holder.objectDigestInfo.digestedObjectType.toString(),
        });
        if (tbs.holder.objectDigestInfo.otherObjectTypeID) {
            values.push({
                key: "Holder's Object Digest Type (Other)",
                value: tbs.holder.objectDigestInfo.otherObjectTypeID.toString(),
            });
        }
        values.push({
            key: "Holder's Object Digest Algorithm Identifier",
            value: tbs.holder.objectDigestInfo.digestAlgorithm.algorithm.toString(),
        });
        if (tbs.holder.objectDigestInfo.digestAlgorithm.parameters) {
            values.push({
                key: "Holder's Object Digest Algorithm Parameter",
                value: tbs.holder.objectDigestInfo.digestAlgorithm.parameters.toString(),
            });
        }
        values.push({
            key: "Holder's Object Digest Value",
            value: printBitString(tbs.holder.objectDigestInfo.objectDigest),
        });
    }

    if (tbs.issuer.issuerName) {
        for (const issuerName of tbs.issuer.issuerName) {
            values.push({
                key: "Issuer's Name",
                value: stringifyGN(ctx, issuerName),
            });
        }
    }
    if (tbs.issuer.baseCertificateID) {
        for (const issuerName of tbs.issuer.baseCertificateID.issuer) {
            values.push({
                key: "Issuer's Issuer Name",
                value: stringifyGN(ctx, issuerName),
            });
        }
        values.push({
            key: "Issuer's Serial Number",
            value: Buffer.from(tbs.issuer.baseCertificateID.serial).toString("hex"),
        });
        if (tbs.issuer.baseCertificateID.issuerUID) {
            values.push({
                key: "Issuer's Issuer's UID",
                value: printBitString(tbs.issuer.baseCertificateID.issuerUID),
            });
        }
    }
    if (tbs.issuer.objectDigestInfo) {
        values.push({
            key: "Issuer's Object Digest Type",
            value: tbs.issuer.objectDigestInfo.digestedObjectType.toString(),
        });
        if (tbs.issuer.objectDigestInfo.otherObjectTypeID) {
            values.push({
                key: "Issuer's Object Digest Type (Other)",
                value: tbs.issuer.objectDigestInfo.otherObjectTypeID.toString(),
            });
        }
        values.push({
            key: "Issuer's Object Digest Algorithm Identifier",
            value: tbs.issuer.objectDigestInfo.digestAlgorithm.algorithm.toString(),
        });
        if (tbs.issuer.objectDigestInfo.digestAlgorithm.parameters) {
            values.push({
                key: "Issuer's Object Digest Algorithm Parameter",
                value: tbs.issuer.objectDigestInfo.digestAlgorithm.parameters.toString(),
            });
        }
        values.push({
            key: "Issuer's Object Digest Value",
            value: printBitString(tbs.issuer.objectDigestInfo.objectDigest),
        });
    }

    values.push({
        key: "Signature Algorithm Identifier (Signed)",
        value: tbs.signature.algorithm.toString(),
    });

    if (tbs.signature.parameters) {
        values.push({
            key: "Signature Algorithm Parameter (Signed)",
            value: tbs.signature.parameters.toString(),
        });
    }
    values.push({
        key: "Serial Number",
        value: Buffer.from(tbs.serialNumber).toString("hex"),
    });
    // values.push({
    //     key: "Issuer Name",
    //     value: stringifyDN(ctx, tbs.issuer.rdnSequence),
    // });
    values.push({
        key: "Validity Start",
        value: tbs.attrCertValidityPeriod.notBeforeTime.toISOString(),
    });
    values.push({
        key: "Validity End",
        value: tbs.attrCertValidityPeriod.notAfterTime.toISOString(),
    });

    values.push(...printAttributes(tbs.attributes, "Subject"));

    if (tbs.issuerUniqueID) {
        values.push({
            key: "Issuer Unique ID",
            value: printBitString(tbs.issuerUniqueID),
        });
    }

    values.push({
        key: "Number of Extensions",
        value: (tbs.extensions?.length ?? 0).toString(),
    });

    // TODO: extensions
    return {
        values: values.map((v, i) => ({
            ...v,
            odd: !!(i % 2),
        })),
    };
}

function createTrustAnchorInfoFile (tal: TrustAnchorList): Uint8Array {
    const cinfo = new ContentInfo(
        id_ct_trustAnchorList,
        _encode_TrustAnchorList(tal, DER),
    );
    const cinfoBytes = _encode_ContentInfo(cinfo, DER).toBytes();
    return cinfoBytes;
}

function createSignedTrustAnchorInfoFile (ctx: Context, tal: TrustAnchorList): Uint8Array | null {
    if (
        !ctx.config.signing.key
        || !ctx.config.signing.certPath
        || !ctx.config.signing.key.asymmetricKeyType
    ) {
        return null;
    }
    const key = ctx.config.signing.key;
    const certPath = ctx.config.signing.certPath;
    const ecinfo = new EncapsulatedContentInfo(
        id_ct_trustAnchorList,
        _encode_TrustAnchorList(tal, DER).toBytes(),
    );
    const sdata = createCMSSignedData(key, certPath, ecinfo, undefined);
    if (!sdata) {
        return null;
    }
    const cinfoBytes = _encode_ContentInfo(sdata, DER).toBytes();
    return cinfoBytes;
}

function createP7BFile (
    key: KeyObject,
    certPath: PkiPath,
): Uint8Array | null {
    if (!key.asymmetricKeyType) {
        return null;
    }
    const ecinfo = new EncapsulatedContentInfo(
        id_data,
        undefined,
    );
    const sdata = createCMSSignedData(key, certPath, ecinfo, undefined);
    if (!sdata) {
        return null;
    }
    const cinfoBytes = _encode_ContentInfo(sdata, DER).toBytes();
    return cinfoBytes;
}

function createSigningP7B (ctx: Context): Uint8Array | null {
    const key = ctx.config.signing?.key;
    const certPath = ctx.config.signing.certPath;
    if (!key || !certPath) {
        return null;
    }
    return createP7BFile(key, certPath);
}

function createTLSP7B (ctx: Context): Uint8Array | null {
    const keyFile = ctx.config.tls?.key;
    const certsFile = ctx.config.tls.cert as string;
    if (!keyFile || !certsFile) {
        return null;
    }
    const certPath = PEMObject.parse(certsFile)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_Certificate(el);
        })
        .reverse();

    const key = createPrivateKey({
        format: "pem",
        type: "pkcs8",
        key: keyFile as string,
        passphrase: ctx.config.tls.passphrase,
    });

    return createP7BFile(key, certPath);
}

function createCSR (
    ctx: Context,
    key: KeyObject,
    cert: Certificate,
): Uint8Array | null {
    const subjectPublicKeyInfo = cert.toBeSigned.subjectPublicKeyInfo;
    const csrInfo = new CertificationRequestInfo(
        CertificationRequestInfo_version_v1,
        cert.toBeSigned.subject,
        subjectPublicKeyInfo,
        [],
    );
    const opCSR = generateSIGNED(ctx, csrInfo, _encode_CertificationRequestInfo, key);
    if (!("signed" in opCSR)) {
        return null;
    }
    const signedCSRInfo = opCSR.signed;
    const csr = new CertificationRequest(
        csrInfo,
        signedCSRInfo.algorithmIdentifier,
        signedCSRInfo.signature,
    );
    return _encode_CertificationRequest(csr, DER).toBytes();
}

function createPublicKeyFile (cert: Certificate): string {
    const der = _encode_SubjectPublicKeyInfo(cert.toBeSigned.subjectPublicKeyInfo, DER).toBytes();
    const pem = new PEMObject("PUBLIC KEY", der);
    return pem.encoded;
}

interface MeerkatReq extends Request {
    ctx: MeerkatContext;
}

function setMeerkatContext (req: MeerkatReq, res: Response, next: NextFunction): void {
    req.ctx = ctx;
    next();
}

function securityMiddleware (req: MeerkatReq, res: Response, next: NextFunction): void {
    res.set("Content-Security-Policy", "default-src 'self' 'unsafe-inline'; script-src 'none'");
    res.set("X-Frame-Options", "deny");
    if (req.ctx.config.webAdmin.useTLS) {
        res.set("Strict-Transport-Security", "max-age=3600; includeSubDomains; preload");
    }
    // Deprecated, but might as well provide it just to be thorough.
    res.set("X-XSS-Protection", "1; mode=block");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "no-referrer");
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Cache-Control", "no-store");
    res.set("X-Robots-Tag", "noindex");
    // res.set("Clear-Site-Data", "*");
    // Uncomment if this is ever supported: https://github.com/w3c/webappsec-permissions-policy/issues/189
    // res.set("Feature-Policy", PERMISSIONS_POLICY);
    // res.set("Permissions-Policy", PERMISSIONS_POLICY);
    next();
}

function loggingMiddleware (req: MeerkatReq, res: Response, next: NextFunction): void {
    if (res.socket) {
        const host = `${res.socket.remoteFamily}://${res.socket.remoteAddress}/${res.socket.remotePort}`;
        const logInfo = {
            host,
            method: req.method,
            path: req.path,
        };
        req.ctx.log.info(req.ctx.i18n.t("log:web_admin_http", logInfo), logInfo);
    }
    next();
}

// TODO: Caching?
function getHomePage (req: MeerkatReq, res: Response): void {
    res.render('index', {
        dsa: req.ctx.dsa.accessPoint.ae_title.rdnSequence.length
            ? stringifyDN(req.ctx, req.ctx.dsa.accessPoint.ae_title.rdnSequence)
            : "<UNSET> (Consider configuring signing PKI)",
        rootuuid: req.ctx.dit.root.dse.uuid,
        dhparams: !!process.env.MEERKAT_TLS_DH_PARAM_FILE,
    });
}

// TODO: Caching
function getConformance (req: MeerkatReq, res: Response): void {
    fs.readFile(conformancePath, { encoding: "utf-8" })
        .then((content) => res.render('markdown', {
            title: "Conformance",
            content
        }))
        .catch((e) => res.status(500).send(e));
}

function getOperationalBindings(req: MeerkatReq, res: Response, next: NextFunction): void {
    req.ctx.db.operationalBinding.findMany({
        select: {
            uuid: true,
            binding_type: true,
            binding_identifier: true,
            binding_version: true,
            terminated_time: true,
            accepted: true,
            validity_start: true,
            validity_end: true,
        },
    }).then((obs) => {
        const templateVariables = {
            obs: obs.map((ob) => {
                const status: string = (() => {
                    if (ob.terminated_time) {
                        return "TERMINATED";
                    }
                    if (ob.validity_start.valueOf() > Date.now()) {
                        return "PENDING";
                    }
                    if (ob.validity_end && (ob.validity_end.valueOf() < Date.now())) {
                        return "EXPIRED";
                    }
                    if (ob.accepted === null) {
                        return "REQUESTED";
                    }
                    if (ob.accepted) {
                        return "ACCEPTED";
                    }
                    if (ob.accepted === false) {
                        return "REJECTED";
                    }
                    return "ASSERTION_ERROR";
                })();
                return {
                    ...ob,
                    status,
                    waiting: (ob.accepted === undefined || ob.accepted === null),
                    binding_type: ob.binding_type,
                    validity_start: ob.validity_start.toISOString(),
                    validity_end: ob.validity_end
                        ? ob.validity_end.toISOString()
                        : "EXPLICIT_TERMINATION",
                };
            }),
        };
        res.render('ob', templateVariables);
    }).catch(next);
}

function getOperationalBindingDetails(req: MeerkatReq, res: Response, next: NextFunction): void {
    const { id } = req.params;
    req.ctx.db.operationalBinding.findUnique({
        where: {
            uuid: id,
        },
        include: {
            previous: {
                select: {
                    uuid: true,
                },
            },
            access_point: {
                select: {
                    ae_title: true,
                },
            }
        },
    }).then((ob) => {
        if (!ob) {
            return res.status(404).send("Not Found");
        }
        const cp_rdn = ((typeof ob.new_context_prefix_rdn === "object") && ob.new_context_prefix_rdn)
            ? rdnFromJson(ob.new_context_prefix_rdn as Record<string, string>)
            : undefined;
        const cp_superior_dn = Array.isArray(ob.immediate_superior)
            ? ob.immediate_superior.map(rdnFromJson)
            : undefined;
        const cpdn = (cp_superior_dn && cp_rdn)
            ? [ ...cp_superior_dn, cp_rdn ]
            : undefined;
        const status: string = (ob.accepted === null)
            ? "WAITING DECISION"
            : (ob.accepted ? "ACCEPTED" : "REJECTED");
        const ap_ae_title: string | undefined = Array.isArray(ob.access_point?.ae_title)
            ? stringifyDN(req.ctx, ob.access_point!.ae_title.map((rdn: Record<string, string>) => rdnFromJson(rdn)))
            : undefined;
        const templateVariables = {
            ...ob,
            status,
            binding_type: ob.binding_type,
            validity_start: ob.validity_start.toISOString(),
            validity_end: ob.validity_end?.toISOString(),
            actionable: (ob.accepted === null),
            cp: cpdn
                ? stringifyDN(req.ctx, cpdn)
                : undefined,
            agreement_bytes: ob.agreement_ber
                ? breakIntoLines(Buffer.from(ob.agreement_ber).toString("hex"), 60).join("\n")
                : undefined,
            init_param_bytes: ob.initiator_ber
                ? breakIntoLines(Buffer.from(ob.initiator_ber).toString("hex"), 60).join("\n")
                : undefined,
            previous_uuid: ob.previous?.uuid,
            ap_ae_title,
            requested_time: ob.requested_time.toISOString(),
        };
        res.render('ob_id', templateVariables);
    }).catch(next);
}

function acceptOperationalBinding(req: MeerkatReq, res: Response, next: NextFunction): void {
    const { id } = req.params;
    req.ctx.db.operationalBinding.findUnique({
        where: {
            uuid: id,
        },
    }).then((result) => {
        if (!result) {
            res.status(404).send("Not Found");
            return;
        }
        req.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten<any, object>({
                    server: getServerStatistics(req.ctx),
                }),
                accepted: true,
                administratorEmail: req.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        return req.ctx.db.accessPoint.updateMany({
            where: {
                operational_bindings: {
                    some: {
                        uuid: result.uuid,
                    },
                },
            },
            data: {
                trust_ibra: (req.body?.ibra === "on"),
                disclose_cross_refs: (req.body?.xr === "on"),
            },
        }).then(() => {
            req.ctx.operationalBindingControlEvents.emit(id, true);
            return sleep(3000);
        }).then(() => {
            res.redirect(`/ob/${id}`);
        });
    }).catch(next);
}

function rejectOperationalBinding(req: MeerkatReq, res: Response, next: NextFunction): void {
    const { id } = req.params;
    req.ctx.db.operationalBinding.findUnique({
        where: {
            uuid: id,
        },
    }).then((result) => {
        if (!result) {
            return res.status(404).send("Not Found");
        }
        req.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten<any, object>({
                    server: getServerStatistics(req.ctx),
                }),
                accepted: false,
                administratorEmail: req.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        req.ctx.operationalBindingControlEvents.emit(id, false);
        res.redirect(`/ob/${id}`);
    }).catch(next);
}

function cancelOperationalBinding(req: MeerkatReq, res: Response, next: NextFunction): void {
    const { id } = req.params;
    req.ctx.db.operationalBinding.update({
        where: {
            uuid: id,
        },
        data: {
            terminated_time: new Date(),
        },
    }).then((result) => {
        req.ctx.telemetry.trackEvent({
            name: "OperationalBindingDecision",
            properties: {
                ...flatten<any, object>({
                    server: getServerStatistics(req.ctx),
                }),
                accepted: false,
                administratorEmail: req.ctx.config.administratorEmail,
                lastOBProblem: result.last_ob_problem,
                lastShadowingProblem: result.last_shadow_problem,
                lastUpdate: result.last_update,
                bindingVersion: result.binding_version,
                othertimes: result.othertimes,
                knowledgeType: result.knowledge_type,
                bindingType: result.binding_type,
                initiator: result.initiator,
                beginTime: result.periodic_beginTime,
                updateInterval: result.periodic_updateInterval,
                windowSize: result.periodic_windowSize,
                requestedTime: result.requested_time,
                respondedTime: result.responded_time,
                secondaryShadows: result.secondary_shadows,
                securityErrorCode: result.security_errorCode,
                securityErrorProtection: result.security_errorProtection,
                securityOperationCode: result.security_operationCode,
                securityTarget: result.security_target,
                securityTime: result.security_time,
                sourceIP: result.source_ip,
                sourceTCPPort: result.source_tcp_port,
                subordinates: result.subordinates,
                supplierInitiated: result.supplier_initiated,
                supplyContexts: result.supply_contexts,
                terminatedTime: result.terminated_time,
                validityEnd: result.validity_end,
                validityStart: result.validity_start,
            },
        });
        req.ctx.operationalBindingControlEvents.emit(id, false);
        res.redirect(`/ob/${id}`);
    }).catch(next);
}

function getDseById(req: MeerkatReq, res: Response, next: NextFunction): void {
    const { id } = req.params;
    req.ctx.db.entry.findUnique({
        where: {
            dseUUID: id,
        },
    }).then(async (entry) => {
        if (!entry) {
            return res.status(404).send("Not Found");
        }
        const superior = entry.immediate_superior_id
            ? await req.ctx.db.entry.findUnique({
                where: {
                    id: entry.immediate_superior_id,
                },
            })
            : undefined;
        const superiorUUID: string | undefined = superior?.dseUUID;
        const dn: DistinguishedName = await getDNFromEntryId(req.ctx, entry.id);
        const rdn = getRDN(dn);
        const vertex = await vertexFromDatabaseEntry(req.ctx, undefined, entry);
        const {
            userValues: userAttributes,
            operationalValues: operationalAttributes,
            collectiveValues,
        } = await readValues(req.ctx, vertex, {
            selection: selectAllInfo,
        });
        const attributes: [ string, string, string ][] = [
            ...userAttributes,
            ...operationalAttributes
                .filter((a) => !a.type.isEqualTo(entryDN["&id"])),
            ...collectiveValues,
        ]
            .map((attr) => [
                ((): string => {
                    const spec = req.ctx.attributeTypes.get(attr.type.toString());
                    return spec?.name?.[0] ?? spec?.ldapNames?.[0] ?? attr.type.toString();
                })(),
                ((): string => {
                    if (attr.type.isEqualTo(dseType["&id"])) {
                        return printDseType(attr.value.bitString).join(" & ");
                    }
                    if (attr.value.tagClass === ASN1TagClass.universal) {
                        if (attr.value.tagNumber === ASN1UniversalType.generalizedTime) {
                            return attr.value.generalizedTime.toString();
                        }
                        else if (attr.value.tagNumber === ASN1UniversalType.utcTime) {
                            return attr.value.utcTime.toString();
                        }
                        else if (attr.value.tagNumber === ASN1UniversalType.objectIdentifier) {
                            const oid = attr.value.objectIdentifier.toString();
                            const name = req.ctx.objectIdentifierToName.get(oid);
                            if (name) {
                                return `${oid} (${name})`;
                            } else {
                                return oid;
                            }
                        }
                    }
                    const spec = req.ctx.attributeTypes.get(attr.type.toString());
                    if (spec?.equalityMatchingRule?.isEqualTo(distinguishedNameMatch["&id"])) {
                        const dn_ = _decode_DistinguishedName(attr.value);
                        return stringifyDN(req.ctx, dn_);
                    }
                    if (!spec) {
                        return defaultEncoder(attr.value);
                    }
                    const ldapSyntax = getLDAPSyntax(req.ctx, spec.id);
                    if (!ldapSyntax?.encoder) {
                        return defaultEncoder(attr.value);
                    }
                    const encoder = ldapSyntax.encoder;
                    try {
                        return Buffer.from(encoder(attr.value)).toString("utf-8");
                    } catch {
                        return "COULD NOT DISPLAY";
                    }
                })(),
                Array.from(attr.contexts?.values() ?? [])
                    .map((context) => context.contextType.toString())
                    .join(", "),
            ]);

        const subordinates: [ string, string, string ][] = (await readSubordinates(req.ctx, vertex))
            .map((sub) => convertDSEToHTML(req.ctx, sub));

        res.render('dsait_dse_id', {
            ...entry,
            uuid: entry.dseUUID,
            superiorUUID,
            dn: dn.length === 0
                ? "(Empty DN)"
                : escape(stringifyDN(req.ctx, dn)),
            rdn: (!rdn || rdn.length === 0)
                ? "(Empty RDN)"
                : escape(encodeRDN(req.ctx, rdn)),
            flags: printFlags(vertex),
            attributes,
            subordinates,
            dbid: vertex.dse.id,
            shadow: !!vertex.dse.shadow,
            subcomplete: vertex.dse.shadow?.subordinateCompleteness,
            attrcomplete: vertex.dse.shadow?.attributeCompleteness,
            attrValuesIncomplete: Array.from(vertex.dse.shadow?.attributeValuesIncomplete ?? new Set())
                .map((oid_str: string) => {
                    const name = req.ctx.objectIdentifierToName.get(oid_str);
                    if (name) {
                        return `${oid_str} (${name})`;
                    } else {
                        return oid_str;
                    }
                }),
        });
    }).catch(next);
}

async function deleteDseById(req: MeerkatReq, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const soughtEntry = await req.ctx.db.entry.findUnique({
        where: {
            dseUUID: id,
        },
    });
    if (!soughtEntry) {
        res.status(404).send("Not Found");
        return;
    }
    let current: Entry | null = soughtEntry;
    const currentDN: DistinguishedName = [];
    while (current?.immediate_superior_id) {
        const rdn = await getRDNFromEntryId(req.ctx, current.id);
        currentDN.unshift(rdn);
        current = await req.ctx.db.entry.findUnique({
            where: {
                id: current.immediate_superior_id,
            },
        });
    }
    const entry = await dnToVertex(req.ctx, req.ctx.dit.root, currentDN);
    if (entry) {
        await deleteEntry(req.ctx, entry);
    }
    res.redirect("/");
}

// TODO: Caching
function getRobotsTXT(req: MeerkatReq, res: Response): void {
    res.contentType("text/plain; charset=utf-8");
    res.send(ROBOTS);
}

// TODO: Caching
function getWellKnownSecurityTXT(req: MeerkatReq, res: Response): void {
    res.contentType("text/plain; charset=utf-8");
    res.send(SECURITY_TXT);
}

// TODO: Caching
function getSecurityTXT(req: MeerkatReq, res: Response): void {
    res.contentType("text/plain; charset=utf-8");
    res.send(SECURITY_TXT);
}

function getAttributeCerts(req: MeerkatReq, res: Response): void {
    const certPath = req.ctx.config.authn.attributeCertificationPath;
    if (!certPath) {
        res.status(500).send();
        return;
    }
    const certs = [
        certPath.attributeCertificate,
        ...(certPath.acPath?.flatMap((acp) => acp.attributeCertificate ?? []) ?? []),
    ];
    return res.render("attr-certs", {
        type: "signing",
        certs: [ ...certs ].reverse().map((cert, index) => ({
            ...renderAttributeCert(req.ctx, cert),
            position: index + 1,
        })),
    });
}

function getSigningCerts(req: MeerkatReq, res: Response): void {
    const certs = req.ctx.config.signing.certPath ?? [];
    return res.render("certs", {
        type: "signing",
        certs: [ ...certs ].reverse().map((cert, index) => ({
            ...renderCert(req.ctx, cert),
            position: index + 1,
        })),
    });
}

function getSigningCRLs(req: MeerkatReq, res: Response): void {
    const crls = req.ctx.config.signing.certificateRevocationLists ?? [];
    return res.render("crls", {
        type: "signing",
        crls: crls.map((crl, index) => ({
            ...renderCRL(req.ctx, crl),
            position: index + 1,
        })),
    });
}

function getSigningAnchors(req: MeerkatReq, res: Response): void {
    const trustAnchors = req.ctx.config.signing.trustAnchorList ?? [];
    return res.render("anchors", {
        type: "signing",
        anchors: trustAnchors.map((ta, index) => ({
            ...renderTrustAnchor(req.ctx, ta),
            position: index + 1,
        })),
    });
}

function getPkiSigningCerts(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE) {
        res.status(404).send("No PKI Signing Certs");
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/pem-certificate-chain");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.sendFile(path.resolve(process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE));
}

function getPkiSigningCRLs(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_SIGNING_CRL_FILE) {
        res.status(404).send("No CRL file");
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.sendFile(path.resolve(process.env.MEERKAT_SIGNING_CRL_FILE));
}

function getPkiSigningTrustAnchorListPem(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const der = createTrustAnchorInfoFile(req.ctx.config.signing.trustAnchorList);
    const pem = new PEMObject("TRUST ANCHOR LIST", der);
    res.send(pem.encoded);
}

function getPkiSigningTrustAnchorListCMSC(req: MeerkatReq, res: Response): void {
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/cms");
    res.send(createTrustAnchorInfoFile(req.ctx.config.signing.trustAnchorList));
}

function getPkiSigningTrustAnchorListSignedPEM(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const der = createSignedTrustAnchorInfoFile(req.ctx, req.ctx.config.signing.trustAnchorList);
    if (!der) {
        res.status(500).send(); return;
    }
    const pem = new PEMObject("TRUST ANCHOR LIST", der);
    res.send(pem.encoded);
}

function getPkiSigningTrustAnchorListSignedCMSC(req: MeerkatReq, res: Response): void {
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/cms");
    const der = createSignedTrustAnchorInfoFile(req.ctx, req.ctx.config.signing.trustAnchorList);
    if (!der) {
        res.status(500).send(); return;
    }
    res.send(der);
}

function getSigningCertsP7B(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    const asPem: boolean = (req.query["pem"] === "1");
    if (asPem && !download) {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    } else {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pkcs7-certificates");
    }
    const der = createSigningP7B(req.ctx);
    if (!der) {
        res.status(500).send();
        return;
    }
    if (asPem) {
        const pem = new PEMObject("PKCS7", der);
        res.send(pem.encoded);
    } else {
        res.send(der);
    }
}

function getAttributeCertsPEM(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_ATTR_CERT_CHAIN_FILE) {
        res.status(500).send(); return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.sendFile(path.resolve(process.env.MEERKAT_ATTR_CERT_CHAIN_FILE));
}

function getSigningCSR(req: MeerkatReq, res: Response): void {
    const key = req.ctx.config.signing.key;
    const certPath = req.ctx.config.signing.certPath;
    const cert = certPath && certPath[certPath?.length - 1];
    if (!cert || !key) {
        res.status(500).send("No configured certificate or key.");
        return;
    }
    const der = createCSR(req.ctx, key, cert);
    if (!der) {
        res.status(500).send("Failed to generate.");
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/pkcs10");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const pem = new PEMObject("CERTIFICATE REQUEST", der);
    res.send(pem.encoded);
}

function getSigningPublicKey(req: MeerkatReq, res: Response): void {
    const certPath = req.ctx.config.signing.certPath;
    const cert = certPath && certPath[certPath?.length - 1];
    if (!cert) {
        res.status(500).send(); return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.send(createPublicKeyFile(cert));
}

function getSigningCertsPkiPath(req: MeerkatReq, res: Response): void {
    const certPath = req.ctx.config.signing.certPath;
    if (!certPath) {
        res.status(500).send(); return;
    }
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/pkix-pkipath");
    const der = _encode_PkiPath(certPath, DER).toBytes();
    res.send(der);
}

function getTLSCerts(req: MeerkatReq, res: Response): void {
    const certsFile = req.ctx.config.tls.cert as string;
    if (!certsFile) {
        res.status(500).send(); return;
    }
    const certs = PEMObject.parse(certsFile)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_Certificate(el);
        });
    return res.render("certs", {
        type: "tls",
        certs: certs.map((cert, index) => ({
            ...renderCert(req.ctx, cert),
            position: index + 1,
        })),
    });
}

function getTLSCRLs(req: MeerkatReq, res: Response): void {
    const crls = req.ctx.config.tls.certificateRevocationLists ?? [];
    return res.render("crls", {
        type: "tls",
        crls: crls.map((crl, index) => ({
            ...renderCRL(req.ctx, crl),
            position: index + 1,
        })),
    });
}

function getTLSAnchors(req: MeerkatReq, res: Response): void {
    const trustAnchors = req.ctx.config.tls.trustAnchorList ?? [];
    return res.render("anchors", {
        type: "tls",
        anchors: trustAnchors.map((ta, index) => ({
            ...renderTrustAnchor(req.ctx, ta),
            position: index + 1,
        })),
    });
}

function getTLSCertsPEM(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_TLS_CERT_FILE) {
        res.status(404).send();
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/pem-certificate-chain");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.sendFile(path.resolve(process.env.MEERKAT_TLS_CERT_FILE));
}

function getTlsCrlsPEM(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_TLS_CRL_FILE) {
        res.status(404).send();
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.sendFile(path.resolve(process.env.MEERKAT_TLS_CRL_FILE));
}

function getTlsTrustAnchorListPEM(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const der = createTrustAnchorInfoFile(req.ctx.config.tls.trustAnchorList);
    const pem = new PEMObject("TRUST ANCHOR LIST", der);
    res.send(pem.encoded);
}

function getTlsTrustAnchorListCMSC(req: MeerkatReq, res: Response): void {
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/cms");
    res.send(createTrustAnchorInfoFile(req.ctx.config.tls.trustAnchorList));
}

function getTlsTrustAnchorListSignedPEM(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const der = createSignedTrustAnchorInfoFile(req.ctx, req.ctx.config.tls.trustAnchorList);
    if (!der) {
        res.status(500).send(); return;
    }
    const pem = new PEMObject("TRUST ANCHOR LIST", der);
    res.send(pem.encoded);
}

function getTlsTrustAnchorListSignedCMSC(req: MeerkatReq, res: Response): void {
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/cms");
    const der = createSignedTrustAnchorInfoFile(req.ctx, req.ctx.config.tls.trustAnchorList);
    if (!der) {
        res.status(500).send(); return;
    }
    res.send(der);
}

function getTlsCertsP7B(req: MeerkatReq, res: Response): void {
    const download: boolean = (req.query["download"] === "1");
    const asPem: boolean = (req.query["pem"] === "1");
    if (asPem && !download) {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    } else {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pkcs7-certificates");
    }
    const der = createTLSP7B(req.ctx);
    if (!der) {
        res.status(500).send(); return;
    }
    if (asPem) {
        const pem = new PEMObject("PKCS7", der);
        res.send(pem.encoded);
    } else {
        res.send(der);
    }
}

function getTlsCsr(req: MeerkatReq, res: Response): void {
    const keyFile = req.ctx.config.tls?.key;
    const certsFile = req.ctx.config.tls.cert as string;
    if (!keyFile || !certsFile) {
        res.status(500).send(); return;
    }
    const certPath = PEMObject.parse(certsFile)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_Certificate(el);
        });

    const key = createPrivateKey({
        format: "pem",
        type: "pkcs8",
        key: keyFile as string,
        passphrase: req.ctx.config.tls.passphrase,
    });
    const der = createCSR(req.ctx, key, certPath[0]);
    if (!der) {
        // throw new InternalServerErrorException("Failed to generate.");
        res.status(500).send("Failed to generate.");
        return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/pkcs10");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    const pem = new PEMObject("CERTIFICATE REQUEST", der);
    res.send(pem.encoded);
}

function getTlsPublicKeyPEM(req: MeerkatReq, res: Response): void {
    const certsFile = req.ctx.config.tls.cert as string;
    if (!certsFile) {
        res.status(500).send(); return;
    }
    const certPath = PEMObject.parse(certsFile)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_Certificate(el);
        });
    const cert = certPath && certPath[certPath?.length - 1];
    if (!cert) {
        res.status(500).send(); return;
    }
    const download: boolean = (req.query["download"] === "1");
    if (download) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/x-pem-file");
    } else {
        res.setHeader("Content-Disposition", "inline");
        res.contentType("text/plain; charset=utf-8");
    }
    res.send(createPublicKeyFile(cert));
}

function getTlsCertPKIPath(req: MeerkatReq, res: Response): void {
    const certsFile = req.ctx.config.tls.cert as string;
    if (!certsFile) {
        res.status(404).send("No TLS Certs.");
        return;
    }
    const certPath = PEMObject.parse(certsFile)
        .map((p) => {
            const el = new DERElement();
            el.fromBytes(p.data);
            return _decode_Certificate(el);
        });
    res.setHeader("Content-Disposition", "attachment");
    res.contentType("application/pkix-pkipath");
    const der = _encode_PkiPath(certPath, DER).toBytes();
    res.send(der);
}

function getTlsDhParams(req: MeerkatReq, res: Response): void {
    if (!process.env.MEERKAT_TLS_DH_PARAM_FILE) {
        res.status(404).send("No DH parameters file.");
        return;
    }
    res.contentType("application/dhparams");
    res.sendFile(path.resolve(process.env.MEERKAT_TLS_DH_PARAM_FILE));
}

async function getPkiSelfCheck(req: MeerkatReq, res: Response): Promise<void> {
    let tlsResult: VerifyCertPathResult | undefined;
    if (typeof req.ctx.config.tls.cert === "string") {
        const tlsPkiPath = PEMObject.parse(req.ctx.config.tls.cert)
            .map((p) => {
                const el = new DERElement();
                el.fromBytes(p.data);
                return _decode_Certificate(el);
            });
        const userCert = tlsPkiPath[0];
        const tlsCertPath = new CertificationPath(
            userCert,
            tlsPkiPath
                .slice(1)
                .map((cert) => new CertificatePair(
                    cert,
                    undefined,
                )),
        );
        tlsResult = await verifyAnyCertPath(req.ctx, tlsCertPath, undefined, {
            trustAnchorList: req.ctx.config.tls.trustAnchorList,
            certificateRevocationLists: req.ctx.config.tls.certificateRevocationLists,
            revokedCertificateSerialNumbers: req.ctx.config.tls.revokedCertificateSerialNumbers,
            ocspCheckiness: 1,
            remoteCRLCheckiness: RemoteCRLCheckiness.always,
            tolerateUnavailableRemoteCRL: false,
        });
    }
    let signingResult: VerifyCertPathResult | undefined;
    if (req.ctx.config.signing.certPath) {
        const pkiPath = req.ctx.config.signing.certPath;
        const userCert = pkiPath[pkiPath.length - 1];
        const certPath = new CertificationPath(
            userCert,
            pkiPath
                .slice(0, -1)
                .reverse()
                .map((cert) => new CertificatePair(
                    cert,
                    undefined,
                )),
        );
        signingResult = await verifyAnyCertPath(req.ctx, certPath, undefined, {
            trustAnchorList: req.ctx.config.signing.trustAnchorList,
            certificateRevocationLists: req.ctx.config.signing.certificateRevocationLists,
            revokedCertificateSerialNumbers: req.ctx.config.signing.revokedCertificateSerialNumbers,
            ocspCheckiness: 1,
            remoteCRLCheckiness: RemoteCRLCheckiness.always,
            tolerateUnavailableRemoteCRL: false,
            permittedSignatureAlgorithms: req.ctx.config.signing.permittedSignatureAlgorithms,
        });
    }
    const signingMessage = vcpReturnCodeToString.get(signingResult?.returnCode ?? -999)
        ?? `UNRECOGNIZED RETURN CODE ${signingResult?.returnCode}`;
    const tlsMessage = vcpReturnCodeToString.get(tlsResult?.returnCode ?? -999)
        ?? `UNRECOGNIZED RETURN CODE ${tlsResult?.returnCode}`;
    const signingSuccess: boolean = (signingResult?.returnCode === VCP_RETURN_OK);
    const tlsSuccess: boolean = (signingResult?.returnCode === VCP_RETURN_OK);
    return res.render("selfcheck", {
        signingSuccess,
        tlsSuccess,
        signingMessage,
        tlsMessage,
    });
}

function getRemoteCRLCache(req: MeerkatReq, res: Response): void {
    return res.render("crl-cache", {
        crls: Array.from(crlCache.entries())
            .map(([ url, [ date, crls ]]) => ({
                date,
                url,
                crls: crls.length,
            })),
    });
}

function getUpdates(req: MeerkatReq, res: Response): void {
    res.render("updates", {});
}

function getHelp(req: MeerkatReq, res: Response): void {
    res.render("help", {});
}

function getAbout(req: MeerkatReq, res: Response): void {
    res.render("about", {
        version: "TODO", // FIXME:
        hash: "TODO", // FIXME:
        os_arch: canFail(() => os.arch()),
        os_cpus: canFail(() => os.cpus().length.toString()),
        os_endianness: canFail(() => os.endianness()),
        os_freemem: canFail(() => os.freemem().toString()),
        os_homedir: canFail(() => os.homedir()),
        os_hostname: canFail(() => os.hostname()),
        os_platform: canFail(() => os.platform()),
        os_release: canFail(() => os.release()),
        os_totalmem: canFail(() => os.totalmem().toString()),
        os_type: canFail(() => os.type()),
        os_uptime: canFail(() => os.uptime().toString() + " seconds"),
        os_version: canFail(() => os.version()),
    });
}

function getHibernate(req: MeerkatReq, res: Response): void {
    res.render("hibernate", {
        hibernatingSince: req.ctx.dsa.hibernatingSince
            ? req.ctx.dsa.hibernatingSince.toISOString()
            : undefined,
    });
}

function startHibernate(req: MeerkatReq, res: Response): void {
    const startDate = new Date();
    req.ctx.telemetry.trackEvent({
        name: "Hibernation",
        properties: {
            ...flatten<any, object>({
                server: getServerStatistics(req.ctx),
            }),
            since: startDate,
            started: true,
            administratorEmail: req.ctx.config.administratorEmail,
        },
    });
    req.ctx.dsa.hibernatingSince = startDate;
    res.redirect("/hibernate");
}

function endHibernate(req: MeerkatReq, res: Response): void {
    req.ctx.telemetry.trackEvent({
        name: "Hibernation",
        properties: {
            ...flatten<any, object>({
                server: getServerStatistics(req.ctx),
            }),
            since: req.ctx.dsa.hibernatingSince,
            started: false,
            administratorEmail: req.ctx.config.administratorEmail,
        },
    });
    req.ctx.dsa.hibernatingSince = undefined;
    res.redirect("/hibernate");
}

// Why the hell did I put this much effort into a web admin console?
export {
    setMeerkatContext,
    loggingMiddleware,
    basicAuthMiddleware,
    securityMiddleware,
    getHomePage,
    getConformance,
    getOperationalBindings,
    getOperationalBindingDetails,
    acceptOperationalBinding,
    rejectOperationalBinding,
    cancelOperationalBinding,
    getDseById,
    deleteDseById,
    getRobotsTXT,
    getWellKnownSecurityTXT,
    getSecurityTXT,
    getAttributeCerts,
    getSigningCerts,
    getSigningCRLs,
    getSigningAnchors,
    getPkiSigningCerts,
    getPkiSigningCRLs,
    getPkiSigningTrustAnchorListPem,
    getPkiSigningTrustAnchorListCMSC,
    getPkiSigningTrustAnchorListSignedPEM,
    getPkiSigningTrustAnchorListSignedCMSC,
    getSigningCertsP7B,
    getAttributeCertsPEM,
    getSigningCSR,
    getSigningPublicKey,
    getSigningCertsPkiPath,
    getTLSCerts,
    getTLSCRLs,
    getTLSAnchors,
    getTLSCertsPEM,
    getTlsCrlsPEM,
    getTlsTrustAnchorListPEM,
    getTlsTrustAnchorListCMSC,
    getTlsTrustAnchorListSignedCMSC,
    getTlsTrustAnchorListSignedPEM,
    getTlsCertsP7B,
    getTlsCsr,
    getTlsPublicKeyPEM,
    getTlsCertPKIPath,
    getTlsDhParams,
    getPkiSelfCheck,
    getRemoteCRLCache,
    getUpdates,
    getHelp,
    getAbout,
    getHibernate,
    startHibernate,
    endHibernate,
};
