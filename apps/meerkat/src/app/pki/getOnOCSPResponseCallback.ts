import type { MeerkatContext } from "../ctx";
import { BERElement } from "asn1-ts";
import {
    _decode_OCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponse.ta";
import { verifyOCSPResponse, VOR_RETURN_OK } from "./verifyOCSPResponse";

export type NodeOCSPResponseCallback = (response: Buffer) => unknown;

/**
 * @summary Get a callback for use by NodeJS's `TLSSocket`'s `OCSPResponse` event.
 * @description
 *
 * This function is a higher-order function that simply returns a
 * callback that can be used by NodeJS's `TLSSocket`'s `OCSPResponse` event.
 *
 * @param ctx The context object
 * @param resultCallback A function that is executed when the OCSP response
 *  validation is complete, indicating whether the OCSP response was valid and,
 *  if not valid, what was incorrect about it, via the `code` parameter.
 * @returns A callback that can be used by NodeJS's `TLSSocket`'s `OCSPResponse` event.
 *
 * @see {@link https://nodejs.org/api/tls.html#event-ocspresponse}
 *
 * @function
 */
export
function getOnOCSPResponseCallback (
    ctx: MeerkatContext,
    resultCallback: (valid: boolean, code: number) => unknown,
): NodeOCSPResponseCallback {
    if (!ctx.config.tls.requestOCSP) {
        return () => {};
    }
    return async (response: Buffer): Promise<void> => {
        const el = new BERElement();
        el.fromBytes(response);
        const resp = _decode_OCSPResponse(el);
        const verifyResult = await verifyOCSPResponse(ctx, resp);
        resultCallback(verifyResult === VOR_RETURN_OK, verifyResult);
    };
}
