import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import type { Context, DIT, Entry, IndexableOID, Value } from "../types";

export
function findEntry (ctx: Context, dit: DIT, dn: DistinguishedName): Entry | undefined {
    const currentVertex = dit.aliasedEntry ?? dit;
    if (currentVertex.rdn.length === 0) { // Root DSE, which will not match.
        return dit.children // So we start the search with its children.
            .map((child) => findEntry(ctx, child, dn))
            .find((e) => e);
    }
    // To minimize modification by reference.
    const query: DistinguishedName = [ ...dn ];
    const queriedRDN = query.pop();
    if (!queriedRDN) {
        return undefined;
    }
    if (queriedRDN.length !== dit.rdn.length) {
        return undefined;
    }
    const ditRDN: Map<IndexableOID, Value> = new Map(dit.rdn.map((atav) => [ atav.type_.toString(), atav.value ]));
    const everyATAVMatched: boolean = queriedRDN.every((atav) => {
        const TYPE_OID: string = atav.type_.toString();
        const spec = ctx.attributes.get(TYPE_OID);
        if (!spec) {
            return false;
        }
        const matcher = spec.equalityMatcher;
        if (!matcher) {
            return false;
        }
        const ditValue = ditRDN.get(TYPE_OID);
        if (!ditValue) {
            return false;
        }
        const queriedValue = atav.value;
        return matcher(queriedValue, ditValue);
    });
    if (!everyATAVMatched) {
        return undefined;
    }
    if (query.length === 0) {
        return dit; // We matched the last RDN of the query.
    }
    /**
     * Otherwise, we repeat the process by querying each child vertex of the DIT
     * with a distinguished name whose terminal RDN has been truncated.
     */
    return dit.children // So we start the search with its children.
        .map((child) => findEntry(ctx, child, query))
        .find((e) => e);
}

export default findEntry;
