import { Buffer } from "node:buffer";
import {
    Context,
    IndexableOID,
} from "../types/index.js";
import {
    _decode_UnboundedDirectoryString,
    Attribute_valuesWithContext_Item,
    GeneralName,
    PkiPath,
} from "@wildboar/pki-stub";
import {
    ACPathData,
    AttributeCertificate,
    AttributeCertificationPath,
    attributeDescriptor,
    basicAttConstraints,
    BasicAttConstraintsSyntax,
    delegatedNameConstraints,
    DisplayText,
    groupAC,
    holderNameConstraints,
    HolderNameConstraintsSyntax,
    indirectIssuer,
    noAssertion,
    noRevAvail,
    role,
    roleSpecCertIdentifier,
    type RoleSyntax,
    singleUse,
    targetingInformation,
    timeSpecification,
    userNotice,
    issuedOnBehalfOf,
    attributeMappings,
    AttributeMappings,
    AttributeMappings_Item,
    AttributeMappings_Item_typeValueMappings,
    AllowedAttributeAssignments,
    allowedAttributeAssignments,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareElements,
    compareGeneralName,
    compareIssuerSerial,
    compareName,
    directoryStringToString,
    gnWithinGeneralSubtree,
    groupByOID,
    prepString,
    type EqualityMatcher,
} from "@wildboar/x500";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { Name } from "@wildboar/pki-stub";
import { Certificate, _encode_Certificate } from "@wildboar/pki-stub";
import { AAIssuingDistPointSyntax, aAissuingDistributionPoint, GeneralNames, GeneralSubtree, issuerAltName, nameConstraints, NameConstraintsSyntax } from "@wildboar/x500/CertificateExtensions";
import { ASN1Element, ASN1TagClass, ASN1UniversalType, BOOLEAN, DERElement, packBits } from "@wildboar/asn1";
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
import { Attribute, AttributeType, AttributeTypeAndValue } from "@wildboar/x500/InformationFramework";
import applyMappingsToAttributes from "../pmi/applyMappingsToAttributes.js";

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
export const VAC_MALFORMED_EXTENSION: number = -35;
export const VAC_NAME_CONSTRAINT_VIOLATION: number = -36;
export const VAC_NAME_CONSTRAINT_CHECK_DOS: number = -37;
export const VAC_NOT_INDIRECT_ISSUER: number = -38;
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

function dumbAttributeValueIndexer (value: ASN1Element): string {
    return Buffer.from(value.toBytes()).toString("hex");
}

const DS_STRING_TAGS = new Set([
    ASN1UniversalType.printableString,
    ASN1UniversalType.utf8String,
    ASN1UniversalType.teletexString,
    ASN1UniversalType.bmpString,
    ASN1UniversalType.universalString,
]);

/**
 * This implementation does not do anything smarter than normalizing strings
 * per X.520 prepstring and normalizing their casing. `NumericString` is
 * normalized by removing all whitespace characters.
 */
function attributeValueIndexer (_: AttributeType, value: ASN1Element): string {
    if (value.tagClass !== ASN1TagClass.universal) {
        return dumbAttributeValueIndexer(value);
    }
    if (DS_STRING_TAGS.has(value.tagNumber)) {
        const ds = _decode_UnboundedDirectoryString(value);
        const s = directoryStringToString(ds).trim();
        const ps = prepString(s);
        return ps?.toLowerCase() ?? s.toLowerCase();
    }
    if (value.tagNumber === ASN1UniversalType.ia5String) {
        const s = value.ia5String;
        const ps = prepString(s);
        return ps?.toLowerCase() ?? s.toLowerCase();
    }
    if (value.tagNumber === ASN1UniversalType.numericString) {
        const s = value.numericString;
        return s.trim().replaceAll(" ", "");
    }
    return dumbAttributeValueIndexer(value);
}

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

function generalNameWithinNameConstraints(
    gn: GeneralName,
    nc: NameConstraintsSyntax,
    namingMatcher: (attributeType: AttributeType) => EqualityMatcher | undefined,
): boolean {
    for (const subtree of nc.excludedSubtrees ?? []) {
        if (gnWithinGeneralSubtree(gn, subtree, namingMatcher)) {
            return false;
        }
    }
    return (nc.permittedSubtrees ?? [])
        .some((subtree) => gnWithinGeneralSubtree(gn, subtree, namingMatcher));
}

function getNameFormKey(gn: GeneralName): string | undefined {
    if ("otherName" in gn) {
        return gn.otherName.directReference?.toString();
    } else if (gn instanceof ASN1Element) {
        return undefined; // Unrecognized name form.
    } else {
        return Object.keys(gn)[0];
    }
}

function attributeCertificateWithinNameConstraints(
    ac: AttributeCertificate,
    pkc: Certificate,
    nc: NameConstraintsSyntax,
    namingMatcher: (attributeType: AttributeType) => EqualityMatcher | undefined,
    exclusive: boolean = false,
): boolean | undefined {
    // TODO: Report this?
    /* This is not technically part of the requirements of this
    extension, but we check it because it is possible to issue
    attribute certificates that do not use the entity name at
    all, so malicious issuers could still issue attribute
    certificates outside of the constraints. */
    const subject_gn: GeneralName = { directoryName: pkc.toBeSigned.subject };
    const checkPKCSubject: boolean = !exclusive
        /* If exclusive, we only check the subject name if one of the permitted
        subtrees is a directoryName-form GeneralName. This is because the
        holderNameConstraints extension is not meant to be checked against the
        public key certificate's subject name, and therefore might not include
        a directoryName-form GeneralName, but, of course, the public key
        certificate _always_ does. */
        || ((nc.permittedSubtrees
            ?.some((subtree) => "directoryName" in subtree.base)) ?? false);

    if (checkPKCSubject &&!generalNameWithinNameConstraints(subject_gn, nc, namingMatcher)) {
        return false;
    }

    const subject_entity_names = ac.toBeSigned.holder.entityName ?? [];
    const difficulty = (
        subject_entity_names.length
        * (
            (nc.permittedSubtrees?.length ?? 0)
            + (nc.excludedSubtrees?.length ?? 0)
        )
    );
    /* Denial-of-service prevention, since the loop below runs with
    O(n^2) time complexity. There is no easy way to handle this,
    since this is not only a many-to-many comparison, but a
    many-to-many _substring_ comparison, basically. */
    if (difficulty > 100) {
        return undefined;
    }
    const permissibleNameForms: Set<string> = new Set();
    if (exclusive) {
        for (const subtree of nc.permittedSubtrees ?? []) {
            const key = getNameFormKey(subtree.base);
            if (!key) {
                /* See ITU-T Recommendation X.509 (2019), Section 17.6.2.3:

                "Conformant implementations are not required to recognize all
                possible name forms. If a privilege verifier does not recognize
                a name form used in any base component and [...] that name form
                does not occur in the holder component of a subsequent
                attribute certificate in the chain, then this name form can be
                ignored.

                That's why this here is a continue, but if you search for
                9c5ed0b0-4e5e-47b1-b98d-61dc07759ec2, you'll see a return. */
                continue;
            }
            permissibleNameForms.add(key);
        }
    }
    for (const entityName of subject_entity_names) {
        if (exclusive) {
            const key = getNameFormKey(entityName);
            if (!key || !permissibleNameForms.has(key)) {
                // Search 9c5ed0b0-4e5e-47b1-b98d-61dc07759ec2 for commentary.
                return false; // Unrecognized or not-permitted name form.
            }
        }
        if (!generalNameWithinNameConstraints(entityName, nc, namingMatcher)) {
            return false;
        }
    }
    return true;
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
    /* This is pretty generous, because many of these could be attribute
    descriptor certificates or role specification certificates or other
    things like that. */
    if (acPath.filter((arc) => arc.attributeCertificate).length > 30) {
        return VAC_PATH_TOO_LONG;
    }

    const [certsBySerialNumberLowerHex, certsByKeyIdLowerHex] = indexCerts(acPath);
    const namingMatcher = getNamingMatcherGetter(ctx);

    // This only has to be done once here as a boundary condition.
    let current_holder_pki_path: PkiPath | undefined = [ ...userPkiPath ];
    let current_ac: AttributeCertificate | null = userACPath.attributeCertificate;
    const ordered_path: [ AttributeCertificate, PkiPath ][] = [ [ current_ac, current_holder_pki_path ] ];
    let iteration = 0;

    let allowed_attr_assignments: AllowedAttributeAssignments | undefined;

    while (current_holder_pki_path && current_ac) {
        if (iteration > 10) { // TODO: Make this configurable.
            return VAC_PATH_TOO_LONG;
        }
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
                    return VAC_MALFORMED_EXTENSION;
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
        const issuer_ee_cert = issuer_pki_path[issuer_pki_path.length - 1];
        // Verify the signature on the attribute certificate.
        const issuer_cert_path = new CertificationPath(
            issuer_ee_cert,
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

        // TODO: Verify all attribute descriptor certificates (Section 17.3.2.2.1), then index the descriptors.
        // TODO: Verify that all attribute descriptor certs are issued directly by a trusted SOA.
        // TODO: If any fail verification, only identical values for those attributes may be delegated.
        // TODO: For all that succeed, look up the privilege policy to obtain an ordering matcher and check that all assigned values are allowed.
        // TODO: Define built-in privilege policies for comparing clearance values.
        // TODO: Make it configurable which privilege policies compare clearance values like the default.
        // TODO: What about conflicting ADCs?

        // TODO: Fetch all role specification certs.
        // TODO: Separately verify each role specification certificate delegation path.
        // TODO: For each role the entity is assigned, associate the role's attributes, and include these in verifying the delegation.
        // "A role specification attribute certificate cannot be delegated to any other entity"
        // Actually, I think role expansion gets done at the end, basically after this function is totally done.
        // Being permitted to assign all of the role's attributes does not give an AA permission to assign the role membership itself.
        // So at the end, if the whole chain is valid, you can expand the roles on just the EE cert.
        // TODO: What about conflicting ADCs?

        // TODO: issuedOnBehalfOf

        /* issuedOnBehalfOf handling:
        - Find the delegator's ACPathData.
        - Verify that the indirect issuer was issued by the same SOA as the delegator.

        "The indirect issuer extension is used in either an attribute certificate or a public-key certificate issued to a DS server by an SOA."
        "The issuer of this attribute certificate must have been granted the privilege to issue ACs on behalf of other AAs by an
SOA, through the IndirectIssuer extension in its attribute certificate"
        So it seems like an indirect issuer is always directly issued by an SOA. So you can use the issuer field to know who the SOA should be.

        If the issuer is an indirect issuer, call verifyAttrCertPath2 with the issuer.
        If that returns ok, then continue evaluating the chain using the issuedOnBehalfOf AA.

        // TODO: acceptableCertPolicies (verify that, for each PKI path, one of these policies is fulfilled, and that all inferior PKI paths do too)
        1. Get the verify cert path result from verifySIGNED
        2. Check that the intersection of authorities_constrained_policies and
           user_constrained_policies contains contains one of the acceptable
           policies.
        3. For the AC issuer, iteratively, take the intersection with all
           previously effective policies: these are the policies that every
           attribute certificate encountered thus far complies with.
        4. If an accceptableCertPolicies extension has a policy that is not
           in this intersection, it means that there was at least one path link
           that was not compliant with that policy.

        // TODO: acceptablePrivilegePolicies
        For this one, I think you want to take a rolling intersection of the
        acceptable privilege policies and just make sure the constrained set
        never becomes empty, meaning that the PMI chain is invalid since the
        AAs produced a set that is unsatisfiable. Maybe you can make an argument
        to this function where the caller can supply the used privilege policies
        and compare those against the acceptable set.

        // ~~attributeMappings~~
        WARNING: This is a dangerous extension. A nefarious subordinate AA could
        use it to map a lower-valued privilege to a higher-valued one.
        I have decided that this extension will be honored, but only if it is
        issued directly by the trusted SOA. This avoids problems of transitive
        mapping or nefarious mapping by deeper AAs (e.g. mapping lower to higher
        privilege values). `allowedAttributeAssignments` extension should ALWAYS
        be used with RoA like this; it is just too dangerous without this.
        ... actually, maybe not. Maybe just honor this at every level.
        (Maybe you could just implement this, then implement tests to see if it
        can be hacked.)
        I think the procedure will look something like this:
        1. If the issuer AC / PKC is not a trusted SOA, reject this deep mapping.
        1. Copy a reference to the current attribute certificate's attributes.
        2. If the extension exists in the subject's AC, map the attributes and
           add the new attribute values without removing the ones that were
           mapped.
        // TODO: Report the security problem to the ITU.

        // TODO: allowedAttributeAssignments
        I think all you really have to check is that the end-entity AC complies
        with all of the allowed attribute assignments. Beyond this, you just
        have to make sure that each encountered AAA is a subset of those granted
        to the superior AA. The specification does not clarify if attribute
        values that are of lesser privilege are implicitly allowed, but I don't
        think they should be: I think this extension should be as strict as
        possible so that the remote SOA (or one of its subordinate AAs) can play
        tricks by redefining domination rules.
        // TODO: Report this problem to the ITU.

        */

        const mappedAttributes: Attribute[] = [];

        // #region verify_extensions_in_subject_ac_requiring_issuer
        for (const ext of current_ac_exts) {
            const extEl = new DERElement();
            try {
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    return VAC_MALFORMED_EXTENSION;
                }
            } catch {
                return VAC_MALFORMED_EXTENSION;
            }
            // authorityAttributeIdentifier: no action needed, always non-critical
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
                const issuerName = issuer_ee_cert.toBeSigned.issuer;
                const spki = issuer_ee_cert.toBeSigned.subjectPublicKeyInfo;
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
            else if (ext.extnId.isEqualTo(attributeMappings["&id"]!)) {
                /* Even though this extension was defined for being inserted
                into SOA certificates, I don't think it is a problem if this
                transformation is applied to end-entities or anything else. */
                const am = attributeMappings.decoderFor["&ExtnType"]!(extEl);
                const attributesMap = groupByOID(current_ac.toBeSigned.attributes, (a) => a.type_);
                const mapped = applyMappingsToAttributes(
                    attributesMap,
                    am,
                    attributeValueIndexer,
                    getNamingMatcherGetter(ctx),
                    true,
                );
                for (const attr of mapped) {
                    mappedAttributes.push(attr);
                }
            }
        }
        // #endregion verify_extensions_in_subject_ac_requiring_issuer

        if (!on_end_entity /* && !indirect_issuer */) {
            // An intermediary AA did not have an indirectIssuer extension.
            // FIXME: I am not sure this condition is correct.
            return VAC_NOT_INDIRECT_ISSUER;
        }

        // #region verify_extensions_in_issuer_ac_requiring_subject
        const issuer_ac_exts = issuer_ac?.toBeSigned.extensions ?? [];
        for (const ext of issuer_ac_exts) {
            const extEl = new DERElement();
            try {
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    return VAC_MALFORMED_EXTENSION;
                }
            } catch {
                return VAC_MALFORMED_EXTENSION;
            }
            // TODO: In cert verification, is it possible for subject cert to have broader name constraints?

            if (ext.extnId.isEqualTo(indirectIssuer["&id"]!)) {
                // The issuer is an indirect issuer.
                // TODO: Set this issuer's issuer to the expected SOA.
                // TODO: Obtain the issuedOnBehalfOf ACPathData and continue from there.
            }
            // authorityAttributeIdentifier: no action needed, always non-critical
            /*
            All of these have the same syntax and both apply exactly the
            same to both the AC and PKC, except that holderNameConstraints
            requires permittedSubtrees and is exclusive to other name forms.

            Also, note that, the way that name constraints are evaluated means
            that each name constraint extension is checked against all inferior
            certificates. Fortunately, this means that you do not have to
            implement code to check if name constraints in inferior
            certificates are a subset of those in the superior certificate, but
            it does introduce another O(n^2) time complexity problem, which is
            solved by limiting the length of the path.
            */
            if (
                ext.extnId.isEqualTo(delegatedNameConstraints["&id"]!)
                || ext.extnId.isEqualTo(nameConstraints["&id"]!)
                || ext.extnId.isEqualTo(holderNameConstraints["&id"]!)
            ) {
                /* The holderNameConstraints syntax differs from the others only
                by requiring permittedSubtrees, so nameConstraints will suffice
                for decoding all of them, then we can just code a few specifics
                for holderNameConstraints. */
                const nc = nameConstraints.decoderFor["&ExtnType"]!(extEl);
                for (const [ ac, pkip ] of ordered_path) {
                    const pkc = pkip[pkip.length - 1];
                    if (!pkc) {
                        return VAC_INTERNAL_ERROR;
                    }
                    const hnc = ext.extnId.isEqualTo(holderNameConstraints["&id"]!);
                    if (hnc && !nc.permittedSubtrees?.length) {
                        // holderNameConstraints must have at least one permitted subtree.
                        return VAC_MALFORMED_EXTENSION;
                    }
                    const complies = attributeCertificateWithinNameConstraints(
                        ac,
                        pkc,
                        nc,
                        namingMatcher,
                        hnc,
                    );
                    if (complies === false) {
                        return VAC_NAME_CONSTRAINT_VIOLATION;
                    }
                    if (complies === undefined) {
                        return VAC_NAME_CONSTRAINT_CHECK_DOS;
                    }
                }
            }
            if (ext.extnId.isEqualTo(allowedAttributeAssignments["&id"]!)) {
                const aaa = allowedAttributeAssignments.decoderFor["&ExtnType"]!(extEl);
                // TODO: Check that all attribute assignments are allowed (really only has to be done for the EE acert)
                // TODO: Check that the previous allowed_attr_assignments is an improper subset
                // TODO: Make sure that the attributes allowed check is done even if the issuer doesn't have this extension!
            }
        }
        // #endregion verify_extensions_in_issuer_ac_requiring_subject

        // #region verify_extensions_in_issuer_pkc_requiring_subject
        const issuer_pkc_exts = issuer_ee_cert?.toBeSigned.extensions ?? [];
        for (const ext of issuer_pkc_exts) {
            const extEl = new DERElement();
            try {
                if (extEl.fromBytes(ext.extnValue) !== ext.extnValue.length) {
                    return VAC_MALFORMED_EXTENSION;
                }
            } catch {
                return VAC_MALFORMED_EXTENSION;
            }
            if (ext.extnId.isEqualTo(delegatedNameConstraints["&id"]!)) {
                // TODO: This should be the same code as above.
            }
        }
        // #endregion verify_extensions_in_issuer_pkc_requiring_subject

        // TODO: Also break if the issuer is trusted as an SOA.
        const issuer_is_soa = issuer_ac
            ?.toBeSigned
            .extensions
            ?.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!));
        if (issuer_is_soa) {
            break; // No further verification is needed.
        }

        current_ac = issuer_ac;
        issuer_ac && ordered_path.push([ issuer_ac, issuer_pki_path ]);
        current_holder_pki_path = issuer_pki_path;
        iteration++;
    }

    // TODO: Check that the SOA is trusted.
    // TODO: Verify domination via attributeDescriptor

    return VAC_OK;
}
