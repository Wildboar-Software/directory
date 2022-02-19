import type { Context } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToID from "./rdnToID";

/**
 * @summary Get the database ID of a DSE from its distinguished name
 * @description
 *
 * This function takes a distinguished name and traverses the DSA information
 * tree to find a DSE having that distinguished name, and returns its database
 * ID if it can be found. If such a DSE cannot be found, it returns `undefined`.
 *
 * @param ctx The context object
 * @param root_id The database ID of the root DSE
 * @param dn The distinguished name whose database ID is sought
 * @returns The database ID of the DSE, if that DSE exists
 *
 * @function
 * @async
 */
export
async function dnToID (
    ctx: Context,
    root_id: number,
    dn: DistinguishedName,
): Promise<number | undefined> {
    let currentRootId: number = root_id;
    for (let i = 0; i < dn.length; i++) {
        const id = await rdnToID(ctx, currentRootId, dn[i]);
        if (!id) {
            return undefined;
        }
        currentRootId = id;
    }
    return currentRootId;
}

export default dnToID;
