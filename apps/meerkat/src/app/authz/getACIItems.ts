import type { Vertex } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import accessControlSchemesThatUseEntryACI from "./accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "./accessControlSchemesThatUsePrescriptiveACI";
import accessControlSchemesThatUseSubentryACI from "./accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUseInnerAreas from "./accessControlSchemesThatUseInnerAreas";
import type {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";
import {
    accessControlSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/accessControlSubentry.oa";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlSpecificArea.va";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-ar-accessControlInnerArea.va";

const AC_SUBENTRY: string = accessControlSubentry["&id"].toString();
const AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
const AC_INNER: string = id_ar_accessControlInnerArea.toString();

export
function getACIItems (
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    vertex: Vertex | undefined,
    relevantSubentries: Vertex[],
    isSubentry: boolean = false,
): ACIItem[] {
    if (!accessControlScheme) {
        return [];
    }
    const AC_SCHEME: string = accessControlScheme.toString();
    if (isSubentry || vertex?.dse.subentry) {
        return [
            ...(accessControlSchemesThatUseSubentryACI.has(AC_SCHEME)
                ? (vertex?.immediateSuperior?.dse.admPoint?.subentryACI ?? [])
                : []),
            ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                ? (vertex?.dse.entryACI ?? [])
                : []),
        ];
    }
    const accessControlSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(AC_SUBENTRY))
        .reverse();
    // FIXME: This needs to keep iterating until it finds the LAST subentry under the ACSA.
    const indexOfFirstACSA: number = accessControlSubentries
        .findIndex((sub) => sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_SPECIFIC));
    if (indexOfFirstACSA === -1) {
        return [];
    }
    const accessControlSubentriesWithinScope = accessControlSchemesThatUseInnerAreas.has(AC_SCHEME)
        ? accessControlSubentries
            .slice(0, indexOfFirstACSA + 1)
            .filter((sub) => (
                sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_SPECIFIC)
                || sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_INNER)
            ))
        : [ accessControlSubentries[0] ];
    return [
        ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
            ? accessControlSubentriesWithinScope.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? (vertex?.dse.entryACI ?? [])
            : []),
    ];
}

export default getACIItems;
