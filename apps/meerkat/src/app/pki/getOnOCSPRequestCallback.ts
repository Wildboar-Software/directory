import type { Context, OCSPOptions } from "@wildboar/meerkat-types";
import { getOCSPResponse, SignFunction } from "@wildboar/ocsp-client";
import {
    Certificate,
    _decode_Certificate,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/Certificate.ta";
import { BERElement } from "asn1-ts";
import { DER } from "asn1-ts/dist/node/functional";
import {
    authorityInfoAccess,
} from "@wildboar/x500/src/lib/modules/PkiPmiExternalDataTypes/authorityInfoAccess.oa";
import {
    id_ad_ocsp,
} from "@wildboar/x500/src/lib/modules/PkiPmiExternalDataTypes/id-ad-ocsp.va";
import type {
    GeneralName,
} from "@wildboar/x500/src/lib/modules/CertificateExtensions/GeneralName.ta";
import { generateSignature } from "./generateSignature";
import {
    _encode_OCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponse.ta";
import {
    OCSPResponseStatus_successful,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponseStatus.ta";

/**
 * @summary The type of NodeJS's callback executed from a `TLSSocket`'s `OCSPRequest` event.
 * @description
 *
 * For some reason the `@types/node` package does not have a type specified for
 * the `OCSPRequest` event callback, which is executed from a `TLSSocket` when
 * an OCSP staple is requested.
 *
 */
export type NodeOCSPRequestCallback = (
    certificate: Buffer,
    issuer: Buffer,
    callback: (err: Error | null, resp?: Buffer | null) => unknown,
) => unknown;

/**
 * @summary Get a callback for use by NodeJS's `TLSSocket`'s `OCSPRequest` event.
 * @description
 *
 * This function is a higher-order function that simply returns a
 * callback that can be used by NodeJS's `TLSSocket`'s `OCSPRequest` event.
 *
 * @param ctx The context object
 * @param options Options
 * @returns A callback that can be used by NodeJS's `TLSSocket`'s `OCSPRequest` event.
 *
 * @see {@link https://nodejs.org/api/tls.html#event-ocsprequest}
 *
 * @function
 */
export
function getOnOCSPRequestCallback (
    ctx: Context,
    options: OCSPOptions,
): NodeOCSPRequestCallback {
    if (!ctx.config.tls.answerOCSPRequests) {
        return (_c, _i, callback) => callback(null, null);
    }
    return async (
        certificate: Buffer,
        issuer: Buffer,
        callback: (err: Error | null, resp?: Buffer | null) => unknown,
    ): Promise<void> => {
        const serverCert: Certificate = (() => {
            const el = new BERElement();
            el.fromBytes(certificate);
            return _decode_Certificate(el);
        })();
        const aiaExt = serverCert.toBeSigned.extensions
            ?.find((ext) => ext.extnId.isEqualTo(authorityInfoAccess["&id"]!));
        const aia = aiaExt
            ? authorityInfoAccess.decoderFor["&ExtnType"]!(aiaExt.valueElement())
            : undefined;
        if (!aia) {
            callback(null, null); // No OCSP response.
            return;
        }
        const ocspEndpoints: GeneralName[] = aia
            .filter((ad) => ad.accessMethod.isEqualTo(id_ad_ocsp))
            .map((ad) => ad.accessLocation);
        // const ocspResult = await check();
        const signFunction: SignFunction | undefined = options.ocspSignRequests
            ? (data: Uint8Array) => {
                const key = ctx.config.signing.key;
                const certPath = ctx.config.signing.certPath;
                if (!key || !certPath?.length) {
                    return null;
                }
                const sig = generateSignature(key, data);
                if (!sig) {
                    return null;
                }
                const [ algid, sigValue ] = sig;
                return [ certPath, algid, sigValue ];
            }
            : undefined;
        let requestBudget: number = options.maxOCSPRequestsPerCertificate;
        for (const gn of ocspEndpoints) {
            if (!("uniformResourceIdentifier" in gn)) {
                continue;
            }
            const url = new URL(gn.uniformResourceIdentifier);
            if (!url.protocol.toLowerCase().startsWith("http")) {
                continue;
            }
            if (requestBudget === 0) {
                break;
            }
            requestBudget--;
            try {
                const issuerCertEl = new BERElement();
                issuerCertEl.fromBytes(issuer);
                const issuerCert = _decode_Certificate(issuerCertEl);
                const ocspResponse = await getOCSPResponse(
                    url,
                    [
                        issuerCert.toBeSigned.subject.rdnSequence,
                        issuerCert.toBeSigned.subjectPublicKeyInfo,
                        serverCert.toBeSigned.serialNumber,
                    ],
                    undefined,
                    (options.ocspTimeout * 1000),
                    signFunction,
                    options.ocspResponseSizeLimit,
                );
                if (!ocspResponse) {
                    continue;
                }
                const { res } = ocspResponse;
                if (res.responseStatus !== OCSPResponseStatus_successful) {
                    continue;
                }
                const responseBytes = _encode_OCSPResponse(res, DER).toBytes();
                callback(null, responseBytes);
                return;
            } catch {
                continue;
            }
        }
        callback(null, null);
    };
}
