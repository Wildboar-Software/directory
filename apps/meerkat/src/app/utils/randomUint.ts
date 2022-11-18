import { randomBytes } from "node:crypto";

/**
 * @summary Get a cryptographically-secure random unsigned 32-bit integer.
 * @description
 *
 * NodeJS's `crypto.randomInt()` only generates numbers within a range of 248
 * between the min and max values. This range is simply not large enough for
 * collision resistance when it comes to generating invocation IDs, operation
 * identifiers, and other IDs within directories.
 *
 * @returns A cryptographically-secure random unsigned 32-bit integer.
 */
export
function randomUint (): number {
    return randomBytes(4).readUint32BE();
}
