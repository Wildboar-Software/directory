import { Buffer } from "node:buffer";
import type { Context } from "../../types/index.js";
import type { ASN1Element } from "@wildboar/asn1";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import { _decode_ORName } from "@wildboar/x400/MTSAbstractService";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";
import {
    _decode_ORAddress,
} from "@wildboar/x400/MTSAbstractService";
import { orAddressesMatch } from "./orAddressUtilities.js";

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
        if (a.directory_name) {
            const v = _decode_ORName(value);
            if (v.directory_name) {
                const namesMatch = compareDistinguishedName(
                    a.directory_name.rdnSequence,
                    v.directory_name.rdnSequence,
                    namingMatcher,
                );
                if (namesMatch) {
                    return true; // Either the DN or ORAddress must match.
                }
                const a2 = _decode_ORAddress(assertion);
                const v2 = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
                return orAddressesMatch(a2, v2);
            }
        }
        const a2 = _decode_ORAddress(assertion);
        const v2 = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
        return orAddressesMatch(a2, v2);
    };
}

export default getORNameMatcher;
