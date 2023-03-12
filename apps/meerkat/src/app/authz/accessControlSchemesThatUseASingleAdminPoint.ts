import {
    simplifiedAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/simplifiedAccessControlScheme.va";
import {
    rule_and_simple_access_control,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/rule-and-simple-access-control.va";
import { IndexableOID } from "@wildboar/meerkat-types";

/**
 * @summary The access control schemes that use a single admin point
 * @description
 *
 * This is a set of stringified object identifiers in dot-delimited notation,
 * each of which is an access control scheme that uses a single access control
 * administrative point to make access control decisions.
 *
 * @constant
 */
export
const accessControlSchemesThatUseASingleAdminPoint: Set<IndexableOID> = new Set([
    simplifiedAccessControlScheme.toString(),
    rule_and_simple_access_control.toString(),
]);

export default accessControlSchemesThatUseASingleAdminPoint;
