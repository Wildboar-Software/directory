import type { MeerkatContext } from "../ctx";
import type { Context } from "@wildboar/meerkat-types";
import { CONTEXT } from "../constants";
import {
    Controller,
    Get,
    Render,
    Inject,
    Req,
    Res,
    NotFoundException,
    InternalServerErrorException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { BIT_STRING, DERElement, packBits } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import { stringifyDN } from "../x500/stringifyDN";
import { getDateFromTime } from "@wildboar/x500";
import {
    Certificate,
    _decode_Certificate,
    _encode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import { groupByOID } from "../utils/groupByOID";
import {
    subjectDirectoryAttributes,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectDirectoryAttributes.oa";
import {
    subjectKeyIdentifier,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/subjectKeyIdentifier.oa";
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
import generalNameToString from "@wildboar/x500/src/lib/stringifiers/generalNameToString";
import type {
    GeneralSubtree,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralSubtree.ta";
import type {
    AttributesSyntax,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/AttributesSyntax.ta";
import {
    _encode_SubjectPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type {
    CertificateList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateList.ta";
import { createHash, KeyObject, createPrivateKey } from "node:crypto";
import * as path from "node:path";
import {
    cRLNumber,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/cRLNumber.oa";
import {
    statusReferrals,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/statusReferrals.oa";
import {
    cRLStreamIdentifier,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/cRLStreamIdentifier.oa";
import {
    orderedList,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/orderedList.oa";
import {
    deltaInfo,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/deltaInfo.oa";
import {
    toBeRevoked,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/toBeRevoked.oa";
import {
    revokedGroups,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/revokedGroups.oa";
import {
    expiredCertsOnCRL,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/expiredCertsOnCRL.oa";
// import {
//     reasonCode,
// } from "@wildboar/x500/src/lib/modules/CertificateExtensions/reasonCode.oa";
// import {
//     holdInstructionCode,
// } from "@wildboar/x500/src/lib/modules/CertificateExtensions/holdInstructionCode.oa";
// import {
//     invalidityDate,
// } from "@wildboar/x500/src/lib/modules/CertificateExtensions/invalidityDate.oa";
import type {
    TrustAnchorChoice,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorChoice.ta";
import type {
    TrustAnchorInfo,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorInfo.ta";
import type {
    TBSCertificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/TBSCertificate.ta";
import {
    TrustAnchorList,
    _encode_TrustAnchorList,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorList.ta";
import {
    id_ct_trustAnchorList,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/id-ct-trustAnchorList.va";
import {
    ContentInfo,
    _encode_ContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/ContentInfo.ta";
import {
    EncapsulatedContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EncapsulatedContentInfo.ta";
import { PEMObject } from "pem-ts";
import { createCMSSignedData } from "../pki/createCMSSignedData";
import { PkiPath } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/PkiPath.ta";
import { id_data } from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-data.va";
import {
    CertificationRequest,
    _encode_CertificationRequest,
} from "@wildboar/pkcs/src/lib/modules/PKCS-10/CertificationRequest.ta";
import {
    CertificationRequestInfo,
    _encode_CertificationRequestInfo,
} from "@wildboar/pkcs/src/lib/modules/PKCS-10/CertificationRequestInfo.ta";
import {
    CertificationRequestInfo_version_v1,
} from "@wildboar/pkcs/src/lib/modules/PKCS-10/CertificationRequestInfo-version.ta";
import { generateSIGNED } from "../pki/generateSIGNED";
import {
    _encode_PkiPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/PkiPath.ta";

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

function printBitString (bits: BIT_STRING) {
    let str: string = "";
    for (const bit of bits) {
        str += bit.toString();
    }
    return str;
}

function printSubtree (subtree: GeneralSubtree) {
    return `From ${subtree.minimum ?? 0} to ${subtree.maximum ?? Infinity}: ${generalNameToString(subtree.base)}`;
}

function breakIntoLines (str: string, lineLength: number): string[] {
    const lines: string[] = [];
    for (let i = 0; i < str.length; i = i + lineLength) {
        lines.push(str.slice(i, i + lineLength));
    }
    return lines;
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
                value: generalNameToString(gn), // TODO: Write a generalNameToString that uses the context object.
            });
        }
    }
    const issuerAltNameExt = extsGroupedByOID[issuerAltName["&id"]!.toString()]?.[0];
    if (issuerAltNameExt) {
        const decoded = issuerAltName.decoderFor["&ExtnType"]!(issuerAltNameExt.valueElement());
        for (const gn of decoded) {
            values.push({
                key: "Issuer Alternative Name",
                value: generalNameToString(gn), // TODO: Write a generalNameToString that uses the context object.
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
                value: printSubtree(subtree),
            });
        }
        for (const subtree of decoded.excludedSubtrees ?? []) {
            values.push({
                key: "Name Constraint: Excluded Subtree",
                value: printSubtree(subtree),
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
                        lines.push(`Full Name: ${generalNameToString(fullName)}`);
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
                value: generalNameToString(authorityName),
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
                value: `Access method ${aia.accessMethod.toString()}: ${generalNameToString(aia.accessLocation)}`,
            });
        }
    }
    const subjectInfoAccessExt = extsGroupedByOID[subjectInfoAccess["&id"]!.toString()]?.[0];
    if (subjectInfoAccessExt) {
        const decoded = subjectInfoAccess.decoderFor["&ExtnType"]!(subjectInfoAccessExt.valueElement());
        for (const sia of decoded) {
            values.push({
                key: "Subject Info Access",
                value: `Access method ${sia.accessMethod.toString()}: ${generalNameToString(sia.accessLocation)}`,
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
                lines.push(`Issuer: ${generalNameToString(ref.issuer)}`);
            }
            if (ref.location) {
                lines.push(`Location: ${generalNameToString(ref.location)}`);
            }
            if (ref.deltaRefInfo) {
                const dri = generalNameToString(ref.deltaRefInfo.deltaLocation);
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
        const dl = generalNameToString(decoded.deltaLocation);
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
                lines.push(`Issuer: ${generalNameToString(tbr.certificateIssuer)}`);
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
                lines.push(`Name Subtree: ${generalNameToString(gn)}`);
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
                lines.push(`Issuer: ${generalNameToString(rg.certificateIssuer)}`);
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
                lines.push(`Name Subtree: ${generalNameToString(gn)}`);
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
                    value: printSubtree(subtree),
                });
            }
            for (const subtree of nc.excludedSubtrees ?? []) {
                values.push({
                    key: "Name Constraint: Excluded Subtree",
                    value: printSubtree(subtree),
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
        subjectPublicKeyInfo as any, // FIXME: update asn1-ts.
        [],
    );
    const opCSR = generateSIGNED(ctx, csrInfo, _encode_CertificationRequestInfo, key);
    if (!("signed" in opCSR)) {
        return null;
    }
    const signedCSRInfo = opCSR.signed;
    const csr = new CertificationRequest(
        csrInfo,
        signedCSRInfo.algorithmIdentifier as any, // FIXME: update asn1-ts.
        signedCSRInfo.signature,
    );
    return _encode_CertificationRequest(csr, DER).toBytes();
}

function createPublicKeyFile (cert: Certificate): string {
    const der = _encode_SubjectPublicKeyInfo(cert.toBeSigned.subjectPublicKeyInfo, DER).toBytes();
    const pem = new PEMObject("PUBLIC KEY", der);
    return pem.encoded;
}

@Controller()
export class PkiController {

    constructor (
        @Inject(CONTEXT) readonly ctx: MeerkatContext,
    ) {}

    @Get("/signing-certs")
    @Render("certs")
    public signingCerts () {
        const certs = this.ctx.config.signing.certPath ?? [];
        return {
            type: "signing",
            certs: [ ...certs ].reverse().map((cert, index) => ({
                ...renderCert(this.ctx, cert),
                position: index + 1,
            })),
        };
    }

    @Get("/signing-crls")
    @Render("crls")
    public signingCRLs () {
        const crls = this.ctx.config.signing.certificateRevocationLists ?? [];
        return {
            type: "signing",
            crls: crls.map((crl, index) => ({
                ...renderCRL(this.ctx, crl),
                position: index + 1,
            })),
        };
    }

    @Get("/signing-anchors")
    @Render("anchors")
    public signingAnchors () {
        const trustAnchors = this.ctx.config.signing.trustAnchorList ?? [];
        return {
            type: "signing",
            anchors: trustAnchors.map((ta, index) => ({
                ...renderTrustAnchor(this.ctx, ta),
                position: index + 1,
            })),
        };
    }

    @Get("/pki/signing/certs.pem")
    public signingCertsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!process.env.MEERKAT_SIGNING_CERTS_CHAIN_FILE) {
            throw new NotFoundException();
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

    @Get("/pki/signing/crls.pem")
    public signingCRLsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!process.env.MEERKAT_SIGNING_CRL_FILE) {
            throw new NotFoundException();
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

    @Get("/pki/signing/trust-anchor-list.pem")
    public signingAnchorsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        if (download) {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pem-file");
        } else {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        }
        const der = createTrustAnchorInfoFile(this.ctx.config.signing.trustAnchorList);
        const pem = new PEMObject("TRUST ANCHOR LIST", der);
        res.send(pem.encoded);
    }

    @Get("/pki/signing/trust-anchor-list.cmsc")
    public signingAnchorsDer (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/cms");
        res.send(createTrustAnchorInfoFile(this.ctx.config.signing.trustAnchorList));
    }

    @Get("/pki/signing/trust-anchor-list-signed.pem")
    public signingAnchorsSignedPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        if (download) {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pem-file");
        } else {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        }
        const der = createSignedTrustAnchorInfoFile(this.ctx, this.ctx.config.signing.trustAnchorList);
        if (!der) {
            throw new InternalServerErrorException();
        }
        const pem = new PEMObject("TRUST ANCHOR LIST", der);
        res.send(pem.encoded);
    }

    @Get("/pki/signing/trust-anchor-list-signed.cmsc")
    public signingAnchorsSignedDer (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/cms");
        const der = createSignedTrustAnchorInfoFile(this.ctx, this.ctx.config.signing.trustAnchorList);
        if (!der) {
            throw new InternalServerErrorException();
        }
        res.send(der);
    }

    @Get("/pki/signing/certs.p7b")
    public signingChainP7b (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        const asPem: boolean = (req.query["pem"] === "1");
        if (asPem && !download) {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        } else {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pkcs7-certificates");
        }
        const der = createSigningP7B(this.ctx);
        if (!der) {
            throw new InternalServerErrorException();
        }
        if (asPem) {
            const pem = new PEMObject("PKCS7", der);
            res.send(pem.encoded);
        } else {
            res.send(der);
        }
    }

    @Get("/pki/attribute-certs.pem")
    public attributeCertsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!process.env.MEERKAT_ATTR_CERT_CHAIN_FILE) {
            throw new InternalServerErrorException();
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

    @Get("/pki/signing/signing.csr")
    public getCSR (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const key = this.ctx.config.signing.key;
        const certPath = this.ctx.config.signing.certPath;
        const cert = certPath && certPath[certPath?.length - 1];
        if (!cert || !key) {
            throw new InternalServerErrorException("No configured certificate or key.");
        }
        const der = createCSR(this.ctx, key, cert);
        if (!der) {
            throw new InternalServerErrorException("Failed to generate.");
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

    @Get("/pki/signing/public-key.pem")
    public getPublicKey (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const certPath = this.ctx.config.signing.certPath;
        const cert = certPath && certPath[certPath?.length - 1];
        if (!cert) {
            throw new InternalServerErrorException();
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

    @Get("/pki/signing/certs.pkipath")
    public getPkiPath (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const certPath = this.ctx.config.signing.certPath;
        if (!certPath) {
            throw new InternalServerErrorException();
        }
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/pkix-pkipath");
        const der = _encode_PkiPath(certPath, DER).toBytes();
        res.send(der);
    }

    // TLS Endpoints

    @Get("/tls-certs")
    @Render("certs")
    public tlsCerts () {
        const certsFile = this.ctx.config.tls.cert as string;
        if (!certsFile) {
            throw new InternalServerErrorException();
        }
        const certs = PEMObject.parse(certsFile)
            .map((p) => {
                const el = new DERElement();
                el.fromBytes(p.data);
                return _decode_Certificate(el);
            });
        return {
            type: "tls",
            certs: certs.map((cert, index) => ({
                ...renderCert(this.ctx, cert),
                position: index + 1,
            })),
        };
    }

    @Get("/tls-crls")
    @Render("crls")
    public tlsCRLs () {
        const crls = this.ctx.config.tls.certificateRevocationLists ?? [];
        return {
            type: "tls",
            crls: crls.map((crl, index) => ({
                ...renderCRL(this.ctx, crl),
                position: index + 1,
            })),
        };
    }

    @Get("/tls-anchors")
    @Render("anchors")
    public tlsAnchors () {
        const trustAnchors = this.ctx.config.tls.trustAnchorList ?? [];
        return {
            type: "tls",
            anchors: trustAnchors.map((ta, index) => ({
                ...renderTrustAnchor(this.ctx, ta),
                position: index + 1,
            })),
        };
    }

    @Get("/pki/tls/certs.pem")
    public tlsCertsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!process.env.MEERKAT_TLS_CERT_FILE) {
            throw new NotFoundException();
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

    @Get("/pki/tls/crls.pem")
    public tlsCRLsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!process.env.MEERKAT_TLS_CRL_FILE) {
            throw new NotFoundException();
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

    @Get("/pki/tls/trust-anchor-list.pem")
    public tlsAnchorsPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        if (download) {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pem-file");
        } else {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        }
        const der = createTrustAnchorInfoFile(this.ctx.config.tls.trustAnchorList);
        const pem = new PEMObject("TRUST ANCHOR LIST", der);
        res.send(pem.encoded);
    }

    @Get("/pki/tls/trust-anchor-list.cmsc")
    public tlsAnchorsDer (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/cms");
        res.send(createTrustAnchorInfoFile(this.ctx.config.tls.trustAnchorList));
    }

    @Get("/pki/tls/trust-anchor-list-signed.pem")
    public tlsAnchorsSignedPem (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        if (download) {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pem-file");
        } else {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        }
        const der = createSignedTrustAnchorInfoFile(this.ctx, this.ctx.config.tls.trustAnchorList);
        if (!der) {
            throw new InternalServerErrorException();
        }
        const pem = new PEMObject("TRUST ANCHOR LIST", der);
        res.send(pem.encoded);
    }

    @Get("/pki/tls/trust-anchor-list-signed.cmsc")
    public tlsAnchorsSignedDer (
        @Res() res: Response,
    ) {
        res.setHeader("Content-Disposition", "attachment");
        res.contentType("application/cms");
        const der = createSignedTrustAnchorInfoFile(this.ctx, this.ctx.config.tls.trustAnchorList);
        if (!der) {
            throw new InternalServerErrorException();
        }
        res.send(der);
    }

    @Get("/pki/tls/certs.p7b")
    public tlsChainP7b (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const download: boolean = (req.query["download"] === "1");
        const asPem: boolean = (req.query["pem"] === "1");
        if (asPem && !download) {
            res.setHeader("Content-Disposition", "inline");
            res.contentType("text/plain; charset=utf-8");
        } else {
            res.setHeader("Content-Disposition", "attachment");
            res.contentType("application/x-pkcs7-certificates");
        }
        const der = createTLSP7B(this.ctx);
        if (!der) {
            throw new InternalServerErrorException();
        }
        if (asPem) {
            const pem = new PEMObject("PKCS7", der);
            res.send(pem.encoded);
        } else {
            res.send(der);
        }
    }

    @Get("/pki/tls/tls.csr")
    public getTlsCsr (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const keyFile = this.ctx.config.tls?.key;
        const certsFile = this.ctx.config.tls.cert as string;
        if (!keyFile || !certsFile) {
            throw new InternalServerErrorException();
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
            passphrase: this.ctx.config.tls.passphrase,
        });
        const der = createCSR(this.ctx, key, certPath[0]);
        if (!der) {
            throw new InternalServerErrorException("Failed to generate.");
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

    @Get("/pki/tls/public-key.pem")
    public getTlsPublicKey (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const certsFile = this.ctx.config.tls.cert as string;
        if (!certsFile) {
            throw new InternalServerErrorException();
        }
        const certPath = PEMObject.parse(certsFile)
            .map((p) => {
                const el = new DERElement();
                el.fromBytes(p.data);
                return _decode_Certificate(el);
            });
        const cert = certPath && certPath[certPath?.length - 1];
        if (!cert) {
            throw new InternalServerErrorException();
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

    @Get("/pki/tls/certs.pkipath")
    public getTlsPkiPath (
        @Req() req: Request,
        @Res() res: Response,
    ) {
        const certsFile = this.ctx.config.tls.cert as string;
        if (!certsFile) {
            throw new InternalServerErrorException();
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

/*
https://localhost:18080/pki/attribute-certs.pem
https://localhost:18080/pki/attribute-certs.pem?download=1
https://localhost:18080/pki/signing/certs.pem
https://localhost:18080/pki/signing/crls.pem
https://localhost:18080/pki/signing/trust-anchor-list.pem
https://localhost:18080/pki/signing/trust-anchor-list.cmsc
https://localhost:18080/pki/signing/trust-anchor-list-signed.pem
https://localhost:18080/pki/signing/trust-anchor-list-signed.cmsc
https://localhost:18080/pki/signing/certs.p7b
https://localhost:18080/pki/signing/signing.csr
https://localhost:18080/pki/signing/public-key.pem
https://localhost:18080/pki/signing/certs.pkipath
https://localhost:18080/pki/signing/certs.pem?download=1
https://localhost:18080/pki/signing/crls.pem?download=1
https://localhost:18080/pki/signing/trust-anchor-list.pem?download=1
https://localhost:18080/pki/signing/trust-anchor-list.cmsc?download=1
https://localhost:18080/pki/signing/trust-anchor-list-signed.pem?download=1
https://localhost:18080/pki/signing/trust-anchor-list-signed.cmsc?download=1
https://localhost:18080/pki/signing/certs.p7b?download=1
https://localhost:18080/pki/signing/certs.p7b?asPem=1
https://localhost:18080/pki/signing/certs.p7b?download=1&asPem=1
https://localhost:18080/pki/signing/signing.csr?download=1
https://localhost:18080/pki/signing/public-key.pem?download=1

https://localhost:18080/pki/tls/certs.pem
https://localhost:18080/pki/tls/crls.pem
https://localhost:18080/pki/tls/trust-anchor-list.pem
https://localhost:18080/pki/tls/trust-anchor-list.cmsc
https://localhost:18080/pki/tls/trust-anchor-list-signed.pem
https://localhost:18080/pki/tls/trust-anchor-list-signed.cmsc
https://localhost:18080/pki/tls/certs.p7b
https://localhost:18080/pki/tls/signing.csr
https://localhost:18080/pki/tls/public-key.pem
https://localhost:18080/pki/tls/certs.pkipath
*/
}
