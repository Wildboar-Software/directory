import type { Filter } from "@wildboar/x500/DirectoryAbstractService";

/**
 * @summary Normalize a filter into a single top-level OR filter.
 * @description
 *
 * Normalizes a Filter as specified in ITU Recommendation X.501 (2016), Annex Q.
 * This should result in a filter where the only ORs are at the top level, and
 * everything beneath them are composed of ANDs, NOTs, and filter items.
 *
 * @param filter The filter to be normalized.
 * @returns A normalized filter.
 */
export
function normalizeFilter (filter: Filter): Filter {
    if ("not" in filter) {
        const subfilter = filter.not;
        if ("not" in subfilter) { // Double negative.
            return subfilter.not;
        } else if ("and" in subfilter) {
            return {
                or: subfilter.and.map((subsubfilter) => ({
                    not: subsubfilter,
                })),
            };
        } else if ("or" in subfilter) {
            return {
                and: subfilter.or.map((subsubfilter) => ({
                    not: subsubfilter,
                })),
            };
        } else {
            return filter;
        }
    } else if ("and" in filter) {
        if (filter.and.some((subfilter) => ("or" in subfilter) && (subfilter.or.length === 0))) {
            return { // One of the subfilters is always false, so this filter is always false.
                or: [],
            };
        }
        const subfilters = filter.and
            .filter((sub) => !(("and" in sub) && (sub.and.length === 0))) // Ignore and:{} subfilters.
            .map((sub) => normalizeFilter(sub))
            .flatMap((sub) => (("and" in sub) ? sub.and : [ sub ]))
            .map((sub) => normalizeFilter(sub)); // It may be necessary again.
        // I think you only have to do this for one or:{} in the and:{}.
        const orsubIndex = subfilters.findIndex((sf) => ("or" in sf));
        if (orsubIndex > -1) {
            const orsub = subfilters.splice(orsubIndex, 1)[0];
            if (!("or" in orsub)) {
                throw new Error(); // This should never happen.
            }
            return normalizeFilter({
                or: orsub.or.map((subsub) => ({
                    and: [ subsub, ...subfilters ],
                })),
            });
        } else {
            return {
                and: subfilters,
            };
        }
    } else if ("or" in filter) {
        if (filter.or.some((subfilter) => ("and" in subfilter) && (subfilter.and.length === 0))) {
            return { // One of the subfilters is always true, so this filter is always true.
                and: [],
            };
        }
        return {
            or: filter.or
                .filter((sub) => !(("and" in sub) && (sub.and.length === 0)))
                .flatMap((sub) => ("or" in sub) ? sub.or : [ sub ])
                .map((sub) => normalizeFilter(sub)),
        };
    } else {
        return filter;
    }
}

export default normalizeFilter;
