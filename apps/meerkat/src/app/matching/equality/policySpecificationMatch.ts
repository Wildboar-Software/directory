import type { Context } from "@wildboar/meerkat-types";
import { type EqualityMatcher } from "@wildboar/x500";
import type { ASN1Element } from "@wildboar/asn1";
import {
    _decode_PolicySpecification,
} from "@wildboar/parity-schema/src/lib/modules/TraderDefinitions/PolicySpecification.ta.js";
import getNamingMatcherGetter from "../../x500/getNamingMatcherGetter";
import {
    compareDistinguishedName,
    directoryStringToString,
} from "@wildboar/x500";

// The definition of this rule is so vague that it almost doesn't exist.
// This seems like the proper implementation.
export
function getPolicySpecificationMatcher (ctx: Context): EqualityMatcher {
    const namingMatcher = getNamingMatcherGetter(ctx);
    return (
        assertion: ASN1Element,
        value: ASN1Element,
    ): boolean => {
        const a = _decode_PolicySpecification(assertion);
        const v = _decode_PolicySpecification(value);
        if (("stringRule" in a) && ("stringRule" in v)) {
            const astr = directoryStringToString(a.stringRule);
            const vstr = directoryStringToString(v.stringRule);
            return (astr === vstr);
        } else if (("policyObjectId" in a) && ("policyObjectId" in v)) {
            return compareDistinguishedName(
                a.policyObjectId,
                v.policyObjectId,
                namingMatcher,
            );
        } else {
            return false;
        }
    };
}

export default getPolicySpecificationMatcher;
