import { Buffer } from "node:buffer";
import { getOCSPResponse as check } from "./check";
import { URL } from "node:url";
import { PEMObject } from "@wildboar/pem";
import { BERElement } from "@wildboar/asn1";
import {
    _decode_Certificate,
} from "@wildboar/x500/AuthenticationFramework";
import {
    OCSPResponseStatus_successful,
} from "@wildboar/ocsp";
import {
    id_pkix_ocsp_basic,
} from "@wildboar/ocsp";
import {
    _decode_BasicOCSPResponse,
} from "@wildboar/ocsp";
import { strict as assert } from "node:assert";
import { id_sha256 } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { getDateFromTime } from "@wildboar/x500";
import { OCSPRequest } from "@wildboar/ocsp";

const PUBLIC_OCSP_RESPONDER_URL: string = "http://ocsp.sca1b.amazontrust.com";

// Nabbed from a website I stumbled upon when looking for a public OCSP responder URL.
const CERT_PEM: string = `-----BEGIN CERTIFICATE-----
MIIGGDCCBQCgAwIBAgIQA1y/71yzITuQmFyxHFUT2DANBgkqhkiG9w0BAQsFADBG
MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRUwEwYDVQQLEwxTZXJ2ZXIg
Q0EgMUIxDzANBgNVBAMTBkFtYXpvbjAeFw0yMjA0MTkwMDAwMDBaFw0yMzA1MTgy
MzU5NTlaMBwxGjAYBgNVBAMTEW90eC5hbGllbnZhdWx0LmlvMIIBIjANBgkqhkiG
9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqdbtomPMjrt+HdLkGBqYCix63T3D5DbDTAIT
AenVAn/fYvUYMy5SlQmAc+psgF4PlVxX0hjA7/loKC1Ltnc8MoBZ8zz1enYPkg28
eGfiI1owSLcfh7xI5cfxz2Ipsk96qQpkLHbWJNxL0cohUpoeREMDW8tZi5/18Hg3
3xH2iUEBKUB6mbs/j55VsD3GFlXCASiiirLVPIL0Rw8OghTOxMH+hTkaR8vAPcGL
JAdYQfPhtJqwuzuU8RS/fqp2KGl7evR8FTXwvdM7zXsqwPXsC7k4OX9CKuKTArMO
G5kVC88FNtDC1Xen+Mw8iXbi+lGsn+811EDSt61ChoCcy2a6VwIDAQABo4IDKjCC
AyYwHwYDVR0jBBgwFoAUWaRmBlKge5WSPKOUByeWdFv5PdAwHQYDVR0OBBYEFEzl
L7PHTuH37zWtyE0LETCUsWGpMFsGA1UdEQRUMFKCEW90eC5hbGllbnZhdWx0Lmlv
ghMqLm90eC5hbGllbnZhdWx0LmlvghJvdHguYWxpZW52YXVsdC5jb22CFCoub3R4
LmFsaWVudmF1bHQuY29tMA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEF
BQcDAQYIKwYBBQUHAwIwPQYDVR0fBDYwNDAyoDCgLoYsaHR0cDovL2NybC5zY2Ex
Yi5hbWF6b250cnVzdC5jb20vc2NhMWItMS5jcmwwEwYDVR0gBAwwCjAIBgZngQwB
AgEwdQYIKwYBBQUHAQEEaTBnMC0GCCsGAQUFBzABhiFodHRwOi8vb2NzcC5zY2Ex
Yi5hbWF6b250cnVzdC5jb20wNgYIKwYBBQUHMAKGKmh0dHA6Ly9jcnQuc2NhMWIu
YW1hem9udHJ1c3QuY29tL3NjYTFiLmNydDAMBgNVHRMBAf8EAjAAMIIBfQYKKwYB
BAHWeQIEAgSCAW0EggFpAWcAdQDoPtDaPvUGNTLnVyi8iWvJA9PL0RFr7Otp4Xd9
bQa9bgAAAYA/7nRmAAAEAwBGMEQCIFOUqwoz+hXJA9aoq+lXvv+2xi+e9eGqlJI4
2s5O4C8bAiAk8fTdt1a9FJyzOMXcrSYWoEs6bxLwXCaC8ttxC8HBUQB2ADXPGRu/
sWxXvw+tTG1Cy7u2JyAmUeo/4SrvqAPDO9ZMAAABgD/udC0AAAQDAEcwRQIgFLPS
ctv/LuCykYwqs4khJNi9DJne2d6nUoKtWxu+WUoCIQCkvWEREHPXmVSDQ5icIKrP
Pq8t2rOgbO6hWCsRyNy6pAB2ALNzdwfhhFD4Y4bWBancEQlKeS2xZwwLh9zwAw55
NqWaAAABgD/udE8AAAQDAEcwRQIgNgwOsHomsfjkuBIURlnKhp3ifIMqD16WEZ5D
oFOrT8UCIQC1hZwMgVYalMjWRTWN08mKhZj7WDlStnjf3Mx5g0gZrTANBgkqhkiG
9w0BAQsFAAOCAQEAs8J6GR5OP5ceHUtsB7i0Vw0XNh9j4FlEBAL/ButZ/5Ob3ebL
+jm231ooULuvibE85TeVZxHxn6KXnWX8zcX9OjV5oqWsGiPtARTGVv8QLduy/d27
qBiu0MGDPk+VrfcLKI6lY7ozv7EK/nPoK0eDV/SK8jqe0QruEyVZQJIPEWnib32+
exg1fqVo3vNic2UfIcLauYYG32Kq5ctzmwR+jgQ349L8FRuzqL26ELvCUzcc9DN+
KQyzqKkECvp0xnr63Dx9BOqNVPI3kyak/RbR3FSAo3MK15juO+W7QUllFnlCQM5S
k35Pe4Mmghdn/0qDw6vAHC4smMQja59S/VEHfg==
-----END CERTIFICATE-----`;

describe("check", () => {

    // I don't know how this ever worked.

    // it("works", async () => {
    //     const certPem = PEMObject.parse(CERT_PEM)[0];
    //     const certEl = new BERElement();
    //     certEl.fromBytes(certPem.data);
    //     const cert = _decode_Certificate(certEl);
    //     const url = new URL(PUBLIC_OCSP_RESPONDER_URL);
    //     const resp = await check(url, [
    //         cert.toBeSigned.issuer.rdnSequence,
    //     ], undefined, 5000);
    //     assert(resp);
    //     const { res: result } = resp;
    //     expect(result.responseStatus).toBe(OCSPResponseStatus_successful);
    //     assert(result.responseBytes);
    //     expect(result.responseBytes.responseType.isEqualTo(id_pkix_ocsp_basic)).toBe(true);
    //     const resBytes = result.responseBytes.response;
    //     const resEl = new BERElement();
    //     resEl.fromBytes(resBytes);
    //     const basicRes = _decode_BasicOCSPResponse(resEl);
    //     const resData = basicRes.tbsResponseData;
    //     const now = new Date();
    //     expect(resData.producedAt.getFullYear()).toBe(now.getFullYear());
    //     expect(resData.responses).toHaveLength(1);
    //     const response = resData.responses[0];
    //     expect(response.certID.hashAlgorithm.algorithm.isEqualTo(id_sha256));
    //     expect(!Buffer.compare(response.certID.serialNumber, cert.toBeSigned.serialNumber));
    //     const certExpires = getDateFromTime(cert.toBeSigned.validity.notAfter);
    //     if (certExpires <= now) {
    //         assert("revoked" in response.certStatus);
    //     } else {
    //         assert("good" in response.certStatus);
    //     }
    // });
})
