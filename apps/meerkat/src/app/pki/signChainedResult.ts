import type { Context, OPCR } from "@wildboar/meerkat-types";
import { unpackBits } from "asn1-ts";
import {
    DER,
} from "asn1-ts/dist/node/functional";
import {
    SIGNED,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/SIGNED.ta";
import { generateSignature } from "./generateSignature";
import {
    chainedRead,
} from "@wildboar/x500/src/lib/modules/DistributedOperations/chainedRead.oa";
import getOptionallyProtectedValue from "@wildboar/x500/src/lib/utils/getOptionallyProtectedValue";

export
function signChainedResult (
    ctx: Context,
    op: OPCR,
): OPCR {
    const bytes = chainedRead.encoderFor["&ResultType"]!(op, DER).toBytes();
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
