import { DERElement } from "@wildboar/asn1";
import { DER, _encodeObjectIdentifier, _encodeOctetString, _encodeGeneralizedTime } from "@wildboar/asn1/functional";
import { createHash, createSign, KeyObject } from "node:crypto";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/AuthenticationFramework";
import {
    Attribute,
    _encode_Attribute,
} from "@wildboar/x500/InformationFramework";
import {
    id_messageDigest,
    id_contentType,
    id_signingTime,
    CMSVersion_v1,
    CMSVersion_v3,
    ContentInfo,
    id_signedData,
    SignedData,
    _encode_SignedData,
    EncapsulatedContentInfo,
    SignerInfo,
    IssuerAndSerialNumber,
} from "@wildboar/cms";
import { sigAlgToHashAlg } from "../pki/sigAlgToHashAlg.js";
import { keyTypeToAlgOID } from "../pki/keyTypeToAlgOID.js";
import { digestOIDToNodeHash } from "../pki/digestOIDToNodeHash.js";
import type { PkiPath } from "@wildboar/pki-stub";
import type {
    CertificateList,
} from "@wildboar/x500/AuthenticationFramework";

/**
 * @summary Create a Cryptographic Message Syntax `SignedData` object
 * @description
 *
 * This can be used to produce P7B files, which contain a public key
 * certification path, which is signed by the private key it corresponds to.
 *
 * @param key The private key to use for signing.
 * @param certPath The certification path
 * @param ecinfo The `EncapsulatedContentInfo` of the thing to be signed.
 * @param crls A list of CRLs to include
 * @param signingTime If supplied, the `signingTime` attribute will be populated
 *  with its value.
 * @returns The CMS `ContentInfo` object.
 *
 * @function
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
        .fromSet(signedAttrs.map((attr) => _encode_Attribute(attr)))
        .toBytes();
    signer.update(signedAttrBytes);

    const signedData = new SignedData(
        CMSVersion_v3, // v3 because eContentInfo is not of type id-data.
        [
            new AlgorithmIdentifier(
                digestOID,
                undefined,
            ),
        ],
        ecinfo,
        certPath.map((certificate) => ({ certificate })),
        crls?.map((crl) => ({ crl })),
        [
            new SignerInfo(
                CMSVersion_v1, // Must be 1 because we used `issuerAndSerialNumber`.
                {
                    issuerAndSerialNumber: new IssuerAndSerialNumber(
                        eeCert.toBeSigned.issuer,
                        eeCert.toBeSigned.serialNumber,
                    ),
                },
                new AlgorithmIdentifier(
                    sigOID,
                    undefined,
                ),
                signedAttrs,
                new AlgorithmIdentifier(
                    digestOID,
                    undefined,
                ),
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
