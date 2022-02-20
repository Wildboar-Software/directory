import { BIT_STRING, TRUE_BIT } from "asn1-ts";
import unsupportedAndCriticalExtensions from "./unsupportedAndCriticalExtensions";

const naughtyList: Set<number> = new Set(
    Array.from(unsupportedAndCriticalExtensions)
        .map((bit, index) => (bit === TRUE_BIT) ? index : -1),
);

/**
 * @summary Identify which critical extension, if any, is not supported
 * @description
 *
 * This function returns a critical extension that was requested but not
 * supported, if there is one that was requested.
 *
 * @param requested The bit string containing the requested critical extensions.
 * @returns The number of the first unsupported critical extension to be found
 *  among the list, or `undefined` if all requested critical extensions are
 *  supported.
 *
 * @function
 */
export
function unmetCriticalExtension (requested: BIT_STRING): number | undefined {
    for (const naughtyBit of naughtyList.values()) {
        if (requested[naughtyBit] === TRUE_BIT) {
            return naughtyBit;
        }
    }
}

export default unmetCriticalExtension;
