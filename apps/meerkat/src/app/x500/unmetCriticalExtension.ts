import { BIT_STRING, TRUE_BIT } from "asn1-ts";
import unsupportedAndCriticalExtensions from "./unsupportedAndCriticalExtensions";

const naughtyList: Set<number> = new Set(
    Array.from(unsupportedAndCriticalExtensions)
        .map((bit, index) => (bit === TRUE_BIT) ? index : -1),
);

export
function unmetCriticalExtension (requested: BIT_STRING): number | undefined {
    for (const naughtyBit of naughtyList.values()) {
        if (requested[naughtyBit] === TRUE_BIT) {
            return naughtyBit;
        }
    }
}

export default unmetCriticalExtension;
