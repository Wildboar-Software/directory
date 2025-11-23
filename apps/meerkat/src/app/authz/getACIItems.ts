import type { Vertex, Context } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import accessControlSchemesThatUseEntryACI from "./accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "./accessControlSchemesThatUsePrescriptiveACI";
import accessControlSchemesThatUseSubentryACI from "./accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUseInnerAreas from "./accessControlSchemesThatUseInnerAreas";
import {
    ACIItem, _decode_ACIItem,
} from "@wildboar/x500/BasicAccessControl";
import {
    accessControlSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    id_ar_accessControlSpecificArea,
} from "@wildboar/x500/InformationFramework";
import {
    id_ar_accessControlInnerArea,
} from "@wildboar/x500/InformationFramework";
import { entryACI, prescriptiveACI, subentryACI } from "@wildboar/x500/BasicAccessControl";
import { attributeValueFromDB, DBAttributeValue } from "../database/attributeValueFromDB";
import { Prisma } from "@prisma/client";
import accessControlSchemesThatUseASingleAdminPoint from "./accessControlSchemesThatUseASingleAdminPoint";

const AC_SUBENTRY: string = accessControlSubentry["&id"].toString();
const AC_SPECIFIC: string = id_ar_accessControlSpecificArea.toString();
const AC_INNER: string = id_ar_accessControlInnerArea.toString();

function aciFrom (row: DBAttributeValue): ACIItem {
    const el = attributeValueFromDB(row);
    return _decode_ACIItem(el);
}

/**
 * @summary Get the ACI items that apply to a given entry.
 * @description
 *
 * Gets the ACI items that apply to a given entry from subentries, the
 * administrative point, and entry ACI depending.
 *
 * @param accessControlScheme The access control scheme in place for the
 *  applicable access control administrative area
 * @param immediateSuperior The DSE that is immediately superior to `vertex`,
 *  supplied as a separate argument for when `vertex` does not exist yet
 * @param vertex The DSE whose relevant ACI items are to be determined. This
 *  may be `undefined` if the target entry does not exist yet, as will happen
 *  when using the `addEntry` operation.
 * @param relevantSubentries The subentries whose subtree select for this entry,
 *  in order of descending administrative point
 * @param isSubentry Whether the DSE in question is a subentry. This must be
 *  supplied as an argument because the access-controlled entry may not exist
 *  yet, as might happen in an `addEntry` operation.
 * @returns An array of ACI items that are in effect for the DSE in question.
 *
 * @function
 */
export
async function getACIItems (
    ctx: Context,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    immediateSuperior: Vertex | undefined, // TODO: Remove unused argument.
    vertex: Vertex | undefined,
    relevantSubentries: Vertex[],
    isSubentry: boolean,
): Promise<ACIItem[]> {
    if (!accessControlScheme) {
        return [];
    }
    const AC_SCHEME: string = accessControlScheme.toString();
    const useSingleAccessPoint: boolean = accessControlSchemesThatUseASingleAdminPoint.has(AC_SCHEME);
    const accessControlSubentries = relevantSubentries
        .filter((sub) => (
            sub.dse.objectClass.has(AC_SUBENTRY)
            && (
                !isSubentry
                /**
                 * Subentries under the same admin point do not govern other
                 * subentries within that admin point, but those from superior
                 * admin points do.
                 *
                 * We don't do this check if using simplified access control,
                 * because it only uses a single access point.
                 */
                || (
                    (sub.immediateSuperior!.dse.id !== vertex?.dse.id)
                    || useSingleAccessPoint
                )
            )
        ))
        .reverse();
    /**
     * It is not enough to simply stop once we've encountered the first subentry
     * whose immediate superior DSE has an ACSA administrative role, because
     * there might be other subentries under that same administrative point.
     * Instead, we must note that an ACSA has been encountered, then keep
     * iterating until we find a subentry that DOES NOT belong to that admin
     * point.
     */
    const indexOfFirstACSA: number = accessControlSubentries
        .findIndex((sub, i, array) => {
            const admPoint = sub.immediateSuperior?.dse;
            if (admPoint?.admPoint?.administrativeRole.has(AC_SPECIFIC)) {
                const next = array[i + 1];
                return (
                    // If there is no next subentry, or no next admin point
                    !next?.immediateSuperior
                    // Or the next admin point is not the same as this one...
                    || (admPoint.id !== next.immediateSuperior.dse.id)
                );
            }
            return false;
        });
    if (indexOfFirstACSA === -1) {
        return [];
    }
    const useInnerAreas: boolean = accessControlSchemesThatUseInnerAreas.has(AC_SCHEME);
    const usePrescriptiveACI: boolean = accessControlSchemesThatUsePrescriptiveACI.has(AC_SCHEME);
    const useEntryACI: boolean = accessControlSchemesThatUseEntryACI.has(AC_SCHEME);
    const useSubentryACI: boolean = isSubentry && accessControlSchemesThatUseSubentryACI.has(AC_SCHEME);
    const accessControlSubentriesWithinScope = useInnerAreas
        ? accessControlSubentries
            .slice(0, indexOfFirstACSA + 1)
            .filter((sub) => (
                sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_SPECIFIC)
                || sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_INNER)
            ))
        : accessControlSubentries
            .slice(0, indexOfFirstACSA + 1)
            .filter((sub) => sub.immediateSuperior?.dse.admPoint?.administrativeRole.has(AC_SPECIFIC));

    const aciQueries: Prisma.AttributeValueWhereInput[] = [];
    if (usePrescriptiveACI) {
        aciQueries.push({
            entry_id: {
                in: accessControlSubentriesWithinScope.map((s) => s.dse.id),
            },
            type_oid: prescriptiveACI["&id"].toBytes(),
        });
    }
    if (vertex && useEntryACI) {
        aciQueries.push({
            entry_id: vertex.dse.id,
            type_oid: entryACI["&id"].toBytes(),
        });
    }
    if (vertex?.immediateSuperior && useSubentryACI) {
        aciQueries.push({
            entry_id: vertex.immediateSuperior.dse.id,
            type_oid: subentryACI["&id"].toBytes(),
        });
    }
    return (await ctx.db.attributeValue.findMany({
        where: {
            OR: aciQueries,
        },
        select: {
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    })).map(aciFrom);
}

export default getACIItems;
