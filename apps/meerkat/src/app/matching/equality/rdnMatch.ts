import type { Context } from "@wildboar/meerkat-types";
import EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import type { ASN1Element } from "asn1-ts";
import {
    _decode_RelativeDistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/RelativeDistinguishedName.ta";
import { compareRelativeDistinguishedName } from "@wildboar/x500";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";

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
