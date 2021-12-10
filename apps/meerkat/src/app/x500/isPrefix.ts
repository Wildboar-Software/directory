import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

export
function isPrefix (
    ctx: Context,
    prefix: DistinguishedName,
    name: DistinguishedName,
): boolean {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    return compareRDNSequence(prefix, name.slice(0, prefix.length), NAMING_MATCHER);
}

export default isPrefix;
