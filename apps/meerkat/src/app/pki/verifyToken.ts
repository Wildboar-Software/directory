import type { MeerkatContext } from "../ctx";
import { DERElement, packBits, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import type {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import { verifyAnyCertPath } from "./verifyAnyCertPath";
import { verifySignature, VCP_RETURN_OK } from "./verifyCertPath";
import {
    Token,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/Token.ta";
import {
    _encode_TokenContent,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TokenContent.ta";
import {
    KeyUsage_digitalSignature,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/KeyUsage.ta";
import { id_anyExtendedKeyUsage, id_kp_clientAuth } from "../constants";

export const VT_RETURN_CODE_OK: number = 0;
export const VT_RETURN_CODE_UNTRUSTED: number = 1;
export const VT_RETURN_CODE_INVALID_SIG: number = 2;
export const VT_RETURN_CODE_MALFORMED: number = 3;
export const VT_RETURN_CODE_KEY_USAGE: number = 4;
export const VT_RETURN_CODE_PKUP: number = 5;

/**
 * @summary Verify something that is cryptographically signed with X.509 SIGNED{}
 * @description
 *
 * Verify the digital signatures on `param`, and validate the certification path
 * that asserts the trustworthiness of the signer according to the procedures
 * defined in ITU Recommendation X.509 (2019).
 *
 * @param ctx The context object
 * @param certPath The `CertificationPath` of the argument or result
 *  that signed the `token`.
 * @param token The signed token
 * @returns A boolean indicating whether the token had valid signatures and came
 *  from a trusted certification path.
 *
 * @async
 * @function
 */
export
async function verifyToken (
    ctx: MeerkatContext,
    certPath: CertificationPath,
    token: Token,
): Promise<number> {
    for (const pair of certPath.theCACertificates ?? []) {
        if (!pair.issuedToThisCA) {
            return VT_RETURN_CODE_MALFORMED;
        }
    }
    const vacpResult = await verifyAnyCertPath(
        ctx,
        certPath,
        ctx.config.signing.bindOverrides?.acceptableCertificatePolicies,
    );
    if (vacpResult.returnCode !== VCP_RETURN_OK) {
        return VT_RETURN_CODE_UNTRUSTED;
    }
    if (
        vacpResult.endEntityKeyUsage
        && (vacpResult.endEntityKeyUsage[KeyUsage_digitalSignature] !== TRUE_BIT)
    ) {
        return VT_RETURN_CODE_KEY_USAGE;
    }
    if (
        vacpResult.endEntityExtKeyUsage
        && !vacpResult.endEntityExtKeyUsage
            .some((eku) => (
                eku.isEqualTo(id_anyExtendedKeyUsage)
                || eku.isEqualTo(id_kp_clientAuth)
            ))
    ) {
        return VT_RETURN_CODE_KEY_USAGE;
    }
    const now = new Date();
    if (
        (
            vacpResult.endEntityPrivateKeyNotBefore
            && (now < vacpResult.endEntityPrivateKeyNotBefore)
        )
        || (
            vacpResult.endEntityPrivateKeyNotAfter
            && (now > vacpResult.endEntityPrivateKeyNotAfter)
        )
    ) {
        return VT_RETURN_CODE_PKUP;
    }
    const signedData = token.originalDER
        ? (() => {
            const el = new DERElement();
            el.fromBytes(token.originalDER);
            const tbs = el.sequence[0];
            return tbs.toBytes();
        })()
        : _encode_TokenContent(token.toBeSigned, DER).toBytes();
    const signatureAlg = token.algorithmIdentifier;
    const signatureValue = packBits(token.signature);
    const signatureIsValid: boolean | undefined = verifySignature(
        signedData,
        signatureAlg,
        signatureValue,
        certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
    );
    return signatureIsValid ? VT_RETURN_CODE_OK : VT_RETURN_CODE_INVALID_SIG;
}
