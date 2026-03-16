import limitBytes from "../utils/limitBytes.js";
import { type Certificate, _decode_Certificate, _decode_CertificatePair } from "@wildboar/x500/AuthenticationFramework";
import { ASN1Element, BERElement } from "@wildboar/asn1";
import { curlFTP, curlLDAP } from "./curl.js";
import { _decode_ContentInfo, _decode_SignedData, id_signedData } from "@wildboar/cms";
import type { CurlOptions } from "../types/fetch.js";

function isCMSFilePath(filepath: string): boolean {
    const fp = filepath.slice(-4).toLowerCase();
    // It really is supposed to be .p7c. .p7b is commonly used.
    return (
        fp.endsWith(".p7c")
        || fp.endsWith(".p7b")
        || fp.endsWith(".p7m")
        || fp.endsWith(".p7s")
        || fp.endsWith(".p10")
        || fp.endsWith(".cms")
    );
}

function decodeCertsOnlyCMS(el: ASN1Element): Certificate[] | null {
    const contentInfo = _decode_ContentInfo(el);
    if (contentInfo.contentType.isEqualTo(id_signedData)) {
        return null;
    }
    const signedData = _decode_SignedData(contentInfo.content);
    const certs: Certificate[] = [];
    for (const certChoice of signedData.certificates ?? []) {
        if ("certificate" in certChoice) {
            certs.push(certChoice.certificate);
        }
    }
    return certs;
}

const DEFAULT_OPTIONS: CurlOptions = {
    timeoutInMilliseconds: 10000,
    sizeLimit: 1_000_000, // 1MB should be enough for a cert.
};

/**
 * @summary Fetch public key certificates from a remote source using a URL.
 * @description
 * 
 * This function fetches public key certificates from a remote source using a
 * URL. It supports the following protocols:
 * 
 * - HTTP(S)
 * - FTP(S)
 * - LDAP(S)
 * - IPFS
 * 
 * The public key certificates may be either individual DER-encoded
 * certificates, or a certs-only CMS message, per
 * [IETF RFC 5280, Section 4.2.2.2](https://datatracker.ietf.org/doc/html/rfc5280#section-4.2.1.1).
 * This function does not support PEM encoding on grounds of virtuous
 * intolerance (see [IETF RFC 9413](https://datatracker.ietf.org/doc/html/rfc9413#name-virtuous-intolerance)).
 * 
 * @param url The URL of the public key certificates to be fetched.
 * @param options The options for the fetch.
 * @param options.timeoutInMilliseconds The timeout in milliseconds for the fetch.
 * @param options.sizeLimit The size limit in bytes for the response body.
 * @param options.tlsOptions The TLS options for protocols that use TLS.
 * @param options.ipfsBaseUrl The base URLs of an IPFS HTTP gateway. If not
 *  supplied, IPFS URLs will return a `null` result.
 * @param debugLog The debug log function. No debug logging is done if omitted.
 * @returns The public key certificates, or `null` if it could not be obtained.
 * 
 * @async
 * @function
 */
export
async function certsCurl(
    url: URL,
    endEntity: boolean,
    options: CurlOptions = DEFAULT_OPTIONS,
    debugLog?: (message: string) => void,
): Promise<Certificate[] | null> {
    const protocol = url.protocol.trim().toLowerCase();
    if (protocol === "http:" || protocol === "https:") {
        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/pkix-cert"
                    + ", application/pkcs7-mime"
                    + ", application/x-x509-ca-cert"
                    + ", application/x-x509-user-cert"
                    + ", application/octet-stream",
            },
            signal: AbortSignal.timeout(options.timeoutInMilliseconds),
        })
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
        const ct = res.headers.get("Content-Type")?.toLowerCase();
        if (ct?.startsWith("application/pkcs7-mime")) {
            return decodeCertsOnlyCMS(certEl);
        }
        return [ _decode_Certificate(certEl) ];
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
        /* In FTP (I think) we don't have a Content-Type header to know for
        sure whether this is a single certificate or a certs-only CMS message.
        Fortunately, if it has only two components, it is either malformed
        certificate, or a certs-only CMS message. We assume the latter.
        The file extension, if present, also gives us a hint. */
        if (certEl.sequence.length === 2 || isCMSFilePath(url.pathname)) {
            return decodeCertsOnlyCMS(certEl);
        }
        return [ _decode_Certificate(certEl) ];
    }
    if (protocol === "ldap:" || protocol === "ldaps:") {
        /* IETF RFC 5280 specifically restricts the syntaxes of the attributes
        queried to Certificate and CertificatePair. So no PKIPath. */
        const attributesToSearch = url.search.slice(1).split(",") || [
            "cACertificate;binary",
            "crossCertificatePair;binary",
            ...(endEntity ? ["userCertificate;binary"] : []),
        ];
        const res = await curlLDAP(
            url,
            attributesToSearch,
            options.tlsOptions,
            options.timeoutInMilliseconds,
            options.sizeLimit,
        );
        if (!res) {
            return res;
        }
        return res
            .map((r) => {
                const certEl = new BERElement();
                certEl.fromBytes(r);
                const firstComponent = certEl.sequence[0];
                if (firstComponent.tagNumber <= 1) {
                    const pair = _decode_CertificatePair(certEl);
                    return pair.issuedToThisCA;
                }
                return _decode_Certificate(certEl);
            })
            .filter((c): c is Certificate => c !== undefined);
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
        /* In IPFS (I think) we don't have a Content-Type header to know for
        sure whether this is a single certificate or a certs-only CMS message.
        Fortunately, if it has only two components, it is either malformed
        certificate, or a certs-only CMS message. We assume the latter.
        The file extension, if present, also gives us a hint. */
        if (certEl.sequence.length === 2 || isCMSFilePath(url.pathname)) {
            return decodeCertsOnlyCMS(certEl);
        }
        return [ _decode_Certificate(certEl) ];
    }
    return null;
}

export default certsCurl;
