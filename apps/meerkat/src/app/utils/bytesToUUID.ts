import { Buffer } from "node:buffer";
import type { UUID } from "../types/index.js";

/**
 * @summary Converts a binary UUID to a string UUID
 * @description
 *
 * Converts the binary UUID to the standard string representation of a UUID.
 *
 * @example
 *
 * These bytes being used as input:
 *
 * `cd a5 99 46 8c 59 48 a3 b9 3e 4d ac 85 d0 b8 02`
 *
 * Will produce this UUID: `cda59946-8c59-48a3-b93e-4dac85d0b802`
 *
 * @param bytes All 16 bytes of the binary UUID
 * @returns The standard hexadecimal string representation of the UUID
 *
 * @function
 */
export
function bytesToUUID (bytes: Uint8Array): UUID {
    const buf = Buffer.from(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
    );
    return (
        buf.subarray(0, 4).toString("hex") +
        "-" +
        buf.subarray(4, 6).toString("hex") +
        "-" +
        buf.subarray(6, 8).toString("hex") +
        "-" +
        buf.subarray(8, 10).toString("hex") +
        "-" +
        buf.subarray(10, 16).toString("hex")
    );
}

export default bytesToUUID;
