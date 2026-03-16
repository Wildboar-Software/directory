import limitBytes from "../utils/limitBytes.js";
import { type Certificate, _decode_Certificate, _decode_CertificatePair } from "@wildboar/x500/AuthenticationFramework";
import { ASN1Element, BERElement } from "@wildboar/asn1";
import { curlFTP, curlLDAP } from "./curl.js";
import { type TlsOptions } from "node:tls";
import { _decode_ContentInfo, _decode_SignedData, id_signedData } from "@wildboar/cms";

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

export
interface CertCurlOptions {
    timeoutInMilliseconds: number;
    sizeLimit: number;
    tlsOptions?: TlsOptions,
    ipfsBaseUrls: string[],
}

const DEFAULT_OPTIONS: CertCurlOptions = {
    timeoutInMilliseconds: 10000,
    sizeLimit: 1_000_000, // 1MB should be enough for a cert.
    ipfsBaseUrls: [],
};

// TODO: Should you handle PEM encoding? NO! The spec says the file MUST be DER. Document this.

export
async function certsCurl(
    url: URL,
    endEntity: boolean,
    options: CertCurlOptions = DEFAULT_OPTIONS,
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
    if (options.ipfsBaseUrls.length > 0 && protocol === "ipfs:") {
        const randomIdx = Math.floor(Math.random() * options.ipfsBaseUrls.length);
        const baseUrl = options.ipfsBaseUrls[randomIdx];
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
