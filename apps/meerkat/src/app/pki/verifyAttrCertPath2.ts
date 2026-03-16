import { Buffer } from "node:buffer";
import {
    Context,
    IndexableOID,
} from "../types/index.js";
import {
    PkiPath,
} from "@wildboar/pki-stub";
import {
    AttributeCertificate,
    AttributeCertificationPath,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareGeneralName,
    compareName,
} from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { Name } from "@wildboar/pki-stub";
import { Certificate, _encode_Certificate } from "@wildboar/pki-stub";
import { GeneralNames, issuerAltName } from "@wildboar/x500/CertificateExtensions";
import { BOOLEAN, DERElement, packBits } from "@wildboar/asn1";
import { subjectAltName } from "@wildboar/x500/CertificateExtensions";
import { digestOIDToNodeHash } from "./digestOIDToNodeHash.js";
import { createHash } from "node:crypto";
import {
    ObjectDigestInfo_digestedObjectType_publicKeyCert,
    ObjectDigestInfo_digestedObjectType_publicKey,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import { DER } from "@wildboar/asn1/functional";
import { _encode_SubjectPublicKeyInfo } from "@wildboar/pki-stub";
import { Holder } from "@wildboar/pki-stub";
import { sOAIdentifier } from "@wildboar/x500/AttributeCertificateDefinitions";
import { TrustAnchorList } from "@wildboar/tal";
import { AttCertIssuer } from "@wildboar/pki-stub";
import { IssuerSerial } from "@wildboar/pki-stub";
import { ObjectDigestInfo } from "@wildboar/pki-stub";
import type { MeerkatContext } from "../ctx.js";
import {
    cRLDistributionPoints,
    authorityKeyIdentifier,
    _decode_AltSignatureAlgorithm,
    altSignatureAlgorithm,
    altSignatureValue,
    subjectKeyIdentifier,
} from "@wildboar/x500/CertificateExtensions";
import {
    authorityInfoAccess,
    subjectInfoAccess,
    id_ad_caIssuers,
} from "@wildboar/x500/PkiPmiExternalDataTypes";
import { CertificatePair, CertificationPath, Extension } from "@wildboar/x500/AuthenticationFramework";
import { _encode_AlgorithmIdentifier } from "@wildboar/pki-stub";
import { _encode_TBSAttributeCertificate } from "@wildboar/pki-stub";
import util from "node:util";
import { strict as assert } from "node:assert";
import { resolvePkiPath } from "./resolvePkiPath.js";
import { getInfoForNextCertInPath, getInfoForNextCertInPath2 } from "./getInfoForNextCertInPath.js";
import { verifySIGNED } from "./verifySIGNED.js";
import { acertCurl } from "./acertCurl.js";
import lookupAttrCertViaX500 from "./lookupAttrCertViaX500.js";

export const VAC_OK: number = 0;
export const VAC_NOT_BEFORE: number = -1;
export const VAC_NOT_AFTER: number = -2;
export const VAC_MISSING_BASE_CERT: number = -3;
export const VAC_AC_PKC_MISMATCH: number = -4;
const VAC_UNSUPPORTED_DIGEST: number = -5;
export const VAC_UNSUPPORTED_DIGESTED_OBJECT: number = -6;
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
export const VAC_MALFORMED_PUB_KEY_CERT: number = -29;
export const VAC_DUBIOUS_CERT_PATH: number = -30;
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

// This is designed to be used for comparing both attribute certificate issuers
// and holders to public key certificates.
export
function compare_attr_cert_to_pk_cert (
    ctx: Context,
    pkc: Certificate,
    ac_base_cert_id: IssuerSerial | undefined,
    ac_entity_name: GeneralNames | undefined,
    ac_object_digest_info: ObjectDigestInfo | undefined,
): boolean | undefined {
    const namingMatcher = getNamingMatcherGetter(ctx);
    if (!ac_base_cert_id && !ac_entity_name && !ac_object_digest_info) {
        return false; // Don't match if there are no criteria at all.
    }
    if (ac_base_cert_id) {
        if (!Buffer.compare(pkc.toBeSigned.serialNumber, ac_base_cert_id.serial)) {
            return false;
        }
        if (ac_base_cert_id.issuerUID && pkc.toBeSigned.issuerUniqueIdentifier) {
            const a = ac_base_cert_id.issuerUID;
            const b = pkc.toBeSigned.issuerUniqueIdentifier;
            const x = Buffer.from(a.buffer, a.byteOffset, a.byteLength);
            const y = Buffer.from(b.buffer, b.byteOffset, b.byteLength);
            if (!Buffer.compare(x, y)) {
                return false;
            }
        }

        const issuerNames: Name[] = ac_base_cert_id.issuer
            .map((iss) => ("directoryName" in iss) ? iss.directoryName : undefined)
            .filter((iss): iss is Name => !!iss)
            ;
            // TODO: Do this after comparing the main issuer name.
            // .slice(0, 10); // Slice to prevent DoS attacks by large inputs.
        let name_matched: boolean = false;
        for (const base_cert_iss_name of issuerNames) {
            if (compareName(pkc.toBeSigned.issuer, base_cert_iss_name, namingMatcher)) {
                name_matched = true;
                break;
            }
        }
        // Do not use issuerAltName or subjectAltName.
        if (!name_matched) {
            return false;
        }
    }
    if (ac_entity_name) {
        const subjectNames: Name[] = [ pkc.toBeSigned.subject ];
        for (const ext of pkc.toBeSigned.extensions ?? []) {
            if (!ext.extnId.isEqualTo(subjectAltName["&id"]!)) {
                continue;
            }
            const el = new DERElement();
            if (el.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                return false; // Malformed extension.
            }
            const sans = subjectAltName.decoderFor["&ExtnType"]!(el).slice(0, 5);
            for (const san of sans) {
                if ("directoryName" in san) {
                    subjectNames.push(san.directoryName);
                }
            }
        }
        const ens: Name[] = ac_entity_name
            .map((n) => ("directoryName" in n) ? n.directoryName : undefined)
            .filter((n): n is Name => !!n)
            .slice(0, 100); // Slice to prevent DoS attacks by large inputs.
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
            return false;
        }
    }
    if (ac_object_digest_info) {
        const hash_str = digestOIDToNodeHash.get(ac_object_digest_info.digestAlgorithm.algorithm.toString());
        if (!hash_str) {
            if (!ac_base_cert_id && !ac_entity_name?.length) {
                // If we verified a base certificate ID and/or entity names, it is
                // okay if we don't understand the digest algorithm. However, if the
                // only holder identification we have is a hash that we do not
                // support, we need to return an error.
                return undefined;
            }
            // Otherwise, we don't recognize the hash type or digest, but it doesn't
            // matter, because we verified the other holder fields. So do nothing.
            return true;
        }
        const hasher = createHash(hash_str);
        let hashBytes: Uint8Array | undefined;
        switch (ac_object_digest_info.digestedObjectType) {
            case (ObjectDigestInfo_digestedObjectType_publicKeyCert): {
                hashBytes = pkc.originalDER ?? _encode_Certificate(pkc, DER).toBytes();
                break;
            }
            case (ObjectDigestInfo_digestedObjectType_publicKey): {
                hashBytes = _encode_SubjectPublicKeyInfo(pkc.toBeSigned.subjectPublicKeyInfo, DER).toBytes();
                break;
            }
            default: {
                if (!ac_base_cert_id && !ac_entity_name) {
                    // If we verified a base certificate ID and/or entity names, it is
                    // okay if we don't understand the digest type. However, if the
                    // only holder identification we have is a hash that we do not
                    // support, we need to return an error.
                    return undefined;
                }
            }
        }
        assert(hashBytes);
        hasher.update(hashBytes);
        const calculatedHashValue = hasher.digest();
        const suppliedHashValue = packBits(ac_object_digest_info.objectDigest);
        if (!Buffer.compare(calculatedHashValue, suppliedHashValue)) {
            return false;
        }
    }
    return true;
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
export
function is_cert_holder (
    ctx: Context,
    eeCert: Certificate,
    holder: Holder,
): boolean | undefined {
    return compare_attr_cert_to_pk_cert(
        ctx,
        eeCert,
        holder.baseCertificateID,
        holder.entityName,
        holder.objectDigestInfo,
    );
}

export
function is_cert_issuer (
    ctx: Context,
    issuerCert: Certificate,
    issuerAc: AttCertIssuer,
): boolean | undefined {
    return compare_attr_cert_to_pk_cert(
        ctx,
        issuerCert,
        issuerAc.baseCertificateID,
        issuerAc.issuerName,
        issuerAc.objectDigestInfo,
    );
}

export
function is_acert_issuer (
    ctx: Context,
    issuerAttrCert: AttributeCertificate,
    holderAttrCert: AttributeCertificate,
): boolean | undefined {
    if (
        !holderAttrCert.toBeSigned.issuer.issuerName?.length
        || !issuerAttrCert.toBeSigned.holder.entityName?.length
    ) {
        return undefined; // Not really comparable.
    }
    const names_from_subject = holderAttrCert.toBeSigned.issuer.issuerName;
    const names_from_issuer = issuerAttrCert.toBeSigned.holder.entityName;
    // WARNING: O(n^2) time complexity, but bounded.
    for (const nfs of names_from_subject.slice(0, 10)) {
        for (const nfi of names_from_issuer.slice(0, 10)) {
            if (compareGeneralName(nfs, nfi, getNamingMatcherGetter(ctx))) {
                return true;
            }
        }
    }
    return false;
}

export
async function verifyAttrCertPath2 (
    ctx: MeerkatContext,
    userACPath: AttributeCertificationPath,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
    timeOfCheck: Date,
): Promise<number> {
    if (soas.length === 0) {
        return VAC_UNTRUSTED_SOA;
    }

    // TODO: Bail out if the PKI or PMI paths are too long.
    // TODO: Verify PKI path of user

    // This only has to be done once here as a boundary condition.
    let current_holder_pki_path: PkiPath | undefined = [ ...userPkiPath ];
    let current_ac: AttributeCertificate | null = userACPath.attributeCertificate;
    const acPath = userACPath.acPath ?? [];
    while (current_holder_pki_path && current_ac) {
        if (current_holder_pki_path.length === 0) {
            return VAC_MISSING_BASE_CERT; // TODO: Is this the right error?
        }
        const actbs = current_ac.toBeSigned;
        if (timeOfCheck < actbs.attrCertValidityPeriod.notBeforeTime) {
            return VAC_NOT_BEFORE;
        }
        if (timeOfCheck > actbs.attrCertValidityPeriod.notAfterTime) {
            return VAC_NOT_AFTER;
        }
        const holder = actbs.holder;
        const eeCert = current_holder_pki_path[current_holder_pki_path.length - 1];
        const holder_result = is_cert_holder(ctx, eeCert, holder);
        if (!holder_result) {
            if (holder_result === undefined) {
                return VAC_UNSUPPORTED_DIGESTED_OBJECT;
            }
            return VAC_AC_PKC_MISMATCH;
        }
        
        /* We need the attribute certificate. There is no way, if given a PKI
        alone, to unambiguously resolve an attribute certificate. */
        const issuer_ac_data = acPath.find((arc) => (
            (arc.attributeCertificate || arc.certificate)
            && (
                ( // Do cert comparison first: better performance and more likely.
                    arc.certificate
                    && is_cert_issuer(ctx, arc.certificate, current_ac!)
                )
                || (
                    arc.attributeCertificate
                    && is_acert_issuer(ctx, arc.attributeCertificate, current_ac!))
                )
            )
        );

        let exts: Extension[] = current_ac.toBeSigned.extensions ?? [];
        if (!issuer_ac_data) {
            // FIXME: This error does not make sense if we haven't iterated at least once.
            // This means we didn't trust the highest up issuer we found.
            return exts.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!))
                ? VAC_UNTRUSTED_SOA
                : VAC_NO_SOA_CERT;
        }

        // #region hydrate_issuer_ac_data

        let issuer_pki_path: PkiPath | null = null;
        let issuer_ac: AttributeCertificate | null = null;
        if (issuer_ac_data.certificate) {
            const info = getInfoForNextCertInPath(issuer_ac_data.certificate);
            const next_pki_path = await resolvePkiPath(
                ctx,
                false,
                info,
                new Map(), // TODO: Populate this (blocked on hydrating the AC path with AAs)
                new Map(), // TODO: Populate this
                soas, // TODO: Rename this variable
                10,
            );
            next_pki_path?.push(issuer_ac_data.certificate);
            issuer_pki_path = next_pki_path;
            if (!issuer_ac_data.attributeCertificate) {
                /* If the arc does not have an AC, we check the remaining arcs
                for a matching AC. We don't have to check all of them--just
                the ones that come after issuer_ac_data, because we already
                checked the ones prior for a matching AC. */
                const i = acPath.findIndex((arc) => arc === issuer_ac_data);
                const issuer_cert = issuer_ac_data.certificate;
                const arc_with_ac = (i > -1)
                    ? acPath.slice(i).find((arc) => (
                        arc.attributeCertificate
                        && (
                            is_cert_holder(ctx, issuer_cert, arc.attributeCertificate.toBeSigned.holder)
                            || is_acert_issuer(ctx, arc.attributeCertificate, current_ac!)
                        )
                    ))
                    : undefined;
                issuer_ac = arc_with_ac?.attributeCertificate ?? null;
                if (!issuer_ac) {
                    const aias = (current_ac.toBeSigned.extensions ?? [])
                        .filter((ext) => ext.extnId.isEqualTo(authorityInfoAccess["&id"]!))
                        .flatMap((ext) => {
                            const el = new DERElement();
                            try {
                                if (el.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                                    return []; // Malformed extension.
                                }
                                return authorityInfoAccess.decoderFor["&ExtnType"]!(el);
                            } catch {
                                return []; // Malformed extension.
                            }
                        })
                        .filter((aia) => aia.accessMethod.isEqualTo(id_ad_caIssuers))
                        ;
                    for (const aia of aias) {
                        const loc = aia.accessLocation;
                        if ("directoryName" in loc) {
                            const dirName = loc.directoryName;
                            const acert = await lookupAttrCertViaX500(
                                ctx,
                                dirName,
                                false,
                                undefined,
                                {
                                    // TODO: Set options
                                },
                            );
                            if (acert) {
                                issuer_ac = acert;
                                break;
                            }
                        }
                        else if ("uniformResourceIdentifier" in loc) {
                            const urlStr = loc.uniformResourceIdentifier.trim();
                            const url = new URL(urlStr);
                            const acert = await acertCurl(url);
                            if (acert) {
                                issuer_ac = acert;
                                break;
                            }
                        }
                    }
                }
                if (!issuer_ac) {
                    // We were unable to look up / fetch the attribute certificate.
                    return VAC_UNUSABLE_AC_PATH;
                }
            }
        } else {
            assert(issuer_ac_data.attributeCertificate);
            /* If we do not have the issuer's PKC already, we have to use the
            attribute certificate to find the full PKI path. */
            const info = getInfoForNextCertInPath2(issuer_ac_data.attributeCertificate);
            issuer_pki_path = await resolvePkiPath(
                ctx,
                true,
                info,
                new Map(), // TODO: Populate this
                new Map(), // TODO: Populate this
                soas, // TODO: Rename this variable
                10,
            );
            issuer_ac = issuer_ac_data.attributeCertificate;
        }

        // #endregion hydrate_issuer_ac_data
    
        if (!issuer_pki_path?.length) {
            // We could not build a verifiable PKI or PMI path for the issuer.
            return VAC_UNUSABLE_AC_PATH;
        }
        // Verify the signature on the attribute certificate.
        const issuer_cert_path = new CertificationPath(
            issuer_pki_path[issuer_pki_path.length - 1],
            issuer_pki_path.slice(0, -1)
                .map((cert) => new CertificatePair(cert, undefined))
                .reverse(),
        );
        try {
            await verifySIGNED(
                ctx,
                undefined,
                issuer_cert_path,
                {
                    absent: null,
                },
                undefined,
                current_ac,
                _encode_TBSAttributeCertificate,
                false,
                "result", // TODO: Define an "acert" context.
            );
        } catch (e) {
            if (process.env.MEERKAT_LOG_JSON !== "1") {
                ctx.log.debug(util.inspect(e));
            }
            // TODO: Log
            return VAC_DUBIOUS_CERT_PATH;
        }

        const issuer_is_soa = issuer_ac
            ?.toBeSigned
            .extensions
            ?.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!));
        if (issuer_is_soa) {
            break; // No further verification is needed.
        }

        current_ac = issuer_ac;
        current_holder_pki_path = issuer_pki_path;
    }

    // TODO: Verify that the attribute assignment is allowed.
    return VAC_OK;
}

// Ensure holder name constraints fall within the issuer's name constraints
// Ensure holder's allowed attribute assignments are a subset of the issuers
// Ensure no loops.
// Ensure indirectIssuer and issuedOnBehalfOf extensions.
