import type { Vertex, Context } from "../types/index.js";
import {
    Attribute,
} from "@wildboar/x500/InformationFramework";
import { readAttributes } from "../database/entry/readAttributes.js";
import subentryEIS from "../dop/subentryEIS.js";

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
