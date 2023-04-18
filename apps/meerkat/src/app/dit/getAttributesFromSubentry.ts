import type { Vertex, Context } from "@wildboar/meerkat-types";
import {
    Attribute,
} from "@wildboar/x500/src/lib/modules/InformationFramework/Attribute.ta";
import { readAttributes } from "../database/entry/readAttributes";
import subentryEIS from "../dop/subentryEIS";

/**
 * @summary Reads a specific subset of attributes from a subentry
 * @description
 *
 * This function reads a specific subset of attributes from a subentry. It's
 * purpose is for constructing subentry information when establishing
 * hierarchical operational bindings.
 *
 * @param subentry The subentry vertex whose attributes are to be read
 * @returns An array of attributes from the subentry
 *
 * @function
 */
export
async function getAttributesFromSubentry (ctx: Context, subentry: Vertex): Promise<Attribute[]> {
    if (!subentry.dse.subentry) {
        return [];
    }

    const {
        userAttributes,
        operationalAttributes,
    } = await readAttributes(ctx, subentry, {
        selection: subentryEIS,
    });

    return [
        ...userAttributes,
        ...operationalAttributes,
        ...subentry.dse.subentry.collectiveAttributes ?? [],
    ];
}

export default getAttributesFromSubentry;
