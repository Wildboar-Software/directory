import type { Context } from "@wildboar/meerkat-types";
import { unpackBits } from "@wildboar/asn1";
import {
    DER,
} from "@wildboar/asn1/functional";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { generateSignature } from "./generateSignature.js";
import {
    chainedRead,
} from "@wildboar/x500/DistributedOperations";
import { getOptionallyProtectedValue } from "@wildboar/x500";
import {
    _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1,
} from "@wildboar/x500/DistributedOperations";

/**
 * @summary Digitally sign a chained argument with this DSA's signing key
 * @description
 *
 * This function converts an unsigned Directory System Protocol (DSP) argument
 * into an `OPTIONALLY-PROTECTED` DSP argument, which will use the `signed`
 * alternative if the signature generation was successful, or the `unsigned`
 * alternative if it was not.
 *
 * The signature is produced using this DSA's signing key, if one is configured.
 *
 * @param ctx The context object
 * @param arg The chained argument to be signed
 * @returns An `OPTIONALLY-PROTECTED` DSP argument
 *
 * @function
 */
export
function signChainedArgument (
    ctx: Context,
    arg: NonNullable<typeof chainedRead["&ArgumentType"]>,
): NonNullable<typeof chainedRead["&ArgumentType"]> {
    if ("signed" in arg) {
        return arg;
    }
    const bytes = _encode_Chained_ArgumentType_OPTIONALLY_PROTECTED_Parameter1(arg.unsigned, DER).toBytes();
    const key = ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return arg;
    }
    const signingResult = generateSignature(key, bytes);
    if (!signingResult) {
        return arg;
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            getOptionallyProtectedValue(arg),
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}
