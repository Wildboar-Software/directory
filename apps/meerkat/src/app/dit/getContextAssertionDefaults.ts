import type {
    Context,
    Vertex,
} from "../types/index.js";
import {
    contextAssertionDefaults,
    contextAssertionSubentry,
} from "@wildboar/x500/InformationFramework";
import {
    TypeAndContextAssertion, _decode_TypeAndContextAssertion,
} from "@wildboar/x500/DirectoryAbstractService";
import { attributeValueFromDB } from "../database/attributeValueFromDB.js";

const CAD_SUBENTRY: string = contextAssertionSubentry["&id"].toString();

/**
 * @summary Get the context assertion defaults for an entry
 * @description
 *
 * This function retrieves the context assertion defaults for an entry.
 *
 * @param ctx The context object
 * @param relevantSubentries The subentries whose subtree specification selected
 *  the entry given by the `entry` parameter, in order of descending
 *  administrative point
 * @returns An array of `TypeAndContextAssertion`s, which are the applicable
 *  context assertion defaults
 *
 * @function
 */
export
async function getContextAssertionDefaults (
    ctx: Context,
    relevantSubentries: Vertex[],
): Promise<TypeAndContextAssertion[]> {
    const cadSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(CAD_SUBENTRY))
        .reverse();
    if (cadSubentries.length === 0) {
        return [];
    }
    const firstAdmPointUUID = cadSubentries[0].immediateSuperior?.dse.uuid;
    if (!firstAdmPointUUID) {
        return []; // This should never happen: a subentry with no superior.
    }
    let i: number = 0;
    for (const subentry of cadSubentries) {
        if (subentry.immediateSuperior?.dse.uuid !== firstAdmPointUUID) {
            break;
        }
        i++;
    }
    return (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: cadSubentries.slice(0, i).map((c) => c.dse.id),
            },
            type_oid: contextAssertionDefaults["&id"].toBytes(),
        },
        select: {
            tag_class: true,
            constructed: true,
            tag_number: true,
            content_octets: true,
        },
    }))
        .map((row) => {
            const el = attributeValueFromDB(row);
            return _decode_TypeAndContextAssertion(el);
        });
}

export default getContextAssertionDefaults;
