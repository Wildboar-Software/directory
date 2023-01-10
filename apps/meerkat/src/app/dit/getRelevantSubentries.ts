import type { Context, Vertex } from "@wildboar/meerkat-types";
import dnWithinSubtreeSpecification from "@wildboar/x500/src/lib/utils/dnWithinSubtreeSpecification";
import getDistinguishedName from "../x500/getDistinguishedName";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import readSubordinates from "./readSubordinates";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";
import { subtreeSpecification } from "@wildboar/x500/src/lib/collections/attributes";
import { _decode_SubtreeSpecification } from "@wildboar/x500/src/lib/modules/InformationFramework/SubtreeSpecification.ta";
import { attributeValueFromDB } from "../database/attributeValueFromDB";

/**
 * @summary Get the subentries whose subtree specification select for an entry
 * @description
 *
 * This function returns the subentries whose subtree specifications select an
 * entry of interest. This takes into account the object classes of the entry,
 * chop, and so on.
 *
 * @param ctx The context object
 * @param entry The DSE whose relevant subentries are to be returned, or just an
 *  array of object identifiers of the object classes the entry has.
 * @param entryDN The distinguished name of the DSE given by the `entry` parameter
 * @param admPoint The autonomous administrative point
 * @returns An array of vertices, which are the subentries whose subtree
 *  specification selected for the specified entry
 *
 * @function
 * @async
 */
export
async function getRelevantSubentries (
    ctx: Context,
    entry: Vertex | OBJECT_IDENTIFIER[],
    entryDN: DistinguishedName,
    admPoint: Vertex,
    // TODO: Add parameter to only select subentries having a specific object class.
): Promise<Vertex[]> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const subentries = await readSubordinates(ctx, admPoint, undefined, undefined, undefined, {
        subentry: true,
    });
    const objectClasses = Array.isArray(entry)
        ? entry
        : Array.from(entry.dse.objectClass.values()).map(ObjectIdentifier.fromString);
    const subtree_rows = await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: subentries.map((c) => c.dse.id),
            },
            type_oid: subtreeSpecification["&id"].toBytes(),
        },
        select: {
            entry_id: true,
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    });
    const relevant_sub_ids: Set<number> = new Set();
    for (const row of subtree_rows) {
        const el = attributeValueFromDB(row);
        const subtree = _decode_SubtreeSpecification(el);
        if (dnWithinSubtreeSpecification(
            entryDN,
            objectClasses,
            subtree,
            getDistinguishedName(admPoint),
            NAMING_MATCHER,
        )) {
            relevant_sub_ids.add(row.entry_id);
        }
    }
    const ret: Vertex[] = [];
    for (const subentry of subentries) {
        if (relevant_sub_ids.has(subentry.dse.id)) {
            ret.push(subentry);
            relevant_sub_ids.delete(subentry.dse.id);
        }
    }
    return ret;
}

export default getRelevantSubentries;
