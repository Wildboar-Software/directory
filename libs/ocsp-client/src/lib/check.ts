import {
    OCSPRequest,
    _encode_OCSPRequest,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPRequest.ta";
import {
    TBSRequest,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/TBSRequest.ta";
import {
    Request,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/Request.ta";
import {
    CertID,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/CertID.ta";
import {
    Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import {
    OCSPResponse,
    _decode_OCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponse.ta";
import type {
    BasicOCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/BasicOCSPResponse.ta";
import type {
    SingleResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/SingleResponse.ta";
import { DER } from "asn1-ts/dist/node/functional";
import { URL } from "url";
import * as http from "http";
import * as https from "https";
import { TlsOptions } from "tls";
import { BERElement } from "asn1-ts";
import {
    id_sha256,
} from "@wildboar/x500/src/lib/modules/AlgorithmObjectIdentifiers/id-sha256.va";
import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import {
    _encode_SubjectPublicKeyInfo,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SubjectPublicKeyInfo.ta";
import {
    _encode_DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import { createHash } from "crypto";
import {
    id_pkix_ocsp_basic,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/id-pkix-ocsp-basic.va";
import {
    _decode_BasicOCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/BasicOCSPResponse.ta";

export
function convertCertToOCSPRequest (cert: Certificate): OCSPRequest {
    const tbs = cert.toBeSigned;
    const dnBytes = _encode_DistinguishedName(tbs.issuer.rdnSequence, DER).toBytes();
    const spkiElement = _encode_SubjectPublicKeyInfo(tbs.subjectPublicKeyInfo, DER);
    const dnHasher = createHash("sha256");
    const spkiHasher = createHash("sha256");
    dnHasher.update(dnBytes);
    spkiHasher.update(spkiElement.value); // Not calculated over tag and length.
    return new OCSPRequest(
        new TBSRequest(
            undefined,
            undefined,
            [
                new Request(
                    new CertID(
                        new AlgorithmIdentifier(
                            id_sha256,
                            undefined,
                        ),
                        dnHasher.digest(),
                        spkiHasher.digest(),
                        tbs.serialNumber,
                    ),
                    undefined,
                ),
            ],
            undefined,
        ),
        undefined,
    );
}

export
function postHTTPS (
    url: URL,
    ocspReq: OCSPRequest,
    tlsOptions?: TlsOptions,
    timeoutInMilliseconds: number = 5000,
): Promise<OCSPResponse> {
    const transportClient = (url.protocol.toLowerCase() === "https:")
        ? https
        : http;
    // TODO: Check that response is application/ocsp-response
    // TODO: Accept: application/ocsp-response
    return new Promise((resolve, reject) => {
        const httpReq = transportClient.request(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/ocsp-request",
            },
            ...(tlsOptions ?? {}),
            timeout: timeoutInMilliseconds,
        }, (res) => {
            const chunks: Buffer[] = [];
            res.on("data", (chunk: Buffer) => chunks.push(chunk));
            res.once("error", reject);
            res.once("timeout", reject);
            res.once("pause", reject); // This should not happen.
            res.once("end", () => {
                const responseBytes = Buffer.concat(chunks);
                const el = new BERElement();
                el.fromBytes(responseBytes);
                const ocspResponse = _decode_OCSPResponse(el);
                resolve(ocspResponse);
            });
            setTimeout(reject, timeoutInMilliseconds);
        });
        httpReq.once("error", reject);
        httpReq.once("timeout", reject);
        httpReq.write(_encode_OCSPRequest(ocspReq, DER).toBytes());
        httpReq.end();
    });
}

export
interface CheckResponse {
    res: OCSPResponse;
    basicRes?: BasicOCSPResponse;
    singleRes?: SingleResponse;
}

export
async function check (
    url: URL,
    req: OCSPRequest | Certificate,
    tlsOptions?: TlsOptions,
    timeoutInMilliseconds: number = 5000,
): Promise<CheckResponse> {
    if (!["http:", "https:"].includes(url.protocol.toLowerCase())) {
        throw new Error("PROTOCOL_UNSUPPORTED"); // TODO: Create a different error type.
    }
    const ocspReq = (req instanceof OCSPRequest)
        ? req
        : convertCertToOCSPRequest(req);
    const result = await postHTTPS(url, ocspReq, tlsOptions, timeoutInMilliseconds);
    const nonBasicResponse: CheckResponse = {
        res: result,
    };
    if (!result.responseBytes) {
        return nonBasicResponse;
    }
    if (!result.responseBytes.responseType.isEqualTo(id_pkix_ocsp_basic)) {
        return nonBasicResponse;
    }
    const resBytes = result.responseBytes.response;
    const resEl = new BERElement();
    resEl.fromBytes(resBytes);
    const basicRes = _decode_BasicOCSPResponse(resEl);
    return {
        res: result,
        basicRes,
        singleRes: basicRes.tbsResponseData.responses[0],
    };
}
