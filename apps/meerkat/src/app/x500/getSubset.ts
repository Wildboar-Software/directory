import type { Entry } from "../types";
import {
    SearchArgumentData_subset,
    SearchArgumentData_subset_baseObject,
    SearchArgumentData_subset_oneLevel,
    SearchArgumentData_subset_wholeSubtree,
} from "@wildboar/x500/src/lib/modules/DirectoryAbstractService/SearchArgumentData-subset.ta";

export
function getSubset (entry: Entry, subset: SearchArgumentData_subset, derefAliases: boolean = true): Entry[] {
    const base = derefAliases
        ? entry.aliasedEntry ?? entry
        : entry;
    switch (subset) {
        case (SearchArgumentData_subset_baseObject): {
            return [ base ];
        }
        case (SearchArgumentData_subset_oneLevel): {
            return base.children
                .map((child) => (derefAliases ? (child.aliasedEntry ?? child) : child));
        }
        case (SearchArgumentData_subset_wholeSubtree): {
            return base.children
                .flatMap((child) => getSubset(
                    derefAliases ? (child.aliasedEntry ?? child) : child,
                    SearchArgumentData_subset_wholeSubtree)
                );
        }
        default: {
            return [];
        }
    }
}

export default getSubset;
