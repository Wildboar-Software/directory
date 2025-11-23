import { BIT_STRING, TRUE_BIT } from "@wildboar/asn1";

/**
 * @summary Convert an ASN.1 BIT STRING into a signed 32-bit integer
 * @description
 *
 * This function takes an ASN.1 BIT STRING and converts it to a signed 32-bit
 * integer, where the most significant bit of this integer corresponds to the
 * first bit of the `BIT STRING`.
 *
 * If the `BIT STRING` is longer than 32 bits, the excess bits are ignored. If
 * the `BIT STRING` is shorter than 32 bits, the trailing bits remain unset (0).
 *
 * @param bs The `BIT STRING` to be converted to an int32
 * @returns An int32 whose bits are identical to those of the input `BIT STRING`
 *
 * @function
 * @see {@link get_bit_string_from_int32}, which is an imperfect inverse of this function.
 */
export
function get_int32_from_bit_string (bs?: BIT_STRING): number {
    if (!bs) {
        return 0;
    }
    let ret: number = 0;
    const len: number = Math.min(bs.length, 32);
    for (let i = 0; i < len; i++) {
        if (bs[i] === TRUE_BIT) {
            ret |= (1 << (31 - i));
        }
    }
    return ret;
}

/**
 * @summary Convert a signed 32-bit integer into an ASN.1 BIT STRING
 * @description
 *
 * This function takes a signed 32-bit integer and converts it to an ASN.1
 * `BIT STRING`, where the most significant bit of the integer becomes the first
 * bit of the `BIT STRING`.
 *
 * Regardless of the input integer, the `BIT STRING` returned is _always_ 32
 * bits long. Trailing 0-bits are not truncated by this implementation.
 *
 * @param int The signed 32-bit integer to be converted to an ASN.1 `BIT STRING`
 * @returns An ASN.1 `BIT STRING`
 *
 * @function
 * @see {@link get_int32_from_bit_string}, which is an imperfect inverse of this function.
 */
export
function get_bit_string_from_int32 (int: number): BIT_STRING {
    let last_set: number = -1;
    const ret: BIT_STRING = new Uint8ClampedArray(32);
    for (let i = 0; i < 32; i++) {
        if (int & (1 << (31 - i))) {
            ret[i] = TRUE_BIT;
            last_set = i;
        }
    }
    return ret.subarray(0, last_set + 1);
}
