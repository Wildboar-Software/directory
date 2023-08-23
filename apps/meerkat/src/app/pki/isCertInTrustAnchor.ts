import {
    Certificate, _encode_Certificate,
} from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/Certificate.ta";
import {
    TrustAnchorChoice,
} from "@wildboar/tal/src/lib/modules/TrustAnchorInfoModule/TrustAnchorChoice.ta";
import { DER } from "asn1-ts/dist/node/functional";

/**
 * @summary Determine whether a certificate matches a trust anchor
 * @description
 *
 * This function determines whether a public key certificate matches a trust
 * anchor.
 *
 * @param cert The certificate that may or may not be a trust anchor
 * @param trust_anchor A single trust anchor
 * @param certBytes The raw bytes of the certificate
 * @returns A `boolean` indicating whether the asserted certificate matches the
 *  trust anchor.
 *
 * @function
 */
export
function isCertInTrustAnchor (
    cert: Certificate,
    trust_anchor: TrustAnchorChoice,
    certBytes?: Uint8Array,
): boolean {
    const certBytes_ = certBytes
        ?? cert.originalDER
        ?? _encode_Certificate(cert, DER).toBytes();
    if ("certificate" in trust_anchor) {
        const taBytes = trust_anchor.certificate.originalDER
            ?? _encode_Certificate(trust_anchor.certificate, DER).toBytes();
        return !Buffer.compare(certBytes_, taBytes);
    }
    else if ("tbsCert" in trust_anchor) {
        const tatbs = trust_anchor.tbsCert;
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
            !Buffer.compare(tatbs.serialNumber, tbs.serialNumber)
            && (tatbs.issuer.rdnSequence.length === cert.toBeSigned.issuer.rdnSequence.length)
            && (tatbs.subject.rdnSequence.length === cert.toBeSigned.subject.rdnSequence.length)
            && (tatbs.extensions?.length === tbs.extensions?.length)
            && (tatbs.subjectPublicKeyInfo.algorithm.algorithm
                .isEqualTo(tbs.subjectPublicKeyInfo.algorithm.algorithm))
            && !Buffer.compare(
                Buffer.from(tatbs.subjectPublicKeyInfo.subjectPublicKey.buffer),
                Buffer.from(tbs.subjectPublicKeyInfo.subjectPublicKey.buffer)
            )
        );
    }
    else {
        return (
            (trust_anchor.taInfo.exts?.length === cert.toBeSigned.extensions?.length)
            && (trust_anchor.taInfo.pubKey.algorithm.algorithm.isEqualTo(cert.toBeSigned.subjectPublicKeyInfo.algorithm.algorithm))
            && !Buffer.compare(
                Buffer.from(trust_anchor.taInfo.pubKey.subjectPublicKey.buffer),
                Buffer.from(cert.toBeSigned.subjectPublicKeyInfo.subjectPublicKey.buffer),
            )
        );
    }
}

export default isCertInTrustAnchor;
