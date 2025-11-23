import { AlgorithmIdentifier } from "@wildboar/pki-stub";
import { scrypt, Scrypt_params } from "@wildboar/scrypt-0";
import * as crypto from "crypto";
import { DER } from "@wildboar/asn1/functional";

/**
 * @summary Create a new Scrypt `AlgorithmIdentifier`
 * @description
 *
 * Creates a new Scrypt `AlgorithmIdentifier`.
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

export default getScryptAlgorithmIdentifier;
