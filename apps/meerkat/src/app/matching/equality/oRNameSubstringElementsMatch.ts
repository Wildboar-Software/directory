import type { Context } from "@wildboar/meerkat-types";
import type { ASN1Element } from "asn1-ts";
import { compareDistinguishedName, EqualityMatcher } from "@wildboar/x500";
import { _decode_ORName } from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORName.ta";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import {
    _decode_ORAddress,
} from "@wildboar/x400/src/lib/modules/MTSAbstractService/ORAddress.ta";
import { orAddressIsSubstringSubset } from "./oRAddressSubstringElementsMatch";

export
function getORNameSubstringElementsMatcher (ctx: Context): EqualityMatcher {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return(
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_ORName(assertion);
        if (a.directory_name) {
            const v = _decode_ORName(value);
            if (v.directory_name) {
                // TODO: Match upon RDN presence substrings. (This could be an approximate matching rule implementation.)
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
                return orAddressIsSubstringSubset(a2, v2);
            }
        }
        const a2 = _decode_ORAddress(assertion);
        const v2 = _decode_ORAddress(value); // TODO: Make ORName a subclass of ORAddress.
        return orAddressIsSubstringSubset(a2, v2);
    };
}

export default getORNameSubstringElementsMatcher;
