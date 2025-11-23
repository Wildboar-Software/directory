import { OBJECT_IDENTIFIER } from "@wildboar/asn1";
import { AttributeType } from "@wildboar/x500/InformationFramework";

export interface CheckMatchingUseReturn {
    problem?: OBJECT_IDENTIFIER,
    violatingAttributes: AttributeType[];
}

// Described in X.511, Section 15.4

/**
 * @summary Check matching use in a search filter
 * @description
 *
 * This function is a stub that currently does nothing. In spirit, its
 * intention is to check matching rule use according to the procedure described
 * in [ITU Recommendation X.511 (2019)](https://www.itu.int/rec/T-REC-X.511/en),
 * Section 15.4, but Meerkat DSA does not support any matching restrictions
 * currently, so this step could never be performed correctly. Meerkat DSA, as
 * such, will simply not enforce matching use restrictions.
 *
 * @returns An object containing information about what problem was encountered
 *  and with what attribute types
 *
 * @function
 */
export function check_of_matching_use(): CheckMatchingUseReturn {
    // DEVIATION: this is not checked, because it is checked during the actual search operation.
    return {
        violatingAttributes: [],
    };
}
