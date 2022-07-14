import type { Context } from "@wildboar/meerkat-types";
import { generateSignature } from "./generateSignature";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { DER, ASN1Encoder } from "asn1-ts/dist/node/functional";
import type {
    OPTIONALLY_PROTECTED,
} from "@wildboar/x500/src/lib/modules/EnhancedSecurity/OPTIONALLY-PROTECTED.ta";
import { unpackBits } from "asn1-ts";

export
function generateSIGNED <T> (
    ctx: Context,
    data: T,
    encoder: ASN1Encoder<T>,
): OPTIONALLY_PROTECTED<T> {
    const tbsBytes = encoder(data, DER).toBytes();
    const key = ctx.config.signing?.key;
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
