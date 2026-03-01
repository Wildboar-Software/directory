import type { Context } from "../types/index.js";
import type { TraceItem } from "@wildboar/x500/DistributedOperations";
import type { Name, RelativeDistinguishedName as RDN } from "@wildboar/x500/InformationFramework";
import { getNamingMatcherGetter } from "../x500/getNamingMatcherGetter.js";
import { compareDistinguishedName, type EqualityMatcher } from "@wildboar/x500";
import type { OBJECT_IDENTIFIER } from "@wildboar/asn1";

function getTraceKeyFromRDN(rdn: RDN): string {
    if (rdn.length === 1) {
        return rdn[0].type_.toString();
    }
    const rdn2 = [ ...rdn ];
    rdn2.sort((a, b) => {
        const astr = a.type_.toString();
        const bstr = b.type_.toString();
        return astr < bstr ? -1 : astr > bstr ? 1 : 0;
    });
    return rdn2.map((rdn) => rdn.type_.toString()).join("+");
}

/* This will be the same for DNs having the same length and
same attribute types in each RDN. */
function getTraceKeyFromName(name: Name): string {
    const rdns = name.rdnSequence;
    return rdns.map((rdn) => getTraceKeyFromRDN(rdn)).join(",");
}

function getTraceKey(trace: TraceItem): string {
    return (
        trace.operationProgress.nameResolutionPhase
        + "%"
        + (trace.operationProgress.nextRDNToBeResolved ?? "?")
        + "%"
        + getTraceKeyFromName(trace.dsa)
        + (trace.targetObject
            ? ("%" + getTraceKeyFromName(trace.targetObject))
            : ""
        )
    );
}

const MAX_GROUP_SIZE = 10;

function checkForDuplicatesInMatchableGroup(
    group: TraceItem[],
    namingMatcher: (attributeType: OBJECT_IDENTIFIER) => EqualityMatcher | undefined,
): boolean {
    // To prevent denial of service. If there are more than ten trace items
    // all having the same operation progress and similar DNs, it is already
    // suspicious.
    if (group.length > MAX_GROUP_SIZE) {
        return true;
    }
    for (let i = 0; i < group.length; i++) {
        const target1 = group[i].targetObject;
        for (let j = i + 1; j < group.length; j++) {
            const match_dsa = compareDistinguishedName(
                group[i].dsa.rdnSequence,
                group[j].dsa.rdnSequence,
                namingMatcher,
            );
            if (match_dsa) {
                return true;
            }
            const target2 = group[j].targetObject;
            if (target1 && target2) {
                const match_target = compareDistinguishedName(
                    target1.rdnSequence,
                    target2.rdnSequence,
                    namingMatcher,
                );
                if (match_target) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * @summary Detects loops using `TraceInformation`
 * @description
 *
 * Uses the procedures outlined in ITU Recommendation X.518, Section 15.4 to
 * detect loops through the use of `TraceInformation` taken from
 * `ChainingArguments`.
 *
 * @param ctx The context object.
 * @param trace The trace items detailing the history of distributed
 *  operations as they travel between DSAs.
 * @returns {boolean} `true` if a loop was detected; `false` if one was not.
 */
export
function isLoopDetected(
    ctx: Context,
    trace: TraceItem[],
): boolean {
    if (trace.length <= 1) {
        return false; // Not possible.
    }
    const traceKeys = new Map<string, TraceItem[]>();
    let matchableGroups: TraceItem[][] = [];

    /* Sort trace items into groups that have the same
    operation progress, and DNs of same length and name forms. */
    for (const item of trace) {
        const key = getTraceKey(item);
        const existing = traceKeys.get(key);
        if (existing) {
            existing.push(item);
            if (existing.length === 2) {
                matchableGroups.push(existing);
            }
        } else {
            traceKeys.set(key, [ item ]);
        }
    }
    if (matchableGroups.length === 0) {
        return false;
    }
    const namingMatcher = getNamingMatcherGetter(ctx);
    for (const group of matchableGroups) {
        if (checkForDuplicatesInMatchableGroup(group, namingMatcher)) {
            return true;
        }
    }
    return false;
}

export default isLoopDetected;
