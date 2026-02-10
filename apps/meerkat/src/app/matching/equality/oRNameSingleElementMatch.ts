import type { ASN1Element } from "@wildboar/asn1";
import type { EqualityMatcher } from "@wildboar/x500";
import { _decode_ORName } from "@wildboar/x400/MTSAbstractService";
import {
    _decode_ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import {
    _decode_MSString,
} from "@wildboar/x400/MSMatchingRules";
import { msStringToString, orAddressToInfo } from "./orAddressUtilities.js";

// TODO: Tail recursion.
export
function extractStrings (value: unknown): string[] {
    if (typeof value === "string") {
        return [ value ];
    } else if (typeof value === "object") {
        if (!value) {
            return [];
        }
        return Object.values(value).flatMap(extractStrings);
    } else {
        return [];
    }
}

export
const oRNameSingleElementMatch: EqualityMatcher = (
    assertion: ASN1Element,
    value: ASN1Element,
): boolean => {
    const a: string = msStringToString(_decode_MSString(assertion))
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();
    const v = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
    const vInfo = orAddressToInfo(v);
    if (!vInfo) {
        return false;
    }
    const stringsInValue = extractStrings(vInfo);
    for (const strInValue of stringsInValue) {
        const s = strInValue.trim().replace(/\s+/g, " ").toUpperCase();
        if (s === a) {
            return true;
        }
    }
    const v2 = _decode_ORName(value);
    if (v2.directory_name) {
        for (const rdn of v2.directory_name.rdnSequence) {
            for (const atav of rdn) {
                if (atav.value.toString() === `"${a}"`) {
                    return true;
                }
            }
        }
    }
    return false;
}

export default oRNameSingleElementMatch;
