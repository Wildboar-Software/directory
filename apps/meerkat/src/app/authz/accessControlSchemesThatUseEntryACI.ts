import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/rule-and-basic-access-control.va";
import { IndexableOID } from "@wildboar/meerkat-types";

/**
 * @summary The access control schemes that use entry ACI items.
 * @description
 *
 * This is a set of stringified object identifiers in dot-delimited notation,
 * each of which is an access control scheme that uses entry ACI items.
 *
 * @constant
 */
export
const accessControlSchemesThatUseEntryACI: Set<IndexableOID> = new Set([
    basicAccessControlScheme.toString(),
    rule_and_basic_access_control.toString(),
]);

export default accessControlSchemesThatUseEntryACI;
