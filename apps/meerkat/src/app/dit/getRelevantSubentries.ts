import type { Context, Vertex } from "../types";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import dnWithinSubtreeSpecification from "@wildboar/x500/src/lib/utils/dnWithinSubtreeSpecification";
import getDistinguishedName from "../x500/getDistinguishedName";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import readChildren from "./readChildren";
import getEqualityMatcherGetter from "../x500/getEqualityMatcherGetter";

const SUBENTRY: string = id_sc_subentry.toString();

export
async function getRelevantSubentries (
    ctx: Context,
    entry: Vertex | OBJECT_IDENTIFIER[],
    entryDN: DistinguishedName,
    admPoint: Vertex,
): Promise<Vertex[]> {
    const EQUALITY_MATCHER = getEqualityMatcherGetter(ctx);
    const children = await readChildren(ctx, admPoint);
    return children
        .filter((child) => (
            child.dse.subentry
            && child.dse.objectClass.has(SUBENTRY)
            && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                entryDN,
                Array.isArray(entry)
                    ? entry
                    : Array.from(entry.dse.objectClass).map(ObjectIdentifier.fromString),
                subtree,
                getDistinguishedName(child),
                EQUALITY_MATCHER,
            ))
        ));
}

export default getRelevantSubentries;
