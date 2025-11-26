import {
    rule_based_access_control,
} from "@wildboar/x500/BasicAccessControl";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/BasicAccessControl";
import {
    rule_and_simple_access_control,
} from "@wildboar/x500/BasicAccessControl";
import { IndexableOID } from "../types/index.js";

/**
 * @summary The access control schemes that use rule-based access control
 * @description
 *
 * This is a set of stringified object identifiers in dot-delimited notation,
 * each of which is an access control scheme that uses Rule-Based Access
 * Control (RBAC).
 *
 * @constant
 */
export
const accessControlSchemesThatUseRBAC: Set<IndexableOID> = new Set([
    rule_based_access_control.toString(),
    rule_and_basic_access_control.toString(),
    rule_and_simple_access_control.toString(),
]);

export default accessControlSchemesThatUseRBAC;
