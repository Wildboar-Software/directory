import type { Context } from "@wildboar/meerkat-types";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import type {
    OPTIONALLY_PROTECTED_SEQ,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED-SEQ.ta";
import { unpackBits } from "asn1-ts";
import {
    DER,
    ASN1Encoder,
} from "asn1-ts/dist/node/functional";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { generateSignature } from "./generateSignature";

/**
 * @summary Digitally sign a chained error with this DSA's signing key
 * @description
 *
 * This function converts an unsigned Directory System Protocol (DSP) error
 * into an `OPTIONALLY-PROTECTED` DSP error, which will use the `signed`
 * alternative if the signature generation was successful, or the `unsigned`
 * alternative if it was not.
 *
 * The signature is produced using this DSA's signing key, if one is configured.
 *
 * @param ctx The context object
 * @param data The type to be signed
 * @param dataEncoder A function that converts the `data` parameter into an
 *  `ASN1Element`.
 * @returns An `OPTIONALLY-PROTECTED` DSP result
 *
 * @function
 */
export
function signDirectoryError <ErrorData> (
    ctx: Context,
    data: ErrorData,
    dataEncoder: ASN1Encoder<ErrorData>,
): OPTIONALLY_PROTECTED<ErrorData> {
    const errorDataBytes = dataEncoder(data, DER).toBytes();
    const key = ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return {
            unsigned: data,
        };
    }
    const signingResult = generateSignature(key, errorDataBytes);
    if (!signingResult) {
        return {
            unsigned: data,
        };
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            data,
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}

/**
 * @summary Digitally sign a chained error with this DSA's signing key
 * @description
 *
 * This function converts an unsigned Directory System Protocol (DSP) error
 * into an `OPTIONALLY-PROTECTED-SEQ` DSP error, which will use the `signed`
 * alternative if the signature generation was successful, or the `unsigned`
 * alternative if it was not.
 *
 * The signature is produced using this DSA's signing key, if one is configured.
 *
 * @param ctx The context object
 * @param data The type to be signed
 * @param dataEncoder A function that converts the `data` parameter into an
 *  `ASN1Element`.
 * @returns An `OPTIONALLY-PROTECTED-SEQ` DSP result
 *
 * @function
 */
export
function signDirectoryErrorSeq <ErrorData> (
    ctx: Context,
    data: ErrorData,
    dataEncoder: ASN1Encoder<ErrorData>,
): OPTIONALLY_PROTECTED_SEQ<ErrorData> {
    const errorDataBytes = dataEncoder(data, DER).toBytes();
    const key = ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return {
            unsigned: data,
        };
    }
    const signingResult = generateSignature(key, errorDataBytes);
    if (!signingResult) {
        return {
            unsigned: data,
        };
    }
    const [ sigAlg, sigValue ] = signingResult;
    return {
        signed: new SIGNED(
            data,
            sigAlg,
            unpackBits(sigValue),
            undefined,
            undefined,
        ),
    };
}
