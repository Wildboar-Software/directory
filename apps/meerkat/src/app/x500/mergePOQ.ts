import { TRUE_BIT, FALSE_BIT, type BIT_STRING } from "@wildboar/asn1";
import {
    PartialOutcomeQualifier,
    type LimitProblem,
    LimitProblem_sizeLimitExceeded as sizeLimitExceeded,
    LimitProblem_administrativeLimitExceeded as adminLimitExceeded,
    LimitProblem_timeLimitExceeded as timeLimitExceeded,
} from "@wildboar/x500/DirectoryAbstractService";

/**
 * @summary Merge two partial outcome qualifiers
 * @description
 *
 * Joins two partial outcome qualifiers to create one `PartialOutcomeQualifier`.
 *
 * @param a One `PartialOutcomeQualifier`
 * @param b The other `PartialOutcomeQualifier`
 * @returns A new, merged `PartialOutcomeQualifier`
 *
 * @function
 */
export
function mergePOQ (a: PartialOutcomeQualifier, b: PartialOutcomeQualifier): PartialOutcomeQualifier {
    return new PartialOutcomeQualifier(
        // If the limit problems are the same, use either.
        // If one is undefined, use the other.
        ((a.limitProblem ?? b.limitProblem) === (b.limitProblem ?? a.limitProblem))
            ? (a.limitProblem ?? b.limitProblem)
            : undefined,
        (a.unexplored?.length || b.unexplored?.length)
            ? [
                ...(a.unexplored ?? []),
                ...(b.unexplored ?? []),
            ]
            : undefined,
        (a.unavailableCriticalExtensions || b.unavailableCriticalExtensions),
        (a.unknownErrors?.length || b.unknownErrors?.length)
            ? [
                ...(a.unknownErrors ?? []),
                ...(b.unknownErrors ?? []),
            ]
            : undefined,
        // We remove the query reference, since it probably does not apply to
        // this DSA. (Remember: this function is called from merging results.)
        undefined,
        a.overspecFilter ?? b.overspecFilter,
        (a.notification?.length || b.notification?.length)
            ? [
                ...(a.notification ?? []),
                ...(b.notification ?? []),
            ]
            : undefined,
        undefined,
    );
}

export default mergePOQ;
