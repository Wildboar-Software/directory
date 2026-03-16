import { Buffer } from "node:buffer";
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
import util from "node:util";
import { is_cert_holder } from "./verifyAttrCertPath.js";

describe.skip("is_cert_holder", () => {
    
});
