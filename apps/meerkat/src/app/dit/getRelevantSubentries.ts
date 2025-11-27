import type { Context, Vertex } from "../types/index.js";
import { dnWithinSubtreeSpecification } from "@wildboar/x500";
import getDistinguishedName from "../x500/getDistinguishedName.js";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "@wildboar/asn1";
import type { DistinguishedName } from "@wildboar/x500/InformationFramework";
import readSubordinates from "./readSubordinates.js";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter.js";
import { subtreeSpecification } from "@wildboar/x500/InformationFramework";
import { _decode_SubtreeSpecification } from "@wildboar/x500/InformationFramework";
import { attributeValueFromDB } from "../database/attributeValueFromDB.js";
import type { EntryWhereInput } from "../generated/models/Entry.js";

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
 * @param where Additional Prisma selection of subentries.
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
    where?: EntryWhereInput,
    subentryCache?: Map<number, Vertex[]>,
): Promise<Vertex[]> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const subentries = subentryCache?.get(admPoint.dse.id) ?? await readSubordinates(
        ctx,
        admPoint,
        undefined,
        undefined,
        undefined,
        {
            ...where,
            subentry: true,
        },
    );
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
    const admPointDN = getDistinguishedName(admPoint);
    for (const row of subtree_rows) {
        const el = attributeValueFromDB(row);
        const subtree = _decode_SubtreeSpecification(el);
        if (dnWithinSubtreeSpecification(
            entryDN,
            objectClasses,
            subtree,
            admPointDN,
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
    subentryCache?.set(admPoint.dse.id, subentries);
    return ret;
}

export default getRelevantSubentries;
