import type { IndexableOID } from "../types";
import type { OBJECT_IDENTIFIER } from "asn1-ts";

export
function groupByOID <T>(
    items: T[],
    oidGetter: (item: T) => OBJECT_IDENTIFIER | string,
): Record<IndexableOID, T[]> {
    return items.reduce(function(acc: Record<IndexableOID, T[]>, curr: T) {
        const oid = oidGetter(curr);
        const i: string = (typeof oid === "object")
            ? oid.toString()
            : oid;
        (acc[i] = acc[i] ?? []).push(curr);
        return acc;
    }, {});
};

export default groupByOID;
