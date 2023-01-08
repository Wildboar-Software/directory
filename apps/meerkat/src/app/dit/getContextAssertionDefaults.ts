import type {
    Context,
    Vertex,
} from "@wildboar/meerkat-types";
import {
    contextAssertionDefaults,
    contextAssertionSubentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/contextAssertionSubentry.oa";
import {
    TypeAndContextAssertion, _decode_TypeAndContextAssertion,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/TypeAndContextAssertion.ta";
import { attributeValueFromDB } from "../database/attributeValueFromDB";

const CAD_SUBENTRY: string = contextAssertionSubentry["&id"].toString();

/**
 * @summary Get the context assertion defaults for an entry
 * @description
 *
 * This function retrieves the context assertion defaults for an entry.
 *
 * @param ctx The context object
 * @param entry The entry whose context assertion defaults are to be determined
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
    entry: Vertex,
    relevantSubentries: Vertex[],
): Promise<TypeAndContextAssertion[]> {
    const cadSubentries = relevantSubentries
        .filter((sub) => sub.dse.objectClass.has(CAD_SUBENTRY))
        .reverse();
    if (cadSubentries.length === 0) {
        return [];
    }
    const firstAdmPointUUID = cadSubentries[0].dse.uuid;
    let i: number = 0;
    for (const subentry of cadSubentries) {
        i++;
        if (subentry.immediateSuperior?.dse.uuid !== firstAdmPointUUID) {
            break;
        }
    }
    return (await ctx.db.attributeValue.findMany({
        where: {
            entry_id: {
                in: cadSubentries.slice(0, i).map((c) => c.dse.id),
            },
            type: contextAssertionDefaults["&id"].toString(),
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
