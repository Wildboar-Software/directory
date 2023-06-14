import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import compareRDNSequence from "@wildboar/x500/src/lib/comparators/compareRDNSequence";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

/**
 * @summary Determine whether one distinguished name is a prefix of another
 * @description
 *
 * This function returns `true` if the distinguished name given by `prefix` is,
 * in fact, a prefix of the distinguished name given by `name`. It also returns
 * `true` if both names are equal.
 *
 * @param ctx The context object
 * @param prefix The asserted prefix distinguished name
 * @param name The actual distinguished name, that might start with the `prefix`
 * @returns A `boolean` indicating whether the `name` starts with the `prefix`
 *
 * @function
 */
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
