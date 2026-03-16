import limitBytes from "../utils/limitBytes.js";
import { type AttributeCertificate, _decode_AttributeCertificate } from "@wildboar/x500/AttributeCertificateDefinitions";
import { BERElement } from "@wildboar/asn1";
import { curlFTP, curlLDAP } from "./curl.js";
import type { CurlOptions } from "../types/fetch.js";

const DEFAULT_OPTIONS: CurlOptions = {
    timeoutInMilliseconds: 10000,
    sizeLimit: 1_000_000, // 1MB should be enough for a cert.
};

// FIXME: Actually use the TLS options

/**
 * @summary Fetch an attribute certificate from a remote source using a URL.
 * @description
 * 
 * This function fetches an attribute certificate from a remote source using a
 * URL. It supports the following protocols:
 * 
 * - HTTP(S)
 * - FTP(S)
 * - LDAP(S)
 * - IPFS
 * 
 * This function does not support PEM encoding, because ITU-T Recommendation
 * X.509 (2019), Section 18.3.2.1 specifically says that the file MUST be
 * DER-encoded, and that there MUST be only one attribute certificate in the
 * file.
 * 
 * The same recommendation also says that the URL may point to a "filestore
 * directory containing the set of [attribute certificates]..." but this is
 * not going to be supported by this implementation.
 * 
 * If an LDAP URL results in a multiple attribute certificates, `null` is
 * returned, since we cannot unambiguously determine which certificate to
 * return.
 * 
 * @param url The URL of the attribute certificate to be fetched.
 * @param options The options for the fetch.
 * @param options.timeoutInMilliseconds The timeout in milliseconds for the fetch.
 * @param options.sizeLimit The size limit in bytes for the fetched attribute certificate.
 * @param options.tlsOptions The TLS options for protocols that use TLS.
 * @param options.ipfsBaseUrl The base URLs of an IPFS HTTP gateway. If not
 *  supplied, IPFS URLs will return a `null` result.
 * @param debugLog The debug log function. No debug logging is done if omitted.
 * @returns The attribute certificate, or `null` if it could not be obtained.
 * 
 * @async
 * @function
 */
export
async function acertCurl(
    url: URL,
    options: CurlOptions = DEFAULT_OPTIONS,
    debugLog?: (message: string) => void,
): Promise<AttributeCertificate | null> {
    const protocol = url.protocol.trim().toLowerCase();
    if (protocol === "http:" || protocol === "https:") {
        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/pkix-attr-cert"
                    + ", application/octet-stream",
            },
            signal: AbortSignal.timeout(options.timeoutInMilliseconds),
        });
        if (!res.ok || !res.body) {
            return null;
        }
        // fetch() response bodies don't have any innate size limit.
        const sizeLimitedBody = res.body.pipeThrough(limitBytes(options.sizeLimit));
        const sizeLimitedBytes = await new Response(sizeLimitedBody).arrayBuffer();
        const certBytes = new Uint8Array(sizeLimitedBytes);
        const certEl = new BERElement();
        if (certEl.fromBytes(certBytes) !== certBytes.length) {
            return null;
        }
        return _decode_AttributeCertificate(certEl);
    }
    if (protocol === "ftp:" || protocol === "ftps:") {
        const certBytes = await curlFTP(
            url,
            options.tlsOptions,
            options.timeoutInMilliseconds,
            options.sizeLimit,
            debugLog,
        );
        if (!certBytes) {
            return null;
        }
        const certEl = new BERElement();
        if (certEl.fromBytes(certBytes) !== certBytes.length) {
            return null;
        }
        return _decode_AttributeCertificate(certEl);
    }
    if (protocol === "ldap:" || protocol === "ldaps:") {
        /* IETF RFC 5280 specifically restricts the syntaxes of the attributes
        queried to Certificate and CertificatePair. So no PKIPath. */
        const attributesToSearch = url.search.slice(1).split(",")
            || [
                "aACertificate;binary",
                "attributeCertificateAttribute;binary"
            ];
        const res = await curlLDAP(
            url,
            attributesToSearch,
            options.tlsOptions,
            options.timeoutInMilliseconds,
            options.sizeLimit,
        );
        if (!res || res.length !== 1) {
            return null;
        }
        const certEl = new BERElement();
        certEl.fromBytes(res[0]);
        return _decode_AttributeCertificate(certEl);
    }
    if (options.ipfsBaseUrl && options.ipfsBaseUrl.length > 0 && protocol === "ipfs:") {
        const baseUrl = options.ipfsBaseUrl;
        let ipfsUrl = url.toString();
        if (ipfsUrl.startsWith("ipfs://")) {
            ipfsUrl = ipfsUrl.replace("ipfs://", baseUrl + "/ipfs/");
        }
        const res = await fetch(ipfsUrl);
        if (!res.ok || !res.body) {
            return null;
        }
        const sizeLimitedBody = res.body.pipeThrough(limitBytes(options.sizeLimit));
        const sizeLimitedBytes = await new Response(sizeLimitedBody).arrayBuffer();
        const certBytes = new Uint8Array(sizeLimitedBytes);
        const certEl = new BERElement();
        if (certEl.fromBytes(certBytes) !== certBytes.length) {
            return null;
        }
        return _decode_AttributeCertificate(certEl);
    }
    return null;
}

export default acertCurl;
