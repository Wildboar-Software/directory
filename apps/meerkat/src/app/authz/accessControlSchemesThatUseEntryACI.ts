import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/rule-and-basic-access-control.va";
import { IndexableOID } from "../types";

export
const accessControlSchemesThatUseEntryACI: Set<IndexableOID> = new Set([
    basicAccessControlScheme.toString(),
    rule_and_basic_access_control.toString(),
]);

export default accessControlSchemesThatUseEntryACI;
