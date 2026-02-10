import {
    CRLIndex,
    Context,
    IndexableOID,
    OfflinePKIConfig,
} from "../types/index.js";
import {
    PkiPath,
} from "@wildboar/pki-stub";
import {
    ACPathData,
    AttributeCertificate,
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareGeneralName,
    compareName, getDateFromTime, groupByOID,
} from "@wildboar/x500";
import { evaluateTemporalContext } from "@wildboar/x500/matching/context";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { Name } from "@wildboar/pki-stub";
import { Certificate, _encode_Certificate } from "@wildboar/pki-stub";
import { issuerAltName } from "@wildboar/x500/CertificateExtensions";
import { BOOLEAN, DERElement, packBits } from "@wildboar/asn1";
import { subjectAltName } from "@wildboar/x500/CertificateExtensions";
import { digestOIDToNodeHash } from "./digestOIDToNodeHash.js";
import { createHash } from "node:crypto";
import {
    ObjectDigestInfo_digestedObjectType_publicKeyCert,
    ObjectDigestInfo_digestedObjectType_publicKey,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { DER } from "@wildboar/asn1/functional";
import { SubjectPublicKeyInfo, _encode_SubjectPublicKeyInfo } from "@wildboar/pki-stub";
import { noAssertion } from "@wildboar/x500/AttributeCertificateDefinitions";
import { Holder } from "@wildboar/pki-stub";
import { sOAIdentifier } from "@wildboar/x500/AttributeCertificateDefinitions";
import { TrustAnchorChoice, TrustAnchorList } from "@wildboar/tal";
import { isCertInTrustAnchor } from "../pki/isCertInTrustAnchor.js";
import { AttCertIssuer } from "@wildboar/pki-stub";
import { TBSCertificate } from "@wildboar/pki-stub";
import { issuedOnBehalfOf } from "@wildboar/x500/AttributeCertificateDefinitions";
import stringifyDN from "../x500/stringifyDN.js";
import { getReadDispatcher, verifySignature } from "./verifyCertPath.js";
import { singleUse } from "@wildboar/x500/AttributeCertificateDefinitions";
import { groupAC } from "@wildboar/x500/AttributeCertificateDefinitions";
import { targetingInformation } from "@wildboar/x500/AttributeCertificateDefinitions";
import { noRevAvail } from "@wildboar/x500/AttributeCertificateDefinitions";
import { timeSpecification } from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    _encode_TimeAssertion,
} from "@wildboar/x500/SelectedAttributeTypes";
import { GeneralName } from "@wildboar/pki-stub";
import { IssuerSerial } from "@wildboar/pki-stub";
import { ObjectDigestInfo } from "@wildboar/pki-stub";
import { MeerkatContext } from "../ctx.js";
import { NameAndOptionalUID } from "@wildboar/x500/SelectedAttributeTypes";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import { checkRemoteCRLs } from "./verifyCertPath.js";
import {
    cRLDistributionPoints,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorityKeyIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    AltSignatureAlgorithm,
    _decode_AltSignatureAlgorithm,
    altSignatureAlgorithm,
} from "@wildboar/x500/CertificateExtensions";
import {
    altSignatureValue,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorityInfoAccess,
} from "@wildboar/x500/PkiPmiExternalDataTypes";
import {
    subjectInfoAccess,
} from "@wildboar/x500/PkiPmiExternalDataTypes";
import {
    subjectKeyIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    _decode_SubjectAltPublicKeyInfo,
    subjectAltPublicKeyInfo,
} from "@wildboar/x500/CertificateExtensions";
import { Extension } from "@wildboar/x500/AuthenticationFramework";
import { _encode_AlgorithmIdentifier } from "@wildboar/pki-stub";
import { TBSAttributeCertificate, _encode_TBSAttributeCertificate } from "@wildboar/pki-stub";
import { checkOCSP } from "./verifyCertPath.js";
import { general_name_matches_cert } from "./general_name_matches_cert.js";

export const VAC_OK: number = 0;
export const VAC_NOT_BEFORE: number = -1;
export const VAC_NOT_AFTER: number = -2;
export const VAC_MISSING_BASE_CERT: number = -3;
export const VAC_HOLDER_MISMATCH: number = -4;
export const VAC_UNSUPPORTED_HOLDER_DIGEST: number = -5;
export const VAC_UNSUPPORTED_HOLDER_DIGESTED_OBJECT: number = -6;
export const VAC_NO_ASSERTION: number = -7;
export const VAC_NO_SOA_CERT: number = -8;
export const VAC_UNTRUSTED_SOA: number = -10;
export const VAC_INTERNAL_ERROR: number = -11;
export const VAC_UNUSABLE_AC_PATH: number = -12;
export const VAC_INVALID_DELEGATION: number = -13;
export const VAC_UNSUPPORTED_SIG_ALG: number = -14;
export const VAC_INVALID_SIGNATURE: number = -15;
export const VAC_SINGLE_USE: number = -16;
export const VAC_ACERT_REVOKED: number = -17;
export const VAC_INVALID_TARGET: number = -18;
export const VAC_INVALID_TIME_SPEC: number = -19;
export const VAC_AMBIGUOUS_GROUP: number = -20;
export const VAC_NOT_GROUP_MEMBER: number = -21;
export const VAC_DUPLICATE_EXT: number = -23;
export const VAC_UNKNOWN_CRIT_EXT: number = -24;
export const VAC_INVALID_EXT_CRIT: number = -25;
export const VAC_CRL_REVOKED: number = -26;
export const VAC_OCSP_OTHER: number = -27;
export const VAC_OCSP_REVOKED: number = -28;
export const VAC_RETURN_OCSP_REVOKED: number = -102;
export const VAC_RETURN_OCSP_OTHER: number = -103;
export const VAC_RETURN_CRL_REVOKED: number = -104;
export const VAC_RETURN_CRL_UNREACHABLE: number = -105;

export
const supportedExtensions: Set<IndexableOID> = new Set([
    issuerAltName["&id"]!.toString(), // TODO: If critical, one of the name forms must be recognized.
    cRLDistributionPoints["&id"]!.toString(), // MUST be checked if critical.
    authorityKeyIdentifier["&id"]!.toString(), // Always non-critical.
    altSignatureAlgorithm["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    altSignatureValue["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    authorityInfoAccess["&id"]!.toString(), // Always non-critical
    subjectInfoAccess["&id"]!.toString(), // Always non-critical
]);

export
const extensionMandatoryCriticality: Map<IndexableOID, BOOLEAN> = new Map([
    [ subjectKeyIdentifier["&id"]!.toString(), false ], // Always non-critical.
    [ authorityKeyIdentifier["&id"]!.toString(), false ], // Always non-critical.
    [ authorityInfoAccess["&id"]!.toString(), false ], // Always non-critical.
    [ subjectInfoAccess["&id"]!.toString(), false ], // Always non-critical.
]);

// TODO: Move this to @wildboar/x500
/**
 * @summary Compare two `IssuerSerial`s
 * @description
 *
 * This function compares two `IssuerSerial`s for equality, returning `true` if
 * they match.
 *
 * @param ctx The context object
 * @param a An IssuerSerial
 * @param b The other `IssuerSerial`
 * @returns A `boolean` indicating whether the two `IssuerSerial`s match.
 *
 * @function
 */
function compare_issuer_serial (ctx: Context, a: IssuerSerial, b: IssuerSerial): boolean {
    if (!Buffer.compare(a.serial, b.serial)) {
        return false;
    }
    if (
        a.issuerUID
        && b.issuerUID
        && !Buffer.compare(packBits(a.issuerUID), packBits(b.issuerUID))
    ) {
        return false;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    const nameMatched = a.issuer.some((agn) => {
        for (const bgn of b.issuer) {
            if (compareGeneralName(agn, bgn, namingMatcher)) {
                return true;
            }
        }
        return false;
    });
    if (!nameMatched) {
        return false;
    }
    return true;
}

/**
 * @summary Create an `IssuerSerial` from a public key certificate
 * @description
 *
 * This function creates an `IssuerSerial` from a public key certificate.
 *
 * @param cert A public key certificate whose `IssuerSerial` is to be determined.
 * @returns An `IssuerSerial` for the certificate
 */
function get_issuer_serial_from_cert (cert: Certificate): IssuerSerial {
    return new IssuerSerial(
        [
            {
                directoryName: cert.toBeSigned.issuer,
            },
        ],
        cert.toBeSigned.serialNumber,
        cert.toBeSigned.issuerUniqueIdentifier,
    );
}

// TODO: Replace some code below with this.
/**
 * @summary Check whether an object digest matches a certificate
 * @description
 *
 * This function checks whether an `ObjectDigestInfo` refers to the asserted
 * certificate.
 *
 * @param cert The public key certificate whose object digest is to be checked.
 * @param odinfo The object digest info
 * @returns A `boolean` indicating whether the certificate is identified by the
 *  object digest info
 *
 * @function
 */
function object_digest_matches_cert (cert: Certificate, odinfo: ObjectDigestInfo): boolean {
    const hash_str = digestOIDToNodeHash.get(odinfo.digestAlgorithm.algorithm.toString());
    if (!hash_str) {
        return false;
    }
    const hasher = createHash(hash_str);
    let hashBytes: Uint8Array | undefined;
    switch (odinfo.digestedObjectType) {
        case (ObjectDigestInfo_digestedObjectType_publicKeyCert): {
            hashBytes = cert.originalDER ?? _encode_Certificate(cert, DER).toBytes();
            break;
        }
        case (ObjectDigestInfo_digestedObjectType_publicKey): {
            hashBytes = _encode_SubjectPublicKeyInfo(cert.toBeSigned.subjectPublicKeyInfo, DER).toBytes();
            break;
        }
        default: return false;
    }
    hasher.update(hashBytes!);
    const calculatedHashValue = hasher.digest();
    const suppliedHashValue = packBits(odinfo.objectDigest);
    // TODO: Does this need to be timing-safe? I don't think it does.
    return !Buffer.compare(calculatedHashValue, suppliedHashValue);
}


// TODO: This was copied from verifyCertPath.
/**
 * @summary Verify an X.509 certificate's alternative digital signature.
 * @description
 *
 * This function verifies the alternative digital signature, as defined in ITU
 * Recommendation X.509 (2019), Sections 9.8 and 7.2.2.
 *
 * Note that ITU Recommendation X.509 (2019), Section 9.8.4 states that the
 * `altSignatureValue` extension value:
 *
 * > shall be verified using the alternative public key of the issuer.
 *
 * ### Implementation
 *
 * - Check that the issuer cert has an alternative public key.
 * - Check that the subject cert has all three needed extensions.
 * - Re-encode the subject cert appropriately.
 * - Check the signature.
 *
 * @param subjectCert
 * @param issuerCert
 * @returns
 */
function verifyAltSignature (subjectCert: AttributeCertificate, issuerExts?: Extension[]): boolean | undefined {
    if (!issuerExts) {
        return undefined;
    }
    const issuerAltPublicKeyExt = issuerExts.find((ext) => ext.extnId.isEqualTo(subjectAltPublicKeyInfo["&id"]!));
    if (!issuerAltPublicKeyExt) {
        return undefined; // The issuer has no alternative public key to verify with.
    }
    let subjectAltSignatureAlgorithmExt: Extension | undefined;
    let subjectAltSignatureValueExt: Extension | undefined;
    for (const ext of subjectCert.toBeSigned.extensions ?? []) {
        if (ext.extnId.isEqualTo(altSignatureAlgorithm["&id"]!)) {
            if (subjectAltSignatureAlgorithmExt) {
                // Already defined.
                return undefined; // Invalid: there can be only one alternative signature.
            }
            subjectAltSignatureAlgorithmExt = ext;
            continue; // Just to avoid checking the next if statement.
        }
        if (ext.extnId.isEqualTo(altSignatureValue["&id"]!)) {
            if (subjectAltSignatureValueExt) {
                // Already defined.
                return undefined; // Invalid: there can be only one alternative signature.
            }
            subjectAltSignatureValueExt = ext;
        }
    }
    if (!subjectAltSignatureAlgorithmExt || !subjectAltSignatureValueExt) {
        return undefined;
    }
    const pubkey = _decode_SubjectAltPublicKeyInfo(issuerAltPublicKeyExt.valueElement());
    const sigAlg: AltSignatureAlgorithm = _decode_AltSignatureAlgorithm(subjectAltSignatureAlgorithmExt.valueElement());
    const sigValue: Uint8Array = packBits(subjectAltSignatureValueExt.valueElement().bitString);
    const verificand = DERElement.fromSequence([
        _encode_TBSAttributeCertificate(new TBSAttributeCertificate(
            subjectCert.toBeSigned.version,
            subjectCert.toBeSigned.holder,
            subjectCert.toBeSigned.issuer,
            subjectCert.toBeSigned.signature,
            subjectCert.toBeSigned.serialNumber,
            subjectCert.toBeSigned.attrCertValidityPeriod,
            subjectCert.toBeSigned.attributes,
            subjectCert.toBeSigned.issuerUniqueID,
            subjectCert._unrecognizedExtensionsList,
            // The altSignatureValue extension is supposed to be removed.
            subjectCert.toBeSigned.extensions
                ?.filter((ext) => !ext.extnId.isEqualTo(altSignatureValue["&id"]!)),
        )),
        _encode_AlgorithmIdentifier(subjectCert.algorithmIdentifier, DER),
        // The native signature is supposed to be excluded.
    ]).toBytes();
    return verifySignature(verificand, sigAlg, sigValue, pubkey);
}

/**
 * @summary Check if a certificate is revoked in locally-configured CRLs.
 * @description
 *
 * This function checks if an attribute certificate has been revoked (by having
 * its serial number present) in one of the locally-configured CRLs.
 *
 * @param ctx The context object
 * @param cert The attribute certificate
 * @param asOf The point-in-time to check revocation
 * @param options Options pertaining to CRL checking
 * @returns A `boolean` indicating whether the certificate is revoked in any CRL.
 *
 * @function
 */
function isRevokedFromConfiguredCRLs (
    ctx: Context,
    cert: AttributeCertificate,
    asOf: Date,
    options: CRLIndex & OfflinePKIConfig,
): boolean {
    // If the index of revoked certificate serial numbers has this cert's SN,
    // it is worth scanning the CRLs for which cert revoked it.
    if (!options.revokedCertificateSerialNumbers.has(cert.toBeSigned.serialNumber.toString())) {
        return false;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    return options.certificateRevocationLists
        .some((crl) => (
            // We only care about CRLs that could have applied at the asserted time.
            (getDateFromTime(crl.toBeSigned.thisUpdate) <= asOf)
            && cert.toBeSigned.issuer.issuerName?.some((iss_name) => compareGeneralName(
                { directoryName: crl.toBeSigned.issuer },
                iss_name,
                namingMatcher,
            ))
            && crl.toBeSigned.revokedCertificates
                ?.some((rc) => (
                    (rc.serialNumber == cert.toBeSigned.serialNumber)
                    && (getDateFromTime(rc.revocationDate) <= asOf)
                ))
        ));
}

async function hydrate_attr_cert_path_arc (arc: ACPathData): Promise<ACPathData> {
    // TODO: ~~If no certificate, fetch the certificate from the~~
    // Actually, nevermind. There is no efficient way to find the cert if not specified.
    // TODO: If no attribute certificate, fetch the attribute certificate from the subject DN.
    return arc;
}

// Holder ::= SEQUENCE {
//     baseCertificateID  [0]  IssuerSerial OPTIONAL,
//     entityName         [1]  GeneralNames OPTIONAL,
//     objectDigestInfo   [2]  ObjectDigestInfo OPTIONAL }
// TODO: Actually, the path should just be an index of DNs
async function hydrate_attr_cert_path (
    ctx: Context,
    path: AttributeCertificationPath,
): Promise<AttributeCertificationPath> {
    // const processed: Set<ACPathData> = new Set();
    const byBaseCertId: Map<string, ACPathData> = new Map();
    // const byGeneralName: Map<string, ACPathData> = new Map(); // Not guaranteed to be unique.
    // const byCertDigest: Map<string, ACPathData> = new Map();
    // const byPublicKeyDigest: Map<string, ACPathData> = new Map();

    const digests = path.acPath?.map((arc) => arc.attributeCertificate?.toBeSigned.issuer.objectDigestInfo) ?? [];
    // for (const digest of digests) {
    //     // digests.
    // }

    for (const arc of path.acPath ?? []) {
        if (arc.certificate) {
            const issuer = stringifyDN(ctx, arc.certificate.toBeSigned.issuer.rdnSequence);
            const serial = Buffer.from(arc.certificate.toBeSigned.serialNumber).toString("base64");
            const key = `${serial}:${issuer}`;
            byBaseCertId.set(key, arc);
        }
    }


    // const new_path: ACPathData[] = [];
    // const first = path.acPath?.find((arc) => arc.)
    // stringifyGN(ctx, )
    // const authorities = path.acPath?.sort((a, b) => {
    // });
    return path;
}

/**
 * @summary Check if a public key certificate is the holder of an attribute certificate
 * @description
 *
 * This function checks if the `holder` field of an attribute certificate refers
 * to the asserted public key certificate.
 *
 * @param ctx The context object
 * @param eeCert The end-entity certificate
 * @param holder The `holder` field of an attribute certificate
 * @param issuerCert The issuer certificate of the end-entity
 * @returns A return code
 */
function is_cert_holder (
    ctx: Context,
    eeCert: Certificate,
    holder: Holder,
    issuerCert?: Certificate,
): number {
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (holder.baseCertificateID) {
        if (!eeCert) {
            return VAC_MISSING_BASE_CERT;
        }
        if (!Buffer.compare(eeCert.toBeSigned.serialNumber, holder.baseCertificateID.serial)) {
            return VAC_HOLDER_MISMATCH;
        }
        if (holder.baseCertificateID.issuerUID && eeCert.toBeSigned.issuerUniqueIdentifier) {
            const a = holder.baseCertificateID.issuerUID;
            const b = eeCert.toBeSigned.issuerUniqueIdentifier;
            const x = Buffer.from(a.buffer, a.byteOffset, a.byteLength);
            const y = Buffer.from(b.buffer, b.byteOffset, b.byteLength);
            if (!Buffer.compare(x, y)) {
                return VAC_HOLDER_MISMATCH;
            }
        }

        // TODO: When extended Name syntax is supported, compare against other name forms.
        const issuerNames: Name[] = holder.baseCertificateID.issuer
            .map((iss) => ("directoryName" in iss) ? iss.directoryName : undefined)
            .filter((iss): iss is Name => !!iss)
            .slice(0, 10); // Slice to prevent DoS attacks by large inputs.
        let name_matched: boolean = false;
        const issuer_name = eeCert.toBeSigned.issuer;
        for (const base_cert_iss_name of issuerNames) {
            if (compareName(issuer_name, base_cert_iss_name, namingMatcher)) {
                name_matched = true;
                break;
            }
        }
        // If the names didn't match the issuer field, we try the issuerAltNames in the EE certificate.
        // ACTUALLY, I changed my mind on this. I think the use of this extension
        // would allow intermediate issuers to issue names to themselves they
        // might not have been granted by their CAs.
        // if (!name_matched) {
        //     for (const ext of eeCert.toBeSigned.extensions ?? []) {
        //         if (!ext.extnId.isEqualTo(issuerAltName["&id"]!)) {
        //             continue;
        //         }
        //         const el = new DERElement();
        //         el.fromBytes(ext.extnValue);
        //         const issuer_alt_names = issuerAltName.decoderFor["&ExtnType"]!(el);
        //         for (const gn of issuer_alt_names) {
        //             if ("directoryName" in gn) {
        //                 if (compareName(issuer_name, gn.directoryName, namingMatcher)) {

        //                 }
        //             }
        //         }
        //     }
        //     return VAC_HOLDER_MISMATCH;
        // }
        // If the issuer name did not match the issuer field on the cert, try the issuer's subject alt names.
        if (!name_matched && issuerCert) {
            for (const ext of issuerCert.toBeSigned.extensions ?? []) {
                if (!ext.extnId.isEqualTo(subjectAltName["&id"]!)) {
                    continue;
                }
                const el = new DERElement();
                el.fromBytes(ext.extnValue);
                const sans = subjectAltName.decoderFor["&ExtnType"]!(el);
                for (const san of sans) {
                    if ("directoryName" in san) {
                        if (compareName(issuer_name, san.directoryName, namingMatcher)) {
                            name_matched = true;
                            break;
                        }
                    }
                }
                if (name_matched) {
                    break;
                }
            }
        }
        if (!name_matched) {
            return VAC_HOLDER_MISMATCH;
        }
    }
    if (holder.entityName) {
        const subjectNames: Name[] = [ eeCert.toBeSigned.subject ];
        for (const ext of eeCert.toBeSigned.extensions ?? []) {
            if (!ext.extnId.isEqualTo(subjectAltName["&id"]!)) {
                continue;
            }
            const el = new DERElement();
            el.fromBytes(ext.extnValue);
            const sans = subjectAltName.decoderFor["&ExtnType"]!(el);
            for (const san of sans) {
                if ("directoryName" in san) {
                    subjectNames.push(san.directoryName);
                }
            }
        }
        const ens: Name[] = holder.entityName
            .map((n) => ("directoryName" in n) ? n.directoryName : undefined)
            .filter((n): n is Name => !!n)
            .slice(0, 10); // Slice to prevent DoS attacks by large inputs.
        let name_matched: boolean = false;
        for (const sn of subjectNames) {
            for (const en of ens) {
                if (compareName(sn, en, namingMatcher)) {
                    name_matched = true;
                    break;
                }
            }
            if (name_matched) {
                break;
            }
        }
        if (!name_matched) {
            return VAC_HOLDER_MISMATCH;
        }
    }
    if (holder.objectDigestInfo) {
        const hash_str = digestOIDToNodeHash.get(holder.objectDigestInfo.digestAlgorithm.algorithm.toString());
        if (hash_str) {
            const hasher = createHash(hash_str);
            let hashBytes: Uint8Array | undefined;
            switch (holder.objectDigestInfo.digestedObjectType) {
                case (ObjectDigestInfo_digestedObjectType_publicKeyCert): {
                    hashBytes = eeCert.originalDER ?? _encode_Certificate(eeCert, DER).toBytes();
                    break;
                }
                case (ObjectDigestInfo_digestedObjectType_publicKey): {
                    hashBytes = _encode_SubjectPublicKeyInfo(eeCert.toBeSigned.subjectPublicKeyInfo, DER).toBytes();
                    break;
                }
                default: {
                    if (!holder.baseCertificateID && !holder.entityName) {
                        // If we verified a base certificate ID and/or entity names, it is
                        // okay if we don't understand the digest type. However, if the
                        // only holder identification we have is a hash that we do not
                        // support, we need to return an error.
                        return VAC_UNSUPPORTED_HOLDER_DIGESTED_OBJECT;
                    }
                }
            }
            if (hashBytes) {
                hasher.update(hashBytes);
                const calculatedHashValue = hasher.digest();
                const suppliedHashValue = packBits(holder.objectDigestInfo.objectDigest);
                // TODO: Does this need to be timing-safe? I don't think it does.
                if (!Buffer.compare(calculatedHashValue, suppliedHashValue)) {
                    return VAC_HOLDER_MISMATCH;
                }
            }
        }
        else if (!holder.baseCertificateID && !holder.entityName?.length) {
            // If we verified a base certificate ID and/or entity names, it is
            // okay if we don't understand the digest algorithm. However, if the
            // only holder identification we have is a hash that we do not
            // support, we need to return an error.
            return VAC_UNSUPPORTED_HOLDER_DIGEST;
        }
        // Otherwise, we don't recognize the hash type or digest, but it doesn't
        // matter, because we verified the other holder fields. So do nothing.
    }
    return VAC_OK;
}

/**
 * @summary Determine whether an attribute certificate issuer is trusted.
 * @description
 *
 * This function determines whether an attribute certificate issuer is trusted,
 * including checking whether it is an SOA, if it needs to be.
 *
 * @param ctx The context object
 * @param issuer The `AttCertIssuer`
 * @param trust_anchor A single trust anchor
 * @param soa Whether the trust anchor must be a Source of Authority (SOA)
 * @returns A boolean indicating whether the attribute certificate issuer is trusted
 *
 * @function
 */
function isAttrCertIssuerTrusted (
    ctx: Context,
    issuer: AttCertIssuer,
    trust_anchor: TrustAnchorChoice,
    soa: boolean = false,
): boolean {
    const namingMatcher = getNamingMatcherGetter(ctx);
    let matched: boolean = false;
    const tbs: TBSCertificate | undefined = ("taInfo" in trust_anchor)
        ? trust_anchor.taInfo.certPath?.certificate?.toBeSigned
        : ("certificate" in trust_anchor)
            ? trust_anchor.certificate.toBeSigned
            : trust_anchor.tbsCert;
    if (soa) {
        if (!tbs) {
            return false;
        }
        const is_soa: boolean = tbs.extensions?.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!)) ?? false;
        if (!is_soa) {
            return false;
        }
    }
    if (issuer.baseCertificateID) {
        if (tbs) {
            if (!Buffer.compare(tbs.serialNumber, issuer.baseCertificateID.serial)) {
                return false;
            }
            if (issuer.baseCertificateID.issuerUID && tbs.issuerUniqueIdentifier) {
                const a = issuer.baseCertificateID.issuerUID;
                const b = tbs.issuerUniqueIdentifier;
                const x = Buffer.from(a.buffer, a.byteOffset, a.byteLength);
                const y = Buffer.from(b.buffer, b.byteOffset, b.byteLength);
                if (!Buffer.compare(x, y)) {
                    return false;
                }
            }

            // TODO: When extended Name syntax is supported, compare against other name forms.
            const issuerNames: Name[] = issuer.baseCertificateID.issuer
                .map((iss) => ("directoryName" in iss) ? iss.directoryName : undefined)
                .filter((iss): iss is Name => !!iss)
                .slice(0, 10); // Slice to prevent DoS attacks by large inputs.
            let name_matched: boolean = false;
            const issuer_name = tbs.issuer;
            for (const base_cert_iss_name of issuerNames) {
                if (compareName(issuer_name, base_cert_iss_name, namingMatcher)) {
                    name_matched = true;
                    break;
                }
            }
            if (!name_matched) {
                return false;
            }
            matched = true;
        }
    }
    if (issuer.issuerName) {
        const subjectNames: Name[] = [];
        if (tbs) {
            subjectNames.push(tbs.subject);
            for (const ext of tbs.extensions ?? []) {
                if (!ext.extnId.isEqualTo(subjectAltName["&id"]!)) {
                    continue;
                }
                const el = new DERElement();
                el.fromBytes(ext.extnValue);
                const sans = subjectAltName.decoderFor["&ExtnType"]!(el);
                for (const san of sans) {
                    if ("directoryName" in san) {
                        subjectNames.push(san.directoryName);
                    }
                }
            }
        }
        if (("taInfo" in trust_anchor) && trust_anchor.taInfo.certPath?.taName) {
                subjectNames.push(trust_anchor.taInfo.certPath.taName);
        }
        const iss_names: Name[] = issuer.issuerName
            .map((n) => ("directoryName" in n) ? n.directoryName : undefined)
            .filter((n): n is Name => !!n)
            .slice(0, 10); // Slice to prevent DoS attacks by large inputs.
        let name_matched: boolean = false;
        for (const sn of subjectNames) {
            for (const iss_name of iss_names) {
                if (compareName(sn, iss_name, namingMatcher)) {
                    name_matched = true;
                    break;
                }
            }
            if (name_matched) {
                break;
            }
        }
        if (name_matched) {
            matched = true;
        } else {
            return false;
        }
    }
    if (issuer.objectDigestInfo) {
        const hash_str = digestOIDToNodeHash.get(issuer.objectDigestInfo.digestAlgorithm.algorithm.toString());
        if (hash_str) {
            const hasher = createHash(hash_str);
            let hashBytes: Uint8Array | undefined;
            switch (issuer.objectDigestInfo.digestedObjectType) {
                case (ObjectDigestInfo_digestedObjectType_publicKeyCert): {
                    hashBytes = ("certificate" in trust_anchor)
                        ? (trust_anchor.certificate.originalDER ?? _encode_Certificate(trust_anchor.certificate, DER).toBytes())
                        : (("taInfo" in trust_anchor) && trust_anchor.taInfo.certPath?.certificate)
                            ? trust_anchor.taInfo.certPath.certificate.originalDER
                                ?? _encode_Certificate(trust_anchor.taInfo.certPath.certificate, DER).toBytes()
                            : undefined;
                    break;
                }
                case (ObjectDigestInfo_digestedObjectType_publicKey): {
                    1 + 1; // This bug in TypeScript still exists. I have to put an expression here.
                    if (tbs) {
                        hashBytes = _encode_SubjectPublicKeyInfo(tbs.subjectPublicKeyInfo, DER).toBytes();
                    }
                    break;
                }
                default: {
                    if (!issuer.baseCertificateID && !issuer.issuerName) {
                        // If we verified a base certificate ID and/or entity names, it is
                        // okay if we don't understand the digest type. However, if the
                        // only holder identification we have is a hash that we do not
                        // support, we need to return an error.
                        return false;
                    }
                }
            }
            if (hashBytes) {
                hasher.update(hashBytes);
                const calculatedHashValue = hasher.digest();
                const suppliedHashValue = packBits(issuer.objectDigestInfo.objectDigest);
                // TODO: Does this need to be timing-safe? I don't think it does.
                if (!Buffer.compare(calculatedHashValue, suppliedHashValue)) {
                    return false;
                }
                matched = true;
            }
        }
        else if (!issuer.baseCertificateID && !issuer.issuerName?.length) {
            // If we verified a base certificate ID and/or entity names, it is
            // okay if we don't understand the digest algorithm. However, if the
            // only holder identification we have is a hash that we do not
            // support, we need to return an error.
            return false;
        }
        // Otherwise, we don't recognize the hash type or digest, but it doesn't
        // matter, because we verified the other holder fields. So do nothing.
    }
    return matched;
}

// TODO: Check if the cert path is even interesting at all (e.g. it has a clearance attribute)
// TODO: Option to obtain clearances from the asserted public-key certificates

// AttributeCertificationPath ::= SEQUENCE {
//     attributeCertificate  AttributeCertificate,
//     acPath                SEQUENCE OF ACPathData OPTIONAL,
//     ... }

//   ACPathData ::= SEQUENCE {
//     certificate           [0]  Certificate OPTIONAL,
//     attributeCertificate  [1]  AttributeCertificate OPTIONAL,
//     ... }
// TODO: Report defect: `ACPathData.attributeCertificate` should support multiple ACs, since an entity may obtain priviledge from multiple ACs.
// TODO: Report defect: there should be a constraint to mandate one or the other.

//   - [ ] Verify that, for each certificate, if issuedOnBehalfOf is present, it points to the next AC
//   - [ ] If the issuedOnBehalfOf extension is present, wat do?
//   - [ ] It seems like all intermediary AAs are required to have the indirectIssuer extension
//     - Does this mean that issuedOnBehalfOf always points to the intermediary above the end-entity's issuer?
//     - Isn't this field redundant? Can't you just use the issuer field?
//       - Well, if you didn't have it, might the AC appear to be an end entity cert?
//         - No, because of the basic constraints.
//     - I get it: attribute certificates don't "issue" other attribute certificates. Public key certs do.

//   ACs are always signed by PKCs. AAs are made by associating attributes with a PKC, for which it may then delegate further attribute certificates.
//   - You pretty much treat the attributes of an attribute certificate as though they were simply added to the subjectDirectoryAttributes

// Assume the PKI Path is valid.
/**
 * ## Do not use this function. It is not done.
 *
 * @deprecated This is not fully implemented yet.
 * @param ctx
 * @param acPath
 * @param userPkiPath
 * @param soas
 * @returns
 */
export
async function verifyAttrCertPath (
    ctx: Context,
    acPath: AttributeCertificationPath,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
): Promise<number> {

    // #region validity
    // We start by checking the validity of all certs. It is the least
    // computationally expensive step, and it is the most likely step to fail.
    // So it's an excellent candidate for "short-circuiting" a lot more work.
    const now = new Date();
    if (now < acPath.attributeCertificate.toBeSigned.attrCertValidityPeriod.notBeforeTime) {
        return VAC_NOT_BEFORE;
    }
    if (now > acPath.attributeCertificate.toBeSigned.attrCertValidityPeriod.notAfterTime) {
        return VAC_NOT_AFTER;
    }
    for (const pair of acPath.acPath ?? []) {
        const ac = pair.attributeCertificate;
        const pkc = pair.certificate;
        if (ac) {
            if (now < ac.toBeSigned.attrCertValidityPeriod.notBeforeTime) {
                return VAC_NOT_BEFORE;
            }
            if (now > ac.toBeSigned.attrCertValidityPeriod.notAfterTime) {
                return VAC_NOT_AFTER;
            }
        }
        if (pkc) {
            const nbf = getDateFromTime(pkc.toBeSigned.validity.notBefore);
            const naf = getDateFromTime(pkc.toBeSigned.validity.notAfter);
            if (now < nbf) {
                return VAC_NOT_BEFORE;
            }
            if (now > naf) {
                return VAC_NOT_AFTER;
            }
        }
    }
    // #endregion validity

    // #region noAssertion
    // Technically, end-entity ACs are not supposed to have a noAssertion
    // extension, but we validate this anyway. The presence of noAssertion in
    // AA ACs does not make them invalid: it just means that the AAs cannot
    // assert those attributes: only issue attribute certificates that have
    // them.
    const ac = acPath.attributeCertificate;
    for (const ext of ac.toBeSigned.extensions ?? []) {
        if (!ext.extnId.isEqualTo(noAssertion["&id"]!)) {
            continue;
        }
        return VAC_NO_ASSERTION;
    }
    // #endregion

    // #region trusted_soa
    // This region checks that the attribute certification path originates from an SOA.
    if (acPath.acPath?.length) {
        const soaArc = acPath.acPath[acPath.acPath.length - 1];
        if (soaArc.certificate) {
            const soa = soaArc.certificate;
            const is_soa: boolean = soa?.toBeSigned.extensions
                ?.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!)) ?? false;
            if (!is_soa) {
                return VAC_NO_SOA_CERT;
            }
            const soaBytes = soa.originalDER
                ?? _encode_Certificate(soa, DER).toBytes();
            const trusted: boolean = soas.some((ta) => isCertInTrustAnchor(soa, ta, soaBytes));
            if (!trusted) {
                return VAC_UNTRUSTED_SOA;
            }
        // }
        // else if (soaArc.attributeCertificate) {
        //     // Otherwise, attempt to locate the issuer among the trusted SOAs
        //     // by name and check the signature.
        //     const soa_iss = soaArc.attributeCertificate.toBeSigned.issuer;
        //     const anchor = soas.find((ta) => isAttrCertIssuerTrusted(ctx, soa_iss, ta, true));
        //     if (!anchor) {
        //         return VAC_UNTRUSTED_SOA;
        //     }
        } else {
            // The last arc should only have a PKC, because it is "assigned" any
            // privileges via an attribute certificate. If there is an attribute
            // certificate, it is just ignored.
            return VAC_NO_SOA_CERT;
        }

    } else {
        const soa_iss = acPath.attributeCertificate.toBeSigned.issuer;
        /**
         * We intentionally set this to false, since the SOAs we are searching
         * through are marked as SOAs by fiat.
         */
        const require_soa: boolean = false;
        const anchor = soas.find((ta) => isAttrCertIssuerTrusted(ctx, soa_iss, ta, require_soa));
        if (!anchor) {
            return VAC_UNTRUSTED_SOA;
        }
    }
    // #endregion trusted_soa

    // #region holder2pkc
    // This code region verifies that the holder for every attribute
    // certificate corresponds to the public key certificate.
    {
        const holder = ac.toBeSigned.holder;
        const eeCert: Certificate | undefined = userPkiPath[userPkiPath.length - 1];
        const issuerCert: Certificate | undefined = userPkiPath[userPkiPath.length - 2];
        // const namingMatcher = getNamingMatcherGetter(ctx);
        const holder_result = is_cert_holder(ctx, eeCert, holder, issuerCert);
        if (holder_result !== VAC_OK) {
            return holder_result;
        }
    }

    for (const arc of acPath.acPath ?? []) {
        if (arc.certificate && arc.attributeCertificate) {
            const pkc = arc.certificate;
            const holder = arc.attributeCertificate.toBeSigned.holder;
            const holder_result = is_cert_holder(ctx, pkc, holder);
            if (holder_result !== VAC_OK) {
                return holder_result;
            }
        } else {
            // TODO: If no cert, use attribute certificate to search the DSAIT.
            // TODO: If no attr cert, use the cert to search the DSAIT.
            return VAC_UNUSABLE_AC_PATH;
        }
    }
    // #endregion holder2pkc

    // #region chain_verification
    // In this section, we finally verify the signatures and constraints, etc.
    if (acPath.acPath?.length) {
        // const pmi_path = [ ...acPath.acPath ].reverse();
        // const soa_cert = pmi_path[0]?.certificate;
        // if (!soa_cert) {
        //     return VAC_INTERNAL_ERROR; // Internal error because this was already checked.
        // }
        // let subject =
        const subj_tbs = acPath.attributeCertificate;
        const issuer = acPath.acPath.find((arc) => {
            if (!arc.certificate) {
                return false;
            }
            const cert = arc.certificate;
            // if (subj_tbs.toBeSigned.issuer.baseCertificateID) {

            // }
            // if (subj_tbs.toBeSigned.issuer.)
        })


        // TODO: I'm not actually sure the path has to have an SOA at the end of it...
        // It would be better to arrange the path items in order before performing any evaluation.
        // Then check if the SOA cert is present at the end.
        // If there is no SOA cert, just start i off at 0.


        // let issuer_cert: Certificate = soa_cert;
        // for (let i = 1; i < pmi_path.length; i++) {
        //     const arc = await hydrate_attr_cert_path_arc(pmi_path[i]);
        //     const subj_cert = arc.certificate;
        //     const attr_cert = arc.attributeCertificate;
        //     // TODO: Check that attr_cert is issued by issuer_cert
        //     // TODO: Check that attr_cert has indirectIssuer extension
        //     // TODO:
        // }

        // for (const arc of pmi_path.slice(1)) { // slice(1) because the last arc is the SOA. It is infallible.
        //     if (!arc.certificate || !arc.attributeCertificate) {
        //         // TODO: If no cert, use attribute certificate to search the DSAIT.
        //         // TODO: If no attr cert, use the cert to search the DSAIT.
        //         return VAC_UNUSABLE_AC_PATH;
        //     }
        //     const cert = arc.certificate;
        //     const attr_cert = arc.attributeCertificate;
        //     // We already checked that the attr_cert matches the certificate.
        //     // TODO: Check that the certificate is trusted?
        //     // TODO: Check that the attribute certificate has the indirectIssuer extension.
        // }

        const iobo_ext = acPath.attributeCertificate.toBeSigned.extensions
            ?.find((ext) => ext.extnId.isEqualTo(issuedOnBehalfOf["&id"]!));
        if (!iobo_ext) {
            return VAC_INVALID_DELEGATION;
        }
        const iobo_el = new DERElement();
        iobo_el.fromBytes(iobo_ext.extnValue);
        const iobo = issuedOnBehalfOf.decoderFor["&ExtnType"]!(iobo_el);
        // TODO: Check that iobo
    }
    // #endregion chain_verification

    return VAC_OK;
}


// TODO: Could you just somehow make this recursive to verify a whole path?
// This would require:
// Ensure holder name constraints fall within the issuer's name constraints
// Ensure holder's allowed attribute assignments are a subset of the issuers
// Ensure no loops.
// Ensure indirectIssuer and issuedOnBehalfOf extensions.

// This just verifies a single attribute certificate.

/**
 * @summary Verify a single attribute certificate
 * @description
 *
 * This function verifies a single attribute certificate. It does not support
 * indirect issuance: it does not check the delegation path where an SOA issues
 * an AA beneath it to serve as an indirect issuer.
 *
 * @param ctx The context object
 * @param acert The attribute certificate being verified
 * @param userPkiPath The user PKI path
 * @param soas The trust anchors that can serve as SOAs
 * @returns A promise resolving to a return code
 *
 * @async
 * @function
 */
export
async function verifyAttrCert (
    ctx: MeerkatContext,
    acert: AttributeCertificate,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
): Promise<number> {

    const now = new Date();
    if (now < acert.toBeSigned.attrCertValidityPeriod.notBeforeTime) {
        return VAC_NOT_BEFORE;
    }
    if (now > acert.toBeSigned.attrCertValidityPeriod.notAfterTime) {
        return VAC_NOT_AFTER;
    }

    const acert_bytes = acert.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(acert.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : _encode_TBSAttributeCertificate(acert.toBeSigned).toBytes();

    const acert_hasher = createHash("sha256");
    acert_hasher.update(acert_bytes);
    const acert_hash = acert_hasher.digest().toString("base64");

    const extsGroupedByOID = groupByOID(acert.toBeSigned.extensions ?? [], (ext) => ext.extnId);
    for (const [ extId, exts ] of Object.entries(extsGroupedByOID)) {
        if (exts.length > 1) {
            return VAC_DUPLICATE_EXT;
        }
        const ext = exts[0];
        if (ext.critical && !supportedExtensions.has(extId)) {
            return VAC_UNKNOWN_CRIT_EXT;
        }
        const criticalityMandate = extensionMandatoryCriticality.get(extId);
        if (
            (criticalityMandate !== undefined)
            && (criticalityMandate !== (ext.critical ?? false))
        ) {
            return VAC_INVALID_EXT_CRIT;
        }
    }

    let single_use: boolean = false;
    let group_ac: boolean = false;
    let no_rev_avail: boolean = false;

    for (const ext of acert.toBeSigned.extensions ?? []) {
        // Technically, end-entity ACs are not supposed to have a noAssertion
        // extension, but we validate this anyway. The presence of noAssertion in
        // AA ACs does not make them invalid: it just means that the AAs cannot
        // assert those attributes: only issue attribute certificates that have
        // them.
        if (ext.extnId.isEqualTo(noAssertion["&id"]!)) {
            return VAC_NO_ASSERTION;
        }
        else if (ext.extnId.isEqualTo(singleUse["&id"]!)) {
            if (ctx.alreadyAssertedAttributeCertificates.has(acert_hash)) {
                return VAC_SINGLE_USE;
            }
            single_use = true;
        }
        else if (ext.extnId.isEqualTo(groupAC["&id"]!)) {
            group_ac = true;
        }
        else if (ext.extnId.isEqualTo(noRevAvail["&id"]!)) {
            no_rev_avail = true;
        }
        else if (ext.extnId.isEqualTo(timeSpecification["&id"]!)) {
            const el = new DERElement();
            el.fromBytes(ext.extnValue);
            if (!evaluateTemporalContext(_encode_TimeAssertion({ now: null }, DER), el)) {
                return VAC_INVALID_TIME_SPEC;
            }
        }
        return VAC_NO_ASSERTION;
    }

    if (isRevokedFromConfiguredCRLs(ctx, acert, now, ctx.config.signing)) {
        return VAC_CRL_REVOKED;
    }

    const namingMatcher = getNamingMatcherGetter(ctx);
    const isGroupMember = getIsGroupMember(ctx, namingMatcher);
    const eeCert: Certificate | undefined = userPkiPath[userPkiPath.length - 1];
    if (group_ac) {
        // TODO: Report non-documentation of groupAC procedures.
        const directory_names = acert.toBeSigned.holder.entityName
            ?.flatMap((n) => ("directoryName" in n ? [ n.directoryName ] : [])) ?? [];
        if (directory_names.length !== 1) {
            return VAC_AMBIGUOUS_GROUP;
        }
        const dirname = directory_names[0];
        const groupName = new NameAndOptionalUID(
            dirname.rdnSequence,
            undefined,
        );
        const memberName = new NameAndOptionalUID(
            eeCert.toBeSigned.subject.rdnSequence,
            eeCert.toBeSigned.subjectUniqueIdentifier,
        );
        try {

            const in_group: boolean | undefined = await isGroupMember(groupName, memberName);
            if (!in_group) {
                return VAC_NOT_GROUP_MEMBER;
            }
        } catch (e) {
            // TODO: Log
            return VAC_NOT_GROUP_MEMBER;
        }
    }
    else {
        const holder = acert.toBeSigned.holder;
        const issuerCert: Certificate | undefined = userPkiPath[userPkiPath.length - 2];
        const holder_result = is_cert_holder(ctx, eeCert, holder, issuerCert);
        if (holder_result !== VAC_OK) {
            return holder_result;
        }
    }

    const soa_iss = acert.toBeSigned.issuer;
    /**
     * We intentionally set this to false, since the SOAs we are searching
     * through are marked as SOAs by fiat.
     */
    const require_soa: boolean = false;
    const anchor = soas.find((ta) => isAttrCertIssuerTrusted(ctx, soa_iss, ta, require_soa));
    if (!anchor) {
        return VAC_UNTRUSTED_SOA;
    }
    let issuerName: Name | undefined;
    let spki!: SubjectPublicKeyInfo;
    let issuer_exts: Extension[] | undefined;
    if ("certificate" in anchor) {
        issuerName = anchor.certificate.toBeSigned.subject;
        spki = anchor.certificate.toBeSigned.subjectPublicKeyInfo;
        issuer_exts = anchor.certificate.toBeSigned.extensions;
    }
    else if ("tbsCert" in anchor) {
        issuerName = anchor.tbsCert.subject;
        spki = anchor.tbsCert.subjectPublicKeyInfo;
        issuer_exts = anchor.tbsCert.extensions;
    }
    else {
        issuerName = anchor.taInfo.certPath?.taName;
        spki = anchor.taInfo.pubKey;
        issuer_exts = anchor.taInfo.exts;
    }
    const valid_signature: boolean | undefined = verifyAltSignature(acert, issuer_exts)
        ?? verifySignature(
            acert_bytes,
            acert.algorithmIdentifier,
            packBits(acert.signature),
            spki,
        );
    if (valid_signature === false) {
        return VAC_INVALID_SIGNATURE;
    }
    if (valid_signature === undefined) {
        return VAC_INVALID_SIGNATURE;
    }

    const signing_cert_path = ctx.config.signing.certPath;
    const signing_cert = signing_cert_path
        ? signing_cert_path[signing_cert_path.length - 1]
        : undefined;

    const sanExt = (signing_cert?.toBeSigned.extensions ?? [])
        .find((ext) => ext.extnId.isEqualTo(subjectAltName["&id"]!));
    let sans: GeneralName[] = [];
    if (sanExt) {
        const el = new DERElement();
        el.fromBytes(sanExt.extnValue);
        sans = subjectAltName.decoderFor["&ExtnType"]!(el);
    }

    for (const ext of acert.toBeSigned.extensions ?? []) {
        if (ext.extnId.isEqualTo(targetingInformation["&id"]!)) {
            if (!signing_cert) {
                return VAC_INVALID_TARGET;
            }
            const el = new DERElement();
            el.fromBytes(ext.extnValue);
            const target_groups = targetingInformation.decoderFor["&ExtnType"]!(el);
            let matched_target: boolean = false;
            for (const group of target_groups) {
                for (const target of group) {
                    // Target ::= CHOICE {
                    //     targetName   [0]  GeneralName,
                    //     targetGroup  [1]  GeneralName,
                    //     targetCert   [2]  TargetCert,
                    //     ... }
                    if (
                        ("targetName" in target)
                        && general_name_matches_cert(ctx, signing_cert, target.targetName, sans)
                    ) {
                        matched_target = true;
                        break;
                    }
                    else if ("targetGroup" in target) {
                        if (!("directoryName" in target.targetGroup)) {
                            continue;
                        }
                        const memberName = new NameAndOptionalUID(
                            signing_cert.toBeSigned.subject.rdnSequence,
                            signing_cert.toBeSigned.subjectUniqueIdentifier,
                        );
                        const groupName = new NameAndOptionalUID(
                            target.targetGroup.directoryName.rdnSequence,
                            undefined,
                        );
                        const dsa_in_group: boolean | undefined = await isGroupMember(groupName, memberName);
                        if (!dsa_in_group) {
                            matched_target = true;
                            break;
                        }
                    }
                    else if ("targetCert" in target) {
                        // TargetCert ::= SEQUENCE {
                        //     targetCertificate  IssuerSerial,
                        //     targetName         GeneralName OPTIONAL,
                        //     certDigestInfo     ObjectDigestInfo OPTIONAL }
                        const tcert = target.targetCert.targetCertificate;
                        const tname = target.targetCert.targetName;
                        if (
                            tcert
                            && compare_issuer_serial(ctx, tcert, get_issuer_serial_from_cert(signing_cert))
                        ) {
                            matched_target = true;
                        }
                        if (tname && !general_name_matches_cert(ctx, signing_cert, tname, sans)) {
                            matched_target = false;
                        }
                        if (
                            target.targetCert.certDigestInfo
                            && !object_digest_matches_cert(signing_cert, target.targetCert.certDigestInfo)
                        ) {
                            matched_target = false;
                        }
                        if (matched_target) {
                            break;
                        }
                    }
                }
                if (matched_target) {
                    break;
                }
            }
            if (!matched_target) {
                return VAC_INVALID_TARGET;
            }
        }
    }

    if (!no_rev_avail && issuerName) {
        const aiaExt = extsGroupedByOID[authorityInfoAccess["&id"]!.toString()]?.[0];
        if (aiaExt) {
            const ocspCheckiness = ctx.config.signing.bindOverrides?.ocspCheckiness
                ?? ctx.config.signing.ocspCheckiness;
            if (ocspCheckiness >= 0) {
                const ocspResult = await checkOCSP(
                    ctx,
                    aiaExt,
                    [ issuerName, spki ],
                    acert.toBeSigned.serialNumber,
                    ctx.config.tls,
                );
                if (ocspResult) {
                    return ocspResult;
                }
            }
        }

        const crldpExt = extsGroupedByOID[cRLDistributionPoints["&id"]!.toString()]?.[0];
        if (crldpExt && crldpExt.critical) { // TODO: Make config options: ignore_critical or always_check.
            const readDispatcher = getReadDispatcher(ctx);
            const crlResult = await checkRemoteCRLs(
                ctx,
                crldpExt,
                acert.toBeSigned.serialNumber,
                [ issuerName, spki ],
                readDispatcher,
                ctx.config.signing,
            );
            if (crlResult) {
                return crlResult;
            }
        }

    }

    if (single_use) {
        if (ctx.alreadyAssertedAttributeCertificates.size > 100_000) {
            /* Yes, this does mean that some singleUse certs can be re-used,
            if they are valid but happen to be the 100000th asserted, but this
            will be infrequent. */
            ctx.alreadyAssertedAttributeCertificates.clear();
        }
        ctx.alreadyAssertedAttributeCertificates.add(acert_hash);
    }
    return VAC_OK;
}
