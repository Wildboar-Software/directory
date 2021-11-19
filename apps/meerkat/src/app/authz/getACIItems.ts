import type { Vertex } from "@wildboar/meerkat-types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import accessControlSchemesThatUseEntryACI from "../authz/accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "../authz/accessControlSchemesThatUsePrescriptiveACI";
import accessControlSchemesThatUseSubentryACI from "../authz/accessControlSchemesThatUseSubentryACI";
import type {
    ACIItem,
} from "@wildboar/x500/src/lib/modules/BasicAccessControl/ACIItem.ta";

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
    return [
        ...(accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME)
            ? relevantSubentries.flatMap((subentry) => subentry.dse.subentry!.prescriptiveACI ?? [])
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? (vertex?.dse.entryACI ?? [])
            : []),
    ];
}

export default getACIItems;
