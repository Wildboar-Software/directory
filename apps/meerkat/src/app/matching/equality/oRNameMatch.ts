import { Buffer } from "node:buffer";
import type { Context } from "../../types/index.js";
import type { ASN1Element } from "@wildboar/asn1";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import { _decode_ORName } from "@wildboar/x400/MTSAbstractService";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import {
    type ORName,
    _decode_ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import { orAddressesMatch } from "./orAddressUtilities.js";

export
function getORNameMatcherTyped (ctx: Context): (assertion: ORName, value: ORName) => boolean {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return(
        assertion: ORName,
        value: ORName,
    ): boolean => {
        const a = assertion;
        const v = value;
        if (a.directory_name) {
            if (v.directory_name) {
                const namesMatch = compareDistinguishedName(
                    a.directory_name.rdnSequence,
                    v.directory_name.rdnSequence,
                    namingMatcher,
                );
                if (namesMatch) {
                    return true; // Either the DN or ORAddress must match.
                }
                return orAddressesMatch(a, v);
            }
        }
        return orAddressesMatch(a, v);
    };
}

export
function getORNameMatcher (ctx: Context): EqualityMatcher {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return(
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        // If the two values are byte-for-byte equal, return.
        if (!Buffer.compare(assertion.value, value.value)) {
            return true;
        }
        const a = _decode_ORName(assertion);
        const v = _decode_ORName(value);
        if (a.directory_name) {
            if (v.directory_name) {
                const namesMatch = compareDistinguishedName(
                    a.directory_name.rdnSequence,
                    v.directory_name.rdnSequence,
                    namingMatcher,
                );
                if (namesMatch) {
                    return true; // Either the DN or ORAddress must match.
                }
                return orAddressesMatch(a, v);
            }
        }
        return orAddressesMatch(a, v);
    };
}

export default getORNameMatcher;
