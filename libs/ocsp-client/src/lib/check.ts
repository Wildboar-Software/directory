import {
    OCSPRequest,
    _encode_OCSPRequest,
    TBSRequest,
    _encode_TBSRequest,
    Request,
    CertID,
    OCSPResponse,
    _decode_OCSPResponse,
    BasicOCSPResponse,
    SingleResponse,
    id_pkix_ocsp_basic,
    _decode_BasicOCSPResponse,
    Signature,
} from "@wildboar/ocsp";
import { DER } from "@wildboar/asn1/functional";
import {
    BERElement,
    unpackBits,
    ASN1TagClass,
    ASN1Construction,
    ASN1UniversalType,
} from "@wildboar/asn1";
import {
    id_sha1,
} from "@wildboar/x500/AlgorithmObjectIdentifiers";
import {
    AlgorithmIdentifier,
    SubjectPublicKeyInfo,
    _encode_SubjectPublicKeyInfo,
    PkiPath,
} from "@wildboar/x500/AuthenticationFramework";
import {
    DistinguishedName,
    _encode_DistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { CertificateSerialNumber } from "@wildboar/pki-stub";

/**
 * This is the hash algorithm that is basically required by all responders.
 * Even though OCSP is supposed to be flexible as to what hash algorithm is
 * used, all responders seem to require SHA-1.
 */
const HASH_STR = "SHA-1" as const;

/**
 * @summary A function that digitally signs arbitrary data
 * @description
 *
 * This is a function that takes a `Uint8Array` representing arbitrary data to
 * be signed and returns `null` if it cannot be signed, or a tuple of the
 * certification path, the algorithm identifier, and the signature value
 * respectively otherwise.
 */
export
type SignFunction = (data: Uint8Array) => [ PkiPath, AlgorithmIdentifier, Uint8Array ] | null;

/**
 * The MIME types that are acceptable responses to an OCSP request.
 */
const ACCEPTABLE_RESPONSE_MIME_TYPES: string[] = [
    "application/ocsp-response",
    "application/octet-stream",
];

/**
 * @summary A function that limits the size of a response
 * @description
 *
 * This function returns a transform stream that limits the size of a response
 * to the maximum number of bytes specified.
 *
 * @param maxBytes The maximum number of bytes to allow in the response
 * @returns A transform stream that limits the response to the maximum number of bytes
 *
 * @function
 */
function limitBytes(maxBytes: number) {
    let total = 0;
    return new TransformStream({
        transform(chunk, controller) {
            total += chunk.byteLength;
            if (total > maxBytes) {
                controller.error(new Error("Response too large"));
                return;
            }
            controller.enqueue(chunk);
        }
    });
}

/**
 * @summary Generates an OCSP request from a certificate
 * @description
 *
 * Generates an OCSP request from a certificate that requests the status on that
 * certificate.
 *
 * @param issuerCert The certificate whose status is to be checked
 * @param sign A function that can be used to digitally sign OCSP requests
 * @returns An OCSP request
 *
 * @function
 */
export
async function convertCertAndSerialToOCSPRequest (
    issuerDN: DistinguishedName,
    issuerSPKI: SubjectPublicKeyInfo,
    subjectSerial: Uint8Array,
    sign?: SignFunction,
): Promise<OCSPRequest> {
    const dnBytes = _encode_DistinguishedName(issuerDN, DER).toBytes();
    const spkiElement = _encode_SubjectPublicKeyInfo(issuerSPKI, DER);
    const dnHash = await crypto.subtle.digest(HASH_STR, dnBytes);
    const spkHash = await crypto.subtle.digest(HASH_STR, spkiElement.sequence[1].value.subarray(1));
    const tbs = new TBSRequest(
        undefined,
        undefined,
        [
            new Request(
                new CertID(
                    new AlgorithmIdentifier(
                        id_sha1,
                        new BERElement(
                            ASN1TagClass.universal,
                            ASN1Construction.primitive,
                            ASN1UniversalType.nill,
                        ),
                    ),
                    new Uint8Array(dnHash),
                    new Uint8Array(spkHash),
                    subjectSerial,
                ),
                undefined,
            ),
        ],
        undefined,
    );
    const unsignedResult = new OCSPRequest(
        tbs,
        undefined,
    );
    if (!sign) {
        return unsignedResult;
    }
    const tbsBytes = _encode_TBSRequest(tbs, DER).toBytes();
    const signingResult = sign(tbsBytes);
    if (!signingResult) {
        return unsignedResult;
    }
    const [ certs, algid, sigValue ] = signingResult;
    const signedResult = new OCSPRequest(
        tbs,
        new Signature(
            new AlgorithmIdentifier(
                algid.algorithm,
                algid.parameters,
            ),
            unpackBits(sigValue),
            certs,
        ),
    );
    return signedResult;
}

/**
 * The return type of the `check()` function. This conveniently extracts the
 * deeply-embedded status of the single certificate for which the status was
 * requested.
 */
export
interface CheckResponse {

    /**
     * The raw response
     */
    httpResponse: Response;

    /**
     * The raw response bytes.
     */
    rawResponseBytes?: Uint8Array;
    
    /**
     * The actual OCSP response
     */
    ocspResponse?: OCSPResponse;

    /**
     * The embedded Basic OCSP response, if used
     */
    basicRes?: BasicOCSPResponse;

    /**
     * The embedded single certificate status embedded within the basic OCSP
     * response, which is embedded within the overall OCSP response, if
     * returned.
     */
    singleRes?: SingleResponse;
}

/**
 * @summary Submit an OCSP request and get an OCSP response
 * @description
 *
 * This function submits an Online Certificate Status Protocol (OCSP) request
 * to an OCSP responder to obtain an OCSP result.
 * 
 * This function's `sign` parameter is expected to take a `Uint8Array` and
 * produce a tuple of:
 * 
 * 1. The PKI Path (the certificate chain starting with the root down to the
 *    subject), which is an array of `Certificate` objects.
 * 2. The algorithm identifier for the signature (an `AlgorithmIdentifier` object)
 * 3. The signature value (a `Uint8Array`)
 * 
 * The `sign` function may return `null` if it cannot sign the request.
 * 
 * If the `sign` function is not provided, or if it returns `null`, the request
 * will be sent unsigned.
 * 
 * The `sizeLimit` parameter was implemented because `fetch()` (which this
 * function uses under the hood) does not impose any size limit on the response
 * body innately; we need this because OCSP URLs are likely to be supplied by
 * third parties or users, so they cannot be trusted entirely. If the size limit
 * is exceeded, an `Error` will be thrown.
 *
 * @param url The URL of the OCSP responder to query
 * @param req The OCSP request to send, or the issuer's DN, the issuer's public
 *  key, and the serial number of the certificate to be checked
 * @param fetchOptions {RequestInit} Options for the underlying fetch() request
 * @param sign {Function} A function that can be used to digitally sign
 *  outbound OCSP requests
 * @param sizeLimit {number} The maximum tolerated size (in bytes) of an OCSP
 *  response. Defaults to a sensible limit.
 * @returns A promise that resolves to information about the OCSP response, or
 *  `null` if the URL is not for HTTP or HTTPS.
 *
 * @async
 * @function
 */
export
async function getOCSPResponse (
    url: URL,
    req: OCSPRequest | [ DistinguishedName, SubjectPublicKeyInfo, CertificateSerialNumber ],
    fetchOptions?: RequestInit,
    sign?: SignFunction,
    sizeLimit: number = 1000000, // One megabyte should be enough for any OCSP response.
): Promise<CheckResponse | null> {
    if (!["http:", "https:"].includes(url.protocol.toLowerCase())) {
        return null;
    }
    const ocspReq = (req instanceof OCSPRequest)
        ? req
        : await convertCertAndSerialToOCSPRequest(req[0], req[1], req[2], sign);
    const httpResponse = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        headers: {
            ...fetchOptions?.headers ?? {},
            "Accept": ACCEPTABLE_RESPONSE_MIME_TYPES.join(", "),
            "Content-Type": "application/ocsp-request",
        },
        body: _encode_OCSPRequest(ocspReq, DER).toBytes(),
    });
    if (!httpResponse.ok || !httpResponse.body) {
        return {
            httpResponse,
        };
    }
    // fetch() response bodies don't have any innate size limit.
    const sizeLimitedBody = httpResponse.body.pipeThrough(limitBytes(sizeLimit));
    const sizeLimitedBytes = await new Response(sizeLimitedBody).arrayBuffer();
    const rawResponseBytes = new Uint8Array(sizeLimitedBytes);
    const el = new BERElement();
    el.fromBytes(new Uint8Array(sizeLimitedBytes));
    const ocspResponse = _decode_OCSPResponse(el);
    const nonBasicResponse: CheckResponse = {
        httpResponse,
        rawResponseBytes,
        ocspResponse,
    };
    if (!ocspResponse.responseBytes) {
        return nonBasicResponse;
    }
    if (!ocspResponse.responseBytes.responseType.isEqualTo(id_pkix_ocsp_basic)) {
        return nonBasicResponse;
    }
    const resBytes = ocspResponse.responseBytes.response;
    const resEl = new BERElement();
    resEl.fromBytes(resBytes);
    const basicRes = _decode_BasicOCSPResponse(resEl);
    return {
        ...nonBasicResponse,
        basicRes,
        singleRes: basicRes.tbsResponseData.responses[0],
    };
}
