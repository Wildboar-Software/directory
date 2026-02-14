# Online Certificate Status Protocol (OCSP) Client in TypeScript

This is a TypeScript client for OCSP as described in
[IETF RFC 6960](https://datatracker.ietf.org/doc/html/rfc6960). It's main
exported symbol of interest is `getOCSPResponse()`, which does exactly what it
sounds like: it queries an OCSP responder for the status of a certificate.

Here is an example usage, with some code omitted for clarity:

```typescript
// Decode the subject's immediate issuer certificate (not the root CA / trust anchor)
const issuerCertPem = PEMObject.parse(ISSUER_CERT_PEM)[0];
const issuerCertEl = new BERElement();
issuerCertEl.fromBytes(issuerCertPem.data);
const issuerCert = _decode_Certificate(issuerCertEl);

// Decode the subject's certificate (the one whose status we want to query)
const certPem = PEMObject.parse(CERT_PEM)[0];
const certEl = new BERElement();
certEl.fromBytes(certPem.data);
const cert = _decode_Certificate(certEl);

// Create the URL
const url = new URL(PUBLIC_OCSP_RESPONDER_URL);

// Query the responder
// This uses HTTP or HTTPS depending on what URL protocol you use.
// If you supply a URL that doesn't start with http: or https:, this returns `null`.
const resp = await check(url, [
    cert.toBeSigned.issuer.rdnSequence,
    issuerCert.toBeSigned.subjectPublicKeyInfo,
    cert.toBeSigned.serialNumber,
], {
    signal: AbortSignal.timeout(5000),
});

// Everything below here just showcases decoding and using the response.
assert(resp?.httpResponse);
assert(resp?.ocspResponse);
const { ocspResponse: result } = resp;
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
```

The second argument to `getOCSPResponse` can either be an `OCSPRequest` or:

- A tuple of (in this order):
  - The issuer distinguished name
  - The issuer subject public key info
  - The subject certificate's serial number

The latter is probably more user-friendly.

## AI Usage Statement

None of the code of this package was produced by AI or LLMs of any kind.
