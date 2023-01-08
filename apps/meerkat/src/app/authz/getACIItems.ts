import type { Vertex, Context } from "@wildboar/meerkat-types";
import { OBJECT_IDENTIFIER } from "asn1-ts";
import accessControlSchemesThatUseEntryACI from "./accessControlSchemesThatUseEntryACI";
import accessControlSchemesThatUsePrescriptiveACI from "./accessControlSchemesThatUsePrescriptiveACI";
import accessControlSchemesThatUseSubentryACI from "./accessControlSchemesThatUseSubentryACI";
import accessControlSchemesThatUseInnerAreas from "./accessControlSchemesThatUseInnerAreas";
import {
    ACIItem, _decode_ACIItem,
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
import { entryACI, prescriptiveACI, subentryACI } from "@wildboar/x500/src/lib/collections/attributes";
import { attributeValueFromDB, DBAttributeValue } from "../database/attributeValueFromDB";

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
 * @param vertex The DSE whose relevant ACI items are to be determined
 * @param relevantSubentries The subentries whose subtree select for this entry,
 *  in order of descending administrative point
 * @param isSubentry Whether the DSE in question is a subentry
 * @returns An array of ACI items that are in effect for the DSE in question.
 *
 * @function
 */
export
async function getACIItems (
    ctx: Context,
    accessControlScheme: OBJECT_IDENTIFIER | undefined,
    immediateSuperior: Vertex | undefined,
    vertex: Vertex | undefined,
    relevantSubentries: Vertex[],
    isSubentry: boolean = false,
): Promise<ACIItem[]> {
    if (!accessControlScheme) {
        return [];
    }
    const AC_SCHEME: string = accessControlScheme.toString();
    if (isSubentry || vertex?.dse.subentry) {
        return [
            ...(accessControlSchemesThatUseSubentryACI.has(AC_SCHEME)
                ? immediateSuperior?.dse.admPoint
                    ? (await ctx.db.attributeValue.findMany({
                        where: {
                            entry_id: immediateSuperior.dse.id,
                            type: subentryACI["&id"].toString(),
                        },
                        select: {
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                    })).map(aciFrom)
                    : []
                : []),
            ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
                ? vertex
                    ? (await ctx.db.attributeValue.findMany({
                        where: {
                            entry_id: vertex.dse.id,
                            type: entryACI["&id"].toString(),
                        },
                        select: {
                            tag_class: true,
                            constructed: true,
                            tag_number: true,
                            content_octets: true,
                        },
                    })).map(aciFrom)
                    : []
                : []),
        ];
    }
    const accessControlSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(AC_SUBENTRY))
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
            ? (await ctx.db.attributeValue.findMany({
                    where: {
                        entry_id: {
                            in: accessControlSubentriesWithinScope.map((s) => s.dse.id),
                        },
                        type: prescriptiveACI["&id"].toString(),
                    },
                    select: {
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
                    },
                })).map(aciFrom)
            : []),
        ...(accessControlSchemesThatUseEntryACI.has(AC_SCHEME)
            ? vertex
                ? (await ctx.db.attributeValue.findMany({
                    where: {
                        entry_id: vertex.dse.id,
                        type: entryACI["&id"].toString(),
                    },
                    select: {
                        tag_class: true,
                        constructed: true,
                        tag_number: true,
                        content_octets: true,
                    },
                })).map(aciFrom)
                : []
            : []),
    ];
}

export default getACIItems;
