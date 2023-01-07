import type {
    AlgorithmIdentifier,
} from "@wildboar/x500/src/lib/modules/AuthenticationFramework/AlgorithmIdentifier.ta";
import { scrypt } from "@wildboar/scrypt-0";
import * as crypto from "crypto";

/**
 * @summary Encrypts a password for storage in the database or for comparison.
 * @description
 *
 * This implementation currently only supports the Scrypt algorithm. The
 * algorithm identifier for this is specified in IETF RFC 7914.
 *
 * @param algId The AlgorithmIdentifier that determines what kind of encryption to use.
 * @param password The password to be encrypted as an opaque sequence of bytes.
 * @returns The encrypted password as an opaque sequence of bytes.
 * @function
 * @async
 * @link https://datatracker.ietf.org/doc/html/rfc7914
 */
export
function encryptPassword (algId: AlgorithmIdentifier, password: Uint8Array): Promise<Uint8Array | null> {
    return new Promise((resolve, reject) => {
        if (algId.algorithm.isEqualTo(scrypt["&id"]!) && algId.parameters) {
            const parameters: typeof scrypt["&Type"] = scrypt.decoderFor["&Type"]!(algId.parameters);
            return crypto.scrypt(
                password,
                parameters.salt,
                parameters.keyLength
                    ? Number(parameters.keyLength)
                    : 128,
                {
                    cost: Number(parameters.costParameter),
                    blockSize: Number(parameters.blockSize),
                    parallelization: Number(parameters.parallelizationParameter),
                    maxmem: 64 * 1024 * 1024, // This makes a cost of 32768 possible.
                },
                (e, k) => {
                    if (e) {
                        reject(e);
                        return;
                    }
                    resolve(k);
                },
            );
        } else {
            return null;
        }
    });
}

export default encryptPassword;
