import type { Context, Vertex } from "@wildboar/meerkat-types";
import {
    id_sc_subentry,
} from "@wildboar/x500/src/lib/modules/InformationFramework/id-sc-subentry.va";
import dnWithinSubtreeSpecification from "@wildboar/x500/src/lib/utils/dnWithinSubtreeSpecification";
import getDistinguishedName from "../x500/getDistinguishedName";
import { OBJECT_IDENTIFIER, ObjectIdentifier } from "asn1-ts";
import type { DistinguishedName } from "@wildboar/x500/src/lib/modules/InformationFramework/DistinguishedName.ta";
import readSubordinates from "./readSubordinates";
import getNamingMatcherGetter from "../x500/getNamingMatcherGetter";

const SUBENTRY: string = id_sc_subentry.toString();

export
async function getRelevantSubentries (
    ctx: Context,
    entry: Vertex | OBJECT_IDENTIFIER[],
    entryDN: DistinguishedName,
    admPoint: Vertex,
): Promise<Vertex[]> {
    const NAMING_MATCHER = getNamingMatcherGetter(ctx);
    const children = await readSubordinates(ctx, admPoint, undefined, undefined, undefined, {
        subentry: true,
    });
    return children
        .filter((child) => (
            child.dse.subentry
            && child.dse.objectClass.has(SUBENTRY)
            && child.dse.subentry.subtreeSpecification.some((subtree) => dnWithinSubtreeSpecification(
                entryDN,
                Array.isArray(entry)
                    ? entry
                    : Array.from(entry.dse.objectClass.values()).map(ObjectIdentifier.fromString),
                subtree,
                getDistinguishedName(admPoint),
                NAMING_MATCHER,
            ))
        ));
}

export default getRelevantSubentries;
