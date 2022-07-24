import { DERElement } from "asn1-ts";
import { DER, _encodeObjectIdentifier, _encodeOctetString, _encodeGeneralizedTime } from "asn1-ts/dist/node/functional";
import { createHash, createSign, KeyObject } from "node:crypto";
import {
    ContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/ContentInfo.ta";
import {
    id_signedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-signedData.va";
import {
    SignedData,
    _encode_SignedData,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/SignedData.ta";
import {
    EncapsulatedContentInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/EncapsulatedContentInfo.ta";
import {
    SignerInfo,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/SignerInfo.ta";
import {
    IssuerAndSerialNumber,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/IssuerAndSerialNumber.ta";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    Attribute,
    _encode_Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import {
    id_messageDigest,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-messageDigest.va";
import {
    id_contentType,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-contentType.va";
import {
    id_signingTime,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/id-signingTime.va";
import {
    CMSVersion_v1,
    CMSVersion_v3,
} from "@wildboar/cms/src/lib/modules/CryptographicMessageSyntax-2010/CMSVersion.ta";
import { sigAlgToHashAlg } from "../pki/sigAlgToHashAlg";
import { keyTypeToAlgOID } from "../pki/keyTypeToAlgOID";
import { digestOIDToNodeHash } from "../pki/digestOIDToNodeHash";
import type { PkiPath } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/PkiPath.ta";
import type {
    CertificateList,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificateList.ta";

/**
 * This can be used to produce P7B files, which contain a public key
 * certification path, which is signed by the private key it corresponds to.
 *
 * @param key
 * @param certPath
 * @param ecinfo
 * @param crls
 * @param signingTime
 * @returns
 */
export
function createCMSSignedData (
    key: KeyObject,
    certPath: PkiPath,
    ecinfo: EncapsulatedContentInfo,
    crls?: CertificateList[],
    signingTime?: Date,
): ContentInfo | null {
    if (!key.asymmetricKeyType) {
        return null;
    }
    const sigOID = keyTypeToAlgOID.get(key.asymmetricKeyType!);
    if (!sigOID) {
        return null;
    }
    const digestOID = sigAlgToHashAlg.get(sigOID.toString());
    if (!digestOID) {
        return null;
    }
    const nodeHashStr = digestOIDToNodeHash.get(digestOID.toString());
    if (!nodeHashStr) {
        return null;
    }
    const eeCert = certPath[certPath.length - 1];
    if (!eeCert) {
        return null;
    }
    const messageDigester = createHash(nodeHashStr);
    const signer = createSign(nodeHashStr);
    messageDigester.update(ecinfo.eContent!);

    const signedAttrs: Attribute[] = [
        new Attribute(
            id_contentType,
            [_encodeObjectIdentifier(ecinfo.eContentType, DER)],
        ),
        new Attribute(
            id_messageDigest,
            [_encodeOctetString(messageDigester.digest(), DER)],
        ),
    ];

    if (signingTime) {
        signedAttrs.push(new Attribute(
            id_signingTime,
            [_encodeGeneralizedTime(signingTime, DER)],
        ));
    }

    /*
        From IETF RFC 5652:

        A separate encoding of the signedAttrs field is performed for message
        digest calculation. The IMPLICIT [0] tag in the signedAttrs is not used
        for the DER encoding, rather an EXPLICIT SET OF tag is used.  That is,
        the DER encoding of the EXPLICIT SET OF tag, rather than of the
        IMPLICIT [0] tag, MUST be included in the message digest calculation
        along with the length and content octets of the SignedAttributes value.
     */
    const signedAttrBytes = DERElement
        .fromSet(signedAttrs.map((attr) => _encode_Attribute(attr, DER)))
        .toBytes();
    signer.update(signedAttrBytes);

    const signedData = new SignedData(
        CMSVersion_v3, // v3 because eContentInfo is not of type id-data.
        [
            new AlgorithmIdentifier(
                digestOID,
                undefined,
            ) as any, // FIXME: Dedupe asn1-ts versions.
        ],
        ecinfo,
        certPath.map((certificate: any) => ({ certificate })),
        crls?.map((crl) => ({ crl })) as any, // FIXME: Dedupe asn1-ts versions.
        [
            new SignerInfo(
                CMSVersion_v1, // Must be 1 because we used `issuerAndSerialNumber`.
                {
                    issuerAndSerialNumber: new IssuerAndSerialNumber(
                        eeCert.toBeSigned.issuer as any, // FIXME: Dedupe asn1-ts versions.
                        eeCert.toBeSigned.serialNumber,
                    ),
                },
                new AlgorithmIdentifier(
                    sigOID,
                    undefined,
                ) as any, // FIXME: Dedupe asn1-ts versions.
                signedAttrs as any, // FIXME: Dedupe asn1-ts versions.
                new AlgorithmIdentifier(
                    digestOID,
                    undefined,
                ) as any, // FIXME: Dedupe asn1-ts versions.
                signer.sign(key),
                undefined,
            ),
        ],
    );
    return new ContentInfo(
        id_signedData,
        _encode_SignedData(signedData, DER),
    );
}
