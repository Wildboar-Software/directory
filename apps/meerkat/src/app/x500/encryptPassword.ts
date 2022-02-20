import {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import { scrypt } from "@wildboar/scrypt-0";
import * as crypto from "crypto";

/**
 * @summary Encrypt a password according to an algorithm indicated by an `AlgorithmIdentifier`
 * @description
 *
 * Encrypts a password according to the mechanism described by a specified
 * `AlgorithmIdentifier`.
 *
 * This implementation currently only supports the Scrypt algorithm. The
 * algorithm identifier for this is specified in IETF RFC 7914.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7914
 *
 * @param algId The AlgorithmIdentifier that determines what kind of encryption to use.
 * @param password The password to be encrypted as an opaque sequence of bytes.
 * @returns The encrypted password as an opaque sequence of bytes.
 *
 * @function
 */
export
function encryptPassword (algId: AlgorithmIdentifier, password: Uint8Array): Uint8Array | null {
    if (algId.algorithm.isEqualTo(scrypt["&id"]!) && algId.parameters) {
        const parameters: typeof scrypt["&Type"] = scrypt.decoderFor["&Type"]!(algId.parameters);
        return crypto.scryptSync(password, parameters.salt, parameters.keyLength ? Number(parameters.keyLength) : 128, {
            cost: Number(parameters.costParameter),
            blockSize: Number(parameters.blockSize),
            parallelization: Number(parameters.parallelizationParameter),
        });
    } else {
        return null;
    }
}

export default encryptPassword;
