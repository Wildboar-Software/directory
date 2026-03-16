import limitBytes from "../utils/limitBytes.js";
import { type AttributeCertificate, _decode_AttributeCertificate } from "@wildboar/x500/AttributeCertificateDefinitions";
import { BERElement } from "@wildboar/asn1";
import { curlFTP, curlLDAP } from "./curl.js";
import { type TlsOptions } from "node:tls";
import { acertCurl } from "./acertCurl.js";

describe("acertCurl", () => {
    it.todo("should return an attribute certificate", async () => {
        const acert = await acertCurl(new URL("https://example.com/acert.pem"));
        expect(acert).toBeDefined();
    });
});