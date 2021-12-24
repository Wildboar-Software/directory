import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Vertex } from "@wildboar/meerkat-types";
import readChildren from "../dit/readChildren";
import compareRDN from "@wildboar/x500/src/lib/comparators/compareRelativeDistinguishedName";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

export
async function findEntry (
    ctx: Context,
    dit: DIT,
    dn: DistinguishedName,
    derefAliases: boolean = true,
): Promise<Vertex | undefined> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const currentVertex = derefAliases
        ? (dit.dse.alias
            ? await findEntry(ctx, dit, dit.dse.alias.aliasedEntryName, derefAliases)
            : dit)
        : dit;
    if (!currentVertex) {
        return undefined;
    }
    if (dn.length === 0) {
        return ctx.dit.root;
    }
    // To minimize modification by reference.
    const query: DistinguishedName = [ ...dn ];
    const queriedRDN = query.shift();
    if (!queriedRDN) {
        return undefined; // This should never happen.
    }
    let cursorId: number | undefined;
    const getNextBatchOfSubordinates = () => readChildren(
        ctx,
        currentVertex,
        ctx.config.entriesPerSubordinatesPage,
        undefined,
        cursorId,
        {
            AND: queriedRDN.map((atav) => ({
                RDN: {
                    some: {
                        type: atav.type_.toString(),
                    },
                },
            })),
        },
    );
    /**
     * Otherwise, we repeat the process by querying each child vertex of the DIT
     * with a distinguished name whose terminal RDN has been truncated.
     */
    let subordinates = await getNextBatchOfSubordinates();
    while (subordinates.length) {
        for (const subordinate of subordinates) {
            const rdnMatched = compareRDN(queriedRDN, subordinate.dse.rdn, NAMING_MATCHER);
            if (!rdnMatched) {
                cursorId = subordinate.dse.id;
                continue;
            }
            if (query.length === 0) {
                return subordinate;
            }
            const found = await findEntry(ctx, subordinate, query, derefAliases);
            if (found) {
                return found;
            }
            cursorId = subordinate.dse.id;
        }
        subordinates = await getNextBatchOfSubordinates();
    }
}

export default findEntry;
