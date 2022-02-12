import type { Context, Vertex } from "@wildboar/meerkat-types";
import type {
    DistinguishedName,
} from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import rdnToID from "./rdnToID";
import vertexFromDatabaseEntry from "../database/vertexFromDatabaseEntry";

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
        currentRoot = await vertexFromDatabaseEntry(ctx, currentRoot, dbe, false);
        if (currentRoot.dse.alias && derefedAliases) {
            return dnToVertex(ctx, ctx.dit.root, currentRoot.dse.alias.aliasedEntryName, derefedAliases);
        }
    }
    return currentRoot;
}

export default dnToVertex;
