import { Buffer } from "node:buffer";
import {
    Context,
    IndexableOID,
} from "../types/index.js";
import {
    PkiPath,
} from "@wildboar/pki-stub";
import {
    ACPathData,
    AttributeCertificate,
    AttributeCertificationPath,
    basicAttConstraints,
    BasicAttConstraintsSyntax,
    DisplayText,
    groupAC,
    noAssertion,
    noRevAvail,
    singleUse,
    targetingInformation,
    timeSpecification,
    userNotice,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareGeneralName,
    compareIssuerSerial,
    compareName,
} from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { Name } from "@wildboar/pki-stub";
import { Certificate, _encode_Certificate } from "@wildboar/pki-stub";
import { AAIssuingDistPointSyntax, aAissuingDistributionPoint, GeneralNames, issuerAltName } from "@wildboar/x500/CertificateExtensions";
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
    DistributionPoint,
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
import { evaluateTemporalContext } from "@wildboar/x500/matching/context";
import { _encode_TimeAssertion, NameAndOptionalUID, TimeAssertion } from "@wildboar/x500/SelectedAttributeTypes";
import getIsGroupMember from "../authz/getIsGroupMember.js";
import { crlCurl } from "./crlCurl.js";
import { checkRemoteCRLs, getReadDispatcher, VCP_RETURN_CRL_REVOKED, VCP_RETURN_CRL_UNREACHABLE, VCP_RETURN_OK } from "./verifyCertPath.js";
import isPrefix from "../x500/isPrefix.js";

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
export const VAC_PATH_TOO_LONG: number = -31;
export const VAC_VIOLATED_BASIC_CONSTRAINTS_CA: number = -32;
export const VAC_VIOLATED_BASIC_CONSTRAINTS_PATH_LEN: number = -33;
export const VAC_GROUP_AC_ON_AA: number = -34;
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

function indexCerts(acPath: ACPathData[]): [Map<string, Certificate[]>, Map<string, Certificate[]>] {
    const certsBySerialNumberLowerHex: Map<string, Certificate[]> = new Map();
    const certsByKeyIdLowerHex: Map<string, Certificate[]> = new Map();
    for (const arc of acPath) {
        if (!arc.certificate) {
            continue;
        }
        const cert = arc.certificate;
        const serialNumber = cert.toBeSigned.serialNumber;
        const exts = (cert.toBeSigned.extensions ?? []);
        const skiExt = exts
            .find((ext) => ext.extnId.isEqualTo(subjectKeyIdentifier["&id"]!))
            ?.extnValue;

        // certsBySerialNumberLowerHex.set(serialNumber.toString("hex"), cert);
        const key1 = Buffer.from(
            serialNumber.buffer,
            serialNumber.byteOffset,
            serialNumber.byteLength,
        ).toString("hex");
        const bySerial = certsBySerialNumberLowerHex.get(key1);
        if (bySerial) {
            bySerial.push(cert);
        } else {
            certsBySerialNumberLowerHex.set(key1, [cert]);
        }

        if (skiExt) {
            try {
                const skiEl = new DERElement();
                if (skiEl.fromBytes(skiExt) !== skiExt.length) {
                    continue; // Malformed extension.
                }
                const ski = subjectKeyIdentifier.decoderFor["&ExtnType"]!(skiEl);
                const key2 = Buffer.from(
                    ski.buffer,
                    ski.byteOffset,
                    ski.byteLength,
                ).toString("hex");
                const byKeyId = certsByKeyIdLowerHex.get(key2);
                if (byKeyId) {
                    byKeyId.push(cert);
                } else {
                    certsByKeyIdLowerHex.set(key2, [cert]);
                }
            } catch {
                continue;
            }
        }
    }
    return [certsBySerialNumberLowerHex, certsByKeyIdLowerHex];
}

function displayTextToString (dt: DisplayText): string | null {
    if ("visibleString" in dt) {
        return dt.visibleString;
    }
    if ("bmpString" in dt) {
        return dt.bmpString;
    }
    if ("utf8String" in dt) {
        return dt.utf8String;
    }
    return null;
}

export
async function verifyAttrCertPath2 (
    ctx: MeerkatContext,
    userACPath: AttributeCertificationPath,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
    trustAnchors: TrustAnchorList,
    timeOfCheck: Date,
    previouslyAsserted: boolean = false,
): Promise<number> {
    if (soas.length === 0) {
        return VAC_UNTRUSTED_SOA;
    }

    const acPath = userACPath.acPath ?? [];
    if (acPath.length > 100) {
        return VAC_PATH_TOO_LONG;
    }
    if (acPath.filter((arc) => arc.attributeCertificate).length > 10) {
        return VAC_PATH_TOO_LONG;
    }

    const [certsBySerialNumberLowerHex, certsByKeyIdLowerHex] = indexCerts(acPath);
    const namingMatcher = getNamingMatcherGetter(ctx);

    // This only has to be done once here as a boundary condition.
    let current_holder_pki_path: PkiPath | undefined = [ ...userPkiPath ];
    let current_ac: AttributeCertificate | null = userACPath.attributeCertificate;
    let iteration = 0;
    while (current_holder_pki_path && current_ac) {
        const on_end_entity = iteration === 0;
        let no_rev_avail = false;
        let authority = false;
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
        const eeCert = current_holder_pki_path[current_holder_pki_path.length - 1];
        const is_soa = eeCert
            .toBeSigned.extensions
            ?.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!)) ?? false;

        const isPubKeyCertTrusted = false; // TODO: Implement this.
        if (is_soa && isPubKeyCertTrusted) {
            return VAC_UNTRUSTED_SOA;
        }

        // #region validate_extensions

        // TODO: Handle role certificates.

        const current_ac_exts = current_ac.toBeSigned.extensions ?? [];
        for (const ext of current_ac_exts) {
            try {
                if (ext.extnId.isEqualTo(noAssertion["&id"]!)) {
                    return VAC_NO_ASSERTION;
                }
                if (ext.extnId.isEqualTo(singleUse["&id"]!) && previouslyAsserted) {
                    return VAC_SINGLE_USE;
                }

                const extEl = new DERElement();
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    return VAC_INVALID_EXT_CRIT;
                }

                // TODO: Document that it is not clear whether this applies to roles or not. Is a role a group?
                if (ext.extnId.isEqualTo(groupAC["&id"]!)) {
                    if (!on_end_entity) {
                        return VAC_GROUP_AC_ON_AA;
                    }
                    // Yes, this is the correct procedure:
                    // ITU-T Recommendation X.509 (2019), Section 16.4.1, says
                    // that the group is the subtree of the DIT.
                    const groups = (current_ac!.toBeSigned.holder.entityName ?? [])
                        .filter((n) => "directoryName" in n)
                        .map((n) => n.directoryName.rdnSequence)
                        ;
                    const matched = groups
                        .some((group) => isPrefix(ctx, group, eeCert.toBeSigned.subject.rdnSequence));
                    if (!matched) {
                        return VAC_NOT_GROUP_MEMBER;
                    }
                }
                else if (ext.extnId.isEqualTo(userNotice["&id"]!)) {
                    const notices = userNotice.decoderFor["&ExtnType"]!(extEl);
                    for (const notice of notices) {
                        const serial = Buffer.from(
                            current_ac!.toBeSigned.serialNumber.buffer,
                            current_ac!.toBeSigned.serialNumber.byteOffset,
                            current_ac!.toBeSigned.serialNumber.byteLength,
                        ).toString("hex");
                        const nums = notice.noticeRef?.noticeNumbers;
                        const org = notice.noticeRef?.organization
                            ? (displayTextToString(notice.noticeRef.organization) ?? "?").slice(0, 200)
                            : "";
                        const text = notice.explicitText
                            ? (displayTextToString(notice.explicitText) ?? "?").slice(0, 200)
                            : ""
                        ctx.log.debug(ctx.i18n.t("log:user_notice_ext", {
                            context: "ac",
                            serial,
                            text,
                        }), {
                            serial,
                            text,
                            org,
                            nums,
                        });
                    }
                }
                else if (ext.extnId.isEqualTo(timeSpecification["&id"]!)) {
                    const assertion: TimeAssertion = { at: timeOfCheck };
                    const encodedAssertion = _encode_TimeAssertion(assertion, DER);
                    if (!evaluateTemporalContext(encodedAssertion, extEl)) {
                        return VAC_INVALID_TIME_SPEC;
                    }
                }
                else if (ext.extnId.isEqualTo(noRevAvail["&id"]!)) {
                    no_rev_avail = true;
                }
                else if (ext.extnId.isEqualTo(basicAttConstraints["&id"]!)) {
                    const bacons = basicAttConstraints.decoderFor["&ExtnType"]!(extEl);
                    authority = bacons.authority
                        ?? BasicAttConstraintsSyntax._default_value_for_authority;
                    if (on_end_entity) {
                        continue;
                    }
                    if (!authority) {
                        return VAC_VIOLATED_BASIC_CONSTRAINTS_CA;
                    }
                    const max_intermediate_aas = bacons.pathLenConstraint
                        ?? Number.MAX_SAFE_INTEGER;
                    const intermediate_aas_count = iteration - 1;
                    if (intermediate_aas_count > max_intermediate_aas) {
                        return VAC_VIOLATED_BASIC_CONSTRAINTS_PATH_LEN;
                    }
                }
                else if (ext.extnId.isEqualTo(targetingInformation["&id"]!)) {
                    const targetingInfo = targetingInformation.decoderFor["&ExtnType"]!(extEl);
                    const targets = targetingInfo.flatMap(g => g);
                    let matched = false;
                    for (const target of targets) {
                        if ("targetName" in target) {
                            const myname = { directoryName: ctx.dsa.accessPoint.ae_title };
                            if (compareGeneralName(target.targetName, myname, namingMatcher)) {
                                matched = true;
                                break;
                            }
                        }
                        else if ("targetGroup" in target) {
                            if ("directoryName" in target.targetGroup) {
                                const isGroupMember = getIsGroupMember(ctx, namingMatcher);
                                const groupName = new NameAndOptionalUID(
                                    target.targetGroup.directoryName.rdnSequence,
                                    undefined,
                                );
                                const myname = new NameAndOptionalUID(
                                    ctx.dsa.accessPoint.ae_title.rdnSequence,
                                    undefined,
                                );
                                // TODO: Make this search configurable.
                                // TODO: Maybe use a read operation instead?
                                const inGroup = await isGroupMember(groupName, myname);
                                if (inGroup) {
                                    matched = true;
                                    break;
                                }
                            }
                        }
                        else if ("targetCert" in target) {
                            if (!ctx.config.signing.certPath?.length) {
                                continue;
                            }
                            // Compare to this DSA's signing certificate
                            const myEECert = ctx.config.signing.certPath[ctx.config.signing.certPath.length - 1];
                            const myIssuerSerial = new IssuerSerial(
                                [
                                    {
                                        directoryName: myEECert.toBeSigned.issuer,
                                    },
                                ],
                                myEECert.toBeSigned.serialNumber,
                                myEECert.toBeSigned.issuerUniqueIdentifier,
                            );
                            const matchedIssuerSerial = compareIssuerSerial(
                                target.targetCert.targetCertificate,
                                myIssuerSerial,
                                namingMatcher,
                            );
                            if (matchedIssuerSerial) {
                                matched = true;
                                break;
                            }
                        }
                    }
                    if (!matched) {
                        return VAC_INVALID_TARGET;
                    }
                }

            } catch (e) {
                // TODO: Log
                return VAC_INTERNAL_ERROR;
            }
        }

        // #endregion validate_extensions

        const holder = actbs.holder;
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
                certsBySerialNumberLowerHex,
                certsByKeyIdLowerHex,
                trustAnchors,
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
                certsBySerialNumberLowerHex,
                certsByKeyIdLowerHex,
                trustAnchors,
                10,
            );
            issuer_ac = issuer_ac_data.attributeCertificate;
        }

        // #endregion hydrate_issuer_ac_data
    
        if (!issuer_pki_path?.length) {
            // We could not build a verifiable PKI or PMI path for the issuer.
            return VAC_UNUSABLE_AC_PATH;
        }
        const issuer_pkc = issuer_pki_path[issuer_pki_path.length - 1];
        // Verify the signature on the attribute certificate.
        const issuer_cert_path = new CertificationPath(
            issuer_pkc,
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

        // TODO: Verify all attribute descriptor certificates (Section 17.3.2.2.1), then index the descriptors.
        // TODO: Verify that all attribute descriptor certs are issued directly by a trusted SOA.
        // TODO: If any fail verification, only identical values for those attributes may be delegated.
        // TODO: For all that succeed, look up the privilege policy to obtain an ordering matcher and check that all assigned values are allowed.
        // TODO: Define built-in privilege policies for comparing clearance values.
        // TODO: Make it configurable which privilege policies compare clearance values like the default.    
        
        // TODO: Fetch all role specification certs.
        // TODO: Separately verify each role specification certificate delegation path.
        // TODO: For each role the entity is assigned, associate the role's attributes, and include these in verifying the delegation.
    
        // TODO: acceptablePrivilegePolicies
        // TODO: attributeDescriptor
        // TODO: roleSpecCertIdentifier
        // TODO: delegatedNameConstraints
        // TODO: holderNameConstraints (basically same as delegatedNameConstraints, just opposite)
        // TODO: acceptableCertPolicies (verify that, for each PKI path, one of these policies is fulfilled, and that all inferior PKI paths do too)
        // TODO: authorityAttributeIdentifier (no action needed, always non-critical)
        // TODO: indirectIssuer (verify that all intermediaries have it)
        // TODO: issuedOnBehalfOf (verify that it points to the next AA)
        // TODO: allowedAttributeAssignments
        // TODO: attributeMappings
        for (const ext of current_ac_exts) {
            const extEl = new DERElement();
            try {
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    continue; // Malformed extension.
                }
            } catch {
                continue; // Malformed extension.
            }
            if (
                !no_rev_avail
                && ext.extnId.isEqualTo(aAissuingDistributionPoint["&id"]!)
                && ext.critical // TODO: Make config options: ignore_critical or always_check.
            ) {
                const dp = aAissuingDistributionPoint.decoderFor["&ExtnType"]!(extEl);
                const on_end_entity = iteration === 0;
                const containsUserAttributeCerts = dp.containsUserAttributeCerts
                    ?? AAIssuingDistPointSyntax._default_value_for_containsUserAttributeCerts;
                const containsAACerts = dp.containsAACerts
                    ?? AAIssuingDistPointSyntax._default_value_for_containsAACerts;
                if (on_end_entity && !containsUserAttributeCerts) {
                    continue;
                }
                if (!on_end_entity && !containsAACerts) {
                    continue;
                }
                const issuerName = issuer_pkc.toBeSigned.issuer;
                const spki = issuer_pkc.toBeSigned.subjectPublicKeyInfo;
                // I don't think I have to do anything for containsSOAPublicKeyCerts.
                // The certs themselves have their own revocation information.
                const readDispatcher = getReadDispatcher(ctx);
                const aaDistPoint = aAissuingDistributionPoint.decoderFor["&ExtnType"]!(extEl)
                const distPoint = new DistributionPoint(
                    aaDistPoint.distributionPoint,
                    aaDistPoint.onlySomeReasons,
                    undefined,
                );
                const crlResult = await checkRemoteCRLs(
                    ctx,
                    [ distPoint ],
                    current_ac!.toBeSigned.serialNumber,
                    [ issuerName, spki ],
                    readDispatcher,
                    {
                        ...ctx.config.signing,
                        // TODO: Set options
                    },
                );
                if (crlResult === VCP_RETURN_CRL_REVOKED) {
                    return VAC_CRL_REVOKED;
                }
                if (crlResult === VCP_RETURN_CRL_UNREACHABLE) {
                    return VAC_RETURN_CRL_UNREACHABLE;
                }
                if (crlResult !== VCP_RETURN_OK) {
                    return VAC_INTERNAL_ERROR;
                }
                // Otherwise, the CRL was valid. Continue.
            }
        }

        current_ac = issuer_ac;
        current_holder_pki_path = issuer_pki_path;
        iteration++;
    }

    return VAC_OK;
}
