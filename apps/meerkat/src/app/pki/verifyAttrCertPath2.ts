import { Buffer } from "node:buffer";
import {
    Context,
    IndexableOID,
    PrivilegeComparator,
} from "../types/index.js";
import {
    _decode_UnboundedDirectoryString,
    Attribute_valuesWithContext_Item,
    GeneralName,
    PkiPath,
    Context as X500Context,
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
    AttributeDescriptorSyntax,
    acceptablePrivilegePolicies,
    acceptableCertPolicies,
    Targets,
} from "@wildboar/x500/AttributeCertificateDefinitions";
import {
    compareAlgorithmIdentifier,
    compareElements,
    compareGeneralName,
    compareGeneralNames,
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
import { AAIssuingDistPointSyntax, aAissuingDistributionPoint, GeneralNames, GeneralSubtree, issuerAltName, nameConstraints, NameConstraintsSyntax, anyPolicy, PolicyInformation } from "@wildboar/x500/CertificateExtensions";
import { ASN1Element, ASN1TagClass, ASN1UniversalType, BOOLEAN, DERElement, OBJECT_IDENTIFIER, ObjectIdentifier, packBits } from "@wildboar/asn1";
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
import { aaaIsImproperSubset, checkAttributeAssignments } from "../pmi/aaaIsImproperSubset.js";
import defaultPrivilegeComparator from "../pmi/defaultPrivilegeComparator.js";
import isCertInTrustAnchor from "./isCertInTrustAnchor.js";

/*
TODO: For OID Sets and Maps make a wrapper type that takes OIDs and translates
commonly used prefixes into integers.
I don't think it incurs the heterogeneous types cost. Map<number | string, T>
should be about as fast as Map<string, T>.
*/

export const VAC_OK: number = 0;
export const VAC_NOT_BEFORE: number = -1;
export const VAC_NOT_AFTER: number = -2;
export const VAC_EMPTY_PKI_PATH: number = -3;
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
export const VAC_ATTR_DESC_CONFLICT: number = -39;
export const VAC_ATTR_DELEGATION_VIOLATION: number = -40;
export const VAC_DUPLICATE_ATTR: number = -41;
export const VAC_UNACCEPTABLE_PRIV_POLICY: number = -42;
export const VAC_INVALID_CERT_POLICY: number = -43;
export const VAC_RETURN_OCSP_REVOKED: number = -102;
export const VAC_RETURN_OCSP_OTHER: number = -103;
export const VAC_RETURN_CRL_REVOKED: number = -104;
export const VAC_RETURN_CRL_UNREACHABLE: number = -105;
export const VAC_AAA_VIOLATION: number = -106;

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
    return Buffer.from(value.toBytes()).toString("latin1");
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

// TODO: Move to @wildboar/x500 or perhaps @wildboar/pki-stub?
function compareContextLists(
    a: X500Context[],
    b: X500Context[],
): boolean {
    if (a.length !== b.length) {
        return false; // The contexts did not match exactly.
    }
    const asorted = [ ...a ]
        .sort((a, b) => a.contextType.toString().localeCompare(b.contextType.toString()));
    const bsorted = [ ...b ]
        .sort((a, b) => a.contextType.toString().localeCompare(b.contextType.toString()));
    for (let i = 0; i < asorted.length; i++) {
        const ctxa = asorted[i];
        const ctxb = bsorted[i];
        if (!ctxa.contextType.isEqualTo(ctxb.contextType)) {
            return false; // The contexts did not match exactly.
        }
        // Actually, they could differ in length if they have
        // duplicate values, too, which is not semantically a problem,
        // but it is not technically allowed. Since this code is
        // expected to be used in verifying PMI delegation (and the
        // usage of contexts is likely to be rare anyway), we are going
        // to be virtuously strict, so incorrectness of this sort is not
        // allowed to propagate through the AA delegation path.
        if (ctxa.contextValues.length !== ctxb.contextValues.length) {
            return false; // The contexts did not match exactly.
        }
        const fallbacka = ctxa.fallback ?? X500Context._default_value_for_fallback;
        const fallbackb = ctxb.fallback ?? X500Context._default_value_for_fallback;
        if (fallbacka !== fallbackb) {   
            return false; // The fallback did not match exactly.
        }
        const avalues: Set<string> = new Set();
        for (const v of ctxa.contextValues) {
            const buf = v.toBytes();
            // latin1 is fastest: it basically turns the bytes directly into a string.
            // I'm not sure if it allocates a new buffer under the hood or not.
            // TODO: Refactor this whole ternary + toString() trick into a function.
            const key = (Buffer.isBuffer(buf)
                ? buf
                : Buffer.from(
                    buf.buffer,
                    buf.byteOffset,
                    buf.byteLength,
                )).toString("latin1");
            avalues.add(key);
        }
        for (const v of ctxb.contextValues) {
            const buf = v.toBytes();
            const key = (Buffer.isBuffer(buf)
                ? buf
                : Buffer.from(
                    buf.buffer,
                    buf.byteOffset,
                    buf.byteLength,
                )).toString("latin1");
            if (!avalues.has(key)) {
                return false; // The context values did not match exactly.
            }
            // Remove this so duplicates fail.
            avalues.delete(key);
        }
        if (avalues.size > 0) {
            return false; // The context values did not match exactly.
        }
    }
    return true; // No differences were found.
}

// TODO: Move to @wildboar/x500 or perhaps @wildboar/pki-stub?
function hashAttributeValue(value: ASN1Element): string {
    const buf = value.toBytes();
    return (Buffer.isBuffer(buf)
        ? buf
        : Buffer.from(
            buf.buffer,
            buf.byteOffset,
            buf.byteLength,
        )).toString("latin1");
}

// TODO: Move to @wildboar/x500 or perhaps @wildboar/pki-stub?
function isAttributeDelegationAllowedDumb(
    delegated_attr: Attribute,
    delegating_attr: Attribute,
): boolean {
    // Hash the values of the delegating attribute into a Map<string, Context[]>.
    const delegating_values_map: Map<string, X500Context[]> = new Map();
    for (const delegating_value of delegating_attr.values) {
        const key = hashAttributeValue(delegating_value);
        delegating_values_map.set(key, []);
    }
    for (const delegating_value of delegating_attr.valuesWithContext ?? []) {
        const key = hashAttributeValue(delegating_value.value);
        delegating_values_map.set(key, delegating_value.contextList);
    }
    for (const delegated_value of delegated_attr.values) {
        const key = hashAttributeValue(delegated_value);
        const existing = delegating_values_map.get(key);
        if (!existing) {
            return false;
        }
        if (existing.length > 0) {
            return false; // The delegating value had contexts, but this one does not.
        }
    }
    for (const delegated_vwc of delegated_attr.valuesWithContext ?? []) {
        const key = hashAttributeValue(delegated_vwc.value);
        const delegatingContextList = delegating_values_map.get(key);
        if (!delegatingContextList) {
            return false;
        }
        const contexts_matched = compareContextLists(
            delegated_vwc.contextList,
            delegatingContextList,
        );
        if (!contexts_matched) {
            return false;
        }
    }
    return true;
}

// TODO: Move to @wildboar/x500 or perhaps @wildboar/pki-stub?
/**
 * @description
 * 
 * The delegating AA may have attribute values that are both above and below
 * the privilege of the delegated attribute value. We, therefore, should not
 * fail just because. We only need to check that each delegated attribute value
 * has a corresponding delegating attribute value that is at least as
 * privileged.
 * 
 * @param delegated_attr 
 * @param delegating_attr 
 * @param comparator 
 * @returns 
 */
function isAttributeDelegationAllowed(
    delegated_attr: Attribute,
    delegating_attr: Attribute,
    comparator: PrivilegeComparator,
): boolean {

    const delegated_values_count = delegated_attr.values.length
        + (delegated_attr.valuesWithContext?.length ?? 0);
    const delegating_values_count = delegating_attr.values.length
        + (delegating_attr.valuesWithContext?.length ?? 0);
    const complexity = delegated_values_count * delegating_values_count;
    if (complexity > 100) {
        // This is O(n^2) time complexity. Fall back on hash-based dumb comparison.
        return isAttributeDelegationAllowedDumb(delegated_attr, delegating_attr);
    }

    // Check that all context-less values were permitted by other context-less values.
    for (const delegated_value of delegated_attr.values) {
        let matched = false;
        for (const delegating_value of delegating_attr.values) {
            const cmp_result = comparator(delegated_attr.type_, delegated_value, delegating_value);
            if (cmp_result === undefined || cmp_result === null || cmp_result < 0) {
                continue;
            }
            // TODO: Test the heck out of this. I'm not sure this is the right logic.
            matched = true;
            break;
        }
        if (!matched) {
            return false;
        }
    }

    // Check that contextual values were permitted by any delegating values, contextual or not.
    for (const delegated_vwc of delegated_attr.valuesWithContext ?? []) {
        let matched = false;

        // Check context-less values.
        // It is assumed that an AA with delegation powers for a given
        // attribute value will also have delegation powers for itself or
        // inferior values that are constrained by contexts.
        for (const delegating_value of delegating_attr.values) {
            const cmp_result = comparator(delegated_attr.type_, delegated_vwc.value, delegating_value);
            if (cmp_result === undefined || cmp_result === null || cmp_result < 0) {
                continue;
            }
            // TODO: Test the heck out of this. I'm not sure this is the right logic.
            matched = true;
            break;
        }

        // Check contextual values.
        if (!matched) {
            for (const delegating_vwc of delegating_attr.valuesWithContext ?? []) {
                const cmp_result = comparator(delegated_attr.type_, delegated_vwc.value, delegating_vwc.value);
                if (cmp_result === undefined || cmp_result === null || cmp_result < 0) {
                    continue;
                }
                // TODO: Implement OID sorting functions in asn1-ts.
                const contexts_matched = compareContextLists(
                    delegated_vwc.contextList,
                    delegating_vwc.contextList,
                );
                if (!contexts_matched) {
                    continue;
                }
                matched = true;
                break;
            }
        }
        if (!matched) {
            return false;
        }
    }
    return false;
}

export interface VerifyAttrCertOpts {
    /**
     * The time to use for verification. Defaults to now.
     */
    timeOfCheck?: Date;
    /**
     * Whether the attribute certificate was previously asserted.
     */
    previouslyAsserted?: boolean;
    /**
     * The privilege policies according to which the end-entity attribute
     * certificate must be valid. The end entity certificate must be valid for
     * one or more of these privilege policies, or verification fails.
     */
    privilegePolicies?: OBJECT_IDENTIFIER[];
    /**
     * Targets against which the PMI assertion is verified. In particular, this
     * is compared against values of the `targetingInformation` X.509v3
     * extension, if present.
     */
    targets?: Targets;
}

// TODO: I think this could return the index of the accepted privilege policy as well.
// TODO: Make this function an async iterator?
// TODO: Add caching

export interface VerifyAttrCertYield {
    attributeCertificate: AttributeCertificate;
    pkiPath: PkiPath;
}

function verifyAttrCert(
    ctx: MeerkatContext,
    userACPath: AttributeCertificationPath,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
    trustAnchors: TrustAnchorList,
    opts: VerifyAttrCertOpts = {},
    on_end_entity: boolean = false,
): number {
    return VAC_OK;
}

// IETF RFC 5755 can be useful for gleaning information that isn't obvious
// in ITU Rec. X.509:
// > Note: [X.509-2000] defines the extension syntax as a "SEQUENCE OF
// > Targets".  Conforming AC issuer implementations MUST only produce one
// > "Targets" element.  Conforming AC users MUST be able to accept a
// > "SEQUENCE OF Targets".  If more than one Targets element is found in
// > an AC, the extension MUST be treated as if all Target elements had
// > been found within one Targets element.

// TODO: Assume that elements of acPath are ordered just like CertificationPath.
// It was my opinion that this was the correct interpretation and LLMs independently
// arrived at the same conclusion. This is virtuous strictness. And since my
// implementation is probably the only one that will ever exist, I will be strict.
// This code is already convoluted and slow enough. Nefarious users should not be
// able to submit mis-ordered delegation paths and make this code do all the work
// in re-ordering the certs correctly.
// My original thought was that the acPathData could include role specification
// certificates and attribute descriptor certificates, but I have since decided
// against both of these decisions. These should not be supplied as a part of
// the user inputs for bandwidth, efficiency, and security purposes. Once
// defined, the description of an attribute does not change (or should not).
// Roles could change, but those are still likely to be cached, and get handled
// outside of this function (basically "not my problem").
// Basically, I don't see a good reason for `AttributeCertificationPath` to
// contain anything but the delegation path, in order.

/* TODO: Document issuedOnBehalfOf handling:

Actually, do none of this. An indirectly-issued acert uses the same
exact verification procedures unless the issuer does not have an
improper superset of the privileges of the acert it issued. This
is a bizarre situation. There is not a single reason I can think of
for why you would want to do this. The noAssertion extension already
blocks the DS server itself from asserting those privileges.

I do think, in Meerkat DSA's case, you have to fail verification if
the IOBO extension is marked as critical. Because Meerkat DSA is not
going to check this.

The ordering of attr certs in AttributeCertPath seems to conflict with
the idea of "branching" delegation paths that need verification.
Verifying this would require calling this function multiple times for
each branch.

And if this function is turned into an async iterator, the caller
could just execute a separate verification chain for the DS issuer,
so this stupid scenario is handled in that case anyway.

- Find the delegator's ACPathData.
- Verify that the indirect issuer was issued by the same SOA as the delegator.

"The indirect issuer extension is used in either an attribute certificate or
a public-key certificate issued to a DS server by an SOA."
"The issuer of this attribute certificate must have been granted the
privilege to issue ACs on behalf of other AAs by an SOA, through the
IndirectIssuer extension in its attribute certificate"
So it seems like an indirect issuer is always directly issued by an SOA.
So you can use the issuer field to know who the SOA should be.

If the issuer is an indirect issuer, call verifyAttrCertPath2 with the issuer.
If that returns ok, then continue evaluating the chain using the issuedOnBehalfOf AA.

Actually, indirectIssuer and issuedOnBehalfOf do not matter at all
unless the DS server does not itself possess all of the attributes
necessary. I don't know why you would even do this. This is a really
stupid use case. So dumb, I consider not even supporting it.
*/

// Document: this function does not expand roles. The caller, if needed, must expand roles to permissions.
// TODO: Document that the caller must also expand groups.
// The caller can trust that, if this returns VAC_OK, all roles in the EE attribute certificate are valid, however.
export
async function* verifyAttrCertPath2 (
    ctx: MeerkatContext,
    userACPath: AttributeCertificationPath,
    userPkiPath: PkiPath,
    soas: TrustAnchorList,
    trustAnchors: TrustAnchorList,
    opts: VerifyAttrCertOpts = {},
): AsyncIterableIterator<VerifyAttrCertYield, number> {
    if (soas.length === 0) {
        return VAC_UNTRUSTED_SOA; // TODO: Better error message
    }
    const acPath = userACPath.acPath ?? [];
    if (acPath.length > 100) {
        return VAC_PATH_TOO_LONG;
    }

    // TODO: This might be able to go in the loop instead.
    if (acPath.length === 0) {
        // TODO: What if the cert claims to be an SOA? Or doesn't?
        // TODO: What if the user just provided the lone cert and expected the DSA to fill in the rest?
        const eeCert = userPkiPath[userPkiPath.length - 1];
        return (eeCert && soas.some((soa) => isCertInTrustAnchor(eeCert, soa)))
            ? VAC_OK
            : VAC_NO_SOA_CERT;
    }

    /* This is pretty generous, because many of these could be attribute
    descriptor certificates or role specification certificates or other
    things like that. */
    if (acPath.filter((arc) => arc.attributeCertificate).length > 30) {
        return VAC_PATH_TOO_LONG;
    }

    const {
        timeOfCheck = new Date(),
        previouslyAsserted = false,
        privilegePolicies = undefined,
        targets = undefined, // TODO: Use this.
    } = opts;

    const [certsBySerialNumberLowerHex, certsByKeyIdLowerHex] = indexCerts(acPath);
    const namingMatcher = getNamingMatcherGetter(ctx);

    // This only has to be done once here as a boundary condition.
    let current_holder_pki_path: PkiPath | undefined = [ ...userPkiPath ];
    let current_ac: AttributeCertificate | null = userACPath.attributeCertificate;
    const ordered_path: [ AttributeCertificate, PkiPath ][] = [ [ current_ac, current_holder_pki_path ] ];
    let iteration = 0;

    let ee_allowed_attr_assignments: AllowedAttributeAssignments | undefined;
    let current_allowed_attr_assignments: AllowedAttributeAssignments | undefined;

    /** The certification policies that all PKI chains up until now have
    been certified with. */
    let cert_policies_intersection: Set<IndexableOID> | null = null;

    while (current_holder_pki_path && current_ac) {
        if (iteration > 10) { // TODO: Make this configurable.
            return VAC_PATH_TOO_LONG;
        }
        const on_end_entity = iteration === 0;
        let no_rev_avail = false;
        let authority = false;
        if (current_holder_pki_path.length === 0) {
            return VAC_EMPTY_PKI_PATH;
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

        const isPubKeyCertTrusted = soas
            .some((soa) => isCertInTrustAnchor(eeCert, soa, eeCert.originalDER)); 
        if (is_soa && !isPubKeyCertTrusted) {
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
                // This applies to all PKI paths _inferior_ to this one. So it
                // is correct that we check this here, _then_ verify the signature
                // of the issuer AC and update `cert_policies_intersection`.
                } else if (ext.extnId.isEqualTo(acceptableCertPolicies["&id"]!)) {
                    const acp = acceptableCertPolicies.decoderFor["&ExtnType"]!(extEl);
                    const match = !cert_policies_intersection
                        || acp.some((cp) => cert_policies_intersection!.has(cp.toString()));
                    if (!match) {
                        // The PKI chains before this did not share a common
                        // certification policy that was acceptable.
                        return VAC_INVALID_CERT_POLICY;
                    }
                }
            } catch (e: any) {
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
        const issuer_ac_data = acPath[iteration];
        if (!issuer_ac_data) {
            // FIXME: This error does not make sense if we haven't iterated at least once.
            // This means we didn't trust the highest up issuer we found.
            return current_ac_exts.some((ext) => ext.extnId.isEqualTo(sOAIdentifier["&id"]!))
                ? VAC_UNTRUSTED_SOA
                : VAC_NO_SOA_CERT;
        }
        if (!issuer_ac_data.attributeCertificate && !issuer_ac_data.certificate) {
            return VAC_UNUSABLE_AC_PATH;
        }

        // #region hydrate_issuer_ac_data

        let issuer_pki_path: PkiPath | null = null;
        let issuer_ac: AttributeCertificate | null = issuer_ac_data.attributeCertificate ?? null;
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
            if (!issuer_ac) {
                // If there was no attribute certificate provided, look it up.
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
                    .slice(0, 3) // TODO: Make configurable look ups.
                    ;
                for (const aia of aias) {
                    const loc = aia.accessLocation;
                    if ("directoryName" in loc) {
                        const dirName = loc.directoryName;
                        const acert = await lookupAttrCertViaX500(
                            ctx,
                            dirName,
                            false,
                            timeOfCheck,
                            {
                                chaining: false,
                                copyShallDo: true,
                                timeLimitInSeconds: 5, // TODO: Calculate based on time remaining.
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
                        const acert = await acertCurl(url, {
                            timeoutInMilliseconds: 5000, // TODO: Calculate based on time remaining.
                            sizeLimit: 1_000_000,
                            // ipfsBaseUrl: ctx.config // TODO: Make configurable.
                        });
                        if (acert) {
                            issuer_ac = acert;
                            break;
                        }
                    }
                }
                if (!issuer_ac) {
                    // We were unable to look up / fetch the attribute certificate.
                    return VAC_UNUSABLE_AC_PATH;
                }
            }
        } else {
            assert(issuer_ac_data.attributeCertificate, "no attribute certificate"); // We ruled this out above.
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
        // FIXME: I don't think you ever check that the issuer_ee_cert actually issued the current_ac
        // Verify the signature on the attribute certificate.
        const issuer_cert_path = new CertificationPath(
            issuer_ee_cert,
            issuer_pki_path.slice(0, -1)
                .map((cert) => new CertificatePair(cert, undefined))
                .reverse(),
        );
        try {
            // This verifies the _issuer_ cert path.
            const vcpResult = await verifySIGNED(
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
            if (vcpResult?.returnCode === VCP_RETURN_OK) {
                if (cert_policies_intersection) {                    
                    // TODO: Can user-constrained-policies be empty?
                    const usedAnyPolicy = vcpResult
                        .user_constrained_policies
                        .some((pol) => pol.policyIdentifier.isEqualTo(anyPolicy));
                    if (!usedAnyPolicy) {
                        const ucpset = new Set();
                        for (const cp of vcpResult.user_constrained_policies) {
                            ucpset.add(cp.policyIdentifier.toString());
                        }
                        cert_policies_intersection = cert_policies_intersection.intersection(ucpset);
                    }
                } else {
                    cert_policies_intersection = new Set();
                    for (const cp of vcpResult.user_constrained_policies) {
                        cert_policies_intersection.add(cp.policyIdentifier.toString());
                    }
                }
            }
        } catch (e: any) {
            if (process.env.MEERKAT_LOG_JSON !== "1") {
                ctx.log.debug(util.inspect(e));
            }
            // TODO: Log
            return VAC_DUBIOUS_CERT_PATH;
        }

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
            /* The specifications do not say that you have to check that each
            subsequent AC in the chain has a subset of PPs listed in the AA's
            extension. I checked both ITU Rec. X.509 and IETF RFC 5755. I
            searched Google too and read a Chadwick paper that mentions this
            extension. Nothing. And when I think about it, there could be a
            valid use case for an AA cert to have fewer applicable privilege
            policies than one of its delegatees. So we only check the first
            attribute certificate against the caller-supplied privilege
            policies, if provided. */
            else if (
                iteration === 0
                && privilegePolicies?.length
                && ext.extnId.isEqualTo(acceptablePrivilegePolicies["&id"]!)
            ) {
                const app = acceptablePrivilegePolicies.decoderFor["&ExtnType"]!(extEl);
                const acceptableSet = new Set(privilegePolicies.map((pp) => pp.toString()));
                const match = app.some((pp) => acceptableSet.has(pp.toString()));
                if (!match) {
                    return VAC_UNACCEPTABLE_PRIV_POLICY;
                }
            }
        }
        // #endregion verify_extensions_in_subject_ac_requiring_issuer

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
            } else if (ext.extnId.isEqualTo(allowedAttributeAssignments["&id"]!)) {
                const superset = allowedAttributeAssignments.decoderFor["&ExtnType"]!(extEl);
                const applicableSuperset = superset
                    .filter((aaa) => {
                        const subtree = new GeneralSubtree(aaa.holderDomain);
                        const gns: GeneralNames = [
                            {
                                directoryName: eeCert.toBeSigned.subject,
                            },
                            ...(current_ac?.toBeSigned.holder.entityName ?? [])
                        ].slice(0, 100); // denial-of-service prevention.
                        for (const gn of gns) {
                            if (gnWithinGeneralSubtree(gn, subtree, namingMatcher)) {
                                return true;
                            }
                        }
                        return false;
                    });
                const subset = current_allowed_attr_assignments;
                if (subset && !aaaIsImproperSubset(applicableSuperset, subset)) {
                    /* The inferior AA was allowed to assign attributes that
                    the superior AA was not allowed to assign. */
                    return VAC_AAA_VIOLATION;
                }
                current_allowed_attr_assignments = applicableSuperset;
                if (!ee_allowed_attr_assignments) {
                    ee_allowed_attr_assignments = applicableSuperset;
                }
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

        // #region verify_attribute_delegation
        // Pre-index the delegated attributes.
        const delegating_attr_map = new Map<IndexableOID, Attribute>();
        for (const a of issuer_ac?.toBeSigned.attributes ?? []) {
            const key = a.type_.toString();
            if (delegating_attr_map.has(key)) {
                return VAC_DUPLICATE_ATTR;
            }
            delegating_attr_map.set(key, a);
        }
        for (const attr of current_ac.toBeSigned.attributes) {
            const key = attr.type_.toString();
            const delegating_attr = delegating_attr_map.get(key);
            if (!delegating_attr) {
                // This attribute was entirely absent from the delegating AA.
                return VAC_ATTR_DELEGATION_VIOLATION;
            }
            // TODO: Make the privilege policy customizable. (Maybe the user can configure ADCs at startup or something.)
            const privilegePolicy = privilegePolicies?.reduce((acc, cur) => acc ?? cur);
            const privilegeComparator: PrivilegeComparator = ctx
                .config
                .privilegePoliciesToComparators
                .get(privilegePolicy?.toString() ?? "1.3.6.1.4.1.56490.403.23")?.(attr.type_)
                ?? defaultPrivilegeComparator;
            if (!isAttributeDelegationAllowed(attr, delegating_attr, privilegeComparator)) {
                return VAC_AAA_VIOLATION;
            }
        }
        // #endregion verify_attribute_delegation

        yield {
            attributeCertificate: current_ac,
            pkiPath: current_holder_pki_path,
        };

        current_ac = issuer_ac;
        issuer_ac && ordered_path.push([ issuer_ac, issuer_pki_path ]);
        current_holder_pki_path = issuer_pki_path;
        iteration++;
    }

    // TODO: At the end, verify that the SOA is the expected_soa
    // TODO: Check that the SOA is trusted.

    /* I think this check only needs to be done here. I think it is perfectly
    valid if we just check that all AAA extension values present in AA ACs
    are subsets of those of their issuing AA's, then just check that the EE
    AC only contains the allowed values at the end. What does it matter for
    our purposes if an intermediary AA is illicitly delegated with an
    attribute value if it does not delegate it further? */
    if (ee_allowed_attr_assignments && current_ac) {
        const allowed = ee_allowed_attr_assignments
            .map((aaa) => aaa.attributes)
            .flat();
        const attrs = current_ac.toBeSigned.attributes;
        const compliant = checkAttributeAssignments(allowed, attrs);
        if (!compliant) {
            return VAC_AAA_VIOLATION;
        }
    }

    return VAC_OK;
}
