import type { Context } from "../../types/index.js";
import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_RelativeDistinguishedName,
} from "@wildboar/x500/InformationFramework";
import { compareRelativeDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter.js";

export
function getRDNMatcher (ctx: Context): EqualityMatcher {
    const namingMandatories = getNamingMatcherGetter(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_RelativeDistinguishedName(assertion);
        const v = _decode_RelativeDistinguishedName(value);
        return compareRelativeDistinguishedName(a, v, namingMandatories);
    };
}

export default getRDNMatcher;
