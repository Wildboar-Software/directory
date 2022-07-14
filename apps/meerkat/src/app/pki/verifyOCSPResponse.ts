import type { MeerkatContext } from "../ctx";
import { BERElement, packBits, TRUE_BIT } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    OCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponse.ta";
import {
    _encode_ResponseData,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/ResponseData.ta";
import {
    OCSPResponseStatus_successful,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponseStatus.ta";
import {
    id_pkix_ocsp_basic,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/id-pkix-ocsp-basic.va";
import {
    _decode_BasicOCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/BasicOCSPResponse.ta";
import { VCP_RETURN_OK, verifySignature } from "../pki/verifyCertPath";
import { verifyAnyCertPath } from "../pki/verifyAnyCertPath";
import {
    CertificationPath,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificationPath.ta";
import {
    CertificatePair,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/CertificatePair.ta";
import { strict as assert } from "node:assert";
import { differenceInSeconds } from "date-fns";
import {
    KeyUsage_digitalSignature,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/KeyUsage.ta";
import { id_kp_OCSPSigning } from "../constants";

export const VOR_RETURN_OK: number = 0;
export const VOR_RETURN_NOT_SUCCESS: number = -1;
export const VOR_RETURN_NO_RESPONSE_BYTES: number = -2;
export const VOR_RETURN_UNKNOWN_RESP_TYPE: number = -3;
export const VOR_RETURN_NO_CERTS: number = -4;
export const VOR_RETURN_NO_DIFF_NUM_RESPONSES: number = -5;
export const VOR_RETURN_REVOKED: number = -6;
export const VOR_RETURN_UNKNOWN_INTOLERABLE: number = -7;
export const VOR_RETURN_REPLAY_ATTACK: number = -8;
export const VOR_RETURN_INVALID_SIG: number = -9;
export const VOR_RETURN_INVALID_CERT_PATH: number = -10;
export const VOR_RETURN_INVALID_KEY_USAGE: number = -11;

export
async function verifyOCSPResponse (
    ctx: MeerkatContext,
    resp: OCSPResponse,
): Promise<number> {
    if (resp.responseStatus !== OCSPResponseStatus_successful) {
        return VOR_RETURN_NOT_SUCCESS;
    }
    if (!resp.responseBytes) {
        return VOR_RETURN_NO_RESPONSE_BYTES;
    }
    if (!resp.responseBytes.responseType.isEqualTo(id_pkix_ocsp_basic)) {
        return VOR_RETURN_UNKNOWN_RESP_TYPE;
    }
    const resBytes = resp.responseBytes.response;
    const resEl = new BERElement();
    resEl.fromBytes(resBytes);
    const basicRes = _decode_BasicOCSPResponse(resEl);
    if (!basicRes.certs?.length) {
        return VOR_RETURN_NO_CERTS;
    }
    if (basicRes.tbsResponseData.responses.length !== 1) {
        return VOR_RETURN_NO_DIFF_NUM_RESPONSES;
    }
    const sr = basicRes.tbsResponseData.responses[0];
    if ("revoked" in sr.certStatus) {
        return VOR_RETURN_REVOKED;
    } else if (
        ("unknown" in sr.certStatus)
        && ctx.config.tls.ocspUnknownIsFailure
    ) {
        return VOR_RETURN_UNKNOWN_INTOLERABLE;
    }
    assert("good" in sr.certStatus);
    const now = new Date();
    const updateTimeDev = Math.abs(differenceInSeconds(sr.thisUpdate, now));
    if (updateTimeDev > ctx.config.tls.ocspReplayWindow) {
        return VOR_RETURN_REPLAY_ATTACK;
    }
    const producedAt: Date = basicRes.tbsResponseData.producedAt;
    const producedTimeDev = Math.abs(differenceInSeconds(producedAt, now));
    if (producedTimeDev > ctx.config.tls.ocspReplayWindow) {
        return VOR_RETURN_REPLAY_ATTACK;
    }
    if (ctx.config.signing.disableAllSignatureVerification) {
        return VOR_RETURN_OK;
    }
    const signedBytes = _encode_ResponseData(basicRes.tbsResponseData, DER).toBytes();
    const certPath: CertificationPath = new CertificationPath(
        basicRes.certs[0],
        (basicRes.certs.length > 1)
            ? basicRes.certs.slice(1)
                .map((cert) => new CertificatePair(
                    cert,
                    undefined,
                ))
            : undefined,
    );
    const signatureIsValid: boolean | undefined = verifySignature(
        signedBytes,
        basicRes.signatureAlgorithm,
        packBits(basicRes.signature),
        certPath.userCertificate.toBeSigned.subjectPublicKeyInfo,
    );
    if (!signatureIsValid) {
        return VOR_RETURN_INVALID_SIG;
    }
    const vacpResult = await verifyAnyCertPath(ctx, certPath);
    if (vacpResult.returnCode !== VCP_RETURN_OK) {
        return VOR_RETURN_INVALID_CERT_PATH;
    }
    const keyUsagePermitsOCSP: boolean = (
        !vacpResult.endEntityKeyUsage
        || (vacpResult.endEntityKeyUsage[KeyUsage_digitalSignature] === TRUE_BIT)
    );
    const extKeyUsagePermitsOCSP: boolean = (
        !vacpResult.endEntityExtKeyUsage
        || vacpResult.endEntityExtKeyUsage
            .some((eku) => eku.isEqualTo(id_kp_OCSPSigning))
    );
    if (!keyUsagePermitsOCSP || !extKeyUsagePermitsOCSP) {
        return VOR_RETURN_INVALID_KEY_USAGE;
    }
    return VOR_RETURN_OK;
}
