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
const AC_SUBENTRY: string = id_sc_accessControlSubentry.toString();
const AUTONOMOUS_AREA: string = id_ar_autonomousArea.toString();
const ACCESS_CONTROL_SPECIFIC_AREA: string = id_ar_accessControlSpecificArea.toString();
const ACCESS_CONTROL_INNER_AREA: string = id_ar_accessControlInnerArea.toString();
const BAC: string = basicAccessControlScheme.toString();
const SAC: string = simplifiedAccessControlScheme.toString();
const RBAC: string = rule_and_simple_access_control.toString();
const RSAC: string = rule_and_basic_access_control.toString();

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
            && child.dse.objectClass.has(AC_SUBENTRY)
            && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                entryDN,
                Array.from(entry.dse.objectClass).map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
                subtree,
                getDistinguishedName(child),
                (attributeType: OBJECT_IDENTIFIER): EqualityMatcher | undefined => ctx
                    .attributes
                    .get(attributeType.toString())?.equalityMatcher,
            ))
        ));
}

export
async function getACIItems (ctx: Context, entry: Vertex): Promise<ACIItem[] | null> {
    const entryDN = getDistinguishedName(entry);
    let current = entry;
    const entryACI: ACIItem[] = entry.dse.entryACI ?? []; // Still applies for subentries
    // If the entry is itself an admin point, we have to get the prescriptive
    // ACI from its children; after that, we can treat it like a normal entry.
    const children = await readChildren(ctx, entry);
    const prescriptiveACI: ACIItem[] = (entry.dse.admPoint)
        ? children
            .filter((child) => (
                child.dse.subentry
                && child.dse.objectClass.has(SUBENTRY)
                && child.dse.objectClass.has(AC_SUBENTRY)
                && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                    entryDN,
                    Array.from(entry.dse.objectClass).map((oc) => new ObjectIdentifier(oc.split(".").map((arc) => Number.parseInt(arc)))),
                    subtree,
                    getDistinguishedName(child),
                    (attributeType: OBJECT_IDENTIFIER): EqualityMatcher | undefined => ctx
                        .attributes
                        .get(attributeType.toString())?.equalityMatcher,
                ))
            )).flatMap((subentry) => subentry.dse.subentry?.prescriptiveACI ?? [])
        : [];
    const subentryACI: ACIItem[] = [];
    while (
        current.immediateSuperior
        && (
            !current.dse.admPoint
            || !(
                current.dse.admPoint.administrativeRole?.has(ACCESS_CONTROL_SPECIFIC_AREA)
                || current.dse.admPoint.administrativeRole?.has(AUTONOMOUS_AREA)
            )
        )
    ) {
        current = current.immediateSuperior;
        if (current.dse.admPoint && current.dse.admPoint.administrativeRole.has(ACCESS_CONTROL_INNER_AREA)) {
            // Prescriptive ACI of subentries do not apply to subentries in the
            // same scope, but those from superior subentries can.
            if (!entry.dse.subentry || (entry.immediateSuperior !== current)) {
                const relevantSubentries = await getRelevantSubentries(ctx, entry, entryDN, current);
                prescriptiveACI.push(...relevantSubentries.flatMap((subentry) => subentry.dse.subentry?.prescriptiveACI ?? []));
            }
            subentryACI.push(...current.dse.admPoint?.subentryACI ?? []);
        }
    }
    if (!current.dse.admPoint) { // If there is no administrative point, no ACI items apply.
        return null;
    }
    if (!current.dse.admPoint.administrativeRole.has(ACCESS_CONTROL_SPECIFIC_AREA)) {
        return null;
    }
    switch (current.dse.admPoint.accessControlScheme?.toString()) {
        case (BAC):
        case (RBAC): {
            return [
                ...prescriptiveACI,
                ...entryACI,
            ];
        }
        case (SAC):
        case (RSAC): {
            return [ // We still spread just to avoid mutating the array by reference.
                ...prescriptiveACI,
            ];
        }
        default: {
            // If there is no access control scheme defined, or an unrecognized
            // access control scheme, no ACI items apply.
            return null;
        }
    }
}

export default getACIItems;
