import type { Context } from "../types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import type { OBJECT_IDENTIFIER } from "asn1-ts";

export
function isPrefix (
    ctx: Context,
    prefix: DistinguishedName,
    name: DistinguishedName,
): boolean {
    return compareRDNSequence(
        prefix,
        name.slice(0, prefix.length),
        (type_: OBJECT_IDENTIFIER): EqualityMatcher | undefined => ctx.attributes.get(type_.toString())?.namingMatcher
    );
}

export default isPrefix;
