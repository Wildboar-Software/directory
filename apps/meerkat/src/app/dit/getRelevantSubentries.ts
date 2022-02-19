import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import dnWithinSubtreeSpecification from "@wildboar/x500/src/lib/utils/dnWithinSubtreeSpecification";
import getDistinguishedName from "../x500/getDistinguishedName";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import readSubordinates from "./readSubordinates";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

const SUBENTRY: string = id_sc_subentry.toString();

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
): Promise<Vertex[]> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const children = await readSubordinates(ctx, admPoint, undefined, undefined, undefined, {
        subentry: true,
    });
    const objectClasses = Array.isArray(entry)
        ? entry
        : Array.from(entry.dse.objectClass.values()).map(ObjectIdentifier.fromString);
    return children
        .filter((child) => (
            child.dse.subentry
            && child.dse.objectClass.has(SUBENTRY)
            && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                entryDN,
                objectClasses,
                subtree,
                getDistinguishedName(admPoint),
                NAMING_MATCHER,
            ))
        ));
}

export default getRelevantSubentries;
