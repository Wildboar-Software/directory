import {
    Context,
    CRLIndex,
    IndexableOID,
    OCSPOptions,
    OfflinePKIConfig,
    RemoteCRLOptions,
    SigningInfo,
} from "@wildboar/meerkat-types";
import { Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta";
import { Extension } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Extension.ta";
import {
    DERElement,
    packBits,
    OBJECT_IDENTIFIER,
    ObjectIdentifier,
    TRUE_BIT,
    GeneralizedTime,
    BOOLEAN,
    ASN1Element,
    ASN1TagClass,
    ASN1UniversalType,
} from "asn1-ts";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { DER } from "asn1-ts/dist/node/functional";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import { createVerify, createPublicKey, KeyObject } from "crypto";
import {
    AlgorithmIdentifier, _encode_AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta"
import {
    AltSignatureAlgorithm,
    _decode_AltSignatureAlgorithm,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/AltSignatureAlgorithm.ta";
import {
    SubjectAltPublicKeyInfo, _decode_SubjectAltPublicKeyInfo, _encode_SubjectAltPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/SubjectAltPublicKeyInfo.ta";
import {
    TBSCertificate,
    _encode_TBSCertificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/TBSCertificate.ta";
import type {
    GeneralSubtree,
    GeneralSubtrees,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralSubtrees.ta";
import compareElements from "@wildboar/x500/src/lib/comparators/compareElements";
import type {
    NAME_FORM,
} from "@wildboar/x500/src/lib/modules/InformationFramework/NAME-FORM.oca";
import {
    PolicyInformation,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/PolicyInformation.ta";
import type {
    PolicyMappingsSyntax_Item,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/PolicyMappingsSyntax-Item.ta";
import type {
    GeneralName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import {
    anyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/anyPolicy.va";
import {
    PolicyQualifierInfo,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/PolicyQualifierInfo.ta";
import dnWithinGeneralSubtree from "@wildboar/x500/src/lib/utils/dnWithinGeneralSubtree";
import groupByOID from "../utils/groupByOID";
import { strict as assert } from "assert";
import generalNameToString from "@wildboar/x500/src/lib/stringifiers/generalNameToString";
import type {
    TrustAnchorList,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorList.ta";
import {
    sha1WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha1WithRSAEncryption.va";
import {
    sha256WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha256WithRSAEncryption.va";
import {
    sha384WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha384WithRSAEncryption.va";
import {
    sha512WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha512WithRSAEncryption.va";
import {
    sha224WithRSAEncryption,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/sha224WithRSAEncryption.va";
import {
    id_RSASSA_PSS,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-RSASSA-PSS.va";
import {
    id_dsa_with_sha1,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha1.va";
import {
    id_dsa_with_sha224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha224.va";
import {
    id_dsa_with_sha256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-dsa-with-sha256.va";
import {
    ecdsa_with_SHA224,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA224.va";
import {
    ecdsa_with_SHA256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA256.va";
import {
    ecdsa_with_SHA384,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA384.va";
import {
    ecdsa_with_SHA512,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/ecdsa-with-SHA512.va";
import {
    id_Ed25519,
} from "@wildboar/safecurves-pkix-18/src/lib/modules/Safecurves-pkix-18/id-Ed25519.va";
import {
    id_Ed448,
} from "@wildboar/safecurves-pkix-18/src/lib/modules/Safecurves-pkix-18/id-Ed448.va";
import {
    id_ad_ocsp,
} from "@wildboar/x500/src/lib/modules/PkiPmiExternalDataTypes/id-ad-ocsp.va";
import { URL } from "url";
import { getOCSPResponse, SignFunction } from "@wildboar/ocsp-client";
import { crlCurl, ReadDispatcherFunction } from "./crlCurl";
import type {
    ReadArgument,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadArgument.ta";
import {
    ReadResult, _decode_ReadResult,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/ReadResult.ta";
import { OperationDispatcher } from "../distributed/OperationDispatcher";
import type { MeerkatContext } from "../ctx";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";
import {
    CertificateList, _encode_CertificateList, _encode_CertificateListContent,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateList.ta";
import {
    KeyUsage,
    KeyUsage_keyCertSign,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/KeyUsage.ta";
import type {
    KeyPurposeId,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/KeyPurposeId.ta";
import { subjectDirectoryAttributes } from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectDirectoryAttributes.oa";
import { subjectKeyIdentifier } from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectKeyIdentifier.oa";
import {
    keyUsage,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/keyUsage.oa";
import {
    privateKeyUsagePeriod,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/privateKeyUsagePeriod.oa";
import {
    subjectAltName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectAltName.oa";
import {
    issuerAltName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/issuerAltName.oa";
import {
    basicConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/basicConstraints.oa";
import {
    nameConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/nameConstraints.oa";
import {
    cRLDistributionPoints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/cRLDistributionPoints.oa";
import {
    certificatePolicies,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/certificatePolicies.oa";
import {
    policyMappings,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/policyMappings.oa";
import {
    authorityKeyIdentifier,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/authorityKeyIdentifier.oa";
import {
    policyConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/policyConstraints.oa";
import {
    extKeyUsage,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/extKeyUsage.oa";
import {
    inhibitAnyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/inhibitAnyPolicy.oa";
import {
    subjectAltPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectAltPublicKeyInfo.oa";
import {
    altSignatureAlgorithm,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/altSignatureAlgorithm.oa";
import {
    altSignatureValue,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/altSignatureValue.oa";
import {
    associatedInformation,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/associatedInformation.oa";
import {
    authorizationValidation,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/authorizationValidation.oa";
import {
    authorityInfoAccess,
} from "@wildboar/x500/src/lib/modules/PkiPmiExternalDataTypes/authorityInfoAccess.oa";
import {
    subjectInfoAccess,
} from "@wildboar/x500/src/lib/modules/PkiPmiExternalDataTypes/subjectInfoAccess.oa";
import { generateSignature } from "./generateSignature";
import {
    verifyOCSPResponse,
    VOR_RETURN_OK,
    VOR_RETURN_REVOKED,
    VOR_RETURN_UNKNOWN_INTOLERABLE,
} from "./verifyOCSPResponse";
import _ from "lodash";
import { Name } from "@wildboar/x500/src/lib/modules/InformationFramework/Name.ta";

// So that arguments can be modified by reference.
type Box<T> = {
    ref: T;
};

export type VCPReturnCode = number;
export const VCP_RETURN_OK: VCPReturnCode = 0;
export const VCP_RETURN_INVALID_SIG: VCPReturnCode = -1;
// export const VCP_RETURN_OCSP_REVOKED: VCPReturnCode = -2;
// export const VCP_RETURN_OCSP_OTHER: VCPReturnCode = -3; // Unreachable, Unauthorized, etc.
// export const VCP_RETURN_CRL_REVOKED: VCPReturnCode = -4;
// export const VCP_RETURN_CRL_UNREACHABLE: VCPReturnCode = -5;
export const VCP_RETURN_MALFORMED: VCPReturnCode = -6;
export const VCP_RETURN_BAD_KEY_USAGE: VCPReturnCode = -7;
export const VCP_RETURN_BAD_EXT_KEY_USAGE: VCPReturnCode = -8;
export const VCP_RETURN_UNKNOWN_CRIT_EXT: VCPReturnCode = -9;
export const VCP_RETURN_DUPLICATE_EXT: VCPReturnCode = -10;
export const VCP_RETURN_AKI_SKI_MISMATCH: VCPReturnCode = -11;
export const VCP_RETURN_PKU_PERIOD: VCPReturnCode = -12;
export const VCP_RETURN_BASIC_CONSTRAINTS_CA: VCPReturnCode = -13;
export const VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN: VCPReturnCode = -14;
export const VCP_RETURN_INVALID_EXT_CRIT: VCPReturnCode = -15;
export const VCP_RETURN_UNTRUSTED_ANCHOR: VCPReturnCode = -16;
export const VCP_RETURN_INVALID_TIME: VCPReturnCode = -17;
export const VCP_RETURN_ISSUER_SUBJECT_MISMATCH: VCPReturnCode = -18;
export const VCP_RETURN_NAME_NOT_PERMITTED: VCPReturnCode = -19;
export const VCP_RETURN_NAME_EXCLUDED: VCPReturnCode = -20;
export const VCP_RETURN_PROHIBITED_SIG_ALG: VCPReturnCode = -21;
export const VCP_RETURN_POLICY_NOT_ACCEPTABLE: VCPReturnCode = -22;
export const VCP_RETURN_NO_AUTHORIZED_POLICIES: VCPReturnCode = -23;
export const VCP_RETURN_NO_BASIC_CONSTRAINTS_CA: VCPReturnCode = -24;

// The -100s are shared between verifyCertPath and verifyAttrCert.
export const VCP_RETURN_OCSP_REVOKED: VCPReturnCode = -102;
export const VCP_RETURN_OCSP_OTHER: VCPReturnCode = -103; // Unreachable, Unauthorized, etc.
export const VCP_RETURN_CRL_REVOKED: VCPReturnCode = -104;
export const VCP_RETURN_CRL_UNREACHABLE: VCPReturnCode = -105;

/**
 * This set contains the extensions that Meerkat DSA observes when processing
 * the certification path. Essentially, if an extension is encountered with its
 * `critical` field set to `TRUE` and it is not in this set, Meerkat DSA does
 * not know how to handle that critical extension and MUST fail the validation.
 */
export
const supportedExtensions: Set<IndexableOID> = new Set([
    subjectDirectoryAttributes["&id"]!.toString(), // TODO: If critical, at least one attr must be understood.
    subjectKeyIdentifier["&id"]!.toString(), // Always non-critical.
    keyUsage["&id"]!.toString(), // If NOT critical, don't set this on the state, because it is not enforced.
    privateKeyUsagePeriod["&id"]!.toString(), // Always non-critical.
    subjectAltName["&id"]!.toString(), // TODO: If critical, one of the name forms must be recognized.
    issuerAltName["&id"]!.toString(), // TODO: If critical, one of the name forms must be recognized.
    basicConstraints["&id"]!.toString(), // Always critical in a CA.
    nameConstraints["&id"]!.toString(), // Not checked if not critical.
    cRLDistributionPoints["&id"]!.toString(), // MUST be checked if critical.
    certificatePolicies["&id"]!.toString(), // TODO: If not critical, cert policy constraints can be "disobeyed".
    policyMappings["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    authorityKeyIdentifier["&id"]!.toString(), // Always non-critical.
    policyConstraints["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    extKeyUsage["&id"]!.toString(), // If NOT critical, don't set this on the state, because it is not enforced.
    inhibitAnyPolicy["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    subjectAltPublicKeyInfo["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    altSignatureAlgorithm["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    altSignatureValue["&id"]!.toString(), // No meaning imputed to critical/non-critical.
    associatedInformation["&id"]!.toString(), // TODO: If critical, at least one attr must be understood.
    authorizationValidation["&id"]!.toString(), // Always critical
    authorityInfoAccess["&id"]!.toString(), // Always non-critical
    subjectInfoAccess["&id"]!.toString(), // Always non-critical
]);

/**
 * Where extensions are defined to have a specification-mandated criticality,
 * this map indicates what the criticality value should be for each extension.
 */
export
const extensionMandatoryCriticality: Map<IndexableOID, BOOLEAN> = new Map([
    [ subjectKeyIdentifier["&id"]!.toString(), false ], // Always non-critical.
    [ privateKeyUsagePeriod["&id"]!.toString(), false ], // Always non-critical.
    [ authorityKeyIdentifier["&id"]!.toString(), false ], // Always non-critical.
    [ authorizationValidation["&id"]!.toString(), true ], // Always critical.
    [ authorityInfoAccess["&id"]!.toString(), false ], // Always non-critical.
    [ subjectInfoAccess["&id"]!.toString(), false ], // Always non-critical.
]);

const ietfUserNoticeOID: OBJECT_IDENTIFIER = new ObjectIdentifier([ 1, 3, 6, 1, 5, 5, 7, 2, 2 ]);

/**
 * @summary Convert `DisplayText` to a `string`
 * @param dt Converts `DisplayText` to a `string`.
 * @returns The string representation of the `DisplayText`
 *
 * @function
 */
function displayTextToString (dt: ASN1Element): string | null {
    if (dt.tagClass !== ASN1TagClass.universal) {
        return null;
    }
    switch (dt.tagNumber) {
        case (ASN1UniversalType.ia5String): {
            return dt.ia5String;
        }
        case (ASN1UniversalType.utf8String): {
            return dt.utf8String;
        }
        case (ASN1UniversalType.bmpString): {
            return dt.bmpString;
        }
        case (ASN1UniversalType.visibleString): {
            return dt.visibleString;
        }
        default: return null;
    }
}

/**
 * Meant to mirror the policy tree-related types from OpenSSL's
 * `crypto/x509/pcy_local.h` and using the algorithm described in IETF RFC 5280,
 * since the description of the algorithm for evaluating certification policy
 * compliance in ITU-T Recommendation X.509 (2019), section 12, is absolutely
 * obtuse.
 */
interface ValidPolicyData {
    // flags
    valid_policy: OBJECT_IDENTIFIER;
    qualifier_set: PolicyQualifierInfo[];
    expected_policy_set: Set<IndexableOID>;
}

/**
 * Meant to mirror the policy tree-related types from OpenSSL's
 * `crypto/x509/pcy_local.h` and using the algorithm described in IETF RFC 5280,
 * since the description of the algorithm for evaluating certification policy
 * compliance in ITU-T Recommendation X.509 (2019), section 12, is absolutely
 * obtuse.
 */
interface ValidPolicyNode extends ValidPolicyData {
    // data handled by the above "extends"
    parent?: ValidPolicyNode;

    /**
     * The number of direct child nodes.
     */
    nchild: number;
}

/**
 * Meant to mirror the policy tree-related types from OpenSSL's
 * `crypto/x509/pcy_local.h` and using the algorithm described in IETF RFC 5280,
 * since the description of the algorithm for evaluating certification policy
 * compliance in ITU-T Recommendation X.509 (2019), section 12, is absolutely
 * obtuse.
 */
interface ValidPolicyLevel {
    cert: Certificate;
    nodes: ValidPolicyNode[];
    // anyPolicy?
    // flags?
}

/**
 * Meant to mirror the policy tree-related types from OpenSSL's
 * `crypto/x509/pcy_local.h` and using the algorithm described in IETF RFC 5280,
 * since the description of the algorithm for evaluating certification policy
 * compliance in ITU-T Recommendation X.509 (2019), section 12, is absolutely
 * obtuse.
 */
interface ValidPolicyTree {
    levels: ValidPolicyLevel[];
    anyPolicy: boolean;
    auth_policies: ValidPolicyNode[];
}

/**
 * @summary Arguments to the verifyCertPath() function.
 * @description
 *
 * Based on ITU Recommendation X.509 (2019), Section 12.1.
 *
 * @interface
 */
export
interface VerifyCertPathArgs {

    /**
     * @summary The time at which the certification path's is checked for validity.
     * @description
     *
     * This allows you to override the current time when certificate
     * expiration is checked via the `Validity` field.
     *
     * @readonly
     */
    readonly validityTime: Date;

    /**
     * @summary The trust anchors for this validation.
     * @description
     *
     * The trust anchors that will be used to verify the certification path.
     *
     * @readonly
     */
    readonly trustAnchors: TrustAnchorList;

    /**
     * @summary A set of public-key certificates comprising a certification path
     * @description
     *
     * These certificates are present in increasing level of authority, meaning
     * that the end-entity certificate will always be the first in the array,
     * and the trust anchor will always be the last.
     *
     * @readonly
     */
    readonly certPath: Certificate[];

    /**
     * @summary one or more certificate policy identifiers, that would be
     *  acceptable to the relying party for the purposes of certification path processing
     * @description
     *
     * an initial-policy-set comprising one or more certificate policy
     * identifiers, indicating that any one of these policies would be
     * acceptable to the relying party for the purposes of certification path
     * processing; this input can also take the special value any-policy, but it
     * cannot be null.
     *
     * @readonly
     */
    readonly initial_policy_set: OBJECT_IDENTIFIER[];

    /**
     * @summary Whether an acceptable policy identifier needs to explicitly
     *  appear in the certificate policies extension of all public-key certificates in the path
     * @readonly
     */
    readonly initial_explicit_policy: boolean;

    /**
     * @summary Whether policy mapping is forbidden in the certification path
     * @readonly
     */
    readonly initial_policy_mapping_inhibit: boolean;

    /**
     * @summary Whether the special value `anyPolicy`, if present in a
     *  certificate policies extension, is considered a match for any specific
     *  certificate policy value in a constrained set
     * @readonly
     */
    readonly initial_inhibit_any_policy: boolean;

    // The current time can be trivially obtained.

    /**
     * @summary An initial set of subtree specifications defining subtrees within which subject names are permitted
     * @description
     *
     * An initial set of subtree
     * specifications defining subtrees within which subject names (of the name
     * form used to specify the subtrees) are permitted. In the public-key
     * certificates in the certification path all subject names of a given name
     * form, for which initial permitted subtrees are defined, shall fall within
     * the permitted subtrees set for that given name form. This input may also
     * contain the special value unbounded to indicate that initially all
     * subject names are acceptable. Subject names are those name values
     * appearing in the subject component or the subjectAltName extension.
     *
     * @readonly
     */
    readonly initial_permitted_subtrees_set: GeneralSubtrees;

    /**
     * @summary An initial set of subtree specifications defining subtrees
     *  within which the subject names in the public-key certificates in the
     *  certification path cannot fall.
     * @description
     *
     * An initial set of subtree
     * specifications defining subtrees within which the subject names in the
     * public-key certificates in the certification path cannot fall. This input
     * may also be an empty set to indicate that initially no subtree exclusions
     * are in effect.
     *
     * @readonly
     */
    readonly initial_excluded_subtrees_set: GeneralSubtrees;

    /**
     * @summary An initial set of name forms indicating that all public-key
     *  certificates in the path must include a subject name of at least one of
     *  the specified name forms.
     * @description
     *
     * An initial set of name forms indicating that all public-key certificates
     * in the path must include a subject name of at least one of the specified
     * name forms. This input may also be an empty set to indicate that no
     * specific name forms are required for subject names in the certificates.
     *
     * @readonly
     */
    readonly initial_required_name_forms: NAME_FORM["&id"][];
}

/**
 * @summary Get a function that performs a `read` operation
 * @description
 *
 * This is a higher-order function that returns an async function that takes
 * a `ReadArgument`, performs the X.500 `read` operation using it, and returns
 * the `ReadResult`.
 *
 * @param ctx The context object
 * @returns An async function that performs a `read` operation
 *
 * @function
 */
export
function getReadDispatcher (ctx: MeerkatContext): ReadDispatcherFunction {
    return async (
        readArg: ReadArgument,
    ): Promise<ReadResult> => {
        const result = await OperationDispatcher.dispatchLocalReadRequest(ctx, readArg);
        const resultData = getOptionallyProtectedValue(result.result);
        return _decode_ReadResult(resultData.result);
    };
}

/**
 * @summary Create a `VerifyCertPathResult` failure result
 * @description
 *
 * This function creates a `VerifyCertPathResult` failure result from just a
 * return code. It exists just to fill in all the other fields of the result
 * with null-ish values.
 *
 * @param returnCode The return code to instantiate the `returnCode` field
 * @returns A `VerifyCertPathResult`
 *
 * @function
 */
export
function verifyCertPathFail (returnCode: number): VerifyCertPathResult {
    return {
        returnCode,
        authorities_constrained_policies: [],
        explicit_policy_indicator: false,
        policy_mappings_that_occurred: [],
        user_constrained_policies: [],
        warnings: [],
        endEntityExtKeyUsage: undefined,
        endEntityKeyUsage: undefined,
        endEntityPrivateKeyNotAfter: undefined,
        endEntityPrivateKeyNotBefore: undefined,
        userNotices: [],
    };
}

/**
 * @summary Result of the verifyCertPath() function.
 * @description
 *
 * Based on ITU Recommendation X.509 (2019), Section 12.2.
 *
 * @interface
 */
export
interface VerifyCertPathResult {

    /**
     * @summary 0 if verification was successful, otherwise, a code describing
     *  the error.
     * @readonly
     */
    readonly returnCode: number;

    /**
     * @readonly
     */
    readonly authorities_constrained_policies: PolicyInformation[];

    /**
     * @readonly
     */
    readonly user_constrained_policies: PolicyInformation[];

    /**
     * @readonly
     */
    readonly explicit_policy_indicator: boolean;

    /**
     * @readonly
     */
    readonly policy_mappings_that_occurred: PolicyMappingsSyntax_Item[];

    /**
     * @readonly
     */
    readonly warnings: number[];

    /**
     * @readonly
     */
    readonly endEntityKeyUsage?: KeyUsage;

    /**
     * @readonly
     */
    readonly endEntityExtKeyUsage?: KeyPurposeId[];

    /**
     * @readonly
     */
    readonly endEntityPrivateKeyNotBefore?: GeneralizedTime;

    /**
     * @readonly
     */
    readonly endEntityPrivateKeyNotAfter?: GeneralizedTime;

    /**
     * @readonly
     */
    readonly userNotices: string[];
}

/**
 * Values of the variable defined in ITU-T Recommendation X.509 (2019), Section
 * 12.3.i.
 *
 * @interface
 */
export
interface PendingConstraint {
    pending: boolean;
    skipCertificates: number;
}

/**
 * @summary Internal state of the verifyCertPath() function.
 * @description
 *
 * Based on ITU Recommendation X.509 (2019), Section 12.3.
 *
 * @interface
 */
export
interface VerifyCertPathState {

    /**
     * @summary The time at which the certification path's is checked for validity.
     * @description
     *
     * This allows you to override the current time when certificate
     * expiration is checked via the `Validity` field.
     *
     * @readonly
     */
    readonly validityTime: Date;

    /**
     * @summary 0 if verification was successful, otherwise, a code describing
     *  the error.
     */
    returnCode?: number;

    /**
     * @summary A set of public-key certificates comprising a certification path
     * @description
     *
     * These certificates are present in increasing level of authority, meaning
     * that the end-entity certificate will always be the first in the array,
     * and the trust anchor will always be the last.
     */
    certPath: Certificate[];

    /**
     * It is not clear what the datatype of this should be. As such, in
     * deviation from ITU Recommendation X.509, the algorithm defined in
     * IETF RFC 5280 (using a tree data structure) is used instead.
     *
     * @deprecated
     * @see valid_policy_tree
     */
    authorities_constrained_policy_set: (PolicyInformation | null)[][];

    /**
     * This is not defined in ITU Recommendation X.509. This is defined in IETF
     * RFC 5280. The certificate policy checking algorithm defined there is
     * much more understandable, so this implementation will use this instead.
     *
     * NOTE: I cannot find confirmation that this algorithm is 100% equivalent
     * to the X.509 algorithm, but it looks like it is. Testing against the
     * NIST certification path test suite should be a good indicator.
     */
    valid_policy_tree: ValidPolicyTree | null;

    /**
     * The permitted subtrees granted by name constraints in the
     * `nameConstraints` extension.
     */
    permitted_subtrees: GeneralSubtrees;

    /**
     * The excluded subtress forbidden by name constraints in the
     * `nameConstraints` extension.
     */
    excluded_subtrees: GeneralSubtrees;

    /**
     * The required name forms.
     */
    required_name_forms: NAME_FORM["&id"][];

    /**
     * Indicates whether an acceptable policy needs to be explicitly identified
     * in every public-key certificate in the path.
     */
    explicit_policy_indicator: boolean;

    /**
     * An integer equal to one more than the number of public-key certificates
     * in the certification path for which processing has been completed.
     */
    path_depth: number;

    /**
     * Indicates whether policy mapping is inhibited.
     */
    policy_mapping_inhibit_indicator: boolean;

    /**
     * Indicates whether the special value anyPolicy is considered a match for
     * any specific certificate policy.
     */
    inhibit_any_policy_indicator: boolean;

    /**
     * Details of explicit-policy inhibit-policy-mapping and/or
     * inhibit-any-policy constraints which have been stipulated but have yet to
     * take effect. There are three one-bit indicators called
     * explicit-policy-pending, policy-mapping-inhibit-pending and
     * inhibit-any-policy-pending together with, for each, an integer called
     * skip-certificates which gives the number of public-key certificates yet
     * to skip before the constraint takes effect.
     */
    pending_constraints: {

        explicit_policy: PendingConstraint;

        policy_mapping_inhibit: PendingConstraint;

        inhibit_any_policy: PendingConstraint;

    };

    /**
     * What key usages are granted to the end-entity, given by the
     * `keyUsage` extension.
     */
    endEntityKeyUsage?: KeyUsage;

    /**
     * What extended key usages are granted to the end-entity, given by the
     * `extKeyUsage` extension.
     */
    endEntityExtKeyUsage?: KeyPurposeId[];

    /**
     * The notBefore time of the end entity's private key, given by the
     * `privateKeyUsagePeriod` extension.
     */
    endEntityPrivateKeyNotBefore?: GeneralizedTime;

    /**
     * The notAfter time of the end entity's private key, given by the
     * `privateKeyUsagePeriod` extension.
     */
    endEntityPrivateKeyNotAfter?: GeneralizedTime;

}

/**
 * A mapping of the signature algorithm object identifiers to their NodeJS
 * digest algorithm string identifiers.
 */
const sigAlgOidToNodeJSDigest: Map<string, string | null> = new Map([
    [ sha1WithRSAEncryption.toString(), "sha1" ],
    [ sha224WithRSAEncryption.toString(), "sha224" ],
    [ sha256WithRSAEncryption.toString(), "sha256" ],
    [ sha384WithRSAEncryption.toString(), "sha384" ],
    [ sha512WithRSAEncryption.toString(), "sha512" ],
    [ id_dsa_with_sha1.toString(), "sha1" ],
    [ id_dsa_with_sha224.toString(), "sha224" ],
    [ id_dsa_with_sha256.toString(), "sha256" ],
    [ ecdsa_with_SHA224.toString(), "sha224" ],
    [ ecdsa_with_SHA256.toString(), "sha256" ],
    [ ecdsa_with_SHA384.toString(), "sha384" ],
    [ ecdsa_with_SHA512.toString(), "sha512" ],
    [ id_RSASSA_PSS.toString(), null ], // rsa-pss is a supported keytype in the NodeJS runtime.
    [ id_Ed448.toString(), null ],
    [ id_Ed25519.toString(), null ],
]);

/**
 * @summary Check the OCSP status of a certificate
 * @description
 *
 * This function sends requests to OCSP responders in the authorityInfoAccess
 * extension to determine if a certificate is still valid. It's signature may
 * seem weird, but it is purposefully designed to be general enough to be used
 * for checking OCSP for public key certificates and attribute certificates.
 *
 * @param ctx The context object
 * @param ext The authorityInfoAccess extension in the subject certificate
 * @param issuer The issuer's Name and SubjectPublicKeyInfo
 * @param serialNumber The subject's serial number
 * @param options OCSP-related options
 * @returns A promise resolving to an return code.
 *
 * @async
 * @function
 */
export
async function checkOCSP (
    ctx: MeerkatContext,
    ext: Extension,
    issuer: [ Name, SubjectPublicKeyInfo ],
    serialNumber: Uint8Array,
    options: OCSPOptions,
): Promise<number> {
    if (!ext.extnId.isEqualTo(authorityInfoAccess["&id"]!)) {
        return VCP_RETURN_OCSP_OTHER;
    }
    const aiaEl = new DERElement();
    aiaEl.fromBytes(ext.extnValue);
    const aiaValue = authorityInfoAccess.decoderFor["&ExtnType"]!(aiaEl);
    const ocspEndpoints: GeneralName[] = aiaValue
        .filter((ad) => ad.accessMethod.isEqualTo(id_ad_ocsp))
        .map((ad) => ad.accessLocation);
    const signFunction: SignFunction | undefined = options.ocspSignRequests
        ? (data: Uint8Array) => {
            const key = ctx.config.signing.key;
            const certPath = ctx.config.signing.certPath;
            if (!key || !certPath?.length) {
                return null;
            }
            const sig = generateSignature(key, data);
            if (!sig) {
                return null;
            }
            const [ algid, sigValue ] = sig;
            return [ certPath, algid, sigValue ];
        }
        : undefined;
    let requestBudget: number = options.maxOCSPRequestsPerCertificate;
    for (const gn of ocspEndpoints) {
        if (!("uniformResourceIdentifier" in gn)) {
            continue;
        }
        const url = new URL(gn.uniformResourceIdentifier);
        if (!url.protocol.toLowerCase().startsWith("http")) {
            continue;
        }
        if (requestBudget === 0) {
            break;
        }
        requestBudget--;
        const ocspResponse = await getOCSPResponse(
            url,
            [
                issuer[0].rdnSequence,
                issuer[1],
                serialNumber,
            ],
            undefined,
            (options.ocspTimeout * 1000),
            signFunction,
            options.ocspResponseSizeLimit,
        );
        if (!ocspResponse) {
            return VCP_RETURN_OCSP_OTHER;
        }
        const { res } = ocspResponse;
        const verifyResult = await verifyOCSPResponse(ctx, res);
        if (verifyResult === VOR_RETURN_OK) {
            return VCP_RETURN_OK;
        } else if (verifyResult === VOR_RETURN_REVOKED) {
            return VCP_RETURN_OCSP_REVOKED;
        } else if (verifyResult === VOR_RETURN_UNKNOWN_INTOLERABLE) {
            return VCP_RETURN_OCSP_OTHER;
        } else {
            continue; // Just to be explicit.
        }
    }
    /**
     * Even if we exhaust all endpoints, we return an "OK" so that outages of
     * OCSP endpoints do not make TLS impossible.
     */
    return VCP_RETURN_OK;
}

/**
 * @summary Check a certificate's revocation status among remote CRLs.
 * @description
 *
 * This function issues HTTP, FTP, LDAP, and DAP requests, etc. to obtain remote
 * CRLs to check if a certificate is revoked in said CRLs.
 *
 * @param ctx The context object
 * @param ext The cRLDistributionPoints extension
 * @param serialNumber The serial number of the certificate to be checked
 * @param issuer The issuer's Name and SubjectPublicKeyInfo
 * @param readDispatcher A function that dispatches a local `read` request
 * @param options CRL options
 * @returns A promise that resolves to a return code.
 *
 * @async
 * @function
 */
export
async function checkRemoteCRLs (
    ctx: MeerkatContext,
    ext: Extension,
    serialNumber: Uint8Array,
    issuer: [ Name, SubjectPublicKeyInfo ],
    readDispatcher: ReadDispatcherFunction,
    options: RemoteCRLOptions,
): Promise<number> {
    assert(ext.extnId.isEqualTo(cRLDistributionPoints["&id"]!));
    const crlEl = new DERElement();
    crlEl.fromBytes(ext.extnValue);
    const crldpValue = cRLDistributionPoints.decoderFor["&ExtnType"]!(crlEl);
    const crls = (await Promise.all(
        crldpValue
            .slice(0, options.distributionPointAttemptsPerCertificate)
            .map((dp) => crlCurl(
                ctx,
                dp,
                issuer[0],
                readDispatcher,
                options,
            ))
    ))
        .filter((result): result is CertificateList[] => !!result)
        .flat();
    for (const crl of crls) {
        for (const rc of crl.toBeSigned.revokedCertificates ?? []) {
            if (Buffer.compare(rc.serialNumber, serialNumber)) {
                continue;
            }
            if (ctx.config.signing.disableAllSignatureVerification) {
                return VCP_RETURN_CRL_REVOKED;
            }
            const bytes = crl.originalDER
                ? (() => {
                    const el = new DERElement();
                    el.fromBytes(crl.originalDER);
                    const tbs = el.sequence[0];
                    return tbs.toBytes();
                })()
                : _encode_CertificateListContent(crl.toBeSigned, DER).toBytes();
            const sigValue = packBits(crl.signature);
            const signatureIsValid: boolean | undefined = verifySignature(
                bytes,
                crl.algorithmIdentifier,
                sigValue,
                // Remember: the CRL needs to be validated against the ISSUER's public key.
                issuer[1],
            );
            if (!signatureIsValid) {
                // If sig invalid, skip to next CRL entirely.
                break;
            }
            return VCP_RETURN_CRL_REVOKED;
        }
    }
    return VCP_RETURN_OK;
}

// We check validity time first just because we do not want to verify the
// digital signature (it is computationally expensive) if we do not have to.
/**
 * @summary Check whether a point in time falls between a certificate's validity times.
 * @description
 *
 * This function checks whether an asserted point in time--the `asOf` time--falls
 * between a certificate's validity `notBefore` and `notAfter` times.
 *
 * @param cert The certificate whose validity time is to be checked.
 * @param asOf The point in time against which the validity time is to be checked.
 * @returns A `boolean` indicating whether the `asOf` time falls within the
 *  certificate's validity times.
 *
 * @function
 */
export
function certIsValidTime (cert: Certificate, asOf: Date): boolean {
    const notBefore = getDateFromTime(cert.toBeSigned.validity.notBefore);
    const notAfter = getDateFromTime(cert.toBeSigned.validity.notAfter);
    if (asOf < notBefore) {
        return false;
    }
    if (asOf > notAfter) {
        return false;
    }
    return true;
}

/**
 * @summary Verify a generic digital signature over raw bytes
 * @description
 *
 * This function verifies a digital signature over raw bytes of data.
 *
 * @param bytes The raw bytes that are to be verified
 * @param alg The algorithm identifier of the signature
 * @param sigValue The signature value
 * @param keyOrSPKI The key object or SubjectPublicKeyInfo
 * @returns A `boolean` indicating whether the signature is valid or not, or
 *  `undefined` if it cannot be determined (e.g. unrecognized algorithm).
 *
 * @function
 */
export
function verifySignature (
    bytes: Uint8Array,
    alg: AlgorithmIdentifier,
    sigValue: Uint8Array,
    keyOrSPKI: SubjectPublicKeyInfo | SubjectAltPublicKeyInfo | KeyObject,
): boolean | undefined {
    const pubKey: KeyObject = keyOrSPKI instanceof KeyObject
        ? keyOrSPKI
        : (() => {
            const spkiBytes: Buffer = ((keyOrSPKI instanceof SubjectPublicKeyInfo)
                ? _encode_SubjectPublicKeyInfo(keyOrSPKI, DER)
                : _encode_SubjectAltPublicKeyInfo(keyOrSPKI, DER)).toBytes();
            const issuerPublicKey = createPublicKey({
                key: spkiBytes,
                format: "der",
                type: "spki",
            });
            return issuerPublicKey;
        })();

    const nodejsDigestName = sigAlgOidToNodeJSDigest.get(alg.algorithm.toString());
    if (!nodejsDigestName) {
        return undefined; // Unknown algorithm.
    }
    const verifier = createVerify(nodejsDigestName);
    verifier.update(bytes);
    const signatureIsValid = verifier.verify(pubKey, sigValue);
    return signatureIsValid;
}

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
export
function verifyAltSignature (subjectCert: Certificate, issuerCert: Certificate): boolean | undefined {
    const issuerAltPublicKeyExt = issuerCert.toBeSigned.extensions
        ?.find((ext) => ext.extnId.isEqualTo(subjectAltPublicKeyInfo["&id"]!));
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
        _encode_TBSCertificate(new TBSCertificate(
            subjectCert.toBeSigned.version,
            subjectCert.toBeSigned.serialNumber,
            subjectCert.toBeSigned.signature,
            subjectCert.toBeSigned.issuer,
            subjectCert.toBeSigned.validity,
            subjectCert.toBeSigned.subject,
            subjectCert.toBeSigned.subjectPublicKeyInfo,
            subjectCert.toBeSigned.issuerUniqueIdentifier,
            subjectCert.toBeSigned.subjectUniqueIdentifier,
            // The altSignatureValue extension is supposed to be removed.
            subjectCert.toBeSigned.extensions
                ?.filter((ext) => !ext.extnId.isEqualTo(altSignatureValue["&id"]!)),
            subjectCert._unrecognizedExtensionsList,
        ), DER),
        _encode_AlgorithmIdentifier(subjectCert.algorithmIdentifier, DER),
        // The native signature is supposed to be excluded.
    ]).toBytes();
    return verifySignature(verificand, sigAlg, sigValue, pubkey);
}

/**
 * @summary Verify the signature on a subject's certificate, given an issuer certificate
 * @description
 *
 * This signature verifies that the asserted subject's certificate was signed
 * by the issuer identified in the issuer certificate.
 *
 * @param subjectCert The subject certificate
 * @param issuerCert The issuer certificate
 *
 * @function
 */
export
function verifyNativeSignature (subjectCert: Certificate, issuerCert: Certificate): boolean | undefined {
    const subjectDER = subjectCert.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(subjectCert.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : _encode_TBSCertificate(subjectCert.toBeSigned, DER).toBytes();
    if (!subjectCert.algorithmIdentifier.algorithm.isEqualTo(subjectCert.toBeSigned.signature.algorithm)) {
        return false; // Signature algorithm OID was altered.
    }
    if (
        subjectCert.algorithmIdentifier.parameters
        && (
            !subjectCert.toBeSigned.signature.parameters
            || !compareElements(
                subjectCert.algorithmIdentifier.parameters,
                subjectCert.toBeSigned.signature.parameters
            )
        )
    ) {
        return false; // Signature algorithm parameters were altered.
    }
    return verifySignature(
        subjectDER,
        subjectCert.algorithmIdentifier,
        packBits(subjectCert.signature),
        issuerCert.toBeSigned.subjectPublicKeyInfo,
    );
}

/**
 * @summary Check if a certificate is revoked in locally-configured CRLs.
 * @description
 *
 * This function checks if a certificate has been revoked (by having its
 * serial number present) in one of the locally-configured CRLs.
 *
 * @param ctx The context object
 * @param cert The certificate
 * @param asOf The point-in-time to check revocation
 * @param options Options pertaining to CRL checking
 * @returns A `boolean` indicating whether the certificate is revoked in any CRL.
 *
 * @function
 */
export
function isRevokedFromConfiguredCRLs (
    ctx: Context,
    cert: Certificate,
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
            && compareDistinguishedName(
                crl.toBeSigned.issuer.rdnSequence,
                cert.toBeSigned.issuer.rdnSequence,
                namingMatcher,
            )
            && crl.toBeSigned.revokedCertificates
                ?.some((rc) => (
                    (rc.serialNumber == cert.toBeSigned.serialNumber)
                    && (getDateFromTime(rc.revocationDate) <= asOf)
                ))
        ));
}

/**
 * @summary Verify a public key certificate per ITU-T Rec. X.509, Section 12.5.1
 * @description
 *
 * This function is an implementation of the public key certificate verification
 * procedures described in ITU-T Recommendation X.509 (2019), Section 12.5.1.
 *
 * @param ctx The context object
 * @param state The certification path processing state
 * @param subjectCert The subject certificate
 * @param issuerCert The issuer certificate
 * @param subjectIndex ?
 * @param readDispatcher An async function that dispatches a local `read` request
 * @param options Options pertaining to signing
 * @returns A promise that resolves to a return code
 */
export
async function verifyBasicPublicKeyCertificateChecks (
    ctx: MeerkatContext,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
    subjectIndex: number,
    readDispatcher: ReadDispatcherFunction,
    options: SigningInfo,
): Promise<number> {
    if (!certIsValidTime(subjectCert, state.validityTime)) {
        return VCP_RETURN_INVALID_TIME;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    const namesMatch = compareDistinguishedName(
        issuerCert.toBeSigned.subject.rdnSequence,
        subjectCert.toBeSigned.issuer.rdnSequence,
        namingMatcher,
    );
    if (!namesMatch) {
        return VCP_RETURN_ISSUER_SUBJECT_MISMATCH;
    }
    const signatureIsValid: boolean | undefined = verifyAltSignature(subjectCert, issuerCert)
        ?? verifyNativeSignature(subjectCert, issuerCert);
    if (!signatureIsValid) {
        return VCP_RETURN_INVALID_SIG;
    }
    if (isRevokedFromConfiguredCRLs(ctx, subjectCert, state.validityTime, options)) {
        return VCP_RETURN_CRL_REVOKED;
    }
    const extsGroupedByOID = groupByOID(subjectCert.toBeSigned.extensions ?? [], (ext) => ext.extnId);
    for (const [ extId, exts ] of Object.entries(extsGroupedByOID)) {
        if (exts.length > 1) {
            return VCP_RETURN_DUPLICATE_EXT;
        }
        const ext = exts[0];
        if (ext.critical && !supportedExtensions.has(extId)) {
            return VCP_RETURN_UNKNOWN_CRIT_EXT;
        }
        const criticalityMandate = extensionMandatoryCriticality.get(extId);
        if (
            (criticalityMandate !== undefined)
            && (criticalityMandate !== (ext.critical ?? false))
        ) {
            return VCP_RETURN_INVALID_EXT_CRIT;
        }
    }

    const basicConstraintsExt: Extension | undefined
        = extsGroupedByOID[basicConstraints["&id"]!.toString()]?.[0];
    const certificatePoliciesExt: Extension | undefined
        = extsGroupedByOID[certificatePolicies["&id"]!.toString()]?.[0];
    const subjectAltNamesExt: Extension | undefined
        = extsGroupedByOID[subjectAltName["&id"]!.toString()]?.[0];
    const authorityKeyIdentifierExt: Extension | undefined
        = extsGroupedByOID[authorityKeyIdentifier["&id"]!.toString()]?.[0];
    const keyUsageExt: Extension | undefined
        = extsGroupedByOID[keyUsage["&id"]!.toString()]?.[0];
    const extKeyUsageExt: Extension | undefined
        = extsGroupedByOID[extKeyUsage["&id"]!.toString()]?.[0];
    const privateKeyUsagePeriodExt: Extension | undefined
        = extsGroupedByOID[privateKeyUsagePeriod["&id"]!.toString()]?.[0];

    const authoritySKIExt = issuerCert.toBeSigned.extensions
        ?.find((ext) => ext.extnId.isEqualTo(subjectKeyIdentifier["&id"]!));
    if (authorityKeyIdentifierExt && authoritySKIExt) {
        const issuerKI = subjectKeyIdentifier
            .decoderFor["&ExtnType"]!(authoritySKIExt.valueElement());
        const authorityKI = authorityKeyIdentifier
            .decoderFor["&ExtnType"]!(authorityKeyIdentifierExt.valueElement());

        if (
            ( // If the keyIdentifier does not match
                authorityKI.keyIdentifier
                && Buffer.compare(authorityKI.keyIdentifier, issuerKI)
            )
            || ( // ...or the serial number does not match
                authorityKI.authorityCertSerialNumber
                && Buffer.compare(
                    authorityKI.authorityCertSerialNumber,
                    issuerCert.toBeSigned.serialNumber,
                )
            )
        ) {
            return VCP_RETURN_AKI_SKI_MISMATCH;
        }
    }

    // Step 12.5.1.b
    const intermediate: boolean = ((subjectIndex > 0) && (subjectIndex < (state.certPath.length - 1)));
    if (intermediate) {
        /**
         * [ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509/en),
         * Section 7.4, states that all CAs are _required_ to have the
         * `basicConstraints` extension. (Yes, this does necessitate all CA
         * certs to be version 3, and the specification acknowledges that.)
         */
        if (!basicConstraintsExt) {
            return VCP_RETURN_NO_BASIC_CONSTRAINTS_CA;
        }
        if (!basicConstraintsExt.critical) {
            // BasicConstraints must always be critical for a CA.
            return VCP_RETURN_INVALID_EXT_CRIT;
        }
        const bc = basicConstraints.decoderFor["&ExtnType"]!(basicConstraintsExt.valueElement());
        if (!bc.cA) {
            return VCP_RETURN_BASIC_CONSTRAINTS_CA; // Not permitted to be a CA.
        }
        if (bc.pathLenConstraint !== undefined) {
            let pathLenUsed = subjectIndex - 1;
            const certPath = state.certPath;
            /**
             * Self-signed certificates are ignored for path length constraints.
             */
            for (let i = 0; i < subjectIndex; i++) {
                const subjectCert2 = certPath[i];
                const selfIssued = compareDistinguishedName(
                    subjectCert2.toBeSigned.issuer.rdnSequence,
                    subjectCert2.toBeSigned.subject.rdnSequence,
                    namingMatcher,
                );
                if (selfIssued) {
                    pathLenUsed--;
                }
            }
            if (pathLenUsed > bc.pathLenConstraint) {
                return VCP_RETURN_BASIC_CONSTRAINTS_PATH_LEN; // Exceeded PLC.
            }
        }
    }

    const selfIssued = compareDistinguishedName(
        subjectCert.toBeSigned.issuer.rdnSequence,
        subjectCert.toBeSigned.subject.rdnSequence,
        namingMatcher,
    );
    const selfIssuedIntermediate: boolean = (selfIssued && intermediate);
    if (state.valid_policy_tree) {
        state.valid_policy_tree.levels.push({
            cert: subjectCert,
            nodes: [],
        });
    }
    if (certificatePoliciesExt) {
        const certPolicies = certificatePolicies.decoderFor["&ExtnType"]!(certificatePoliciesExt.valueElement());
        const anyPolicyNode = certPolicies.find((cpol) => cpol.policyIdentifier.isEqualTo(anyPolicy));

        // IETF RFC 5280, Section 6.1.3.d
        if (state.valid_policy_tree) {
            const levels = state.valid_policy_tree.levels;
            const levelN = levels[levels.length - 1];
            const levelNMinus1: ValidPolicyLevel = levels[levels.length - 2];
            const previousLevelNodes = levelNMinus1.nodes;

            let non_any_match: boolean = false;
            let any_policy_parent_node: ValidPolicyNode | undefined;
            for (const pol of certPolicies) {
                if (pol.policyIdentifier.isEqualTo(anyPolicy)) {
                    continue;
                }
                const p_oid = pol.policyIdentifier;
                const p_q = pol.policyQualifiers;
                for (const parentNode of previousLevelNodes) {
                    // IETF RFC 5280, Section 6.1.3.d.1.i
                    if (parentNode.expected_policy_set.has(p_oid.toString())) {
                        non_any_match = true;
                        levelN.nodes.push({
                            valid_policy: p_oid,
                            qualifier_set: p_q ?? [],
                            expected_policy_set: new Set([ p_oid.toString() ]),
                            parent: parentNode,
                            nchild: 0,
                        });
                    }
                    if (parentNode.valid_policy.isEqualTo(anyPolicy)) {
                        // REVIEW: Does it matter if there are multiple nodes with anyPolicy? Is that even possible?
                        any_policy_parent_node = parentNode;
                    }
                }
            }

            // IETF RFC 5280, Section 6.1.3.d.1.ii
            if (!non_any_match && any_policy_parent_node) {
                levelN.nodes.push(
                    ...certPolicies
                        .filter((cp) => !cp.policyIdentifier.isEqualTo(anyPolicy))
                        .map((cp): ValidPolicyNode => ({
                            valid_policy: cp.policyIdentifier,
                            qualifier_set: cp.policyQualifiers ?? [],
                            expected_policy_set: new Set([ cp.policyIdentifier.toString() ]),
                            nchild: 0,
                            parent: any_policy_parent_node,
                        })),
                );
            }

            // IETF RFC 5280, Section 6.1.3.d.2
            // I actually think you could just check if any-policy is used first
            // and replicate all policies to the child nodes, but I am not
            // confident in my understanding of this algorithm, so I am going to
            // do it "by the book."
            if (
                anyPolicyNode
                && (
                    (state.pending_constraints.inhibit_any_policy.skipCertificates > 0)
                    || selfIssuedIntermediate
                )
            ) {
                /* #region index the levelN nodes by parent */
                /**
                 * If you were to iterate over every parent node, then for every
                 * expected policy, you looped over all of the children to check
                 * that it is represented, this would run in O(n^2), which could
                 * be catastrophically slow in some circumstances. This would be
                 * a naive implementation.
                 *
                 * This code pre-indexes the expected policies that already have
                 * a level-N node by the level-N-1 node so that the subsequent
                 * loop runs in O(n) time.
                 */
                const alreadyPresentChildrenByParent: Map<ValidPolicyNode, Set<string>> = new Map();
                for (const node of levelN.nodes) {
                    if (!node.parent) {
                        continue;
                    }
                    const v = alreadyPresentChildrenByParent.get(node.parent);
                    if (v) {
                        v.add(node.valid_policy.toString());
                    } else {
                        alreadyPresentChildrenByParent.set(node.parent, new Set([ node.valid_policy.toString() ]));
                    }
                }
                /* #endregion */
                for (const node of levelNMinus1.nodes) {
                    const alreadyPresent = alreadyPresentChildrenByParent.get(node);
                    for (const expectedPolicy of node.expected_policy_set.values()) {
                        if (!alreadyPresent?.has(expectedPolicy)) {
                            levelN.nodes.push({
                                valid_policy: ObjectIdentifier.fromString(expectedPolicy),
                                // Read carefully: needs to be the qualifiers of the anyPolicy parent node.
                                qualifier_set: anyPolicyNode.policyQualifiers ?? [],
                                expected_policy_set: new Set([ expectedPolicy ]),
                                parent: node,
                                nchild: 0,
                            });
                            if (alreadyPresent) {
                                alreadyPresent.add(expectedPolicy);
                            } else {
                                alreadyPresentChildrenByParent.set(node, new Set([ expectedPolicy ]));
                            }
                        }
                    }
                }
            }
        }

        // 12.5.1.d
        for (const pol of certPolicies) {
            if (pol.policyIdentifier.isEqualTo(anyPolicy)) {
                continue;
            }
            // 12.5.1.d
            // Index the [path-depth] column by policy ID (Map<oid-string, row-number[]>)
        }
        if (
            !anyPolicyNode
            || (state.inhibit_any_policy_indicator && !selfIssuedIntermediate)
        ) {
            // 12.5.1.e
        } else if (anyPolicyNode && !state.inhibit_any_policy_indicator) {
            // 12.5.1.f
        }
    } else { // The certificatePolicies extension is not present.
        // 12.5.1.c
        state.authorities_constrained_policy_set = [];

        // IETF RFC 5280, Section 6.1.3.e
        state.valid_policy_tree = null;
    }

    /**
     * According to [ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509/en),
     * Section 9.2.2.3, even if this extension is marked as non-critical, the
     * relying party shall still validate key usage if it understands the
     * extension.
     */
    if (keyUsageExt /* && keyUsageExt.critical */) {
        const ku = keyUsage.decoderFor["&ExtnType"]!(keyUsageExt.valueElement());
        /**
         * NOTE: The end-entity key usage is not checked in this function, but
         * rather, returned in the result object so that the caller can use the
         * key usages correctly. CA certificates must have `keyCertSign` usage.
         */
        if (intermediate && (ku[KeyUsage_keyCertSign] !== TRUE_BIT)) {
            return VCP_RETURN_BAD_KEY_USAGE;
        }
        if (!intermediate) {
            state.endEntityKeyUsage = ku;
        }
    }

    if (extKeyUsageExt) {
        const eku = extKeyUsage
            .decoderFor["&ExtnType"]!(extKeyUsageExt.valueElement());
        if (!intermediate) {
            state.endEntityExtKeyUsage = eku;
        }
    }

    /**
     * This extension is only checked if the cert path is used to verify a
     * recently-generated signature.
     */
    if (!intermediate && privateKeyUsagePeriodExt) {
        const pkup = privateKeyUsagePeriod
            .decoderFor["&ExtnType"]!(privateKeyUsagePeriodExt.valueElement());
        state.endEntityPrivateKeyNotBefore = pkup.notBefore;
        state.endEntityPrivateKeyNotAfter = pkup.notAfter;
    }

    const aiaExt = extsGroupedByOID[authorityInfoAccess["&id"]!.toString()]?.[0];
    if (aiaExt && !state.validityTime) { // We can't
        const ocspCheckiness = options.ocspCheckiness;
        if (ocspCheckiness >= 0) {
            const ocspResult = await checkOCSP(
                ctx,
                aiaExt,
                [
                    issuerCert.toBeSigned.subject,
                    issuerCert.toBeSigned.subjectPublicKeyInfo,
                ],
                subjectCert.toBeSigned.serialNumber,
                ctx.config.tls,
            );
            if (ocspResult) {
                return ocspResult;
            }
        }
    }

    // NOTE: if the extension is marked as critical, the remote CRL MUST be checked.
    const crldpExt = extsGroupedByOID[cRLDistributionPoints["&id"]!.toString()]?.[0];
    if (crldpExt && crldpExt.critical) { // TODO: Make config options: ignore_critical or always_check.
        const crlResult = await checkRemoteCRLs(
            ctx,
            crldpExt,
            subjectCert.toBeSigned.serialNumber,
            [issuerCert.toBeSigned.subject, issuerCert.toBeSigned.subjectPublicKeyInfo],
            readDispatcher,
            options,
        );
        if (crlResult) {
            return crlResult;
        }
    }

    // IETF RFC 5280, Section 6.1.3.d.3
    if (state.valid_policy_tree) {
        const levels = state.valid_policy_tree.levels;
        const levelN = levels[levels.length - 1];
        const levelNMinus1: ValidPolicyLevel = levels[levels.length - 2];
        let currentLevel = levelN;
        let pruningLevel = levelNMinus1;
        let minus = 2;
        while (pruningLevel) {
            const previousLevelNodesWithChildren: Set<ValidPolicyNode> = new Set();
            for (const node of currentLevel.nodes) {
                if (!node.parent) {
                    continue;
                }
                previousLevelNodesWithChildren.add(node.parent);
            }
            const beforeLength = pruningLevel.nodes.length;
            pruningLevel.nodes = pruningLevel.nodes
                .filter((n) => previousLevelNodesWithChildren.has(n));
            const afterLength = pruningLevel.nodes.length;
            if (afterLength === beforeLength) {
                break; // There is no need to recurse up the tree any further.
            }
            currentLevel = pruningLevel;
            pruningLevel = levels[levels.length - (++minus)];
        }
    }

    // Step 12.5.1.g
    if (!selfIssuedIntermediate) {
        // Step 12.5.1.g
        const subjectAltNames = subjectAltNamesExt
            ? subjectAltName.decoderFor["&ExtnType"]!(subjectAltNamesExt.valueElement())
            : [];
        const namesToValidate: GeneralName[] = [
            {
                directoryName: subjectCert.toBeSigned.subject,
            },
            ...subjectAltNames,
        ];

        for (const name of namesToValidate) {
            const permittedBySubtrees: boolean = state.permitted_subtrees
                .some((subtree) => dnWithinGeneralSubtree(name, subtree, namingMatcher));
            if (state.permitted_subtrees.length && !permittedBySubtrees) {
                return VCP_RETURN_NAME_NOT_PERMITTED; // Not permitted name.
            }
            const excludedBySubtree: boolean = state.excluded_subtrees
                .some((subtree) => dnWithinGeneralSubtree(name, subtree, namingMatcher));
            if (excludedBySubtree) {
                return VCP_RETURN_NAME_EXCLUDED; // Explicitly excluded name.
            }
        }

        // Step 12.5.1.h
        // It is not clear to me how to use the name forms.
    }

    return VCP_RETURN_OK;
}

/**
 * @summary Verify a public key certificate per ITU-T Rec. X.509, Section 12.5.2
 * @description
 *
 * This function is an implementation of the public key certificate verification
 * procedures described in ITU-T Recommendation X.509 (2019), Section 12.5.2.
 *
 * @param ctx The context object
 * @param state The certification path processing state
 * @param subjectCert The subject certificate
 * @returns A new certification path processing state
 *
 * @function
 */
export
function processIntermediateCertificates (
    ctx: Context,
    state: VerifyCertPathState,
    subjectCert: Certificate,
): VerifyCertPathState {
    const extsGroupedByOID = groupByOID(subjectCert.toBeSigned.extensions ?? [], (ext) => ext.extnId);
    for (const ext of Object.values(extsGroupedByOID)) {
        if (ext.length > 1) {
            return {
                ...state,
                returnCode: VCP_RETURN_DUPLICATE_EXT,
            };
        }
    }

    const nameConstraintsExt: Extension | undefined = extsGroupedByOID[nameConstraints["&id"]!.toString()]?.[0];
    const policyConstraintsExt: Extension | undefined = extsGroupedByOID[policyConstraints["&id"]!.toString()]?.[0];
    const inhibitAnyPolicyExt: Extension | undefined = extsGroupedByOID[inhibitAnyPolicy["&id"]!.toString()]?.[0];
    const policyMappingsExt: Extension | undefined = extsGroupedByOID[policyMappings["&id"]!.toString()]?.[0];

    if (state.policy_mapping_inhibit_indicator) {
        // TODO: Section 12.5.2.3
    } else { // Section 12.5.2.4
        const pc = policyConstraintsExt
            ? policyConstraints.decoderFor["&ExtnType"]!(policyConstraintsExt.valueElement())
            : undefined;
        if (pc?.inhibitPolicyMapping !== undefined) {
            if (pc.inhibitPolicyMapping === 0) {
                state.policy_mapping_inhibit_indicator = true;
            } else {
                if (state.pending_constraints.policy_mapping_inhibit.pending) {
                    state.pending_constraints.policy_mapping_inhibit.skipCertificates = Math.min(
                        Number(pc.inhibitPolicyMapping),
                        state.pending_constraints.policy_mapping_inhibit.skipCertificates,
                    );
                } else {
                    // In this case, we assume that `state...skipCertificates`
                    // is `0`.
                    state.pending_constraints.policy_mapping_inhibit.skipCertificates = Number(pc.inhibitPolicyMapping);
                }
                state.pending_constraints.policy_mapping_inhibit.pending = true;
            }
        }
    }

    if (policyMappingsExt && state.valid_policy_tree) {
        const pm = policyMappings.decoderFor["&ExtnType"]!(policyMappingsExt.valueElement());
        if (pm.length < 1) {
            return {
                ...state,
                returnCode: VCP_RETURN_MALFORMED,
            };
        }
        // It also says in ITU Recommendation X.509 (2019), Section 9.2.2.7 that this should never be done...
        // IETF RFC 5280, Section 6.1.4.a
        if (pm.some((p) => p.issuerDomainPolicy.isEqualTo(anyPolicy) || p.subjectDomainPolicy.isEqualTo(anyPolicy))) {
            return {
                ...state,
                returnCode: VCP_RETURN_MALFORMED,
            };
        }

        // We index the policy mapping so we can translate level-N in a single pass.
        const policyMappingsMap = groupByOID(pm, (p) => p.issuerDomainPolicy);

        // IETF RFC 5280, Section 6.1.4.b.1
        const levels = state.valid_policy_tree.levels;
        const levelN = levels[levels.length - 1];
        const levelNMinus1 = levels[levels.length - 2];
        if (!state.policy_mapping_inhibit_indicator) { // IETF RFC 5280, Section 6.1.4.b.1
            const mapped_policies: Set<IndexableOID> = new Set();
            // The expected policy set in nodes of N-1 are not getting changed.
            for (const node of levelN.nodes) {
                for (const ep of node.expected_policy_set) {
                    const pmsOfSameIssuerPolicy = policyMappingsMap[ep];
                    if (pmsOfSameIssuerPolicy) {
                        const id_p = pmsOfSameIssuerPolicy[0].issuerDomainPolicy.toString();
                        node.expected_policy_set = new Set(pmsOfSameIssuerPolicy.map((s) => s.subjectDomainPolicy.toString()));
                        mapped_policies.add(id_p);
                    }
                }
            }

            // ...Paragraph 2
            const any_pol_in_level_N_minus_1 = levelNMinus1.nodes.find((n) => n.valid_policy.isEqualTo(anyPolicy));
            const any_pol_in_level_N = levelN.nodes.find((n) => n.valid_policy.isEqualTo(anyPolicy));
            if (!mapped_policies.size && any_pol_in_level_N && any_pol_in_level_N_minus_1) {
                for (const [ idp, sdps ] of Object.entries(policyMappingsMap)) {
                    const oid = ObjectIdentifier.fromString(idp);
                    // If no node of depth i has a valid_policy of ID-P...
                    if (!mapped_policies.has(idp)) {
                        levelN.nodes.push({
                            valid_policy: oid,
                            qualifier_set: any_pol_in_level_N.qualifier_set ?? [],
                            expected_policy_set: new Set(sdps.map((s) => s.subjectDomainPolicy.toString())),
                            parent: any_pol_in_level_N_minus_1,
                            nchild: 0,
                        });
                    }
                }
            }
        } else { // IETF RFC 5280, Section 6.1.4.b.2
            for (const sdps of Object.values(policyMappingsMap)) {
                const ID_P = sdps[0].issuerDomainPolicy;
                // IETF RFC 5280, Section 6.1.4.b.2.i
                levelN.nodes = levelN.nodes.filter((n) => n.valid_policy.isEqualTo(ID_P));

                // IETF RFC 5280, Section 6.1.4.b.2.ii
                // TODO: This code was copied and might be able to be refactored out into a separate function.
                let currentLevel = levelN;
                let pruningLevel = levelNMinus1;
                let minus = 2;
                while (pruningLevel) {
                    const previousLevelNodesWithChildren: Set<ValidPolicyNode> = new Set();
                    for (const node of currentLevel.nodes) {
                        if (!node.parent) {
                            continue;
                        }
                        previousLevelNodesWithChildren.add(node.parent);
                    }
                    const beforeLength = pruningLevel.nodes.length;
                    pruningLevel.nodes = pruningLevel.nodes
                        .filter((n) => previousLevelNodesWithChildren.has(n));
                    const afterLength = pruningLevel.nodes.length;
                    if (afterLength === beforeLength) {
                        break; // There is no need to recurse up the tree any further.
                    }
                    currentLevel = pruningLevel;
                    pruningLevel = levels[levels.length - (++minus)];
                }
            }
        }
    }

    if (nameConstraintsExt && nameConstraintsExt.critical) {
        const names = nameConstraints.decoderFor["&ExtnType"]!(nameConstraintsExt.valueElement());

        // Section 12.5.2.1
        if (names.permittedSubtrees) {
            // Intersection, meaning that you have to REMOVE the subtrees that are not common to both.
            const oldPermittedSubtrees: Map<string, GeneralSubtree> = new Map(
                state.permitted_subtrees.map((ps) => [
                    `${ps.minimum ?? 0}:${ps.maximum ?? Infinity}:${generalNameToString(ps.base)}`,
                    ps,
                ]),
            );
            state.permitted_subtrees = names.permittedSubtrees
                .filter((ps) => oldPermittedSubtrees
                    .has(`${ps.minimum ?? 0}:${ps.maximum ?? Infinity}:${generalNameToString(ps.base)}`));
        }

        // Section 12.5.2.2
        if (names.excludedSubtrees) {
            // Union
            state.excluded_subtrees.push(...names.excludedSubtrees);
        }
    }

    // TODO: Section 12.5.2.5

    const namingMatcher = getNamingMatcherGetter(ctx);
    const selfIssued = compareDistinguishedName(
        subjectCert.toBeSigned.issuer.rdnSequence,
        subjectCert.toBeSigned.subject.rdnSequence,
        namingMatcher,
    );

    // Section 12.5.2.6
    if (!state.inhibit_any_policy_indicator) {
        if (
            state.pending_constraints.inhibit_any_policy.pending
            && !selfIssued
        ) {
            state.pending_constraints.inhibit_any_policy.skipCertificates--;
            if (state.pending_constraints.inhibit_any_policy.skipCertificates === 0) {
                state.pending_constraints.inhibit_any_policy.pending = false;
                state.inhibit_any_policy_indicator = true;
            }
        }
        if (inhibitAnyPolicyExt) {
            const iap = inhibitAnyPolicy.decoderFor["&ExtnType"]!(inhibitAnyPolicyExt.valueElement());
            if (iap === 0) {
                state.inhibit_any_policy_indicator = true;
            } else {
                state.pending_constraints.inhibit_any_policy.pending = true;
                state.pending_constraints.inhibit_any_policy.skipCertificates = Math.min(
                    Number(iap),
                    state.pending_constraints.inhibit_any_policy.skipCertificates,
                );
            }
        }
    }

    return {
        ...state,
        path_depth: state.path_depth + 1,
    };
}

/**
 * @summary Verify a public key certificate per ITU-T Rec. X.509, Section 12.5.3
 * @description
 *
 * This function is an implementation of the public key certificate verification
 * procedures described in ITU-T Recommendation X.509 (2019), Section 12.5.3.
 *
 * @param ctx The context object
 * @param state The certification path processing state
 * @param subjectCert The subject certificate
 * @param subjectIndex ?
 * @returns A new certification path processing state
 *
 * @function
 */
export
function processExplicitPolicyIndicator (
    ctx: Context,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    subjectIndex: number,
): VerifyCertPathState {
    if (state.explicit_policy_indicator) {
        return state;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    const selfIssued = compareDistinguishedName(
        subjectCert.toBeSigned.issuer.rdnSequence,
        subjectCert.toBeSigned.subject.rdnSequence,
        namingMatcher,
    );
    const intermediate: boolean = ((subjectIndex > 0) && (subjectIndex < (state.certPath.length - 1)));
    const selfIssuedIntermediate: boolean = (selfIssued && intermediate);
    const previousSkipCertsValue = state.pending_constraints.explicit_policy.skipCertificates;
    // Section 12.5.3.1
    if (
        state.pending_constraints.explicit_policy.pending
        && !selfIssuedIntermediate
    ) {
        const newSkipCerts = Math.max(0, state.pending_constraints.explicit_policy.skipCertificates - 1);
        state.pending_constraints.explicit_policy = {
            pending: (newSkipCerts > 0),
            skipCertificates: newSkipCerts,
        };
        if (state.pending_constraints.explicit_policy.skipCertificates === 0) {
            state.explicit_policy_indicator = true;
        }
    }

    const policyConstraintsExt: Extension | undefined = subjectCert.toBeSigned.extensions
        ?.find((ext) => ext.extnId.isEqualTo(policyConstraints["&id"]!));
    const pc = policyConstraintsExt
        ? policyConstraints.decoderFor["&ExtnType"]!(policyConstraintsExt.valueElement())
        : undefined;
    if (pc?.requireExplicitPolicy !== undefined) {
        // Bullet #2
        if (pc.requireExplicitPolicy > 0) {
            if (state.pending_constraints.explicit_policy.pending) {
                state.pending_constraints.explicit_policy.skipCertificates = Math.min(
                    Number(pc.requireExplicitPolicy),
                    previousSkipCertsValue,
                );
            } else {
                state.pending_constraints.explicit_policy.skipCertificates = Number(pc.requireExplicitPolicy);
            }
            state.pending_constraints.explicit_policy.pending = true;
        } else if (pc.requireExplicitPolicy === 0) {
            state.explicit_policy_indicator = true;
        } else {
            return {
                ...state,
                returnCode: VCP_RETURN_MALFORMED, // SkipCerts cannot be negative. Invalid cert.
            };
        }
        // TODO: Bullet #3
    }
    return state;
}

/**
 * @summary Verify an end-entity certificate
 * @description
 *
 * This function verifies an end-entity public key certificate in a
 * certification path.
 *
 * @param ctx The context object
 * @param state The certification path processing state
 * @param subjectCert The subject certificate
 * @param issuerCert The issuer certificate
 * @param readDispatcher An async function that dispatches a local `read` request
 * @param options Options pertaining to signing
 * @returns A promise resolving to a new certification path processing state
 *
 * @async
 * @function
 */
export
async function verifyEndEntityCertificate (
    ctx: MeerkatContext,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
    readDispatcher: ReadDispatcherFunction,
    options: SigningInfo,
): Promise<VerifyCertPathState> {
    const basicChecksResult = await verifyBasicPublicKeyCertificateChecks(
        ctx,
        state,
        subjectCert,
        issuerCert,
        0,
        readDispatcher,
        options,
    );
    if (basicChecksResult) {
        return {
            ...state,
            returnCode: basicChecksResult,
        };
    }
    return state;
}

/**
 * @summary Verify an intermediate certificate
 * @description
 *
 * This function verifies an intermediate public key certificate in a
 * certification path.
 *
 * @param ctx The context object
 * @param state The certification path processing state
 * @param subjectCert The subject certificate
 * @param issuerCert The issuer certificate
 * @param subjectIndex ?
 * @param readDispatcher An async function that dispatches a local `read` request
 * @param options Options pertaining to signing
 * @returns A promise resolving to a new certification path processing state
 *
 * @async
 * @function
 */
export
async function verifyIntermediateCertificate (
    ctx: MeerkatContext,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
    subjectIndex: number,
    readDispatcher: ReadDispatcherFunction,
    options: SigningInfo,
): Promise<VerifyCertPathState> {
    const basicChecksResult = await verifyBasicPublicKeyCertificateChecks(
        ctx,
        state,
        subjectCert,
        issuerCert,
        subjectIndex,
        readDispatcher,
        options,
    );
    if (basicChecksResult) {
        return {
            ...state,
            returnCode: basicChecksResult,
        };
    }
    return processIntermediateCertificates(ctx, state, subjectCert);
}

/**
 * @summary Verify an X.509 trust anchor
 * @description
 *
 * Interestingly, X.509 does not say to do any validation of trust anchors...
 * We are still going to do a little anyway.
 *
 * @param ctx The context object
 * @param cert The certificate that may or may not be a trust anchor
 * @returns A promise resolving to a return code
 *
 * @async
 * @function
 */
export
async function verifyCACertificate (
    ctx: MeerkatContext,
    cert: Certificate,
    trustAnchors: TrustAnchorList,
    asOf: Date,
    readDispatcher: ReadDispatcherFunction,
    options: SigningInfo,
): Promise<number> {
    const trustAnchor = trustAnchors?.find((ta) => {
        if ("certificate" in ta) {
            const tatbs = ta.certificate.toBeSigned;
            const tbs = cert.toBeSigned;
            /**
             * NOTE: Because we are comparing the digital signatures here,
             * we don't have to be thorough with comparing the trust anchor
             * with the asserted CA cert. All the checks before the digital
             * signature are basically to avoid more computationally
             * expensive comparisons afterward.
             */
            return (
                !Buffer.compare(
                    Buffer.from(tatbs.serialNumber.buffer, tatbs.serialNumber.byteOffset, tatbs.serialNumber.byteLength),
                    Buffer.from(tbs.serialNumber.buffer, tbs.serialNumber.byteOffset, tbs.serialNumber.byteLength),
                )
                && (tatbs.issuer.rdnSequence.length === tbs.issuer.rdnSequence.length)
                && (tatbs.subject.rdnSequence.length === tbs.subject.rdnSequence.length)
                && (tatbs.extensions?.length === tbs.extensions?.length)
                && (tatbs.subjectPublicKeyInfo.algorithm.algorithm
                    .isEqualTo(tbs.subjectPublicKeyInfo.algorithm.algorithm))
                && !Buffer.compare(
                    Buffer.from(tatbs.subjectPublicKeyInfo.subjectPublicKey),
                    Buffer.from(tbs.subjectPublicKeyInfo.subjectPublicKey)
                )
                && (ta.certificate.algorithmIdentifier.algorithm
                    .isEqualTo(cert.algorithmIdentifier.algorithm))
                && !Buffer.compare(
                    Buffer.from(ta.certificate.signature),
                    Buffer.from(cert.signature),
                )
            );
        } else if ("tbsCert" in ta) {
            const tatbs = ta.tbsCert;
            const tbs = cert.toBeSigned;
            /**
             * NOTE: Unlike the `certificate` alternative of the trust
             * anchor choice, there is no digital signature, so comparison
             * is not quite as straightforward. However, we can say that,
             * among trust anchors, the tuple of
             * (subject, serialNumber, subjectPublicKeyInfo) SHOULD be
             * globally unique, so we can just check those fields.
             */
            return (
                !Buffer.compare(
                    Buffer.from(tatbs.serialNumber),
                    Buffer.from(tbs.serialNumber),
                )
                && (tatbs.issuer.rdnSequence.length === cert.toBeSigned.issuer.rdnSequence.length)
                && (tatbs.subject.rdnSequence.length === cert.toBeSigned.subject.rdnSequence.length)
                && (tatbs.extensions?.length === tbs.extensions?.length)
                && (tatbs.subjectPublicKeyInfo.algorithm.algorithm
                    .isEqualTo(tbs.subjectPublicKeyInfo.algorithm.algorithm))
                && !Buffer.compare(
                    Buffer.from(tatbs.subjectPublicKeyInfo.subjectPublicKey),
                    Buffer.from(tbs.subjectPublicKeyInfo.subjectPublicKey)
                )
            );
        } else if ("taInfo" in ta) {
            // TODO: Respect the certPolicyFlags from taInfo.
            return (
                (ta.taInfo.exts?.length === cert.toBeSigned.extensions?.length)
                && (ta.taInfo.pubKey.algorithm.algorithm.isEqualTo(cert.toBeSigned.subjectPublicKeyInfo.algorithm.algorithm))
                && !Buffer.compare(
                    Buffer.from(ta.taInfo.pubKey.subjectPublicKey),
                    Buffer.from(cert.toBeSigned.subjectPublicKeyInfo.subjectPublicKey),
                )
            );
        } else {
            return false; // Unrecognized alternative.
        }
    });
    if (!trustAnchor) {
        return VCP_RETURN_UNTRUSTED_ANCHOR; // not trusted
    }
    if (!certIsValidTime(cert, asOf)) {
        return VCP_RETURN_INVALID_TIME;
    }
    if (isRevokedFromConfiguredCRLs(ctx, cert, asOf, options)) {
        return VCP_RETURN_CRL_REVOKED;
    }

    const extsGroupedByOID = groupByOID(cert.toBeSigned.extensions ?? [], (ext) => ext.extnId);
    for (const [ extId, exts ] of Object.entries(extsGroupedByOID)) {
        if (exts.length > 1) {
            return VCP_RETURN_DUPLICATE_EXT;
        }
        const ext = exts[0];
        if (exts[0].critical && !supportedExtensions.has(extId)) {
            return VCP_RETURN_UNKNOWN_CRIT_EXT;
        }
        const criticalityMandate = extensionMandatoryCriticality.get(extId);
        if (
            (criticalityMandate !== undefined)
            && (criticalityMandate !== ext.critical)
        ) {
            return VCP_RETURN_INVALID_EXT_CRIT;
        }
    }

    const aiaExt = extsGroupedByOID[authorityInfoAccess["&id"]!.toString()]?.[0];
    if (aiaExt) {
        // It would be weird for a Root CA to revoke itself, but we'll check anyway.
        const ocspResult = await checkOCSP(
            ctx,
            aiaExt,
            [
                cert.toBeSigned.subject,
                cert.toBeSigned.subjectPublicKeyInfo,
            ],
            cert.toBeSigned.serialNumber,
            ctx.config.signing,
        );
        if (ocspResult) {
            return ocspResult;
        }
    }

    // NOTE: if the extension is marked as critical, the remote CRL MUST be checked.
    const crldpExt = extsGroupedByOID[cRLDistributionPoints["&id"]!.toString()]?.[0];
    if (crldpExt && crldpExt.critical) { // TODO: Make config options: ignore_critical or always_check.
        const crlResult = await checkRemoteCRLs(
            ctx,
            crldpExt,
            cert.toBeSigned.serialNumber,
            [cert.toBeSigned.subject, cert.toBeSigned.subjectPublicKeyInfo],
            readDispatcher,
            options,
        );
        if (crlResult) {
            return crlResult;
        }
    }

    // We don't check anything else in the trust anchor intentionally.
    return 0;
}

// From OpenSSL in `crypto/x509/pcy_tree.c`.
/**
 * @summary Calculate the set of valid user certificate policies.
 * @description
 *
 * I basically just paraphrased this function from OpenSSL's
 * `crypto/x509/pcy_tree.c`, which is an implementation of the algorithm in
 * IETF RFC 5280, since the description of the algorithm for evaluating
 * certification policy compliance in ITU-T Recommendation X.509 (2019), section
 * 12, is absolutely obtuse.
 *
 * @param tree The valid policy tree
 * @param policy_oids The initial-policy-set
 * @param auth_nodes The valid policy nodes
 * @returns A set of new valid policy nodes
 *
 * @function
 */
export
function tree_calculate_user_set (
    tree: ValidPolicyTree,
    policy_oids: OBJECT_IDENTIFIER[], // This is the initial-policy-set
    auth_nodes: ValidPolicyNode[],
): ValidPolicyNode[] {
    const userPolicies: ValidPolicyNode[] = [];
    let node: ValidPolicyNode | undefined;

    /*
     * Check if anyPolicy present in authority constrained policy set: this
     * will happen if it is a leaf node.
     */
    if (policy_oids.length === 0) {
        return [];
    }

    // anyPolicy = tree->levels[tree->nlevel - 1].anyPolicy;
    const anyPolicyNode = tree.levels[tree.levels.length - 1].nodes
        .find((n) => n.valid_policy.isEqualTo(anyPolicy));

    for (let i = 0; i < policy_oids.length; i++) {
        const oid = policy_oids[i];
        if (oid.isEqualTo(anyPolicy)) {
            tree.anyPolicy = true;
            return [];
        }
    }

    /**
     * I think the OpenSSL implementation simply doesn't check for duplicated
     * policies.
     */
    const returnedPolicies: Set<IndexableOID> = new Set();
    for (let i = 0; i < policy_oids.length; i++) {
        const oid = policy_oids[i];
        node = auth_nodes.find((n) => n.valid_policy.isEqualTo(oid));
        if (!node) {
            if (!anyPolicyNode) {
                continue;
            }
            /*
            * Create a new node with policy ID from user set and qualifiers
            * from anyPolicy.
            */
            const extra: ValidPolicyData = {
                valid_policy: oid,
                expected_policy_set: new Set(),
                qualifier_set: anyPolicyNode?.qualifier_set ?? [],
            };
            // I think these flags are only needed by OpenSSL for memory management.
            // extra->flags = POLICY_DATA_FLAG_SHARED_QUALIFIERS | POLICY_DATA_FLAG_EXTRA_NODE;
            // node = ossl_policy_level_add_node(NULL, extra, anyPolicy->parent, tree);
            node = {
                parent: anyPolicyNode?.parent,
                valid_policy: extra.valid_policy,
                expected_policy_set: extra.expected_policy_set,
                qualifier_set: extra.qualifier_set,
                nchild: 0,
            };
            // extra_data.push(node);
            // I don't actually see how this is used.
        }
        const key = node.valid_policy.toString();
        if (!returnedPolicies.has(key)) {
            userPolicies.push(node);
            returnedPolicies.add(key);
        }
    }
    return userPolicies;
}

/**
 * @summary Calculate the authority set of certificate policies
 * @description
 *
 * I basically just paraphrased this function from OpenSSL's
 * `crypto/x509/pcy_tree.c`, which is an implementation of the algorithm in
 * IETF RFC 5280, since the description of the algorithm for evaluating
 * certification policy compliance in ITU-T Recommendation X.509 (2019), section
 * 12, is absolutely obtuse.
 *
 * @param tree The valid policy tree
 * @param pnodes The valid policy nodes
 *
 * @function
 */
export
function tree_calculate_authority_set (
    tree: ValidPolicyTree,
    pnodes: Box<ValidPolicyNode[]>,
): void {
    let addnodes: ValidPolicyNode[] = [];
    let curr_i: number = tree.levels.length - 1;
    let curr = tree.levels[curr_i];

    const currAnyPolicyNode = curr.nodes.find((n) => n.valid_policy.isEqualTo(anyPolicy));
    if (currAnyPolicyNode) {
        tree.auth_policies.push(currAnyPolicyNode);
        addnodes = pnodes.ref;
    } else {
        addnodes = tree.auth_policies;
    }

    curr_i = 0;
    curr = tree.levels[curr_i];
    /**
     * I don't think the OpenSSL implementation even attempts to deduplicate
     * returned values.
     */
    const returnedPolicies: Map<IndexableOID, ValidPolicyNode> = new Map();
    /**
     * I also don't think OpenSSL filters out other matching policies,
     */
    for (let i = 1; i < tree.levels.length; i++) {
        /**
         * REVIEW: This implementation came from OpenSSL, but can there really
         * only be one anyPolicy node in a given level? This seems like it might
         * be a bug.
         */
        const anyptr = curr.nodes.find((n) => n.valid_policy.isEqualTo(anyPolicy));
        /*
         * If no anyPolicy node on this level it can't appear on lower
         * levels so end search.
         */
        if (!anyptr)
            break;
        curr_i++;
        curr = tree.levels[curr_i];
        for (let j = 0; j < curr.nodes.length; j++) {
            const node = curr.nodes[j];
            /**
             * This was not in the original OpenSSL implementation, but I think
             * it is correct.
             */
            if (node.valid_policy.isEqualTo(anyPolicy)) {
                continue;
            }
            if (node.parent === anyptr) {
                const key = node.valid_policy.toString();
                const addedNode = returnedPolicies.get(key);
                if (!addedNode) {
                    /**
                     * We set the qualifier set to empty, because we will
                     * re-populate it later.
                     *
                     * Search for this UUID to see where these qualifiers will
                     * be re-introduced: e16de9e1-b64b-48ad-9048-0c9bc21f8f50
                     */
                    const returnedNode: ValidPolicyNode = {
                        ...node,
                        qualifier_set: [],
                    };
                    addnodes.push(returnedNode);
                    returnedPolicies.set(key, returnedNode);
                }
            }
        }
    }

    /**
     * This is not in the OpenSSL implementation, but I think that's because
     * none of the specifications say how qualifiers are supposed to
     * "accumulate." For instance, if you have an intermediate certificate with
     * Policy A and no qualifiers, then an end-entity certificate with Policy A
     * and Qualifier Q, should the policy in the
     * `authorities-constrained-policy-set` have qualifier Q?
     *
     * I can't find an answer to this in the specifications, but it sounds like
     * the specifications seem to indicate that the "highest" node in the tree
     * simply has "authority" and that the qualifiers of "lower" nodes are
     * not accumulated.
     *
     * However, NIST PKITS Test 4.8.20 contradicts this, expecting qualifiers of
     * lower nodes to be present in the ACPS, even when those nodes have parents
     * of the same (non-anyPolicy) policy.
     *
     * For a lack of clarity, this function will just iterate over all levels
     * once more and accumulate the qualifiers. In general, it is probably
     * better to include the qualifiers anyway.
     *
     * Theoretically, this loop could be done more efficiently by combining it
     * with the above loops, but I believe that would muck up the code, making
     * its relationship to the original OpenSSL code less clear.
     *
     * e16de9e1-b64b-48ad-9048-0c9bc21f8f50: The qualifiers are reintroduced in
     * this loop. Search for the above UUID to see where the qualifiers are
     * removed from the policy node before returning them.
     */
    for (const level of tree.levels) {
        for (const node of level.nodes) {
            if (!node.qualifier_set?.length) {
                continue;
            }
            const key = node.valid_policy.toString();
            const addedNode = returnedPolicies.get(key);
            if (!addedNode) {
                continue;
            }
            addedNode.qualifier_set.push(...node.qualifier_set);
        }
    }

    if (addnodes === pnodes.ref) {
        /**
         * This is not standard in the OpenSSL implementation. I think the
         * OpenSSL is just incorrect by not doing this.
         */
        if ((pnodes.ref.length === 0) && currAnyPolicyNode) {
            addnodes.push(currAnyPolicyNode);
        }
        return;
    }

    pnodes.ref = tree.auth_policies;
}

/**
 * From OpenSSL in `crypto/x509/pcy_lib.c`.
 */
export
function X509_policy_tree_get0_user_policies (
    tree: ValidPolicyTree | null | undefined,
    user_policies: ValidPolicyNode[],
): ValidPolicyNode[] | null {
    if (!tree) {
        return null;
    }
    if (tree.anyPolicy) {
        return tree.auth_policies;
    } else {
        return user_policies;
    }
}

/**
 * @summary Verify a public key certificate per ITU-T Rec. X.509, Section 12.5.4
 * @description
 *
 * This function is an implementation of the public key certificate verification
 * procedures described in ITU-T Recommendation X.509 (2019), Section 12.5.4.
 *
 * @param args The original arguments object to `verifyCertPath`
 * @param state The certification path processing state
 * @returns A `verifyCertPath` result.
 *
 * @function
 */
export
function finalProcessing (
    args: VerifyCertPathArgs,
    state: VerifyCertPathState,
): VerifyCertPathResult {
    const authority_set_policies: Map<IndexableOID, ValidPolicyNode> = new Map();
    const user_constrained_policies: PolicyInformation[] = [];
    const user_set: ValidPolicyNode[] = [];

    if (state.valid_policy_tree) {
        const auth_nodes: Box<ValidPolicyNode[]> = { ref: [] };
        tree_calculate_authority_set(state.valid_policy_tree, auth_nodes);
        for (const node of auth_nodes.ref) {
            authority_set_policies.set(node.valid_policy.toString(), node);
        }
        user_set.push(...tree_calculate_user_set(state.valid_policy_tree, args.initial_policy_set, auth_nodes.ref));
        const intersection = X509_policy_tree_get0_user_policies(state.valid_policy_tree, user_set);
        if (intersection) {
            for (const node of intersection) {
                user_constrained_policies.push(new PolicyInformation(
                    node.valid_policy,
                    node.qualifier_set?.length // There is a SIZE constraint of (1..MAX)
                        ? node.qualifier_set
                        : undefined,
                ));
            }
        }
    } else {
        // Do nothing. Allow authority_set_policies to remain empty.
    }

    const userNotices: string[] = [];
    for (const ucp of user_constrained_policies) {
        for (const pq of ucp.policyQualifiers ?? []) {
            if (!pq.policyQualifierId.isEqualTo(ietfUserNoticeOID)) {
                continue;
            }
            if (!pq.qualifier) {
                continue;
            }
            const displayTextElement = pq.qualifier.sequence
                .find((el) => el.tagNumber !== ASN1UniversalType.sequence);
            if (!displayTextElement) {
                continue;
            }
            const unoticeText = displayTextToString(displayTextElement);
            if (!unoticeText) {
                continue;
            }
            userNotices.push(unoticeText);
        }
    }

    const ret: VerifyCertPathResult = {
        returnCode: state.returnCode ?? 0,
        authorities_constrained_policies: Array
            .from(authority_set_policies.values())
            .map((node) => new PolicyInformation(
                node.valid_policy,
                node.qualifier_set?.length // There is a SIZE constraint of (1..MAX)
                    ? node.qualifier_set
                    : undefined,
            )),
        explicit_policy_indicator: state.explicit_policy_indicator,
        policy_mappings_that_occurred: [], // FIXME:
        user_constrained_policies,
        warnings: [],
        endEntityKeyUsage: state.endEntityKeyUsage,
        endEntityExtKeyUsage: state.endEntityExtKeyUsage,
        endEntityPrivateKeyNotBefore: state.endEntityPrivateKeyNotBefore,
        endEntityPrivateKeyNotAfter: state.endEntityPrivateKeyNotAfter,
        userNotices,
    };

    if (state.explicit_policy_indicator) {
        if (authority_set_policies.size === 0) {
            return {
                ...ret,
                returnCode: VCP_RETURN_NO_AUTHORIZED_POLICIES,
            };
        }
        if (user_constrained_policies.length === 0) {
            return {
                ...ret,
                returnCode: VCP_RETURN_POLICY_NOT_ACCEPTABLE,
            };
        }
    }
    return ret;
}

/**
 * @summary Verify an X.509 certification path
 * @description
 *
 * Certification path processing, per ITU Recommendation X.509 (2019), Section
 * 12.
 *
 * @param ctx
 * @param args
 * @returns
 *
 * @async
 * @function
 */
export
async function verifyCertPath (
    ctx: MeerkatContext,
    args: VerifyCertPathArgs,
    config?: Partial<SigningInfo>,
): Promise<VerifyCertPathResult> {
    const path = args.certPath;
    const caCert = path[path.length - 1];
    const options: SigningInfo = _.merge({}, config, ctx.config.signing);

    if (options.permittedSignatureAlgorithms?.size) {
        for (const cert of path) {
            if (!options.permittedSignatureAlgorithms.has(cert.algorithmIdentifier.algorithm.toString())) {
                return {
                    returnCode: VCP_RETURN_PROHIBITED_SIG_ALG,
                    authorities_constrained_policies: [],
                    explicit_policy_indicator: args.initial_explicit_policy,
                    policy_mappings_that_occurred: [],
                    user_constrained_policies: [],
                    warnings: [],
                    endEntityExtKeyUsage: undefined,
                    endEntityKeyUsage: undefined,
                    endEntityPrivateKeyNotAfter: undefined,
                    endEntityPrivateKeyNotBefore: undefined,
                    userNotices: [],
                };
            }
        }
    }

    // The initialization step, defined in ITU Recommendation X.509 (2019), Section 12.4.
    const initialState: VerifyCertPathState = {
        validityTime: args.validityTime,
        certPath: [ ...args.certPath ],
        authorities_constrained_policy_set: [
            [ new PolicyInformation(anyPolicy, undefined), new PolicyInformation(anyPolicy, undefined) ],
        ],
        valid_policy_tree: {
            auth_policies: [],
            anyPolicy: false,
            levels: [{
                cert: caCert,
                nodes: [
                    {
                        nchild: 0,
                        valid_policy: anyPolicy,
                        qualifier_set: [],
                        expected_policy_set: new Set([ anyPolicy.toString() ]),
                    },
                ],
            }],
        },
        permitted_subtrees: [ ...args.initial_permitted_subtrees_set ],
        excluded_subtrees: [ ...args.initial_excluded_subtrees_set ],
        required_name_forms: [ ...args.initial_required_name_forms ],
        explicit_policy_indicator: args.initial_explicit_policy,
        path_depth: 1,
        policy_mapping_inhibit_indicator: args.initial_policy_mapping_inhibit,
        inhibit_any_policy_indicator: args.initial_inhibit_any_policy,
        pending_constraints: {
            explicit_policy: {
                pending: false,
                skipCertificates: 0,
            },
            inhibit_any_policy: {
                pending: false,
                // IETF RFC 5280, Section 6.1.2.e
                skipCertificates: args.initial_inhibit_any_policy
                    ? 0
                    : args.certPath.length + 1,
            },
            policy_mapping_inhibit: {
                pending: false,
                skipCertificates: 0,
            },
        },
    };

    if (!path.length) {
        return verifyCertPathFail(-1);
    }
    const readDispatcher = getReadDispatcher(ctx);
    const caResult = await verifyCACertificate(
        ctx,
        caCert,
        args.trustAnchors,
        args.validityTime,
        readDispatcher,
        options,
    );
    if (caResult) {
        return verifyCertPathFail(caResult);
    }
    let state: VerifyCertPathState = initialState;
    for (let i = path.length - 2; i >= 1; i--) {
        const issuerCert = path[i + 1];
        const subjectCert = path[i];
        const intermediateResult = await verifyIntermediateCertificate(
            ctx,
            state,
            subjectCert,
            issuerCert,
            i,
            readDispatcher,
            options,
        );
        if (intermediateResult.returnCode) {
            return verifyCertPathFail(intermediateResult.returnCode);
        }
        state = intermediateResult;
    }
    const endEntityCertificate = path[0];
    const endEntityIssuerCert = path[1];
    if (!endEntityIssuerCert) {
        // We should just return now if there is only one cert in the chain.
        return {
            returnCode: state.returnCode ?? 0,
            authorities_constrained_policies: [], // FIXME:
            explicit_policy_indicator: state.explicit_policy_indicator,
            policy_mappings_that_occurred: [], // FIXME:
            user_constrained_policies: [], // FIXME:
            warnings: [], // FIXME:
            endEntityPrivateKeyNotBefore: state.endEntityPrivateKeyNotBefore,
            endEntityPrivateKeyNotAfter: state.endEntityPrivateKeyNotAfter,
            userNotices: [],
        };
    }
    const endEntityResult = await verifyEndEntityCertificate(
        ctx,
        state,
        endEntityCertificate,
        endEntityIssuerCert,
        readDispatcher,
        options,
    );
    let explicitPolicyProcessingState = endEntityResult;
    const certs = [ ...explicitPolicyProcessingState.certPath ].reverse();
    for (let i = 0; i < certs.length; i++) {
        const cert = certs[i];
        explicitPolicyProcessingState = processExplicitPolicyIndicator(
            ctx,
            explicitPolicyProcessingState,
            cert,
            i,
        );
    }
    return finalProcessing(args, explicitPolicyProcessingState);
}
