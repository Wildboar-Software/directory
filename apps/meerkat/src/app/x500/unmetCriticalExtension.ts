import { BIT_STRING, FALSE_BIT, TRUE_BIT } from "@wildboar/asn1";
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
    /**
     * If the user sends us more than 64 critical extension bits, they are
     * probably acting maliciously.
     */
    if (requested.length > 64) {
        return -1;
    }
    // Currently, only up to bit 35 is defined. If any bit beyond this is set,
    // Meerkat DSA definitely does not support it.
    for (let i = 35; i < requested.length; i++) {
        if (requested[i] === TRUE_BIT) {
            return i;
        }
    }
    for (const naughtyBit of naughtyList.values()) {
        if (requested[naughtyBit] === TRUE_BIT) {
            return naughtyBit;
        }
    }
}

export default unmetCriticalExtension;
