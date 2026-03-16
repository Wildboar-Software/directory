import limitBytes from "../utils/limitBytes.js";
import { type AttributeCertificate, _decode_AttributeCertificate } from "@wildboar/x500/AttributeCertificateDefinitions";
import { BERElement } from "@wildboar/asn1";
import { curlFTP, curlLDAP } from "./curl.js";
import { type TlsOptions } from "node:tls";

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
async function acertCurl(
    url: URL,
    options: CertCurlOptions = DEFAULT_OPTIONS,
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
            || ["attributeCertificateAttribute;binary"];
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
        return _decode_AttributeCertificate(certEl);
    }
    return null;
}

export default acertCurl;
