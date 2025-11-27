import type { IndexableOID } from "../types/index.js";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";

/**
 * @summary Group items by object identifier
 * @description
 *
 * This function takes an array of any kind of object and groups them by their
 * object identifier into an object whose keys are dot-delimited string
 * representations of the object identifier, and whose values are arrays of
 * values having a common object identifier.
 *
 * @param items The items to be grouped.
 * @param oidGetter A function that takes one item and returns its object
 *  identifier
 * @returns A dictionary of items by common object identifier.
 *
 * @function
 * 
 * @deprecated Use the `groupByOID` from `@wildboar/x500` instead.
 */
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
