import type { BIT_STRING } from "@wildboar/asn1";

/**
 * @summary Print a bit string as a string of 1s and 0s.
 * @description
 *
 * Converts a `BIT STRING` into a string of 1s and 0s.
 *
 * @param bits The bit string to print
 * @returns The string representation of the bit string
 */
export
function printBitString (bits: BIT_STRING) {
    let str: string = "";
    for (const bit of bits) {
        str += bit.toString();
    }
    return str;
}

export default printBitString;
