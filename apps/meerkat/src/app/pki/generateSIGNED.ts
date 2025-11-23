import type { Context } from "@wildboar/meerkat-types";
import { generateSignature } from "./generateSignature.js";
import {
    SIGNED,
} from "@wildboar/x500/AuthenticationFramework";
import { DER, ASN1Encoder } from "@wildboar/asn1/functional";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/EnhancedSecurity";
import { unpackBits } from "@wildboar/asn1";
import type { KeyObject } from "node:crypto";

/**
 * @summary Produce a `OPTIONALLY-PROTECTED` object
 * @description
 *
 * This generic function takes a parameter, `data`, representing the thing to
 * be signed, and an `encoder` function that encodes that thing into an
 * `ASN1Element`, which is then encoded into bytes. A signature is produced over
 * these bytes, and using the parameter and its signature, a `SIGNED{T}` is
 * produced, where `SIGNED{}` is a parameterized type assignment defined in
 * [ITU Recommendation X.509 (2019)](https://www.itu.int/rec/T-REC-X.509/en), in
 * the `AuthenticationFramework` ASN.1 module. The parameter becomes the
 * `toBeSigned` field of this parameterized `SEQUENCE`. Finally, this `SIGNED{}`
 * object is returned within an `OPTIONALLY-PROTECTED` value, which is defined
 * in [ITU Recommendation X.501 (2019)](https://www.itu.int/rec/T-REC-X.501/en),
 * in the `EnhancedSecurity` ASN.1 module. If no signature could be generated,
 * the resulting `OPTIONALLY-PROTECTED` will have used the `unsigned`
 * alternative, but if a signature was produced successfully, the `signed`
 * alternative will be used.
 *
 * For instance, if you pass in a `SearchArgumentData`, this function will yield
 * an `OPTIONALLY-PROTECTED{SearchArgumentData}`. If the signature generation
 * was successful, the returned value will _contain_ a
 * `SIGNED{SearchArgumentData}`.
 *
 * @param ctx The context object
 * @param data The data that becomes the `toBeSigned` of the `SIGNED{}`
 * @param encoder A function for converting `data` to an ASN.1 element
 * @param otherKey An alternative private key for producing the signature, which
 *  overrides the default: the signing key.
 * @returns An `OPTIONALLY-PROTECTED{T}`
 *
 * @function
 */
export
function generateSIGNED <T> (
    ctx: Context,
    data: T,
    encoder: ASN1Encoder<T>,
    otherKey?: KeyObject,
): OPTIONALLY_PROTECTED<T> {
    const tbsBytes = encoder(data, DER).toBytes();
    const key = otherKey ?? ctx.config.signing?.key;
    if (!key) { // Signing is permitted to fail, per ITU Recommendation X.511 (2019), Section 7.10.
        return {
            unsigned: data,
        };
    }
    const signingResult = generateSignature(key, tbsBytes);
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
