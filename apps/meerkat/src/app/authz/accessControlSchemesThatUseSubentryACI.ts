import {
    basicAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/basicAccessControlScheme.va";
import {
    simplifiedAccessControlScheme,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/simplifiedAccessControlScheme.va";
import {
    rule_and_basic_access_control,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/rule-and-basic-access-control.va";
import {
    rule_and_simple_access_control,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/rule-and-simple-access-control.va";
import { IndexableOID } from "@wildboar/meerkat-types";

export
const accessControlSchemesThatUseSubentryACI: Set<IndexableOID> = new Set([
    basicAccessControlScheme.toString(),
    simplifiedAccessControlScheme.toString(),
    rule_and_basic_access_control.toString(),
    rule_and_simple_access_control.toString(),
]);

export default accessControlSchemesThatUseSubentryACI;
