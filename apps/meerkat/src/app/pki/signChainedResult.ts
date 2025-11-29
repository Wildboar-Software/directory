import type { Context, OPCR } from "../types/index.js";
import { unpackBits } from "@wildboar/asn1";
import {
    DER,
} from "@wildboar/asn1/functional";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { generateSignature } from "./generateSignature.js";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";

/**
 * @summary Digitally sign a chained result with this DSA's signing key
 * @description
 *
 * This function converts an unsigned Directory System Protocol (DSP) result
 * into an `OPTIONALLY-PROTECTED` DSP result, which will use the `signed`
 * alternative if the signature generation was successful, or the `unsigned`
 * alternative if it was not.
 *
 * The signature is produced using this DSA's signing key, if one is configured.
 *
 * @param ctx The context object
 * @param op The `OPTIONALLY-PROTECTED` DSP result to be signed
 * @returns An `OPTIONALLY-PROTECTED` DSP result
 *
 * @function
 */
export
function signChainedResult (
    ctx: Context,
    op: OPCR,
): OPCR {
    if ("signed" in op) {
        return op;
    }
    const bytes = _encode_Chained_ResultType_OPTIONALLY_PROTECTED_Parameter1(op.unsigned, DER).toBytes();
    const key = ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return op;
    }
    const signingResult = generateSignature(key, bytes);
    if (!signingResult) {
        return op;
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            getOptionallyProtectedValue(op),
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}
