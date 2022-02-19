import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToID from "./rdnToID";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";

/**
 * @summary Return an in-memory vertex from its distinguished name
 * @description
 *
 * This function takes a sought-after DSE's / vertex's distinguished name and
 * attempts to locate it in the DSA information tree. If such a DSE exists, this
 * function returns it as a `Vertex`, otherwise this function returns
 * `undefined`.
 *
 * @param ctx The context object
 * @param root The root of the DIT
 * @param dn The distinguished name of the vertex sought
 * @param derefedAliases A set of database IDs of aliases dereferenced, which is
 *  used for protecting against infinite loops
 * @returns The vertex of the DSE, if it can be found, or `undefined` otherwise.
 *
 * @function
 * @async
 */
export
async function dnToVertex (
    ctx: Context,
    root: Vertex,
    dn: DistinguishedName,
    derefedAliases?: Set<number>,
): Promise<Vertex | undefined> {
    let currentRoot: Vertex = root;
    for (let i = 0; i < dn.length; i++) {
        const id = await rdnToID(ctx, currentRoot.dse.id, dn[i]);
        if (!id) {
            return undefined;
        }
        if (derefedAliases?.has(id)) {
            return undefined;
        }
        derefedAliases?.add(id);
        const dbe = await ctx.db.entry.findUnique({
            where: {
                id,
            },
        });
        if (!dbe) {
            return undefined;
        }
        currentRoot = await vertexFromDatabaseEntry(ctx, currentRoot, dbe);
        if (currentRoot.dse.alias && derefedAliases) {
            return dnToVertex(ctx, ctx.dit.root, currentRoot.dse.alias.aliasedEntryName, derefedAliases);
        }
    }
    return currentRoot;
}

export default dnToVertex;
