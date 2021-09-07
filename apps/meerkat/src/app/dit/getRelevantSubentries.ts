import type { Context, Vertex } from "../types";
import {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";
import {
    id_ar_autonomousArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-autonomousArea.va";
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
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import {
    id_sc_accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-accessControlSubentry.va";
import dnWithinSubtreeSpecification from "@wildboar/x500/src/lib/utils/dnWithinSubtreeSpecification";
import type EqualityMatcher from "@wildboar/x500/src/lib/types/EqualityMatcher";
import getDistinguishedName from "../x500/getDistinguishedName";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import readChildren from "./readChildren";

const SUBENTRY: string = id_sc_subentry.toString();

export
async function getRelevantSubentries (
    ctx: Context,
    entry: Vertex,
    entryDN: DistinguishedName,
    admPoint: Vertex,
): Promise<Vertex[]> {
    const children = await readChildren(ctx, admPoint);
    return children
        .filter((child) => (
            child.dse.subentry
            && child.dse.objectClass.has(SUBENTRY)
            && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                entryDN,
                Array.from(entry.dse.objectClass).map(ObjectIdentifier.fromString),
                subtree,
                getDistinguishedName(child),
                (attributeType: OBJECT_IDENTIFIER): EqualityMatcher | undefined => ctx
                    .attributes
                    .get(attributeType.toString())?.equalityMatcher,
            ))
        ));
}

export default getRelevantSubentries;
