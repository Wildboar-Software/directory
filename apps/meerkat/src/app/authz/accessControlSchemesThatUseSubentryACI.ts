import {
    basicAccessControlScheme,
} from "@wildboar/x500/BasicAccessControl";
import {
    simplifiedAccessControlScheme,
} from "@wildboar/x500/BasicAccessControl";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/BasicAccessControl";
import {
    rule_and_simple_access_control,
} from "@wildboar/x500/BasicAccessControl";
import { IndexableOID } from "@wildboar/meerkat-types";

/**
 * @summary The access control schemes that use subentry ACI items.
 * @description
 *
 * This is a set of stringified object identifiers in dot-delimited notation,
 * each of which is an access control scheme that uses subentry ACI items.
 *
 * @constant
 */
export
const accessControlSchemesThatUseSubentryACI: Set<IndexableOID> = new Set([
    basicAccessControlScheme.toString(),
    simplifiedAccessControlScheme.toString(),
    rule_and_basic_access_control.toString(),
    rule_and_simple_access_control.toString(),
]);

export default accessControlSchemesThatUseSubentryACI;
