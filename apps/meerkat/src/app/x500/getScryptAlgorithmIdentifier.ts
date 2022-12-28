import { AlgorithmIdentifier } from "@wildboar/pki-stub/src/lib/modules/PKI-Stub/AlgorithmIdentifier.ta";
import { scrypt, Scrypt_params } from "@wildboar/scrypt-0";
import * as crypto from "crypto";
import { DER } from "asn1-ts/dist/node/functional";

/**
 * @summary Create a new Scrypt `AlgorithmIdentifier`
 * @description
 *
 * Creates a new Scrypt `AlgorithmIdentifier`
 *
 * @returns A Scrypt `AlgorithmIdentifier`
 *
 * @function
 */
export
function getScryptAlgorithmIdentifier () {
    return new AlgorithmIdentifier(
        scrypt["&id"]!,
        scrypt.encoderFor["&Type"]!(new Scrypt_params(
            crypto.randomBytes(32),
            16384,
            8,
            1,
            128,
        ), DER),
    );
}
// TODO: I would like a security audit of the above parameters. Are they future-proof?

export default getScryptAlgorithmIdentifier;
