import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Vertex } from "../types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";
import readChildren from "../dit/readChildren";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";

// TODO: Return the number of RDNs that matched, whether aliases were derefed.
// TODO: Accept neverDerefAliases, derefInSearching, derefFindingBaseObj, derefAlways
// TODO: Drill into database if entries are not in memory.
// TODO: Ignore entries whose deletionTimestamp is set.
// TODO: Return referrals / continuation references.

export
async function findEntry (
    ctx: Context,
    dit: DIT,
    dn: DistinguishedName,
    derefAliases: boolean = true,
): Promise<Vertex | undefined> {
    const currentVertex = derefAliases
        ? (dit.dse.alias
            ? await findEntry(ctx, dit, dit.dse.alias.aliasedEntryName, derefAliases)
            : dit)
        : dit;
    if (!currentVertex) {
        return undefined;
    }
    if ((currentVertex.dse.rdn.length === 0) && (dn.length === 0)) {
        return currentVertex;
    }
    const children = await readChildren(ctx, dit); // TODO: Pagination.
    if (currentVertex.dse.rdn.length === 0) { // Root DSE, which will not match.
        for (const child of children) {
            const found = await findEntry(ctx, child, dn, derefAliases);
            if (found) {
                return found;
            }
        }
    }
    // To minimize modification by reference.
    const query: DistinguishedName = [ ...dn ];
    const queriedRDN = query.shift();
    if (!queriedRDN) {
        return undefined;
    }
    if (queriedRDN.length !== dit.dse.rdn.length) {
        return undefined;
    }
    const rdnMatched = compareRDN(
        queriedRDN,
        dit.dse.rdn,
        (attributeType: OBJECT_IDENTIFIER) => ctx.attributes.get(attributeType.toString())?.namingMatcher,
    );
    if (!rdnMatched) {
        return undefined;
    }
    if (query.length === 0) {
        return dit; // We matched the last RDN of the query.
    }
    /**
     * Otherwise, we repeat the process by querying each child vertex of the DIT
     * with a distinguished name whose terminal RDN has been truncated.
     */
    for (const child of children) {
        const found = await findEntry(ctx, child, query, derefAliases);
        if (found) {
            return found;
        }
    }
}

export default findEntry;
