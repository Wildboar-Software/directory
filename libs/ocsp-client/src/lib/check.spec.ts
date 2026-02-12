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
import { strict as assert, strictEqual as assertEqual } from "node:assert";
import { id_sha1 } from "@wildboar/x500/AlgorithmObjectIdentifiers";
import { getDateFromTime } from "@wildboar/x500";

const PUBLIC_OCSP_RESPONDER_URL: string = "http://ocsp.r2m04.amazontrust.com";

const ISSUER_CERT_PEM: string = `-----BEGIN CERTIFICATE-----
MIIEXjCCA0agAwIBAgITB3MSTyqVLj7Rili9uF0bwM5fJzANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTIyMDgyMzIyMjYzNVoXDTMwMDgyMzIyMjYzNVowPDEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEcMBoGA1UEAxMTQW1hem9uIFJT
QSAyMDQ4IE0wNDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM3pVR6A
lQOp4xe776FdePXyejgA38mYx1ou9/jrpV6Sfn+/oqBKgwhY6ePsQHHQayWBJdBn
v4Wz363qRI4XUh9swBFJ11TnZ3LqOMvHmWq2+loA0QPtOfXdJ2fHBLrBrngtJ/GB
0p5olAVYrSZgvQGP16Rf8ddtNyxEEhYm3HuhmNi+vSeAq1tLYJPAvRCXonTpWdSD
xY6hvdmxlqTYi82AtBXSfpGQ58HHM0hw0C6aQakghrwWi5fGslLOqzpimNMIsT7c
qa0GJx6JfKqJqmQQNplO2h8n9ZsFJgBowof01ppdoLAWg6caMOM0om/VILKaa30F
9W/r8Qjah7ltGVkCAwEAAaOCAVowggFWMBIGA1UdEwEB/wQIMAYBAf8CAQAwDgYD
VR0PAQH/BAQDAgGGMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNV
HQ4EFgQUH1KSYVaCVH+BZtgdPQqqMlyH3QgwHwYDVR0jBBgwFoAUhBjMhTTsvAyU
lC4IWZzHshBOCggwewYIKwYBBQUHAQEEbzBtMC8GCCsGAQUFBzABhiNodHRwOi8v
b2NzcC5yb290Y2ExLmFtYXpvbnRydXN0LmNvbTA6BggrBgEFBQcwAoYuaHR0cDov
L2NydC5yb290Y2ExLmFtYXpvbnRydXN0LmNvbS9yb290Y2ExLmNlcjA/BgNVHR8E
ODA2MDSgMqAwhi5odHRwOi8vY3JsLnJvb3RjYTEuYW1hem9udHJ1c3QuY29tL3Jv
b3RjYTEuY3JsMBMGA1UdIAQMMAowCAYGZ4EMAQIBMA0GCSqGSIb3DQEBCwUAA4IB
AQA+1O5UsAaNuW3lHzJtpNGwBnZd9QEYFtxpiAnIaV4qApnGS9OCw5ZPwie7YSlD
ZF5yyFPsFhUC2Q9uJHY/CRV1b5hIiGH0+6+w5PgKiY1MWuWT8VAaJjFxvuhM7a/e
fN2TIw1Wd6WCl6YRisunjQOrSP+unqC8A540JNyZ1JOE3jVqat3OZBGgMvihdj2w
Y23EpwesrKiQzkHzmvSH67PVW4ycbPy08HVZnBxZ5NrlGG9bwXR3fNTaz+c+Ej6c
5AnwI3qkOFgSkg3Y75cdFz6pO/olK+e3AqygAcv0WjzmkDPuBjssuZjCHMC56oH3
GJkV29Di2j5prHJbwZjG1inU
-----END CERTIFICATE-----`;

const CERT_PEM: string = `-----BEGIN CERTIFICATE-----
MIIFwjCCBKqgAwIBAgIQBCE+Xsve3Ix7ofAUpX9pjzANBgkqhkiG9w0BAQsFADA8
MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRwwGgYDVQQDExNBbWF6b24g
UlNBIDIwNDggTTA0MB4XDTI1MTAwMjAwMDAwMFoXDTI2MTAzMDIzNTk1OVowGzEZ
MBcGA1UEAxMQc2VhcmNoLmJyYXZlLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEP
ADCCAQoCggEBAJkSe6Qcvl5xJuVZy+FvllqiNaMfmf+nY11o0im3WhUjdjDX94XO
DPqw9L+AJmgzMq4CQCdF+GSE6SpzD5rmcBYe72NgPiaauLVPXWn75MjbWoNWTh38
eVG+fskE+VeVIG/gnZ397hh/ySWS1gS2HTALCmAPw9m8G44lp+K1+4VIxFwtQCLj
F+0DwdW/WCeD7D3J+dw5B61nCJXHJgyyUIpUTv+GqIa829957ULtrttPQN+Nvm7N
dumdaySvLdS7apxhsTVD0z8zNMa2NxrswkloAPM9o6QVV4fF0Qto1LcAj7cD4n34
jHHpzhuv4/jfX6Nk5Q1+f71IH9kWRJPBtasCAwEAAaOCAt8wggLbMB8GA1UdIwQY
MBaAFB9SkmFWglR/gWbYHT0KqjJch90IMB0GA1UdDgQWBBQ1+DvB+t8ie+HXrcQj
rLrFhTVVcTAbBgNVHREEFDASghBzZWFyY2guYnJhdmUuY29tMBMGA1UdIAQMMAow
CAYGZ4EMAQIBMA4GA1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDATA7
BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnIybTA0LmFtYXpvbnRydXN0LmNv
bS9yMm0wNC5jcmwwdQYIKwYBBQUHAQEEaTBnMC0GCCsGAQUFBzABhiFodHRwOi8v
b2NzcC5yMm0wNC5hbWF6b250cnVzdC5jb20wNgYIKwYBBQUHMAKGKmh0dHA6Ly9j
cnQucjJtMDQuYW1hem9udHJ1c3QuY29tL3IybTA0LmNlcjAMBgNVHRMBAf8EAjAA
MIIBfgYKKwYBBAHWeQIEAgSCAW4EggFqAWgAdgDXbX0Q0af1d8LH6V/XAL/5gskz
WmXh0LMBcxfAyMVpdwAAAZmipHmDAAAEAwBHMEUCIQCnsXZzDtNbblyZUJwjEV28
2ikmmdbOz6Di57X9UmdLRgIgBJzzDbgBLM8GjWjb0j8L7nb0+8GOTL60lu0m41BI
lkIAdgDCMX5XRRmjRe5/ON6ykEHrx8IhWiK/f9W1rXaa2Q5SzQAAAZmipHm+AAAE
AwBHMEUCIQDxJshrXFD6ZiJdWYtnvdVCtjQ97emxrSdwnZ8nmQ73lQIgcnuag3Bc
ijEmOcebYsIHjCWBgAvlMabvBO0cr6+xs/AAdgCUTkOH+uzB74HzGSQmqBhlAcfT
XzgCAT9yZ31VNy4Z2AAAAZmipHnSAAAEAwBHMEUCICJsfLbvc0ExUi74Nx6wILgl
wUxn4zRmgCu2WdU4B2iGAiEA1KarZ4nmqvTbt9EnBf0aV2QZkMmRHc/Etzkv7i0m
SYgwDQYJKoZIhvcNAQELBQADggEBAIqGCX3XL6GGK91PUKZwwVUyfF3dNk67ItMl
4IYFO7+lKrJ8ObuSa04FHLatbbLfUt/NSJMaLhGy3U/HjCC8Y1FUlMNgmBIdvv5W
RwG5+utadDxVBHpmuGn5JhknYqnDrwHQFTCEkHsX/sF8Ul0EYdkqqPXbZsSrOjaR
+N0gpEG0TpeEJLik8O0FoOPDYlCpaCS8WJeXoAdFcZC9Lgwqaqp8QGFNmhqDU7xO
2/oem4sQ3ONqHrENBKT2bXW9Al3BrgUBwuebolZTrd+jjEDLmVQOPYi+r37Tdo4F
reoRSSZ7XqeDjut+6wnhRCEO3InxXEvh7vkFjpZ2HQLiILaBbSQ=
-----END CERTIFICATE-----`;

describe("check", () => {
    it("works", async () => {
        const issuerCertPem = PEMObject.parse(ISSUER_CERT_PEM)[0];
        const issuerCertEl = new BERElement();
        issuerCertEl.fromBytes(issuerCertPem.data);
        const issuerCert = _decode_Certificate(issuerCertEl);

        const certPem = PEMObject.parse(CERT_PEM)[0];
        const certEl = new BERElement();
        certEl.fromBytes(certPem.data);
        const cert = _decode_Certificate(certEl);
        const url = new URL(PUBLIC_OCSP_RESPONDER_URL);
        const resp = await check(url, [
            cert.toBeSigned.issuer.rdnSequence,
            issuerCert.toBeSigned.subjectPublicKeyInfo,
            cert.toBeSigned.serialNumber,
        ], undefined, 5000);
        assert(resp);
        const { res: result } = resp;
        assertEqual(result.responseStatus, OCSPResponseStatus_successful);
        assert(result.responseBytes);
        assert(result.responseBytes.responseType.isEqualTo(id_pkix_ocsp_basic));
        const resBytes = result.responseBytes.response;
        const resEl = new BERElement();
        resEl.fromBytes(resBytes);
        const basicRes = _decode_BasicOCSPResponse(resEl);
        const resData = basicRes.tbsResponseData;
        const now = new Date();
        assertEqual(resData.producedAt.getFullYear(), now.getFullYear());
        assertEqual(resData.responses.length, 1);
        const response = resData.responses[0];
        assert(response.certID.hashAlgorithm.algorithm.isEqualTo(id_sha1));
        assert(!Buffer.compare(response.certID.serialNumber, cert.toBeSigned.serialNumber));
        const certExpires = getDateFromTime(cert.toBeSigned.validity.notAfter);
        if (certExpires <= now) {
            assert("revoked" in response.certStatus);
        } else {
            assert("good" in response.certStatus);
        }
    });
});
