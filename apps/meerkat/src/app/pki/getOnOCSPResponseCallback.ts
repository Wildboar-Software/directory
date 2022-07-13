import type { MeerkatContext } from "../ctx";
import { BERElement } from "asn1-ts";
import {
    _decode_OCSPResponse,
} from "@wildboar/ocsp/src/lib/modules/OCSP-2013-08/OCSPResponse.ta";
import { verifyOCSPResponse, VOR_RETURN_OK } from "./verifyOCSPResponse";

export type NodeOCSPResponseCallback = (response: Buffer) => unknown;

/**
 *
 * @param ctx
 * @returns
 *
 * @link https://nodejs.org/api/tls.html#event-ocspresponse
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
