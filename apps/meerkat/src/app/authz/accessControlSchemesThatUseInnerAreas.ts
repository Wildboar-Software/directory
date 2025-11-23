import {
    basicAccessControlScheme,
} from "@wildboar/x500/BasicAccessControl";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/BasicAccessControl";
import { IndexableOID } from "@wildboar/meerkat-types";

/**
 * @summary The access control schemes that use access control inner areas
 * @description
 *
 * This is a set of stringified object identifiers in dot-delimited notation,
 * each of which is an access control scheme that uses access control inner
 * areas.
 *
 * @constant
 */
export
const accessControlSchemesThatUseInnerAreas: Set<IndexableOID> = new Set([
    basicAccessControlScheme.toString(),
    rule_and_basic_access_control.toString(),
]);

export default accessControlSchemesThatUseInnerAreas;
