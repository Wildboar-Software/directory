import type { Context, IndexableOID } from "@wildboar/meerkat-types";
import { Certificate } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta";
import { Extension } from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Extension.ta";
import { DERElement, packBits, OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import compareDistinguishedName from "@wildboar/x500/src/lib/comparators/compareDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { DER } from "asn1-ts/dist/node/functional";
import getDateFromTime from "@wildboar/x500/src/lib/utils/getDateFromTime";
import { createVerify, createPublicKey } from "crypto";
import { subjectAltPublicKeyInfo } from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectAltPublicKeyInfo.oa";
import { altSignatureAlgorithm } from "@wildboar/x500/src/lib/modules/CertificateExtensions/altSignatureAlgorithm.oa";
import { altSignatureValue } from "@wildboar/x500/src/lib/modules/CertificateExtensions/altSignatureValue.oa";
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
import {
    basicConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/basicConstraints.oa";
import {
    certificatePolicies,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/certificatePolicies.oa";
import {
    subjectAltName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectAltName.oa";
import {
    nameConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/nameConstraints.oa";
import {
    inhibitAnyPolicy,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/inhibitAnyPolicy.oa";
import {
    policyConstraints,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/policyConstraints.oa";
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
import { policyMappings } from "@wildboar/x500/src/lib/modules/CertificateExtensions/policyMappings.oa";
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

interface ValidPolicyData {
    // flags
    valid_policy: OBJECT_IDENTIFIER;
    qualifier_set: PolicyQualifierInfo[];
    expected_policy_set: Set<IndexableOID>;
}

interface ValidPolicyNode extends ValidPolicyData {
    // data handled by the above "extends"
    parent?: ValidPolicyNode;
    nchild: number;
}

interface ValidPolicyLevel {
    cert: Certificate;
    nodes: ValidPolicyNode[];
    // anyPolicy?
    // flags?
}

// Meant to mirror the policy tree-related types from OpenSSL's crypto/x509/pcy_local.h.
interface ValidPolicyTree {
    levels: ValidPolicyLevel[];
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

export
function verifyCertPathFail (returnCode: number): VerifyCertPathResult {
    return {
        returnCode,
        authorities_constrained_policies: [],
        explicit_policy_indicator: false,
        policy_mappings_that_occurred: [],
        user_constrained_policies: [],
        warnings: [],
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
}

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

    permitted_subtrees: GeneralSubtrees;

    excluded_subtrees: GeneralSubtrees;

    required_name_forms: NAME_FORM["&id"][];

    explicit_policy_indicator: boolean;

    path_depth: number;

    policy_mapping_inhibit_indicator: boolean;

    inhibit_any_policy_indicator: boolean;

    pending_constraints: {

        explicit_policy: PendingConstraint;

        policy_mapping_inhibit: PendingConstraint;

        inhibit_any_policy: PendingConstraint;

    };

}

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


// rsaEncryption           ID ::= { pkcs-1 rsaEncryption(1)} -- IETF RFC 4055
// id-keyExchangeAlgorithm ID ::= { dodAlgorithms id-keyExchangeAlgorithm(22)}
//                                  -- IETF RFC 3279
// id-dsa                  ID ::= { ansi-x9-57 x9algorithm(4) 1 }   -- IETF RFC 5480
// id-ecPublicKey          ID ::= { ansi-x9-62 keyType(2) 1 }       -- IETF RFC 5480
// id-ecDH                 ID ::= { certicom schemes(1) ecdh(12) }  -- IETF RFC 5480
// id-ecMQV                ID ::= { certicom schemes(1) ecmqv(13) } -- IETF RFC 5480
// dh-public-number        ID ::= { ansi-x9-42 number-type(2) dh-public-number(1) } --IETF RFC 2631
// type KeyObjectGetter = (bytes: Uint8Array) => KeyObject;

// /**
//  * @summary Get a PKCS #1 RSA Public Key from the X.509 SubjectPublicKeyInfo
//  * @description
//  *
//  * From [IETF RFC 4055](https://datatracker.ietf.org/doc/html/rfc4055):
//  *
//  * > The DER encoded RSAPublicKey is carried in the subjectPublicKey BIT STRING
//  * > within the subject public key information.
//  *
//  * @param bytes
//  */
// const getRSAPublicKey: KeyObjectGetter = (bytes: Uint8Array): KeyObject => {
//     createPublicKey({
//         key: Buffer.from(bytes),
//         format: "der",
//         type: "pkcs1",

//     });
// };

// const publicKeyAlgToKeyObjectGetter: Map<string, KeyObjectGetter> = new Map([
//     [ "1.2.840.113549.1.1.1", getRSAPublicKey ], // rsaEncryption
//     // [ "", [ "", "" ] ],
//     // [ "", [ "", "" ] ],
//     // [ "", [ "", "" ] ],
//     // [ "", [ "", "" ] ],
//     // [ "", [ "", "" ] ],
//     // [ "", [ "", "" ] ],
// ]);

// We check validity time first just because we do not want to verify the
// digital signature (it is computationally expensive) if we do not have to.
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

export
function verifySignature (
    bytes: Uint8Array,
    alg: AlgorithmIdentifier,
    sigValue: Uint8Array,
    issuerSPKI: SubjectPublicKeyInfo | SubjectAltPublicKeyInfo,
): boolean | undefined {
    const spkiBytes: Uint8Array = ((issuerSPKI instanceof SubjectPublicKeyInfo)
        ? _encode_SubjectPublicKeyInfo(issuerSPKI, DER)
        : _encode_SubjectAltPublicKeyInfo(issuerSPKI, DER)).toBytes();
    const issuerPublicKey = createPublicKey({
        key: Buffer.from(spkiBytes),
        format: "der",
        type: "spki",
    });
    const nodejsDigestName = sigAlgOidToNodeJSDigest.get(alg.algorithm.toString());
    if (!nodejsDigestName) {
        return undefined; // Unknown algorithm.
    }
    const verifier = createVerify(nodejsDigestName);
    verifier.update(bytes);
    const signatureIsValid = verifier.verify(issuerPublicKey, sigValue);
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
 *
 * @param subjectCert
 * @param issuerCert
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

export
function isRevokedFromConfiguredCRLs (
    ctx: Context,
    cert: Certificate,
    asOf: Date,
): boolean {
    // If the index of revoked certificate serial numbers has this cert's SN,
    // it is worth scanning the CRLs for which cert revoked it.
    if (!ctx.config.tls.revokedCertificateSerialNumbers.has(cert.toBeSigned.serialNumber.toString())) {
        return false;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    return ctx.config.tls.certificateRevocationLists
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

// Section 12.5.1
export
function verifyBasicPublicKeyCertificateChecks (
    ctx: Context,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
    subjectIndex: number,
): number {
    if (!certIsValidTime(subjectCert, state.validityTime)) {
        return -1;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    const namesMatch = compareDistinguishedName(
        issuerCert.toBeSigned.subject.rdnSequence,
        subjectCert.toBeSigned.issuer.rdnSequence,
        namingMatcher,
    );
    if (!namesMatch) {
        return -1;
    }
    const signatureIsValid: boolean | undefined = verifyAltSignature(subjectCert, issuerCert)
        ?? verifyNativeSignature(subjectCert, issuerCert);
    if (!signatureIsValid) {
        return -2;
    }
    if (isRevokedFromConfiguredCRLs(ctx, subjectCert, state.validityTime)) {
        return -5;
    }
    // TODO: Check OCSP
    // TODO: Check remote CRL

    const extsGroupedByOID = groupByOID(subjectCert.toBeSigned.extensions ?? [], (ext) => ext.extnId);
    for (const ext of Object.values(extsGroupedByOID)) {
        if (ext.length > 1) {
            return -3; // Duplicate extensions.
        }
    }

    const basicConstraintsExt: Extension | undefined = extsGroupedByOID[basicConstraints["&id"]!.toString()]?.[0];
    const certificatePoliciesExt: Extension | undefined = extsGroupedByOID[certificatePolicies["&id"]!.toString()]?.[0];
    const subjectAltNamesExt: Extension | undefined = extsGroupedByOID[subjectAltName["&id"]!.toString()]?.[0];

    // Step 12.5.1.b
    const intermediate: boolean = ((subjectIndex > 0) && (subjectIndex < (state.certPath.length - 1)));
    if (intermediate && basicConstraintsExt) {
        const bc = basicConstraints.decoderFor["&ExtnType"]!(basicConstraintsExt.valueElement());
        if (!bc.cA) {
            return -1; // Not permitted to be a CA.
        }
        if (bc.pathLenConstraint !== undefined) {
            const pathLenUsed = subjectIndex - 1;
            if (pathLenUsed > bc.pathLenConstraint) {
                return -1; // Exceeded PLC.
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
                return -4; // Not permitted name.
            }
            const excludedBySubtree: boolean = state.excluded_subtrees
                .some((subtree) => dnWithinGeneralSubtree(name, subtree, namingMatcher));
            if (excludedBySubtree) {
                return -5; // Explicitly excluded name.
            }
        }

        // Step 12.5.1.h
        // It is not clear to me how to use the name forms.
    }

    return 0;
}

// Section 12.5.2
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
                returnCode: -1,
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
                returnCode: -1,
            };
        }
        // IETF RFC 5280, Section 6.1.4.a
        if (pm.some((p) => p.issuerDomainPolicy.isEqualTo(anyPolicy) || p.subjectDomainPolicy.isEqualTo(anyPolicy))) {
            return {
                ...state,
                returnCode: -1,
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
            // FIXME: Something about policy mapping is not working.
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
            const any_pol_in_level_N = levelN.nodes.find((n) => n.valid_policy.isEqualTo(anyPolicy));
            if (!mapped_policies.size && any_pol_in_level_N) {
                for (const [ idp, sdps ] of Object.entries(policyMappingsMap)) {
                    const oid = ObjectIdentifier.fromString(idp);
                    // If no node of depth i has a valid_policy of ID-P...
                    if (!mapped_policies.has(idp)) {
                        assert(any_pol_in_level_N); // ...but there is a node of depth i with a valid_policy of anyPolicy...
                        levelN.nodes.push({
                            valid_policy: oid,
                            qualifier_set: any_pol_in_level_N.qualifier_set ?? [],
                            expected_policy_set: new Set(sdps.map((s) => s.subjectDomainPolicy.toString())),
                            parent: any_pol_in_level_N,
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

    if (nameConstraintsExt) {
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

// Section 12.5.3
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
    // Section 12.5.3.1
    if (
        state.pending_constraints.explicit_policy.pending
        && !selfIssuedIntermediate
    ) {
        state.pending_constraints.explicit_policy = {
            pending: false, // TODO: Does this need to be unset if skipCerts == 0?
            skipCertificates: Math.max(0, state.pending_constraints.explicit_policy.skipCertificates - 1),
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
    if (pc?.requireExplicitPolicy) {
        // Bullet #2
        if (pc.requireExplicitPolicy > 0) {
            state.pending_constraints.explicit_policy.skipCertificates = Number(pc.requireExplicitPolicy);
        } else if (pc.requireExplicitPolicy === 0) {
            state.explicit_policy_indicator = true;
        } else {
            return {
                ...state,
                returnCode: -1, // SkipCerts cannot be negative. Invalid cert.
            };
        }
        // TODO: Bullet #3 does not sound actionable.
    }
    return state;
}

export
function verifyEndEntityCertificate (
    ctx: Context,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
): VerifyCertPathState {
    const basicChecksResult = verifyBasicPublicKeyCertificateChecks(
        ctx,
        state,
        subjectCert,
        issuerCert,
        0,
    );
    if (basicChecksResult) {
        return {
            ...state,
            returnCode: basicChecksResult,
        };
    }
    const pepState = processExplicitPolicyIndicator(ctx, state, subjectCert, 0);
    return pepState;
}

export
function verifyIntermediateCertificate (
    ctx: Context,
    state: VerifyCertPathState,
    subjectCert: Certificate,
    issuerCert: Certificate,
    subjectIndex: number,
): VerifyCertPathState {
    const basicChecksResult = verifyBasicPublicKeyCertificateChecks(
        ctx,
        state,
        subjectCert,
        issuerCert,
        subjectIndex,
    );
    if (basicChecksResult) {
        return {
            ...state,
            returnCode: basicChecksResult,
        };
    }
    const picState = processIntermediateCertificates(ctx, state, subjectCert);
    if (picState.returnCode) {
        return picState;
    }
    const pepState = processExplicitPolicyIndicator(ctx, picState, subjectCert, subjectIndex);
    return pepState;
}

/**
 * @summary Verify an X.509 trust anchor
 * @description
 *
 * Interestingly, X.509 does not say to do any validation of trust anchors...
 * We are still going to do a little anyway.
 *
 * @param ctx
 * @param cert
 * @returns
 */
export
function verifyCACertificate (
    ctx: Context,
    cert: Certificate,
    trustAnchors: TrustAnchorList,
    asOf: Date,
): number {
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
                    Buffer.from(tatbs.serialNumber),
                    Buffer.from(tbs.serialNumber),
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
        return -10; // not trusted
    }
    if (!certIsValidTime(cert, asOf)) {
        return -73;
    }

    if (isRevokedFromConfiguredCRLs(ctx, cert, asOf)) {
        return -5;
    }
    // TODO: Check OCSP?
    // TODO: Check if the trust anchor is in the remote CRL?

    // We don't check anything else in the trust anchor intentionally.
    return 0;
}

// From OpenSSL in `crypto/x509/pcy_tree.c`.
export
function tree_calculate_authority_set (tree: ValidPolicyTree): ValidPolicyNode[] {
    const addnodes: ValidPolicyNode[] = [];
    let curr_i: number = 0;
    let curr = tree.levels[curr_i]; // curr = tree->levels;
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
            if (node.parent === anyptr) {
                addnodes.push(node);
            }
        }
    }
    return addnodes;
}

// ITU Recommendation X.509, Section 12.5.4.
export
function finalProcessing (
    args: VerifyCertPathArgs,
    state: VerifyCertPathState,
): VerifyCertPathResult {
    const authority_set_policies: Map<IndexableOID, ValidPolicyNode> = new Map();

    if (state.valid_policy_tree) {
        if (args.initial_policy_set.some((p) => p.isEqualTo(anyPolicy))) {
            authority_set_policies.set(anyPolicy.toString(), {
                valid_policy: anyPolicy,
                expected_policy_set: new Set(),
                nchild: 0,
                qualifier_set: [],
            });
        } else {
            for (const node of tree_calculate_authority_set(state.valid_policy_tree)) {
                authority_set_policies.set(node.valid_policy.toString(), node);
            }
        }
    } else {
        // Do nothing. Allow authority_set_policies to remain empty.
    }

    return {
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
        user_constrained_policies: [], // FIXME:
        warnings: [], // FIXME:
    };
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
 */
export
function verifyCertPath (ctx: Context, args: VerifyCertPathArgs): VerifyCertPathResult {
    const path = args.certPath;
    const caCert = path[path.length - 1];

    // The initialization step, defined in ITU Recommendation X.509 (2019), Section 12.4.
    const initialState: VerifyCertPathState = {
        validityTime: args.validityTime,
        certPath: [ ...args.certPath ],
        authorities_constrained_policy_set: [
            [ new PolicyInformation(anyPolicy, undefined), new PolicyInformation(anyPolicy, undefined) ],
        ],
        valid_policy_tree: {
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
                skipCertificates: 0,
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
    const caResult = verifyCACertificate(ctx, caCert, args.trustAnchors, args.validityTime);
    if (caResult) {
        return verifyCertPathFail(caResult);
    }
    let state: VerifyCertPathState = initialState;
    for (let i = path.length - 2; i >= 1; i--) {
        const issuerCert = path[i + 1];
        const subjectCert = path[i];
        const intermediateResult = verifyIntermediateCertificate(ctx, state, subjectCert, issuerCert, i);
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
        };
    }
    const endEntityResult = verifyEndEntityCertificate(
        ctx,
        state,
        endEntityCertificate,
        endEntityIssuerCert,
    );
    state.returnCode = endEntityResult.returnCode ?? 0;
    return finalProcessing(args, state);
}
